import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';
import { MdCloudUpload, MdClose } from 'react-icons/md';
import UserInputs from './UserInputs';
import { MdCallMade } from "react-icons/md";
import swal from 'sweetalert';

const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [videoDuration, setVideoDuration] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [video, setVideo] = useState();
  const [name, setName] = useState();
  const [hasDownloaded, setHasDownloaded] = useState(false); 
  const [conversionParams, setConversionParams] = useState({
    frameRate: 24,
    dimensions: '1280x720',
    startTime: '0:00',
    endTime: '00:30'
  });

  const setVid = (e) => {
    setVideo(e.target.files?.item(0))
    // setName(uploadedFiles[0]?.name)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        swal({
          title: "Invalid file type. Please upload a video file.",
          icon: "error",
        });
      } else {
        setUploadedFiles(acceptedFiles);
        setIsFileUploaded(true);
        setHasDownloaded(false); 
        setName(acceptedFiles[0].name.substring(0, acceptedFiles[0].name.lastIndexOf('.')));
      }
    },
    accept: {
      'video/mp4': ['.mp4', '.MP4'],
      'video/x-matroska': ['.mkv', '.MKV'],
      'video/x-msvideo': ['.avi', '.AVI'],
      'video/quicktime': ['.mov', '.MOV'],
      'video/webm': ['.webm', '.WEBM'],
      'video/x-ms-wmv': ['.wmv', '.WMV'],
      'video/mpeg': ['.mpeg', '.MPEG', '.mpg', '.MPG'],
      'video/ogg': ['.ogv', '.OGV'],
      'video/3gpp': ['.3gp', '.3GP', '.3g2', '.3G2'],
      'video/x-flv': ['.flv', '.FLV'],
      'video/x-m4v': ['.m4v', '.M4V'],
      'application/x-mpegURL': ['.m3u8', '.M3U8'],
      'video/mp2t': ['.ts', '.TS']
    },
    disabled: isFileUploaded,
  });

  const removeFile = (event) => {
    event.stopPropagation(); // Stop event propagation
    setUploadedFiles([]); 
    setVideoDuration(null);
    setIsFileUploaded(false); // Reset state when file is removed
    setIsButtonClicked(false);
    setHasDownloaded(false);
    setConversionParams({
      frameRate: 24,
      dimensions: '1280x720',
      startTime: '0:00',
      endTime: '00:30'
    });
  };
  
  const handleLoadedMetadata = (e) => {
    setVideoDuration(e.target.duration);
  };
  
  const handleButtonClick = async () => {
    if (hasDownloaded){
      swal({
        title: "The GIF has already been downloaded.",
        icon: "warning",
      });
      return;
    };
    setIsButtonClicked(true);
    if (uploadedFiles.length > 0) {
      const file = uploadedFiles[0];
      const formData = new FormData();
      formData.append('video', file);
      formData.append('startTime', conversionParams.startTime);
      formData.append('endTime', conversionParams.endTime);
      formData.append('dimensions', conversionParams.dimensions);
      formData.append('frameRate', conversionParams.frameRate);
      try {
        const response = await fetch('http://localhost:5000/convert', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${name}.gif`;
          link.style.display = 'none'; 
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url); // Clean up the URL object
          setHasDownloaded(true);
        } else {
          alert('Conversion failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className='app'>
      <div className='main-box'>
        <div {...getRootProps()} className={isFileUploaded ? 'after-file-upload' : 'drag-and-drop-box'}>
          <input {...getInputProps()} className='input-field' onChange={(e) => setVid(e)}/>
          {!uploadedFiles.length ? (
            <>
              <MdCloudUpload color='#ff8c00' size={60} />
              <span className="instructions">Drag and drop video or</span>
              <h3></h3>
              <button className='upload-button'>Upload video</button>
            </>
          ) : (
            <div className="uploaded-file-container">
              <video controls width="500px" height="300px" className="video" onLoadedMetadata={handleLoadedMetadata}>
                <source src={URL.createObjectURL(uploadedFiles[0])} type={uploadedFiles[0].type} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          {isFileUploaded ? <MdClose className="delete-icon" onClick={(event) => removeFile(event)} /> : null}
        </div>
        <UserInputs isFileUploaded={isFileUploaded} duration={videoDuration} filePath={isFileUploaded && uploadedFiles[0].path} isButtonClicked={isButtonClicked} video={video} name={name} setConversionParams={setConversionParams}conversionParams={conversionParams}
        />
      </div>
      <div className="button">
        <button className='create-btn' disabled={!isFileUploaded} onClick={isFileUploaded ? handleButtonClick : null}>Create GIF <MdCallMade className='arrow' /></button>
      </div>
    </div>
  );
};

export default FileUpload;
