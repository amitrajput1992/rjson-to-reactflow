import React from 'react';
import { SceneSelectorContainer, SceneSelect, Option } from './styles';

interface SceneSelectorProps {
  scenes: { id: string; name: string }[];
  selectedScene: string | null;
  onSceneSelect: (sceneId: string | null) => void;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({
  scenes,
  selectedScene,
  onSceneSelect,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSceneSelect(e.target.value || null);
  };

  return (
    <SceneSelectorContainer>
      <SceneSelect
        value={selectedScene || ''}
        onChange={handleChange}
      >
        <Option value="">All Scenes</Option>
        {scenes.map((scene) => (
          <Option key={scene.id} value={scene.id}>
            {scene.name}
          </Option>
        ))}
      </SceneSelect>
    </SceneSelectorContainer>
  );
};
