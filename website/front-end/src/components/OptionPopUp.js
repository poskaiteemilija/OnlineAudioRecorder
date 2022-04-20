import react from "react";

const OptionPopUp = (props) => {
    const handleClickSilence = () => {
        const val = document.getElementById("silentRange").value;
        console.log(val);
        if(val !== ""){
            const numericVal = parseFloat(val);
            if(isNaN(numericVal)){
                alert("Please enter a valid numeric value");
            }
            else{
                if(numericVal >= 0.1 && numericVal <=30){
                    props.setSilent({value: numericVal});
                }
                else{
                    alert("Please enter a valid numeric value");
                }
            }
        }
        else{
            alert("Please enter a valid numeric value");
        }
        props.setShowSlider({show: false, mode: "s"});
    }

    const handleClickVol = () => {
        const val = document.getElementById("silentRange").value;
        console.log(val);
        if(val !== ""){
            const numericVal = parseFloat(val);
            if(isNaN(numericVal)){
                alert("Please enter a valid numeric value");
            }
            else{
                if(numericVal >= 0 && numericVal <=1){
                    props.setVol({value: numericVal, track: props.showSlider.track});
                }
                else{
                    alert("Please enter a valid numeric value");
                }
            }
        }
        else{
            alert("Please enter a valid numeric value");
        }
        props.setShowSlider({show: false, mode: "v"});
    }

    if(props.showSlider.show === true && props.showSlider.mode === "s"){
        return(<div className="popup-background">
            <div className="export-popup">
                <p>Please select the duration of the silence in seconds (up to 30s):</p>
                <input type="number" min="0.1" max="30" step="0.1" className="slider" id="silentRange"></input>
                <button onClick={handleClickSilence}>Select</button>
            </div>
        </div>);
    }
    else if(props.showSlider.show === true && props.showSlider.mode === "v"){
        return(<div className="popup-background">
            <div className="export-popup">
                <p>Please select volume with 0 being muted and 1 full volume:</p>
                <input type="number" min="0" max="1" step="0.01" className="slider" id="silentRange"></input>
                <button onClick={handleClickVol}>Select</button>
            </div>
        </div>);
    }
    else{
        return(<></>);
    }
}

export default OptionPopUp;