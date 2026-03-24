
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import {
  FileText,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  MapPin,
  Globe,
  Eye,
  Download,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  TrendingUp,
  BarChart3,
  UserCircle,
  Mail,
  Award,
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
  rejectionReason?: string;
  reviewedBy?: {
    name: string;
    email: string;
  };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name?: string;
  email: string;
  avatar?: string;
  role?: string;
  country?: string;
  state?: string;
  tribe?: string;
  village?: string;
  bio?: string;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  totalViews: number;
  totalDownloads: number;
  amendmentRequests: number;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "pending" | "approved" | "rejected" | "users"
  >("dashboard");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserForm, setEditUserForm] = useState({
    name: "",
    email: "",
    role: "",
    country: "",
    state: "",
    tribe: "",
    village: "",
    bio: "",
  });


    const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      country: user.country || "",
      state: user.state || "",
      tribe: user.tribe || "",
      village: user.village || "",
      bio: user.bio || "",
    });
    setEditUserDialogOpen(true);
  };

   const handleUpdateUser = async () => {
    if (!editingUser) return;

    setActionLoading(true);
    // try {
    //   const response = await fetch(`${API_URL}/api/admin/users/${editingUser._id}`, {
    //     method: "PATCH",
    //     headers: getAuthHeaders(),
    //     body: JSON.stringify(editUserForm),
    //   });

    //   const data = await response.json();
    //   if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to update user");

    //   toast({ title: "Success", description: "User updated successfully" });
    //   setEditUserDialogOpen(false);
    //   setEditingUser(null);
    //   fetchUsers(true);
    // } catch (error: any) {
    //   toast({
    //     title: "Error",
    //     description: error.message || "Failed to update user",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setActionLoading(false);
    // }

    toast({ title: "Info", description: "User update functionality is not implemented yet." });
    setActionLoading(false);
  };

  // Cache management
  const [cacheTimestamps, setCacheTimestamps] = useState<Record<string, number>>({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const navigate = useNavigate();
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("auth_token");
    if (!token) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardStats(true);
    } else if (activeTab === "users") {
      fetchUsers(true);
    } else {
      fetchSubmissions(activeTab, true);
    }
  }, [activeTab]);


  // Add these new useEffect hooks
  useEffect(() => {
    if (activeTab === "users") {
      const debounce = setTimeout(() => {
        fetchUsers(true);
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [searchTerm, roleFilter, activeTab]);

    useEffect(() => {
    if (activeTab !== "dashboard" && activeTab !== "users") {
      const debounce = setTimeout(() => {
        fetchSubmissions(activeTab, true);
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [searchTerm]);

  const isCacheValid = (key: string) => {
    const timestamp = cacheTimestamps[key];
    return timestamp && Date.now() - timestamp < CACHE_DURATION;
  };

  const updateCache = (key: string) => {
    setCacheTimestamps((prev) => ({ ...prev, [key]: Date.now() }));
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("auth_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchDashboardStats = async (forceRefresh = false) => {
    if (!forceRefresh && isCacheValid("dashboard") && stats) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to fetch stats");

      setStats(data.stats);
      updateCache("dashboard");
    } catch (error: any) {
      console.error("Fetch stats error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch dashboard stats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (status: string, forceRefresh = false) => {
    const cacheKey = `submissions_${status}`;
    if (!forceRefresh && isCacheValid(cacheKey) && submissions.length > 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/admin/submissions?status=${status}&search=${searchTerm}`,
        { headers: getAuthHeaders() }
      );

      if (response.status === 401 || response.status === 403) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to fetch submissions");

      setSubmissions(data.submissions || []);
      updateCache(cacheKey);
    } catch (error: any) {
      console.error("Fetch submissions error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch submissions",
        variant: "destructive",
      });
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (forceRefresh = false) => {
    if (!forceRefresh && isCacheValid("users") && users.length > 0) return;

    setLoading(true);
    try {
      const roleParam = roleFilter === "all" ? "" : roleFilter;
      
      const response = await fetch(
        `${API_URL}/api/admin/users?search=${searchTerm}&role=${roleParam}`,
        { headers: getAuthHeaders() }
      );

      if (response.status === 401 || response.status === 403) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to fetch users");

      setUsers(data.users);
      updateCache("users");
    } catch (error: any) {
      console.error("Fetch users error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "dashboard") {
      await fetchDashboardStats(true);
    } else if (activeTab === "users") {
      await fetchUsers(true);
    } else {
      await fetchSubmissions(activeTab, true);
    }
    setRefreshing(false);
    toast({ title: "Refreshed", description: "Data updated successfully" });
  };

  const handleApprove = async (submissionId: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/admin/submissions/${submissionId}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: "approved" }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to approve submission");

      toast({ title: "Success", description: "Submission approved successfully" });
      fetchSubmissions(activeTab, true);
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
      fetchSubmissions(activeTab, true);
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

  const handleDelete = async (submissionId: string) => {
    if (!confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/submissions/${submissionId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to delete submission");

      toast({ title: "Success", description: "Submission deleted successfully" });
      fetchSubmissions(activeTab, true);
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

  const handleViewUser = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to fetch user");

      setSelectedUser(data.user);
      setUserDialogOpen(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch user details",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("auth_token");
    navigate("/admin/login", { replace: true });
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
    const isPdf = type === "text" || /\.pdf$/i.test(url);

    if (isImage) {
      return (
        <img
          src={url}
          alt="Content preview"
          className="w-full max-h-96 object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
          onClick={() => window.open(url, "_blank")}
        />
      );
    }

    if (isVideo) {
      return <video src={url} controls className="w-full max-h-96 rounded-lg" />;
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
              title="PDF Preview"
            />
          </div>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(url, "_blank")}
            >
              <Eye className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const link = document.createElement("a");
                link.href = url;
                link.download = "document.pdf";
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
        <p className="text-sm text-muted-foreground">Document File</p>
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
              link.download = "file";
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

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amendment Requests</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{stats?.amendmentRequests || 0}</div>
            {/* <p className="text-xs text-muted-foreground">Content removed</p> */}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingSubmissions || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.approvedSubmissions || 0}</div>
            <p className="text-xs text-muted-foreground">Live content</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground">Content views</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSubmissionCard = (submission: Submission) => (
    <Card key={submission._id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{submission.title}</CardTitle>
            <CardDescription className="space-y-2">
              <div
                className="flex items-center gap-2 text-sm hover:text-primary cursor-pointer transition"
                onClick={() => handleViewUser(submission.userId._id)}
              >
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
                <Mail className="h-3 w-3" />
                <span>{submission.userId?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(submission.createdAt).toLocaleString()}</span>
              </div>
              {submission.reviewedBy && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-3 w-3" />
                  <span>Reviewed by: {submission.reviewedBy.name}</span>
                </div>
              )}
            </CardDescription>
          </div>
          <Badge
            variant={
              submission.status === "approved"
                ? "default"
                : submission.status === "rejected"
                ? "destructive"
                : "secondary"
            }
          >
            {submission.status}
          </Badge>
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
          <p className="text-sm text-muted-foreground line-clamp-3">
            {submission.description}
          </p>
        </div>

        {submission.keywords && submission.keywords.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {submission.keywords.map((keyword, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">
            Content ({submission.contentFileType})
          </h4>
          {renderFilePreview(submission.contentUrl, submission.contentFileType)}
        </div>

        {submission.status === "rejected" && submission.rejectionReason && (
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
              Rejection Reason
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              {submission.rejectionReason}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          {submission.status === "pending" && (
            <>
              <Button
                className="flex-1 hover:scale-105 transition"
                onClick={() => handleApprove(submission._id)}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
              <Button
                variant="destructive"
                className="flex-1 hover:scale-105 transition"
                onClick={() => {
                  setSelectedSubmission(submission);
                  setRejectDialogOpen(true);
                }}
                disabled={actionLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          {(submission.status === "approved" || submission.status === "rejected") && (
            <Button
              variant="destructive"
              className="flex-1 hover:scale-105 transition"
              onClick={() => handleDelete(submission._id)}
              disabled={actionLoading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderUserCard = (user: User) => (
    <Card
      key={user._id}
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleViewUser(user._id)}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || "User"}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle>{user.name || "Unnamed User"}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          {user.role && (
            <Badge variant="outline" className="ml-auto">
            {user.role}
            </Badge>
            )}
          
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {user.tribe && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{user.tribe}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-primary">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              // className="hover:scale-110 transition"
              className="hover:scale-110 transition h-8 w-8 sm:h-10 sm:w-10"

            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
            {/* <Button variant="outline" onClick={handleLogout}> */}
            <Button variant="outline" onClick={handleLogout} size="sm" className="text-xs sm:text-sm px-2 sm:px-4">

              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>

          {/* <TabsList className="grid w-full max-w-5xl grid-cols-5 mb-6 mx-auto rounded-xl bg-card shadow">
            <TabsTrigger value="dashboard" className="hover:scale-105 transition">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="pending" className="hover:scale-105 transition">
              <FileText className="h-4 w-4 mr-2" />
              Pending
              {stats && stats.pendingSubmissions > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {stats.pendingSubmissions}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="hover:scale-105 transition">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="hover:scale-105 transition">
              <XCircle className="h-4 w-4 mr-2" />
              Rejected
            </TabsTrigger>
            <TabsTrigger value="users" className="hover:scale-105 transition">
              Users
            </TabsTrigger>
          </TabsList> */}

             <TabsList className="grid w-full max-w-5xl grid-cols-5 mb-4 sm:mb-6 gap-1 mx-auto h-auto p-1 overflow-x-auto text-white rounded-3xl ">

            <TabsTrigger value="dashboard" className="text-xs sm:text-sm px-1 sm:px-3 py-2 flex-col sm:flex-row gap-1 sm:gap-2 rounded-3xl ">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Dash</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm px-1 sm:px-3 py-2 flex-col sm:flex-row gap-1 sm:gap-2 relative rounded-3xl ">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Pending</span>
              <span className="sm:hidden">Pend</span>
              {stats && stats.pendingSubmissions > 0 && (
                <Badge variant="secondary" className="text-[10px] sm:text-xs px-1 py-0 sm:ml-2 absolute -top-1 -right-1 sm:relative sm:top-0 sm:right-0">
                  {stats.pendingSubmissions}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs sm:text-sm px-1 sm:px-3 py-2 flex-col sm:flex-row gap-1 sm:gap-2 rounded-3xl">
              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Approved</span>
              <span className="sm:hidden">Appr</span>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs sm:text-sm px-1 sm:px-3 py-2 flex-col sm:flex-row gap-1 sm:gap-2 rounded-3xl ">
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Rejected</span>
              <span className="sm:hidden">Rej</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm px-1 sm:px-3 py-2 flex-col sm:flex-row gap-1 sm:gap-2 rounded-3xl">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Users</span>
              <span className="sm:hidden">User</span>
            </TabsTrigger>
          </TabsList>


          {/* Search Bar */}
          {activeTab !== "dashboard" && (
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {activeTab === "users" && (
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Custodian">Custodian</SelectItem>
                    <SelectItem value="Researcher">Researcher</SelectItem>
                    <SelectItem value="Contributor">Contributor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          )}

          <div className="mt-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <TabsContent value="dashboard">{renderDashboard()}</TabsContent>

                <TabsContent value="pending" className="space-y-6">
                  {submissions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No pending submissions
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {submissions.map(renderSubmissionCard)}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="approved" className="space-y-6">
                  {submissions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No approved submissions
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {submissions.map(renderSubmissionCard)}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="rejected" className="space-y-6">
                  {submissions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No rejected submissions
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {submissions.map(renderSubmissionCard)}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                  {users.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No users found
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {users.map(renderUserCard)}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </main>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this submission. This will be sent to
              the user via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
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

 {/* Enhanced User Details Dialog with Edit */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen} >
        <DialogContent className=" max-h-[90vh] overflow-y-auto max-w-sm sm:max-w-md mx-auto">

          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name || "User"}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {selectedUser.name || "Unnamed User"}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{selectedUser.email}</p>
                  {selectedUser.role && <Badge className="mt-2">{selectedUser.role}</Badge>}
                </div>
                
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {selectedUser.country && (
                  <div>
                    <span className="font-semibold">Country:</span> {selectedUser.country}
                  </div>
                )}
                {selectedUser.state && (
                  <div>
                    <span className="font-semibold">State:</span> {selectedUser.state}
                  </div>
                )}
                {selectedUser.tribe && (
                  <div>
                    <span className="font-semibold">Tribe:</span> {selectedUser.tribe}
                  </div>
                )}
                {selectedUser.village && (
                  <div>
                    <span className="font-semibold">Village:</span> {selectedUser.village}
                  </div>
                )}
              </div>

              {selectedUser.bio && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Bio</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{selectedUser.bio}</p>
                </div>
              )}

              <div className="text-xs sm:text-sm text-muted-foreground">
                Joined: {new Date(selectedUser.createdAt).toLocaleString()}
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setUserDialogOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
            {selectedUser && (
              <Button onClick={() => handleEditUser(selectedUser)} className="w-full sm:w-auto">
                Edit User
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" >
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editUserForm.name}
                  onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                  placeholder="User name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editUserForm.role} onValueChange={(value) => setEditUserForm({ ...editUserForm, role: value })}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Custodian">Custodian</SelectItem>
                  <SelectItem value="Researcher">Researcher</SelectItem>
                  <SelectItem value="Contributor">Contributor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-country">Country</Label>
                <Input
                  id="edit-country"
                  value={editUserForm.country}
                  onChange={(e) => setEditUserForm({ ...editUserForm, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  value={editUserForm.state}
                  onChange={(e) => setEditUserForm({ ...editUserForm, state: e.target.value })}
                  placeholder="State/Region"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tribe">Tribe</Label>
                <Input
                  id="edit-tribe"
                  value={editUserForm.tribe}
                  onChange={(e) => setEditUserForm({ ...editUserForm, tribe: e.target.value })}
                  placeholder="Tribe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-village">Village</Label>
                <Input
                  id="edit-village"
                  value={editUserForm.village}
                  onChange={(e) => setEditUserForm({ ...editUserForm, village: e.target.value })}
                  placeholder="Village"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                value={editUserForm.bio}
                onChange={(e) => setEditUserForm({ ...editUserForm, bio: e.target.value })}
                placeholder="User bio..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditUserDialogOpen(false);
                setEditingUser(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={actionLoading} className="w-full sm:w-auto">
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Admin;