import './style/App.css';
import Playback from './components/Playback';
import {v4 as uuid} from "uuid";
import { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import Localbase from 'localbase';

function App() {
  let db = new Localbase('db');

  useEffect(() => {
    
    if(localStorage.getItem("sessionID") === null){
      db.collection('audio').delete();
      db.collection('versionControl').delete();
      localStorage.setItem("sessionID", uuid() + Date.now());
      localStorage.setItem("previousRec", "");
    }
    else{
      const answer = window.confirm("A previous session has been detected, would you like to continue?");
      if(!answer){
        db.collection('audio').delete();
        db.collection('versionControl').delete();
        localStorage.setItem("sessionID", uuid() + Date.now());
        localStorage.setItem("previousRec", "");
      }
      else{

      }
    }
    
  }, []);
  

  return (
    <div className="App">
      <Playback />
      {/*<footer>
      </footer>*/}
    </div>
  );
}

export default App;

