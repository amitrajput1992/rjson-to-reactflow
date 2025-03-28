import styled from 'styled-components';

export const SceneSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SceneSelect = styled.select`
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  color: #333;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }

  option {
    padding: 8px;
  }
`;

export const Option = styled.option``;
