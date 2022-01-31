import react, { useEffect, useState, useCallback } from 'react';
import RecordingState from './RecordingState';
import '../style/Cursor.css';

async function calcFrame(marginPlace, velocity, timer, time){
    await timer(time);
    console.log("async ", marginPlace, " and ", velocity);
    return marginPlace+velocity;
}

const Cursor = (props)=>{
    const [marginPlace, setMarginPlace] = useState(0);
    const [cursorIsMoving, setCursorIsMoving] = useState(false);
    //console.log(props.playback);
    const timer = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        console.log("what is happening");
        if(props.playback === true && cursorIsMoving === false){
            console.log("why is is this happening");
            setCursorIsMoving(true);
            moveCursor();
        }
        if(props.playback === false && cursorIsMoving === true){
            setCursorIsMoving(false);
            setMarginPlace(0);
        }
    }, [props.playback]);

    const moveCursor = useCallback( async () => {
            const viewport = document.getElementById("playback-panel");
            let distance = viewport.clientWidth;
            console.log("distance", distance);
            const velocity = props.duration/distance*15;
            console.log(props.duration);
            console.log(velocity);
            let count = 0;
            let newMargin = marginPlace;
            while(true){
                newMargin = await calcFrame(newMargin, 10, timer, velocity);
                console.log(newMargin);
                setMarginPlace(newMargin);
                console.log("this is margin place", marginPlace);
                if(newMargin >= distance){
                    break;
                }
                count++;
                console.log(count);
            }
    });

    console.log("i rerender", marginPlace);

    return(
        <div id="playback-panel">
            <div id="cursor" style={{marginLeft: marginPlace + 'px'}}></div>
            
        </div>
    );
}

export default Cursor;