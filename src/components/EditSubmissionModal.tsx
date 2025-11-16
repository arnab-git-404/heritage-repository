


// // 3RD
// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
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
// import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Separator } from "@/components/ui/separator";
// import {
//   AlertCircle,
//   Save,
//   X,
//   Loader2,
//   FileText,
//   Upload,
//   CheckCircle,
//   Eye,
//   EyeOff,
// } from "lucide-react";

// interface Submission {
//   _id: string;
//   title: string;
//   description: string;
//   country?: string;
//   stateRegion?: string;
//   tribe?: string;
//   village?: string;
//   culturalDomain?: string;
//   keywords?: string;
//   language?: string;
//   dateOfRecording?: string;
//   culturalSignificance?: string;
//   contentFileType: string;
//   contentUrl?: string;
//   consent: {
//     consentType?: string;
//     fileType?: string;
//     fileUrl?: string;
//     consentNames?: string;
//     consentDate?: string;
//     permissionType?: string[];
//     duration?: string;
//     digitalSignature?: string;
//   };
//   accessTier?: string;
//   contentWarnings?: string[];
//   warningOtherText?: string;
//   backgroundInfo?: string;
//   translationFileUrl?: string;
//   verificationDocUrl?: string;
//   status: string;
// }

// interface EditSubmissionModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   submission: Submission | null;
//   onSuccess: (updated: any) => void;
// }

// const countries = [
//   "New Zealand",
//   "Australia",
//   "United States of America",
//   "Norway",
//   "Sweden",
//   "India",
// ];

// const culturalDomains = [
//   "Folk Song",
//   "Folk Dance",
//   "Folk Tale",
//   "Ritual",
//   "Material Culture",
//   "Sacred Site",
//   "Oral Narrative",
//   "Other",
// ];

// const consentTypes = [
//   "Individual Consent",
//   "Collective / Community Consent",
//   "Custodian Consent",
// ];

// const permissionTypes = [
//   "Educational",
//   "Research",
//   "Cultural Display",
//   "All the above",
// ];

// const accessTiers = ["Public", "Restricted", "Confidential/Sacred"];

// const warningOptions = [
//   "Sacred object",
//   "Deceased person",
//   "Ritual context",
//   "Other",
// ];

// const indianStates = [
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chhattisgarh",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
//   "Andaman and Nicobar Islands",
//   "Chandigarh",
//   "Dadra and Nagar Haveli and Daman and Diu",
//   "Delhi",
//   "Jammu and Kashmir",
//   "Ladakh",
//   "Lakshadweep",
//   "Puducherry",
// ];

// export const EditSubmissionModal = ({
//   open,
//   onOpenChange,
//   submission,
//   onSuccess,
// }: EditSubmissionModalProps) => {
//   const [saving, setSaving] = useState(false);
//   const [currentSection, setCurrentSection] = useState(1);
//   const [validationError, setValidationError] = useState<string>("");

//   // Form state
//   const [formData, setFormData] = useState({
//     title: "",
//     country: "",
//     stateRegion: "",
//     tribe: "",
//     village: "",
//     culturalDomain: "",
//     description: "",
//     keywords: "",
//     language: "",
//     dateOfRecording: "",
//     culturalSignificance: "",
//     contentFileType: "audio" as "audio" | "video" | "image" | "text" | "3d",
//     consentType: "",
//     consentFileType: "pdf" as "pdf" | "audio" | "video",
//     consentNames: "",
//     consentDate: "",
//     permissionType: [] as string[],
//     consentDuration: "",
//     digitalSignature: "",
//     accessTier: "",
//     contentWarnings: [] as string[],
//     warningOtherText: "",
//     backgroundInfo: "",
//   });

//   // File state
//   const [newContentFile, setNewContentFile] = useState<File | null>(null);
//   const [newConsentFile, setNewConsentFile] = useState<File | null>(null);
//   const [newTranslationFile, setNewTranslationFile] = useState<File | null>(null);
//   const [newVerificationDoc, setNewVerificationDoc] = useState<File | null>(null);
//   const [hasExistingContent, setHasExistingContent] = useState(false);
//   const [hasExistingConsent, setHasExistingConsent] = useState(false);
//   const [hasExistingTranslation, setHasExistingTranslation] = useState(false);
//   const [hasExistingVerification, setHasExistingVerification] = useState(false);

//   // Preview state
//   const [showContentPreview, setShowContentPreview] = useState(false);
//   const [showConsentPreview, setShowConsentPreview] = useState(false);
//   const [contentPreviewUrl, setContentPreviewUrl] = useState<string>("");
//   const [consentPreviewUrl, setConsentPreviewUrl] = useState<string>("");

//   // Format date from ISO to DD/MM/YYYY
//   const formatDateForInput = (isoDate: string) => {
//     if (!isoDate) return "";
//     const date = new Date(isoDate);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   // Format date for date input (YYYY-MM-DD)
//   const formatDateForDateInput = (isoDate: string) => {
//     if (!isoDate) return "";
//     const date = new Date(isoDate);
//     return date.toISOString().split('T')[0];
//   };

//   useEffect(() => {
//     if (submission) {
//       setFormData({
//         title: submission.title || "",
//         country: submission.country || "",
//         stateRegion: submission.stateRegion || "",
//         tribe: submission.tribe || "",
//         village: submission.village || "",
//         culturalDomain: submission.culturalDomain || "",
//         description: submission.description || "",
//         keywords: submission.keywords || "",
//         language: submission.language || "",
//         dateOfRecording: formatDateForInput(submission.dateOfRecording || ""),
//         culturalSignificance: submission.culturalSignificance || "",
//         contentFileType: (submission.contentFileType as any) || "audio",
//         consentType: submission.consent?.consentType || "",
//         consentFileType: (submission.consent?.fileType as any) || "pdf",
//         consentNames: submission.consent?.consentNames || "",
//         consentDate: formatDateForDateInput(submission.consent?.consentDate || ""),
//         permissionType: submission.consent?.permissionType || [],
//         consentDuration: submission.consent?.duration || "",
//         digitalSignature: submission.consent?.digitalSignature || "",
//         accessTier: submission.accessTier || "",
//         contentWarnings: submission.contentWarnings || [],
//         warningOtherText: submission.warningOtherText || "",
//         backgroundInfo: submission.backgroundInfo || "",
//       });

//       // Check existing files
//       setHasExistingContent(!!submission.contentUrl);
//       setHasExistingConsent(!!submission.consent?.fileUrl);
//       setHasExistingTranslation(!!submission.translationFileUrl);
//       setHasExistingVerification(!!submission.verificationDocUrl);

//       // Set preview URLs for existing files
//       setContentPreviewUrl(submission.contentUrl || "");
//       setConsentPreviewUrl(submission.consent?.fileUrl || "");

//       // Reset file selections
//       setNewContentFile(null);
//       setNewConsentFile(null);
//       setNewTranslationFile(null);
//       setNewVerificationDoc(null);
//       setValidationError("");
//       setShowContentPreview(false);
//       setShowConsentPreview(false);
//     }
//   }, [submission]);

//   const handlePermissionToggle = (value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       permissionType: prev.permissionType.includes(value)
//         ? prev.permissionType.filter((v) => v !== value)
//         : [...prev.permissionType, value],
//     }));
//   };

//   const handleWarningToggle = (value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       contentWarnings: prev.contentWarnings.includes(value)
//         ? prev.contentWarnings.filter((v) => v !== value)
//         : [...prev.contentWarnings, value],
//     }));
//   };

//   // Preview handlers
//   const handleContentFileChange = (file: File | null) => {
//     setNewContentFile(file);
//     if (file) {
//       // Create preview URL for new file
//       const url = URL.createObjectURL(file);
//       setContentPreviewUrl(url);
//     } else if (submission?.contentUrl) {
//       // Revert to original URL if file is removed
//       setContentPreviewUrl(submission.contentUrl);
//     }
//   };

//   const handleConsentFileChange = (file: File | null) => {
//     setNewConsentFile(file);
//     if (file) {
//       // Create preview URL for new file
//       const url = URL.createObjectURL(file);
//       setConsentPreviewUrl(url);
//     } else if (submission?.consent?.fileUrl) {
//       // Revert to original URL if file is removed
//       setConsentPreviewUrl(submission.consent.fileUrl);
//     }
//   };

//   const renderContentPreview = () => {
//     if (!contentPreviewUrl) return null;

//     const fileType = newContentFile ? newContentFile.type : formData.contentFileType;

//     if (fileType.startsWith('image/') || formData.contentFileType === 'image') {
//       return (
//         <div className="mt-4">
//           <img 
//             src={contentPreviewUrl} 
//             alt="Content preview" 
//             className="max-w-full h-auto max-h-96 rounded-lg border"
//           />
//         </div>
//       );
//     }

//     if (fileType.startsWith('video/') || formData.contentFileType === 'video') {
//       return (
//         <div className="mt-4">
//           <video 
//             src={contentPreviewUrl} 
//             controls 
//             className="max-w-full h-auto max-h-96 rounded-lg border"
//           />
//         </div>
//       );
//     }

//     if (fileType.startsWith('audio/') || formData.contentFileType === 'audio') {
//       return (
//         <div className="mt-4">
//           <audio 
//             src={contentPreviewUrl} 
//             controls 
//             className="w-full"
//           />
//         </div>
//       );
//     }

//     return (
//       <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//         <p className="text-sm text-blue-800">
//           Preview not available for this file type. File will be uploaded.
//         </p>
//       </div>
//     );
//   };

//   const renderConsentPreview = () => {
//     if (!consentPreviewUrl) return null;

//     const fileType = newConsentFile ? newConsentFile.type : formData.consentFileType;

//     if (fileType === 'application/pdf' || formData.consentFileType === 'pdf') {
//       return (
//         <div className="mt-4">
//           <iframe 
//             src={consentPreviewUrl} 
//             className="w-full h-96 rounded-lg border"
//             title="Consent document preview"
//           />
//         </div>
//       );
//     }

//     if (fileType.startsWith('video/') || formData.consentFileType === 'video') {
//       return (
//         <div className="mt-4">
//           <video 
//             src={consentPreviewUrl} 
//             controls 
//             className="max-w-full h-auto max-h-96 rounded-lg border"
//           />
//         </div>
//       );
//     }

//     if (fileType.startsWith('audio/') || formData.consentFileType === 'audio') {
//       return (
//         <div className="mt-4">
//           <audio 
//             src={consentPreviewUrl} 
//             controls 
//             className="w-full"
//           />
//         </div>
//       );
//     }

//     return (
//       <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//         <p className="text-sm text-blue-800">
//           Preview not available for this file type.
//         </p>
//       </div>
//     );
//   };

//   // Validation function
//   const validateForm = (): string => {
//     // Section 1 validation
//     if (!formData.country) return "Country is required";
//     if (!formData.stateRegion) return "State/Region is required";
//     if (!formData.tribe) return "Tribe is required";
//     if (!formData.culturalDomain) return "Cultural Domain is required";
//     if (!formData.title) return "Title is required";

//     // Section 2 validation
//     if (!formData.description) return "Description is required";
//     if (!formData.keywords) return "Keywords are required";

//     // Section 3 validation - only if no existing file
//     if (!hasExistingContent && !newContentFile) return "Content file is required";

//     // Section 4 validation
//     if (!hasExistingConsent && !newConsentFile) return "Consent file is required";
//     if (!formData.consentType) return "Consent type is required";
//     if (!formData.consentNames) return "Consenting person(s) name is required";
//     if (!formData.consentDate) return "Consent date is required";
//     if (!formData.consentDuration) return "Consent duration is required";
//     if (formData.permissionType.length === 0) return "At least one permission type is required";

//     // Section 5 validation
//     if (!formData.accessTier) return "Access tier is required";

//     return "";
//   };

//   const handleSave = async () => {
//     if (!submission) return;

//     // Validate form
//     const error = validateForm();
//     if (error) {
//       setValidationError(error);
//       alert(error);
//       return;
//     }

//     setSaving(true);
//     setValidationError("");

//     try {
//       const token = localStorage.getItem("auth_token");
//       const apiFormData = new FormData();

//       // Add all text fields with proper handling
//       apiFormData.append("title", formData.title);
//       apiFormData.append("country", formData.country);
//       apiFormData.append("stateRegion", formData.stateRegion);
//       apiFormData.append("tribe", formData.tribe);
//       apiFormData.append("village", formData.village);
//       apiFormData.append("culturalDomain", formData.culturalDomain);
//       apiFormData.append("description", formData.description);
      
//       // Handle keywords as array
//       // const keywordsArray = formData.keywords
//       //   .split(",")
//       //   .map((k) => k.trim())
//       //   .filter(Boolean);
//       apiFormData.append("keywords", formData.keywords);
      
//       apiFormData.append("language", formData.language);
//       apiFormData.append("dateOfRecording", formData.dateOfRecording);
//       apiFormData.append("culturalSignificance", formData.culturalSignificance);
//       apiFormData.append("contentFileType", formData.contentFileType);
      
//       // Consent fields
//       apiFormData.append("consentType", formData.consentType);
//       apiFormData.append("consentFileType", formData.consentFileType);
//       apiFormData.append("consentNames", formData.consentNames);
//       apiFormData.append("consentDate", formData.consentDate);
//       apiFormData.append("permissionType", JSON.stringify(formData.permissionType));
//       apiFormData.append("consentDuration", formData.consentDuration);
//       apiFormData.append("digitalSignature", formData.digitalSignature);
      
//       // Access and warnings
//       apiFormData.append("accessTier", formData.accessTier);
//       apiFormData.append("contentWarnings", JSON.stringify(formData.contentWarnings));
//       apiFormData.append("warningOtherText", formData.warningOtherText);
//       apiFormData.append("backgroundInfo", formData.backgroundInfo);

//       // Add files if selected
//       if (newContentFile) {
//         apiFormData.append("contentFile", newContentFile);
//       }
//       if (newConsentFile) {
//         apiFormData.append("consentFile", newConsentFile);
//       }
//       if (newTranslationFile) {
//         apiFormData.append("translationFile", newTranslationFile);
//       }
//       if (newVerificationDoc) {
//         apiFormData.append("verificationDoc", newVerificationDoc);
//       }

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/submissions/${submission._id}`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: apiFormData,
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data?.errors?.[0]?.msg || data?.message || "Failed to update");
//       }

//       onSuccess(data);
//       onOpenChange(false);
//     } catch (error) {
//       console.error("Error updating submission:", error);
//       alert(error instanceof Error ? error.message : "Failed to update submission");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!submission) return null;

//   const sections = [
//     "Category & Title",
//     "Description",
//     "Content File",
//     "Consent & Ethics",
//     "Access & Warnings",
//     "Additional Files",
//   ];

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-2xl">Edit Submission</DialogTitle>
//           <DialogDescription>
//             Update your submission details. Changes will require re-approval.
//           </DialogDescription>
//         </DialogHeader>

//         {submission.status === "approved" && (
//           <Alert className="border-amber-500 bg-amber-50">
//             <AlertCircle className="h-4 w-4 text-amber-600" />
//             <AlertDescription className="text-amber-800">
//               This submission is currently approved. Editing will reset its status to "pending" for review.
//             </AlertDescription>
//           </Alert>
//         )}

//         {validationError && (
//           <Alert className="border-red-500 bg-red-50">
//             <AlertCircle className="h-4 w-4 text-red-600" />
//             <AlertDescription className="text-red-800">{validationError}</AlertDescription>
//           </Alert>
//         )}

//         {/* Section Navigation */}
//         <div className="flex gap-2 flex-wrap mb-4">
//           {sections.map((section, idx) => (
//             <Button
//               key={idx}
//               variant={currentSection === idx + 1 ? "default" : "outline"}
//               size="sm"
//               onClick={() => setCurrentSection(idx + 1)}
//               className="text-xs"
//             >
//               {idx + 1}. {section}
//             </Button>
//           ))}
//         </div>

//         <div className="space-y-4">
//           {/* SECTION 1: Category & Title */}
//           {currentSection === 1 && (
//             <>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="edit-country">Country *</Label>
//                   <Select
//                     value={formData.country}
//                     onValueChange={(v) => {
//                       setFormData((prev) => ({
//                         ...prev,
//                         country: v,
//                         stateRegion: "",
//                       }));
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select country" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {countries.map((c) => (
//                         <SelectItem key={c} value={c}>
//                           {c}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="edit-state">State / Region *</Label>
//                   {formData.country === "India" ? (
//                     <Select
//                       value={formData.stateRegion}
//                       onValueChange={(v) =>
//                         setFormData((prev) => ({ ...prev, stateRegion: v }))
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select state" />
//                       </SelectTrigger>
//                       <SelectContent className="max-h-[300px]">
//                         {indianStates.map((state) => (
//                           <SelectItem key={state} value={state}>
//                             {state}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   ) : (
//                     <Input
//                       id="edit-state"
//                       value={formData.stateRegion}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           stateRegion: e.target.value,
//                         }))
//                       }
//                       placeholder="Enter state/region"
//                     />
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="edit-tribe">Tribe *</Label>
//                   <Input
//                     id="edit-tribe"
//                     value={formData.tribe}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         tribe: e.target.value,
//                       }))
//                     }
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="edit-village">Village</Label>
//                   <Input
//                     id="edit-village"
//                     value={formData.village}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         village: e.target.value,
//                       }))
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="edit-domain">Cultural Domain *</Label>
//                 <Select
//                   value={formData.culturalDomain}
//                   onValueChange={(v) =>
//                     setFormData((prev) => ({ ...prev, culturalDomain: v }))
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select domain" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {culturalDomains.map((d) => (
//                       <SelectItem key={d} value={d}>
//                         {d}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="edit-title">Title *</Label>
//                 <Input
//                   id="edit-title"
//                   value={formData.title}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, title: e.target.value }))
//                   }
//                 />
//               </div>
//             </>
//           )}

//           {/* SECTION 2: Description */}
//           {currentSection === 2 && (
//             <>
//               <div className="space-y-2">
//                 <Label htmlFor="edit-description">Description *</Label>
//                 <Textarea
//                   id="edit-description"
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       description: e.target.value,
//                     }))
//                   }
//                   rows={5}
//                   maxLength={1500}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   {formData.description.length}/1500
//                 </p>
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="edit-keywords">Keywords *</Label>
//                   <Input
//                     id="edit-keywords"
//                     value={formData.keywords}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         keywords: e.target.value,
//                       }))
//                     }
//                     placeholder="comma-separated"
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Separate multiple keywords with commas
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="edit-date">Date of Recording (DD/MM/YYYY)</Label>
//                   <Input
//                     id="edit-date"
//                     type="text"
//                     placeholder="DD/MM/YYYY"
//                     value={formData.dateOfRecording}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (/^[\d/]*$/.test(value)) {
//                         setFormData((prev) => ({
//                           ...prev,
//                           dateOfRecording: value,
//                         }));
//                       }
//                     }}
//                     maxLength={10}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="edit-significance">Cultural Significance</Label>
//                 <Textarea
//                   id="edit-significance"
//                   value={formData.culturalSignificance}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       culturalSignificance: e.target.value,
//                     }))
//                   }
//                   rows={4}
//                 />
//               </div>
//             </>
//           )}

//           {/* SECTION 3: Content File */}
//           {currentSection === 3 && (
//             <>
//               <Alert>
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>
//                   Upload a new content file to replace the existing one. This is the main cultural heritage content.
//                 </AlertDescription>
//               </Alert>

//               {hasExistingContent && !newContentFile && (
//                 <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                   <div>
//                     <p className="text-sm font-medium text-green-800">
//                       Current content file is saved ({formData.contentFileType})
//                     </p>
//                     <p className="text-xs text-green-600">
//                       Upload a new file below to replace it
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label>Content File Type *</Label>
//                 <RadioGroup
//                   value={formData.contentFileType}
//                   onValueChange={(v: any) =>
//                     setFormData((prev) => ({ ...prev, contentFileType: v }))
//                   }
//                 >
//                   {["audio", "video", "image", "text", "3d"].map((type) => (
//                     <div key={type} className="flex items-center space-x-2">
//                       <RadioGroupItem value={type} id={`edit-${type}`} />
//                       <Label htmlFor={`edit-${type}`} className="cursor-pointer">
//                         {type === "text" ? "Text/Document" : type === "3d" ? "3D Model" : type.charAt(0).toUpperCase() + type.slice(1)}
//                       </Label>
//                     </div>
//                   ))}
//                 </RadioGroup>
//               </div>

//               {formData.contentFileType !== "image" && (
//                 <div className="space-y-2">
//                   <Label htmlFor="edit-language">Language</Label>
//                   <Input
//                     id="edit-language"
//                     value={formData.language}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         language: e.target.value,
//                       }))
//                     }
//                   />
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="edit-content-file">
//                   {newContentFile || !hasExistingContent
//                     ? "Upload Content File *"
//                     : "Replace Content File (Optional)"}
//                 </Label>
//                 <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
//                   <Input
//                     id="edit-content-file"
//                     type="file"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0] || null;
//                       handleContentFileChange(file);
//                     }}
//                     className="hidden"
//                     accept={
//                       formData.contentFileType === "audio"
//                         ? "audio/*"
//                         : formData.contentFileType === "video"
//                         ? "video/*"
//                         : formData.contentFileType === "image"
//                         ? "image/*"
//                         : formData.contentFileType === "text"
//                         ? ".pdf,.doc,.docx,.txt"
//                         : formData.contentFileType === "3d"
//                         ? ".obj,.fbx,.glb,.gltf"
//                         : "*"
//                     }
//                   />
//                   <label htmlFor="edit-content-file" className="cursor-pointer">
//                     {newContentFile ? (
//                       <>
//                         <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-2" />
//                         <p className="text-sm font-medium">{newContentFile.name}</p>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           {(newContentFile.size / 1024 / 1024).toFixed(2)} MB
//                         </p>
//                         <p className="text-xs text-muted-foreground">Click to change file</p>
//                       </>
//                     ) : (
//                       <>
//                         <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
//                         <p className="text-sm text-muted-foreground">
//                           {hasExistingContent
//                             ? "Click to replace main content file"
//                             : "Click to upload main content file"}
//                         </p>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Max file size: 100MB
//                         </p>
//                       </>
//                     )}
//                   </label>
//                 </div>

//                 {/* Preview Button and Preview */}
//                 {contentPreviewUrl && (
//                   <div className="space-y-2">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => setShowContentPreview(!showContentPreview)}
//                       className="w-full"
//                     >
//                       {showContentPreview ? (
//                         <>
//                           <EyeOff className="h-4 w-4 mr-2" />
//                           Hide Preview
//                         </>
//                       ) : (
//                         <>
//                           <Eye className="h-4 w-4 mr-2" />
//                           Show Preview
//                         </>
//                       )}
//                     </Button>

//                     {showContentPreview && (
//                       <div className="border rounded-lg p-4 bg-gray-50">
//                         <h4 className="text-sm font-medium mb-2">Content Preview:</h4>
//                         {renderContentPreview()}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           {/* SECTION 4: Consent & Ethics */}
//           {currentSection === 4 && (
//             <>
//               <Alert>
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>
//                   Ethical consent is required for all uploads. Please provide documentation and consent details.
//                 </AlertDescription>
//               </Alert>

//               {hasExistingConsent && !newConsentFile && (
//                 <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                   <div>
//                     <p className="text-sm font-medium text-green-800">
//                       Current consent file is saved
//                     </p>
//                     <p className="text-xs text-green-600">
//                       Upload a new file below to replace it
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label>Consent File Type *</Label>
//                 <RadioGroup
//                   value={formData.consentFileType}
//                   onValueChange={(v: any) =>
//                     setFormData((prev) => ({ ...prev, consentFileType: v }))
//                   }
//                 >
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="pdf" id="edit-pdf" />
//                     <Label htmlFor="edit-pdf" className="cursor-pointer">
//                       PDF (Written)
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="audio" id="edit-consent-audio" />
//                     <Label htmlFor="edit-consent-audio" className="cursor-pointer">
//                       Audio Recording
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="video" id="edit-consent-video" />
//                     <Label htmlFor="edit-consent-video" className="cursor-pointer">
//                       Video Recording
//                     </Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="edit-consent-file">
//                   {newConsentFile || !hasExistingConsent
//                     ? "Upload Consent File *"
//                     : "Replace Consent File (Optional)"}
//                 </Label>
//                 <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
//                   <Input
//                     id="edit-consent-file"
//                     type="file"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0] || null;
//                       handleConsentFileChange(file);
//                     }}
//                     className="hidden"
//                     accept={
//                       formData.consentFileType === "pdf"
//                         ? "application/pdf"
//                         : formData.consentFileType === "audio"
//                         ? "audio/*"
//                         : "video/*"
//                     }
//                   />
//                   <label htmlFor="edit-consent-file" className="cursor-pointer">
//                     {newConsentFile ? (
//                       <>
//                         <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-2" />
//                         <p className="text-sm font-medium">{newConsentFile.name}</p>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Click to change file
//                         </p>
//                       </>
//                     ) : (
//                       <>
//                         <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
//                         <p className="text-sm text-muted-foreground">
//                           {hasExistingConsent
//                             ? "Click to replace consent file"
//                             : "Click to upload consent file"}
//                         </p>
//                       </>
//                     )}
//                   </label>
//                 </div>

//                 {/* Preview Button and Preview */}
//                 {consentPreviewUrl && (
//                   <div className="space-y-2">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => setShowConsentPreview(!showConsentPreview)}
//                       className="w-full"
//                     >
//                       {showConsentPreview ? (
//                         <>
//                           <EyeOff className="h-4 w-4 mr-2" />
//                           Hide Preview
//                         </>
//                       ) : (
//                         <>
//                           <Eye className="h-4 w-4 mr-2" />
//                           Show Preview
//                         </>
//                       )}
//                     </Button>

//                     {showConsentPreview && (
//                       <div className="border rounded-lg p-4 bg-gray-50">
//                         <h4 className="text-sm font-medium mb-2">Consent Preview:</h4>
//                         {renderConsentPreview()}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <Separator className="my-4" />

//               {/* Consent Details */}
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="edit-consent-type">Consent Type *</Label>
//                   <Select
//                     value={formData.consentType}
//                     onValueChange={(v) =>
//                       setFormData((prev) => ({ ...prev, consentType: v }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select consent type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {consentTypes.map((ct) => (
//                         <SelectItem key={ct} value={ct}>
//                           {ct}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="edit-consent-names">
//                     Name(s) of Consenting Person(s) *
//                   </Label>
//                   <Input
//                     id="edit-consent-names"
//                     value={formData.consentNames}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         consentNames: e.target.value,
//                       }))
//                     }
//                     placeholder="Enter names"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="edit-consent-date">Date of Consent *</Label>
//                   <Input
//                     id="edit-consent-date"
//                     type="date"
//                     value={formData.consentDate}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         consentDate: e.target.value,
//                       }))
//                     }
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Duration / Validity *</Label>
//                   <Select
//                     value={formData.consentDuration}
//                     onValueChange={(v) =>
//                       setFormData((prev) => ({ ...prev, consentDuration: v }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select duration" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="permanent">Permanent</SelectItem>
//                       <SelectItem value="temporary">Temporary</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Type of Permission *</Label>
//                 <div className="space-y-2">
//                   {permissionTypes.map((pt) => (
//                     <div key={pt} className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`edit-perm-${pt}`}
//                         checked={formData.permissionType.includes(pt)}
//                         onCheckedChange={() => handlePermissionToggle(pt)}
//                       />
//                       <Label htmlFor={`edit-perm-${pt}`} className="cursor-pointer">
//                         {pt}
//                       </Label>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="edit-signature">Digital Signature (Optional)</Label>
//                 <Input
//                   id="edit-signature"
//                   value={formData.digitalSignature}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       digitalSignature: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter signature or leave blank"
//                 />
//               </div>
//             </>
//           )}

//           {/* SECTION 5: Access & Warnings */}
//           {currentSection === 5 && (
//             <>
//               <div className="space-y-2">
//                 <Label>Access Tier *</Label>
//                 <Select
//                   value={formData.accessTier}
//                   onValueChange={(v) =>
//                     setFormData((prev) => ({ ...prev, accessTier: v }))
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select access tier" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {accessTiers.map((at) => (
//                       <SelectItem key={at} value={at}>
//                         {at}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label>Content Warnings</Label>
//                 <div className="space-y-2">
//                   {warningOptions.map((wo) => (
//                     <div key={wo} className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`edit-warn-${wo}`}
//                         checked={formData.contentWarnings.includes(wo)}
//                         onCheckedChange={() => handleWarningToggle(wo)}
//                       />
//                       <Label htmlFor={`edit-warn-${wo}`} className="cursor-pointer">
//                         {wo}
//                       </Label>
//                     </div>
//                   ))}
//                 </div>
//                 {formData.contentWarnings.includes("Other") && (
//                   <Input
//                     placeholder="Specify other warning"
//                     value={formData.warningOtherText}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         warningOtherText: e.target.value,
//                       }))
//                     }
//                     className="mt-2"
//                   />
//                 )}
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <Label htmlFor="edit-background">Background Information</Label>
//                 <Textarea
//                   id="edit-background"
//                   value={formData.backgroundInfo}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       backgroundInfo: e.target.value,
//                     }))
//                   }
//                   rows={4}
//                   placeholder="Additional context..."
//                 />
//               </div>
//             </>
//           )}

//           {/* SECTION 6: Additional Files */}
//           {currentSection === 6 && (
//             <>
//               <p className="text-sm text-muted-foreground">
//                 Optional files to enhance your submission
//               </p>

//               {/* Translation File */}
//               <div className="space-y-2">
//                 <Label htmlFor="edit-translation">Translation File</Label>
//                 {hasExistingTranslation && !newTranslationFile && (
//                   <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm flex items-center gap-2">
//                     <CheckCircle className="h-4 w-4 text-blue-600" />
//                     <span className="text-blue-800">Translation file exists</span>
//                   </div>
//                 )}
//                 <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
//                   <Input
//                     id="edit-translation"
//                     type="file"
//                     onChange={(e) =>
//                       e.target.files && setNewTranslationFile(e.target.files[0])
//                     }
//                     className="hidden"
//                     accept=".pdf,.docx,.txt"
//                   />
//                   <label htmlFor="edit-translation" className="cursor-pointer">
//                     {newTranslationFile ? (
//                       <>
//                         <FileText className="h-8 w-8 mx-auto text-primary mb-1" />
//                         <p className="text-sm font-medium">{newTranslationFile.name}</p>
//                       </>
//                     ) : (
//                       <>
//                         <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-1" />
//                         <p className="text-xs text-muted-foreground">
//                           {hasExistingTranslation
//                             ? "Replace translation file"
//                             : "Upload translation file"}
//                         </p>
//                       </>
//                     )}
//                   </label>
//                 </div>
//               </div>

//               {/* Verification Document */}
//               <div className="space-y-2">
//                 <Label htmlFor="edit-verification">Verification Document</Label>
//                 {hasExistingVerification && !newVerificationDoc && (
//                   <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm flex items-center gap-2">
//                     <CheckCircle className="h-4 w-4 text-blue-600" />
//                     <span className="text-blue-800">Verification document exists</span>
//                   </div>
//                 )}
//                 <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
//                   <Input
//                     id="edit-verification"
//                     type="file"
//                     onChange={(e) =>
//                       e.target.files && setNewVerificationDoc(e.target.files[0])
//                     }
//                     className="hidden"
//                     accept=".pdf,.jpg,.png"
//                   />
//                   <label htmlFor="edit-verification" className="cursor-pointer">
//                     {newVerificationDoc ? (
//                       <>
//                         <FileText className="h-8 w-8 mx-auto text-primary mb-1" />
//                         <p className="text-sm font-medium">{newVerificationDoc.name}</p>
//                       </>
//                     ) : (
//                       <>
//                         <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-1" />
//                         <p className="text-xs text-muted-foreground">
//                           {hasExistingVerification
//                             ? "Replace verification document"
//                             : "Upload verification document"}
//                         </p>
//                       </>
//                     )}
//                   </label>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         <Separator />

//         {/* <div className="flex justify-between items-center">
//           <div className="text-sm text-muted-foreground">
//             Section {currentSection} of {sections.length}
//           </div>
//           <div className="flex gap-2">
//             {currentSection > 1 && (
//               <Button
//                 variant="outline"
//                 onClick={() => setCurrentSection((prev) => prev - 1)}
//                 disabled={saving}
//               >
//                 Previous
//               </Button>
//             )}
//             {currentSection < sections.length && (
//               <Button 
//                 onClick={() => setCurrentSection((prev) => prev + 1)}
//                 disabled={saving}
//               >
//                 Next
//               </Button>
//             )}
//             {currentSection === sections.length && (
//               <>
//                 <Button 
//                   variant="outline" 
//                   onClick={() => onOpenChange(false)}
//                   disabled={saving}
//                 >
//                   <X className="h-4 w-4 mr-2" />
//                   Cancel
//                 </Button>
//                 <Button onClick={handleSave} disabled={saving}>
//                   {saving ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="h-4 w-4 mr-2" />
//                       Save All Changes
//                     </>
//                   )}
//                 </Button>
//               </>
//             )}
//           </div>
//         </div> */}

//         <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
//         <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
//           Section {currentSection} of {sections.length}
//         </div>
//         <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
//           {currentSection > 1 && (
//             <Button
//               variant="outline"
//               onClick={() => setCurrentSection((prev) => prev - 1)}
//               disabled={saving}
//               className="flex-1 sm:flex-none text-sm"
//               size="sm"
//             >
//               Previous
//             </Button>
//           )}
//           {currentSection < sections.length && (
//             <Button 
//               onClick={() => setCurrentSection((prev) => prev + 1)}
//               disabled={saving}
//               className="flex-1 sm:flex-none text-sm"
//               size="sm"
//             >
//               Next
//             </Button>
//           )}
//           {currentSection === sections.length && (
//             <>
//               <Button 
//                 variant="outline" 
//                 onClick={() => onOpenChange(false)}
//                 disabled={saving}
//                 className="flex-1 sm:flex-none text-sm"
//                 size="sm"
//               >
//                 <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={handleSave} 
//                 disabled={saving}
//                 className="flex-1 sm:flex-none text-sm"
//                 size="sm"
//               >
//                 {saving ? (
//                   <>
//                     <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//                     Save
//                   </>
//                 )}
//               </Button>
//             </>
//           )}
//         </div>
//       </div>
//       </DialogContent>
//     </Dialog>
//   );
// };














import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Save,
  X,
  Loader2,
  FileText,
  Upload,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

interface Submission {
  _id: string;
  title: string;
  description: string;
  country?: string;
  stateRegion?: string;
  tribe?: string;
  village?: string;
  culturalDomain?: string;
  keywords?: string;
  language?: string;
  dateOfRecording?: string;
  culturalSignificance?: string;
  contentFileType: string;
  contentUrl?: string;
  consent: {
    consentType?: string;
    fileType?: string;
    fileUrl?: string;
    consentNames?: string;
    consentDate?: string;
    permissionType?: string[];
    duration?: string;
    digitalSignature?: string;
  };
  accessTier?: string;
  contentWarnings?: string[];
  warningOtherText?: string;
  backgroundInfo?: string;
  translationFileUrl?: string;
  verificationDocUrl?: string;
  status: string;
}

interface EditSubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: Submission | null;
  onSuccess: (updated: any) => void;
}

const countries = [
  "New Zealand",
  "Australia",
  "United States of America",
  "Norway",
  "Sweden",
  "India",
];

const culturalDomains = [
  "Folk Song",
  "Folk Dance",
  "Folk Tale",
  "Ritual",
  "Material Culture",
  "Sacred Site",
  "Oral Narrative",
  "Other",
];

const consentTypes = [
  "Individual Consent",
  "Collective / Community Consent",
  "Custodian Consent",
];

const permissionTypes = [
  "Educational",
  "Research",
  "Cultural Display",
  "All the above",
];

const accessTiers = ["Public", "Restricted", "Confidential/Sacred"];

const warningOptions = [
  "Sacred object",
  "Deceased person",
  "Ritual context",
  "Other",
];

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const EditSubmissionModal = ({
  open,
  onOpenChange,
  submission,
  onSuccess,
}: EditSubmissionModalProps) => {
  const [saving, setSaving] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [validationError, setValidationError] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    country: "",
    stateRegion: "",
    tribe: "",
    village: "",
    culturalDomain: "",
    description: "",
    keywords: "",
    language: "",
    dateOfRecording: "",
    culturalSignificance: "",
    contentFileType: "audio" as "audio" | "video" | "image" | "text" | "3d",
    consentType: "",
    consentFileType: "pdf" as "pdf" | "audio" | "video",
    consentNames: "",
    consentDate: "",
    permissionType: [] as string[],
    consentDuration: "",
    digitalSignature: "",
    accessTier: "",
    contentWarnings: [] as string[],
    warningOtherText: "",
    backgroundInfo: "",
     changesSummary: "", 
  });

  // File state
  const [newContentFile, setNewContentFile] = useState<File | null>(null);
  const [newConsentFile, setNewConsentFile] = useState<File | null>(null);
  const [newTranslationFile, setNewTranslationFile] = useState<File | null>(null);
  const [newVerificationDoc, setNewVerificationDoc] = useState<File | null>(null);
  const [hasExistingContent, setHasExistingContent] = useState(false);
  const [hasExistingConsent, setHasExistingConsent] = useState(false);
  const [hasExistingTranslation, setHasExistingTranslation] = useState(false);
  const [hasExistingVerification, setHasExistingVerification] = useState(false);

  // Preview state
  const [showContentPreview, setShowContentPreview] = useState(false);
  const [showConsentPreview, setShowConsentPreview] = useState(false);
  const [contentPreviewUrl, setContentPreviewUrl] = useState<string>("");
  const [consentPreviewUrl, setConsentPreviewUrl] = useState<string>("");

  // Format date from ISO to DD/MM/YYYY
  const formatDateForInput = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format date for date input (YYYY-MM-DD)
  const formatDateForDateInput = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (submission) {
      setFormData({
        title: submission.title || "",
        country: submission.country || "",
        stateRegion: submission.stateRegion || "",
        tribe: submission.tribe || "",
        village: submission.village || "",
        culturalDomain: submission.culturalDomain || "",
        description: submission.description || "",
        keywords: submission.keywords || "",
        language: submission.language || "",
        dateOfRecording: formatDateForInput(submission.dateOfRecording || ""),
        culturalSignificance: submission.culturalSignificance || "",
        contentFileType: (submission.contentFileType as any) || "audio",
        consentType: submission.consent?.consentType || "",
        consentFileType: (submission.consent?.fileType as any) || "pdf",
        consentNames: submission.consent?.consentNames || "",
        consentDate: formatDateForDateInput(submission.consent?.consentDate || ""),
        permissionType: submission.consent?.permissionType || [],
        consentDuration: submission.consent?.duration || "",
        digitalSignature: submission.consent?.digitalSignature || "",
        accessTier: submission.accessTier || "",
        contentWarnings: submission.contentWarnings || [],
        warningOtherText: submission.warningOtherText || "",
        backgroundInfo: submission.backgroundInfo || "",
        changesSummary: "",
      });

      // Check existing files
      setHasExistingContent(!!submission.contentUrl);
      setHasExistingConsent(!!submission.consent?.fileUrl);
      setHasExistingTranslation(!!submission.translationFileUrl);
      setHasExistingVerification(!!submission.verificationDocUrl);

      // Set preview URLs for existing files
      setContentPreviewUrl(submission.contentUrl || "");
      setConsentPreviewUrl(submission.consent?.fileUrl || "");

      // Reset file selections
      setNewContentFile(null);
      setNewConsentFile(null);
      setNewTranslationFile(null);
      setNewVerificationDoc(null);
      setValidationError("");
      setShowContentPreview(false);
      setShowConsentPreview(false);
    }
  }, [submission]);

  const handlePermissionToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      permissionType: prev.permissionType.includes(value)
        ? prev.permissionType.filter((v) => v !== value)
        : [...prev.permissionType, value],
    }));
  };

  const handleWarningToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      contentWarnings: prev.contentWarnings.includes(value)
        ? prev.contentWarnings.filter((v) => v !== value)
        : [...prev.contentWarnings, value],
    }));
  };

  // Preview handlers
  const handleContentFileChange = (file: File | null) => {
    setNewContentFile(file);
    if (file) {
      // Create preview URL for new file
      const url = URL.createObjectURL(file);
      setContentPreviewUrl(url);
    } else if (submission?.contentUrl) {
      // Revert to original URL if file is removed
      setContentPreviewUrl(submission.contentUrl);
    }
  };

  const handleConsentFileChange = (file: File | null) => {
    setNewConsentFile(file);
    if (file) {
      // Create preview URL for new file
      const url = URL.createObjectURL(file);
      setConsentPreviewUrl(url);
    } else if (submission?.consent?.fileUrl) {
      // Revert to original URL if file is removed
      setConsentPreviewUrl(submission.consent.fileUrl);
    }
  };

  const renderContentPreview = () => {
    if (!contentPreviewUrl) return null;

    const fileType = newContentFile ? newContentFile.type : formData.contentFileType;

    if (fileType.startsWith('image/') || formData.contentFileType === 'image') {
      return (
        <div className="mt-4">
          <img 
            src={contentPreviewUrl} 
            alt="Content preview" 
            className="max-w-full h-auto max-h-96 rounded-lg border"
          />
        </div>
      );
    }

    if (fileType.startsWith('video/') || formData.contentFileType === 'video') {
      return (
        <div className="mt-4">
          <video 
            src={contentPreviewUrl} 
            controls 
            className="max-w-full h-auto max-h-96 rounded-lg border"
          />
        </div>
      );
    }

    if (fileType.startsWith('audio/') || formData.contentFileType === 'audio') {
      return (
        <div className="mt-4">
          <audio 
            src={contentPreviewUrl} 
            controls 
            className="w-full"
          />
        </div>
      );
    }

    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          Preview not available for this file type. File will be uploaded.
        </p>
      </div>
    );
  };

  const renderConsentPreview = () => {
    if (!consentPreviewUrl) return null;

    const fileType = newConsentFile ? newConsentFile.type : formData.consentFileType;

    if (fileType === 'application/pdf' || formData.consentFileType === 'pdf') {
      return (
        <div className="mt-4">
          <iframe 
            src={consentPreviewUrl} 
            className="w-full h-96 rounded-lg border"
            title="Consent document preview"
          />
        </div>
      );
    }

    if (fileType.startsWith('video/') || formData.consentFileType === 'video') {
      return (
        <div className="mt-4">
          <video 
            src={consentPreviewUrl} 
            controls 
            className="max-w-full h-auto max-h-96 rounded-lg border"
          />
        </div>
      );
    }

    if (fileType.startsWith('audio/') || formData.consentFileType === 'audio') {
      return (
        <div className="mt-4">
          <audio 
            src={consentPreviewUrl} 
            controls 
            className="w-full"
          />
        </div>
      );
    }

    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          Preview not available for this file type.
        </p>
      </div>
    );
  };

  // Validation function
  const validateForm = (): string => {
    // Section 1 validation
    if (!formData.country) return "Country is required";
    if (!formData.stateRegion) return "State/Region is required";
    if (!formData.tribe) return "Tribe is required";
    if (!formData.culturalDomain) return "Cultural Domain is required";
    if (!formData.title) return "Title is required";

    // Section 2 validation
    if (!formData.description) return "Description is required";
    if (!formData.keywords) return "Keywords are required";

    // Section 3 validation - only if no existing file
    if (!hasExistingContent && !newContentFile) return "Content file is required";

    // Section 4 validation
    if (!hasExistingConsent && !newConsentFile) return "Consent file is required";
    if (!formData.consentType) return "Consent type is required";
    if (!formData.consentNames) return "Consenting person(s) name is required";
    if (!formData.consentDate) return "Consent date is required";
    if (!formData.consentDuration) return "Consent duration is required";
    if (formData.permissionType.length === 0) return "At least one permission type is required";

    // Section 5 validation
    if (!formData.accessTier) return "Access tier is required";

     if (!formData.changesSummary || formData.changesSummary.trim().length === 0) {
    return "Changes summary is required";
  }

    return "";
  };

  const handleSave = async () => {
    if (!submission) return;

    // Validate form
    const error = validateForm();
    if (error) {
      setValidationError(error);
      alert(error);
      return;
    }

    setSaving(true);
    setValidationError("");

    try {
      const token = localStorage.getItem("auth_token");
      const apiFormData = new FormData();

      // ⬅️ NEW: Add submissionId and changesSummary first
        apiFormData.append("submissionId", submission._id);
        apiFormData.append("changesSummary", formData.changesSummary);

      // Add all text fields with proper handling
      apiFormData.append("title", formData.title);
      apiFormData.append("country", formData.country);
      apiFormData.append("stateRegion", formData.stateRegion);
      apiFormData.append("tribe", formData.tribe);
      apiFormData.append("village", formData.village);
      apiFormData.append("culturalDomain", formData.culturalDomain);
      apiFormData.append("description", formData.description);
      
      // Handle keywords as array
      // const keywordsArray = formData.keywords
      //   .split(",")
      //   .map((k) => k.trim())
      //   .filter(Boolean);
      apiFormData.append("keywords", formData.keywords);
      
      apiFormData.append("language", formData.language);
      apiFormData.append("dateOfRecording", formData.dateOfRecording);
      apiFormData.append("culturalSignificance", formData.culturalSignificance);
      apiFormData.append("contentFileType", formData.contentFileType);
      
      // Consent fields
      apiFormData.append("consentType", formData.consentType);
      apiFormData.append("consentFileType", formData.consentFileType);
      apiFormData.append("consentNames", formData.consentNames);
      apiFormData.append("consentDate", formData.consentDate);
      apiFormData.append("permissionType", JSON.stringify(formData.permissionType));
      apiFormData.append("consentDuration", formData.consentDuration);
      apiFormData.append("digitalSignature", formData.digitalSignature);
      
      // Access and warnings
      apiFormData.append("accessTier", formData.accessTier);
      apiFormData.append("contentWarnings", JSON.stringify(formData.contentWarnings));
      apiFormData.append("warningOtherText", formData.warningOtherText);
      apiFormData.append("backgroundInfo", formData.backgroundInfo);

      // Add files if selected
      if (newContentFile) {
        apiFormData.append("contentFile", newContentFile);
      }
      if (newConsentFile) {
        apiFormData.append("consentFile", newConsentFile);
      }
      if (newTranslationFile) {
        apiFormData.append("translationFile", newTranslationFile);
      }
      if (newVerificationDoc) {
        apiFormData.append("verificationDoc", newVerificationDoc);
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/amendments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: apiFormData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.errors?.[0]?.msg || data?.message || "Failed to update");
      }

    // ⬅️ NEW: Show success message with version info
    alert(
      `Amendment request submitted successfully!\n\n` +
      `Current Version: v${data.amendment.currentVersion}\n` +
      `Proposed Version: v${data.amendment.proposedVersion}\n` +
      `Status: ${data.amendment.status}\n\n` +
      `Your changes are pending admin review.`
    );

      onSuccess(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating submission:", error);
      alert(error instanceof Error ? error.message : "Failed to update submission");
    } finally {
      setSaving(false);
    }
  };

  if (!submission) return null;

  const sections = [
    "Category & Title",
    "Description",
    "Content File",
    "Consent & Ethics",
    "Access & Warnings",
    "Additional Files",
    "Changes Summary", 
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Submission</DialogTitle>
          <DialogDescription>
            Update your submission details. Changes will require re-approval.
          </DialogDescription>
        </DialogHeader>

        {submission.status === "approved" && (
          <Alert className="border-amber-500 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              This submission is currently approved. Editing will reset its status to "pending" for review.
            </AlertDescription>
          </Alert>
        )}

        {validationError && (
          <Alert className="border-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{validationError}</AlertDescription>
          </Alert>
        )}

        {/* Section Navigation */}
        <div className="flex gap-2 flex-wrap mb-4">
          {sections.map((section, idx) => (
            <Button
              key={idx}
              variant={currentSection === idx + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentSection(idx + 1)}
              className="text-xs"
            >
              {idx + 1}. {section}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {/* SECTION 1: Category & Title */}
          {currentSection === 1 && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(v) => {
                      setFormData((prev) => ({
                        ...prev,
                        country: v,
                        stateRegion: "",
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-state">State / Region *</Label>
                  {formData.country === "India" ? (
                    <Select
                      value={formData.stateRegion}
                      onValueChange={(v) =>
                        setFormData((prev) => ({ ...prev, stateRegion: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="edit-state"
                      value={formData.stateRegion}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          stateRegion: e.target.value,
                        }))
                      }
                      placeholder="Enter state/region"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-tribe">Tribe *</Label>
                  <Input
                    id="edit-tribe"
                    value={formData.tribe}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tribe: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-village">Village</Label>
                  <Input
                    id="edit-village"
                    value={formData.village}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        village: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-domain">Cultural Domain *</Label>
                <Select
                  value={formData.culturalDomain}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, culturalDomain: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {culturalDomains.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
            </>
          )}

          {/* SECTION 2: Description */}
          {currentSection === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={5}
                  maxLength={1500}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/1500
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-keywords">Keywords *</Label>
                  <Input
                    id="edit-keywords"
                    value={formData.keywords}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        keywords: e.target.value,
                      }))
                    }
                    placeholder="comma-separated"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple keywords with commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date of Recording (DD/MM/YYYY)</Label>
                  <Input
                    id="edit-date"
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.dateOfRecording}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[\d/]*$/.test(value)) {
                        setFormData((prev) => ({
                          ...prev,
                          dateOfRecording: value,
                        }));
                      }
                    }}
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-significance">Cultural Significance</Label>
                <Textarea
                  id="edit-significance"
                  value={formData.culturalSignificance}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      culturalSignificance: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>
            </>
          )}

          {/* SECTION 3: Content File */}
          {currentSection === 3 && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Upload a new content file to replace the existing one. This is the main cultural heritage content.
                </AlertDescription>
              </Alert>

              {hasExistingContent && !newContentFile && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Current content file is saved ({formData.contentFileType})
                    </p>
                    <p className="text-xs text-green-600">
                      Upload a new file below to replace it
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Content File Type *</Label>
                <RadioGroup
                  value={formData.contentFileType}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, contentFileType: v }))
                  }
                >
                  {["audio", "video", "image", "text", "3d"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={`edit-${type}`} />
                      <Label htmlFor={`edit-${type}`} className="cursor-pointer">
                        {type === "text" ? "Text/Document" : type === "3d" ? "3D Model" : type.charAt(0).toUpperCase() + type.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {formData.contentFileType !== "image" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-language">Language</Label>
                  <Input
                    id="edit-language"
                    value={formData.language}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-content-file">
                  {newContentFile || !hasExistingContent
                    ? "Upload Content File *"
                    : "Replace Content File (Optional)"}
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <Input
                    id="edit-content-file"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleContentFileChange(file);
                    }}
                    className="hidden"
                    accept={
                      formData.contentFileType === "audio"
                        ? "audio/*"
                        : formData.contentFileType === "video"
                        ? "video/*"
                        : formData.contentFileType === "image"
                        ? "image/*"
                        : formData.contentFileType === "text"
                        ? ".pdf,.doc,.docx,.txt"
                        : formData.contentFileType === "3d"
                        ? ".obj,.fbx,.glb,.gltf"
                        : "*"
                    }
                  />
                  <label htmlFor="edit-content-file" className="cursor-pointer">
                    {newContentFile ? (
                      <>
                        <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-2" />
                        <p className="text-sm font-medium">{newContentFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(newContentFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-muted-foreground">Click to change file</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {hasExistingContent
                            ? "Click to replace main content file"
                            : "Click to upload main content file"}
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                          Max file size: 10MB
                        </p>
                      </>
                    )}
                  </label>
                </div>

                {/* Preview Button and Preview */}
                {contentPreviewUrl && (
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowContentPreview(!showContentPreview)}
                      className="w-full"
                    >
                      {showContentPreview ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide Preview
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Show Preview
                        </>
                      )}
                    </Button>

                    {showContentPreview && (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="text-sm font-medium mb-2">Content Preview:</h4>
                        {renderContentPreview()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* SECTION 4: Consent & Ethics */}
          {currentSection === 4 && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ethical consent is required for all uploads. Please provide documentation and consent details.
                </AlertDescription>
              </Alert>

              {hasExistingConsent && !newConsentFile && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Current consent file is saved
                    </p>
                    <p className="text-xs text-green-600">
                      Upload a new file below to replace it
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Consent File Type *</Label>
                <RadioGroup
                  value={formData.consentFileType}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, consentFileType: v }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="edit-pdf" />
                    <Label htmlFor="edit-pdf" className="cursor-pointer">
                      PDF (Written)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="audio" id="edit-consent-audio" />
                    <Label htmlFor="edit-consent-audio" className="cursor-pointer">
                      Audio Recording
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video" id="edit-consent-video" />
                    <Label htmlFor="edit-consent-video" className="cursor-pointer">
                      Video Recording
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-consent-file">
                  {newConsentFile || !hasExistingConsent
                    ? "Upload Consent File *"
                    : "Replace Consent File (Optional)"}
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <Input
                    id="edit-consent-file"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleConsentFileChange(file);
                    }}
                    className="hidden"
                    accept={
                      formData.consentFileType === "pdf"
                        ? "application/pdf"
                        : formData.consentFileType === "audio"
                        ? "audio/*"
                        : "video/*"
                    }
                  />
                  <label htmlFor="edit-consent-file" className="cursor-pointer">
                    {newConsentFile ? (
                      <>
                        <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-2" />
                        <p className="text-sm font-medium">{newConsentFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click to change file
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {hasExistingConsent
                            ? "Click to replace consent file"
                            : "Click to upload consent file"}
                        </p>
                      </>
                    )}
                  </label>
                </div>

                {/* Preview Button and Preview */}
                {consentPreviewUrl && (
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowConsentPreview(!showConsentPreview)}
                      className="w-full"
                    >
                      {showConsentPreview ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide Preview
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Show Preview
                        </>
                      )}
                    </Button>

                    {showConsentPreview && (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="text-sm font-medium mb-2">Consent Preview:</h4>
                        {renderConsentPreview()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              {/* Consent Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-consent-type">Consent Type *</Label>
                  <Select
                    value={formData.consentType}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, consentType: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select consent type" />
                    </SelectTrigger>
                    <SelectContent>
                      {consentTypes.map((ct) => (
                        <SelectItem key={ct} value={ct}>
                          {ct}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-consent-names">
                    Name(s) of Consenting Person(s) *
                  </Label>
                  <Input
                    id="edit-consent-names"
                    value={formData.consentNames}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        consentNames: e.target.value,
                      }))
                    }
                    placeholder="Enter names"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-consent-date">Date of Consent *</Label>
                  <Input
                    id="edit-consent-date"
                    type="date"
                    value={formData.consentDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        consentDate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration / Validity *</Label>
                  <Select
                    value={formData.consentDuration}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, consentDuration: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type of Permission *</Label>
                <div className="space-y-2">
                  {permissionTypes.map((pt) => (
                    <div key={pt} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-perm-${pt}`}
                        checked={formData.permissionType.includes(pt)}
                        onCheckedChange={() => handlePermissionToggle(pt)}
                      />
                      <Label htmlFor={`edit-perm-${pt}`} className="cursor-pointer">
                        {pt}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-signature">Digital Signature (Optional)</Label>
                <Input
                  id="edit-signature"
                  value={formData.digitalSignature}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      digitalSignature: e.target.value,
                    }))
                  }
                  placeholder="Enter signature or leave blank"
                />
              </div>
            </>
          )}

          {/* SECTION 5: Access & Warnings */}
          {currentSection === 5 && (
            <>
              <div className="space-y-2">
                <Label>Access Tier *</Label>
                <Select
                  value={formData.accessTier}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, accessTier: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select access tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessTiers.map((at) => (
                      <SelectItem key={at} value={at}>
                        {at}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Content Warnings</Label>
                <div className="space-y-2">
                  {warningOptions.map((wo) => (
                    <div key={wo} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-warn-${wo}`}
                        checked={formData.contentWarnings.includes(wo)}
                        onCheckedChange={() => handleWarningToggle(wo)}
                      />
                      <Label htmlFor={`edit-warn-${wo}`} className="cursor-pointer">
                        {wo}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.contentWarnings.includes("Other") && (
                  <Input
                    placeholder="Specify other warning"
                    value={formData.warningOtherText}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        warningOtherText: e.target.value,
                      }))
                    }
                    className="mt-2"
                  />
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="edit-background">Background Information</Label>
                <Textarea
                  id="edit-background"
                  value={formData.backgroundInfo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      backgroundInfo: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Additional context..."
                />
              </div>
            </>
          )}

          {/* SECTION 6: Additional Files */}
          {currentSection === 6 && (
            <>
              <p className="text-sm text-muted-foreground">
                Optional files to enhance your submission
              </p>

              {/* Translation File */}
              <div className="space-y-2">
                <Label htmlFor="edit-translation">Translation File</Label>
                {hasExistingTranslation && !newTranslationFile && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">Translation file exists</span>
                  </div>
                )}
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <Input
                    id="edit-translation"
                    type="file"
                    onChange={(e) =>
                      e.target.files && setNewTranslationFile(e.target.files[0])
                    }
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                  />
                  <label htmlFor="edit-translation" className="cursor-pointer">
                    {newTranslationFile ? (
                      <>
                        <FileText className="h-8 w-8 mx-auto text-primary mb-1" />
                        <p className="text-sm font-medium">{newTranslationFile.name}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-1" />
                        <p className="text-xs text-muted-foreground">
                          {hasExistingTranslation
                            ? "Replace translation file"
                            : "Upload translation file"}
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Verification Document */}
              <div className="space-y-2">
                <Label htmlFor="edit-verification">Verification Document</Label>
                {hasExistingVerification && !newVerificationDoc && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">Verification document exists</span>
                  </div>
                )}
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <Input
                    id="edit-verification"
                    type="file"
                    onChange={(e) =>
                      e.target.files && setNewVerificationDoc(e.target.files[0])
                    }
                    className="hidden"
                    accept=".pdf,.jpg,.png"
                  />
                  <label htmlFor="edit-verification" className="cursor-pointer">
                    {newVerificationDoc ? (
                      <>
                        <FileText className="h-8 w-8 mx-auto text-primary mb-1" />
                        <p className="text-sm font-medium">{newVerificationDoc.name}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-1" />
                        <p className="text-xs text-muted-foreground">
                          {hasExistingVerification
                            ? "Replace verification document"
                            : "Upload verification document"}
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </>
          )}

{currentSection === 7 && (
  <>
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <strong>Important:</strong> Please describe what you changed in this submission. 
        This helps the admin review your updates.
      </AlertDescription>
    </Alert>

    <div className="space-y-2">
      <Label htmlFor="edit-changes-summary">
        Summary of Changes * (What did you update?)
      </Label>
      <Textarea
        id="edit-changes-summary"
        value={formData.changesSummary}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            changesSummary: e.target.value,
          }))
        }
        rows={3}
        placeholder="Example: Updated title from 'Old Title' to 'New Title', replaced main video file with better quality version, added new consent document"
        maxLength={500}
        required
      />
      <p className="text-xs text-muted-foreground">
        {formData.changesSummary.length}/500 characters
      </p>
      <p className="text-xs text-red-600">
        * Required field - This helps admin understand what changed
      </p>
    </div>
  </>
)}
        </div>

        <Separator />

        {/* <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Section {currentSection} of {sections.length}
          </div>
          <div className="flex gap-2">
            {currentSection > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentSection((prev) => prev - 1)}
                disabled={saving}
              >
                Previous
              </Button>
            )}
            {currentSection < sections.length && (
              <Button 
                onClick={() => setCurrentSection((prev) => prev + 1)}
                disabled={saving}
              >
                Next
              </Button>
            )}
            {currentSection === sections.length && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save All Changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div> */}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
          Section {currentSection} of {sections.length}
        </div>
        <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
          {currentSection > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentSection((prev) => prev - 1)}
              disabled={saving}
              className="flex-1 sm:flex-none text-sm"
              size="sm"
            >
              Previous
            </Button>
          )}
          {currentSection < sections.length && (
            <Button 
              onClick={() => setCurrentSection((prev) => prev + 1)}
              disabled={saving}
              className="flex-1 sm:flex-none text-sm"
              size="sm"
            >
              Next
            </Button>
          )}
          {currentSection === sections.length && (
            <>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={saving}
                className="flex-1 sm:flex-none text-sm"
                size="sm"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="flex-1 sm:flex-none text-sm"
                size="sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Save
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
};