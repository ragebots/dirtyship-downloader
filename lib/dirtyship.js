const fetch = require('node-fetch');
const fs = require("fs");
const { JSDOM } = require("jsdom");
const {URL} = require("url");

const checkIfVideoLink = (contentHTML) => {
  try {
    // const dom = parse(contentHTML);
    const dom = new JSDOM(contentHTML);
    const doc = dom.window.document;
    const videoPlayer = doc.querySelector("#player .video_player");
    if(videoPlayer) {
      return true;
    }
  } catch(err) {
    // console.error(er);
  }

  return false;
}
const checkIfGalleryLink = (contentHTML) => {
  try {
    // const dom = parse(contentHTML);
    const dom = new JSDOM(contentHTML);
    const doc = dom.window.document;
    const gallery = doc.querySelector("#album .gallery_grid");
    if(gallery) {
      return true;
    }
  } catch(err) {
    // console.error(er);
  }
  return false;
}
const getVideoDownloadInfo = (contentHTML) => {
  try {
    // const dom = parse(contentHTML);
    const dom = new JSDOM(contentHTML);
    const doc = dom.window.document;
    const videoPlayer = doc.querySelector("#player .video_player");
    // console.log(videoPlayer.querySelector("source").outerHTML);
    const sourceEl = videoPlayer.querySelector("source");
    if(sourceEl) {
      // console.log("source");
      const src = sourceEl.getAttribute("src");
      const fileName = getMediaPath(src);
      return {fileLink: src, fileName: fileName};
    } else {
      // check if a different player
      // console.log(videoPlayer.innerHTML); return;
      const sourceJSONString = videoPlayer.querySelector(".flowplayer").getAttribute("data-item");
      console.log("data-item:", sourceJSONString);
      const sourceJSON = JSON.parse(sourceJSONString);
      // console.log(sourceJSON.sources[0].src);
      if(sourceJSON.sources && sourceJSON.sources[0].src) {
        const fileName = getMediaPath(sourceJSON.sources[0].src);
        return {fileLink: sourceJSON.sources[0].src, fileName: fileName};
      }
    }
  } catch(err) {
    console.error(err);
  }
  return {};
}
const getGalleryImageLinks = (contentHTML) => {
  const links = [];
  try {
    // const dom = parse(contentHTML);
    const dom = new JSDOM(contentHTML);
    const doc = dom.window.document;
    const imageLinks = doc.querySelectorAll("#album .gallery_grid a");
    // console.log(imageLinks);
    for(const imageLink of imageLinks) {
      let link = imageLink.querySelector("img").getAttribute("src");
      link = link.replace(/-[0-9]+x[0-9]+/, "");
      const fileName = getMediaPath(link);
      links.push({fileLink: link, fileName: fileName});
    }
  } catch(err) {

  }
  return links;
}
const getMediaPath = (url) => {
  let path = "";
  try {
    const pathname = new URL(url).pathname;
    const pArr = pathname.split("/");
    let endPart = "";
    for(const part of pArr) {
      if(part.trim()) {
        path = part.trim();
      }
    }
  } catch(err) {

  }
  return path;
}


module.exports = {
  checkIfVideoLink,
  checkIfGalleryLink,
  getVideoDownloadInfo,
  getGalleryImageLinks,
  getMediaPath
}
