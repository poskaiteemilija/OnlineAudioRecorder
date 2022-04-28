import './style/App.css';
import Playback from './components/Playback';
import {v4 as uuid} from "uuid";
import { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import Localbase from 'localbase';

function App() {
  return (
    <div className="App">
      <Playback />
      <footer>
        <h4>Some icons were made by other creators:</h4>
        <p><a href="https://www.flaticon.com/free-icons/redo" title="redo icons">Redo icons created by Freepik - Flaticon</a></p>
        <p><a href="https://www.flaticon.com/free-icons/undo" title="undo icons">Undo icons created by Freepik - Flaticon</a></p>
        <p><a href="https://www.flaticon.com/free-icons/file-upload" title="file upload icons">File upload icons created by Pixel perfect - Flaticon</a></p>
        <p><a href="https://www.flaticon.com/free-icons/direct-download" title="direct download icons">Direct download icons created by Pixel perfect - Flaticon</a></p>
      </footer>
    </div>
  );
}

export default App;

