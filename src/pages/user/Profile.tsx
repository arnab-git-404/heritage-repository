import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/api";
import { EditSubmissionModal } from "@/components/EditSubmissionModal";
import {
  User,
  Mail,
  MapPin,
  FileText,
  Upload,
  Edit2,
  Save,
  X,
  LogOut,
  Shield,
  Clock,
  XCircle,
  Eye,
  FileEdit,
  History,
  CheckCircle2,
  Globe,
  Calendar,
  Filter,
  Search,
} from "lucide-react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role?: "Custodian" | "Researcher" | "Contributor" | "Viewer";
  country?: string;
  state?: string;
  tribe?: string;
  village?: string;
  bio?: string;
  avatar?: string;
}

interface Submission {
  _id: string;
  title: string;
  description: string;
  contentFileType: string;
  contentUrl: string;
  status: "pending" | "approved" | "rejected";
  tribe?: string;
  culturalDomain?: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
  downloads?: number;
  rejectionReason?: string;
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

const COUNTRIES = [
  "New Zealand",
  "Australia",
  "United States of America",
  "Norway",
  "Sweden",
  "India",
];

const ROLE_TYPES = [
  {
    value: "Custodian",
    label: "Custodian",
    description: "Cultural knowledge keeper",
  },
  {
    value: "Researcher",
    label: "Researcher",
    description: "Academic or scholar",
  },
  {
    value: "Contributor",
    label: "Contributor",
    description: "Content creator",
  },
  { value: "Viewer", label: "Viewer", description: "General user" },
];

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, logout: ctxLogout } = useAuth();

  // Get initial tab from URL query param
  const initialTab = searchParams.get("tab") || "profile";

  const [user, setUser] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Profile edit state
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<string>("");
  const [editCountry, setEditCountry] = useState("");
  const [editState, setEditState] = useState("");
  const [editTribe, setEditTribe] = useState("");
  const [editVillage, setEditVillage] = useState("");
  const [editBio, setEditBio] = useState("");

  // Submission edit state
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Filter & Search state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      const res = await authFetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to load profile");
      
      setUser(data.user);
      setEditName(data.user.name || "");
      setEditRole(data.user.role || "");
      setEditCountry(data.user.country || "");
      setEditState(data.user.state || "");
      setEditTribe(data.user.tribe || "");
      setEditVillage(data.user.village || "");
      setEditBio(data.user.bio || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load profile",
        variant: "destructive",
      });
    }
  };

  // Fetch Submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await authFetch("/api/submissions/my");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to load");
      
      const submissionsList = Array.isArray(data) ? data : [];
      setSubmissions(submissionsList);
      setFilteredSubmissions(submissionsList);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply Filters
  useEffect(() => {
    let filtered = [...submissions];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.tribe?.toLowerCase().includes(query) ||
          s.culturalDomain?.toLowerCase().includes(query)
      );
    }

    setFilteredSubmissions(filtered);
  }, [statusFilter, searchQuery, submissions]);

  // Save Profile
  const handleSaveProfile = async () => {
    try {
      const res = await authFetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          role: editRole,
          country: editCountry,
          state: editState,
          tribe: editTribe,
          village: editVillage,
          bio: editBio,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to update");

      setUser(data.user);
      setIsEditingProfile(false);
      toast({ title: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  // Upload Avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await authFetch("/api/auth/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to upload");

      setUser((prev) => (prev ? { ...prev, avatar: data.avatarUrl } : null));
      toast({ title: "Avatar updated successfully!" });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle Edit Click
  const handleEditClick = (submission: Submission) => {
    if (!submission.amendmentStatus.canEdit && submission.amendmentStatus.hasPendingAmendment) {
      toast({
        title: "Edit Not Allowed",
        description: "You have a pending amendment under review",
        variant: "destructive",
      });
      return;
    }

    setEditingSubmission(submission);
    setEditModalOpen(true);
  };

  // Handle Edit Success
  const handleEditSuccess = () => {
    fetchSubmissions();
    toast({
      title: "Amendment Requested",
      description: "Your changes have been submitted for review",
    });
  };

  // Logout
  const logout = () => {
    ctxLogout();
    localStorage.clear();
    toast({ title: "Logged out successfully" });
    navigate("/");
  };

  // Format Date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Initial Load
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  // Auth Guard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your profile.</CardDescription>
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

  // Submission Card Component
  const SubmissionCard = ({ submission }: { submission: Submission }) => {
    const canEdit = submission.status === "approved" && submission.amendmentStatus?.canEdit;
    const isPending = submission.status === "pending";
    const isRejected = submission.status === "rejected";

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{submission.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {submission.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge
                variant={
                  submission.status === "approved"
                    ? "default"
                    : submission.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {submission.status.toUpperCase()}
              </Badge>
              {submission.amendmentStatus && (
                <Badge variant="outline" className="font-mono text-xs">
                  v{submission.amendmentStatus.currentVersion}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status Alerts */}
          {isPending && (
            <Alert className="border-yellow-500 bg-yellow-50">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-sm">
                <strong>Awaiting Admin Review</strong>
                <p className="text-xs mt-1">Cannot edit until approved</p>
              </AlertDescription>
            </Alert>
          )}

          {isRejected && (
            <Alert className="border-red-500 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">
                <strong>Rejected</strong>
                {submission.rejectionReason && (
                  <p className="text-xs mt-1">{submission.rejectionReason}</p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {submission.amendmentStatus?.pending && (
            <Alert className="border-blue-500 bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Amendment Pending</strong>
                <p className="text-xs mt-1">
                  {submission.amendmentStatus.pending.changesSummary}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 text-xs">
            {submission.tribe && <Badge variant="outline">{submission.tribe}</Badge>}
            {submission.culturalDomain && (
              <Badge variant="outline">{submission.culturalDomain}</Badge>
            )}
            <Badge variant="outline">{submission.contentFileType}</Badge>
            <span className="ml-auto text-muted-foreground">
              {formatDate(submission.createdAt)}
            </span>
          </div>

          {/* Stats for Approved */}
          {submission.status === "approved" && (submission.views || submission.downloads) && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {submission.views || 0} views
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {submission.downloads || 0} downloads
              </span>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/profile/submissions/${submission._id}`)}
              className="flex-1 sm:flex-none"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>

            {canEdit && (
              <Button
                size="sm"
                onClick={() => handleEditClick(submission)}
                className="flex-1 sm:flex-none"
              >
                <FileEdit className="h-4 w-4 mr-2" />
                Request Amendment
              </Button>
            )}

            {submission.amendmentStatus && submission.amendmentStatus.currentVersion > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/profile/submissions/${submission._id}/history`)}
                className="flex-1 sm:flex-none"
              >
                <History className="h-4 w-4 mr-2" />
                History ({submission.amendmentStatus.currentVersion})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="px-4 mx-auto max-w-7xl">
        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="submissions">
              <FileText className="h-4 w-4 mr-2" />
              My Submissions ({submissions.length})
            </TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Profile Information</CardTitle>
                    <CardDescription>Manage your account details and preferences</CardDescription>
                  </div>
                  {!isEditingProfile ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditingProfile(false);
                          if (user) {
                            setEditName(user.name || "");
                            setEditRole(user.role || "");
                            setEditCountry(user.country || "");
                            setEditState(user.state || "");
                            setEditTribe(user.tribe || "");
                            setEditVillage(user.village || "");
                            setEditBio(user.bio || "");
                          }
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveProfile}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isEditingProfile && (
                    <div className="text-center space-y-2">
                      <Label
                        htmlFor="avatar-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent rounded-md text-sm font-medium"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingAvatar ? "Uploading..." : "Upload New Photo"}
                      </Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                      />
                      <p className="text-xs text-muted-foreground">Max 2MB, JPG, PNG, or GIF</p>
                    </div>
                  )}
                </div>

                {/* Profile Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditingProfile ? (
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      <div className="text-sm font-medium p-2 border rounded">
                        {user?.name || "Not set"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="text-sm font-medium p-2 border rounded text-muted-foreground">
                      {user?.email}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role Type</Label>
                    {isEditingProfile ? (
                      <Select value={editRole} onValueChange={setEditRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_TYPES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={user?.role ? "default" : "secondary"}>
                        {user?.role || "Not set"}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    {isEditingProfile ? (
                      <Select value={editCountry} onValueChange={setEditCountry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-sm font-medium p-2 border rounded">
                        {user?.country || "Not set"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State / Region</Label>
                    {isEditingProfile ? (
                      <Input
                        id="state"
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                      />
                    ) : (
                      <div className="text-sm font-medium p-2 border rounded">
                        {user?.state || "Not set"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tribe">Tribe / Community</Label>
                    {isEditingProfile ? (
                      <Input
                        id="tribe"
                        value={editTribe}
                        onChange={(e) => setEditTribe(e.target.value)}
                      />
                    ) : (
                      <div className="text-sm font-medium p-2 border rounded">
                        {user?.tribe || "Not set"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="village">Village / Town</Label>
                    {isEditingProfile ? (
                      <Input
                        id="village"
                        value={editVillage}
                        onChange={(e) => setEditVillage(e.target.value)}
                      />
                    ) : (
                      <div className="text-sm font-medium p-2 border rounded">
                        {user?.village || "Not set"}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="bio">Short Bio</Label>
                  {isEditingProfile ? (
                    <Textarea
                      id="bio"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="min-h-[120px]"
                    />
                  ) : (
                    <div className="text-sm p-3 border rounded min-h-[80px]">
                      {user?.bio || "No bio added yet"}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button variant="destructive" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUBMISSIONS TAB */}
          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">My Submissions</CardTitle>
                <CardDescription>View and manage your cultural heritage submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search submissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Info */}
                {searchQuery || statusFilter !== "all" ? (
                  <div className="mb-4 text-sm text-muted-foreground">
                    Showing {filteredSubmissions.length} of {submissions.length} submissions
                  </div>
                ) : null}

                {/* Submissions List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-3">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-muted-foreground">Loading submissions...</p>
                    </div>
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {submissions.length === 0 ? "No submissions yet" : "No matching submissions"}
                      </h3>
                      <p className="text-muted-foreground">
                        {submissions.length === 0
                          ? "Start by uploading your first cultural heritage content"
                          : "Try adjusting your filters or search query"}
                      </p>
                    </div>
                    {submissions.length === 0 && (
                      <Button onClick={() => navigate("/upload")}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Content
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSubmissions.map((submission) => (
                      <SubmissionCard key={submission._id} submission={submission} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Modal */}
      <EditSubmissionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        submission={editingSubmission}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default Profile;