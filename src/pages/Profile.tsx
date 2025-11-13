








import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, MapPin, FileText, Upload, Edit2, Save, X, LogOut, Shield } from "lucide-react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role?: 'Custodian' | 'Researcher' | 'Contributor' | 'Viewer';
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
  status: string;
  tribe?: string;
  culturalDomain?: string;
  createdAt: string;
}

const countries = [
  "New Zealand",
  "Australia",
  "United States of America",
  "Norway",
  "Sweden",
  "India",
];

const roleTypes = [
  { value: "Custodian", label: "Custodian", description: "Cultural knowledge keeper" },
  { value: "Researcher", label: "Researcher", description: "Academic or scholar" },
  { value: "Contributor", label: "Contributor", description: "Content creator" },
  { value: "Viewer", label: "Viewer", description: "General user" },
];

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token, isAuthenticated, logout: ctxLogout } = useAuth();
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [items, setItems] = useState<Submission[]>([]);
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

  const fetchProfile = async () => {
    try {
      const res = await authFetch('/api/auth/me');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || 'Failed to load profile');
      setUser(data.user);
      // Initialize edit fields
      setEditName(data.user.name || "");
      setEditRole(data.user.role || "");
      setEditCountry(data.user.country || "");
      setEditState(data.user.state || "");
      setEditTribe(data.user.tribe || "");
      setEditVillage(data.user.village || "");
      setEditBio(data.user.bio || "");
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load profile',
        variant: 'destructive',
      });
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/submissions/my');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || 'Failed to load');
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await authFetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || 'Failed to update');

      setUser(data.user);
      setIsEditingProfile(false);
      toast({ title: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 2MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await authFetch('/api/auth/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || 'Failed to upload');

      setUser(prev => prev ? { ...prev, avatar: data.avatarUrl } : null);
      toast({ title: 'Avatar updated successfully!' });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const logout = () => {
    ctxLogout();
    localStorage.clear();
    toast({ title: 'Logged out successfully' });
    navigate('/');
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchSubmissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/signup')} className="w-full">
              Sign Up / Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Tabs defaultValue="profile" className=" space-y-6 ">
            
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto rounded-xl ">
              <TabsTrigger value="profile" className="text-white">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="submissions" className="text-white">
                <FileText className="h-4 w-4 mr-2" />
                My Submissions
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Profile Information</CardTitle>
                      <CardDescription>Manage your account details and preferences</CardDescription>
                    </div>
                    {!isEditingProfile ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingProfile(true)}
                      >
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
                            // Reset to original values
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
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isEditingProfile && (
                      <div className="text-center space-y-2">
                        <Label
                          htmlFor="avatar-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingAvatar ? 'Uploading...' : 'Upload New Photo'}
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
                          Max 5MB, JPG, PNG, or GIF
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Profile Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      {isEditingProfile ? (
                        <Input
                          id="name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="text-sm font-medium p-2 border-2 rounded-xl">
                          {user?.name || 'Not set'}
                        </div>
                      )}
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <div className="text-sm font-medium p-2 border-2 rounded-xl text-muted-foreground">
                        {user?.email}
                      </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2"   >
                      <Label htmlFor="role" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Role Type
                      </Label>
                      {isEditingProfile ? (
                        <Select value={editRole} onValueChange={setEditRole}>
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roleTypes.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                <div>
                                  <div className="font-medium">{role.label}</div>
                                  <div className="text-xs text-muted-foreground">{role.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge variant={user?.role ? "default" : "secondary"}>
                            {user?.role || 'Not set'}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <Label htmlFor="country" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Country
                      </Label>
                      {isEditingProfile ? (
                        <Select value={editCountry} onValueChange={setEditCountry}>
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-sm font-medium p-2 border-2 rounded-xl">
                          {user?.country || 'Not set'}
                        </div>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <Label htmlFor="state">State / Region</Label>
                      {isEditingProfile ? (
                        <Input
                          id="state"
                          value={editState}
                          onChange={(e) => setEditState(e.target.value)}
                          placeholder="Enter state or region"
                        />
                      ) : (
                        <div className="text-sm font-medium p-2 border-2 rounded-xl">
                          {user?.state || 'Not set'}
                        </div>
                      )}
                    </div>

                    {/* Tribe */}
                    <div className="space-y-2">
                      <Label htmlFor="tribe">Tribe / Community</Label>
                      {isEditingProfile ? (
                        <Input
                          id="tribe"
                          value={editTribe}
                          onChange={(e) => setEditTribe(e.target.value)}
                          placeholder="Enter tribe or community"
                        />
                      ) : (
                        <div className="text-sm font-medium p-2 border-2 rounded-xl">
                          {user?.tribe || 'Not set'}
                        </div>
                      )}
                    </div>

                    {/* Village */}
                    <div className="space-y-2">
                      <Label htmlFor="village">Village / Town</Label>
                      {isEditingProfile ? (
                        <Input
                          id="village"
                          value={editVillage}
                          onChange={(e) => setEditVillage(e.target.value)}
                          placeholder="Enter village or town"
                        />
                      ) : (
                        <div className="text-sm font-medium p-2 border-2 rounded-xl">
                          {user?.village || 'Not set'}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center justify-between">
                      <span>Short Bio</span>
                      {isEditingProfile && (
                        <span className="text-xs text-muted-foreground">
                          {editBio.length}/250 words
                        </span>
                      )}
                    </Label>
                    {isEditingProfile ? (
                      <Textarea
                        id="bio"
                        value={editBio}
                        onChange={(e) => {
                          const wordCount = e.target.value.split(/\s+/).filter(Boolean).length;
                          if (wordCount <= 250) {
                            setEditBio(e.target.value);
                          }
                        }}
                        placeholder="Tell us about yourself, your role in the community, and your connection to cultural heritage..."
                        className="min-h-[120px]"
                      />
                    ) : (
                      <div className="text-sm p-3 border-2 rounded-xl min-h-[80px]">
                        {user?.bio || 'No bio added yet'}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Logout Button */}
                  <div className="flex justify-end">
                    <Button variant="destructive" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">My Submissions</CardTitle>
                  <CardDescription>
                    View and manage your cultural heritage submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-3">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-muted-foreground">Loading submissions...</p>
                      </div>
                    </div>
                  ) : items.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold">No submissions yet</h3>
                        <p className="text-muted-foreground">Start by uploading your first cultural heritage content</p>
                      </div>
                      <Button onClick={() => navigate('/upload')}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Content
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <Card key={item._id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-1 flex-1">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  item.status === 'approved' ? 'default' :
                                  item.status === 'pending' ? 'secondary' :
                                  'destructive'
                                }
                              >
                                {item.status}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {item.tribe && (
                                <Badge variant="outline">{item.tribe}</Badge>
                              )}
                              {item.culturalDomain && (
                                <Badge variant="outline">{item.culturalDomain}</Badge>
                              )}
                              <Badge variant="outline">{item.contentFileType}</Badge>
                              <span className="ml-auto">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;