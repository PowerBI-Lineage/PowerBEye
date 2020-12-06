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
}

export interface Link {
  source: string;
  target: string;
}

