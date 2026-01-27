export interface AmendmentRequest {
  _id: string;
  versionNumber: number;
  previousVersionNumber: number;
  changesSummary: string;
  changedFields: Array<{
    fieldName: string;
    changeType: string;
    oldValue: any;
    newValue: any;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    country?: string;
    tribe?: string;
  };
  submissionId: {
    _id: string;
    title: string;
    status: string;
  };
  approvedContentId?: {
    _id: string;
    title: string;
    currentVersion: number;
  };
  reviewedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}