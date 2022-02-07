import react from "react";
import "../style/ExportPopUp.css";

const ExportPopUp = ({ setPopUpState }) => {

    return(<div id="popup-background">
        <div id="export-popup">
            <h2>EXPORT OPTIONS</h2>
            <form method="post">
                <label for="filename">File name</label>
                <input type="text" id="filename"/>
                <div>
                    <input type="radio" name="format" value="mp3" id="mp3"/>
                    <label for="mp3">.mp3</label>
                </div>
                <div>
                    <input type="radio" name="format" value="wav" id="wav"/>
                    <label for="wav">.wav</label>
                </div>
                <div>
                    <input type="radio" name="format" value="webm" id="webm"/>
                    <label for="webm">.webm</label>
                </div>
                <button onClick={ () => {setPopUpState(false)} }>Exit</button>
                <input type="submit" />
            </form>
        </div>
    </div>);
}

export default ExportPopUp;