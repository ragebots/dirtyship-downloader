const fetch = require('node-fetch');
const fs = require("fs");
const { parse } = require('node-html-parser');
const {URL} = require("url");

const checkIfVideoLink = (contentHTML) => {
  try {
    const dom = parse(contentHTML);
    const videoPlayer = dom.querySelector("#player .video_player");
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
    const dom = parse(contentHTML);
    const gallery = dom.querySelector("#album .gallery_grid");
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
    const dom = parse(contentHTML);
    const videoPlayer = dom.querySelector("#player .video_player");
    const sourceJSONString = videoPlayer.querySelector(".flowplayer").getAttribute("data-item");
    const sourceJSON = JSON.parse(sourceJSONString);
    // console.log(sourceJSON.sources[0].src);
    if(sourceJSON.sources && sourceJSON.sources[0].src) {
      const fileName = getMediaPath(sourceJSON.sources[0].src);
      return {fileLink: sourceJSON.sources[0].src, fileName: fileName};
    }
  } catch(err) {

  }
  return {};
}
const getGalleryImageLinks = (contentHTML) => {
  const links = [];
  try {
    const dom = parse(contentHTML);
    const imageLinks = dom.querySelectorAll("#album .gallery_grid a");
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
