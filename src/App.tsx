import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  NodeTypes,
  BackgroundVariant,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

import { ProjectNode, SceneNode, RuleNode, WhenEventNode, ThenActionNode, ElementNode } from './components/nodes/CustomNodes';
import { FlowService } from './services/FlowService';
import { RJsonProject } from './types/rjson';

// Define node types
const nodeTypes: NodeTypes = {
  projectNode: ProjectNode,
  sceneNode: SceneNode,
  rule: RuleNode,
  whenEvent: WhenEventNode,
  thenAction: ThenActionNode,
  element: ElementNode
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [sceneOptions, setSceneOptions] = useState<{ value: string; label: string }[]>([]);
  const [rjsonFile, setRjsonFile] = useState<RJsonProject | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedJson = JSON.parse(content) as RJsonProject;
          setRjsonFile(parsedJson);
          setFileError(null);
        } catch (error) {
          setFileError('Invalid JSON file. Please upload a valid RJSON file.');
          setRjsonFile(null);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  // Load flow data
  useEffect(() => {
    // Populate scene options if we have a valid RJSON file
    if (rjsonFile && sceneOptions.length === 0) {
      if (rjsonFile.projectJson.records.scene) {
        const options = Object.entries(rjsonFile.projectJson.records.scene).map(([id, scene]) => ({
          value: id,
          label: scene.name
        }));
        setSceneOptions(options);
      }
    }
    
    // Only generate flow data if a scene is selected
    if (selectedSceneId && rjsonFile) {
      const flowData = FlowService.convertToFlow(rjsonFile, selectedSceneId);
      setNodes(flowData.nodes);
      setEdges(flowData.edges);
    } else {
      // Clear the diagram if no scene is selected or no file is loaded
      setNodes([]);
      setEdges([]);
    }
  }, [selectedSceneId, rjsonFile, sceneOptions.length]);

  // Handle scene selection
  const handleSceneChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSceneId(value === "" ? null : value);
  }, []);

  return (
    <div className="app-container light-mode">
      <div className="header">
        <h1>RJSON Flow Diagram</h1>
        <div className="file-upload-container">
          <label htmlFor="json-file" className="file-upload-label">
            <span className="upload-icon">📁</span>
            <span className="upload-text">Upload RJSON File</span>
          </label>
          <input
            type="file"
            id="json-file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          {fileError && <div className="file-error">{fileError}</div>}
        </div>
        
        {rjsonFile && (
          <div className="scene-selector">
            <label htmlFor="scene-select">Select Scene: </label>
            <select id="scene-select" value={selectedSceneId || ""} onChange={handleSceneChange}>
              <option value="">-- Select a Scene --</option>
              {sceneOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      <div className="content">
        {!rjsonFile ? (
          <div className="no-file-message">
            <div className="message-card">
              <h2>Please upload a RJSON file to visualize</h2>
              <p>The flow diagram will show the rules, events, actions, and elements for the selected scene.</p>
              <div className="file-upload-large">
                <label htmlFor="json-file-large" className="file-upload-label">
                  <span className="upload-icon">📁</span>
                  <span className="upload-text">Upload RJSON File</span>
                </label>
                <input
                  type="file"
                  id="json-file-large"
                  accept=".json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
        ) : !selectedSceneId ? (
          <div className="no-scene-message">
            <div className="message-card">
              <h2>Please select a scene to visualize</h2>
              <p>The flow diagram will show the rules, events, actions, and elements for the selected scene.</p>
              <div className="scene-selector-large">
                <select value={selectedSceneId || ""} onChange={handleSceneChange}>
                  <option value="">-- Select a Scene --</option>
                  {sceneOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="flow-container">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.1}
              maxZoom={1.5}
              defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
              attributionPosition="bottom-left"
              proOptions={{ hideAttribution: true }}
              zoomOnScroll={true}
              panOnScroll={true}
              nodesDraggable={true}
              elementsSelectable={true}
              snapToGrid={true}
              snapGrid={[20, 20]}
            >
              <Controls className="flow-controls" />
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={16} 
                size={1}
                color="#aaaaaa"
              />
              <MiniMap 
                nodeStrokeColor={(n) => {
                  if (n.type === 'whenEvent') return '#FF9800';
                  if (n.type === 'thenAction') return '#4CAF50';
                  if (n.type === 'element') return '#9C27B0';
                  if (n.type === 'rule') return '#2196F3';
                  return '#555';
                }}
                nodeColor={(n) => {
                  if (n.type === 'whenEvent') return '#FF9800';
                  if (n.type === 'thenAction') return '#4CAF50';
                  if (n.type === 'element') return '#9C27B0';
                  if (n.type === 'rule') return '#2196F3';
                  return '#555';
                }}
                maskColor="rgba(0, 0, 0, 0.5)"
              />
            </ReactFlow>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
