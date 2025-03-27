import React from 'react';

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
  return (
    <div className="scene-selector">
      <select
        value={selectedScene || ''}
        onChange={(e) => onSceneSelect(e.target.value || null)}
        className="scene-select"
      >
        <option value="">All Scenes</option>
        {scenes.map((scene) => (
          <option key={scene.id} value={scene.id}>
            {scene.name}
          </option>
        ))}
      </select>
    </div>
  );
};
