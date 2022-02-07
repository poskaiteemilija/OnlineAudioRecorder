import react, { useCallback, useState } from "react";
import "../style/ExportPopUp.css";
import { putData } from "./FrontEndPoint";

const ExportPopUp = ({ setPopUpState }) => {
    const [format, setFormat] = useState();

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        console.log(format);
        console.log(event.target.filename.value);
        putData(event.target.filename.value, format);
        console.log("it's my turn");
        setPopUpState(false);
        setFormat();
    });

    const handleOnChange = useCallback((event) => {
        setFormat(event.target.value);
    });

    return(<div id="popup-background">
        <div id="export-popup" onBlur={window.focus()}>
            <h2>EXPORT OPTIONS</h2>
            <form onSubmit={ handleSubmit } >
                <label for="filename">File name</label>
                <input type="text" name="filename" id="filename"/>
                <div>
                    <input type="radio" name="format" value="mp3" id="mp3" onChange={handleOnChange} />
                    <label for="mp3">.mp3</label>
                </div>
                <div>
                    <input type="radio" name="format" value="wav" id="wav"onChange={handleOnChange} />
                    <label for="wav">.wav</label>
                </div>
                <div>
                    <input type="radio" name="format" value="webm" id="webm" onChange={handleOnChange} />
                    <label for="webm">.webm</label>
                </div>
                <button onClick={ () => {setPopUpState(false)} }>Exit</button>
                <input type="submit" />
            </form>
        </div>
    </div>);
}


export default ExportPopUp;