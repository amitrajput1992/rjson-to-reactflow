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
import { ApiService } from './services/ApiService';
import { RJsonProject } from './types/rjson';

const defaultProject = {
  id: 0,
  name: '',
  tags: [],
  uuid: '',
  active: false,
  engine: '',
  thumbnail: '',
  created_at: '',
  description: null,
  modified_at: '',
  organization_id: 0,
  modified_by_user_id: null
};

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
  const [token, setToken] = useState('');
  const [projectUuid, setProjectUuid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle API fetch
  const handleApiFetch = useCallback(async () => {
    if (!token || !projectUuid) {
      setApiError('Please provide both token and project UUID');
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const projectJson = await ApiService.fetchProjectJson(token, projectUuid);
      setRjsonFile({ 
        project: defaultProject,
        projectJson,
        org: null 
      });
      setApiError(null);
    } catch (error) {
      setApiError('Failed to fetch project data. Please check your token and project UUID.');
      setRjsonFile(null);
    } finally {
      setIsLoading(false);
    }
  }, [token, projectUuid]);

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
      </div>
      
      <div className="content">
        {!rjsonFile ? (
          <div className="no-file-message">
            <div className="message-card">
              <h2>Enter your API credentials to get started</h2>
              <p>Enter your API token and project UUID to fetch the RJSON data from the GMetri API.</p>
              <div className="api-auth-container">
          <div className="input-group">
            <label htmlFor="token">API Token:</label>
            <input
              type="password"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your API token"
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="project-uuid">Project UUID:</label>
            <input
              type="text"
              id="project-uuid"
              value={projectUuid}
              onChange={(e) => setProjectUuid(e.target.value)}
              placeholder="Enter project UUID"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleApiFetch}
            disabled={isLoading || !token || !projectUuid}
            className="fetch-button"
          >
            {isLoading ? 'Fetching...' : 'Fetch Project Data'}
          </button>
          {apiError && <div className="api-error">{apiError}</div>}
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
