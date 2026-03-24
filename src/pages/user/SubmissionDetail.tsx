import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { authFetch } from "@/lib/api";
import { EditSubmissionModal } from "@/components/EditSubmissionModal";
import {
  ArrowLeft,
  Calendar,
  Globe,
  MapPin,
  FileText,
  Shield,
  Eye,
  Download,
  FileEdit,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Tag,
  Languages,
  Info,
} from "lucide-react";

interface Submission {
  _id: string;
  userId: string;
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
  contentCloudinaryId: string;
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
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
  downloads?: number;
  amendmentStatus: {
    canEdit: boolean;
    hasPendingAmendment: boolean;
    currentVersion: number;
    dataSource: "submission" | "approvedContent" | "pendingAmendment";
    pending: {
      _id: string;
      proposedVersion: number;
      changesSummary: string;
      requestedAt: string;
      status: string;
    } | null;
    latestRejected: {
      proposedVersion: number;
      changesSummary: string;
      rejectionReason: string;
      rejectedAt: string;
    } | null;
  };
}

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetchSubmissionDetail();
  }, [id]);

  const fetchSubmissionDetail = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`/api/submissions/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.errors?.[0]?.msg || "Failed to load submission");
      }

      setSubmission(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load submission details",
        variant: "destructive",
      });
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = () => {
    fetchSubmissionDetail();
    toast({
      title: "Amendment Requested",
      description: "Your changes have been submitted for admin review",
    });
  };

  const renderFilePreview = (url: string, type: string, title: string = "File") => {
    if (!url) {
      return (
        <div className="flex items-center justify-center p-8 bg-muted/20 rounded text-muted-foreground">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {title} not available
        </div>
      );
    }

    const isImage = type === "image" || /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    const isVideo = type === "video" || /\.(mp4|webm|mov)$/i.test(url);
    const isAudio = type === "audio" || /\.(mp3|wav|ogg)$/i.test(url);
    const isPdf = type === "text" || /\.pdf$/i.test(url);

    if (isImage) {
      return (
        <img
          src={url}
          alt={title}
          className="w-full max-h-96 object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
          onClick={() => window.open(url, "_blank")}
        />
      );
    }

    if (isVideo) {
      return (
        <video src={url} controls className="w-full max-h-96 rounded-lg">
          Your browser does not support the video tag.
        </video>
      );
    }

    if (isAudio) {
      return (
        <audio src={url} controls className="w-full">
          Your browser does not support the audio tag.
        </audio>
      );
    }

    if (isPdf) {
      return (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            <iframe
              src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-[500px] border-0"
              title={title}
            />
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")}>
              <Eye className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const link = document.createElement("a");
                link.href = url;
                link.download = `${title}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-4 p-8 bg-muted/20 rounded-lg">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const link = document.createElement("a");
              link.href = url;
              link.download = title;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Submission Not Found</CardTitle>
            <CardDescription>The submission you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/profile")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit = submission.status === "approved" && submission.amendmentStatus.canEdit;
  const isPending = submission.status === "pending";
  const isRejected = submission.status === "rejected";

  return (
    <div className="min-h-screen py-8">
      <div className="px-4 mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <div className="flex items-center gap-2">
            {canEdit && (
              <Button onClick={() => setEditModalOpen(true)}>
                <FileEdit className="h-4 w-4 mr-2" />
                Request Amendment
              </Button>
            )}
            {submission.amendmentStatus.currentVersion > 1 && (
              <Button
                variant="outline"
                onClick={() => navigate(`/profile/submissions/${id}/history`)}
              >
                <History className="h-4 w-4 mr-2" />
                Version History ({submission.amendmentStatus.currentVersion})
              </Button>
            )}
          </div>
        </div>

        {/* Title & Status */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{submission.title}</CardTitle>
                <CardDescription className="text-base">{submission.description}</CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant={
                    submission.status === "approved"
                      ? "default"
                      : submission.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-sm"
                >
                  {submission.status.toUpperCase()}
                </Badge>
                {submission.amendmentStatus && (
                  <Badge variant="outline" className="font-mono">
                    v{submission.amendmentStatus.currentVersion}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Status Alerts */}
        {isPending && (
          <Alert className="border-yellow-500 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertTitle>Awaiting Initial Approval</AlertTitle>
            <AlertDescription>
              Your submission is pending admin review. You cannot make changes until it's approved.
            </AlertDescription>
          </Alert>
        )}

        {isRejected && (
          <Alert className="border-red-500 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>Submission Rejected</AlertTitle>
            <AlertDescription>
              {submission.rejectionReason || "No reason provided"}
            </AlertDescription>
          </Alert>
        )}

        {submission.amendmentStatus?.pending && (
          <Alert className="border-blue-500 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertTitle>Amendment Pending Review</AlertTitle>
            <AlertDescription>
              <p className="font-semibold">
                Proposed v{submission.amendmentStatus.pending.proposedVersion}:{" "}
                {submission.amendmentStatus.pending.changesSummary}
              </p>
              <p className="text-xs mt-1">
                Submitted on {formatDate(submission.amendmentStatus.pending.requestedAt)}
              </p>
            </AlertDescription>
          </Alert>
        )}

        {submission.amendmentStatus?.latestRejected &&
          !submission.amendmentStatus.pending && (
            <Alert className="border-red-500 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertTitle>Previous Amendment Rejected</AlertTitle>
              <AlertDescription>
                <p>
                  <strong>Changes:</strong>{" "}
                  {submission.amendmentStatus.latestRejected.changesSummary}
                </p>
                <p>
                  <strong>Reason:</strong>{" "}
                  {submission.amendmentStatus.latestRejected.rejectionReason}
                </p>
                <p className="text-xs mt-1">
                  Rejected on {formatDate(submission.amendmentStatus.latestRejected.rejectedAt)}
                </p>
              </AlertDescription>
            </Alert>
          )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Content Preview - Full Width on Mobile, 2 cols on Desktop */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Preview
              </CardTitle>
              <CardDescription>
                {submission.contentFileType.toUpperCase()} file
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderFilePreview(
                submission.contentUrl,
                submission.contentFileType,
                submission.title
              )}

              {/* Stats */}
              {submission.status === "approved" && (
                <div className="flex gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{submission.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{submission.downloads || 0} downloads</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata Sidebar */}
          <div className="space-y-6">
            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Country:</span> {submission.country}
                </div>
                <div>
                  <span className="font-semibold">State/Region:</span> {submission.stateRegion}
                </div>
                <div>
                  <span className="font-semibold">Tribe:</span> {submission.tribe}
                </div>
                {submission.village && (
                  <div>
                    <span className="font-semibold">Village:</span> {submission.village}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cultural Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Cultural Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Domain:</span>
                  <Badge variant="outline" className="ml-2">
                    {submission.culturalDomain}
                  </Badge>
                </div>
                <div>
                  <span className="font-semibold">Language:</span> {submission.language}
                </div>
                <div>
                  <span className="font-semibold">Access Tier:</span>
                  <Badge variant="secondary" className="ml-2">
                    {submission.accessTier}
                  </Badge>
                </div>
                {submission.dateOfRecording && (
                  <div>
                    <span className="font-semibold">Recording Date:</span>{" "}
                    {formatDate(submission.dateOfRecording)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Created:</span>{" "}
                  {formatDate(submission.createdAt)}
                </div>
                <div>
                  <span className="font-semibold">Last Updated:</span>{" "}
                  {formatDate(submission.updatedAt)}
                </div>
                {submission.approvedAt && (
                  <div>
                    <span className="font-semibold">Approved:</span>{" "}
                    {formatDate(submission.approvedAt)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information */}
        <Accordion type="single" collapsible defaultValue="details" className="w-full">
          {/* Details */}
          <AccordionItem value="details">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Detailed Information
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {submission.keywords && submission.keywords.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {submission.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {submission.culturalSignificance && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Cultural Significance</h4>
                  <p className="text-sm text-muted-foreground">
                    {submission.culturalSignificance}
                  </p>
                </div>
              )}

              {submission.backgroundInfo && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Background Information</h4>
                  <p className="text-sm text-muted-foreground">{submission.backgroundInfo}</p>
                </div>
              )}

              {submission.contentWarnings && submission.contentWarnings.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Content Warnings
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {submission.contentWarnings.map((warning, idx) => (
                      <Badge key={idx} variant="outline" className="text-yellow-700">
                        {warning}
                      </Badge>
                    ))}
                  </div>
                  {submission.warningOtherText && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {submission.warningOtherText}
                    </p>
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Consent */}
          <AccordionItem value="consent">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Consent Documentation
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <Card className="border-2 border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Type:</span>
                      <p className="text-muted-foreground">{submission.consent.consentType}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Date:</span>
                      <p className="text-muted-foreground">
                        {formatDate(submission.consent.consentDate)}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold">Provider:</span>
                      <p className="text-muted-foreground">{submission.consent.consentNames}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Duration:</span>
                      <p className="text-muted-foreground">{submission.consent.duration}</p>
                    </div>
                  </div>

                  {submission.consent.permissionType &&
                    submission.consent.permissionType.length > 0 && (
                      <div>
                        <span className="font-semibold text-sm">Permissions:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {submission.consent.permissionType.map((permission, idx) => (
                            <Badge key={idx} variant="outline" className="bg-white">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {submission.consent.digitalSignature && (
                    <div>
                      <span className="font-semibold text-sm">Digital Signature:</span>
                      <p className="text-xs font-mono bg-white p-2 rounded mt-1">
                        {submission.consent.digitalSignature}
                      </p>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <span className="font-semibold text-sm mb-3 block">Consent Document</span>
                    {renderFilePreview(
                      submission.consent.fileUrl,
                      submission.consent.fileType,
                      "Consent Document"
                    )}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Additional Files */}
          {(submission.translationFileUrl || submission.verificationDocUrl) && (
            <AccordionItem value="additional">
              <AccordionTrigger className="text-lg font-semibold">
                Additional Documents
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {submission.translationFileUrl && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Translation</h4>
                    {renderFilePreview(submission.translationFileUrl, "text", "Translation")}
                  </div>
                )}
                {submission.verificationDocUrl && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Verification Document</h4>
                    {renderFilePreview(
                      submission.verificationDocUrl,
                      "text",
                      "Verification"
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>

      {/* Edit Modal */}
      <EditSubmissionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        submission={submission}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default SubmissionDetail;