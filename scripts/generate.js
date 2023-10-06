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
import { generateBreadcrumb, formatDateToHumanReadable, monthNumberToName, generateArchiveHtmlgenerateArchiveHtml, groupPostsByYearAndMonth } from './util.js';

const md = new MarkdownIt();
const inputDir = path.join(process.cwd(), '/articles');
const outputDir = path.join(process.cwd(), '/dist');

async function writeHtmlFile(filePath, content) {
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Generated: ${filePath}`);
}

function parseFileName(fileName) {
    const [title, month, day, year] = fileName.split('_');
    const fullYear = year.length === 2 ? `20${year}` : year; // Ensure the year is in 4-digit format
    return {
        year: fullYear,
        month: parseInt(month, 10),
        day: parseInt(day, 10),
        title
    };
}

async function generateArticles() {
    const articleFileNames = await fs.readdir(inputDir);
    const allPosts = [];

    for (const fileName of articleFileNames) {
        const articlePath = path.join(inputDir, fileName);
        const markdownContent = await fs.readFile(articlePath, 'utf-8');

        // Get metadata from the file name
        const { year, month, day, title } = parseFileName(fileName);

        const breadcrumb = generateBreadcrumb(year, month, day, title);

        const date = new Date(year, month - 1, day);
        const humanReadableDate = formatDateToHumanReadable(date);


        // Convert markdown to HTML
        const htmlContent = md.render(markdownContent);

        const articleHtml = `
            ${breadcrumb}
            <h2>${title}</h2>
            <span>${humanReadableDate}</span>
            <div>
                ${htmlContent}
            </div>
        `;

        // Write the article HTML to the output directory
        const articleOutputPath = path.join(outputDir, String(year), String(month), title, 'index.html');
        await writeHtmlFile(articleOutputPath, articleHtml);

        // Collect post info for archive and homepage
        allPosts.push({ year, month, day, title, articleOutputPath });
    }

    // Group posts by year and month, then generate archive pages
    const groupedPosts = groupPostsByYearAndMonth(allPosts);
    for (const [year, months] of Object.entries(groupedPosts)) {
        for (const [month, posts] of Object.entries(months)) {
            const archiveHtml = generateArchiveHtml(posts);
            const archiveOutputPath = path.join(outputDir, year, month, 'index.html');
            await writeHtmlFile(archiveOutputPath, archiveHtml);
        }
    }
}


async function updateHomepage() {
    // Placeholder: implement this function to update the homepage with the 5 most recent articles
}

async function main() {
    await penguinRandomHouse();
    await updateHomepage();
}

// Run the main function
main().catch(err => {
    console.error('An error occurred:', err);
});
