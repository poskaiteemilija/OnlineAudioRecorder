import './style/App.css';
import Playback from './components/Playback';
import FrontEndPoint from "./components/FrontEndPoint";
import {v4 as uuid} from "uuid";
import { useEffect } from 'react';
import Localbase from 'localbase';

function App() {

  useEffect(() => {
    let db = new Localbase('db');
    if(localStorage.getItem("sessionID") === null){
      db.collection('audio').delete();
      localStorage.setItem("sessionID", uuid() + Date.now());
    }
    else{
      const answer = window.confirm("A previous session has been detected, would you like to continue?");
      if(answer){
        return;
      }
      db.collection('audio').delete();
      localStorage.setItem("sessionID", uuid() + Date.now());
    }
    
  }, []);
  
  return (
    <div className="App">
      <Playback />
      <FrontEndPoint></FrontEndPoint>
    </div>
  );
}

export default App;

