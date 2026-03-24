export interface Submission {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    country?: string;
    tribe?: string;
  };
  country: string;
  stateRegion: string;
  tribe: string;
  village?: string;
  culturalDomain: string;
  title: string;
  description: string;
  keywords: string[];
  language: string;
  dateOfRecording?: string;
  culturalSignificance?: string;
  contentFileType: string;
  contentUrl: string;
  consent: {
    fileType: string;
    fileUrl: string;
    consentType: string;
    consentNames: string;
    consentDate: string;
    permissionType: string[];
    duration: string;
    digitalSignature?: string;
  };
  accessTier: string;
  contentWarnings?: string[];
  warningOtherText?: string;
  translationFileUrl?: string;
  backgroundInfo?: string;
  verificationDocUrl?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  reviewedBy?: {
    name: string;
    email: string;
  };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
  downloads?: number;
}