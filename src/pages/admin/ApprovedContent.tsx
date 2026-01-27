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
import { Submission } from "@/types/Submission";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  XCircle,
  Calendar,
  MapPin,
  Globe,
  Eye,
  Download,
  Loader2,
  AlertCircle,
  Search,
  UserCircle,
  Mail,
  Award,
  MoreVertical,
  CheckCircle2,
  Filter,
  TrendingUp,
  Edit,
  Trash2,
} from "lucide-react";



const Approved = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [culturalDomainFilter, setCulturalDomainFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "views" | "downloads">(
    "recent",
  );

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  //  Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const navigate = useNavigate();
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("adminToken") || localStorage.getItem("auth_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage, itemsPerPage, searchTerm, culturalDomainFilter, countryFilter, sortBy]);

//   const fetchSubmissions = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${API_URL}/api/admin/submissions?status=approved`,
//         { headers: getAuthHeaders() },
//       );

//       if (response.status === 401 || response.status === 403) {
//         navigate("/admin/login", { replace: true });
//         return;
//       }

//       const data = await response.json();
//       if (!response.ok)
//         throw new Error(
//           data?.errors?.[0]?.msg || "Failed to fetch submissions",
//         );

//       setSubmissions(data.submissions || []);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to fetch approved submissions",
//         variant: "destructive",
//       });
//       setSubmissions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/admin/submissions?status=approved&page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&culturalDomain=${culturalDomainFilter !== 'all' ? culturalDomainFilter : ''}&country=${countryFilter !== 'all' ? countryFilter : ''}&sortBy=${sortBy}`,
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
        description: error.message || "Failed to fetch approved submissions",
        variant: "destructive",
      });
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

//   const filterAndSortSubmissions = () => {
//     let filtered = [...submissions];

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (sub) =>
//           sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           sub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           sub.tribe.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           sub.userId.name.toLowerCase().includes(searchTerm.toLowerCase()),
//       );
//     }

//     // Cultural domain filter
//     if (culturalDomainFilter !== "all") {
//       filtered = filtered.filter(
//         (sub) => sub.culturalDomain === culturalDomainFilter,
//       );
//     }

//     // Country filter
//     if (countryFilter !== "all") {
//       filtered = filtered.filter((sub) => sub.country === countryFilter);
//     }

//     // Sort
//     filtered.sort((a, b) => {
//       if (sortBy === "recent") {
//         return (
//           new Date(b.reviewedAt || b.updatedAt).getTime() -
//           new Date(a.reviewedAt || a.updatedAt).getTime()
//         );
//       } else if (sortBy === "views") {
//         return (b.views || 0) - (a.views || 0);
//       } else if (sortBy === "downloads") {
//         return (b.downloads || 0) - (a.downloads || 0);
//       }
//       return 0;
//     });

//     setFilteredSubmissions(filtered);
//   };

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
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
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data?.errors?.[0]?.msg || "Failed to delete submission",
        );

      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
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

  const renderFilePreview = (url: string, type: string) => {
    if (!url) {
      return (
        <div className="flex items-center justify-center p-8 bg-muted/20 rounded text-muted-foreground">
          <AlertCircle className="h-5 w-5 mr-2" />
          File not available
        </div>
      );
    }

    const isImage = type === "image" || /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    const isVideo = type === "video" || /\.(mp4|webm|mov)$/i.test(url);
    const isAudio = type === "audio" || /\.(mp3|wav|ogg)$/i.test(url);

    if (isImage) {
      return (
        <img
          src={url}
          alt="Content preview"
          className="w-full max-h-64 object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
          onClick={() => window.open(url, "_blank")}
        />
      );
    }

    if (isVideo) {
      return (
        <video src={url} controls className="w-full max-h-64 rounded-lg" />
      );
    }

    if (isAudio) {
      return <audio src={url} controls className="w-full" />;
    }

    return (
      <div className="flex flex-col items-center gap-4 p-8 bg-muted/20 rounded-lg">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(url, "_blank")}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Document
        </Button>
      </div>
    );
  };

  const getUniqueValues = (key: keyof Submission) => {
    const values = submissions.map((sub) => sub[key] as string).filter(Boolean);
    return Array.from(new Set(values)).sort();
  };

  const renderSubmissionCard = (submission: Submission) => (
    <Card
      key={submission._id}
      className="overflow-hidden hover:shadow-lg transition-shadow"
    >
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
                <span className="font-medium">
                  {submission.userId?.name || "Unknown User"}
                </span>
                {submission.userId?.role && (
                  <Badge variant="outline" className="text-xs">
                    {submission.userId.role}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  Approved:{" "}
                  {new Date(
                    submission.reviewedAt || submission.updatedAt,
                  ).toLocaleDateString()}
                </span>
              </div>
              {submission.reviewedBy && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-3 w-3" />
                  <span>By: {submission.reviewedBy.name}</span>
                </div>
              )}
            </CardDescription>
          </div>

          <div className="flex items-start gap-2">
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 hover:bg-green-200"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Approved
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
                <DropdownMenuItem
                  onClick={() => handleViewSubmission(submission)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.open(submission.contentUrl, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Content
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedSubmission(submission);
                    setDeleteDialogOpen(true);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Location & Domain
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{submission.country}</Badge>
            <Badge variant="outline">{submission.stateRegion}</Badge>
            <Badge variant="outline">{submission.tribe}</Badge>
            {submission.village && (
              <Badge variant="outline">{submission.village}</Badge>
            )}
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
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

        {submission.keywords && submission.keywords.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {submission.keywords.slice(0, 5).map((keyword, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {submission.keywords.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{submission.keywords.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">
            Content Preview ({submission.contentFileType})
          </h4>
          {renderFilePreview(submission.contentUrl, submission.contentFileType)}
        </div>

        {/* Stats */}
        <div className="flex gap-4 pt-2 border-t text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{submission.views || 0} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{submission.downloads || 0} downloads</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold flex items-center gap-2">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            Approved Content
          </h2>
          <p className="text-muted-foreground mt-1">
            {totalCount } approved submission
            {totalCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
       <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.reduce((sum, sub) => sum + (sub.views || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.reduce((sum, sub) => sum + (sub.downloads || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Views/Item
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.length > 0
                ? Math.round(
                    submissions.reduce(
                      (sum, sub) => sum + (sub.views || 0),
                      0,
                    ) / submissions.length,
                  )
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, description, tribe, or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={culturalDomainFilter}
          onValueChange={setCulturalDomainFilter}
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
        <Select value={countryFilter} onValueChange={setCountryFilter}>
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
        <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="views">Most Viewed</SelectItem>
            <SelectItem value="downloads">Most Downloaded</SelectItem>
          </SelectContent>
        </Select>
         <Select value={itemsPerPage.toString()} onValueChange={(v) => {
          setItemsPerPage(Number(v));
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12 per page</SelectItem>
            <SelectItem value="24">24 per page</SelectItem>
            <SelectItem value="48">48 per page</SelectItem>
            <SelectItem value="96">96 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}

          {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No approved submissions found</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {submissions.map(renderSubmissionCard)}
                  </div>
        
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
                      </p>
                      
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
        
                          {/* Page Numbers */}
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
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
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
                  <h3 className="text-lg font-semibold">
                    {selectedSubmission.userId?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubmission.userId?.email}
                  </p>
                  {selectedSubmission.userId?.role && (
                    <Badge className="mt-1">
                      {selectedSubmission.userId.role}
                    </Badge>
                  )}
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Approved
                </Badge>
              </div>

              {/* Content Details */}
              <div className="space-y-4">
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

                {selectedSubmission.keywords &&
                  selectedSubmission.keywords.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubmission.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                <div>
                  <h4 className="text-sm font-semibold mb-2">Content</h4>
                  {renderFilePreview(
                    selectedSubmission.contentUrl,
                    selectedSubmission.contentFileType,
                  )}
                </div>

                {selectedSubmission.reviewedBy && (
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">
                      Review Information
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>Reviewed by: {selectedSubmission.reviewedBy.name}</p>
                      <p>Email: {selectedSubmission.reviewedBy.email}</p>
                      <p>
                        Date:{" "}
                        {new Date(
                          selectedSubmission.reviewedAt ||
                            selectedSubmission.updatedAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedSubmission && (
              <Button
                variant="outline"
                onClick={() =>
                  window.open(selectedSubmission.contentUrl, "_blank")
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Download Content
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Approved Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this approved submission? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="py-4">
              <p className="text-sm">
                <span className="font-semibold">Title:</span>{" "}
                {selectedSubmission.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedSubmission.description}
              </p>
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
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Submission"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Approved;
