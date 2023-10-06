// util.js

import fs from 'fs/promises';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

async function readAndReplace(filePath, placeholder, newContent) {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return fileContent.replace(placeholder, newContent);
}

function formatDate(dateString) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString);
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
}

async function parseMarkdownFile(filePath) {
    const markdownContent = await fs.readFile(filePath, 'utf-8');
    let title = "";
    let tags = [];
    let date;
    let tl_dr = "";

    const lines = markdownContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('# ') && !title) {
            title = line.substring(2);
        }
        if (line.startsWith('## Tags:')) {
            tags = line.substring(8).split(',').map(tag => tag.trim());
        }
        if (line.startsWith('## Date:')) {
            date = line.substring(8).trim();
        }

        if (line.startsWith('## tl;dr:')) {
            tl_dr = line.substring(9).trim();
        }
        else {
            tl_dr = "Just read it lol"
        }
    }

    const htmlContent = md.render(markdownContent);
    return { htmlContent, title, tags, date, tl_dr };
}

async function writeHtmlFile(filePath, content) {
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Generated: ${filePath}`);
}


function generateHeader() {
    return `
    <header class="profile">
        <!-- logo placeholder circle 80px by 80px-->
        <img class="avatar" alt="avatar" src="#">
        <h1>maxwellvolz - blog</h1>
        <div class="social-container" id="social">
            <div>
                <a class="symbol" target="_blank" href="https://github.com/MaxwellVolz">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100"
                        viewBox="0,0,256,256">
                        <g fill="#7851a9" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                            stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                            font-family="none" font-weight="none" font-size="none" text-anchor="none"
                            style="mix-blend-mode: normal">
                            <g transform="scale(5.12,5.12)">
                                <path
                                    d="M17.791,46.836c0.711,-0.306 1.209,-1.013 1.209,-1.836v-5.4c0,-0.197 0.016,-0.402 0.041,-0.61c-0.014,0.004 -0.027,0.007 -0.041,0.01c0,0 -3,0 -3.6,0c-1.5,0 -2.8,-0.6 -3.4,-1.8c-0.7,-1.3 -1,-3.5 -2.8,-4.7c-0.3,-0.2 -0.1,-0.5 0.5,-0.5c0.6,0.1 1.9,0.9 2.7,2c0.9,1.1 1.8,2 3.4,2c2.487,0 3.82,-0.125 4.622,-0.555c0.934,-1.389 2.227,-2.445 3.578,-2.445v-0.025c-5.668,-0.182 -9.289,-2.066 -10.975,-4.975c-3.665,0.042 -6.856,0.405 -8.677,0.707c-0.058,-0.327 -0.108,-0.656 -0.151,-0.987c1.797,-0.296 4.843,-0.647 8.345,-0.714c-0.112,-0.276 -0.209,-0.559 -0.291,-0.849c-3.511,-0.178 -6.541,-0.039 -8.187,0.097c-0.02,-0.332 -0.047,-0.663 -0.051,-0.999c1.649,-0.135 4.597,-0.27 8.018,-0.111c-0.079,-0.5 -0.13,-1.011 -0.13,-1.543c0,-1.7 0.6,-3.5 1.7,-5c-0.5,-1.7 -1.2,-5.3 0.2,-6.6c2.7,0 4.6,1.3 5.5,2.1c1.699,-0.701 3.599,-1.101 5.699,-1.101c2.1,0 4,0.4 5.6,1.1c0.9,-0.8 2.8,-2.1 5.5,-2.1c1.5,1.4 0.7,5 0.2,6.6c1.1,1.5 1.7,3.2 1.6,5c0,0.484 -0.045,0.951 -0.11,1.409c3.499,-0.172 6.527,-0.034 8.204,0.102c-0.002,0.337 -0.033,0.666 -0.051,0.999c-1.671,-0.138 -4.775,-0.28 -8.359,-0.089c-0.089,0.336 -0.197,0.663 -0.325,0.98c3.546,0.046 6.665,0.389 8.548,0.689c-0.043,0.332 -0.093,0.661 -0.151,0.987c-1.912,-0.306 -5.171,-0.664 -8.879,-0.682c-1.665,2.878 -5.22,4.755 -10.777,4.974v0.031c2.6,0 5,3.9 5,6.6v5.4c0,0.823 0.498,1.53 1.209,1.836c9.161,-3.032 15.791,-11.672 15.791,-21.836c0,-12.682 -10.317,-23 -23,-23c-12.683,0 -23,10.318 -23,23c0,10.164 6.63,18.804 15.791,21.836z">
                                </path>
                            </g>
                        </g>
                    </svg>
                </a>
            </div>

            <div>
                <a class="symbol" target="_blank" href="https://www.linkedin.com/in/maxwellvolz">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100"
                        viewBox="0,0,256,256">
                        <g fill="#7851a9" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                            stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                            font-family="none" font-weight="none" font-size="none" text-anchor="none"
                            style="mix-blend-mode: normal">
                            <g transform="scale(5.12,5.12)">
                                <path
                                    d="M41,4h-32c-2.76,0 -5,2.24 -5,5v32c0,2.76 2.24,5 5,5h32c2.76,0 5,-2.24 5,-5v-32c0,-2.76 -2.24,-5 -5,-5zM17,20v19h-6v-19zM11,14.47c0,-1.4 1.2,-2.47 3,-2.47c1.8,0 2.93,1.07 3,2.47c0,1.4 -1.12,2.53 -3,2.53c-1.8,0 -3,-1.13 -3,-2.53zM39,39h-6c0,0 0,-9.26 0,-10c0,-2 -1,-4 -3.5,-4.04h-0.08c-2.42,0 -3.42,2.06 -3.42,4.04c0,0.91 0,10 0,10h-6v-19h6v2.56c0,0 1.93,-2.56 5.81,-2.56c3.97,0 7.19,2.73 7.19,8.26z">
                                </path>
                            </g>
                        </g>
                    </svg>
                </a>
            </div>


        </div>
        <h2>Design, Develop, Deliver</h2>

    </header>
    `;
}

export { parseMarkdownFile, writeHtmlFile, readAndReplace, formatDate, generateHeader };
