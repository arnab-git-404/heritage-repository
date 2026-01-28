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
  createdAt?: string;
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
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<string>("");
  const [editCountry, setEditCountry] = useState("");
  const [editState, setEditState] = useState("");
  const [editTribe, setEditTribe] = useState("");
  const [editVillage, setEditVillage] = useState("");
  const [editBio, setEditBio] = useState("");

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
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
      month: "long",
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
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 ">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/user/dashboard")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Profile Information</CardTitle>
                <CardDescription>Your personal details and cultural background</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
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
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4 pb-6 border-b">
              <Avatar className="h-32 w-32 border-4 border-muted">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user?.name || "User"}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {user?.createdAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Member since {formatDate(user.createdAt)}
                  </p>
                )}
              </div>
              {isEditing && (
                <div className="text-center space-y-2">
                  <Label
                    htmlFor="avatar-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent rounded-md text-sm font-medium transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingAvatar ? "Uploading..." : "Change Profile Photo"}
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                  <p className="text-xs text-muted-foreground">
                    Max 2MB, JPG, PNG, or GIF format
                  </p>
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="text-sm font-medium p-3 border rounded bg-muted/50">
                        {user?.name || "Not set"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email Address
                    </Label>
                    <div className="text-sm font-medium p-3 border rounded bg-muted/50 text-muted-foreground">
                      {user?.email}
                    </div>
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="role">Role Type</Label>
                    {isEditing ? (
                      <Select value={editRole} onValueChange={setEditRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_TYPES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              <div>
                                <p className="font-medium">{role.label}</p>
                                <p className="text-xs text-muted-foreground">{role.description}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div>
                        <Badge variant={user?.role ? "default" : "secondary"} className="text-sm">
                          {user?.role || "Not set"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location & Cultural Background
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">
                      <Globe className="h-4 w-4 inline mr-1" />
                      Country
                    </Label>
                    {isEditing ? (
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
                      <div className="text-sm font-medium p-3 border rounded bg-muted/50">
                        {user?.country || "Not set"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">
                      <Building className="h-4 w-4 inline mr-1" />
                      State / Region
                    </Label>
                    {isEditing ? (
                      <Input
                        id="state"
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                        placeholder="Enter your state/region"
                      />
                    ) : (
                      <div className="text-sm font-medium p-3 border rounded bg-muted/50">
                        {user?.state || "Not set"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tribe">Tribe / Community</Label>
                    {isEditing ? (
                      <Input
                        id="tribe"
                        value={editTribe}
                        onChange={(e) => setEditTribe(e.target.value)}
                        placeholder="Enter your tribe/community"
                      />
                    ) : (
                      <div className="text-sm font-medium p-3 border rounded bg-muted/50">
                        {user?.tribe || "Not set"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="village">
                      <Home className="h-4 w-4 inline mr-1" />
                      Village / Town
                    </Label>
                    {isEditing ? (
                      <Input
                        id="village"
                        value={editVillage}
                        onChange={(e) => setEditVillage(e.target.value)}
                        placeholder="Enter your village/town"
                      />
                    ) : (
                      <div className="text-sm font-medium p-3 border rounded bg-muted/50">
                        {user?.village || "Not set"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Bio */}
              <div>
                <h3 className="text-lg font-semibold mb-4">About Me</h3>
                <div className="space-y-2">
                  <Label htmlFor="bio">Short Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell us about yourself, your background, and your connection to cultural heritage..."
                      className="min-h-[150px]"
                      maxLength={500}
                    />
                  ) : (
                    <div className="text-sm p-4 border rounded bg-muted/50 min-h-[100px] whitespace-pre-wrap">
                      {user?.bio || "No bio added yet. Click 'Edit Profile' to add one."}
                    </div>
                  )}
                  {isEditing && (
                    <p className="text-xs text-muted-foreground text-right">
                      {editBio.length}/500 characters
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Actions */}
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-muted-foreground">
                Need to manage your submissions?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => navigate("/my-submissions")}
                >
                  Go to My Submissions
                </Button>
              </div>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;