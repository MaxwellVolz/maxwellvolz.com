import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

// Get the current file's URL and convert it to a directory path
const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);

// Navigate to the parent directory of the current directory
const parentDir = dirname(currentDir);

// Specify the 'articles' folder path relative to the parent directory
const articlesFolder = join(parentDir, 'articles');

function parseMarkdownFile(filePath) {
    // Read the Markdown file
    const markdownContent = readFileSync(filePath, 'utf-8');

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

function convertDate(dateString) {
    const [month, day, year] = dateString.split('/').map(part => part.trim());

    // Assuming that the year is in 2-digit format, we convert it to 4-digit format
    const fullYear = year.length === 2 ? `20${year}` : year;

    // Define an array of month names
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Get the month name based on the month number (assuming 1-based index)
    const monthName = monthNames[parseInt(month, 10) - 1];

    // Construct the formatted date string
    return `${monthName} ${day}, ${fullYear}`;
}


// Example usage: Loop through all Markdown files in the 'articles' folder above the current directory
const articleFiles = readdirSync(articlesFolder);

for (const fileName of articleFiles) {
    if (fileName.endsWith('.md')) {
        const filePath = join(articlesFolder, fileName);
        const articleData = parseMarkdownFile(filePath);
        console.log(articleData);
    }
}