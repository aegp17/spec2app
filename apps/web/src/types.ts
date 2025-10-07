export interface Metadata {
  name: string;
  domain: string;
  locale: string;
  description?: string;
  version?: string;
}

export interface Attribute {
  name: string;
  type: string;
  required: boolean;
  unique?: boolean;
  enum?: string[];
}

export interface Entity {
  name: string;
  attributes: Attribute[];
}

export interface Operation {
  name: string;
  input: string;
  output: string;
  method: string;
}

export interface Service {
  name: string;
  operations: Operation[];
}

export interface UI {
  routes: string[];
  components: string[];
}

export interface DesignContract {
  metadata: Metadata;
  entities: Entity[];
  services: Service[];
  ui: UI;
}

export interface AnalyzeResponse {
  success: boolean;
  contract?: DesignContract;
  errors?: string[];
}

export interface ValidateResponse {
  valid: boolean;
  contract?: DesignContract;
  errors?: string[];
  warnings?: string[];
}

