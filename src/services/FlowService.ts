import { Node, Edge } from 'reactflow';
import { RJsonProject } from '../types/rjson';

interface RuleProps {
  tracked?: boolean;
  disabled?: boolean;
  events_and?: boolean;
  accent_color?: string;
}

interface WhenEvent {
  type: string;
  order: number;
  props: {
    event: string;
    we_co_id: number;
    we_co_type: string;
    we_properties: any[];
  };
}

interface ThenAction {
  type: string;
  order: number;
  props: {
    action: string;
    ta_co_id: number;
    ta_co_type: string;
    ta_properties: any[];
  };
}

interface Rule {
  name: string;
  order: number;
  props?: RuleProps;
  records?: {
    when_event?: {
      [key: string]: WhenEvent;
    };
    then_action?: {
      [key: string]: ThenAction;
    };
  };
}

interface Element {
  name: string;
  props: {
    [key: string]: any;
    element_type: string;
  };
}

interface Scene {
  name: string;
  order: number;
  records?: {
    rule?: {
      [key: string]: Rule;
    };
    element?: {
      [key: string]: Element;
    };
  };
}

interface ProjectJson {
  type: string;
  props: {
    version: number;
    [key: string]: any;
  };
  records: {
    scene?: { [key: string]: Scene };
    menu?: { [key: string]: any };
    [key: string]: any;
  };
}

export class FlowService {
  /**
   * Converts an RJsonProject to a flow of nodes and edges.
   * 
   * @param rjson The RJsonProject to convert.
   * @param selectedSceneId The ID of the scene to process, or null to process all scenes.
   * @returns An object containing the nodes and edges of the flow.
   */
  static convertToFlow(rjson: RJsonProject, selectedSceneId: string | null = null): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Constants for layout
    const COLUMN_WIDTH = 300;
    const ROW_HEIGHT = 120;
    const ELEMENT_OFFSET_X = 300;
    
    // Add project node only if we're showing all scenes or if it's the first time
    if (!selectedSceneId) {
      // Add project node at the leftmost position
      const projectNode: Node = {
        id: 'project',
        type: 'projectNode',
        position: { x: 50, y: 50 },
        data: {
          name: rjson.project.name,
          version: rjson.projectJson.props.version,
          isExpanded: true,
          onExpand: undefined, // Will be set by the App component
          color: '#E3F2FD'
        }
      };
      nodes.push(projectNode);
    }

    // Get scenes to process
    const scenes = rjson.projectJson.records.scene || {};
    const scenesToProcess = selectedSceneId 
      ? { [selectedSceneId]: scenes[selectedSceneId] }
      : scenes;

    // Process scenes
    let sceneY = 50; // Starting Y position for scenes
    
    Object.entries(scenesToProcess).forEach(([sceneId, sceneData], sceneIndex) => {
      // Add scene node in column 1
      const sceneNode: Node = {
        id: `scene-${sceneId}`,
        type: 'sceneNode',
        position: { 
          x: selectedSceneId ? 50 : COLUMN_WIDTH, 
          y: sceneY 
        },
        data: {
          name: sceneData.name,
          order: sceneData.order,
          isExpanded: true,
          onExpand: undefined, // Will be set by the App component
          color: '#E8F5E9'
        }
      };
      nodes.push(sceneNode);

      // Connect project to scene if showing all scenes
      if (!selectedSceneId) {
        edges.push({
          id: `project-scene-${sceneId}`,
          source: 'project',
          target: `scene-${sceneId}`,
          type: 'smoothstep'
        });
      }

      // Initialize ruleY outside the if statement to fix scope issue
      let ruleY = sceneY; // Start rules at the same Y as the scene

      // Process rules for this scene
      if (sceneData.records?.rule) {
        const rules = Object.entries(sceneData.records.rule);
        const elementMap: { [key: string]: Element } = {};
        
        // Create element map for quick lookup
        if (sceneData.records.element) {
          Object.entries(sceneData.records.element).forEach(([elementId, elementData]) => {
            elementMap[elementId] = {
              name: elementData.name,
              props: elementData.props
            };
          });
        }

        // Sort rules by order (more negative numbers first)
        const sortedRules = [...rules].sort((a, b) => {
          const orderA = (a[1] as Rule).order || 0;
          const orderB = (b[1] as Rule).order || 0;
          return orderA - orderB;
        });

        // Process each rule
        sortedRules.forEach((rule: [string, any], ruleIndex: number) => {
          const ruleData = rule[1] as Rule;
          const ruleId = rule[0];
          
          // Create rule node in column 2
          const ruleNode: Node = {
            id: `rule-${ruleId}`,
            type: 'rule',
            data: { 
              label: ruleData.name,
              type: 'rule',
              color: '#E3F2FD',
              tracked: ruleData.props?.tracked || false,
              disabled: ruleData.props?.disabled || false,
              eventsAnd: ruleData.props?.events_and || false,
              whenEvent: {
                event: '',
                elementName: '',
                elementId: '',
                properties: [] as string[]
              },
              thenAction: {
                action: '',
                elementName: '',
                elementId: '',
                properties: [] as string[]
              }
            },
            position: { 
              x: selectedSceneId ? COLUMN_WIDTH : COLUMN_WIDTH * 2, 
              y: ruleY 
            }
          };
          nodes.push(ruleNode);
          
          // Connect scene to rule
          edges.push({
            id: `e_scene_${sceneId}_rule_${ruleId}`,
            source: `scene-${sceneId}`,
            target: `rule-${ruleId}`,
            type: 'smoothstep'
          });
          
          // Extract when_event details
          if (ruleData.records?.when_event) {
            const whenEventId = Object.keys(ruleData.records.when_event)[0];
            const whenEvent = ruleData.records.when_event[whenEventId];
            const weElementId = whenEvent.props.we_co_id.toString();
            const weElement = elementMap[weElementId];
            
            // Create when_event node
            const whenEventNode: Node = {
              id: `when-${ruleId}-${whenEventId}`,
              type: 'whenEvent',
              data: {
                label: `When: ${whenEvent.props.event}`,
                event: whenEvent.props.event,
                elementName: weElement?.name || 'Unknown Element',
                properties: whenEvent.props.we_properties.map((id: number) => {
                  const propElement = elementMap[id.toString()];
                  return propElement?.name || id.toString();
                }),
                color: '#FFF3E0' // Orange for when_event
              },
              position: { 
                x: selectedSceneId ? COLUMN_WIDTH * 2 : COLUMN_WIDTH * 3, 
                y: ruleY - 60 
              }
            };
            nodes.push(whenEventNode);
            
            // Connect rule to when_event
            edges.push({
              id: `e_rule_${ruleId}_when`,
              source: `rule-${ruleId}`,
              target: whenEventNode.id,
              type: 'smoothstep',
              animated: true
            });
            
            // If the when_event references an element, add it
            if (weElement) {
              // Create element node
              const elementNodeId = `element-${weElementId}`;
              if (!nodes.find(n => n.id === elementNodeId)) {
                nodes.push({
                  id: elementNodeId,
                  type: 'element',
                  data: {
                    label: weElement.name,
                    type: 'element',
                    color: '#F3E5F5' // Purple for elements
                  },
                  position: { 
                    x: selectedSceneId ? COLUMN_WIDTH * 2 + ELEMENT_OFFSET_X : COLUMN_WIDTH * 3 + ELEMENT_OFFSET_X, 
                    y: ruleY - 60 
                  }
                });
              }
              
              // Connect when_event to element
              edges.push({
                id: `e_when_${ruleId}_element_${weElementId}`,
                source: whenEventNode.id,
                target: elementNodeId,
                type: 'smoothstep'
              });
            }
            
            // Update rule node with when_event details
            const ruleNodeIndex = nodes.findIndex(n => n.id === `rule-${ruleId}`);
            if (ruleNodeIndex !== -1) {
              nodes[ruleNodeIndex].data.whenEvent = {
                event: whenEvent.props.event,
                elementName: weElement?.name || 'Unknown Element',
                elementId: weElementId,
                properties: whenEvent.props.we_properties.map((id: number) => {
                  const propElement = elementMap[id.toString()];
                  return propElement?.name || id.toString();
                })
              };
            }
          }
          
          // Extract then_action details
          if (ruleData.records?.then_action) {
            const thenActionId = Object.keys(ruleData.records.then_action)[0];
            const thenAction = ruleData.records.then_action[thenActionId];
            const taElementId = thenAction.props.ta_co_id.toString();
            const taElement = elementMap[taElementId];
            
            // Create then_action node
            const thenActionNode: Node = {
              id: `then-${ruleId}-${thenActionId}`,
              type: 'thenAction',
              data: {
                label: `Then: ${thenAction.props.action}`,
                action: thenAction.props.action,
                elementName: taElement?.name || 'Unknown Element',
                properties: thenAction.props.ta_properties.map((id: number) => {
                  const propElement = elementMap[id.toString()];
                  return propElement?.name || id.toString();
                }),
                color: '#E8F5E9' // Green for then_action
              },
              position: { 
                x: selectedSceneId ? COLUMN_WIDTH * 2 : COLUMN_WIDTH * 3, 
                y: ruleY + 60 
              }
            };
            nodes.push(thenActionNode);
            
            // Connect rule to then_action
            edges.push({
              id: `e_rule_${ruleId}_then`,
              source: `rule-${ruleId}`,
              target: thenActionNode.id,
              type: 'smoothstep',
              animated: true
            });
            
            // If the then_action references an element, add it
            if (taElement) {
              // Create element node if it doesn't exist
              const elementNodeId = `element-${taElementId}`;
              if (!nodes.find(n => n.id === elementNodeId)) {
                nodes.push({
                  id: elementNodeId,
                  type: 'element',
                  data: {
                    label: taElement.name,
                    type: 'element',
                    color: '#F3E5F5' // Purple for elements
                  },
                  position: { 
                    x: selectedSceneId ? COLUMN_WIDTH * 2 + ELEMENT_OFFSET_X : COLUMN_WIDTH * 3 + ELEMENT_OFFSET_X, 
                    y: ruleY + 60 
                  }
                });
              }
              
              // Connect then_action to element
              edges.push({
                id: `e_then_${ruleId}_element_${taElementId}`,
                source: thenActionNode.id,
                target: elementNodeId,
                type: 'smoothstep'
              });
            }
            
            // Update rule node with then_action details
            const ruleNodeIndex = nodes.findIndex(n => n.id === `rule-${ruleId}`);
            if (ruleNodeIndex !== -1) {
              nodes[ruleNodeIndex].data.thenAction = {
                action: thenAction.props.action,
                elementName: taElement?.name || 'Unknown Element',
                elementId: taElementId,
                properties: thenAction.props.ta_properties.map((id: number) => {
                  const propElement = elementMap[id.toString()];
                  return propElement?.name || id.toString();
                })
              };
            }
          }
          
          // Update Y position for next rule
          ruleY += ROW_HEIGHT * 2.5; // Increase Y for next rule
        });
      }
      
      // Update Y position for next scene - now ruleY is always in scope
      const nextSceneY = Math.max(ROW_HEIGHT * 3, ruleY - sceneY + ROW_HEIGHT);
      sceneY += nextSceneY;
    });

    return { nodes, edges };
  }

  /**
   * Gets a list of scenes from an RJsonProject.
   * 
   * @param rjson The RJsonProject to get scenes from.
   * @returns A list of scene IDs and names.
   */
  static getSceneList(rjson: RJsonProject): { id: string; name: string }[] {
    const scenes = rjson.projectJson.records.scene || {};
    return Object.entries(scenes).map(([id, data]) => ({
      id,
      name: data.name
    }));
  }
}
