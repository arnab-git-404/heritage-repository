import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  FileEdit,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  History,
  MapPin,
  Calendar,
  Tag,
  Globe,
  Shield,
  FileText,
  Video,
  Image as ImageIcon,
  Music,
  File,
} from 'lucide-react';

interface Submission {
  _id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  
  // Category
  country: string;
  stateRegion: string;
  tribe: string;
  village?: string;
  culturalDomain: string;
  
  // Description
  description: string;
  keywords: string[];
  language: string;
  dateOfRecording?: string;
  culturalSignificance?: string;
  
  // Content
  contentFileType: string;
  contentUrl: string;
  
  // Consent
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
  
  // Access
  accessTier: string;
  contentWarnings?: string[];
  warningOtherText?: string;
  
  // Additional files
  translationFileUrl?: string;
  backgroundInfo?: string;
  verificationDocUrl?: string;
  
  // Status tracking
  createdAt: string;
  updatedAt: string;
  statusChangeReason?: string;
  rejectionReason?: string;
  approvedAt?: string;
  
  // Amendment status
  amendmentStatus?: {
    canEdit: boolean;
    hasPendingAmendment: boolean;
    currentVersion: number;
    dataSource: 'submission' | 'pendingAmendment' | 'approvedContent';
    pending?: {
      id: string;
      proposedVersion: number;
      changesSummary: string;
      changedFieldsCount: number;
      requestedAt: string;
    };
    latestRejected?: {
      id: string;
      proposedVersion: number;
      changesSummary: string;
      rejectionReason: string;
      rejectedAt: string;
    };
  };
  
  // Resubmission tracking
  isResubmission?: boolean;
  resubmissionCount?: number;
  changesSummary?: string;
}

export default function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') ;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch submission');

      const data = await res.json();
      setSubmission(data);
    } catch (error) {
      console.error('Error fetching submission:', error);
      alert('Failed to load submission details');
      navigate('/my-submissions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: 'secondary' as const, icon: Clock, label: 'Pending Review' },
      approved: { variant: 'default' as const, icon: CheckCircle, label: 'Approved' },
      rejected: { variant: 'destructive' as const, icon: XCircle, label: 'Rejected' },
    };

    const { variant, icon: Icon, label } = config[status as keyof typeof config] || config.pending;

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getContentIcon = (fileType: string) => {
    const icons = {
      video: Video,
      audio: Music,
      image: ImageIcon,
      text: FileText,
      '3d': File,
    };
    return icons[fileType as keyof typeof icons] || File;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Submission not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const ContentIcon = getContentIcon(submission.contentFileType);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/profile')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Submissions
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{submission.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              {getStatusBadge(submission.status)}
              
              {submission.amendmentStatus && (
                <Badge variant="outline" className="font-mono">
                  <History className="h-3 w-3 mr-1" />
                  v{submission.amendmentStatus.currentVersion}
                </Badge>
              )}

              {submission.amendmentStatus?.dataSource === 'pendingAmendment' && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  <Clock className="h-3 w-3 mr-1" />
                  Viewing Pending Changes
                </Badge>
              )}

              {submission.isResubmission && (
                <Badge variant="secondary">
                  Resubmission #{submission.resubmissionCount}
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {submission.amendmentStatus?.canEdit && submission.status === 'approved' && (
              <Button onClick={() => navigate(`/edit-submission/${submission._id}`)}>
                <FileEdit className="h-4 w-4 mr-2" />
                Request Amendment
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Amendment Alerts */}
      {submission.amendmentStatus?.pending && (
        <Alert className="mb-6 border-blue-500 bg-blue-50">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Amendment Pending Review</AlertTitle>
          <AlertDescription className="text-blue-800">
            <p className="font-semibold mb-1">
              Proposed v{submission.amendmentStatus.pending.proposedVersion}
            </p>
            <p className="text-sm">
              <strong>Changes:</strong> {submission.amendmentStatus.pending.changesSummary}
            </p>
            <p className="text-xs mt-2 text-blue-600">
              Submitted {formatDate(submission.amendmentStatus.pending.requestedAt)}
            </p>
            <p className="text-xs mt-2 font-semibold">
              💡 You're viewing your proposed changes. They will replace the current version if approved.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {submission.amendmentStatus?.latestRejected && !submission.amendmentStatus.pending && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900">Previous Amendment Rejected</AlertTitle>
          <AlertDescription className="text-red-800">
            <p className="text-sm mb-1">
              <strong>Proposed Changes:</strong> {submission.amendmentStatus.latestRejected.changesSummary}
            </p>
            <p className="text-sm">
              <strong>Rejection Reason:</strong> {submission.amendmentStatus.latestRejected.rejectionReason}
            </p>
            <p className="text-xs mt-2 text-red-600">
              Rejected {formatDate(submission.amendmentStatus.latestRejected.rejectedAt)}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => navigate(`/edit-submission/${submission._id}`)}
            >
              Submit New Amendment
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {submission.status === 'pending' && (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Awaiting Initial Approval</strong>
            <p className="text-sm mt-1">
              Your submission is being reviewed by admins. You cannot make changes until it's approved.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {submission.status === 'rejected' && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900">Submission Rejected</AlertTitle>
          <AlertDescription className="text-red-800">
            {submission.statusChangeReason && (
              <p className="text-sm mb-2">
                <strong>Reason:</strong> {submission.statusChangeReason}
              </p>
            )}
            <p className="text-sm">
              You cannot edit rejected submissions. Please create a new submission with corrections.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Location & Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{submission.country}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">State/Region</p>
                  <p className="font-medium">{submission.stateRegion}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tribe</p>
                  <p className="font-medium">{submission.tribe}</p>
                </div>
                {submission.village && (
                  <div>
                    <p className="text-sm text-muted-foreground">Village</p>
                    <p className="font-medium">{submission.village}</p>
                  </div>
                )}
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Cultural Domain</p>
                <Badge variant="secondary" className="mt-1">
                  {submission.culturalDomain}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm whitespace-pre-wrap">{submission.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Language</p>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{submission.language}</span>
                  </div>
                </div>

                {submission.dateOfRecording && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date of Recording</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(submission.dateOfRecording)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {submission.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {submission.culturalSignificance && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cultural Significance</p>
                    <p className="text-sm whitespace-pre-wrap">{submission.culturalSignificance}</p>
                  </div>
                </>
              )}

              {submission.backgroundInfo && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Background Information</p>
                    <p className="text-sm whitespace-pre-wrap">{submission.backgroundInfo}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Content File */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ContentIcon className="h-5 w-5" />
                Content File
              </CardTitle>
              <CardDescription>
                Type: {submission.contentFileType.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ContentIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Main Content</p>
                    <p className="text-xs text-muted-foreground">
                      {submission.contentFileType.charAt(0).toUpperCase() + submission.contentFileType.slice(1)} file
                    </p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <a href={submission.contentUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Files */}
          {(submission.translationFileUrl || submission.verificationDocUrl) && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {submission.translationFileUrl && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Translation File</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={submission.translationFileUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                )}

                {submission.verificationDocUrl && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Verification Document</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={submission.verificationDocUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Access & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Access & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Access Tier</p>
                <Badge variant={
                  submission.accessTier === 'Public' ? 'default' :
                  submission.accessTier === 'Restricted' ? 'secondary' :
                  'destructive'
                }>
                  {submission.accessTier}
                </Badge>
              </div>

              {submission.contentWarnings && submission.contentWarnings.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Content Warnings</p>
                    <div className="space-y-1">
                      {submission.contentWarnings.map((warning, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                          <span>{warning}</span>
                        </div>
                      ))}
                    </div>
                    {submission.warningOtherText && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {submission.warningOtherText}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Consent Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consent Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Consent Type</p>
                <p className="text-sm font-medium">{submission.consent.consentType}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Consenting Party</p>
                <p className="text-sm font-medium">{submission.consent.consentNames}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Consent Date</p>
                <p className="text-sm font-medium">{formatDate(submission.consent.consentDate)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <Badge variant="outline">{submission.consent.duration}</Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Permitted Uses</p>
                <div className="space-y-1">
                  {submission.consent.permissionType.map((type, index) => (
                    <Badge key={index} variant="secondary" className="mr-1 mb-1">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={submission.consent.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  View Consent Document
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-xs text-muted-foreground">{formatDate(submission.createdAt)}</p>
                  </div>
                </div>

                {submission.updatedAt !== submission.createdAt && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-xs text-muted-foreground">{formatDate(submission.updatedAt)}</p>
                    </div>
                  </div>
                )}

                {submission.approvedAt && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Approved</p>
                      <p className="text-xs text-muted-foreground">{formatDate(submission.approvedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}