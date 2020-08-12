const CLA = require("./lib/cla");
const DirtyShip = require("./lib/dirtyship");
const fetch = require('node-fetch');
const fs = require("fs");
const { parse } = require('node-html-parser');
const Utility = require("./lib/utility");

// default output directory
let outputDir = "outputs";
// input urls
const inputURLs = [];

try {
  const options = CLA.getOptions();
  // console.log(options);
  if(options.help) {
    CLA.printUsage();
    process.exit();
  }

  if(options.output) {
      outputDir = options.output;
  }
  // create output directory if doesn't exists yet
  if(!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
  }

  // concat input urls
  if(options.input && options.input.length > 0) {
    options.input.forEach(url => {
      if(!inputURLs.includes(url.toLowerCase())) {
        inputURLs.push(url.toLowerCase());
      }
    });
  }
  if(inputURLs.length == 0) {
    console.log("You don't have any target urls.");
    process.exit();
  }

} catch(err) {
  console.error(err);
  process.exit();
}

// console.log(inputURLs);

(async() => {
  for(const url of inputURLs) {
    const response = await fetch(url);
    const contentHTML = await response.text();
    // console.log(contentHTML);
    const mediaPath = DirtyShip.getMediaPath(url);
    // console.log(mediaPath);
    const mediaOutputDir = outputDir +"/"+ mediaPath;
    // create output directory if doesn't exists yet
    if(!fs.existsSync(mediaOutputDir)) {
      fs.mkdirSync(mediaOutputDir, {recursive: true});
    }

    const isVideo = DirtyShip.checkIfVideoLink(contentHTML);
    const isGallery = DirtyShip.checkIfGalleryLink(contentHTML);

    if(isVideo) {
      // we have a video
      const videoFile = DirtyShip.getVideoDownloadInfo(contentHTML);
      // console.log(videoFile);
      if(videoFile.fileLink && videoFile.fileName) {
        const fileLink = videoFile.fileLink;
        const filePath = mediaOutputDir +"/"+ videoFile.fileName;
        try {
          console.log("Downloading "+ fileLink +" to "+ filePath);
          await Utility.downloadFile(fileLink, filePath);
        } catch(err) {
          console.error(err);
        }
      }
    }
    if(isGallery) {
      // we have an album of images
      const imageLinks = DirtyShip.getGalleryImageLinks(contentHTML);
      // console.log(imageLinks);
      for(const imageLink of imageLinks) {
        if(imageLink.fileLink && imageLink.fileName) {
          const fileLink = imageLink.fileLink;
          const filePath = mediaOutputDir +"/"+ imageLink.fileName;
          try {
            console.log("Downloading "+ fileLink +" to "+ filePath);
            await Utility.downloadFile(fileLink, filePath);
          } catch(err) {
            console.error(err);
          }
        }
      }
    }
  }
})();
