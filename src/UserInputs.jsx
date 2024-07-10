import React, { useEffect, useState } from 'react';
import './UserInputs.css';

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const formatTimeToSeconds = (time) => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
};

function UserInputs({ isFileUploaded, duration, filePath, isButtonClicked, video, name, setConversionParams, conversionParams }) {
    const [frameRate, setFrameRate] = useState(conversionParams.frameRate);
    const [dimensions, setDimensions] = useState(conversionParams.dimensions);
    const [startTime, setStartTime] = useState(conversionParams.startTime);
    const [endTime, setEndTime] = useState(conversionParams.endTime);

    const handleFocus = (e) => {
        setEndTime(endTime.replace(' s', ''));
    };

    useEffect(() => {
        setFrameRate(conversionParams.frameRate);
        setDimensions(conversionParams.dimensions);
        setStartTime(conversionParams.startTime);
        setEndTime(conversionParams.endTime);
    }, [conversionParams]);

    const handleBlur = (e) => {
        if (!endTime.includes(':')) {
            const formattedTime = formatTime(formatTimeToSeconds(endTime));
            setEndTime(`${formattedTime} s`);
        } else {
            setEndTime(`${endTime} s`);
        }
    };

    useEffect(() => {
        if (isButtonClicked) {
            setConversionParams({
                frameRate: parseInt(frameRate, 10),
                dimensions,
                startTime,
                endTime
            });
        }
    }, [isButtonClicked]);

    useEffect(() => {
        if (isFileUploaded && duration) {
            setEndTime(formatTime(Math.floor(duration)));
        } else {
            setEndTime('00:30');
        }
    }, [isFileUploaded, duration]);

    return (
        <div className='user-inputs'>
            <div className="frame-rate">
                <legend>Frame Rate</legend>
                <p>The higher the frame rate, the more detailed your GIF will be.</p>
                <input type="number" id='frame-rate-input' value={frameRate} onChange={(e) => setFrameRate(e.target.value)} disabled={!isFileUploaded} />
            </div>
            <div className="dimensions">
                <legend>Dimensions</legend>
                <p>Set the width and height for your GIF.</p>
                <input type="text" id='dimensions-input' value={dimensions} onChange={(e) => setDimensions(e.target.value)} disabled={!isFileUploaded} />
            </div>
            <div className="trim">
                <legend>Trim</legend>   
                <p>Choose the part of your video to convert into a GIF.</p>
                <div className="duration">
                    <div className="start">
                        <label htmlFor="start-time">Start at</label>
                        <input type="text" id='start-time' value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={!isFileUploaded} />
                    </div>
                    <div className="end">
                        <label htmlFor="end-time">End at</label>
                        <input type="text" id='end-time' value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={!isFileUploaded} onFocus={handleFocus} onBlur={handleBlur}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInputs;
