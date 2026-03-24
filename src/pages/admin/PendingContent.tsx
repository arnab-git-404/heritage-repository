// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
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
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
//   PaginationEllipsis,
// } from "@/components/ui/pagination";
// import { useToast } from "@/hooks/use-toast";
// import {
//   FileText,
//   CheckCircle,
//   XCircle,
//   Calendar,
//   MapPin,
//   Globe,
//   Eye,
//   Loader2,
//   AlertCircle,
//   Search,
//   UserCircle,
//   Mail,
//   MoreVertical,
//   Filter,
//   LayoutGrid,
//   Table as TableIcon,
// } from "lucide-react";

// interface Submission {
//   _id: string;
//   userId: {
//     _id: string;
//     name: string;
//     email: string;
//     avatar?: string;
//     role?: string;
//     country?: string;
//     tribe?: string;
//   };
//   country: string;
//   stateRegion: string;
//   tribe: string;
//   village?: string;
//   culturalDomain: string;
//   title: string;
//   description: string;
//   keywords: string[];
//   language: string;
//   dateOfRecording?: string;
//   culturalSignificance?: string;
//   contentFileType: string;
//   contentUrl: string;
//   consent: {
//     fileType: string;
//     fileUrl: string;
//     consentType: string;
//     consentNames: string;
//     consentDate: string;
//     permissionType: string[];
//     duration: string;
//     digitalSignature?: string;
//   };
//   accessTier: string;
//   contentWarnings?: string[];
//   warningOtherText?: string;
//   translationFileUrl?: string;
//   backgroundInfo?: string;
//   verificationDocUrl?: string;
//   status: "pending" | "approved" | "rejected";
//   createdAt: string;
//   updatedAt: string;
// }

// const PendingContent = () => {
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [culturalDomainFilter, setCulturalDomainFilter] = useState("all");
//   const [countryFilter, setCountryFilter] = useState("all");
//   const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [itemsPerPage, setItemsPerPage] = useState(12);

//   // Dialog states
//   const [viewDialogOpen, setViewDialogOpen] = useState(false);
//   const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
//   const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [actionLoading, setActionLoading] = useState(false);

//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("adminToken") || localStorage.getItem("auth_token");
//     return {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     };
//   };

//   useEffect(() => {
//     fetchSubmissions();
//   }, [currentPage, itemsPerPage, searchTerm, culturalDomainFilter, countryFilter]);

//   const fetchSubmissions = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         status: "pending",
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//         search: searchTerm,
//         culturalDomain: culturalDomainFilter !== "all" ? culturalDomainFilter : "",
//         country: countryFilter !== "all" ? countryFilter : "",
//       });

//       const response = await fetch(
//         `${API_URL}/api/admin/submissions?${params.toString()}`,
//         { headers: getAuthHeaders() }
//       );

//       if (response.status === 401 || response.status === 403) {
//         navigate("/admin/login", { replace: true });
//         return;
//       }

//       const data = await response.json();
//       if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to fetch submissions");

//       setSubmissions(data.submissions || []);
//       setTotalCount(data.pagination?.total || 0);
//       setTotalPages(data.pagination?.pages || 1);
//       setCurrentPage(data.pagination?.page || 1);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to fetch pending submissions",
//         variant: "destructive",
//       });
//       setSubmissions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (submissionId: string) => {
//     setActionLoading(true);
//     try {
//       const response = await fetch(
//         `${API_URL}/api/admin/submissions/${submissionId}/status`,
//         {
//           method: "PATCH",
//           headers: getAuthHeaders(),
//           body: JSON.stringify({ status: "approved" }),
//         }
//       );

//       const data = await response.json();
//       if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to approve submission");

//       toast({ title: "Success", description: "Submission approved successfully" });
//       fetchSubmissions();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to approve submission",
//         variant: "destructive",
//       });
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleReject = async () => {
//     if (!selectedSubmission || !rejectionReason.trim()) {
//       toast({
//         title: "Error",
//         description: "Please provide a rejection reason",
//         variant: "destructive",
//       });
//       return;
//     }

//     setActionLoading(true);
//     try {
//       const response = await fetch(
//         `${API_URL}/api/admin/submissions/${selectedSubmission._id}/status`,
//         {
//           method: "PATCH",
//           headers: getAuthHeaders(),
//           body: JSON.stringify({ status: "rejected", reason: rejectionReason }),
//         }
//       );

//       const data = await response.json();
//       if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to reject submission");

//       toast({ title: "Success", description: "Submission rejected successfully" });
//       setRejectDialogOpen(false);
//       setRejectionReason("");
//       setSelectedSubmission(null);
//       fetchSubmissions();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to reject submission",
//         variant: "destructive",
//       });
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleViewSubmission = (submission: Submission) => {
//     setSelectedSubmission(submission);
//     setViewDialogOpen(true);
//   };

//   const renderFilePreview = (url: string, type: string) => {
//     if (!url) {
//       return (
//         <div className="flex items-center justify-center p-8 bg-muted/20 rounded text-muted-foreground">
//           <AlertCircle className="h-5 w-5 mr-2" />
//           File not available
//         </div>
//       );
//     }

//     const isImage = type === "image" || /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
//     const isVideo = type === "video" || /\.(mp4|webm|mov)$/i.test(url);
//     const isAudio = type === "audio" || /\.(mp3|wav|ogg)$/i.test(url);

//     if (isImage) {
//       return (
//         <img
//           src={url}
//           alt="Content preview"
//           className="w-full max-h-64 object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
//           onClick={() => window.open(url, "_blank")}
//         />
//       );
//     }

//     if (isVideo) {
//       return <video src={url} controls className="w-full max-h-64 rounded-lg" />;
//     }

//     if (isAudio) {
//       return <audio src={url} controls className="w-full" />;
//     }

//     return (
//       <div className="flex flex-col items-center gap-4 p-8 bg-muted/20 rounded-lg">
//         <FileText className="h-12 w-12 text-muted-foreground" />
//         <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")}>
//           <Eye className="h-4 w-4 mr-2" />
//           View Document
//         </Button>
//       </div>
//     );
//   };

//   const getUniqueValues = (key: keyof Submission) => {
//     const values = submissions.map((sub) => sub[key] as string).filter(Boolean);
//     return Array.from(new Set(values)).sort();
//   };

//   const renderGridView = () => (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//       {submissions.map((submission) => (
//         <Card key={submission._id} className="overflow-hidden hover:shadow-lg transition-shadow">
//           <CardHeader>
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <CardTitle className="text-lg mb-2">{submission.title}</CardTitle>
//                 <CardDescription className="space-y-2">
//                   <div className="flex items-center gap-2 text-sm">
//                     {submission.userId?.avatar ? (
//                       <img
//                         src={submission.userId.avatar}
//                         alt={submission.userId.name}
//                         className="h-5 w-5 rounded-full object-cover"
//                       />
//                     ) : (
//                       <UserCircle className="h-5 w-5" />
//                     )}
//                     <span className="font-medium">{submission.userId?.name || "Unknown User"}</span>
//                     {submission.userId?.role && (
//                       <Badge variant="outline" className="text-xs">
//                         {submission.userId.role}
//                       </Badge>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Calendar className="h-3 w-3" />
//                     <span>Submitted: {new Date(submission.createdAt).toLocaleDateString()}</span>
//                   </div>
//                 </CardDescription>
//               </div>
              
//               <div className="flex items-start gap-2">
//                 <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
//                   Pending
//                 </Badge>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => handleViewSubmission(submission)}>
//                       <Eye className="h-4 w-4 mr-2" />
//                       View Details
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => handleApprove(submission._id)}>
//                       <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
//                       Approve
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                       onClick={() => {
//                         setSelectedSubmission(submission);
//                         setRejectDialogOpen(true);
//                       }}
//                       className="text-red-600"
//                     >
//                       <XCircle className="h-4 w-4 mr-2" />
//                       Reject
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <h4 className="text-sm font-semibold flex items-center gap-2">
//                 <Globe className="h-4 w-4" />
//                 Location & Domain
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 <Badge variant="outline">{submission.country}</Badge>
//                 <Badge variant="outline">{submission.stateRegion}</Badge>
//                 <Badge variant="outline">{submission.tribe}</Badge>
//                 {submission.village && <Badge variant="outline">{submission.village}</Badge>}
//                 <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
//                   {submission.culturalDomain}
//                 </Badge>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h4 className="text-sm font-semibold">Description</h4>
//               <p className="text-sm text-muted-foreground line-clamp-2">
//                 {submission.description}
//               </p>
//             </div>

//             {submission.keywords && submission.keywords.length > 0 && (
//               <div className="space-y-2">
//                 <h4 className="text-sm font-semibold">Keywords</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {submission.keywords.slice(0, 5).map((keyword, idx) => (
//                     <Badge key={idx} variant="secondary" className="text-xs">
//                       {keyword}
//                     </Badge>
//                   ))}
//                   {submission.keywords.length > 5 && (
//                     <Badge variant="secondary" className="text-xs">
//                       +{submission.keywords.length - 5} more
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//             )}

//             <div className="space-y-2">
//               <h4 className="text-sm font-semibold">
//                 Content Preview ({submission.contentFileType})
//               </h4>
//               {renderFilePreview(submission.contentUrl, submission.contentFileType)}
//             </div>

//             <div className="flex gap-2 pt-2 border-t">
//               <Button
//                 className="flex-1"
//                 onClick={() => handleApprove(submission._id)}
//                 disabled={actionLoading}
//               >
//                 <CheckCircle className="h-4 w-4 mr-2" />
//                 Approve
//               </Button>
//               <Button
//                 variant="destructive"
//                 className="flex-1"
//                 onClick={() => {
//                   setSelectedSubmission(submission);
//                   setRejectDialogOpen(true);
//                 }}
//                 disabled={actionLoading}
//               >
//                 <XCircle className="h-4 w-4 mr-2" />
//                 Reject
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );

//   const renderTableView = () => (
//     <div className="border rounded-lg overflow-hidden">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Title</TableHead>
//             <TableHead>Submitter</TableHead>
//             <TableHead>Location</TableHead>
//             <TableHead>Domain</TableHead>
//             <TableHead>Submitted</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {submissions.map((submission) => (
//             <TableRow key={submission._id}>
//               <TableCell>
//                 <div className="max-w-[200px]">
//                   <p className="font-medium truncate">{submission.title}</p>
//                   <p className="text-xs text-muted-foreground truncate">
//                     {submission.description}
//                   </p>
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <div className="flex items-center gap-2">
//                   {submission.userId?.avatar ? (
//                     <img
//                       src={submission.userId.avatar}
//                       alt={submission.userId.name}
//                       className="h-8 w-8 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//                       <UserCircle className="h-5 w-5 text-primary" />
//                     </div>
//                   )}
//                   <div>
//                     <p className="text-sm font-medium">{submission.userId?.name || "Unknown"}</p>
//                     <p className="text-xs text-muted-foreground">{submission.userId?.email}</p>
//                   </div>
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <div className="text-sm">
//                   <p>{submission.tribe}</p>
//                   <p className="text-xs text-muted-foreground">{submission.country}</p>
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <Badge variant="outline">{submission.culturalDomain}</Badge>
//               </TableCell>
//               <TableCell>
//                 <div className="text-sm text-muted-foreground">
//                   {new Date(submission.createdAt).toLocaleDateString()}
//                 </div>
//               </TableCell>
//               <TableCell className="text-right">
//                 <div className="flex justify-end gap-2">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleViewSubmission(submission)}
//                   >
//                     <Eye className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     onClick={() => handleApprove(submission._id)}
//                     disabled={actionLoading}
//                   >
//                     <CheckCircle className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="destructive"
//                     onClick={() => {
//                       setSelectedSubmission(submission);
//                       setRejectDialogOpen(true);
//                     }}
//                     disabled={actionLoading}
//                   >
//                     <XCircle className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-3xl font-heading font-bold flex items-center gap-2">
//             <FileText className="h-8 w-8 text-yellow-600" />
//             Pending Submissions
//           </h2>
//           <p className="text-muted-foreground mt-1">
//             {totalCount} submission{totalCount !== 1 ? 's' : ''} awaiting review
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search by title, description, or tribe..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="pl-10"
//           />
//         </div>
//         <Select
//           value={culturalDomainFilter}
//           onValueChange={(v) => {
//             setCulturalDomainFilter(v);
//             setCurrentPage(1);
//           }}
//         >
//           <SelectTrigger className="w-full sm:w-48">
//             <Filter className="h-4 w-4 mr-2" />
//             <SelectValue placeholder="Cultural Domain" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Domains</SelectItem>
//             {getUniqueValues("culturalDomain").map((domain) => (
//               <SelectItem key={domain} value={domain}>
//                 {domain}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Select
//           value={countryFilter}
//           onValueChange={(v) => {
//             setCountryFilter(v);
//             setCurrentPage(1);
//           }}
//         >
//           <SelectTrigger className="w-full sm:w-48">
//             <Globe className="h-4 w-4 mr-2" />
//             <SelectValue placeholder="Country" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Countries</SelectItem>
//             {getUniqueValues("country").map((country) => (
//               <SelectItem key={country} value={country}>
//                 {country}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Select
//           value={itemsPerPage.toString()}
//           onValueChange={(v) => {
//             setItemsPerPage(Number(v));
//             setCurrentPage(1);
//           }}
//         >
//           <SelectTrigger className="w-full sm:w-32">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="12">12 per page</SelectItem>
//             <SelectItem value="24">24 per page</SelectItem>
//             <SelectItem value="48">48 per page</SelectItem>
//           </SelectContent>
//         </Select>
//         <div className="flex gap-2">
//           <Button
//             variant={viewMode === "table" ? "default" : "outline"}
//             size="icon"
//             onClick={() => setViewMode("table")}
//           >
//             <TableIcon className="h-4 w-4" />
//           </Button>
//           <Button
//             variant={viewMode === "grid" ? "default" : "outline"}
//             size="icon"
//             onClick={() => setViewMode("grid")}
//           >
//             <LayoutGrid className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Content */}
//       {loading ? (
//         <div className="flex items-center justify-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//         </div>
//       ) : submissions.length === 0 ? (
//         <div className="text-center py-12 text-muted-foreground">
//           <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
//           <p>No pending submissions found</p>
//         </div>
//       ) : (
//         <>
//           {viewMode === "grid" ? renderGridView() : renderTableView()}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between">
//               <p className="text-sm text-muted-foreground">
//                 Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
//                 {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
//               </p>

//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                       className={
//                         currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
//                       }
//                     />
//                   </PaginationItem>

//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }

//                     return (
//                       <PaginationItem key={pageNum}>
//                         <PaginationLink
//                           onClick={() => setCurrentPage(pageNum)}
//                           isActive={currentPage === pageNum}
//                           className="cursor-pointer"
//                         >
//                           {pageNum}
//                         </PaginationLink>
//                       </PaginationItem>
//                     );
//                   })}

//                   {totalPages > 5 && currentPage < totalPages - 2 && (
//                     <PaginationItem>
//                       <PaginationEllipsis />
//                     </PaginationItem>
//                   )}

//                   <PaginationItem>
//                     <PaginationNext
//                       onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                       className={
//                         currentPage === totalPages
//                           ? "pointer-events-none opacity-50"
//                           : "cursor-pointer"
//                       }
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             </div>
//           )}
//         </>
//       )}

//       {/* View Details Dialog */}
//       <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Submission Details</DialogTitle>
//           </DialogHeader>
//           {selectedSubmission && (
//             <div className="space-y-6">
//               {/* User Info */}
//               <div className="flex items-center gap-4">
//                 {selectedSubmission.userId?.avatar ? (
//                   <img
//                     src={selectedSubmission.userId.avatar}
//                     alt={selectedSubmission.userId.name}
//                     className="h-16 w-16 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
//                     <UserCircle className="h-10 w-10 text-primary" />
//                   </div>
//                 )}
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold">{selectedSubmission.userId?.name}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     {selectedSubmission.userId?.email}
//                   </p>
//                   {selectedSubmission.userId?.role && (
//                     <Badge className="mt-1">{selectedSubmission.userId.role}</Badge>
//                   )}
//                 </div>
//                 <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
//                   Pending Review
//                 </Badge>
//               </div>

//               {/* Content Details */}
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="text-sm font-semibold mb-2">Title</h4>
//                   <p className="text-sm">{selectedSubmission.title}</p>
//                 </div>

//                 <div>
//                   <h4 className="text-sm font-semibold mb-2">Description</h4>
//                   <p className="text-sm text-muted-foreground">{selectedSubmission.description}</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <h4 className="text-sm font-semibold mb-2">Location</h4>
//                     <div className="space-y-1 text-sm">
//                       <p>Country: {selectedSubmission.country}</p>
//                       <p>State/Region: {selectedSubmission.stateRegion}</p>
//                       <p>Tribe: {selectedSubmission.tribe}</p>
//                       {selectedSubmission.village && <p>Village: {selectedSubmission.village}</p>}
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-semibold mb-2">Details</h4>
//                     <div className="space-y-1 text-sm">
//                       <p>Domain: {selectedSubmission.culturalDomain}</p>
//                       <p>Language: {selectedSubmission.language}</p>
//                       <p>Access: {selectedSubmission.accessTier}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {selectedSubmission.keywords && selectedSubmission.keywords.length > 0 && (
//                   <div>
//                     <h4 className="text-sm font-semibold mb-2">Keywords</h4>
//                     <div className="flex flex-wrap gap-2">
//                       {selectedSubmission.keywords.map((keyword, idx) => (
//                         <Badge key={idx} variant="secondary">
//                           {keyword}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div>
//                   <h4 className="text-sm font-semibold mb-2">Content</h4>
//                   {renderFilePreview(
//                     selectedSubmission.contentUrl,
//                     selectedSubmission.contentFileType
//                   )}
//                 </div>

//                 {selectedSubmission.culturalSignificance && (
//                   <div>
//                     <h4 className="text-sm font-semibold mb-2">Cultural Significance</h4>
//                     <p className="text-sm text-muted-foreground">
//                       {selectedSubmission.culturalSignificance}
//                     </p>
//                   </div>
//                 )}

//                 <div className="text-sm text-muted-foreground">
//                   Submitted: {new Date(selectedSubmission.createdAt).toLocaleString()}
//                 </div>
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
//               Close
//             </Button>
//             {selectedSubmission && (
//               <>
//                 <Button
//                   onClick={() => {
//                     setViewDialogOpen(false);
//                     handleApprove(selectedSubmission._id);
//                   }}
//                   disabled={actionLoading}
//                 >
//                   <CheckCircle className="h-4 w-4 mr-2" />
//                   Approve
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => {
//                     setViewDialogOpen(false);
//                     setRejectDialogOpen(true);
//                   }}
//                   disabled={actionLoading}
//                 >
//                   <XCircle className="h-4 w-4 mr-2" />
//                   Reject
//                 </Button>
//               </>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Reject Dialog */}
//       <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Reject Submission</DialogTitle>
//             <DialogDescription>
//               Please provide a reason for rejecting this submission. This will be sent to the user
//               via email.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <Textarea
//               placeholder="Enter rejection reason..."
//               value={rejectionReason}
//               onChange={(e) => setRejectionReason(e.target.value)}
//               rows={4}
//             />
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setRejectDialogOpen(false);
//                 setRejectionReason("");
//                 setSelectedSubmission(null);
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleReject}
//               disabled={actionLoading || !rejectionReason.trim()}
//             >
//               {actionLoading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Rejecting...
//                 </>
//               ) : (
//                 "Reject Submission"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default PendingContent;










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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Globe,
  Eye,
  Loader2,
  AlertCircle,
  Search,
  UserCircle,
  Mail,
  MoreVertical,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  FileCheck,
  Shield,
  Download,
  AlertTriangle,
  CheckCircle2,
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
  createdAt: string;
  updatedAt: string;
}

const Pending = () => {
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
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Approval confirmation checklist
  const [approvalChecklist, setApprovalChecklist] = useState({
    contentReviewed: false,
    consentVerified: false,
    qualityCheck: false,
    culturalRespect: false,
  });

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
        status: "pending",
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
        description: error.message || "Failed to fetch pending submissions",
        variant: "destructive",
      });
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setApprovalChecklist({
      contentReviewed: false,
      consentVerified: false,
      qualityCheck: false,
      culturalRespect: false,
    });
    setApproveDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedSubmission) return;

    const allChecked = Object.values(approvalChecklist).every(Boolean);
    if (!allChecked) {
      toast({
        title: "Incomplete Review",
        description: "Please complete all checklist items before approving",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/admin/submissions/${selectedSubmission._id}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: "approved" }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to approve submission");

      toast({ title: "Success", description: "Submission approved successfully" });
      setApproveDialogOpen(false);
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve submission",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/admin/submissions/${selectedSubmission._id}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: "rejected", reason: rejectionReason }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to reject submission");

      toast({ title: "Success", description: "Submission rejected successfully" });
      setRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject submission",
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
        <CardDescription>Review consent form and permissions</CardDescription>
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
            <span className="font-semibold text-sm">Permissions Granted:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {consent.permissionType.map((permission, idx) => (
                <Badge key={idx} variant="outline" className="bg-green-50 text-green-700">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {consent.digitalSignature && (
          <div>
            <span className="font-semibold text-sm">Digital Signature:</span>
            <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted p-2 rounded">
              {consent.digitalSignature}
            </p>
          </div>
        )}

        <Separator />

        <div>
          <span className="font-semibold text-sm flex items-center gap-2 mb-3">
            <FileCheck className="h-4 w-4" />
            Consent Document ({consent.fileType})
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
        <Card key={submission._id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    {submission.userId?.role && (
                      <Badge variant="outline" className="text-xs">
                        {submission.userId.role}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Submitted: {new Date(submission.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardDescription>
              </div>
              
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Pending
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
                    <DropdownMenuItem onClick={() => handleApproveClick(submission)}>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setRejectDialogOpen(true);
                      }}
                      className="text-red-600"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
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
                {submission.village && <Badge variant="outline">{submission.village}</Badge>}
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

            {/* Consent Status Badge */}
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Consent: {submission.consent.consentType}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">
                Content Preview ({submission.contentFileType})
              </h4>
              {renderFilePreview(submission.contentUrl, submission.contentFileType, "Content")}
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                className="flex-1"
                onClick={() => handleApproveClick(submission)}
                disabled={actionLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Review & Approve
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  setSelectedSubmission(submission);
                  setRejectDialogOpen(true);
                }}
                disabled={actionLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
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
            <TableHead>Domain</TableHead>
            <TableHead>Consent</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission._id}>
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
                <Badge variant="outline">{submission.culturalDomain}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                  <Shield className="h-3 w-3 mr-1" />
                  {submission.consent.consentType}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {new Date(submission.createdAt).toLocaleDateString()}
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
                    onClick={() => handleApproveClick(submission)}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setRejectDialogOpen(true);
                    }}
                    disabled={actionLoading}
                  >
                    <XCircle className="h-4 w-4" />
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
            <FileText className="h-8 w-8 text-yellow-600" />
            Pending Submissions
          </h2>
          <p className="text-muted-foreground mt-1">
            {totalCount} submission{totalCount !== 1 ? 's' : ''} awaiting review
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
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>No pending submissions found</p>
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
            <DialogTitle>Submission Review - Complete Details</DialogTitle>
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
                  {selectedSubmission.userId?.role && (
                    <Badge className="mt-1">{selectedSubmission.userId.role}</Badge>
                  )}
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Pending Review
                </Badge>
              </div>

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

                    {selectedSubmission.keywords && selectedSubmission.keywords.length > 0 && (
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
                      <h4 className="text-sm font-semibold mb-2">Main Content</h4>
                      {renderFilePreview(
                        selectedSubmission.contentUrl,
                        selectedSubmission.contentFileType,
                        "Main Content"
                      )}
                    </div>

                    {selectedSubmission.culturalSignificance && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Cultural Significance</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedSubmission.culturalSignificance}
                        </p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Consent Document */}
                <AccordionItem value="consent">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Consent Documentation (Required Review)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    {renderConsentDetails(selectedSubmission.consent)}
                  </AccordionContent>
                </AccordionItem>

                {/* Additional Files */}
                {(selectedSubmission.translationFileUrl ||
                  selectedSubmission.verificationDocUrl) && (
                  <AccordionItem value="additional">
                    <AccordionTrigger className="text-lg font-semibold">
                      Additional Documents
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {selectedSubmission.translationFileUrl && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Translation</h4>
                          {renderFilePreview(
                            selectedSubmission.translationFileUrl,
                            "text",
                            "Translation"
                          )}
                        </div>
                      )}
                      {selectedSubmission.verificationDocUrl && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Verification Document</h4>
                          {renderFilePreview(
                            selectedSubmission.verificationDocUrl,
                            "text",
                            "Verification"
                          )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>

              <div className="text-sm text-muted-foreground">
                Submitted: {new Date(selectedSubmission.createdAt).toLocaleString()}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedSubmission && (
              <>
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleApproveClick(selectedSubmission);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Review & Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setViewDialogOpen(false);
                    setRejectDialogOpen(true);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Dialog with Checklist */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Confirm Approval - Review Checklist
            </DialogTitle>
            <DialogDescription>
              Please confirm you have reviewed all aspects of this submission before approving.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Submission Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{selectedSubmission.title}</CardTitle>
                  <CardDescription>
                    By {selectedSubmission.userId?.name} • {selectedSubmission.tribe},{" "}
                    {selectedSubmission.country}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Checklist */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Review Checklist
                </h4>

                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="content"
                      checked={approvalChecklist.contentReviewed}
                      onCheckedChange={(checked) =>
                        setApprovalChecklist({
                          ...approvalChecklist,
                          contentReviewed: checked as boolean,
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="content"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Content Reviewed
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I have reviewed the main content and verified its quality and appropriateness
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent"
                      checked={approvalChecklist.consentVerified}
                      onCheckedChange={(checked) =>
                        setApprovalChecklist({
                          ...approvalChecklist,
                          consentVerified: checked as boolean,
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="consent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4 text-blue-600" />
                        Consent Document Verified
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I have reviewed the consent document and verified all permissions are properly
                        granted
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="quality"
                      checked={approvalChecklist.qualityCheck}
                      onCheckedChange={(checked) =>
                        setApprovalChecklist({
                          ...approvalChecklist,
                          qualityCheck: checked as boolean,
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="quality"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Quality Standards Met
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Content meets platform quality standards (clarity, completeness, metadata)
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="cultural"
                      checked={approvalChecklist.culturalRespect}
                      onCheckedChange={(checked) =>
                        setApprovalChecklist({
                          ...approvalChecklist,
                          culturalRespect: checked as boolean,
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="cultural"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Cultural Sensitivity Verified
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Content respects cultural protocols and does not contain sensitive material
                      </p>
                    </div>
                  </div>
                </div>

                {!Object.values(approvalChecklist).every(Boolean) && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      Please complete all checklist items before approving
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setApproveDialogOpen(false);
                setApprovalChecklist({
                  contentReviewed: false,
                  consentVerified: false,
                  qualityCheck: false,
                  culturalRespect: false,
                });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={actionLoading || !Object.values(approvalChecklist).every(Boolean)}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Approval
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Please provide a detailed reason for rejecting this submission. This will be sent to
              the user via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason("");
                setSelectedSubmission(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading || !rejectionReason.trim()}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Submission"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pending;