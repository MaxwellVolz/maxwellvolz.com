/**
 * This script employs an asynchronous paradigm using Promises for reading and writing files.
 * This makes controlling the flow of the program more straightforward.
 * 
 * 
 * /maxwellvolz.com/ - homepage with 5 most recent articles
 * /maxwellvolz.com/2023 - all articles in 2023
 * /maxwellvolz.com/2023/September - all articles in 2023 in September
 * /maxwellvolz.com/2023/September/suh - single article
 * 
 * 
 * The function penguinRandomHouse() handles the processing of each article written in markdown.
 * Breadcrumb navigation exists at the top of each article that is generated.
 * 
 *
 * `main()` function acts as the orchestrator that runs `penguinRandomHouse()` and
 * `updateHomePage()` in sequence.
 * 
 * 
 * 
 */

import fs from 'fs/promises';
import path from 'path';
import MarkdownIt from 'markdown-it';
import { generateBreadcrumb, formatDate, groupPostsByYearAndMonth } from './util.js';

const md = new MarkdownIt();
const inputDir = path.join(process.cwd(), '/articles');
const outputDir = path.join(process.cwd(), '/dist');

async function writeHtmlFile(filePath, content) {
    await fs.writeFile(filePath, content, 'utf8');
    // console.log(`Generated: ${filePath}`);
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

function parseMarkdownFile(filePath) {
    // Read the Markdown file
    const markdownContent = fs.readFileSync(filePath, 'utf-8');

    // Split the Markdown content by lines
    const lines = markdownContent.split('\n');

    // Initialize variables for extracting information
    let title = ''; // Initialize title
    let date = ''; // Initialize date
    let wordCount = 0; // Initialize wordCount
    let estimatedReadTime = 0; // Initialize estimatedReadTime
    let tlDr = ''; // Initialize tlDr
    let articleBody = ''; // Initialize articleBody
    let tags = []; // Initialize tags

    // Loop through the lines to extract information
    for (const line of lines) {
        // Extract the title from the first heading
        if (line.startsWith('# ')) {
            title = line.replace('#', '').trim();
        }
        // Extract the date from the 'Date:' line
        if (line.startsWith('@@Date:')) {
            date = line.replace('@@Date:', '').trim();
            date = convertDate(date);
        }
        // Extract the tl;dr from the 'tl;dr:' line
        if (line.startsWith('tl;dr:')) {
            tlDr = line.replace('tl;dr:', '').trim();
        }
        // Extract tags from the 'Tags:' line
        if (line.startsWith('@@Tags:')) {
            tags = line.replace('@@Tags:', '').split(',').map(tag => tag.trim());
        }
        // Calculate the word count based on article body
        articleBody += line + '\n'; // Reconstruct the article body
        wordCount = articleBody.split(/\s+/).filter(Boolean).length; // Count words
    }

    // Calculate the estimated reading time based on word count (using a formula)
    estimatedReadTime = `${wordCount} words - (${Math.ceil(wordCount / 230)} minutes)`;

    // Return the extracted information as an object
    return {
        title,
        date,
        wordCount,
        estimatedReadTime,
        tlDr,
        articleBody,
        tags,
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
        const humanReadableDate = formatDate(date);

        // Use the parseMarkdownFile function to extract article data
        const articleData = parseMarkdownFile(articlePath);

        // Convert markdown to HTML
        const htmlContent = md.render(articleData.articleBody);

        const articleHtml = `
            ${breadcrumb}
            <h2>${articleData.title}</h2>
            <span>${articleData.date}</span>
            <div>
                ${htmlContent}
            </div>
        `;

        // Write the article HTML to the output directory
        const articleOutputPath = path.join(outputDir, String(year), String(month), title, 'index.html');
        await writeHtmlFile(articleOutputPath, articleHtml);

        // Collect post info for archive and homepage
        allPosts.push({
            year,
            month,
            day,
            title: articleData.title,
            articleOutputPath,
        });
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


/**
 * Updates the homepage with the 5 most recent articles.
 * 
 * This function performs the following steps:
 * 
 * 1. Specifies the number of recent articles to display on the homepage using the
 *    `numRecentArticles` variable.
 * 
 * 2. Constructs the path to the homepage HTML file.
 * 
 * 3. Reads the existing content of the homepage HTML file.
 * 
 * 4. Sorts the list of all posts by date in descending order to get the most recent
 *    posts first.
 * 
 * 5. Selects the specified number of most recent posts from the sorted list.
 * 
 * 6. Generates HTML for the recent articles section by mapping each recent post to an
 *    HTML block.
 * 
 * 7. Replaces a placeholder "<!-- INSERT: recent-articles -->" in the homepage HTML
 *    content with the generated recent articles HTML.
 * 
 * 8. Writes the updated homepage content back to the file.
 * 
 * Any errors encountered during the process are logged to the console.
 */
async function updateHomePage() {
    const numRecentArticles = 5; // Number of recent articles to display
    const homepagePath = path.join(outputDir, 'index.html');

    try {
        // Read the existing homepage HTML content
        let homepageContent = await fs.readFile(homepagePath, 'utf-8');

        // Sort the list of all posts by date in descending order (most recent first)
        const sortedPosts = allPosts.slice().sort((a, b) => {
            const dateA = new Date(`${a.year}-${a.month}-${a.day}`);
            const dateB = new Date(`${b.year}-${b.month}-${b.day}`);
            return dateB - dateA;
        });

        // Take the 5 most recent posts
        const recentPosts = sortedPosts.slice(0, numRecentArticles);

        // Generate HTML for the recent articles section
        const recentArticlesHtml = recentPosts.map(post => `
            <div class="recent-article">
                <h3><a href="${post.articleOutputPath}">${post.title}</a></h3>
                <p>${post.year}-${post.month}-${post.day}</p>
            </div>
        `).join('');

        // Replace a placeholder in the homepage HTML with the recent articles HTML
        homepageContent = homepageContent.replace('<!-- INSERT: recent-articles -->', recentArticlesHtml);

        // Write the updated homepage content back to the file
        await fs.writeFile(homepagePath, homepageContent, 'utf-8');
        console.log('Updated homepage with recent articles');
    } catch (error) {
        console.error('An error occurred while updating the homepage:', error);
    }
}


/**
 * Updates HTML files in the /pages directory by replacing specific placeholders
 * with the contents of head and foot templates.
 * 
 * For each HTML file in /pages, this function performs the following steps:
 * 
 * 1. Reads the contents of the head and foot templates from /components/head.html
 *    and /components/foot.html, respectively.
 * 
 * 2. Identifies and replaces the placeholder "<!-- INSERT: head -->" in the HTML file
 *    with the contents of the head template.
 * 
 * 3. Replaces the placeholder "<!-- INSERT: foot -->" in the HTML file
 *    with the contents of the foot template.
 * 
 * 4. Writes the updated content back to the HTML file.
 * 
 * Any errors encountered during the process are logged to the console.
 */
async function penguinRandomHouse() {
    const pagesDir = path.join(process.cwd(), '/pages');
    const headTemplatePath = path.join(process.cwd(), '/components/head.html');
    const footTemplatePath = path.join(process.cwd(), '/components/foot.html');

    try {
        // Read the contents of the head and foot templates
        const headTemplate = await fs.readFile(headTemplatePath, 'utf-8');
        const footTemplate = await fs.readFile(footTemplatePath, 'utf-8');

        // Get a list of HTML files in the /pages directory
        const htmlFiles = (await fs.readdir(pagesDir)).filter(file => file.endsWith('.html'));

        for (const htmlFile of htmlFiles) {
            const pagePath = path.join(pagesDir, htmlFile);
            const pageContent = await fs.readFile(pagePath, 'utf-8');

            // Replace <!-- INSERT: head --> with the contents of headTemplate
            const updatedPageContent = pageContent.replace('<!-- INSERT: head -->', headTemplate);

            // Replace <!-- INSERT: foot --> with the contents of footTemplate
            const finalPageContent = updatedPageContent.replace('<!-- INSERT: foot -->', footTemplate);

            // Write the updated content back to the HTML file
            await fs.writeFile(pagePath, finalPageContent, 'utf-8');
            console.log(`Updated: ${pagePath}`);
        }
    } catch (error) {
        console.error('An error occurred while processing HTML files:', error);
    }
}


async function main() {
    await penguinRandomHouse();

    // TODO: For .md(article) in /articles
    // 1. Try to find Tags, "@@Tags: js, web", the tags would be js and web
    // 2. Archive Lists
    //      use existing code to organize articles by month/year

    await updateHomePage();
    // TODO: await updateTagsPage();
    // TODO: await updateArchivesPage();
}

// Run the main function
main().catch(err => {
    console.error('An error occurred:', err);
});
