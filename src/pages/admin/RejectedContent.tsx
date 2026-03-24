import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Globe,
  Eye,
  Loader2,
  AlertCircle,
  Search,
  UserCircle,
  MoreVertical,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Shield,
  Download,
  FileCheck,
} from "lucide-react";

interface Submission {
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
}

const Rejected = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [culturalDomainFilter, setCulturalDomainFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reReviewDialogOpen, setReReviewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("auth_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage, itemsPerPage, searchTerm, culturalDomainFilter, countryFilter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: "rejected",
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        culturalDomain: culturalDomainFilter !== "all" ? culturalDomainFilter : "",
        country: countryFilter !== "all" ? countryFilter : "",
      });

      const response = await fetch(
        `${API_URL}/api/admin/submissions?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (response.status === 401 || response.status === 403) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to fetch submissions");

      setSubmissions(data.submissions || []);
      setTotalCount(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 1);
      setCurrentPage(data.pagination?.page || 1);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch rejected submissions",
        variant: "destructive",
      });
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReReview = async () => {
    if (!selectedSubmission) return;

    setActionLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/admin/submissions/${selectedSubmission._id}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: "pending" }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to move to pending");

      toast({ 
        title: "Success", 
        description: "Submission moved to pending for re-review" 
      });
      setReReviewDialogOpen(false);
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to move submission to pending",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSubmission) return;

    setActionLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/admin/submissions/${selectedSubmission._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to delete submission");

      toast({ title: "Success", description: "Submission permanently deleted" });
      setDeleteDialogOpen(false);
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete submission",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const renderFilePreview = (url: string, type: string, title: string = "File") => {
    if (!url) {
      return (
        <div className="flex items-center justify-center p-8 bg-muted/20 rounded text-muted-foreground">
          <AlertCircle className="h-5 w-5 mr-2" />
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
          className="w-full max-h-64 object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
          onClick={() => window.open(url, "_blank")}
        />
      );
    }

    if (isVideo) {
      return <video src={url} controls className="w-full max-h-64 rounded-lg" />;
    }

    if (isAudio) {
      return <audio src={url} controls className="w-full" />;
    }

    if (isPdf) {
      return (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            <iframe
              src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-96 border-0"
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

  const renderConsentDetails = (consent: Submission["consent"]) => (
    <Card className="border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-blue-600" />
          Consent Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Consent Type:</span>
            <p className="text-muted-foreground">{consent.consentType}</p>
          </div>
          <div>
            <span className="font-semibold">Consent Date:</span>
            <p className="text-muted-foreground">
              {new Date(consent.consentDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="font-semibold">Consent Provider:</span>
            <p className="text-muted-foreground">{consent.consentNames}</p>
          </div>
          <div>
            <span className="font-semibold">Duration:</span>
            <p className="text-muted-foreground">{consent.duration}</p>
          </div>
        </div>

        {consent.permissionType && consent.permissionType.length > 0 && (
          <div>
            <span className="font-semibold text-sm">Permissions:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {consent.permissionType.map((permission, idx) => (
                <Badge key={idx} variant="outline">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div>
          <span className="font-semibold text-sm flex items-center gap-2 mb-3">
            <FileCheck className="h-4 w-4" />
            Consent Document
          </span>
          {renderFilePreview(consent.fileUrl, consent.fileType, "Consent Document")}
        </div>
      </CardContent>
    </Card>
  );

  const getUniqueValues = (key: keyof Submission) => {
    const values = submissions.map((sub) => sub[key] as string).filter(Boolean);
    return Array.from(new Set(values)).sort();
  };

  const renderGridView = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {submissions.map((submission) => (
        <Card key={submission._id} className="overflow-hidden hover:shadow-lg transition-shadow border-red-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{submission.title}</CardTitle>
                <CardDescription className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {submission.userId?.avatar ? (
                      <img
                        src={submission.userId.avatar}
                        alt={submission.userId.name}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-5 w-5" />
                    )}
                    <span className="font-medium">{submission.userId?.name || "Unknown User"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Rejected: {new Date(submission.reviewedAt || submission.updatedAt).toLocaleDateString()}</span>
                  </div>
                  {submission.reviewedBy && (
                    <div className="text-xs text-muted-foreground">
                      By: {submission.reviewedBy.name}
                    </div>
                  )}
                </CardDescription>
              </div>
              
              <div className="flex items-start gap-2">
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Rejected
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleViewSubmission(submission)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setReReviewDialogOpen(true);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-2 text-blue-600" />
                      Re-Review
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Permanently
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Rejection Reason Alert */}
            <Alert variant="destructive" className="border-red-300">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Rejection Reason</AlertTitle>
              <AlertDescription className="text-sm">
                {submission.rejectionReason || "No reason provided"}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Location & Domain
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{submission.country}</Badge>
                <Badge variant="outline">{submission.tribe}</Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  {submission.culturalDomain}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Description</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {submission.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">
                Content Preview ({submission.contentFileType})
              </h4>
              {renderFilePreview(submission.contentUrl, submission.contentFileType, "Content")}
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedSubmission(submission);
                  setReReviewDialogOpen(true);
                }}
                disabled={actionLoading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Re-Review
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  setSelectedSubmission(submission);
                  setDeleteDialogOpen(true);
                }}
                disabled={actionLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Submitter</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Rejection Reason</TableHead>
            <TableHead>Reviewed By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission._id} className="bg-red-50/30 dark:bg-red-950/10">
              <TableCell>
                <div className="max-w-[200px]">
                  <p className="font-medium truncate">{submission.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {submission.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {submission.userId?.avatar ? (
                    <img
                      src={submission.userId.avatar}
                      alt={submission.userId.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{submission.userId?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{submission.userId?.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{submission.tribe}</p>
                  <p className="text-xs text-muted-foreground">{submission.country}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[200px]">
                  <p className="text-sm text-red-700 dark:text-red-400 line-clamp-2">
                    {submission.rejectionReason || "No reason provided"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{submission.reviewedBy?.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">
                    {submission.reviewedBy?.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {new Date(submission.reviewedAt || submission.updatedAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewSubmission(submission)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setReReviewDialogOpen(true);
                    }}
                    disabled={actionLoading}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setDeleteDialogOpen(true);
                    }}
                    disabled={actionLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold flex items-center gap-2">
            <XCircle className="h-8 w-8 text-red-600" />
            Rejected Submissions
          </h2>
          <p className="text-muted-foreground mt-1">
            {totalCount} rejected submission{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, description, or tribe..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select
          value={culturalDomainFilter}
          onValueChange={(v) => {
            setCulturalDomainFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Cultural Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {getUniqueValues("culturalDomain").map((domain) => (
              <SelectItem key={domain} value={domain}>
                {domain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={countryFilter}
          onValueChange={(v) => {
            setCountryFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <Globe className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {getUniqueValues("country").map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(v) => {
            setItemsPerPage(Number(v));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12 per page</SelectItem>
            <SelectItem value="24">24 per page</SelectItem>
            <SelectItem value="48">48 per page</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <XCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>No rejected submissions found</p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? renderGridView() : renderTableView()}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
              </p>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={
                        currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Rejected Submission Details
            </DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                {selectedSubmission.userId?.avatar ? (
                  <img
                    src={selectedSubmission.userId.avatar}
                    alt={selectedSubmission.userId.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="h-10 w-10 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedSubmission.userId?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubmission.userId?.email}
                  </p>
                </div>
                <Badge variant="destructive">Rejected</Badge>
              </div>

              {/* Rejection Reason */}
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Rejection Reason</AlertTitle>
                <AlertDescription>
                  {selectedSubmission.rejectionReason || "No reason provided"}
                </AlertDescription>
                {selectedSubmission.reviewedBy && (
                  <div className="mt-2 text-sm">
                    <p>Reviewed by: {selectedSubmission.reviewedBy.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedSubmission.reviewedAt || selectedSubmission.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </Alert>

              <Accordion type="single" collapsible defaultValue="content" className="w-full">
                {/* Content Details */}
                <AccordionItem value="content">
                  <AccordionTrigger className="text-lg font-semibold">
                    Content Details
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Title</h4>
                      <p className="text-sm">{selectedSubmission.title}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSubmission.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Location</h4>
                        <div className="space-y-1 text-sm">
                          <p>Country: {selectedSubmission.country}</p>
                          <p>State/Region: {selectedSubmission.stateRegion}</p>
                          <p>Tribe: {selectedSubmission.tribe}</p>
                          {selectedSubmission.village && (
                            <p>Village: {selectedSubmission.village}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Details</h4>
                        <div className="space-y-1 text-sm">
                          <p>Domain: {selectedSubmission.culturalDomain}</p>
                          <p>Language: {selectedSubmission.language}</p>
                          <p>Access: {selectedSubmission.accessTier}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Main Content</h4>
                      {renderFilePreview(
                        selectedSubmission.contentUrl,
                        selectedSubmission.contentFileType,
                        "Main Content"
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Consent Document */}
                <AccordionItem value="consent">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Consent Documentation
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    {renderConsentDetails(selectedSubmission.consent)}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedSubmission && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewDialogOpen(false);
                    setReReviewDialogOpen(true);
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Re-Review
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setViewDialogOpen(false);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Re-Review Confirmation Dialog */}
      <Dialog open={reReviewDialogOpen} onOpenChange={setReReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-blue-600" />
              Move to Pending for Re-Review
            </DialogTitle>
            <DialogDescription>
              This submission will be moved back to the pending queue for re-review. The rejection reason will be preserved for reference.
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="py-4 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Title:</span> {selectedSubmission.title}
              </p>
              <p className="text-sm text-muted-foreground">{selectedSubmission.description}</p>
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Previous Rejection Reason</AlertTitle>
                <AlertDescription>
                  {selectedSubmission.rejectionReason || "No reason provided"}
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReReviewDialogOpen(false);
                setSelectedSubmission(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleReReview} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Moving...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Move to Pending
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Permanently Delete Submission
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the submission and all
              associated files from the system.
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="py-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  You are about to permanently delete this submission. All files and data will be
                  lost.
                </AlertDescription>
              </Alert>
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Title:</span> {selectedSubmission.title}
                </p>
                <p className="text-sm text-muted-foreground">{selectedSubmission.description}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedSubmission(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rejected;