import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileUpload from './FileUpload';
function App() {
  return (
    <div className='main'>
    <h1>Video to GIF Converter</h1>
   <FileUpload/>
    </div>
  );
}

export default App;
