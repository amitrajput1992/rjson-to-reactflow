import { RT, RecordNode } from '@gmetrixr/project-rjson';
import { RJsonProject } from '../types/rjson';

export class RJsonService {
  private project: RJsonProject;

  constructor() {
    this.project = {
      project: {
        id: 0,
        name: '',
        tags: null,
        uuid: '',
        active: true,
        engine: '',
        thumbnail: '',
        created_at: '',
        description: null,
        modified_at: '',
        organization_id: 0,
        modified_by_user_id: null
      },
      projectJson: {
        props: {
          version: '1.0'
        },
        records: {}
      },
      org: {}
    };
  }

  /**
   * Load an existing project JSON
   */
  loadProject(projectData: RJsonProject) {
    this.project = projectData;
  }

  /**
   * Get the current project
   */
  getProject(): RJsonProject {
    return this.project;
  }

  /**
   * Convert project to Node-RED format
   * This is where we'll implement the conversion logic
   */
  toNodeRed() {
    // TODO: Implement conversion logic
    const nodeRedFlow = {
      // Basic Node-RED flow structure
      id: "flow_1",
      label: this.project.project.name || "Converted Flow",
      nodes: [],
      // We'll populate this based on the RJSON structure
    };

    return nodeRedFlow;
  }
}
