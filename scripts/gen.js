// gen.js

import fs from 'fs/promises';
import path from 'path';
import { parseMarkdownFile, writeHtmlFile, readAndReplace, formatDate, generateHeader } from './util.js';

const inputDir = path.join(process.cwd(), '/articles');
const outputDir = path.join(process.cwd(), '/dist');
const indexPath = path.join(process.cwd(), '/www/index.html');

let allPosts = []

const header_placeholder = "<!-- Header will go here -->"

async function generateArticles(tagsMap, articlesArray) {  // Renamed tagsSet to tagsMap
    const articleFileNames = await fs.readdir(inputDir);

    for (const fileName of articleFileNames) {
        const articlePath = path.join(inputDir, fileName);
        const { htmlContent, title, tags, date, tl_dr } = await parseMarkdownFile(articlePath);

        const [month, day, year] = date.split('/').map(part => part.trim());
        const fullYear = year.length === 2 ? `20${year}` : year;
        const yearDir = path.join(outputDir, 'posts', fullYear);

        tags.forEach(tag => {
            if (!tagsMap.has(tag)) {
                tagsMap.set(tag, 0);  // Initialize if the tag doesn't exist
            }
            tagsMap.set(tag, tagsMap.get(tag) + 1);  // Increment the count
        });

        articlesArray.push({
            year: fullYear,
            date: `${month}/${day}`,
            fullDate: new Date(fullYear, month - 1, day),
            title,
            tags
        });

        const outputPath = path.join(yearDir, `${title.replace(/ /g, "-")}.html`);

        // Create directory if it doesn't exist
        await fs.mkdir(yearDir, { recursive: true });
        await writeHtmlFile(outputPath, htmlContent);

        allPosts.push({ fullYear, title, date, tags, tl_dr });
    }

    await updateHomepage(allPosts);
}


async function generateArchiveIndex(articlesArray) {
    const headerHtml = generateHeader();
    articlesArray.sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate));

    let lastYear = null;
    let archiveHtml = '<section id="archive">';
    let yearGroupOpen = false;

    for (const article of articlesArray) {
        if (lastYear !== article.year) {
            if (yearGroupOpen) {
                archiveHtml += '</div>';  // Close previous year-group if any
            }
            archiveHtml += '<div class="group">';  // Open a new year-group
            archiveHtml += `<h3 class="year-group">${article.year}</h3>`;
            lastYear = article.year;
            yearGroupOpen = true;
        }

        const articleLink = `/posts/${article.year}/${article.title.replace(/ /g, '-')}.html`;

        let tagsHtml = '';
        article.tags.forEach(tag => {
            tagsHtml += `<a href="/tags/${tag}">${tag}</a> `;
        });

        archiveHtml += `
        <div class="headline">
            <div class="date">${formatDate(article.date)}</div> 
            <div class="title">
                <a href="${articleLink}">${article.title}</a> 
            </div> 
            <div class="tags">
                ${tagsHtml}
            </div>
        </div> 
        `;
    }

    if (yearGroupOpen) {
        archiveHtml += '</div>';  // Close the last year-group
    }

    archiveHtml += '</section>'

    const placeholder = '<!-- Recent posts will go here -->';
    let archiveContent = await readAndReplace('www/index.html', placeholder, archiveHtml);
    archiveContent = archiveContent.replace(header_placeholder, headerHtml);

    await writeHtmlFile('dist/archive/index.html', archiveContent);
}

async function generateTagsIndex(tagsMap) {
    let tagsHtml = '<section id="tags">'
    tagsHtml += Array.from(tagsMap.entries())
        .map(([tag, count]) => `<span class="tag"><a href="/tags/${tag}/">${tag} (${count})</a></span>`)
        .join('\n');
    tagsHtml += '</section>'

    const placeholder = '<!-- Recent posts will go here -->';
    const tagsIndexContent = await readAndReplace('www/index.html', placeholder, tagsHtml);
    await writeHtmlFile('dist/tags/index.html', tagsIndexContent);
}

async function generateTagPages(tagsMap) {  // Added tagsMap as a parameter
    const headerHtml = generateHeader();

    for (const post of allPosts) {
        for (const tag of post.tags) {
            if (!tagsMap.has(tag)) {
                tagsMap.set(tag, 0);  // Initialize if the tag doesn't exist
            }
            tagsMap.set(tag, tagsMap.get(tag) + 1);  // Increment the count
        }
    }

    for (const [tag, posts] of Object.entries(tagsMap)) {
        let tagHtml = "<h1>Articles tagged with " + tag + "</h1>";
        for (const post of posts) {
            // console.log(`Debug: post.fullYear: ${post.fullYear}`);

            tagHtml += `
                <div>
                    <a href="/posts/${post.fullYear}/${post.title.replace(/ /g, '-')}.html">${post.title}</a>
                </div>`;
        }
        const tagPagePath = path.join(outputDir, 'tags', `${tag.replace(/ /g, '-')}.html`);
        await fs.mkdir(path.dirname(tagPagePath), { recursive: true });
        await writeHtmlFile(tagPagePath, tagHtml);
    }
}

async function generateAboutPage() {
    const { htmlContent } = await parseMarkdownFile('www/about.md');

    const headerHtml = generateHeader();

    let aboutPageHtml = await fs.readFile('www/about.html', 'utf-8');
    aboutPageHtml = aboutPageHtml.replace("<!-- Header will go here -->", headerHtml);
    aboutPageHtml = aboutPageHtml.replace("<!-- About content will go here -->", htmlContent);

    await writeHtmlFile('dist/about/index.html', aboutPageHtml);
}


async function updateHomepage() {

    const headerHtml = generateHeader();

    let latestPostsHtml = "<div id='list-page'>";
    const latestPosts = allPosts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

    for (const post of latestPosts) {
        let tagLinks = post.tags.map(tag => `<a href="/tags/${tag.replace(/ /g, '-')}/">${tag}</a>`).join(", ");
        console.log(post)
        const [month, day, year] = post.date.split('/').map(Number);
        const date = new Date(Date.UTC(year + 2000, month - 1, day));
        let isoString = date.toISOString().replace(/\.\d{3}Z$/, '');
        isoString += " +0000 UTC";

        latestPostsHtml += `
            <div class="headline">
                <h2 class="title">
                <a href="/posts/${post.fullYear}/${post.title.replace(/ /g, '-')}.html">${post.title}</a>
                </h2>
                <div class="date">
                <time datetime="${isoString}">${post.date}</time>
                
                </div>
                <div class="summary">${post.tl_dr}</div>

            </div>
        `;
        // Tags: ${tagLinks}

    }
    latestPostsHtml += "</div>";

    // Read the www/index.html file and replace the placeholder with the latest posts
    let homepageHtml = await fs.readFile(path.join(process.cwd(), 'www', 'index.html'), 'utf-8');
    homepageHtml = homepageHtml.replace("<!-- Recent posts will go here -->", latestPostsHtml);
    homepageHtml = homepageHtml.replace(header_placeholder, headerHtml);

    await writeHtmlFile(path.join(outputDir, 'index.html'), homepageHtml);
}

async function copyStyles() {
    try {
        // Copy style.css to /dist
        await fs.copyFile('www/style.css', 'dist/style.css');

        // Create the /dist/css directory if it doesn't exist
        await fs.mkdir('dist/css', { recursive: true });

        // Copy all files from css/ to /dist/css
        const files = await fs.readdir('css');
        for (const file of files) {
            const sourcePath = path.join('css', file);
            const destPath = path.join('dist/css', file);
            await fs.copyFile(sourcePath, destPath);
        }

        console.log('Styles copied successfully.');
    } catch (err) {
        console.error(`Failed to copy styles: ${err}`);
    }
}

async function main() {
    const tagsMap = new Map();  // Changed from Set to Map
    const articlesArray = [];

    await generateArticles(tagsMap, articlesArray);  // Adjusted function name and arguments as needed
    await generateArchiveIndex(articlesArray);
    await generateTagsIndex(tagsMap);
    await generateTagPages(tagsMap);  // Pass tagsMap as argument
    await generateAboutPage();
    await updateHomepage();
    await copyStyles();
}

main().catch(err => {
    console.error('An error occurred:', err);
});