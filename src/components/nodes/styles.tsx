import styled from 'styled-components';

export const NodeContainer = styled.div`
  border-radius: 8px;
  min-width: 150px;
  max-width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  border: 1px solid #e0e0e0;
  font-family: Arial, sans-serif;
`;

export const NodeHeader = styled.div<{ bgColor: string; color: string }>`
  padding: 8px 12px;
  border-radius: 8px 8px 0 0;
  background-color: ${props => props.bgColor};
  color: ${props => props.color};
  font-weight: bold;
`;

export const NodeContent = styled.div`
  padding: 12px;
`;

export const RuleProperties = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const RuleProperty = styled.span<{ disabled?: boolean }>`
  padding: 4px 8px;
  background-color: ${props => props.disabled ? '#f5f5f5' : '#e3f2fd'};
  border-radius: 4px;
  font-size: 12px;
  color: ${props => props.disabled ? '#666' : '#1565c0'};
`;

export const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EventProperties = styled.div`
  margin-top: 8px;
`;

export const ActionDetails = styled(EventDetails)``;

export const ActionProperties = styled(EventProperties)``;

// Node-specific styles
export const ProjectNodeContainer = styled(NodeContainer)`
  min-width: 200px;
`;

export const SceneNodeContainer = styled(NodeContainer)`
  min-width: 180px;
`;

export const RuleNodeContainer = styled(NodeContainer)`
  min-width: 160px;
`;

export const WhenEventNodeContainer = styled(NodeContainer)`
  min-width: 180px;
`;

export const ThenActionNodeContainer = styled(NodeContainer)`
  min-width: 180px;
`;

export const ElementNodeContainer = styled(NodeContainer)`
  min-width: 160px;
`;

export const HandleContainer = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #1976d2;
  cursor: pointer;
`;

export const LeftHandle = styled(HandleContainer)`
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
`;

export const RightHandle = styled(HandleContainer)`
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
`;
