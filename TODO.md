
# Until we move to Github Issues

## **To-Do List with Time Estimates**

1. **NodeJS Project Setup** - 1 hour
2. **S3 Setup & Config** - 2 hours
3. **Markdown to HTML Script** - 4 hours
4. **Image & Code Handling** - 3 hours
5. **HTML/CSS Templates** - 4 hours
6. **Breadcrumb Nav** - 2 hours
7. **S3 Deployment Script** - 3 hours
8. **Workflow Testing** - 2 hours

Total: ~21 hours

## Random TODOs

- Dev
  - Folder Setup
  - Markdown -> HTML
  - Dependencies
  - Codeblock Copy block
- Design
  - Homepage
  - Navigation
  - Colors
  - Fonts
  - Codeblock Style

1. Breadcrumb Navigation
Integrate breadcrumb navigation in the generated HTML files. This can be done by modifying the result string before writing it to the file.
Time Estimate: 1-2 hours
1. Style Customization
Add a link to a CSS stylesheet in the generated HTML, so the articles have a consistent style.
Time Estimate: 1 hour
1. Image Handling
If your Markdown files reference images, make sure they are moved to the dist folder and that the paths in the HTML are correct.
Time Estimate: 2-3 hours
1. Code Snippets
If your Markdown includes code snippets, you might want to add syntax highlighting through a JavaScript library like PrismJS.
Time Estimate: 1-2 hours
1. File Watcher
Add a file watcher to automatically generate HTML when a Markdown file is added, removed, or modified.
Time Estimate: 2 hours
1. Deploy Script
Write a script to automatically deploy your static website to an S3 bucket on AWS.
Time Estimate: 2-3 hours

4 main pages

~/
~/archive
~/about
~/tags

these will have cooresponding templates in the www/ folder...contents will be markdown
articles will be stored in articles/
current timestamping is great lets stay with that:

directory:
.
./posts
./css
./css/dark.css
./css/light.css
./dist
./dist/index.html
./dist/posts
./dist/posts/2023
./dist/archive
./dist/archive/index.html
./dist/css
./dist/css/dark.css
./dist/css/light.css
./dist/about
./dist/about/index.html
./dist/tags
./dist/tags/python.html
./dist/tags/index.html
./dist/tags/nodejs.html
./dist/tags/js.html
./dist/tags/py.html
./dist/style.css
./articles
./articles/hello_world_2.md
./articles/blur_object.md
./articles/hello_python.md
./articles/hello_python_again.md
./articles/hello_js.md
./TODO.md
./www
./www/index.html
./www/about.html
./www/article.html
./www/style.css
./www/_oldstyle.css
./www/about.md
./README.md
./.gitignore
./package-lock.json
./package.json
./old_dist
./old_dist/2023
./old_dist/2023/index.html
./old_dist/2023/9
./old_dist/index.html
./old_dist/style.css
./scripts
./scripts/util.js
./scripts/generate.js
./scripts/gen.js
./scripts/deploy.js


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
    const headerHtml = generateHeader();

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

        let articleHtml = await fs.readFile('www/article.html', 'utf-8');
        articleHtml = articleHtml.replace("<!-- Header will go here -->", headerHtml);
        articleHtml = articleHtml.replace("<!-- Article content will go here -->", htmlContent);

        await writeHtmlFile(outputPath, articleHtml);



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