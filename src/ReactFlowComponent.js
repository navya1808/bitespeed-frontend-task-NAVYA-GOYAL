import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState
} from 'reactflow';
import CustomNode from './CustomNode';
import "reactflow/dist/style.css";
import './App.css';
import Sidebar from './Sidebar';

const initialNodes = [];

let id = 0;
const getId = () => `${id++}`;

const nodeTypes = {
  customNode: CustomNode
};


const ReactFlowComponent = ({ dataSelect, idSelect, saveClicked, resetSaveClicked = () => {} }) => {
  
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [uniqueSet, setUniqueSet] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodeData, setNodeData] = useState(null);

  const onConnect = useCallback((params) => {
    // Set the arrowHeadType of the edge to 'arrow'
    params.arrowHeadType = 'arrow';
    // Update the edges state by adding a new edge
    setEdges((eds) => addEdge(params, eds))
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    // Set the drop effect to 'move' to indicate a valid drop target
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      // help to get the boundaries of the reactFlowWrapper element
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      // Get the data type of the dropped element
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }
      // Calculate the position of the dropped element relative to the reactFlowWrapper
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      // Create a new node object 
      const newNode = {
        id: getId(),
        type: "customNode",
        position,
        data: { label: `Text Message ${id} ` },
        sourcePosition: 'right',
        targetPosition: 'left'
      };
      //adding the new node with the existing ones
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  useEffect(() => {
     //if there is a change in the data value then update the data in the nodes objects for that specific node 
    const updatedNode = nodes.map(node => (node.id === idSelect ? { ...node, data: { label: dataSelect } } : node))
    setNodes(updatedNode);
    setSelectedNodeId(null)
  }, [dataSelect, idSelect])

  useEffect(() => {
    const updatedUniqueSet = [];
    edges.forEach((edge) => {
      if (!updatedUniqueSet.includes(edge.target)) {
        updatedUniqueSet.push(edge.target);
      }
    });
    setUniqueSet(updatedUniqueSet);
  }, [edges]);
  
  useEffect(() => {
    //if the save button is clicked
    if (saveClicked) {
       // This condition checks if there are any unconnected nodes
      if (nodes.length - uniqueSet.length > 1) {
        alert('cannot save');
      } else {
        alert('saved successfully');
      }
      resetSaveClicked(); 
    }
  }, [saveClicked]);
 
  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}   //pass the node array of objects
            edges={edges}   //pass the edges array of objects
            onNodesChange={onNodesChange} // Callback functions for handling changes in nodes 
            onEdgesChange={onEdgesChange}// Callback functions for handling changes in edges
            onConnect={onConnect}   //Callback function for handling connection events
            onInit={setReactFlowInstance} //Callback function for initializing the ReactFlow instance
            onDrop={onDrop} //Callback function for handling drop events
            onDragOver={onDragOver} //Callback function for handling drag over events
            nodeTypes={nodeTypes} // it specify the custom node types
            onNodeClick={(event, node) => {
              setSelectedNodeId(node.id);
              //find the node which is clicked
              const clickedNode = nodes.find((element) => element.id === node.id);
              //setting the clicked node data in setNodeData
              setNodeData(clickedNode?.data?.label || null);
            }}
            fitView // Fit the view of the ReactFlow component
          >
          </ReactFlow>
        </div>
        {/* if the node is selected then send the node data and id
        if not render the sidebar component as it is */}
        {selectedNodeId ? <Sidebar nodeId={selectedNodeId} nodeData={nodeData} /> : <Sidebar />}
      </ReactFlowProvider>
    </div>
  );
};

export default ReactFlowComponent;
