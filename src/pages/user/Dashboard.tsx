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
  bio?: string;
  createdAt: string;
}

const Dashboard = () => {
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<
    RecentSubmission[]
  >([]);
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
        setRecentSubmissions(
          Array.isArray(submissionsData) ? submissionsData : [],
        );
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
    if (user.bio) completed++;

    return Math.round((completed / total) * 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to view your dashboard.
            </CardDescription>
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


  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center space-y-3">
  //         <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
  //         <p className="text-muted-foreground">Loading dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-muted/20">
      {/* <div className="px-4 mx-auto space-y-8"> */}
      <div className="container mx-auto px-4 space-y-6 ">
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

          <div className="space-x-6 flex items-center ">
            <Button
              onClick={() => navigate("/user/dashboard/upload")}
              
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload
            </Button>
            <Button onClick={logout}>Logout</Button>
            <AnimatedThemeToggler />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Submissions */}
          <Card className="hover:shadow-lg transition-shadow border-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Submissions
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalSubmissions || 0}
              </div>
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
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">
                {stats?.pendingSubmissions || 0}
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                Awaiting admin approval
              </p>
            </CardContent>
          </Card>

          {/* Total Engagement */}
          <Card className="hover:shadow-lg transition-shadow border-blue-200 ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Engagement
              </CardTitle>
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
                      <CardTitle className="text-lg">
                        Profile Completion
                      </CardTitle>
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
                  <Progress
                    value={calculateCompletionPercentage()}
                    className="h-2"
                  />
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
                    <CardTitle className="text-xl">
                      Recent Submissions
                    </CardTitle>
                    <CardDescription>
                      Your latest uploads and their status
                    </CardDescription>
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
                        <div className="mt-1">
                          {getStatusIcon(submission.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold truncate">
                              {submission.title}
                            </h4>
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
                                    <History className="h-3 w-3" />v
                                    {submission.amendmentStatus.currentVersion}
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
            {stats &&
              (stats.pendingAmendments > 0 || stats.approvedAmendments > 0) && (
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
                        <Badge variant="secondary">
                          {stats.pendingAmendments}
                        </Badge>
                      </div>
                    )}
                    {stats.approvedAmendments > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Approved</span>
                        </div>
                        <Badge variant="outline">
                          {stats.approvedAmendments}
                        </Badge>
                      </div>
                    )}
                    {stats.rejectedAmendments > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm">Rejected</span>
                        </div>
                        <Badge variant="destructive">
                          {stats.rejectedAmendments}
                        </Badge>
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
                  onClick={() => navigate("/user/dashboard/upload")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Content
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/user/dashboard/submissions")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View All Submissions
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/user/dashboard/profile")}
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
                  <span className="font-medium">
                    {user?.country || "Not Set"}
                  </span>
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
