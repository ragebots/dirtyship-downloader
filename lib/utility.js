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

    const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36", "range": "bytes=0-", "sec-fetch-site": "cross-site", "sec-fetch-mode": "no-cors", "sec-fetch-dest": "video", "referer": "https://dirtyship.com/", "accept-encoding": "identity;q=1, *;q=0"};
    const request = protocol.get(fileLink, {headers: headers}, response => {

      if (response.statusCode !== 200 && response.statusCode !== 206) {
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
