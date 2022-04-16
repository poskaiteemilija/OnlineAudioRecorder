import './style/App.css';
import Playback from './components/Playback';
import {v4 as uuid} from "uuid";
import { useEffect } from 'react';
import Localbase from 'localbase';

function App() {

  useEffect(() => {
    let db = new Localbase('db');
    if(localStorage.getItem("sessionID") === null){
      db.collection('audio').delete();
      localStorage.setItem("sessionID", uuid() + Date.now());
      localStorage.setItem("previousRec", "");
    }
    else{
      const answer = window.confirm("A previous session has been detected, would you like to continue?");
      if(answer){
        return;
      }
      db.collection('audio').delete();
      localStorage.setItem("sessionID", uuid() + Date.now());
      localStorage.setItem("previousRec", "");
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

