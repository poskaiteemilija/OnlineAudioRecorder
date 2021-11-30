import './style/App.css';
import Playback from './components/Playback';
import FrontEndPoint from "./components/FrontEndPoint";

function App() {
  return (
    <div className="App">
      <Playback />
      <FrontEndPoint></FrontEndPoint>
    </div>
  );
}

export default App;

