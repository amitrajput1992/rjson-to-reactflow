import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

// Project Node
export function ProjectNode({ data }: NodeProps) {
  return (
    <div className="node project-node">
      <div className="node-header" style={{ backgroundColor: '#E3F2FD', color: '#1565C0' }}>
        <h3>{data.name}</h3>
        <p>Version: {data.version}</p>
      </div>
      <Handle type="source" position={Position.Right} id="project-source" />
    </div>
  );
}

// Scene Node
export function SceneNode({ data }: NodeProps) {
  return (
    <div className="node scene-node">
      <Handle type="target" position={Position.Left} id="scene-target" />
      <div className="node-header" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
        <h3>{data.name}</h3>
      </div>
      <Handle type="source" position={Position.Right} id="scene-source" />
    </div>
  );
}

// Rule Node
export const RuleNode = (props: NodeProps) => {
  const { data } = props;
  
  if (!data) return null;

  return (
    <div className="node rule-node">
      <Handle type="target" position={Position.Left} id="rule-target" />
      <div className="node-header" style={{ backgroundColor: '#E3F2FD', color: '#0D47A1' }}>
        <h4>{data.label}</h4>
      </div>
      <div className="node-content">
        <div className="rule-properties">
          {data.tracked && <span className="rule-property">Tracked</span>}
          {data.disabled && <span className="rule-property disabled">Disabled</span>}
          {data.eventsAnd && <span className="rule-property">Events AND</span>}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="rule-source" />
    </div>
  );
};

// When Event Node
export const WhenEventNode = (props: NodeProps) => {
  const { data } = props;
  
  if (!data) return null;

  return (
    <div className="node when-event-node">
      <Handle type="target" position={Position.Left} id="when-target" />
      <div className="node-header" style={{ backgroundColor: '#FFF3E0', color: '#E65100' }}>
        <h4>{data.label}</h4>
      </div>
      <div className="node-content">
        <div className="event-details">
          <p><strong>Element:</strong> {data.elementName}</p>
          {data.properties.length > 0 && (
            <div className="event-properties">
              <p><strong>Properties:</strong></p>
              <ul>
                {data.properties.map((prop: string, index: number) => (
                  <li key={index}>{prop}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="when-source" />
    </div>
  );
};

// Then Action Node
export const ThenActionNode = (props: NodeProps) => {
  const { data } = props;
  
  if (!data) return null;

  return (
    <div className="node then-action-node">
      <Handle type="target" position={Position.Left} id="then-target" />
      <div className="node-header" style={{ backgroundColor: '#E8F5E9', color: '#1B5E20' }}>
        <h4>{data.label}</h4>
      </div>
      <div className="node-content">
        <div className="action-details">
          <p><strong>Element:</strong> {data.elementName}</p>
          {data.properties.length > 0 && (
            <div className="action-properties">
              <p><strong>Properties:</strong></p>
              <ul>
                {data.properties.map((prop: string, index: number) => (
                  <li key={index}>{prop}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="then-source" />
    </div>
  );
};

// Element Node
export const ElementNode = (props: NodeProps) => {
  const { data } = props;
  
  if (!data) return null;

  return (
    <div className="node element-node">
      <Handle type="target" position={Position.Left} id="element-target" />
      <div className="node-header" style={{ backgroundColor: '#F3E5F5', color: '#6A1B9A' }}>
        <h4>{data.label}</h4>
      </div>
      <div className="node-content">
        <p><strong>Type:</strong> {data.type}</p>
      </div>
    </div>
  );
};

// Add CSS for all nodes
const nodeStyles = `
  .node {
    border-radius: 8px;
    min-width: 150px;
    max-width: 250px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: white;
    border: 1px solid #e0e0e0;
    font-family: Arial, sans-serif;
  }
  
  .node-header {
    padding: 8px 12px;
    border-radius: 8px 8px 0 0;
    color: white;
    font-weight: bold;
  }
  
  .node-header h3, .node-header h4 {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .node-content {
    padding: 12px;
  }
  
  .project-node {
    min-width: 200px;
  }
  
  .scene-node {
    min-width: 180px;
  }
  
  .rule-node {
    min-width: 160px;
  }
  
  .when-event-node, .then-action-node {
    min-width: 180px;
  }
  
  .element-node {
    min-width: 140px;
  }
  
  .rule-properties {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 5px;
  }
  
  .rule-property {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
    background-color: #E3F2FD;
    color: #1976D2;
  }
  
  .rule-property.disabled {
    background-color: #FFEBEE;
    color: #D32F2F;
  }
  
  .event-details, .action-details {
    font-size: 12px;
  }
  
  .event-details p, .action-details p {
    margin: 4px 0;
  }
  
  .event-properties ul, .action-properties ul {
    margin: 4px 0;
    padding-left: 20px;
  }
  
  .event-properties li, .action-properties li {
    margin-bottom: 2px;
  }
`;

// Apply styles
const styleElement = document.createElement('style');
styleElement.textContent = nodeStyles;
document.head.appendChild(styleElement);
