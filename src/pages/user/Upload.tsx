import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Upload as UploadIcon,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Box,
  AlertCircle,
  Loader2,
  MapPin,
  Globe,
  FileCheck,
  Shield,
  Lock,
  CheckCircle,
  Info,
  Calendar,
} from "lucide-react";

// ============================================
// TYPE DEFINITIONS
// ============================================
type ContentFileType = "audio" | "video" | "image" | "text" | "3d";
type ConsentFileType = "pdf" | "audio" | "video";

interface FormData {
  // Category
  country: string;
  stateRegion: string;
  tribe: string;
  village: string;
  culturalDomain: string;
  title: string;

  // Description
  description: string;
  keywords: string;
  language: string;
  culturalSignificance: string;
  recordingYear: string;
  recordingMonth: string;
  recordingDay: string;

  // Content
  contentFileType: ContentFileType;
  contentFile: File | null;

  // Consent
  consentFileType: ConsentFileType;
  consentFile: File | null;
  consentType: string;
  consentNames: string;
  consentDate: string;
  permissionType: string[];
  consentDuration: string;
  digitalSignature: string;

  // Access
  accessTier: string;
  contentWarnings: string[];
  warningOther: string;

  // Additional
  translationFile: File | null;
  backgroundInfo: string;
  verificationDoc: File | null;

  // Ethics
  ethicsAgreed: boolean;
}

// ============================================
// CONSTANTS
// ============================================
const COUNTRIES = [
  "New Zealand",
  "Australia",
  "United States of America",
  "Norway",
  "Sweden",
  "India",
];

const INDIAN_STATES = [
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

const CULTURAL_DOMAINS = [
  "Folk Song",
  "Folk Dance",
  "Folk Tale",
  "Ritual",
  "Material Culture",
  "Sacred Site",
  "Oral Narrative",
  "Other",
];

const CONSENT_TYPES = [
  "Individual Consent",
  "Collective / Community Consent",
  "Custodian Consent",
];

const PERMISSION_TYPES = [
  "Educational",
  "Research",
  "Cultural Display",
  "All the above",
];

const ACCESS_TIERS = ["Public", "Restricted", "Confidential/Sacred"];

const WARNING_OPTIONS = [
  "Sacred object",
  "Deceased person",
  "Ritual context",
  "Other",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const CONTENT_TYPE_CONFIG = {
  audio: {
    icon: Music,
    label: "Audio",
    formats: ".mp3, .wav",
    accept: "audio/mp3,audio/wav",
  },
  video: {
    icon: Video,
    label: "Video",
    formats: ".mp4, .mov",
    accept: "video/mp4,video/quicktime",
  },
  image: {
    icon: ImageIcon,
    label: "Image",
    formats: ".jpg, .png",
    accept: "image/jpeg,image/png",
  },
  text: {
    icon: FileText,
    label: "Text",
    formats: ".pdf, .docx",
    accept: "application/pdf,.docx",
  },
  "3d": {
    icon: Box,
    label: "3D Model",
    formats: ".obj, .glb",
    accept: ".obj,.glb",
  },
};

const STEP_CONFIG = [
  {
    id: 1,
    title: "Location & Category",
    icon: MapPin,
    description: "Where and what type of cultural content",
  },
  {
    id: 2,
    title: "Content Details",
    icon: FileText,
    description: "Describe your cultural heritage material",
  },
  {
    id: 3,
    title: "Upload Content",
    icon: UploadIcon,
    description: "Upload your cultural heritage file",
  },
  {
    id: 4,
    title: "Consent Documentation",
    icon: Shield,
    description: "Provide ethical consent documentation",
  },
  {
    id: 5,
    title: "Access & Permissions",
    icon: Lock,
    description: "Set access levels and permissions",
  },
  {
    id: 6,
    title: "Additional Information",
    icon: Info,
    description: "Optional supporting documents",
  },
  {
    id: 7,
    title: "Review & Submit",
    icon: CheckCircle,
    description: "Final review and ethics acknowledgement",
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
const Upload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    country: "",
    stateRegion: "",
    tribe: "",
    village: "",
    culturalDomain: "",
    title: "",
    description: "",
    keywords: "",
    language: "",
    culturalSignificance: "",
    recordingYear: "",
    recordingMonth: "",
    recordingDay: "",
    contentFileType: "audio",
    contentFile: null,
    consentFileType: "pdf",
    consentFile: null,
    consentType: "",
    consentNames: "",
    consentDate: "",
    permissionType: [],
    consentDuration: "",
    digitalSignature: "",
    accessTier: "",
    contentWarnings: [],
    warningOther: "",
    translationFile: null,
    backgroundInfo: "",
    verificationDoc: null,
    ethicsAgreed: false,
  });

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleFileChange = (
    field: keyof FormData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ [field]: e.target.files[0] });
    }
  };

  const toggleArrayField = (field: "permissionType" | "contentWarnings", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const validateFile = (file: File | null, fieldName: string): boolean => {
    if (!file) return true; // Optional files are valid if not provided
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: `${fieldName} exceeds 10MB limit. Current: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep = (): boolean => {
    const validators: Record<number, () => boolean> = {
      1: () => {
        if (!formData.country || !formData.stateRegion || !formData.tribe || !formData.culturalDomain || !formData.title) {
          toast({
            title: "Required Fields Missing",
            description: "Please complete all required fields in this step",
            variant: "destructive",
          });
          return false;
        }
        return true;
      },
      2: () => {
        if (!formData.description || !formData.keywords) {
          toast({
            title: "Required Fields Missing",
            description: "Description and keywords are required",
            variant: "destructive",
          });
          return false;
        }
        return true;
      },
      3: () => {
        if (!formData.contentFile) {
          toast({
            title: "Content File Required",
            description: "Please upload your cultural heritage content",
            variant: "destructive",
          });
          return false;
        }
        if (formData.contentFileType !== "image" && !formData.language) {
          toast({
            title: "Language Required",
            description: "Please specify the language used",
            variant: "destructive",
          });
          return false;
        }
        return validateFile(formData.contentFile, "Content file");
      },
      4: () => {
        if (
          !formData.consentFile ||
          !formData.consentType ||
          !formData.consentNames ||
          !formData.consentDate ||
          formData.permissionType.length === 0 ||
          !formData.consentDuration
        ) {
          toast({
            title: "Consent Information Required",
            description: "All consent fields are mandatory",
            variant: "destructive",
          });
          return false;
        }
        return validateFile(formData.consentFile, "Consent document");
      },
      5: () => {
        if (!formData.accessTier) {
          toast({
            title: "Access Tier Required",
            description: "Please select an access tier",
            variant: "destructive",
          });
          return false;
        }
        return true;
      },
      6: () => {
        // Optional step - always valid
        const validTranslation = validateFile(formData.translationFile, "Translation file");
        const validVerification = validateFile(formData.verificationDoc, "Verification document");
        return validTranslation && validVerification;
      },
    };

    return validators[currentStep]?.() ?? true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep((prev) => Math.min(7, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.ethicsAgreed) {
      toast({
        title: "Ethics Agreement Required",
        description: "Please acknowledge the ethics statement",
        variant: "destructive",
      });
      return;
    }

    // Final validation of all files
    const filesToValidate = [
      { file: formData.contentFile, name: "Content file" },
      { file: formData.consentFile, name: "Consent file" },
      { file: formData.translationFile, name: "Translation file" },
      { file: formData.verificationDoc, name: "Verification document" },
    ];

    for (const { file, name } of filesToValidate) {
      if (!validateFile(file, name)) return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Category
      formDataToSend.append("country", formData.country);
      formDataToSend.append("stateRegion", formData.stateRegion);
      formDataToSend.append("tribe", formData.tribe);
      if (formData.village) formDataToSend.append("village", formData.village);
      formDataToSend.append("culturalDomain", formData.culturalDomain);
      formDataToSend.append("title", formData.title);

      // Description
      formDataToSend.append("description", formData.description);
      formDataToSend.append("keywords", formData.keywords);
      formDataToSend.append("language", formData.language);
      if (formData.culturalSignificance) {
        formDataToSend.append("culturalSignificance", formData.culturalSignificance);
      }

      // Date of recording
      const dateOfRecording = `${formData.recordingYear}-${formData.recordingMonth}-${formData.recordingDay}`;
      if (formData.recordingYear && formData.recordingMonth && formData.recordingDay) {
        formDataToSend.append("dateOfRecording", dateOfRecording);
      }

      // Content
      formDataToSend.append("contentFileType", formData.contentFileType);
      if (formData.contentFile) {
        formDataToSend.append("contentFile", formData.contentFile);
      }

      // Consent
      formDataToSend.append("consentFileType", formData.consentFileType);
      if (formData.consentFile) {
        formDataToSend.append("consentFile", formData.consentFile);
      }
      formDataToSend.append("consentType", formData.consentType);
      formDataToSend.append("consentNames", formData.consentNames);
      formDataToSend.append("consentDate", formData.consentDate);
      formDataToSend.append("permissionType", JSON.stringify(formData.permissionType));
      formDataToSend.append("consentDuration", formData.consentDuration);
      if (formData.digitalSignature) {
        formDataToSend.append("digitalSignature", formData.digitalSignature);
      }

      // Access
      formDataToSend.append("accessTier", formData.accessTier);
      if (formData.contentWarnings.length > 0) {
        formDataToSend.append("contentWarnings", JSON.stringify(formData.contentWarnings));
      }
      if (formData.warningOther) {
        formDataToSend.append("warningOtherText", formData.warningOther);
      }

      // Additional
      if (formData.translationFile) {
        formDataToSend.append("translationFile", formData.translationFile);
      }
      if (formData.backgroundInfo) {
        formDataToSend.append("backgroundInfo", formData.backgroundInfo);
      }
      if (formData.verificationDoc) {
        formDataToSend.append("verificationDoc", formData.verificationDoc);
      }

      formDataToSend.append("ethicsAgreed", "true");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/submissions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        
        const errorHandlers: Record<number, () => void> = {
          413: () => {
            toast({
              title: "File Too Large",
              description: "One or more files exceed the 10MB limit. Please compress and retry.",
              variant: "destructive",
            });
          },
          401: () => {
            toast({
              title: "Authentication Required",
              description: "Your session expired. Please log in again.",
              variant: "destructive",
            });
            navigate("/signup?redirect=/upload");
          },
          403: () => {
            toast({
              title: "Access Denied",
              description: "You don't have permission to upload content.",
              variant: "destructive",
            });
          },
          400: () => {
            toast({
              title: "Validation Error",
              description: data?.errors?.[0]?.msg || "Please check your form",
              variant: "destructive",
            });
          },
        };

        if (errorHandlers[response.status]) {
          errorHandlers[response.status]();
        } else {
          throw new Error(data?.errors?.[0]?.msg || "Submission failed");
        }
        
        return;
      }

      toast({
        title: "Success!",
        description: "Your submission has been uploaded and is pending review",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Upload error:", error);

      if (error.message === "Failed to fetch") {
        toast({
          title: "Network Error",
          description: "Unable to connect. Check your internet connection.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // RENDER GUARDS
  // ============================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to upload cultural heritage content</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/signup?redirect=/upload")} className="w-full">
              Sign Up / Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================
  // STEP RENDERERS
  // ============================================
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">
            Country <span className="text-red-600">*</span>
          </Label>
          <Select value={formData.country} onValueChange={(v) => updateFormData({ country: v, stateRegion: "" })}>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="stateRegion">
            State / Region <span className="text-red-600">*</span>
          </Label>
          {formData.country === "India" ? (
            <Select value={formData.stateRegion} onValueChange={(v) => updateFormData({ stateRegion: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="stateRegion"
              value={formData.stateRegion}
              onChange={(e) => updateFormData({ stateRegion: e.target.value })}
              placeholder="Enter state/region"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tribe">
            Tribe / Community <span className="text-red-600">*</span>
          </Label>
          <Input
            id="tribe"
            value={formData.tribe}
            onChange={(e) => updateFormData({ tribe: e.target.value })}
            placeholder="Enter tribe/community name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="village">Village (Optional)</Label>
          <Input
            id="village"
            value={formData.village}
            onChange={(e) => updateFormData({ village: e.target.value })}
            placeholder="Enter village name"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="culturalDomain">
          Cultural Domain <span className="text-red-600">*</span>
        </Label>
        <Select value={formData.culturalDomain} onValueChange={(v) => updateFormData({ culturalDomain: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select cultural domain" />
          </SelectTrigger>
          <SelectContent>
            {CULTURAL_DOMAINS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">
          Title of Material <span className="text-red-600">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="Enter a descriptive title"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-red-600">*</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Describe the cultural significance and context..."
          rows={6}
          maxLength={1500}
        />
        <p className="text-xs text-muted-foreground text-right">
          {formData.description.length}/1500 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords">
          Keywords <span className="text-red-600">*</span>
        </Label>
        <Input
          id="keywords"
          value={formData.keywords}
          onChange={(e) => updateFormData({ keywords: e.target.value })}
          placeholder="e.g., traditional, ceremony, harvest (comma-separated)"
        />
      </div>

      <div className="space-y-2">
        <Label>Date of Recording / Creation (Optional)</Label>
        <div className="grid grid-cols-3 gap-2">
          <Select value={formData.recordingYear} onValueChange={(v) => updateFormData({ recordingYear: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formData.recordingMonth} onValueChange={(v) => updateFormData({ recordingMonth: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formData.recordingDay} onValueChange={(v) => updateFormData({ recordingDay: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0")).map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="culturalSignificance">Cultural Significance (Optional)</Label>
        <Textarea
          id="culturalSignificance"
          value={formData.culturalSignificance}
          onChange={(e) => updateFormData({ culturalSignificance: e.target.value })}
          placeholder="Explain the cultural importance and context..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>
          Content Type <span className="text-red-600">*</span>
        </Label>
        <RadioGroup
          value={formData.contentFileType}
          onValueChange={(v: ContentFileType) => updateFormData({ contentFileType: v })}
        >
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(CONTENT_TYPE_CONFIG).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <div
                  key={type}
                  className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.contentFileType === type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={type} id={type} />
                  <Label
                    htmlFor={type}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{config.label}</p>
                      <p className="text-xs text-muted-foreground">{config.formats}</p>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </div>

      {formData.contentFileType !== "image" && (
        <div className="space-y-2">
          <Label htmlFor="language">
            Language / Dialect <span className="text-red-600">*</span>
          </Label>
          <Input
            id="language"
            value={formData.language}
            onChange={(e) => updateFormData({ language: e.target.value })}
            placeholder="e.g., Māori, Hindi, Marathi"
          />
        </div>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>File Size Limit</AlertTitle>
        <AlertDescription>Maximum file size: 10MB</AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="contentFile">
          Upload Content File <span className="text-red-600">*</span>
        </Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
          <Input
            id="contentFile"
            type="file"
            onChange={(e) => handleFileChange("contentFile", e)}
            className="hidden"
            accept={CONTENT_TYPE_CONFIG[formData.contentFileType].accept}
          />
          <label htmlFor="contentFile" className="cursor-pointer">
            <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            {formData.contentFile ? (
              <div className="space-y-1">
                <p className="font-medium text-primary">{formData.contentFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(formData.contentFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  Accepted formats: {CONTENT_TYPE_CONFIG[formData.contentFileType].formats}
                </p>
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <Alert className="border-blue-500 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertTitle>Ethical Consent Required</AlertTitle>
        <AlertDescription>
          All uploads must include documented consent from relevant stakeholders
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <Label>
          Consent Document Type <span className="text-red-600">*</span>
        </Label>
        <RadioGroup
          value={formData.consentFileType}
          onValueChange={(v: ConsentFileType) => updateFormData({ consentFileType: v })}
        >
          <div className="space-y-2">
            {[
              { value: "pdf", label: "PDF (Written Consent)", icon: FileText },
              { value: "audio", label: "Audio Recording", icon: Music },
              { value: "video", label: "Video Recording", icon: Video },
            ].map(({ value, label, icon: Icon }) => (
              <div
                key={value}
                className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  formData.consentFileType === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value={value} id={`consent-${value}`} />
                <Label htmlFor={`consent-${value}`} className="flex items-center gap-2 cursor-pointer flex-1">
                  <Icon className="h-4 w-4" />
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="consentFile">
          Upload Consent Document <span className="text-red-600">*</span>
        </Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <Input
            id="consentFile"
            type="file"
            onChange={(e) => handleFileChange("consentFile", e)}
            className="hidden"
            accept={
              formData.consentFileType === "pdf"
                ? "application/pdf"
                : formData.consentFileType === "audio"
                ? "audio/*"
                : "video/*"
            }
          />
          <label htmlFor="consentFile" className="cursor-pointer">
            <FileCheck className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            {formData.consentFile ? (
              <div>
                <p className="font-medium text-primary">{formData.consentFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(formData.consentFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Click to upload consent document</p>
            )}
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="consentType">
            Consent Type <span className="text-red-600">*</span>
          </Label>
          <Select value={formData.consentType} onValueChange={(v) => updateFormData({ consentType: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select consent type" />
            </SelectTrigger>
            <SelectContent>
              {CONSENT_TYPES.map((ct) => (
                <SelectItem key={ct} value={ct}>
                  {ct}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="consentDate">
            Consent Date <span className="text-red-600">*</span>
          </Label>
          <Input
            id="consentDate"
            type="date"
            value={formData.consentDate}
            onChange={(e) => updateFormData({ consentDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="consentNames">
          Name(s) of Consenting Person(s) <span className="text-red-600">*</span>
        </Label>
        <Input
          id="consentNames"
          value={formData.consentNames}
          onChange={(e) => updateFormData({ consentNames: e.target.value })}
          placeholder="Enter full name(s)"
        />
      </div>

      <div className="space-y-3">
        <Label>
          Permission Type <span className="text-red-600">*</span>
        </Label>
        <div className="grid md:grid-cols-2 gap-3">
          {PERMISSION_TYPES.map((pt) => (
            <div key={pt} className="flex items-center space-x-2 border rounded-lg p-3">
              <Checkbox
                id={pt}
                checked={formData.permissionType.includes(pt)}
                onCheckedChange={() => toggleArrayField("permissionType", pt)}
              />
              <Label htmlFor={pt} className="cursor-pointer flex-1">
                {pt}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="consentDuration">
            Duration / Validity <span className="text-red-600">*</span>
          </Label>
          <Select value={formData.consentDuration} onValueChange={(v) => updateFormData({ consentDuration: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permanent">Permanent</SelectItem>
              <SelectItem value="temporary">Temporary (specify in notes)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="digitalSignature">Digital Signature (Optional)</Label>
          <Input
            id="digitalSignature"
            value={formData.digitalSignature}
            onChange={(e) => updateFormData({ digitalSignature: e.target.value })}
            placeholder="Enter digital signature"
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>
          Access Tier <span className="text-red-600">*</span>
        </Label>
        <RadioGroup value={formData.accessTier} onValueChange={(v) => updateFormData({ accessTier: v })}>
          <div className="space-y-3">
            {ACCESS_TIERS.map((tier) => {
              const descriptions = {
                Public: "Open for general or educational sharing",
                Restricted: "For approved researchers or verified community members only",
                "Confidential/Sacred": "Viewable only with explicit community consent",
              };
              return (
                <div
                  key={tier}
                  className={`flex items-start space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.accessTier === tier
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={tier} id={tier} className="mt-1" />
                  <Label htmlFor={tier} className="cursor-pointer flex-1">
                    <p className="font-medium mb-1">{tier}</p>
                    <p className="text-xs text-muted-foreground">{descriptions[tier as keyof typeof descriptions]}</p>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Content Warnings (Optional)</Label>
        <div className="grid md:grid-cols-2 gap-3">
          {WARNING_OPTIONS.map((wo) => (
            <div key={wo} className="flex items-center space-x-2 border rounded-lg p-3">
              <Checkbox
                id={wo}
                checked={formData.contentWarnings.includes(wo)}
                onCheckedChange={() => toggleArrayField("contentWarnings", wo)}
              />
              <Label htmlFor={wo} className="cursor-pointer flex-1">
                {wo}
              </Label>
            </div>
          ))}
        </div>

        {formData.contentWarnings.includes("Other") && (
          <Input
            placeholder="Specify other warning"
            value={formData.warningOther}
            onChange={(e) => updateFormData({ warningOther: e.target.value })}
          />
        )}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Optional Information</AlertTitle>
        <AlertDescription>
          These fields are optional but help provide additional context
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="translationFile">Translation File</Label>
        <Input
          id="translationFile"
          type="file"
          onChange={(e) => handleFileChange("translationFile", e)}
          accept=".pdf,.docx,.txt"
        />
        {formData.translationFile && (
          <p className="text-xs text-muted-foreground">Selected: {formData.translationFile.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundInfo">Background Information</Label>
        <Textarea
          id="backgroundInfo"
          value={formData.backgroundInfo}
          onChange={(e) => updateFormData({ backgroundInfo: e.target.value })}
          placeholder="Additional historical or cultural context..."
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="verificationDoc">Verification Document from Community Elders/Scholars</Label>
        <Input
          id="verificationDoc"
          type="file"
          onChange={(e) => handleFileChange("verificationDoc", e)}
          accept=".pdf,.jpg,.png"
        />
        {formData.verificationDoc && (
          <p className="text-xs text-muted-foreground">Selected: {formData.verificationDoc.name}</p>
        )}
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <Alert className="border-primary">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Review Your Submission</AlertTitle>
        <AlertDescription>
          Please review all information before final submission
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submission Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-1">Title</p>
              <p className="text-muted-foreground">{formData.title || "Not provided"}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Cultural Domain</p>
              <p className="text-muted-foreground">{formData.culturalDomain || "Not provided"}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Location</p>
              <p className="text-muted-foreground">
                {formData.tribe}, {formData.stateRegion}, {formData.country}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Content Type</p>
              <p className="text-muted-foreground">
                {CONTENT_TYPE_CONFIG[formData.contentFileType].label}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Access Tier</p>
              <Badge>{formData.accessTier || "Not set"}</Badge>
            </div>
            <div>
              <p className="font-semibold mb-1">Consent Type</p>
              <p className="text-muted-foreground">{formData.consentType || "Not provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-yellow-500 bg-yellow-50">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            By submitting this content, you acknowledge and agree to the following:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>This content is uploaded with informed consent and cultural approval</li>
            <li>All provided information is accurate and complete</li>
            <li>You understand that modifications require administrative approval</li>
            <li>The content respects cultural protocols and sensitivities</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="ethicsAgreed"
              checked={formData.ethicsAgreed}
              onCheckedChange={(checked) => updateFormData({ ethicsAgreed: checked as boolean })}
            />
            <Label htmlFor="ethicsAgreed" className="cursor-pointer text-sm leading-relaxed">
              I acknowledge that this content is uploaded with <strong>informed consent</strong> and{" "}
              <strong>cultural approval</strong>. I agree that once uploaded, it cannot be deleted or
              altered except by authorised custodians. I confirm all information provided is accurate
              and complete.
            </Label>
          </div>
        </CardContent>
      </Card>

      {!formData.ethicsAgreed && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must acknowledge the ethics statement to submit
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const stepRenderers: Record<number, () => JSX.Element> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
    5: renderStep5,
    6: renderStep6,
    7: renderStep7,
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  const progressPercentage = (currentStep / 7) * 100;
  const currentStepConfig = STEP_CONFIG[currentStep - 1];
  const StepIcon = currentStepConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Upload Cultural Heritage Content
          </h1>
          <p className="text-muted-foreground">
            Preserve and share your cultural heritage with the world
          </p>
        </div>

        {/* Progress Tracker */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Step {currentStep} of 7</span>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Current Step Info */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                  <StepIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{currentStepConfig.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentStepConfig.description}</p>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="flex items-center justify-between pt-4 border-t">
                {STEP_CONFIG.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index + 1 < currentStep;
                  const isCurrent = index + 1 === currentStep;

                  return (
                    <div key={step.id} className="flex flex-col items-center gap-1">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted
                            ? "bg-primary border-primary text-primary-foreground"
                            : isCurrent
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-muted-foreground/30 text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium hidden md:block ${
                          isCurrent ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {step.id}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">{stepRenderers[currentStep]()}</CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || submitting}
              size="lg"
            >
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentStep} of 7
            </div>

            {currentStep < 7 ? (
              <Button type="button" onClick={handleNext} disabled={submitting} size="lg">
                Next Step
              </Button>
            ) : (
              <Button type="submit" disabled={submitting || !formData.ethicsAgreed} size="lg">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Submit Upload
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;