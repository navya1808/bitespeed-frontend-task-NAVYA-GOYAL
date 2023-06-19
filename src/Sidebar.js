import React, { useEffect, useState } from 'react';
import { MdArrowBack, MdOutlineMessage } from "react-icons/md";

const Sidebar = ({ nodeId = "-1", nodeData = "" }) => {
  
  const [nodeDataChangeValue, setNodeDataChangeValue] = useState(nodeData);
  // 1 for adding the node
  //2 for editing the node
  const [sideBarView, setSideBarView] = useState(1);

  const onDragStart = (event, nodeType) => {
    // Set the data to be transferred during the drag operation
    event.dataTransfer.setData('application/reactflow', nodeType);
    // Specify the allowed drag operation
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleChange = (e) => {
    setNodeDataChangeValue(e.target.value);
  }

  useEffect(() => {
    //if the node is selected then change the sidebar view to edditing panel
    if (nodeId != "-1") {
      setSideBarView(2)
      setNodeDataChangeValue(nodeData)
    } else {
      // if the node is not selected then change the sidebar view to add panel
      setSideBarView(1)
    }
  }, [nodeId])


  return (
    <>
      {sideBarView == 1 ? (
        //if the sidebar is of adding the node 
      <aside>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
          <div className='messagePanel'>
            <MdOutlineMessage size={30} />
            <div style={{ marginTop: '5px' }}>Message</div>
          </div>
        </div>
      </aside>)
        : (
        // if the sidebar view is editing the node
        <aside>
          <div className='message'><MdArrowBack style={{ float: "left", marginRight: "10px"}} onClick={() => setSideBarView(1)} /> <div style={{ textAlign: 'center' }}>  Message</div></div>
          <div className='box'>
            <div className="textareaBox">
              <div className='text'>Text</div>
              <textarea rows={10} onChange={handleChange} className='textarea-data' value={nodeDataChangeValue} id={nodeId}></textarea>
            </div>
          </div>
        </aside>)

      }
    </>
  );
};

export default Sidebar;
