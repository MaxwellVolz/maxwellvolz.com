

- [About](#about)
- [How to Use](#how-to-use)
- [Tech](#tech)
- [To Implement (TODO)](#to-implement-todo)
- [Pros \& Cons](#pros--cons)
  - [Pros](#pros)
  - [Cons](#cons)
- [Markdown Breakdown](#markdown-breakdown)
- [Markdown Article Formatting](#markdown-article-formatting)
  - [Example](#example)
- [Links](#links)
- [When we generate](#when-we-generate)
  
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


## To Implement (TODO)

- [light-dark css](https://www.bram.us/2023/10/09/the-future-of-css-easy-light-dark-mode-color-switching-with-light-dark/)
- drop-shadow

```css
background-color: #F5A9B8;
border: solid black;
box-shadow: 6px 6px 0px #5BCEFA;
display: inline-block;
padding: 0em 2em;
```

## Pros & Cons

### Pros

1. Speed: Static websites load quickly.
2. Low Maintenance: Static site generators require minimal upkeep.
3. Cost-Effective: S3 hosting is affordable.
4. Scalability: Easy to scale on AWS, everyone knows this!
5. Version Control: Markdown allows easy versioning.
6. Ease of Writing: Markdown simplifies content creation.

### Cons

1. **Limited Functionality:** Real-time interactions or complex server-side logic are not supported.
2. **No CMS:** Content updates may be less user-friendly for non-technical users.
3. **Manual Organization:** Folder management is manual.
4. **SEO:** Dynamic content SEO can be challenging.

## Markdown Breakdown

## Markdown Article Formatting

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
~/about : personal page, has top section with logo and stuff

## When we generate

1. all markdown in /articles should be parsed into a clean data structure
2. each page will be generated in entirety within its own function using the json from articles
   1. uses a template .html file for general page formatting