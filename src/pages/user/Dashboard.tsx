// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import Footer from "@/components/Footer";
// import { useToast } from "@/components/ui/use-toast";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { authFetch } from "@/lib/api";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import VersionHistoryModal from "@/components/VersionHistoryModal";
// import {
//   Pencil,
//   User,
//   Mail,
//   MapPin,
//   FileText,
//   Upload,
//   Edit2,
//   Save,
//   X,
//   LogOut,
//   Shield,
//   Clock,
//   XCircle,
//   Eye,
//   FileEdit,
//   History,
// } from "lucide-react";
// import { EditSubmissionModal } from "@/components/EditSubmissionModal";

// interface UserProfile {
//   _id: string;
//   name: string;
//   email: string;
//   role?: "Custodian" | "Researcher" | "Contributor" | "Viewer";
//   country?: string;
//   state?: string;
//   tribe?: string;
//   village?: string;
//   bio?: string;
//   avatar?: string;
// }

// interface Submission {
//   _id: string;
//   title: string;
//   description: string;
//   contentFileType: string;
//   contentUrl: string;
//   status: string;
//   tribe?: string;
//   culturalDomain?: string;
//   createdAt: string;
// }

// const countries = [
//   "New Zealand",
//   "Australia",
//   "United States of America",
//   "Norway",
//   "Sweden",
//   "India",
// ];

// const roleTypes = [
//   {
//     value: "Custodian",
//     label: "Custodian",
//     description: "Cultural knowledge keeper",
//   },
//   {
//     value: "Researcher",
//     label: "Researcher",
//     description: "Academic or scholar",
//   },
//   {
//     value: "Contributor",
//     label: "Contributor",
//     description: "Content creator",
//   },
//   { value: "Viewer", label: "Viewer", description: "General user" },
// ];

// const Profile = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const { token, isAuthenticated, logout: ctxLogout } = useAuth();

//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [items, setItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [uploadingAvatar, setUploadingAvatar] = useState(false);

//   // Profile edit state
//   const [editName, setEditName] = useState("");
//   const [editRole, setEditRole] = useState<string>("");
//   const [editCountry, setEditCountry] = useState("");
//   const [editState, setEditState] = useState("");
//   const [editTribe, setEditTribe] = useState("");
//   const [editVillage, setEditVillage] = useState("");
//   const [editBio, setEditBio] = useState("");
//   const [showHistoryModal, setShowHistoryModal] = useState(false);

//   // Submission edit state
//   const [editingSubmission, setEditingSubmission] = useState<Submission | null>(
//     null
//   );
//   const [editModalOpen, setEditModalOpen] = useState(false);

//   const handleEditClick = (submission: any) => {
//     console.log("Editing submission:", submission);
//     if (
//       !submission.amendmentStatus.canEdit &&
//       submission.amendmentStatus.hasPendingAmendment
//     ) {
//       toast({
//         title: "Edit Not Allowed",
//         description: "You cannot edit this submission at the moment.",
//         variant: "destructive",
//       });

//       return;
//     }

//     setEditingSubmission(submission);
//     setEditModalOpen(true);
//   };

//   const handleEditSuccess = (updatedSubmission: Submission) => {
//     setItems((prev) =>
//       prev.map((item) =>
//         item._id === updatedSubmission._id ? updatedSubmission : item
//       )
//     );
//     toast({
//       title: "Submission updated!",
//       description: "Your changes have been submitted for review.",
//     });
//   };

//   const fetchProfile = async () => {
//     try {
//       const res = await authFetch("/api/auth/me");
//       const data = await res.json();
//       if (!res.ok)
//         throw new Error(data?.errors?.[0]?.msg || "Failed to load profile");
//       setUser(data.user);
//       // Initialize edit fields
//       setEditName(data.user.name || "");
//       setEditRole(data.user.role || "");
//       setEditCountry(data.user.country || "");
//       setEditState(data.user.state || "");
//       setEditTribe(data.user.tribe || "");
//       setEditVillage(data.user.village || "");
//       setEditBio(data.user.bio || "");
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error ? error.message : "Failed to load profile",
//         variant: "destructive",
//       });
//     }
//   };

//   const fetchSubmissions = async () => {
//     try {
//       setLoading(true);
//       const res = await authFetch("/api/submissions/my");
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to load");
//       setItems(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching submissions:", error);
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error
//             ? error.message
//             : "Failed to fetch submissions",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveProfile = async () => {
//     try {
//       const res = await authFetch("/api/auth/profile", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: editName,
//           role: editRole,
//           country: editCountry,
//           state: editState,
//           tribe: editTribe,
//           village: editVillage,
//           bio: editBio,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok)
//         throw new Error(data?.errors?.[0]?.msg || "Failed to update");

//       setUser(data.user);
//       setIsEditingProfile(false);
//       toast({ title: "Profile updated successfully!" });
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error ? error.message : "Failed to update profile",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast({
//         title: "Invalid file",
//         description: "Please upload an image file",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       toast({
//         title: "File too large",
//         description: "Image must be less than 2MB",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setUploadingAvatar(true);
//       const formData = new FormData();
//       formData.append("avatar", file);

//       const res = await authFetch("/api/auth/avatar", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok)
//         throw new Error(data?.errors?.[0]?.msg || "Failed to upload");

//       setUser((prev) => (prev ? { ...prev, avatar: data.avatarUrl } : null));
//       toast({ title: "Avatar updated successfully!" });
//     } catch (error) {
//       console.error("Error uploading avatar:", error);
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error ? error.message : "Failed to upload avatar",
//         variant: "destructive",
//       });
//     } finally {
//       setUploadingAvatar(false);
//     }
//   };

//   const logout = () => {
//     ctxLogout();
//     localStorage.clear();
//     toast({ title: "Logged out successfully" });
//     navigate("/");
//   };

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchProfile();
//       fetchSubmissions();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token, isAuthenticated]);

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Card className="max-w-md">
//           <CardHeader>
//             <CardTitle>Authentication Required</CardTitle>
//             <CardDescription>
//               Please log in to view your profile.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button onClick={() => navigate("/signup")} className="w-full">
//               Sign Up / Login
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const SubmissionCard = ({ submission }: { submission: any }) => {
//     const navigate = useNavigate();
//     const { toast } = useToast();
//     const amendmentStatus = submission.amendmentStatus;

//     // ✅ Determine if user can edit
//     const canEdit =
//       submission.status === "approved" && // Must be approved
//       amendmentStatus?.canEdit; // No pending amendment

//     const isPendingInitialReview = submission.status === "pending";
//     const isRejected = submission.status === "rejected";

//     const formatDate = (dateString: string) => {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     };

//     const viewSubmission = (id: string) => {
//       navigate(`/submission/${id}`);
//     };

//     const viewVersionHistory = (id: string) => {
//       navigate(`/submission/${id}/history`);
//     };

//     return (
//       <Card className="hover:shadow-md transition-shadow">
//         <CardHeader>
//           <CardTitle className="text-lg">{submission.title}</CardTitle>
//           <div className="flex items-center gap-2 mt-2 flex-wrap">
//             {/* Status Badge */}
//             <Badge
//               variant={
//                 submission.status === "approved"
//                   ? "default"
//                   : submission.status === "pending"
//                   ? "secondary"
//                   : "destructive"
//               }
//             >
//               {submission.status}
//             </Badge>

//             {/* Version Badge */}
//             {amendmentStatus && (
//               <Badge variant="outline" className="font-mono text-xs">
//                 v{amendmentStatus.currentVersion}
//               </Badge>
//             )}

//             {/* Data Source Indicator */}
//             {amendmentStatus?.dataSource && (
//               <Badge variant="outline" className="text-[10px] sm:text-xs">
//                 {amendmentStatus.dataSource === "pendingAmendment" &&
//                   "⏳ Viewing Pending Changes"}
//                 {amendmentStatus.dataSource === "approvedContent" &&
//                   "✅ Latest Approved"}
//                 {amendmentStatus.dataSource === "submission" && "📄 Original"}
//               </Badge>
//             )}
//           </div>
//           <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
//             {submission.description}
//           </p>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {/* ⚠️ PENDING INITIAL SUBMISSION */}
//           {isPendingInitialReview && (
//             <Alert className="border-yellow-500 bg-yellow-50">
//               <Clock className="h-4 w-4 text-yellow-600 flex-shrink-0" />
//               <AlertDescription className="text-yellow-800 text-sm">
//                 <strong>Awaiting Initial Approval</strong>
//                 <p className="text-xs mt-1">
//                   Your submission is pending admin review. You cannot make
//                   changes until it's approved.
//                 </p>
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* ❌ REJECTED SUBMISSION */}
//           {isRejected && (
//             <Alert className="border-red-500 bg-red-50">
//               <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
//               <AlertDescription className="text-red-800 text-sm">
//                 <strong>Submission Rejected</strong>
//                 {submission.statusChangeReason && (
//                   <p className="text-xs mt-1">
//                     <strong>Reason:</strong> {submission.statusChangeReason}
//                   </p>
//                 )}
//                 <p className="text-xs mt-2">
//                   You cannot edit rejected submissions. Please create a new
//                   submission with corrections.
//                 </p>
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* ⏳ PENDING AMENDMENT */}
//           {amendmentStatus?.pending && (
//             <Alert className="border-blue-500 bg-blue-50">
//               <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
//               <AlertDescription className="text-blue-800 text-sm">
//                 <strong>Amendment Pending Review</strong>
//                 <p className="text-xs mt-1">
//                   <strong>
//                     Proposed v{amendmentStatus.pending.proposedVersion}:
//                   </strong>{" "}
//                   {amendmentStatus.pending.changesSummary}
//                 </p>
//                 <p className="text-[10px] mt-1 text-blue-600">
//                   Submitted {formatDate(amendmentStatus.pending.requestedAt)}
//                 </p>
//                 <p className="text-[10px] mt-2 font-semibold">
//                   💡 You're viewing your proposed changes. They will replace the
//                   current version if approved.
//                 </p>
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* ❌ LATEST REJECTED AMENDMENT */}
//           {amendmentStatus?.latestRejected && !amendmentStatus.pending && (
//             <Alert className="border-red-500 bg-red-50">
//               <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
//               <AlertDescription className="text-red-800 text-sm">
//                 <strong>Previous Amendment Rejected</strong>
//                 <p className="text-xs mt-1">
//                   <strong>Changes:</strong>{" "}
//                   {amendmentStatus.latestRejected.changesSummary}
//                 </p>
//                 <p className="text-xs mt-1">
//                   <strong>Reason:</strong>{" "}
//                   {amendmentStatus.latestRejected.rejectionReason}
//                 </p>
//                 <p className="text-[10px] mt-1 text-red-600">
//                   Rejected{" "}
//                   {formatDate(amendmentStatus.latestRejected.rejectedAt)}
//                 </p>
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Metadata */}
//           <div className="flex flex-wrap gap-2 text-xs">
//             {submission.tribe && (
//               <Badge variant="outline" className="text-xs">
//                 {submission.tribe}
//               </Badge>
//             )}
//             {submission.culturalDomain && (
//               <Badge variant="outline" className="text-xs">
//                 {submission.culturalDomain}
//               </Badge>
//             )}
//             <Badge variant="outline" className="text-xs">
//               {submission.contentFileType}
//             </Badge>
//             <span className="ml-auto text-muted-foreground">
//               {new Date(submission.createdAt).toLocaleDateString()}
//             </span>
//           </div>

//           <Separator />

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate(`/profile/submissions/${submission._id}`)}
//               className="flex-1 sm:flex-none"
//             >
//               <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//               View Details
//             </Button>

//             {/* ✅ EDIT BUTTON - Only show if can edit */}
//             {canEdit && (
//               <Button
//                 size="sm"
//                 onClick={() => {
//                   // Your existing handleEditClick logic
//                   if (
//                     !submission.amendmentStatus?.canEdit &&
//                     submission.amendmentStatus?.hasPendingAmendment
//                   ) {
//                     toast({
//                       title: "Edit Not Allowed",
//                       description:
//                         "You cannot edit this submission at the moment.",
//                       variant: "destructive",
//                     });
//                     return;
//                   }
//                   // Open edit modal
//                   handleEditClick(submission);
//                 }}
//                 className="flex-1 sm:flex-none"
//               >
//                 <FileEdit className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//                 Request Amendment
//               </Button>
//             )}

//             {/* 📜 VERSION HISTORY */}
//             {amendmentStatus && amendmentStatus.currentVersion > 1 && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowHistoryModal(true)}
//                 className="flex-1 sm:flex-none"
//               >
//                 <History className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//                 Version History ({amendmentStatus.currentVersion} versions)
//               </Button>
//             )}

//             <VersionHistoryModal
//               open={showHistoryModal}
//               onOpenChange={setShowHistoryModal}
//               submissionId={submission._id}
//               submissionTitle={submission.title}
//             />
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="flex-1 py-8">
//         <div className="px-4 mx-auto max-w-7xl">
//           <Tabs defaultValue="profile" className=" space-y-6 ">
//             <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto rounded-xl ">
//               <TabsTrigger value="profile" className="text-white">
//                 <User className="h-4 w-4 mr-2" />
//                 Profile
//               </TabsTrigger>
//               <TabsTrigger value="submissions" className="text-white">
//                 <FileText className="h-4 w-4 mr-2" />
//                 My Submissions
//               </TabsTrigger>
//             </TabsList>

//             {/* Profile Tab */}
//             <TabsContent value="profile" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle className="text-2xl">
//                         Profile Information
//                       </CardTitle>
//                       <CardDescription>
//                         Manage your account details and preferences
//                       </CardDescription>
//                     </div>
//                     {!isEditingProfile ? (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setIsEditingProfile(true)}
//                       >
//                         <Edit2 className="h-4 w-4 mr-2" />
//                         Edit Profile
//                       </Button>
//                     ) : (
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => {
//                             setIsEditingProfile(false);
//                             // Reset to original values
//                             if (user) {
//                               setEditName(user.name || "");
//                               setEditRole(user.role || "");
//                               setEditCountry(user.country || "");
//                               setEditState(user.state || "");
//                               setEditTribe(user.tribe || "");
//                               setEditVillage(user.village || "");
//                               setEditBio(user.bio || "");
//                             }
//                           }}
//                         >
//                           <X className="h-4 w-4 mr-2" />
//                           Cancel
//                         </Button>
//                         <Button size="sm" onClick={handleSaveProfile}>
//                           <Save className="h-4 w-4 mr-2" />
//                           Save Changes
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   {/* Avatar Section */}
//                   <div className="flex flex-col items-center space-y-4 pb-6 border-b">
//                     <Avatar className="h-32 w-32">
//                       <AvatarImage src={user?.avatar} alt={user?.name} />
//                       <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
//                         {user?.name?.charAt(0).toUpperCase() || "U"}
//                       </AvatarFallback>
//                     </Avatar>
//                     {isEditingProfile && (
//                       <div className="text-center space-y-2">
//                         <Label
//                           htmlFor="avatar-upload"
//                           className="cursor-pointer inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium"
//                         >
//                           <Upload className="h-4 w-4 mr-2" />
//                           {uploadingAvatar
//                             ? "Uploading..."
//                             : "Upload New Photo"}
//                         </Label>
//                         <Input
//                           id="avatar-upload"
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={handleAvatarUpload}
//                           disabled={uploadingAvatar}
//                         />
//                         <p className="text-xs text-muted-foreground">
//                           Max 5MB, JPG, PNG, or GIF
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Profile Fields */}
//                   <div className="grid md:grid-cols-2 gap-6">
//                     {/* Name */}
//                     <div className="space-y-2">
//                       <Label htmlFor="name" className="flex items-center gap-2">
//                         <User className="h-4 w-4" />
//                         Full Name
//                       </Label>
//                       {isEditingProfile ? (
//                         <Input
//                           id="name"
//                           value={editName}
//                           onChange={(e) => setEditName(e.target.value)}
//                           placeholder="Enter your full name"
//                         />
//                       ) : (
//                         <div className="text-sm font-medium p-2 border-2 rounded-xl">
//                           {user?.name || "Not set"}
//                         </div>
//                       )}
//                     </div>

//                     {/* Email (read-only) */}
//                     <div className="space-y-2">
//                       <Label className="flex items-center gap-2">
//                         <Mail className="h-4 w-4" />
//                         Email Address
//                       </Label>
//                       <div className="text-sm font-medium p-2 border-2 rounded-xl text-muted-foreground">
//                         {user?.email}
//                       </div>
//                     </div>

//                     {/* Role */}
//                     <div className="space-y-2">
//                       <Label htmlFor="role" className="flex items-center gap-2">
//                         <Shield className="h-4 w-4" />
//                         Role Type
//                       </Label>
//                       {isEditingProfile ? (
//                         <Select value={editRole} onValueChange={setEditRole}>
//                           <SelectTrigger id="role">
//                             <SelectValue placeholder="Select your role" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {roleTypes.map((role) => (
//                               <SelectItem key={role.value} value={role.value}>
//                                 <div>
//                                   <div className="font-medium">
//                                     {role.label}
//                                   </div>
//                                   <div className="text-xs text-muted-foreground">
//                                     {role.description}
//                                   </div>
//                                 </div>
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <Badge variant={user?.role ? "default" : "secondary"}>
//                             {user?.role || "Not set"}
//                           </Badge>
//                         </div>
//                       )}
//                     </div>

//                     {/* Country */}
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="country"
//                         className="flex items-center gap-2"
//                       >
//                         <MapPin className="h-4 w-4" />
//                         Country
//                       </Label>
//                       {isEditingProfile ? (
//                         <Select
//                           value={editCountry}
//                           onValueChange={setEditCountry}
//                         >
//                           <SelectTrigger id="country">
//                             <SelectValue placeholder="Select country" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {countries.map((country) => (
//                               <SelectItem key={country} value={country}>
//                                 {country}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       ) : (
//                         <div className="text-sm font-medium p-2 border-2 rounded-xl">
//                           {user?.country || "Not set"}
//                         </div>
//                       )}
//                     </div>

//                     {/* State */}
//                     <div className="space-y-2">
//                       <Label htmlFor="state">State / Region</Label>
//                       {isEditingProfile ? (
//                         <Input
//                           id="state"
//                           value={editState}
//                           onChange={(e) => setEditState(e.target.value)}
//                           placeholder="Enter state or region"
//                         />
//                       ) : (
//                         <div className="text-sm font-medium p-2 border-2 rounded-xl">
//                           {user?.state || "Not set"}
//                         </div>
//                       )}
//                     </div>

//                     {/* Tribe */}
//                     <div className="space-y-2">
//                       <Label htmlFor="tribe">Tribe / Community</Label>
//                       {isEditingProfile ? (
//                         <Input
//                           id="tribe"
//                           value={editTribe}
//                           onChange={(e) => setEditTribe(e.target.value)}
//                           placeholder="Enter tribe or community"
//                         />
//                       ) : (
//                         <div className="text-sm font-medium p-2 border-2 rounded-xl">
//                           {user?.tribe || "Not set"}
//                         </div>
//                       )}
//                     </div>

//                     {/* Village */}
//                     <div className="space-y-2">
//                       <Label htmlFor="village">Village / Town</Label>
//                       {isEditingProfile ? (
//                         <Input
//                           id="village"
//                           value={editVillage}
//                           onChange={(e) => setEditVillage(e.target.value)}
//                           placeholder="Enter village or town"
//                         />
//                       ) : (
//                         <div className="text-sm font-medium p-2 border-2 rounded-xl">
//                           {user?.village || "Not set"}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <Separator />

//                   {/* Bio */}
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="bio"
//                       className="flex items-center justify-between"
//                     >
//                       <span>Short Bio</span>
//                       {isEditingProfile && (
//                         <span className="text-xs text-muted-foreground">
//                           {editBio.length}/250 words
//                         </span>
//                       )}
//                     </Label>
//                     {isEditingProfile ? (
//                       <Textarea
//                         id="bio"
//                         value={editBio}
//                         onChange={(e) => {
//                           const wordCount = e.target.value
//                             .split(/\s+/)
//                             .filter(Boolean).length;
//                           if (wordCount <= 250) {
//                             setEditBio(e.target.value);
//                           }
//                         }}
//                         placeholder="Tell us about yourself, your role in the community, and your connection to cultural heritage..."
//                         className="min-h-[120px]"
//                       />
//                     ) : (
//                       <div className="text-sm p-3 border-2 rounded-xl min-h-[80px]">
//                         {user?.bio || "No bio added yet"}
//                       </div>
//                     )}
//                   </div>

//                   <Separator />

//                   {/* Logout Button */}
//                   <div className="flex justify-end">
//                     <Button variant="destructive" onClick={logout}>
//                       <LogOut className="h-4 w-4 mr-2" />
//                       Logout
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Submissions Tab */}

//             {/* <TabsContent value="submissions" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-2xl">My Submissions</CardTitle>
//                   <CardDescription>
//                     View and manage your cultural heritage submissions
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {loading ? (
//                     <div className="flex items-center justify-center py-12">
//                       <div className="text-center space-y-3">
//                         <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
//                         <p className="text-muted-foreground">
//                           Loading submissions...
//                         </p>
//                       </div>
//                     </div>
//                   ) : items.length === 0 ? (
//                     <div className="text-center py-12 space-y-4">
//                       <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
//                       <div>
//                         <h3 className="text-lg font-semibold">
//                           No submissions yet
//                         </h3>
//                         <p className="text-muted-foreground">
//                           Start by uploading your first cultural heritage
//                           content
//                         </p>
//                       </div>
//                       <Button onClick={() => navigate("/upload")}>
//                         <Upload className="h-4 w-4 mr-2" />
//                         Upload Content
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {items.map((item) => (
//                         <Card
//                           key={item._id}
//                           className="hover:shadow-md transition-shadow"
//                         >
//                           <CardContent className="pt-6">
//                             <div className="flex justify-between items-start mb-4">
//                               <div className="space-y-1 flex-1">
//                                 <h3 className="text-lg font-semibold">
//                                   {item.title}
//                                 </h3>
//                                 <p className="text-sm text-muted-foreground line-clamp-2">
//                                   {item.description}
//                                 </p>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <Badge
//                                   variant={

//                                     item.amendmentStatus.pending  === null ? 'secondary' :

                          

//                                     }
//                                 >
//                                   {item.status}
//                                 </Badge>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => handleEditClick(item) }
//                                 >
//                                   <Pencil className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </div>

//                             <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
//                               {item.tribe && (
//                                 <Badge variant="outline">{item.tribe}</Badge>
//                               )}
//                               {item.culturalDomain && (
//                                 <Badge variant="outline">
//                                   {item.culturalDomain}
//                                 </Badge>
//                               )}
//                               <Badge variant="outline">
//                                 {item.contentFileType}
//                               </Badge>
//                               <span className="ml-auto">
//                                 {new Date(item.createdAt).toLocaleDateString()}
//                               </span>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent> */}

//             <TabsContent value="submissions" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-2xl">My Submissions</CardTitle>
//                   <CardDescription>
//                     View and manage your cultural heritage submissions
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {loading ? (
//                     <div className="flex items-center justify-center py-12">
//                       <div className="text-center space-y-3">
//                         <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
//                         <p className="text-muted-foreground">
//                           Loading submissions...
//                         </p>
//                       </div>
//                     </div>
//                   ) : items.length === 0 ? (
//                     <div className="text-center py-12 space-y-4">
//                       <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
//                       <div>
//                         <h3 className="text-lg font-semibold">
//                           No submissions yet
//                         </h3>
//                         <p className="text-muted-foreground">
//                           Start by uploading your first cultural heritage
//                           content
//                         </p>
//                       </div>
//                       <Button onClick={() => navigate("/upload")}>
//                         <Upload className="h-4 w-4 mr-2" />
//                         Upload Content
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {/* 🎯 USE THE NEW SUBMISSION CARD HERE */}
//                       {items.map((item) => (
//                         <SubmissionCard key={item._id} submission={item} />
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* Edit Modal */}
//         <EditSubmissionModal
//           open={editModalOpen}
//           onOpenChange={setEditModalOpen}
//           submission={editingSubmission}
//           onSuccess={handleEditSuccess}
//         />
//       </div>
//     </div>
//   );
// };

// export default Profile;





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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/api";
import {
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Download,
  TrendingUp,
  Calendar,
  User,
  Award,
  BarChart3,
  Activity,
  ArrowRight,
  AlertCircle,
  History,
  Globe,
  Shield,
} from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

interface DashboardStats {
  totalSubmissions: number;
  approvedSubmissions: number;
  pendingSubmissions: number;
  rejectedSubmissions: number;
  totalViews: number;
  totalDownloads: number;
  pendingAmendments: number;
  approvedAmendments: number;
  rejectedAmendments: number;
}

interface RecentSubmission {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  contentFileType: string;
  culturalDomain: string;
  tribe: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
  downloads?: number;
  amendmentStatus?: {
    currentVersion: number;
    hasPendingAmendment: boolean;
  };
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role?: string;
  country?: string;
  tribe?: string;
  avatar?: string;
  createdAt: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const profileRes = await authFetch("/api/auth/me");
      const profileData = await profileRes.json();
      if (profileRes.ok) {
        setUser(profileData.user);
      }

      // Fetch dashboard stats
      const statsRes = await authFetch("/api/submissions/my/stats");
      const statsData = await statsRes.json();
      if (statsRes.ok) {
        setStats(statsData);
      }

      // Fetch recent submissions (limit 5)
      const submissionsRes = await authFetch("/api/submissions/my?limit=5");
      const submissionsData = await submissionsRes.json();
      if (submissionsRes.ok) {
        setRecentSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const calculateCompletionPercentage = () => {
    if (!user) return 0;
    let completed = 0;
    const total = 7; // Total profile fields

    if (user.name) completed++;
    if (user.email) completed++;
    if (user.role) completed++;
    if (user.country) completed++;
    if (user.tribe) completed++;
    if (user.avatar) completed++;
    // Bio check would need to be added to user object

    return Math.round((completed / total) * 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/signup")} className="w-full">
              Sign Up / Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-muted/20">
      <div className="px-4 mx-auto max-w-7xl space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || "User"}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your cultural heritage content
            </p>
          </div>
          <AnimatedThemeToggler />

          <Button onClick={() => navigate("/user/dashboard/upload")} size="lg">
            <Upload className="h-5 w-5 mr-2" />
            Upload New Content
          </Button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Submissions */}
          <Card className="hover:shadow-lg transition-shadow border-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSubmissions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All your content uploads
              </p>
            </CardContent>
          </Card>

          {/* Approved */}
          <Card className="hover:shadow-lg transition-shadow border-green-200 ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {stats?.approvedSubmissions || 0}
              </div>
              <p className="text-xs text-green-600 mt-1">Live on platform</p>
            </CardContent>
          </Card>

          {/* Pending */}
          <Card className="hover:shadow-lg transition-shadow border-yellow-200 ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">
                {stats?.pendingSubmissions || 0}
              </div>
              <p className="text-xs text-yellow-600 mt-1">Awaiting admin approval</p>
            </CardContent>
          </Card>

          {/* Total Engagement */}
          <Card className="hover:shadow-lg transition-shadow border-blue-200 ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {(stats?.totalViews || 0) + (stats?.totalDownloads || 0)}
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600 mt-1">
                <Eye className="h-3 w-3" />
                <span>{stats?.totalViews || 0} views</span>
                <span>•</span>
                <Download className="h-3 w-3" />
                <span>{stats?.totalDownloads || 0} downloads</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Profile Completion</CardTitle>
                      <CardDescription>
                        Complete your profile to unlock all features
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/user/dashboard/profile")}
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {calculateCompletionPercentage()}% Complete
                    </span>
                    <span className="font-medium">
                      {calculateCompletionPercentage() === 100
                        ? "Profile Complete! 🎉"
                        : "Keep going!"}
                    </span>
                  </div>
                  <Progress value={calculateCompletionPercentage()} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    {user?.role ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>Role Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {user?.country ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>Location Added</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {user?.tribe ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>Tribe/Community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {user?.avatar ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>Profile Picture</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Submissions</CardTitle>
                    <CardDescription>Your latest uploads and their status</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/user/dashboard/submissions")}
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentSubmissions.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                    <div>
                      <h3 className="font-semibold">No submissions yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload your first cultural heritage content
                      </p>
                    </div>
                    <Button onClick={() => navigate("/upload")}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Content
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentSubmissions.map((submission) => (
                      <div
                        key={submission._id}
                        className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(`/profile/submissions/${submission._id}`)
                        }
                      >
                        <div className="mt-1">{getStatusIcon(submission.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold truncate">{submission.title}</h4>
                            <Badge
                              variant={
                                submission.status === "approved"
                                  ? "default"
                                  : submission.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="shrink-0"
                            >
                              {submission.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {submission.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {submission.tribe}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(submission.createdAt)}
                            </span>
                            {submission.amendmentStatus &&
                              submission.amendmentStatus.currentVersion > 1 && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <History className="h-3 w-3" />
                                    v{submission.amendmentStatus.currentVersion}
                                  </span>
                                </>
                              )}
                          </div>
                          {submission.status === "approved" &&
                            (submission.views || submission.downloads) && (
                              <div className="flex items-center gap-3 mt-2 text-xs">
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Eye className="h-3 w-3" />
                                  {submission.views || 0} views
                                </span>
                                <span className="flex items-center gap-1 text-green-600">
                                  <Download className="h-3 w-3" />
                                  {submission.downloads || 0} downloads
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Amendment Status */}
            {stats && (stats.pendingAmendments > 0 || stats.approvedAmendments > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Amendment Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.pendingAmendments > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Pending</span>
                      </div>
                      <Badge variant="secondary">{stats.pendingAmendments}</Badge>
                    </div>
                  )}
                  {stats.approvedAmendments > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Approved</span>
                      </div>
                      <Badge variant="outline">{stats.approvedAmendments}</Badge>
                    </div>
                  )}
                  {stats.rejectedAmendments > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Rejected</span>
                      </div>
                      <Badge variant="destructive">{stats.rejectedAmendments}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/upload")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Content
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/profile?tab=submissions")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View All Submissions
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">
                    {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant="outline">{user?.role || "Not Set"}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Country</span>
                  <span className="font-medium">{user?.country || "Not Set"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Badge */}
            {stats && stats.approvedSubmissions >= 5 && (
              <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Achievement Unlocked!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-4xl">🏆</div>
                    <h3 className="font-semibold">Cultural Contributor</h3>
                    <p className="text-xs text-muted-foreground">
                      You have {stats.approvedSubmissions} approved submissions!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;