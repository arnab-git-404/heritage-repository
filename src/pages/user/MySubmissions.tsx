// // import { useEffect, useState } from "react";
// // import { useNavigate, useSearchParams } from "react-router-dom";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { Alert, AlertDescription } from "@/components/ui/alert";
// // import { useToast } from "@/hooks/use-toast";
// // import { useAuth } from "@/context/AuthContext";
// // import { authFetch } from "@/lib/api";
// // import {
// //   Eye,
// //   FileText,
// //   Search,
// //   Filter,
// //   ChevronLeft,
// //   ChevronRight,
// //   ChevronsLeft,
// //   ChevronsRight,
// //   Clock,
// //   CheckCircle2,
// //   XCircle,
// //   History,
// //   FileEdit,
// //   Upload,
// //   ArrowUpDown,
// //   Calendar,
// //   Globe,
// //   AlertCircle,
// // } from "lucide-react";

// // interface Submission {
// //   _id: string;
// //   title: string;
// //   description: string;
// //   contentFileType: string;
// //   status: "pending" | "approved" | "rejected";
// //   tribe?: string;
// //   culturalDomain?: string;
// //   createdAt: string;
// //   updatedAt: string;
// //   views?: number;
// //   downloads?: number;
// //   rejectionReason?: string;
// //   amendmentStatus?: {
// //     canEdit: boolean;
// //     hasPendingAmendment: boolean;
// //     currentVersion: number;
// //     dataSource: "submission" | "approvedContent" | "pendingAmendment";
// //     pending: {
// //       _id: string;
// //       proposedVersion: number;
// //       changesSummary: string;
// //       requestedAt: string;
// //       status: string;
// //     } | null;
// //   };
// // }

// // interface PaginationMeta {
// //   currentPage: number;
// //   totalPages: number;
// //   totalItems: number;
// //   itemsPerPage: number;
// // }

// // const MySubmissions = () => {
// //   const { toast } = useToast();
// //   const navigate = useNavigate();
// //   const [searchParams, setSearchParams] = useSearchParams();
// //   const { isAuthenticated } = useAuth();

// //   const [submissions, setSubmissions] = useState<Submission[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [pagination, setPagination] = useState<PaginationMeta>({
// //     currentPage: 1,
// //     totalPages: 1,
// //     totalItems: 0,
// //     itemsPerPage: 10,
// //   });

// //   // Filters from URL or defaults
// //   const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
// //   const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
// //   const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
// //   const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
// //     (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
// //   );
// //   const currentPage = parseInt(searchParams.get("page") || "1");

// //   // Fetch submissions
// //   const fetchSubmissions = async () => {
// //     try {
// //       setLoading(true);

// //       const params = new URLSearchParams();
// //       params.append("page", currentPage.toString());
// //       params.append("limit", pagination.itemsPerPage.toString());
// //       params.append("sortBy", sortBy);
// //       params.append("sortOrder", sortOrder);

// //       if (statusFilter && statusFilter !== "all") {
// //         params.append("status", statusFilter);
// //       }
// //       if (searchQuery.trim()) {
// //         params.append("search", searchQuery.trim());
// //       }

// //       const res = await authFetch(`/api/submissions/my?${params.toString()}`);
// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data?.errors?.[0]?.msg || "Failed to fetch submissions");
// //       }

// //       setSubmissions(data.submissions || []);
// //       setPagination(data.pagination || pagination);
// //     } catch (error) {
// //       console.error("Error fetching submissions:", error);
// //       toast({
// //         title: "Error",
// //         description: error instanceof Error ? error.message : "Failed to load submissions",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Update URL params when filters change
// //   useEffect(() => {
// //     const params: Record<string, string> = {
// //       page: currentPage.toString(),
// //       sortBy,
// //       sortOrder,
// //     };

// //     if (statusFilter !== "all") params.status = statusFilter;
// //     if (searchQuery) params.search = searchQuery;

// //     setSearchParams(params);
// //   }, [currentPage, statusFilter, searchQuery, sortBy, sortOrder]);

// //   // Fetch when params change
// //   useEffect(() => {
// //     if (isAuthenticated) {
// //       fetchSubmissions();
// //     }
// //   }, [isAuthenticated, currentPage, statusFilter, searchQuery, sortBy, sortOrder]);

// //   // Handle search with debounce
// //   const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
// //   const handleSearch = (value: string) => {
// //     setSearchQuery(value);
// //     if (searchTimeout) clearTimeout(searchTimeout);

// //     const timeout = setTimeout(() => {
// //       // Reset to page 1 when searching
// //       const params = new URLSearchParams(searchParams);
// //       params.set("page", "1");
// //       params.set("search", value);
// //       setSearchParams(params);
// //     }, 500);

// //     setSearchTimeout(timeout);
// //   };

// //   // Handle status filter change
// //   const handleStatusChange = (value: string) => {
// //     setStatusFilter(value);
// //     const params = new URLSearchParams(searchParams);
// //     params.set("page", "1");
// //     if (value !== "all") {
// //       params.set("status", value);
// //     } else {
// //       params.delete("status");
// //     }
// //     setSearchParams(params);
// //   };

// //   // Handle sort
// //   const handleSort = (field: string) => {
// //     if (sortBy === field) {
// //       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
// //     } else {
// //       setSortBy(field);
// //       setSortOrder("desc");
// //     }
// //     const params = new URLSearchParams(searchParams);
// //     params.set("page", "1");
// //     setSearchParams(params);
// //   };

// //   // Pagination handlers
// //   const goToPage = (page: number) => {
// //     const params = new URLSearchParams(searchParams);
// //     params.set("page", page.toString());
// //     setSearchParams(params);
// //   };

// //   const formatDate = (dateString: string) => {
// //     return new Date(dateString).toLocaleDateString("en-US", {
// //       year: "numeric",
// //       month: "short",
// //       day: "numeric",
// //     });
// //   };

// //   const getStatusBadge = (status: string) => {
// //     const config = {
// //       pending: {
// //         variant: "secondary" as const,
// //         icon: Clock,
// //         className: "bg-yellow-100 text-yellow-800 border-yellow-300",
// //       },
// //       approved: {
// //         variant: "default" as const,
// //         icon: CheckCircle2,
// //         className: "bg-green-100 text-green-800 border-green-300",
// //       },
// //       rejected: {
// //         variant: "destructive" as const,
// //         icon: XCircle,
// //         className: "bg-red-100 text-red-800 border-red-300",
// //       },
// //     };

// //     const { icon: Icon, className } = config[status as keyof typeof config] || config.pending;

// //     return (
// //       <Badge variant="outline" className={className}>
// //         <Icon className="h-3 w-3 mr-1" />
// //         {status.toUpperCase()}
// //       </Badge>
// //     );
// //   };

// //   if (!isAuthenticated) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center p-4">
// //         <Card className="max-w-md w-full">
// //           <CardHeader>
// //             <CardTitle>Authentication Required</CardTitle>
// //             <CardDescription>Please log in to view your submissions</CardDescription>
// //           </CardHeader>
// //           <CardContent>
// //             <Button onClick={() => navigate("/signup?redirect=/my-submissions")} className="w-full">
// //               Sign Up / Login
// //             </Button>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen py-8 bg-gradient-to-b from-background to-muted/20">
// //       <div className="container mx-auto px-4 max-w-7xl">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <div className="flex items-center justify-between mb-2">
// //             <div>
// //               <Button>
// //                 back to dashboard
// //               </Button>
// //               <h1 className="text-3xl font-bold">My Submissions</h1>
// //               <p className="text-muted-foreground">
// //                 Manage and track your cultural heritage submissions
// //               </p>
// //             </div>
// //             <Button onClick={() => navigate("/upload")} size="lg">
// //               <Upload className="h-5 w-5 mr-2" />
// //               Upload New
// //             </Button>
// //           </div>

// //           {/* Stats */}
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
// //             <Card>
// //               <CardContent className="pt-6">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm text-muted-foreground">Total</p>
// //                     <p className="text-2xl font-bold">{pagination.totalItems}</p>
// //                   </div>
// //                   <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             <Card>
// //               <CardContent className="pt-6">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm text-muted-foreground">Approved</p>
// //                     <p className="text-2xl font-bold text-green-600">
// //                       {submissions.filter((s) => s.status === "approved").length}
// //                     </p>
// //                   </div>
// //                   <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             <Card>
// //               <CardContent className="pt-6">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm text-muted-foreground">Pending</p>
// //                     <p className="text-2xl font-bold text-yellow-600">
// //                       {submissions.filter((s) => s.status === "pending").length}
// //                     </p>
// //                   </div>
// //                   <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             <Card>
// //               <CardContent className="pt-6">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm text-muted-foreground">Rejected</p>
// //                     <p className="text-2xl font-bold text-red-600">
// //                       {submissions.filter((s) => s.status === "rejected").length}
// //                     </p>
// //                   </div>
// //                   <XCircle className="h-8 w-8 text-red-500 opacity-50" />
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>

// //         {/* Filters */}
// //         <Card className="mb-6">
// //           <CardContent className="pt-6">
// //             <div className="flex flex-col md:flex-row gap-4">
// //               {/* Search */}
// //               <div className="flex-1">
// //                 <div className="relative">
// //                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //                   <Input
// //                     placeholder="Search by title, description, tribe, or domain..."
// //                     value={searchQuery}
// //                     onChange={(e) => handleSearch(e.target.value)}
// //                     className="pl-10"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Status Filter */}
// //               <Select value={statusFilter} onValueChange={handleStatusChange}>
// //                 <SelectTrigger className="w-full md:w-[180px]">
// //                   <Filter className="h-4 w-4 mr-2" />
// //                   <SelectValue placeholder="Filter by status" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="all">All Status</SelectItem>
// //                   <SelectItem value="approved">Approved</SelectItem>
// //                   <SelectItem value="pending">Pending</SelectItem>
// //                   <SelectItem value="rejected">Rejected</SelectItem>
// //                 </SelectContent>
// //               </Select>

// //               {/* Sort */}
// //               <Select
// //                 value={`${sortBy}-${sortOrder}`}
// //                 onValueChange={(value) => {
// //                   const [field, order] = value.split("-");
// //                   setSortBy(field);
// //                   setSortOrder(order as "asc" | "desc");
// //                 }}
// //               >
// //                 <SelectTrigger className="w-full md:w-[200px]">
// //                   <ArrowUpDown className="h-4 w-4 mr-2" />
// //                   <SelectValue placeholder="Sort by" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="createdAt-desc">Newest First</SelectItem>
// //                   <SelectItem value="createdAt-asc">Oldest First</SelectItem>
// //                   <SelectItem value="title-asc">Title A-Z</SelectItem>
// //                   <SelectItem value="title-desc">Title Z-A</SelectItem>
// //                   <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>

// //             {/* Results info */}
// //             {(searchQuery || statusFilter !== "all") && (
// //               <div className="mt-4 text-sm text-muted-foreground">
// //                 Showing {submissions.length} of {pagination.totalItems} submissions
// //                 {searchQuery && ` matching "${searchQuery}"`}
// //                 {statusFilter !== "all" && ` with status "${statusFilter}"`}
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>

// //         {/* Table */}
// //         <Card>
// //           <CardContent className="p-0">
// //             {loading ? (
// //               <div className="flex items-center justify-center py-12">
// //                 <div className="text-center space-y-3">
// //                   <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
// //                   <p className="text-muted-foreground">Loading submissions...</p>
// //                 </div>
// //               </div>
// //             ) : submissions.length === 0 ? (
// //               <div className="text-center py-12 space-y-4">
// //                 <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
// //                 <div>
// //                   <h3 className="text-lg font-semibold">
// //                     {searchQuery || statusFilter !== "all"
// //                       ? "No submissions found"
// //                       : "No submissions yet"}
// //                   </h3>
// //                   <p className="text-muted-foreground">
// //                     {searchQuery || statusFilter !== "all"
// //                       ? "Try adjusting your filters or search query"
// //                       : "Start by uploading your first cultural heritage content"}
// //                   </p>
// //                 </div>
// //                 {!searchQuery && statusFilter === "all" && (
// //                   <Button onClick={() => navigate("/upload")}>
// //                     <Upload className="h-4 w-4 mr-2" />
// //                     Upload Content
// //                   </Button>
// //                 )}
// //               </div>
// //             ) : (
// //               <div className="overflow-x-auto">
// //                 <Table>
// //                   <TableHeader>
// //                     <TableRow>
// //                       <TableHead className="w-[300px]">Title</TableHead>
// //                       <TableHead>Status</TableHead>
// //                       <TableHead>Tribe/Domain</TableHead>
// //                       <TableHead>Type</TableHead>
// //                       <TableHead>Version</TableHead>
// //                       <TableHead>Date</TableHead>
// //                       <TableHead className="text-right">Actions</TableHead>
// //                     </TableRow>
// //                   </TableHeader>
// //                   <TableBody>
// //                     {submissions.map((submission) => {
// //                       const hasPendingAmendment =
// //                         submission.amendmentStatus?.hasPendingAmendment;
// //                       const canEdit = submission.amendmentStatus?.canEdit;
// //                       const hasVersions =
// //                         submission.amendmentStatus &&
// //                         submission.amendmentStatus.currentVersion > 1;

// //                       return (
// //                         <TableRow key={submission._id} className="cursor-pointer hover:bg-muted/50">
// //                           <TableCell>
// //                             <div
// //                               className="space-y-1"
// //                               onClick={() => navigate(`/submissions/${submission._id}`)}
// //                             >
// //                               <p className="font-medium line-clamp-1">{submission.title}</p>
// //                               <p className="text-xs text-muted-foreground line-clamp-1">
// //                                 {submission.description}
// //                               </p>
// //                               {hasPendingAmendment && (
// //                                 <Badge
// //                                   variant="outline"
// //                                   className="bg-blue-50 text-blue-700 border-blue-300 text-xs"
// //                                 >
// //                                   Amendment Pending
// //                                 </Badge>
// //                               )}
// //                             </div>
// //                           </TableCell>

// //                           <TableCell>{getStatusBadge(submission.status)}</TableCell>

// //                           <TableCell>
// //                             <div className="space-y-1">
// //                               {submission.tribe && (
// //                                 <div className="flex items-center gap-1 text-xs">
// //                                   <Globe className="h-3 w-3 text-muted-foreground" />
// //                                   <span className="line-clamp-1">{submission.tribe}</span>
// //                                 </div>
// //                               )}
// //                               {submission.culturalDomain && (
// //                                 <Badge variant="outline" className="text-xs">
// //                                   {submission.culturalDomain}
// //                                 </Badge>
// //                               )}
// //                             </div>
// //                           </TableCell>

// //                           <TableCell>
// //                             <Badge variant="secondary" className="font-mono text-xs">
// //                               {submission.contentFileType.toUpperCase()}
// //                             </Badge>
// //                           </TableCell>

// //                           <TableCell>
// //                             {submission.amendmentStatus && (
// //                               <Badge variant="outline" className="font-mono text-xs">
// //                                 v{submission.amendmentStatus.currentVersion}
// //                               </Badge>
// //                             )}
// //                           </TableCell>

// //                           <TableCell>
// //                             <div className="flex items-center gap-1 text-xs text-muted-foreground">
// //                               <Calendar className="h-3 w-3" />
// //                               {formatDate(submission.createdAt)}
// //                             </div>
// //                           </TableCell>

// //                           <TableCell className="text-right">
// //                             <div className="flex items-center justify-end gap-1">
// //                               <Button
// //                                 variant="ghost"
// //                                 size="sm"
// //                                 onClick={() => navigate(`/submissions/${submission._id}`)}
// //                               >
// //                                 <Eye className="h-4 w-4" />
// //                               </Button>

// //                               {canEdit && submission.status === "approved" && (
// //                                 <Button
// //                                   variant="ghost"
// //                                   size="sm"
// //                                   onClick={() =>
// //                                     navigate(`/edit-submission/${submission._id}`)
// //                                   }
// //                                   disabled={hasPendingAmendment}
// //                                 >
// //                                   <FileEdit className="h-4 w-4" />
// //                                 </Button>
// //                               )}

// //                               {hasVersions && (
// //                                 <Button
// //                                   variant="ghost"
// //                                   size="sm"
// //                                   onClick={() =>
// //                                     navigate(`/submissions/${submission._id}/history`)
// //                                   }
// //                                 >
// //                                   <History className="h-4 w-4" />
// //                                 </Button>
// //                               )}
// //                             </div>
// //                           </TableCell>
// //                         </TableRow>
// //                       );
// //                     })}
// //                   </TableBody>
// //                 </Table>
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>

// //         {/* Pagination */}
// //         {pagination.totalPages > 1 && (
// //           <div className="flex items-center justify-between mt-6">
// //             <div className="text-sm text-muted-foreground">
// //               Showing {(currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
// //               {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
// //               {pagination.totalItems} submissions
// //             </div>

// //             <div className="flex items-center gap-2">
// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 onClick={() => goToPage(1)}
// //                 disabled={currentPage === 1}
// //               >
// //                 <ChevronsLeft className="h-4 w-4" />
// //               </Button>

// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 onClick={() => goToPage(currentPage - 1)}
// //                 disabled={currentPage === 1}
// //               >
// //                 <ChevronLeft className="h-4 w-4" />
// //               </Button>

// //               <div className="flex items-center gap-1">
// //                 {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
// //                   let pageNum;
// //                   if (pagination.totalPages <= 5) {
// //                     pageNum = i + 1;
// //                   } else if (currentPage <= 3) {
// //                     pageNum = i + 1;
// //                   } else if (currentPage >= pagination.totalPages - 2) {
// //                     pageNum = pagination.totalPages - 4 + i;
// //                   } else {
// //                     pageNum = currentPage - 2 + i;
// //                   }

// //                   return (
// //                     <Button
// //                       key={pageNum}
// //                       variant={currentPage === pageNum ? "default" : "outline"}
// //                       size="sm"
// //                       onClick={() => goToPage(pageNum)}
// //                       className="w-10"
// //                     >
// //                       {pageNum}
// //                     </Button>
// //                   );
// //                 })}
// //               </div>

// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 onClick={() => goToPage(currentPage + 1)}
// //                 disabled={currentPage === pagination.totalPages}
// //               >
// //                 <ChevronRight className="h-4 w-4" />
// //               </Button>

// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 onClick={() => goToPage(pagination.totalPages)}
// //                 disabled={currentPage === pagination.totalPages}
// //               >
// //                 <ChevronsRight className="h-4 w-4" />
// //               </Button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default MySubmissions;







// import { useEffect, useState, useCallback, useMemo } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/context/AuthContext";
// import { authFetch } from "@/lib/api";
// import {
//   Eye,
//   FileText,
//   Search,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   History,
//   FileEdit,
//   Upload,
//   ArrowUpDown,
//   Calendar,
//   Globe,
//   ArrowLeft,
//   Loader2,
//   RefreshCw,
// } from "lucide-react";

// // ============================================
// // TYPE DEFINITIONS
// // ============================================
// interface Submission {
//   _id: string;
//   title: string;
//   description: string;
//   contentFileType: string;
//   status: "pending" | "approved" | "rejected";
//   tribe?: string;
//   culturalDomain?: string;
//   createdAt: string;
//   updatedAt: string;
//   views?: number;
//   downloads?: number;
//   rejectionReason?: string;
//   amendmentStatus?: {
//     canEdit: boolean;
//     hasPendingAmendment: boolean;
//     currentVersion: number;
//     dataSource: "submission" | "approvedContent" | "pendingAmendment";
//     pending: {
//       _id: string;
//       proposedVersion: number;
//       changesSummary: string;
//       requestedAt: string;
//       status: string;
//     } | null;
//   };
// }

// interface PaginationMeta {
//   currentPage: number;
//   totalPages: number;
//   totalItems: number;
//   itemsPerPage: number;
// }

// interface StatsData {
//   total: number;
//   approved: number;
//   pending: number;
//   rejected: number;
// }

// // ============================================
// // CONSTANTS
// // ============================================
// const STATUS_CONFIG = {
//   pending: {
//     icon: Clock,
//     className: "bg-yellow-100 text-yellow-800 border-yellow-300",
//     label: "PENDING",
//   },
//   approved: {
//     icon: CheckCircle2,
//     className: "bg-green-100 text-green-800 border-green-300",
//     label: "APPROVED",
//   },
//   rejected: {
//     icon: XCircle,
//     className: "bg-red-100 text-red-800 border-red-300",
//     label: "REJECTED",
//   },
// } as const;

// const SORT_OPTIONS = [
//   { value: "createdAt-desc", label: "Newest First" },
//   { value: "createdAt-asc", label: "Oldest First" },
//   { value: "title-asc", label: "Title A-Z" },
//   { value: "title-desc", label: "Title Z-A" },
//   { value: "updatedAt-desc", label: "Recently Updated" },
// ] as const;

// const DEBOUNCE_DELAY = 500;

// // ============================================
// // UTILITY FUNCTIONS
// // ============================================
// const formatDate = (dateString: string): string => {
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// const calculateStats = (submissions: Submission[]): StatsData => {
//   return submissions.reduce(
//     (acc, submission) => {
//       acc.total++;
//       acc[submission.status]++;
//       return acc;
//     },
//     { total: 0, approved: 0, pending: 0, rejected: 0 } as StatsData
//   );
// };

// // ============================================
// // COMPONENTS
// // ============================================
// const StatusBadge = ({ status }: { status: keyof typeof STATUS_CONFIG }) => {
//   const config = STATUS_CONFIG[status];
//   const Icon = config.icon;

//   return (
//     <Badge variant="outline" className={config.className}>
//       <Icon className="h-3 w-3 mr-1" />
//       {config.label}
//     </Badge>
//   );
// };

// const StatsCard = ({
//   title,
//   value,
//   icon: Icon,
//   className,
// }: {
//   title: string;
//   value: number;
//   icon: React.ElementType;
//   className?: string;
// }) => (
//   <Card>
//     <CardContent className="pt-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-muted-foreground">{title}</p>
//           <p className={`text-2xl font-bold ${className}`}>{value}</p>
//         </div>
//         <Icon className={`h-8 w-8 opacity-50 ${className}`} />
//       </div>
//     </CardContent>
//   </Card>
// );

// const EmptyState = ({
//   hasFilters,
//   onUpload,
// }: {
//   hasFilters: boolean;
//   onUpload: () => void;
// }) => (
//   <div className="text-center py-12 space-y-4">
//     <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
//     <div>
//       <h3 className="text-lg font-semibold">
//         {hasFilters ? "No submissions found" : "No submissions yet"}
//       </h3>
//       <p className="text-muted-foreground">
//         {hasFilters
//           ? "Try adjusting your filters or search query"
//           : "Start by uploading your first cultural heritage content"}
//       </p>
//     </div>
//     {!hasFilters && (
//       <Button onClick={onUpload}>
//         <Upload className="h-4 w-4 mr-2" />
//         Upload Content
//       </Button>
//     )}
//   </div>
// );

// const LoadingState = () => (
//   <div className="flex items-center justify-center py-12">
//     <div className="text-center space-y-3">
//       <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
//       <p className="text-muted-foreground">Loading submissions...</p>
//     </div>
//   </div>
// );

// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   totalItems,
//   itemsPerPage,
//   onPageChange,
// }: {
//   currentPage: number;
//   totalPages: number;
//   totalItems: number;
//   itemsPerPage: number;
//   onPageChange: (page: number) => void;
// }) => {
//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   const pageNumbers = useMemo(() => {
//     const pages: number[] = [];
//     const maxPages = 5;

//     if (totalPages <= maxPages) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else if (currentPage <= 3) {
//       for (let i = 1; i <= maxPages; i++) pages.push(i);
//     } else if (currentPage >= totalPages - 2) {
//       for (let i = totalPages - maxPages + 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
//     }

//     return pages;
//   }, [currentPage, totalPages]);

//   return (
//     <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
//       <div className="text-sm text-muted-foreground">
//         Showing <span className="font-medium">{startItem}</span> to{" "}
//         <span className="font-medium">{endItem}</span> of{" "}
//         <span className="font-medium">{totalItems}</span> submissions
//       </div>

//       <div className="flex items-center gap-2">
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => onPageChange(1)}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronsLeft className="h-4 w-4" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>First page</TooltipContent>
//           </Tooltip>
//         </TooltipProvider>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           <ChevronLeft className="h-4 w-4" />
//         </Button>

//         <div className="flex items-center gap-1">
//           {pageNumbers.map((pageNum) => (
//             <Button
//               key={pageNum}
//               variant={currentPage === pageNum ? "default" : "outline"}
//               size="sm"
//               onClick={() => onPageChange(pageNum)}
//               className="w-10"
//             >
//               {pageNum}
//             </Button>
//           ))}
//         </div>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>

//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => onPageChange(totalPages)}
//                 disabled={currentPage === totalPages}
//               >
//                 <ChevronsRight className="h-4 w-4" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Last page</TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       </div>
//     </div>
//   );
// };

// // ============================================
// // MAIN COMPONENT
// // ============================================
// const MySubmissions = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const { isAuthenticated } = useAuth();

//   // State
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [pagination, setPagination] = useState<PaginationMeta>({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 10,
//   });

//   // Filters from URL
//   const statusFilter = searchParams.get("status") || "all";
//   const searchQuery = searchParams.get("search") || "";
//   const sortBy = searchParams.get("sortBy") || "createdAt";
//   const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
//   const currentPage = parseInt(searchParams.get("page") || "1", 10);

//   // Local search state for immediate UI update
//   const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

//   // Memoized stats calculation
//   const stats = useMemo(() => {
//     return {
//       total: pagination.totalItems,
//       ...calculateStats(submissions),
//     };
//   }, [submissions, pagination.totalItems]);

//   // ============================================
//   // API CALLS
//   // ============================================
//   const fetchSubmissions = useCallback(
//     async (showRefreshLoader = false) => {
//       try {
//         showRefreshLoader ? setRefreshing(true) : setLoading(true);

//         const params = new URLSearchParams({
//           page: currentPage.toString(),
//           limit: pagination.itemsPerPage.toString(),
//           sortBy,
//           sortOrder,
//         });

//         if (statusFilter !== "all") params.append("status", statusFilter);
//         if (searchQuery.trim()) params.append("search", searchQuery.trim());

//         const res = await authFetch(`/api/submissions/my?${params.toString()}`);
//         const data = await res.json();

//         if (!res.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to fetch");

//         setSubmissions(data.submissions || []);
//         setPagination(data.pagination || pagination);
//       } catch (error) {
//         console.error("Error fetching submissions:", error);
//         toast({
//           title: "Error",
//           description: error instanceof Error ? error.message : "Failed to load submissions",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     [currentPage, statusFilter, searchQuery, sortBy, sortOrder, pagination.itemsPerPage, toast]
//   );

//   // ============================================
//   // HANDLERS
//   // ============================================
//   const updateSearchParams = useCallback(
//     (updates: Record<string, string | null>) => {
//       const params = new URLSearchParams(searchParams);

//       Object.entries(updates).forEach(([key, value]) => {
//         if (value === null) {
//           params.delete(key);
//         } else {
//           params.set(key, value);
//         }
//       });

//       setSearchParams(params);
//     },
//     [searchParams, setSearchParams]
//   );

//   const handleSearch = useCallback(
//     (value: string) => {
//       setLocalSearchQuery(value);

//       const timeoutId = setTimeout(() => {
//         updateSearchParams({
//           search: value.trim() || null,
//           page: "1",
//         });
//       }, DEBOUNCE_DELAY);

//       return () => clearTimeout(timeoutId);
//     },
//     [updateSearchParams]
//   );

//   const handleStatusChange = useCallback(
//     (value: string) => {
//       updateSearchParams({
//         status: value === "all" ? null : value,
//         page: "1",
//       });
//     },
//     [updateSearchParams]
//   );

//   const handleSortChange = useCallback(
//     (value: string) => {
//       const [field, order] = value.split("-");
//       updateSearchParams({
//         sortBy: field,
//         sortOrder: order,
//         page: "1",
//       });
//     },
//     [updateSearchParams]
//   );

//   const handlePageChange = useCallback(
//     (page: number) => {
//       updateSearchParams({ page: page.toString() });
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     },
//     [updateSearchParams]
//   );

//   const handleRefresh = useCallback(() => {
//     fetchSubmissions(true);
//   }, [fetchSubmissions]);

//   // ============================================
//   // EFFECTS
//   // ============================================
//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchSubmissions();
//     }
//   }, [isAuthenticated, currentPage, statusFilter, searchQuery, sortBy, sortOrder]);

//   // Cleanup search timeout
//   useEffect(() => {
//     return () => {
//       // Cleanup will happen automatically with callback
//     };
//   }, []);

//   // ============================================
//   // RENDER GUARDS
//   // ============================================
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <Card className="max-w-md w-full">
//           <CardHeader>
//             <CardTitle>Authentication Required</CardTitle>
//             <CardDescription>Please log in to view your submissions</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button
//               onClick={() => navigate("/signup?redirect=/my-submissions")}
//               className="w-full"
//             >
//               Sign Up / Login
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const hasFilters = searchQuery.trim() !== "" || statusFilter !== "all";

//   // ============================================
//   // MAIN RENDER
//   // ============================================
//   return (
//     <div className="min-h-screen py-8 bg-gradient-to-b from-background to-muted/20">
//       <div className="container mx-auto px-4 max-w-7xl">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-start justify-between gap-4 mb-4">
//             <div className="space-y-1">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => navigate("/dashboard")}
//                 className="mb-2 -ml-2"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Dashboard
//               </Button>
//               <h1 className="text-3xl font-bold">My Submissions</h1>
//               <p className="text-muted-foreground">
//                 Manage and track your cultural heritage submissions
//               </p>
//             </div>
//             <div className="flex gap-2">
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="outline"
//                       size="lg"
//                       onClick={handleRefresh}
//                       disabled={refreshing}
//                     >
//                       <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Refresh submissions</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <Button onClick={() => navigate("/upload")} size="lg">
//                 <Upload className="h-5 w-5 mr-2" />
//                 Upload New
//               </Button>
//             </div>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <StatsCard title="Total" value={stats.total} icon={FileText} />
//             <StatsCard
//               title="Approved"
//               value={stats.approved}
//               icon={CheckCircle2}
//               className="text-green-600"
//             />
//             <StatsCard
//               title="Pending"
//               value={stats.pending}
//               icon={Clock}
//               className="text-yellow-600"
//             />
//             <StatsCard
//               title="Rejected"
//               value={stats.rejected}
//               icon={XCircle}
//               className="text-red-600"
//             />
//           </div>
//         </div>

//         {/* Filters */}
//         <Card className="mb-6">
//           <CardContent className="pt-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               {/* Search */}
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search by title, description, tribe, or domain..."
//                     value={localSearchQuery}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>

//               {/* Status Filter */}
//               <Select value={statusFilter} onValueChange={handleStatusChange}>
//                 <SelectTrigger className="w-full md:w-[180px]">
//                   <Filter className="h-4 w-4 mr-2" />
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="approved">Approved</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="rejected">Rejected</SelectItem>
//                 </SelectContent>
//               </Select>

//               {/* Sort */}
//               <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
//                 <SelectTrigger className="w-full md:w-[200px]">
//                   <ArrowUpDown className="h-4 w-4 mr-2" />
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {SORT_OPTIONS.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Results Info */}
//             {hasFilters && (
//               <div className="mt-4 flex items-center justify-between">
//                 <div className="text-sm text-muted-foreground">
//                   Showing <span className="font-medium">{submissions.length}</span> of{" "}
//                   <span className="font-medium">{pagination.totalItems}</span> submissions
//                   {searchQuery && (
//                     <>
//                       {" "}
//                       matching "<span className="font-medium">{searchQuery}</span>"
//                     </>
//                   )}
//                   {statusFilter !== "all" && (
//                     <>
//                       {" "}
//                       with status <span className="font-medium">{statusFilter}</span>
//                     </>
//                   )}
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => {
//                     setLocalSearchQuery("");
//                     updateSearchParams({ search: null, status: null, page: "1" });
//                   }}
//                 >
//                   Clear Filters
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Table */}
//         <Card>
//           <CardContent className="p-0">
//             {loading ? (
//               <LoadingState />
//             ) : submissions.length === 0 ? (
//               <EmptyState hasFilters={hasFilters} onUpload={() => navigate("/upload")} />
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="w-[300px]">Title</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Tribe/Domain</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead>Version</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {submissions.map((submission) => {
//                       const hasPendingAmendment = submission.amendmentStatus?.hasPendingAmendment;
//                       const canEdit = submission.amendmentStatus?.canEdit;
//                       const hasVersions =
//                         submission.amendmentStatus && submission.amendmentStatus.currentVersion > 1;

//                       return (
//                         <TableRow
//                           key={submission._id}
//                           className="cursor-pointer hover:bg-muted/50"
//                         >
//                           <TableCell>
//                             <div
//                               className="space-y-1"
//                               onClick={() => navigate(`/submissions/${submission._id}`)}
//                             >
//                               <p className="font-medium line-clamp-1">{submission.title}</p>
//                               <p className="text-xs text-muted-foreground line-clamp-1">
//                                 {submission.description}
//                               </p>
//                               {hasPendingAmendment && (
//                                 <Badge
//                                   variant="outline"
//                                   className="bg-blue-50 text-blue-700 border-blue-300 text-xs"
//                                 >
//                                   Amendment Pending
//                                 </Badge>
//                               )}
//                             </div>
//                           </TableCell>

//                           <TableCell>
//                             <StatusBadge status={submission.status} />
//                           </TableCell>

//                           <TableCell>
//                             <div className="space-y-1">
//                               {submission.tribe && (
//                                 <div className="flex items-center gap-1 text-xs">
//                                   <Globe className="h-3 w-3 text-muted-foreground" />
//                                   <span className="line-clamp-1">{submission.tribe}</span>
//                                 </div>
//                               )}
//                               {submission.culturalDomain && (
//                                 <Badge variant="outline" className="text-xs">
//                                   {submission.culturalDomain}
//                                 </Badge>
//                               )}
//                             </div>
//                           </TableCell>

//                           <TableCell>
//                             <Badge variant="secondary" className="font-mono text-xs">
//                               {submission.contentFileType.toUpperCase()}
//                             </Badge>
//                           </TableCell>

//                           <TableCell>
//                             {submission.amendmentStatus && (
//                               <Badge variant="outline" className="font-mono text-xs">
//                                 v{submission.amendmentStatus.currentVersion}
//                               </Badge>
//                             )}
//                           </TableCell>

//                           <TableCell>
//                             <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
//                               <Calendar className="h-3 w-3" />
//                               {formatDate(submission.createdAt)}
//                             </div>
//                           </TableCell>

//                           <TableCell className="text-right">
//                             <div className="flex items-center justify-end gap-1">
//                               <TooltipProvider>
//                                 <Tooltip>
//                                   <TooltipTrigger asChild>
//                                     <Button
//                                       variant="ghost"
//                                       size="sm"
//                                       onClick={() => navigate(`/submissions/${submission._id}`)}
//                                     >
//                                       <Eye className="h-4 w-4" />
//                                     </Button>
//                                   </TooltipTrigger>
//                                   <TooltipContent>View details</TooltipContent>
//                                 </Tooltip>
//                               </TooltipProvider>

//                               {canEdit && submission.status === "approved" && (
//                                 <TooltipProvider>
//                                   <Tooltip>
//                                     <TooltipTrigger asChild>
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() =>
//                                           navigate(`/edit-submission/${submission._id}`)
//                                         }
//                                         disabled={hasPendingAmendment}
//                                       >
//                                         <FileEdit className="h-4 w-4" />
//                                       </Button>
//                                     </TooltipTrigger>
//                                     <TooltipContent>
//                                       {hasPendingAmendment
//                                         ? "Amendment pending"
//                                         : "Request amendment"}
//                                     </TooltipContent>
//                                   </Tooltip>
//                                 </TooltipProvider>
//                               )}

//                               {hasVersions && (
//                                 <TooltipProvider>
//                                   <Tooltip>
//                                     <TooltipTrigger asChild>
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() =>
//                                           navigate(`/submissions/${submission._id}/history`)
//                                         }
//                                       >
//                                         <History className="h-4 w-4" />
//                                       </Button>
//                                     </TooltipTrigger>
//                                     <TooltipContent>
//                                       Version history ({submission.amendmentStatus?.currentVersion})
//                                     </TooltipContent>
//                                   </Tooltip>
//                                 </TooltipProvider>
//                               )}
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <PaginationControls
//             currentPage={currentPage}
//             totalPages={pagination.totalPages}
//             totalItems={pagination.totalItems}
//             itemsPerPage={pagination.itemsPerPage}
//             onPageChange={handlePageChange}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default MySubmissions;











import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/api";
import {
  Eye,
  FileText,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  FileEdit,
  Upload,
  ArrowUpDown,
  Calendar,
  Globe,
  ArrowLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ============================================
// TYPE DEFINITIONS
// ============================================
interface Submission {
  _id: string;
  title: string;
  description: string;
  contentFileType: string;
  status: "pending" | "approved" | "rejected";
  tribe?: string;
  culturalDomain?: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
  downloads?: number;
  rejectionReason?: string;
  amendmentStatus?: {
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
  };
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface StatsData {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

// ============================================
// CONSTANTS
// ============================================
const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    label: "PENDING",
  },
  approved: {
    icon: CheckCircle2,
    className: "bg-green-100 text-green-800 border-green-300",
    label: "APPROVED",
  },
  rejected: {
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-300",
    label: "REJECTED",
  },
} as const;

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "updatedAt-desc", label: "Recently Updated" },
] as const;

const DEBOUNCE_DELAY = 500;

// ============================================
// UTILITY FUNCTIONS
// ============================================
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const calculateStats = (submissions: Submission[]): StatsData => {
  return submissions.reduce(
    (acc, submission) => {
      acc.total++;
      acc[submission.status]++;
      return acc;
    },
    { total: 0, approved: 0, pending: 0, rejected: 0 } as StatsData
  );
};

// ============================================
// COMPONENTS
// ============================================
const StatusBadge = ({ status }: { status: keyof typeof STATUS_CONFIG }) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  className,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  className?: string;
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${className}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 opacity-50 ${className}`} />
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({
  hasFilters,
  onUpload,
}: {
  hasFilters: boolean;
  onUpload: () => void;
}) => (
  <div className="text-center py-12 space-y-4">
    <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
    <div>
      <h3 className="text-lg font-semibold">
        {hasFilters ? "No submissions found" : "No submissions yet"}
      </h3>
      <p className="text-muted-foreground">
        {hasFilters
          ? "Try adjusting your filters or search query"
          : "Start by uploading your first cultural heritage content"}
      </p>
    </div>
    {!hasFilters && (
      <Button onClick={onUpload}>
        <Upload className="h-4 w-4 mr-2" />
        Upload Content
      </Button>
    )}
  </div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center space-y-3">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="text-muted-foreground">Loading submissions...</p>
    </div>
  </div>
);

const PaginationControls = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxPages = 5;

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxPages; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxPages + 1; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> submissions
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>First page</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="w-10"
            >
              {pageNum}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Last page</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const MySubmissions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  // State
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Filters from URL
  const statusFilter = searchParams.get("status") || "all";
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Local search state for immediate UI update
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Memoized stats calculation
  const stats = useMemo(() => {
    return {
      total: pagination.totalItems,
      ...calculateStats(submissions),
    };
  }, [submissions, pagination.totalItems]);

  // ============================================
  // API CALLS
  // ============================================
  const fetchSubmissions = useCallback(
    async (showRefreshLoader = false) => {
      try {
        showRefreshLoader ? setRefreshing(true) : setLoading(true);

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: pagination.itemsPerPage.toString(),
          sortBy,
          sortOrder,
        });

        if (statusFilter !== "all") params.append("status", statusFilter);
        if (searchQuery.trim()) params.append("search", searchQuery.trim());

        const res = await authFetch(`/api/submissions/my?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to fetch");

        setSubmissions(data.submissions || []);
        setPagination(data.pagination || pagination);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load submissions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, statusFilter, searchQuery, sortBy, sortOrder, pagination.itemsPerPage, toast]
  );

  // ============================================
  // HANDLERS
  // ============================================
  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setLocalSearchQuery(value);

      const timeoutId = setTimeout(() => {
        updateSearchParams({
          search: value.trim() || null,
          page: "1",
        });
      }, DEBOUNCE_DELAY);

      return () => clearTimeout(timeoutId);
    },
    [updateSearchParams]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      updateSearchParams({
        status: value === "all" ? null : value,
        page: "1",
      });
    },
    [updateSearchParams]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      const [field, order] = value.split("-");
      updateSearchParams({
        sortBy: field,
        sortOrder: order,
        page: "1",
      });
    },
    [updateSearchParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateSearchParams({ page: page.toString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateSearchParams]
  );

  const handleRefresh = useCallback(() => {
    fetchSubmissions(true);
  }, [fetchSubmissions]);

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated, currentPage, statusFilter, searchQuery, sortBy, sortOrder]);

  // Cleanup search timeout
  useEffect(() => {
    return () => {
      // Cleanup will happen automatically with callback
    };
  }, []);

  // ============================================
  // RENDER GUARDS
  // ============================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/signup?redirect=/my-submissions")}
              className="w-full"
            >
              Sign Up / Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasFilters = searchQuery.trim() !== "" || statusFilter !== "all";

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="mb-2 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold">My Submissions</h1>
              <p className="text-muted-foreground">
                Manage and track your cultural heritage submissions
              </p>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleRefresh}
                      disabled={refreshing}
                    >
                      <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh submissions</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button onClick={() => navigate("/upload")} size="lg">
                <Upload className="h-5 w-5 mr-2" />
                Upload New
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard title="Total" value={stats.total} icon={FileText} />
            <StatsCard
              title="Approved"
              value={stats.approved}
              icon={CheckCircle2}
              className="text-green-600"
            />
            <StatsCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              className="text-yellow-600"
            />
            <StatsCard
              title="Rejected"
              value={stats.rejected}
              icon={XCircle}
              className="text-red-600"
            />
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, description, tribe, or domain..."
                    value={localSearchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Info */}
            {hasFilters && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{submissions.length}</span> of{" "}
                  <span className="font-medium">{pagination.totalItems}</span> submissions
                  {searchQuery && (
                    <>
                      {" "}
                      matching "<span className="font-medium">{searchQuery}</span>"
                    </>
                  )}
                  {statusFilter !== "all" && (
                    <>
                      {" "}
                      with status <span className="font-medium">{statusFilter}</span>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLocalSearchQuery("");
                    updateSearchParams({ search: null, status: null, page: "1" });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <LoadingState />
            ) : submissions.length === 0 ? (
              <EmptyState hasFilters={hasFilters} onUpload={() => navigate("/upload")} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tribe/Domain</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => {
                      const hasPendingAmendment = submission.amendmentStatus?.hasPendingAmendment;
                      const canEdit = submission.amendmentStatus?.canEdit;
                      const hasVersions =
                        submission.amendmentStatus && submission.amendmentStatus.currentVersion > 1;

                      return (
                        <TableRow
                          key={submission._id}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <TableCell>
                            <div
                              className="space-y-1"
                              onClick={() => navigate(`/submissions/${submission._id}`)}
                            >
                              <p className="font-medium line-clamp-1">{submission.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {submission.description}
                              </p>
                              {hasPendingAmendment && (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-300 text-xs"
                                >
                                  Amendment Pending
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <StatusBadge status={submission.status} />
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              {submission.tribe && (
                                <div className="flex items-center gap-1 text-xs">
                                  <Globe className="h-3 w-3 text-muted-foreground" />
                                  <span className="line-clamp-1">{submission.tribe}</span>
                                </div>
                              )}
                              {submission.culturalDomain && (
                                <Badge variant="outline" className="text-xs">
                                  {submission.culturalDomain}
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="secondary" className="font-mono text-xs">
                              {submission.contentFileType.toUpperCase()}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            {submission.amendmentStatus && (
                              <Badge variant="outline" className="font-mono text-xs">
                                v{submission.amendmentStatus.currentVersion}
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                              <Calendar className="h-3 w-3" />
                              {formatDate(submission.createdAt)}
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => navigate(`/submissions/${submission._id}`)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View details</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              {canEdit && submission.status === "approved" && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          navigate(`/edit-submission/${submission._id}`)
                                        }
                                        disabled={hasPendingAmendment}
                                      >
                                        <FileEdit className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {hasPendingAmendment
                                        ? "Amendment pending"
                                        : "Request amendment"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}

                              {hasVersions && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          navigate(`/submissions/${submission._id}/history`)
                                        }
                                      >
                                        <History className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Version history ({submission.amendmentStatus?.currentVersion})
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default MySubmissions;