import { RT, RecordNode } from '@gmetrixr/project-rjson';

export interface projectRJSON {
  props: {
    version: string;
  };
  records: {
    scene?: {
      [key: string]: {
        name: string;
        order: number;
        records?: {
          rule?: {
            [key: string]: {
              name: string;
              records?: {
                when_event?: {
                  [key: string]: {
                    type: string;
                    order: number;
                    props: {
                      event: string;
                      we_co_id: number;
                      we_co_type: string;
                      we_properties: any[];
                    };
                  };
                };
                then_action?: {
                  [key: string]: {
                    type: string;
                    order: number;
                    props: {
                      action: string;
                      ta_co_id: number;
                      ta_co_type: string;
                      ta_properties: any[];
                    };
                  };
                };
                element?: {
                  [key: string]: {
                    name: string;
                    props: {
                      element_type: string;
                      [key: string]: any;
                    };
                  };
                };
              };
            };
          };
          element?: {
            [key: string]: {
              name: string;
              props: {
                element_type: string;
                [key: string]: any;
              };
            };
          };
        };
      };
    };
  };
}

export interface RJsonProject {
  project: {
    id: number;
    name: string;
    tags: string[];
    uuid: string;
    active: boolean;
    engine: string;
    thumbnail: string;
    created_at: string;
    description: string | null;
    modified_at: string;
    organization_id: number;
    modified_by_user_id: any | null;
  };
  projectJson: projectRJSON;
  org: any;
}

export interface RJsonScene extends RecordNode<RT.scene> {
  // Scene specific extensions can be added here
}

export interface RJsonElement extends RecordNode<RT.element> {
  // Element specific extensions can be added here
}

export interface RJsonRule extends RecordNode<RT.rule> {
  // Rule specific extensions can be added here
}
