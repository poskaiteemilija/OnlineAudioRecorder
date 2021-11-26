import react, { useEffect } from 'react';
import RecordingState from './RecordingState';
import '../style/Cursor.css';



const Cursor = (props)=>{
    const [marginPlace, setMarginPlace] = useState();
    console.log(props.playback);

    useEffect(() => {
        if(props.playback.playing === true){
            moveCursor();
        }
    }, [props.playback]);

    const moveCursor = useEffect(() => {
        /*const viewport = document.getElementById("playback-panel");
        let distance = viewport.clientWidth;
        const velocity = distance/props.playback.duration;
        let cursor = document.getElementById("cursor");
        while(true){
            cursor.style.marginLeft += velocity;
            if(style.marginLeft >= distance){
                break;
            }
        }*/
    });

    return(
        <div id="playback-panel">
            <div id="cursor" style={}></div>
            <RecordingState data = { props.data } />
        </div>
    );
}

export default Cursor;