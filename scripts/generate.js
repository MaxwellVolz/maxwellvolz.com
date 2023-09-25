/**
 * This script employs an asynchronous paradigm using Promises for reading and writing files.
 * This makes controlling the flow of the program more straightforward.
 * 
 * The function penguinRandomHouse() handles the processing of each Markdown post file.
 * 
 * www/index.html contains the boilerplate for the website layout. Each article is 
 * constructed of markdown to HTML inside this boilerplate.
 * 
 * Breadcrumb navigation exists at the top of each article and is generated.
 * 
 * /maxwellvolz.com/ - homepage with 5 most recent articles
 * /maxwellvolz.com/2023 - all articles in 2023
 * /maxwellvolz.com/2023/September - all articles in 2023 in september
 * /maxwellvolz.com/2023/September/suh - single article
 * 
 *
 * `main()` function acts as the orchestrator that runs `penguinRandomHouse()` and
 * `updateHomepage()` in sequence.
 * 
 * 
 * 
 */

import fs from 'fs/promises';
import path from 'path';
import MarkdownIt from 'markdown-it';
import { parseFileName, generateBreadcrumb, formatDateToHumanReadable, monthNumberToName, generateArchiveHtml, groupPostsByYearAndMonth } from './util.js';

const md = new MarkdownIt();
const inputDir = path.join(process.cwd(), '/articles');
const outputDir = path.join(process.cwd(), '/dist');

async function writeHtmlFile(filePath, content) {
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Generated: ${filePath}`);
}

async function generatePosts() {
    const files = await fs.readdir(inputDir);
    let allPosts = [];
    let recentPosts = [];


    const postPromises = files.filter(file => path.extname(file) === '.md').map(async file => {
        const filePath = path.join(inputDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const parsedInfo = parseFileName(path.basename(file, '.md'));

        const result = md.render(data);
        const breadcrumb = generateBreadcrumb(parsedInfo);

        const articleContent = `<main><div class="article">${result}</div></main>`;
        const fullHTML = await wrapContentWithLayout(breadcrumb + articleContent);

        // Create a nested directory structure to match breadcrumb
        const nestedDir = path.join(outputDir, parsedInfo.year.toString(), parsedInfo.month.toString());

        await fs.mkdir(nestedDir, { recursive: true });

        const outputFilePath = path.join(nestedDir, `${parsedInfo.title}.html`);
        await writeHtmlFile(outputFilePath, fullHTML);

        const date = new Date(parsedInfo.year, parsedInfo.month - 1, parsedInfo.day);
        const formattedDate = formatDateToHumanReadable(date);
        const postObject = {
            year: parsedInfo.year,
            month: parsedInfo.month,
            title: parsedInfo.title,
            link: `/${parsedInfo.year}/${parsedInfo.month}/${parsedInfo.title}.html`
        };

        allPosts.push(postObject);
        recentPosts.push(postObject);
    });

    await Promise.all(postPromises);

    // return recentPosts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    return {
        recentPosts: recentPosts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
        allPosts
    };
}

async function updateHomepage(recentPosts) {
    const indexPath = path.join(process.cwd(), '/www/index.html');
    const outputIndexPath = path.join(outputDir, '/index.html');
    const data = await fs.readFile(indexPath, 'utf8');

    const recentPostsHTML = recentPosts.map(post => `
        <div class="post" >
          <a href="${post.link}">
            <h2>${post.title}</h2>
          </a>
          <p>${post.date}</p>
        </div>
    `).join('');

    const newHomePageHTML = data.replace('<!-- Recent posts will go here -->', recentPostsHTML);
    await writeHtmlFile(outputIndexPath, newHomePageHTML);
}

async function copyStyles() {
    const sourcePath = path.join(process.cwd(), '/www/style.css');
    const destinationPath = path.join(process.cwd(), '/dist/style.css');
    await fs.copyFile(sourcePath, destinationPath);
    console.log('styles.css copied to /dist');
}

async function wrapContentWithLayout(content) {
    const layout = await fs.readFile(path.join(process.cwd(), '/www/index.html'), 'utf8');
    return layout.replace('<!-- Content will go here -->', content);
}

async function generateArchivePage(allPosts) {
    const groupedByYear = groupPostsByYearAndMonth(allPosts);

    for (const [year, months] of Object.entries(groupedByYear)) {
        const yearDir = path.join(outputDir, year);
        await fs.mkdir(yearDir, { recursive: true });

        const yearBreadcrumb = generateBreadcrumb({ year }); // Assuming your breadcrumb function is updated
        let yearHtml = `${yearBreadcrumb}<h1>${year}</h1>`;

        for (const [month, posts] of Object.entries(months)) {
            const monthDir = path.join(yearDir, month);
            await fs.mkdir(monthDir, { recursive: true });

            const monthName = monthNumberToName(parseInt(month));
            yearHtml += `<h2><a href="/${year}/${month}/">${monthName}</a></h2>`;
            yearHtml += '<ul>';

            const monthBreadcrumb = generateBreadcrumb({ year, month }); // Assuming your breadcrumb function is updated
            let monthHtml = `${monthBreadcrumb}<h1>${monthName}</h1><ul>`;

            posts.forEach(post => {
                yearHtml += `<li><a href="/${post.year}/${post.month}/${post.title}.html">${post.title}</a></li>`;
                monthHtml += `<li><a href="/${post.year}/${post.month}/${post.title}.html">${post.title}</a></li>`;
            });

            yearHtml += '</ul>';
            monthHtml += `</ul>`;
            await writeHtmlFile(path.join(monthDir, 'index.html'), monthHtml);
        }

        await writeHtmlFile(path.join(yearDir, 'index.html'), yearHtml);
    }
}

async function main() {
    try {
        await copyStyles();
        const { recentPosts, allPosts } = await generatePosts();
        await updateHomepage(recentPosts);
        await generateArchivePage(allPosts);
    } catch (err) {
        console.error(err);
    }
}

main();
