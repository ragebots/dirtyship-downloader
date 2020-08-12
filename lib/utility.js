const http = require('http');
const https = require('https');
const fs = require('fs');

const downloadFile = (fileLink, filePath) => {

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let protocol = http;
    if(fileLink.startsWith("https://")) {
      protocol = https;
    }
    let fileInfo = null;

    const request = protocol.get(fileLink, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${fileLink}' (${response.statusCode})`));
        return;
      }

      fileInfo = {
        mime: response.headers['content-type'],
        size: parseInt(response.headers['content-length'], 10),
      };

      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on('finish', () => resolve(fileInfo));

    request.on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });

    file.on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });

    request.end();
  });
}


module.exports = {
  downloadFile
}
