import { config, S3 } from 'aws-sdk';
import { readdir, createReadStream } from 'fs';
import { join } from 'path';

// Initialize AWS
config.update({ region: 'your-region' });
const s3 = new S3({ apiVersion: '2006-03-01' });

const bucketName = 'your-bucket-name';
const outputDir = join(__dirname, '../dist');

readdir(outputDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        const filePath = join(outputDir, file);
        const fileStream = createReadStream(filePath);

        const uploadParams = {
            Bucket: bucketName,
            Key: file,
            Body: fileStream
        };

        s3.upload(uploadParams, (err, data) => {
            if (err) {
                console.log(`Error: ${err}`);
            } if (data) {
                console.log(`Uploaded: ${file}`);
            }
        });
    });
});
