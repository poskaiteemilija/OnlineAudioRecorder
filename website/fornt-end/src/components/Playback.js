import React, { useCallback, useState, useEffect } from 'react';
import Howl from 'howler';

import RecordButton from './Record';

const playbackReducer = (state, action) => {
    //to be added code which switches the state of the application
    switch(action.type){
        case 'play-rec':
            //solution in this switch section taken and modified from https://stackoverflow.com/questions/18650168/convert-blob-to-base64

    }
}

const startPlayback = () => {
    let temp = localStorage.getItem('bloblink');
    let blob = await fetch(temp).then(r => r.blob());
    let reader = new FileReader();
    if(temp!=undefined){
        reader.readAsDataURL(blob);
        reader.onload = function(){
            const base64data = reader.result;
            const sound = new Howl({
                src: [`data: audio/mp3;base64,${base64data}`]
            });
            sound.play();
        }
    }
}

let Playback = (props) =>{
    const PlaybackContext = React.createContext();
    const [state, dispatch] = React.useReducer(playbackReducer /* probably another value to be added here */);
    //const [audioState, setAudio] = useState({"isEmpty" : true});

    /*useEffect(() => {
        setAudio({
            "audio" : props.newRec,
            "isEmpty" : false,
        });
        console.log(audioState);
    }, [props.newRec]);*/


    const value = {state, dispatch};
    return(
        <div className="playback">
            {/* <PlaybackContext.Provider value={value}> */}
                <RecordButton />
                <button onClick={ startPlayback }>Play</button>
                <button>Pause</button>
                <button>Skip to front</button> 
            {/* </PlaybackContext.Provider> */}
        </div>
    );
}

export default Playback;