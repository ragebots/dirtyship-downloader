# dirtyship-downloader
Download dirtyship video and image galleries.  
__Please note that, I neither own dirtyship.com nor do I endorse stealing contents.__  
__I am not responsible for you legally committing crime by using this tool.__  

# Preparing the script  
```
1. Make sure you have node js 12 or later installed  
2. git clone https://github.com/sunaram/dirtyship-downloader  
3. cd into the cloned directory and run npm install  
```

# Running the script
```
node app.js [DIRTYSHIP_VIDEO_OR_GALLER_URL]  
replace [DIRTYSHIP_VIDEO_OR_GALLER_URL] with your dirtyship link
e.g. node app.js https://dirtyship.com/gallery/whitney-johns-nude-photos-leaked/
You can download multiple video/galleries from multiple links at the same time  
node app.js [url1] [url2]  
```

# Building the executables for mac, linux and windows
```
1. npm install pkg -g
2. pkg app.js --out-path releases
```

# Not a developer? Just want to run the script?
```
1. Download the appropriate executable from "releases" folder
2. Run commands like this
```
On __Windows__,
```
dirtyship-downloader-win.exe https://dirtyship.com/gallery/whitney-johns-nude-photos-leaked/
```
On __Linux__,
```
chmod a+x dirtyship-downloader-linux
dirtyship-downloader-linux https://dirtyship.com/gallery/whitney-johns-nude-photos-leaked/
```
On __Mac__,
```
chmod a+x dirtyship-downloader-mac
dirtyship-downloader-mac https://dirtyship.com/gallery/whitney-johns-nude-photos-leaked/
```
