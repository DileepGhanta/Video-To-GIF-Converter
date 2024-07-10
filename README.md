# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


<h1 align="center">🎥 Video-To-GIF-Converter 🎥</h1>

## Overview

This Video-To-GIF-Converter web app is built using React.js and Express.js. It provides a simple and intuitive way to convert video files to GIFs. With an easy-to-use interface, you can quickly upload your video, set the start and end times, and generate a GIF from the selected portion. The app processes the video and allows you to download the resulting GIF with just one clicks. This tool is perfect for anyone looking to create GIFs from their favorite videos quickly and easily.

### UI 
![image](./src/assets/UI.png) 

## Setup Steps

- Clone the Repository

```
git clone https://github.com/DileepGhanta/Video-To-GIF-Converter.git
```
- Go to directory

```
cd Video-To-GIF-Converter
```
- Install node_modules 
```
npm install
```
- Install Dependency 
```
npm install @ffmpeg/core @ffmpeg/ffmpeg bootstrap cors express file-saver fluent-ffmpeg multer node-fetch react react-dom react-dropzone react-icons styled-components sweetalert
```

- Download ffmpeg from [ffmpeg](https://www.ffmpeg.org/download.html), install it for Windows, extract the folder, rename it to ffmpeg, copy the bin folder path, and add the path to environment variables.

- Start LocalHost Server & Express server
```
npm run dev
node server.js
```
