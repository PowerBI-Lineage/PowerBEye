export interface Report {
  id: string;
  name: string;
  datasetId: string;
}

export interface Tile {
  id: string;
  title: string;
  reportId: string;
}

export interface Dashboard {
  id: string;
  displayName: string;
  tiles: Tile[];
}

export interface Dataflow {
  objectId: string;
  name: string;
}

export interface Dataset {
  id: string;
  name: string;
}

export interface Workspace {
  id: string;
  name: string;
  reports: Report[];
  dashboards: Dashboard[];
  dataflows: Dataflow[];
  datasets: Dataset[];
}
