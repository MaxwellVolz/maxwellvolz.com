
// Sort the articles by their date metadata.
// Filter articles for specific years and months if needed.
// Create the necessary directory structure to house the articles.
// Generate an index page (index.html) for the homepage that lists the 5 most recent articles.

import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import { generateBreadcrumb, formatDate } from './util.js';

// Initialize MarkdownIt parser
const md = new MarkdownIt();
const inputDir = path.join(process.cwd(), '/articles');
const outputDir = path.join(process.cwd(), '/dist');

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

function generateIndexPage(articles) {
  const recentArticles = articles.slice(0, 5); // assuming articles are already sorted by date
  let listItems = '';
  recentArticles.forEach(article => {
    listItems += `<li><a href="/${article.metadata.url}.html">${article.metadata.title}</a></li>`;
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

// Update the existing generateSite function to include the new functionalities
function generateSite() {
  let articles = readArticlesFromDirectory(inputDir);
  articles = sortArticlesByDate(articles);
  createDirectoriesForArticles(articles);
  generateIndexPage(articles);
  writeHTMLFiles(articles);
}

generateSite();
