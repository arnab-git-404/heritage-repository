export interface Comparison {
  current: {
    version: string;
    label: string;
    data: any;
  };
  proposed: {
    version: string;
    label: string;
    data: any;
  };
  changes: Array<{
    field: string;
    type: string;
    before: any;
    after: any;
  }>;
  summary: string;
}