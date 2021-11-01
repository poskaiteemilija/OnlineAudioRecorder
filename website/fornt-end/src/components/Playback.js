import React, { useCallback, useState, useEffect } from 'react';
import ReactHowler from 'react-howler';

let Playback = (props) =>{
    const [audioState, setAudio] = useState({"isEmpty" : true});

    useEffect(() => {
        setAudio({
            "audio" : props.newRec,
            "isEmpty" : false,
        });
        console.log(audioState);
    }, [props.newRec]);

    const startPlayback = useCallback(() => {
        console.log("what is this");
        return(
            <ReactHowler src={audioState.audio} playing={true} ></ReactHowler>
        );
    }, [audioState.audio]);

    return(
        <div className="playback">
            {/*!audioState.isEmpty ? "" : startPlayback*/}
            <button onClick={startPlayback}>Playback</button>
        </div>
    );
}

export default Playback;