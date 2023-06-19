import { useState } from 'react';
import './App.css';
import ReactFlowComponent from './ReactFlowComponent';

function App() {
  const [dataSelect, setDataSelect] = useState();
  const [idSelect, setIdSelect] = useState(-1);
  const [saveClicked, setSaveClicked] = useState(false)

  const handleClick = () => {
    //get the id of selected node
    setIdSelect(document.getElementsByClassName("textarea-data")[0]?.id);
    //get the data of selected node
    setDataSelect(document.getElementsByClassName("textarea-data")[0]?.defaultValue);
    setSaveClicked(true)
  }


  return (
    <>
      <header className='header'><button className="savechanges" onClick={handleClick} style={{}}><b>Save Changes</b></button></header>
      <ReactFlowComponent dataSelect={dataSelect} idSelect={idSelect} saveClicked={saveClicked} resetSaveClicked={() => setSaveClicked(false)}/>
    </>
  );
}

export default App;
