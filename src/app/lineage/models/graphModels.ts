export enum NodeType {
  Workspace,
  Dashboard,
  Report,
  Dataset,
  Dataflow
}

export interface Node {
  id: string;
  type: NodeType;
  name: string;
}

export interface Link {
  source: string;
  target: string;
}

