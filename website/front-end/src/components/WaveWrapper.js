import react from "react";
import WaveSurfer from "wavesurfer.js";

const WaveWrapper = (props) => {
    return(
        <div id="wave-wrapper">
            <WaveSurfer 
            container={document.getElementById("wave-wrapper")}
            fillParent={true}
            minPxPerSec={200}
            backgroundColor= {"#ffffff"}
            load={props.audio}
            />
        </div>
    );
}

export default WaveWrapper;