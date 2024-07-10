import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 5000; // Port number

app.use(cors());

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Set the path to the FFmpeg executable
ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe'); // Replace with the actual path

app.post('/convert', upload.single('video'), (req, res) => {
  const videoPath = req.file.path;
  const gifPath = `uploads/${Date.now()}.gif`;
  let { video,   startTime, endTime, dimensions, frameRate } = req.body;

  console.log(`Received file: ${videoPath}`);

  // Parse and validate input parameters
  startTime = parseFloat(startTime) || 0;
  const endTimeInSeconds = formatTimeToSeconds(endTime);
  const duration = endTimeInSeconds - startTime;

  const [width, height] = dimensions.split('x').map(Number);
  frameRate = parseInt(frameRate, 10);

  if (!width || !height || !frameRate || isNaN(startTime) || isNaN(duration)) {
    return res.status(400).send('Invalid parameters');
  }

  // Convert video to GIF using FFmpeg
  ffmpeg(videoPath)
    .setStartTime(startTime)
    .duration(duration)
    .size(`${width}x${height}`)
    .fps(frameRate)
    .output(gifPath)
    .on('end', () => {
      console.log(`GIF created: ${gifPath}`);
      res.sendFile(path.resolve(gifPath));
      // Optionally delete the files after sending
      setTimeout(() => {
        fs.unlinkSync(videoPath);
        fs.unlinkSync(gifPath);
        console.log(`Deleted files: ${videoPath}, ${gifPath}`);
      }, 60000); // Delete after 1 minute
    })
    .on('error', (err) => {
      // console.error('FFmpeg error:', err);
      res.status(500).send('Conversion failed');
    })
    .run();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Utility function to convert mm:ss to seconds
function formatTimeToSeconds(time) {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes * 60 + seconds;
}
