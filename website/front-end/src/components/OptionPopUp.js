import react from "react";

const OptionPopUp = (props) => {
    const handleClick = () => {
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
        props.setShowSlider(false);
    }

    if(props.showSlider === true){
        return(<div className="popup-background">
            <div className="export-popup">
                <p>Please select the duration of the silence in seconds (up to 30s):</p>
                <input type="number" min="0.1" max="30" step="0.1" className="slider" id="silentRange"></input>
                <button onClick={handleClick}>Select</button>
            </div>
        </div>);
    }
    else{
        return(<></>);
    }
}

export default OptionPopUp;