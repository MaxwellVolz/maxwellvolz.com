const fs = require('fs-extra');
const path = require('path');

// Define source and destination paths
const buildDir = path.join(__dirname, 'public'); // Adjust according to your build output directory
const nginxDir = '/etc/nginx/sites-available/maxwellvolz.com'; // Adjust to your actual nginx directory

// Ensure the destination directory exists
fs.ensureDirSync(nginxDir);

// Copy the files
fs.copy(buildDir, nginxDir, err => {
    if (err) {
        console.error('Error copying files:', err);
    } else {
        console.log('Files successfully copied to Nginx directory');
    }
});
