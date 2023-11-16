
// Parse article data to convenient data structure that will be passed to: 
// 
// articles.js - handles creating directory and formatting
// tags.js - handles parsing article data to tag data
// 
// 

import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import { formatDate } from './util.js';

// Initialize MarkdownIt parser
const md = new MarkdownIt();
const inputDir = path.join(process.cwd(), '/articles');
const outputDir = path.join(process.cwd(), '/dist');

// Function to read markdown files from a directory
function readArticlesFromDirectory(directory) {
  const files = fs.readdirSync(directory);
  return files.filter(file => path.extname(file) === '.md').map(file => {
    const filePath = path.join(directory, file);
    const content = fs.readFileSync(filePath, 'utf8');
    return parseArticle(content);
  });
}

// Function to parse markdown content
function parseArticle(content) {
  const metadata = {};
  const lines = content.split('\n');
  let body = '';
  let readingMetadata = true;
  lines.forEach(line => {
    if (readingMetadata) {
      if (line.startsWith('@@')) {
        const [key, value] = line.substring(2).split(':').map(s => s.trim());
        metadata[key.toLowerCase()] = value;
      } else {
        readingMetadata = false;
      }
    }
    if (!readingMetadata) {
      body += line + '\n';
    }
  });
  return {
    metadata,
    body: md.render(body)
  };
}

function sortArticlesByDate(articles) {
  return articles.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));
}

function filterArticlesByDate(articles, year, month) {
  return articles.filter(article => {
    const date = new Date(article.metadata.date);
    if (month) {
      return date.getFullYear() === parseInt(year, 10) && date.getMonth() === new Date(`${year}-${month}-01`).getMonth();
    }
    return date.getFullYear() === parseInt(year, 10);
  });
}

function createDirectoriesForArticles(articles) {
  articles.forEach(article => {
    const date = new Date(article.metadata.date);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const dir = path.join(outputDir, year.toString(), month);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function printDirectoryStructure() {
  const dirs = fs.readdirSync(outputDir);
  console.log('Directory Structure:');
  dirs.forEach(year => {
    const yearDir = path.join(outputDir, year);
    if (fs.lstatSync(yearDir).isDirectory()) {
      const monthDirs = fs.readdirSync(yearDir);
      console.log(`- ${year}`);
      monthDirs.forEach(month => {
        const monthDir = path.join(yearDir, month);
        if (fs.lstatSync(monthDir).isDirectory()) {
          const articleFiles = fs.readdirSync(monthDir);
          console.log(`  - ${month}`);
          articleFiles.forEach(articleFile => {
            const articlePath = path.join(monthDir, articleFile);
            if (fs.lstatSync(articlePath).isFile() && path.extname(articleFile) === '.html') {
              console.log(`    - ${articleFile}`);
            }
          });
        }
      });
    }
  });
}

function generateIndexPage(articles) {
  const recentArticles = articles.slice(0, 5); // assuming articles are already sorted by date
  let listItems = '';

  recentArticles.forEach(article => {
    const { title, url, date } = article.metadata;
    const year = new Date(date).getFullYear();
    const month = new Date(date).toLocaleString('default', { month: 'long' });
    const modifiedUrl = path.join(year.toString(), month, url);

    console.log(modifiedUrl)

    listItems += `<li><a href="/${modifiedUrl}.html">${article.metadata.title}</a></li>`;
  });

  const indexContent = `<html>
<head><title>Homepage</title></head>
<body>
  <h1>Recent Articles</h1>
  <ul>
    ${listItems}
  </ul>
</body>
</html>`;
  fs.writeFileSync(path.join(outputDir, 'index.html'), indexContent, 'utf8');
}

function writeHTMLFiles(articles) {
  articles.forEach(article => {
    const { title, url, date } = article.metadata;
    const formattedDate = formatDate(date);
    const htmlContent = `<html>
<head>
  <title>${title}</title>
</head>
<body>
  <h1>${title}</h1>
  <p>${formattedDate}</p>
  ${article.body}
</body>
</html>`;
    const year = new Date(date).getFullYear();
    const month = new Date(date).toLocaleString('default', { month: 'long' });
    const dir = path.join(outputDir, `${year}`, `${month}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Modify the url property to include the year and month directories
    // const modifiedUrl = path.join(year.toString(), month, url);
    const outputFilePath = path.join(dir, `${url}.html`);

    console.log(outputFilePath)
    fs.writeFileSync(outputFilePath, htmlContent, 'utf8');
  });
}

// Update the existing generateSite function to include the new functionalities
function generateSite() {
  let articles = readArticlesFromDirectory(inputDir);

  articles = sortArticlesByDate(articles);

  createDirectoriesForArticles(articles);

  printDirectoryStructure();

  generateIndexPage(articles);

  writeHTMLFiles(articles);
  printDirectoryStructure();
  // console.log(articles[0])

}

generateSite();
