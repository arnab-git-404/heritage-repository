// import { useEffect, useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import Footer from "@/components/Footer";
// import { useToast } from "@/components/ui/use-toast";
// import { useNavigate } from "react-router-dom";
// import { mediaSrc } from "@/lib/utils";
// import { useAuth } from "@/context/AuthContext";
// import { authFetch } from "@/lib/api";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import RequestCollaboration from "@/components/RequestCollaboration";

// interface UserProfile {
//   _id: string;
//   name: string;
//   email: string;
//   avatar?: string;
// }

// interface Submission {
//   _id: string;
//   title: string;
//   description: string;
//   type: 'text' | 'image' | 'video' | 'audio' | 'pdf';
//   contentUrl?: string;
//   text?: string;
//   status: string;
//   category?: string;
//   tribe?: string;
//   consent?: {
//     given: boolean;
//     name?: string;
//     relation?: string;
//     fileUrl?: string;
//   };
// }

// const Profile = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const { token, isAuthenticated, logout: ctxLogout } = useAuth();
  
//   const [items, setItems] = useState<Submission[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editDescription, setEditDescription] = useState("");
//   const [editText, setEditText] = useState("");
//   const [editContentUrl, setEditContentUrl] = useState("");

//   const fetchMine = async () => {
//     try {
//       setLoading(true);
//       const res = await authFetch('/api/submissions/my');
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.errors?.[0]?.msg || 'Failed to load');
//       setItems(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Error fetching submissions:', error);
//       toast({
//         title: 'Error',
//         description: error instanceof Error ? error.message : 'Failed to fetch submissions',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     ctxLogout();
//     toast({ title: 'Logged out' });
//     navigate('/');
//   };

//   const startEdit = (item: Submission) => {
//     setEditingId(item._id);
//     setEditTitle(item.title || "");
//     setEditDescription(item.description || "");
//     setEditText(item.text || "");
//     setEditContentUrl(item.contentUrl || "");
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditTitle("");
//     setEditDescription("");
//     setEditText("");
//     setEditContentUrl("");
//   };

//   const saveEdit = async (id: string, type: string) => {
//     try {
//       const payload: any = {
//         title: editTitle,
//         description: editDescription,
//       };

//       if (type === 'text') {
//         payload.text = editText;
//       } else {
//         payload.contentUrl = editContentUrl;
//       }

//       const res = await authFetch(`/api/submissions/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data?.errors?.[0]?.msg || 'Failed to update');
//       }

//       await fetchMine();
//       cancelEdit();
//       toast({ title: 'Updated successfully' });
//     } catch (error) {
//       console.error('Error updating submission:', error);
//       toast({
//         title: 'Error',
//         description: error instanceof Error ? error.message : 'Failed to update submission',
//         variant: 'destructive',
//       });
//     }
//   };

//   const fetchProfile = async () => {
//     try {
//       const res = await authFetch('/api/auth/me');
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.errors?.[0]?.msg || 'Failed to load profile');
//       setUser(data.user);
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       toast({
//         title: 'Error',
//         description: error instanceof Error ? error.message : 'Failed to load profile',
//         variant: 'destructive',
//       });
//     }
//   };

//   useEffect(() => {
//     fetchMine();
//     fetchProfile();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Card>
//           <CardHeader>
//             <CardTitle>Authentication Required</CardTitle>
//             <CardDescription>Please log in to view your profile.</CardDescription>
//           </CardHeader>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <div className="container mx-auto px-4 py-8">
//         <Tabs defaultValue="submissions" className="space-y-4">
//           <TabsList>
//             <TabsTrigger value="submissions">My Submissions</TabsTrigger>
//             <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
//           </TabsList>

//           <TabsContent value="submissions">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               {/* Profile Card */}
//               <div className="md:col-span-1">
//                 <Card>
//                   <CardHeader>
//                     <div className="flex flex-col items-center space-y-4">
//                       <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                         {user?.avatar ? (
//                           <img 
//                             src={mediaSrc(user.avatar)} 
//                             alt="Profile" 
//                             className="w-full h-full object-cover" 
//                           />
//                         ) : (
//                           <span className="text-2xl">👤</span>
//                         )}
//                       </div>
//                       <div className="text-center">
//                         <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
//                         <p className="text-sm text-muted-foreground">{user?.email}</p>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <Button 
//                       variant="outline" 
//                       className="w-full" 
//                       onClick={logout}
//                     >
//                       Logout
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Submissions Content */}
//               <div className="md:col-span-3 space-y-6">
//                 <h1 className="text-3xl font-bold">My Submissions</h1>
//                 {loading ? (
//                   <div>Loading...</div>
//                 ) : items.length === 0 ? (
//                   <Card>
//                     <CardContent className="pt-6 text-center text-muted-foreground">
//                       No submissions found. Start by creating one!
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="space-y-4">
//                     {items.map((item) => (
//                       <Card key={item._id}>
//                         <CardContent className="pt-6">
//                           {editingId === item._id ? (
//                             <div className="space-y-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="edit-title">Title</Label>
//                                 <Input
//                                   id="edit-title"
//                                   value={editTitle}
//                                   onChange={(e) => setEditTitle(e.target.value)}
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="edit-description">Description</Label>
//                                 <Textarea
//                                   id="edit-description"
//                                   value={editDescription}
//                                   onChange={(e) => setEditDescription(e.target.value)}
//                                 />
//                               </div>
//                               {item.type === 'text' ? (
//                                 <div className="space-y-2">
//                                   <Label htmlFor="edit-text">Content</Label>
//                                   <Textarea
//                                     id="edit-text"
//                                     value={editText}
//                                     onChange={(e) => setEditText(e.target.value)}
//                                     className="min-h-[200px]"
//                                   />
//                                 </div>
//                               ) : (
//                                 <div className="space-y-2">
//                                   <Label htmlFor="edit-content-url">Content URL</Label>
//                                   <Input
//                                     id="edit-content-url"
//                                     value={editContentUrl}
//                                     onChange={(e) => setEditContentUrl(e.target.value)}
//                                     placeholder="https://example.com/content"
//                                   />
//                                 </div>
//                               )}
//                               <div className="flex justify-end space-x-2">
//                                 <Button variant="outline" onClick={cancelEdit}>
//                                   Cancel
//                                 </Button>
//                                 <Button onClick={() => saveEdit(item._id, item.type)}>
//                                   Save Changes
//                                 </Button>
//                               </div>
//                             </div>
//                           ) : (
//                             <div>
//                               <CardHeader className="p-0 pb-4">
//                                 <div className="flex justify-between items-start">
//                                   <div>
//                                     <CardTitle className="text-xl">{item.title}</CardTitle>
//                                     <CardDescription className="line-clamp-2">
//                                       {item.description}
//                                     </CardDescription>
//                                   </div>
//                                   <Button 
//                                     variant="outline" 
//                                     size="sm"
//                                     onClick={() => startEdit(item)}
//                                   >
//                                     Edit
//                                   </Button>
//                                 </div>
//                               </CardHeader>
                              
//                               <div className="mt-4">
//                                 {item.type === 'video' && item.contentUrl && (
//                                   <video 
//                                     src={mediaSrc(item.contentUrl)} 
//                                     controls 
//                                     className="w-full rounded" 
//                                   />
//                                 )}
//                                 {item.type === 'audio' && item.contentUrl && (
//                                   <audio 
//                                     src={mediaSrc(item.contentUrl)} 
//                                     controls 
//                                     className="w-full" 
//                                   />
//                                 )}
//                                 {item.type === 'image' && item.contentUrl && (
//                                   <img 
//                                     src={mediaSrc(item.contentUrl)} 
//                                     alt={item.title} 
//                                     className="w-full h-auto rounded" 
//                                   />
//                                 )}
//                                 {item.type === 'pdf' && item.contentUrl && (
//                                   <div className="w-full h-[600px]">
//                                     <iframe 
//                                       src={mediaSrc(item.contentUrl)} 
//                                       className="w-full h-full" 
//                                       title={item.title}
//                                     />
//                                   </div>
//                                 )}
//                                 {item.type === 'text' && item.text && (
//                                   <div className="prose max-w-none">
//                                     {item.text}
//                                   </div>
//                                 )}
//                               </div>

//                               {item.consent && (
//                                 <div className="mt-4 p-4 bg-muted/50 rounded-md">
//                                   <h4 className="font-medium mb-2">Consent Information</h4>
//                                   <div className="text-sm space-y-1">
//                                     <div>
//                                       <span className="text-muted-foreground">Status:</span>{' '}
//                                       <span className="font-medium">
//                                         {item.consent.given ? 'Consent Given' : 'No Consent'}
//                                       </span>
//                                     </div>
//                                     {item.consent.name && (
//                                       <div>
//                                         <span className="text-muted-foreground">Name:</span>{' '}
//                                         {item.consent.name}
//                                       </div>
//                                     )}
//                                     {item.consent.relation && (
//                                       <div>
//                                         <span className="text-muted-foreground">Relation:</span>{' '}
//                                         {item.consent.relation}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="collaboration">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               {/* Profile Card */}
//               <div className="md:col-span-1">
//                 <Card>
//                   <CardHeader>
//                     <div className="flex flex-col items-center space-y-4">
//                       <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                         {user?.avatar ? (
//                           <img 
//                             src={mediaSrc(user.avatar)} 
//                             alt="Profile" 
//                             className="w-full h-full object-cover" 
//                           />
//                         ) : (
//                           <span className="text-2xl">👤</span>
//                         )}
//                       </div>
//                       <div className="text-center">
//                         <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
//                         <p className="text-sm text-muted-foreground">{user?.email}</p>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <Button 
//                       variant="outline" 
//                       className="w-full" 
//                       onClick={logout}
//                     >
//                       Logout
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Collaboration Content */}
//               <div className="md:col-span-3 space-y-6">
//                 <h1 className="text-3xl font-bold">Collaboration</h1>
//                 <div className="space-y-4">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Collaboration Requests</CardTitle>
//                       <CardDescription>
//                         Manage your collaboration requests and connect with other users.
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       {user ? (
//                         <RequestCollaboration 
//                           userId={user._id}
//                           userName={user.name || 'User'}
//                           category="general"
//                           onSuccess={() => {
//                             toast({
//                               title: 'Success',
//                               description: 'Collaboration request sent successfully!',
//                             });
//                           }}
//                         />
//                       ) : (
//                         <div>Loading user information...</div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Profile;









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
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="submissions">
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
                        <div className="text-sm font-medium p-2 bg-muted rounded">
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
                      <div className="text-sm font-medium p-2 bg-muted rounded text-muted-foreground">
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
                        <div className="text-sm font-medium p-2 bg-muted rounded">
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
                        <div className="text-sm font-medium p-2 bg-muted rounded">
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
                        <div className="text-sm font-medium p-2 bg-muted rounded">
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
                        <div className="text-sm font-medium p-2 bg-muted rounded">
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
                      <div className="text-sm p-3 bg-muted rounded min-h-[80px]">
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