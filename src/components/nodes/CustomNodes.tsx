import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { rn } from '@gmetrixr/project-rjson';
import {
  NodeContainer,
  NodeHeader,
  NodeContent,
  RuleProperties,
  RuleProperty,
  EventDetails,
  EventProperties,
  ActionDetails,
  ActionProperties,
  ProjectNodeContainer,
  SceneNodeContainer,
  RuleNodeContainer,
  WhenEventNodeContainer,
  ThenActionNodeContainer,
  ElementNodeContainer,
  LeftHandle,
  RightHandle,
} from './styles';

// Project Node
export function ProjectNode({ data }: NodeProps) {
  return (
    <ProjectNodeContainer>
      <NodeHeader bgColor="#E3F2FD" color="#1565C0">
        <h3>{data.name}</h3>
        <p>Version: {data.version}</p>
      </NodeHeader>
      <RightHandle>
        <Handle type="source" position={Position.Right} id="project-source" />
      </RightHandle>
    </ProjectNodeContainer>
  );
}

// Scene Node
export function SceneNode({ data }: NodeProps) {
  return (
    <SceneNodeContainer>
      <LeftHandle>
        <Handle type="target" position={Position.Left} id="scene-target" />
      </LeftHandle>
      <NodeHeader bgColor="#E8F5E9" color="#2E7D32">
        <h3>{data.name}</h3>
      </NodeHeader>
      <RightHandle>
        <Handle type="source" position={Position.Right} id="scene-source" />
      </RightHandle>
    </SceneNodeContainer>
  );
}

// Rule Node
export const RuleNode = (props: NodeProps) => {
  const { data } = props;
  
  if (!data) return null;

  return (
    <RuleNodeContainer>
      <LeftHandle>
        <Handle type="target" position={Position.Left} id="rule-target" />
      </LeftHandle>
      <NodeHeader bgColor="#E3F2FD" color="#0D47A1">
        <h4>{data.label}</h4>
      </NodeHeader>
      <NodeContent>
        <RuleProperties>
          {data.tracked && <RuleProperty>Tracked</RuleProperty>}
          {data.disabled && <RuleProperty disabled>Disabled</RuleProperty>}
          {data.eventsAnd && <RuleProperty>Events AND</RuleProperty>}
        </RuleProperties>
      </NodeContent>
      <RightHandle>
        <Handle type="source" position={Position.Right} id="rule-source" />
      </RightHandle>
    </RuleNodeContainer>
  );
};

interface WhenEventNodeData {
  eventType: rn.RuleEvent;
  elementName: string;
  properties: string[];
  label: string;
}

interface ThenActionNodeData {
  actionType: rn.RuleAction;
  elementName: string;
  properties: string[];
  label: string;
}

// When Event Node
export const WhenEventNode = (props: NodeProps<WhenEventNodeData>) => {
  const { data } = props;
  
  if (!data) return null;

  const displayName = rn.rEventDisplayName[data.eventType];
  
  return (
    <WhenEventNodeContainer>
      <LeftHandle>
        <Handle type="target" position={Position.Left} id="when-target" />
      </LeftHandle>
      <NodeHeader bgColor="#FFF3E0" color="#E65100">
        <h4>{displayName || data.eventType}</h4>
      </NodeHeader>
      <NodeContent>
        <EventDetails>
          <p><strong>Element:</strong> {data.elementName}</p>
          {data.properties.length > 0 && (
            <EventProperties>
              <p><strong>Properties:</strong></p>
              <ul>
                {data.properties.map((prop: string, index: number) => (
                  <li key={index}>{prop}</li>
                ))}
              </ul>
            </EventProperties>
          )}
        </EventDetails>
      </NodeContent>
      <RightHandle>
        <Handle type="source" position={Position.Right} id="when-source" />
      </RightHandle>
    </WhenEventNodeContainer>
  );
};

// Then Action Node
export const ThenActionNode = (props: NodeProps<ThenActionNodeData>) => {
  const { data } = props;
  
  if (!data) return null;

  const displayName = rn.rActionDisplayName[data.actionType];
  
  return (
    <ThenActionNodeContainer>
      <LeftHandle>
        <Handle type="target" position={Position.Left} id="then-target" />
      </LeftHandle>
      <NodeHeader bgColor="#E8F5E9" color="#1B5E20">
        <h4>{displayName || data.actionType}</h4>
      </NodeHeader>
      <NodeContent>
        <ActionDetails>
          <p><strong>Element:</strong> {data.elementName}</p>
          {data.properties.length > 0 && (
            <ActionProperties>
              <p><strong>Properties:</strong></p>
              <ul>
                {data.properties.map((prop: string, index: number) => (
                  <li key={index}>{prop}</li>
                ))}
              </ul>
            </ActionProperties>
          )}
        </ActionDetails>
      </NodeContent>
      <RightHandle>
        <Handle type="source" position={Position.Right} id="then-source" />
      </RightHandle>
    </ThenActionNodeContainer>
  );
};

// Element Node
export const ElementNode = (props: NodeProps) => {
  const { data } = props;
  
  if (!data) return null;

  return (
    <ElementNodeContainer>
      <LeftHandle>
        <Handle type="target" position={Position.Left} id="element-target" />
      </LeftHandle>
      <NodeHeader bgColor="#F3E5F5" color="#6A1B9A">
        <h4>{data.label}</h4>
      </NodeHeader>
      <NodeContent>
        <p><strong>Type:</strong> {data.type}</p>
      </NodeContent>
    </ElementNodeContainer>
  );
};
