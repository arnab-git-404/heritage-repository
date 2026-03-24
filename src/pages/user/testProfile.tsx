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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/api";
import {
  User,
  Mail,
  MapPin,
  Upload,
  Edit2,
  Save,
  X,
  LogOut,
  ArrowLeft,
  Loader2,
  Globe,
  Building,
  Home,
  Camera,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Bell,
  Shield,
  ChevronRight,
  Tag,
  Plus,
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
  coverPhoto?: string;
  createdAt?: string;
  culturalTags?: string[];
}

interface UserStats {
  submissions: number;
  approved: number;
  pending: number;
  rejected: number;
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
  const { isAuthenticated, logout: ctxLogout } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    submissions: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<string>("");
  const [editCountry, setEditCountry] = useState("");
  const [editState, setEditState] = useState("");
  const [editTribe, setEditTribe] = useState("");
  const [editVillage, setEditVillage] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editCulturalTags, setEditCulturalTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Fetch Profile & Stats
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes] = await Promise.all([
        authFetch("/api/auth/me"),
        authFetch("/api/submissions/my/stats"),
      ]);

      const profileData = await profileRes.json();
      const statsData = await statsRes.json();

      if (!profileRes.ok) throw new Error(profileData?.errors?.[0]?.msg || "Failed to load");

      setUser(profileData.user);
      setStats(statsData || stats);

      // Set edit states
      setEditName(profileData.user.name || "");
      setEditRole(profileData.user.role || "");
      setEditCountry(profileData.user.country || "");
      setEditState(profileData.user.state || "");
      setEditTribe(profileData.user.tribe || "");
      setEditVillage(profileData.user.village || "");
      setEditBio(profileData.user.bio || "");
      setEditCulturalTags(profileData.user.culturalTags || []);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save Profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
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
          culturalTags: editCulturalTags,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to update");

      setUser(data.user);
      setIsEditing(false);
      toast({ title: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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

  // Upload Cover Photo
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingCover(true);
      const formData = new FormData();
      formData.append("coverPhoto", file);

      const res = await authFetch("/api/auth/cover-photo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to upload");

      setUser((prev) => (prev ? { ...prev, coverPhoto: data.coverPhotoUrl } : null));
      toast({ title: "Cover photo updated successfully!" });
    } catch (error) {
      console.error("Error uploading cover photo:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload cover photo",
        variant: "destructive",
      });
    } finally {
      setUploadingCover(false);
    }
  };

  // Add Cultural Tag
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (editCulturalTags.includes(newTag.trim())) {
      toast({
        title: "Duplicate tag",
        description: "This tag already exists",
        variant: "destructive",
      });
      return;
    }
    setEditCulturalTags([...editCulturalTags, newTag.trim()]);
    setNewTag("");
  };

  // Remove Cultural Tag
  const handleRemoveTag = (tag: string) => {
    setEditCulturalTags(editCulturalTags.filter((t) => t !== tag));
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setEditName(user.name || "");
      setEditRole(user.role || "");
      setEditCountry(user.country || "");
      setEditState(user.state || "");
      setEditTribe(user.tribe || "");
      setEditVillage(user.village || "");
      setEditBio(user.bio || "");
      setEditCulturalTags(user.culturalTags || []);
    }
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
    }
  }, [isAuthenticated]);

  // Auth Guard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/signup?redirect=/profile")} className="w-full">
              Sign Up / Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/user/dashboard")}
            className="text-orange-500 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600"
            >
              <Moon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-red-500 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Photo & Avatar Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              {/* Cover Photo */}
              <div className="relative h-48 bg-gradient-to-br from-amber-200 via-orange-100 to-yellow-200">
                {user?.coverPhoto && (
                  <img
                    src={user.coverPhoto}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Change Cover Button */}
                <Label
                  htmlFor="cover-upload"
                  className="absolute top-4 right-4 cursor-pointer inline-flex items-center px-3 py-2 bg-white/90 hover:bg-white rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {uploadingCover ? "Uploading..." : "Change Cover"}
                </Label>
                <Input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                />
              </div>

              {/* Profile Info */}
              <CardContent className="relative pt-0 pb-6">
                {/* Avatar with Edit Badge */}
                <div className="relative -mt-16 ml-6 w-32 h-32">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-orange-400 to-amber-500 text-white">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 cursor-pointer flex items-center justify-center w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-colors"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </div>

                {/* Name & Email */}
                <div className="mt-4 ml-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                      <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
                      {user?.createdAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Member since {formatDate(user.createdAt)}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Bio Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <User className="h-5 w-5 text-orange-500" />
                  Personal Bio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bio */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  {isEditing ? (
                    <Textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell us about yourself and your connection to cultural heritage..."
                      className="min-h-[100px] bg-white"
                      maxLength={500}
                    />
                  ) : (
                    <p className="text-sm text-gray-700 italic">
                      {user?.bio ||
                        '"Click Edit Profile to add your personal bio and share your story"'}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-gray-500 text-right mt-2">
                      {editBio.length}/500 characters
                    </p>
                  )}
                </div>

                {/* Profile Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600 uppercase">Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || "Not set"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600 uppercase">Account Role</Label>
                    {isEditing ? (
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
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800 border-orange-200"
                      >
                        {user?.role || "Viewer"}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Stats Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-800">Activity Stats</CardTitle>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => navigate("/my-submissions")}
                  className="text-orange-500"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{stats.submissions}</div>
                    <div className="text-xs text-gray-600 uppercase mt-1">Submissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                    <div className="text-xs text-gray-600 uppercase mt-1">Approved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                    <div className="text-xs text-gray-600 uppercase mt-1">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
                    <div className="text-xs text-gray-600 uppercase mt-1">Rejected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Cultural Identity */}
          <div className="space-y-6">
            {/* Cultural Identity Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Globe className="h-5 w-5 text-orange-500" />
                  Cultural Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Country */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600 uppercase">Country</Label>
                    {isEditing ? (
                      <Select value={editCountry} onValueChange={setEditCountry}>
                        <SelectTrigger className="mt-1">
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
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {user?.country || "Not set"}
                      </p>
                    )}
                  </div>
                </div>

                {/* State/Region */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Building className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600 uppercase">State / Region</Label>
                    {isEditing ? (
                      <Input
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                        placeholder="Enter state/region"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {user?.state || "Not set"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tribe/Community */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600 uppercase">Tribe / Community</Label>
                    {isEditing ? (
                      <Input
                        value={editTribe}
                        onChange={(e) => setEditTribe(e.target.value)}
                        placeholder="Enter tribe/community"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {user?.tribe || "Not set"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Village/Town */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Home className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600 uppercase">Village / Town</Label>
                    {isEditing ? (
                      <Input
                        value={editVillage}
                        onChange={(e) => setEditVillage(e.target.value)}
                        placeholder="Enter village/town"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {user?.village || "Not set"}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Cultural Tags */}
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-orange-500 hover:text-orange-600 w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cultural Tags
                  </Button>

                  {isEditing && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..."
                          onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                        />
                        <Button
                          onClick={handleAddTag}
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {editCulturalTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {editCulturalTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-orange-100 text-orange-800 border-orange-200"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings Links */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => navigate("/settings/notifications")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Notification Preferences
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>

                <Separator />

                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => navigate("/settings/privacy")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Privacy & Security
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 py-4">
              © 2025 Cultural Heritage Management Platform. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Moon icon component (since it's not in lucide-react)
const Moon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default Profile;