

- [About](#about)
- [How to Use](#how-to-use)
- [Tech](#tech)
- [Markdown Breakdown](#markdown-breakdown)
  - [Markdown Article Formatting](#markdown-article-formatting)
  - [Example](#example)
- [Links](#links)
- [When we generate](#when-we-generate)
- [Example Process:](#example-process)
  
## About
Static website. KISS DICE.

NodeJS stack. Write markdown. Publish formatted html with images and code snippets. Breadcrumb navigation. KISS DICE.


> “Keep It Stupidly Simple.” 

> "Documented, Isolated, Configurable, Efficient"

## How to Use

```sh

```

## Tech

1. Markdown: Content formatting.
2. NodeJS: Automation and static site generation.
3. NPM: JS dependencies.
4. AWS: Hosting with S3, SDK and CLI for operations.
5. Git: Version control.
6. VSCode: Editting text.

## Markdown Breakdown

### Markdown Article Formatting

Title from (#)
Date - Wordcount - Estimated Read Time' (how to deliniate)
tl;dr (how to deliniate)
Article Body  (standard markdown formatting)
Tags
Copyright (static)

### Example
~ ~/archive ~/tags ~/about
Hello World
Oct 1, 2023 - 420 words - (words / 230) minutes
A bunch of words and text that make up the article with formatting for codeblocks and markdown
C Copyright 2023 - MaxwellVolz

## Links

~ : homepage, root - shows 3 latest articles with tl;dr
~/archive : all articles in list in order by time, grouped by year (year as subheading), with tags
~/tags: all tags from articles listed alphabetically, selecting a tag opens archive/tags/{tag}, all articles with tag in list in order by time, grouped by year, with tags
~/about : personal page, has top section with logo

## When we generate

1. all markdown in /articles should be parsed into a clean data structure
2. each page will be generated in entirety within its own function using the json from articles
   1. uses a template .html file for general page formatting


## Example Process:

1. For each .html in /pages
   1. Find and Replace "<!-- INSERT: head -->" with /components/head.html
   2. Find and Replace "<!-- INSERT: foot -->" with /components/foot.html
2. For each .md in /articles
   1. if article contains "@@Tags: video"
      1. atleast one tag required, multiple will be separated by a commas
   2. and article contains "@@Date: 10/24/23"
      1. format is as shown
   3. then parse the markdown data for tags and archive pages
3. For Tags Page
   1. Find and Replace "<!-- INSERT: tags -->" with a collection of divs like <a href="/tags/video/index.html">video (3)</a>
   2. create tags pages by replacing <!-- INSERT: content --> from archive.html in appropiate locations
   3. tags pages will list all articles
4. For Archive
   1. Find and Replace <!-- INSERT: content --> from archive.html with links to articles ordered by date and grouped by year

The follow page structure should exist:

/index.html
/archive/index.html - article link and tldr, ordered by date and grouped by year
/archive/2023/article-name-with-dashes/index.html - 

