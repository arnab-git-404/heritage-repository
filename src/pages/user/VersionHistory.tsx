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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { authFetch } from "@/lib/api";
import {
  ArrowLeft,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface VersionEntry {
  version: number;
  status: "approved" | "pending" | "rejected" | "cancelled" | "archived";
  legacy?: boolean;
  sourceType?: "Submission" | "ApprovedContent" | "AmendmentRequest";
  changesSummary?: string;
  updatedAt: string;
  updatedBy?: {
    name: string;
    email: string;
  };
  reviewedBy?: {
    name: string;
    email: string;
  };
  reviewedAt?: string;
  rejectionReason?: string;
  isOriginal: boolean;
  approvedContentId?: string;
  amendmentRequestId?: string;
}

const VersionHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [submissionTitle, setSubmissionTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVersionHistory();
  }, [id]);

  const fetchVersionHistory = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`/api/submissions/${id}/versions`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.errors?.[0]?.msg || "Failed to load version history");
      }

      setVersions(data.versions || []);
      setSubmissionTitle(data.submissionTitle || "Submission");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load version history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading version history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="px-4 mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(`/user/dashboard/profile/submissions/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Submission
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <History className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">Version History</CardTitle>
                <CardDescription>{submissionTitle}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {versions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No version history available</p>
              </div>
            ) : (
              <div className="relative space-y-6">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

                {versions.map((version, index) => (
                  <div key={index} className="relative flex gap-6">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex-shrink-0 mt-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border-2 border-primary">
                        {getStatusIcon(version.status)}
                      </div>
                    </div>

                    {/* Content */}
                    <Card className="flex-1">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">
                                {version.isOriginal ? "Original Submission" : version.sourceType === "AmendmentRequest" ? "Amendment Request" : "Submission Revision"}
                              </CardTitle>
                              <Badge variant="outline" className="font-mono text-xs">
                                v{version.version}
                              </Badge>
                              {getStatusBadge(version.status)}
                              {version.legacy && <Badge variant="outline">Recovered history</Badge>}
                            </div>
                            {version.changesSummary && (
                              <CardDescription>{version.changesSummary}</CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Timeline Info */}
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-semibold">
                                {version.isOriginal ? "Created" : "Requested"}
                              </p>
                              <p className="text-muted-foreground">{formatDate(version.updatedAt)}</p>
                            </div>
                          </div>

                          {version.updatedBy && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-semibold">Submitted By</p>
                                <p className="text-muted-foreground">{version.updatedBy.name}</p>
                              </div>
                            </div>
                          )}

                          {version.reviewedBy && version.reviewedAt && (
                            <>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-semibold">Reviewed By</p>
                                  <p className="text-muted-foreground">{version.reviewedBy.name}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-semibold">Review Date</p>
                                  <p className="text-muted-foreground">
                                    {formatDate(version.reviewedAt)}
                                  </p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Rejection Reason */}
                        {version.status === "rejected" && version.rejectionReason && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Rejection Reason:</strong>
                              <p className="mt-1 text-sm">{version.rejectionReason}</p>
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Pending Alert */}
                        {version.status === "pending" && (
                          <Alert className="border-yellow-500 bg-yellow-50">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-800">
                              This amendment is currently under admin review.
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Approved Alert */}
                        {version.status === "approved" && !version.isOriginal && (
                          <Alert className="border-green-500 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              This amendment was approved and is now the current version.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VersionHistory;
