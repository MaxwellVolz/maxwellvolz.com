const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function parseFileName(fileName) {
    const [title, month, day, year] = fileName.split('_');
    const fullYear = year.length === 2 ? `20${year}` : year; // Ensure the year is in 4-digit format
    return {
        year: fullYear,
        month: parseInt(month, 10),
        day: parseInt(day, 10),
        title
    };
}

export function generateBreadcrumb(parsedInfo) {
    const { year, month, title } = parsedInfo;
    let breadcrumb = `<nav class="breadcrumb"><a href="/">Home</a>`;

    if (year !== undefined) {
        breadcrumb += ` > <a href="/${year}">${year}</a>`;
    }
    if (month !== undefined) {
        const monthName = monthNumberToName(month);
        breadcrumb += ` > <a href="/${year}/${month}">${monthName}</a>`;
    }
    if (title !== undefined) {
        breadcrumb += ` > <a href="/${year}/${month}/${title}.html">${title}</a>`;
    }

    breadcrumb += '</nav>';
    return breadcrumb;
}


export function monthNumberToName(monthNumber) {
    return months[monthNumber - 1];
}

export function formatDateToHumanReadable(date) {

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNumber = date.getDate();
    const year = date.getFullYear();

    return `${dayName}, ${monthName} ${dayNumber}, ${year}`;
}

export function groupPostsByYearAndMonth(allPosts) {
    const grouped = {};
    allPosts.forEach(post => {
        if (!grouped[post.year]) {
            grouped[post.year] = {};
        }
        if (!grouped[post.year][post.month]) {
            grouped[post.year][post.month] = [];
        }
        grouped[post.year][post.month].push(post);
    });
    return grouped;
}

export function generateArchiveHtml(posts) {
    let html = "";
    posts.forEach(post => {
        html += `<a href="/${post.year}/${post.month}/${post.title}.html">${post.title}</a><br>`;
    });
    return html;
}
