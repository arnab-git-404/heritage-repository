

//GITHUB -api connected
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import {
  Upload as UploadIcon,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Box,
  AlertCircle,
  Loader2,
} from "lucide-react";

const Upload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  // Step 2: Category Selection
  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [tribe, setTribe] = useState("");
  const [village, setVillage] = useState("");
  const [culturalDomain, setCulturalDomain] = useState("");
  const [title, setTitle] = useState("");

  // Step 3: Content Description
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("");
  // const [dateOfRecording, setDateOfRecording] = useState("");
  const [culturalSignificance, setCulturalSignificance] = useState("");

  // Step 4: Content File
  const [contentFileType, setContentFileType] = useState<
    "audio" | "video" | "image" | "text" | "3d"
  >("audio");
  const [contentFile, setContentFile] = useState<File | null>(null);

  // Step 5 : Consent Upload Date
  const [recordingYear, setRecordingYear] = useState("");
  const [recordingMonth, setRecordingMonth] = useState("");
  const [recordingDay, setRecordingDay] = useState("");

  // Step 6: Consent Upload
  const [consentFileType, setConsentFileType] = useState<
    "pdf" | "audio" | "video"
  >("pdf");
  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [consentType, setConsentType] = useState("");
  const [consentNames, setConsentNames] = useState("");
  const [consentDate, setConsentDate] = useState("");
  const [permissionType, setPermissionType] = useState<string[]>([]);
  const [consentDuration, setConsentDuration] = useState("");
  const [digitalSignature, setDigitalSignature] = useState("");

  // Step 7: Access Classification
  const [accessTier, setAccessTier] = useState("");
  const [contentWarnings, setContentWarnings] = useState<string[]>([]);
  const [warningOther, setWarningOther] = useState("");

  // Step 8: Additional Verification
  const [translationFile, setTranslationFile] = useState<File | null>(null);
  const [backgroundInfo, setBackgroundInfo] = useState("");
  const [verificationDoc, setVerificationDoc] = useState<File | null>(null);

  // Step 9: Ethics Acknowledgement
  const [ethicsAgreed, setEthicsAgreed] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Static data
  const countries = [
    "New Zealand",
    "Australia",
    "United States of America",
    "Norway",
    "Sweden",
    "India",
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
  "Puducherry"
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

  const handleContentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContentFile(e.target.files[0]);
    }
  };

  const handleConsentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setConsentFile(e.target.files[0]);
    }
  };

  const handlePermissionToggle = (value: string) => {
    setPermissionType((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleWarningToggle = (value: string) => {
    setContentWarnings((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!country || !stateRegion || !tribe || !culturalDomain || !title) {
          toast({
            title: "Missing Required Fields",
            description: "Please fill in all required fields in Step 1.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (!description || !keywords ) {
          toast({
            title: "Missing Required Fields",
            description: "Please fill in all required fields in Step 2.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3:
        if (!contentFile || (contentFileType !== "image" && !language) ) {
          toast({
            title: "Missing Content File",
            description: "Please upload a content file.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 4:
        if (
          !consentFile ||
          !consentType ||
          !consentNames ||
          !consentDate ||
          permissionType.length === 0 ||
          !consentDuration
        ) {
          toast({
            title: "Missing Required Fields",
            description: "Please fill in all required consent fields.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 5:
        if (!accessTier) {
          toast({
            title: "Missing Access Tier",
            description: "Please select an access tier.",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const dateOfRecording = `${recordingYear}-${recordingMonth}-${recordingDay}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!ethicsAgreed) {
      toast({
        title: "Ethics Agreement Required",
        description:
          "Please acknowledge the ethics statement before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Create FormData
      const formData = new FormData();

      // Step 2: Category Selection
      formData.append("country", country);
      formData.append("stateRegion", stateRegion);
      formData.append("tribe", tribe);
      if (village) formData.append("village", village);
      formData.append("culturalDomain", culturalDomain);
      formData.append("title", title);

      // Step 3: Content Description
      formData.append("description", description);
      formData.append("keywords", keywords);
      formData.append("language", language);

      if (dateOfRecording) formData.append("dateOfRecording", dateOfRecording);
      if (culturalSignificance)
        formData.append("culturalSignificance", culturalSignificance);

      // Step 4: Content File
      formData.append("contentFileType", contentFileType);
      if (contentFile) {
        formData.append("contentFile", contentFile);
      }

      // Step 5: Consent Upload
      formData.append("consentFileType", consentFileType);
      if (consentFile) {
        formData.append("consentFile", consentFile);
      }
      formData.append("consentType", consentType);
      formData.append("consentNames", consentNames);
      formData.append("consentDate", consentDate);
      formData.append("permissionType", JSON.stringify(permissionType));
      formData.append("consentDuration", consentDuration);
      if (digitalSignature)
        formData.append("digitalSignature", digitalSignature);

      // Step 6: Access Classification
      formData.append("accessTier", accessTier);
      if (contentWarnings.length > 0) {
        formData.append("contentWarnings", JSON.stringify(contentWarnings));
      }
      if (warningOther) formData.append("warningOtherText", warningOther);

      // Step 7: Additional Verification
      if (translationFile) {
        formData.append("translationFile", translationFile);
      }
      if (backgroundInfo) formData.append("backgroundInfo", backgroundInfo);
      if (verificationDoc) {
        formData.append("verificationDoc", verificationDoc);
      }

      // Step 8: Ethics Acknowledgement
      formData.append("ethicsAgreed", "true");

      // Submit to API
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/submissions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

    // Handle specific HTTP status codes
    if (!response.ok) {
      // 413 - Payload Too Large (File too big)
      if (response.status === 413) {
        toast({
          title: "File Too Large",
          description:
            "One or more files exceed the maximum size limit (100MB per file). Please compress your files and try again.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // 401 - Unauthorized
      if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        navigate("/login?redirect=/upload");
        setSubmitting(false);
        return;
      }

      // 403 - Forbidden
      if (response.status === 403) {
        toast({
          title: "Access Denied",
          description:
            "You don't have permission to upload content. Please verify your account.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // 400 - Bad Request (Validation errors)
      if (response.status === 400) {
        const data = await response.json();
        const errorMessage =
          data?.errors?.[0]?.msg ||
          data?.message ||
          "Please check your form and try again.";
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // 415 - Unsupported Media Type
      if (response.status === 415) {
        toast({
          title: "Invalid File Type",
          description:
            "One or more files have an unsupported format. Please check file types and try again.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // 500 - Internal Server Error
      if (response.status === 500) {
        const data = await response.json();
        toast({
          title: "Server Error",
          description:
            data?.message ||
            "Something went wrong on our end. Please try again later.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // 503 - Service Unavailable
      if (response.status === 503) {
        toast({
          title: "Service Unavailable",
          description:
            "The server is temporarily unavailable. Please try again in a few minutes.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // Generic error for other status codes
      const data = await response.json();
      throw new Error(
        data?.errors?.[0]?.msg || data?.message || "Submission failed"
      );
    }

      const data = await response.json();

      toast({
        title: "Success!",
        description:
          "Your submission has been uploaded successfully and is pending review.",
        variant: "success",
      });

      // Navigate to profile to see submissions
      navigate("/profile");
    } catch (error: any) {
      console.error("Upload error:", error);

      // Network errors (no internet, CORS, etc.)
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      toast({
        title: "Network Error",
        description:
          "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // Timeout errors
    if (error.name === "AbortError") {
      toast({
        title: "Request Timeout",
        description:
          "The upload took too long. This might be due to large file sizes or slow connection. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // Generic error fallback
    toast({
      title: "Upload Failed",
      description:
        error.message ||
        "An unexpected error occurred. Please try again or contact support.",
      variant: "destructive",
    });
     

    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to upload content.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/login?redirect=/upload")}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stepTitles = [
    "Category Selection",
    "Content Description",
    "Upload Content File",
    "Consent Upload",
    "Access Classification",
    "Additional Verification",
    "Ethics Acknowledgement",
  ];

  const nextStep = () => {
    if (!validateStep()) return;
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              Upload Cultural Heritage Content
            </h1>
            <p className="mt-2 text-muted-foreground">
              Step {currentStep} of 7: {stepTitles[currentStep - 1]}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* STEP 1: Category Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select value={country} onValueChange={setCountry}>
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

                    {/* <div className="grid gap-2">
                      <Label htmlFor="stateRegion">State / Region *</Label>
                      <Input
                        id="stateRegion"
                        value={stateRegion}
                        onChange={(e) => setStateRegion(e.target.value)}
                        placeholder="Enter state or region"
                      />
                    </div> */}

  <div className="space-y-2">
                    <Label htmlFor="stateRegion">State / Region *</Label>
                    {country === "India" ? (
                      <Select value={stateRegion} onValueChange={setStateRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {indianStates.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="stateRegion"
                        value={stateRegion}
                        onChange={(e) => setStateRegion(e.target.value)}
                        placeholder="Enter your state/region"
                        required
                      />
                    )}
                  </div>

                    <div className="grid gap-2">
                      <Label htmlFor="tribe">Tribe *</Label>
                      <Input
                        id="tribe"
                        value={tribe}
                        onChange={(e) => setTribe(e.target.value)}
                        placeholder="Enter tribe name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="village">Village</Label>
                      <Input
                        id="village"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="Enter village name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="culturalDomain">Cultural Domain *</Label>
                      <Select
                        value={culturalDomain}
                        onValueChange={setCulturalDomain}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cultural domain" />
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

                    <div className="grid gap-2">
                      <Label htmlFor="title">Title of the Material *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a descriptive title"
                      />
                    </div>
                  </div>
                )}

{/* {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Category Selection</CardTitle>
                <CardDescription>Provide location and cultural details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select 
                      value={country} 
                      onValueChange={(v) => {
                        setCountry(v);
                        setStateRegion(""); // Reset state when country changes
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stateRegion">State / Region *</Label>
                    {country === "India" ? (
                      <Select value={stateRegion} onValueChange={setStateRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {indianStates.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="stateRegion"
                        value={stateRegion}
                        onChange={(e) => setStateRegion(e.target.value)}
                        placeholder="Enter state/region"
                        required
                      />
                    )}
                  </div>

                  <div className="grid gap-2">
                      <Label htmlFor="tribe">Tribe *</Label>
                      <Input
                        id="tribe"
                        value={tribe}
                        onChange={(e) => setTribe(e.target.value)}
                        placeholder="Enter tribe name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="village">Village</Label>
                      <Input
                        id="village"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="Enter village name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="culturalDomain">Cultural Domain *</Label>
                      <Select
                        value={culturalDomain}
                        onValueChange={setCulturalDomain}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cultural domain" />
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

                    <div className="grid gap-2">
                      <Label htmlFor="title">Title of the Material *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a descriptive title"
                      />
                    </div>
                  </div>
              </CardContent>
            </Card>
          )} */}

                {/* STEP 2: Content Description */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="description">
                        Short Description (max 250 words) *
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what this material is about..."
                        rows={5}
                        maxLength={1500}
                      />
                      <p className="text-xs text-muted-foreground">
                        {description.length}/1500 characters
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="keywords">
                        Keywords (comma-separated) *
                      </Label>
                      <Input
                        id="keywords"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g., traditional, ceremony, harvest"
                      />
                    </div>

                    {/* <div className="grid gap-2">
                      <Label htmlFor="language">
                        Language / Dialect Used *
                      </Label>
                      <Input
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        placeholder="e.g., Māori, Hindi"
                      />
                    </div> */}

                    {/* <div className="grid gap-2">
                      <Label htmlFor="dateOfRecording">Date of Recording / Creation</Label>
                      <Input 
                        id="dateOfRecording" 
                        type="date"
                        value={dateOfRecording} 
                        onChange={(e) => setDateOfRecording(e.target.value)} 
                      />
                    </div> */}

                    <div className="grid gap-2">
                      <Label htmlFor="dateOfRecording">
                        Date of Recording / Creation
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          value={recordingYear}
                          onValueChange={setRecordingYear}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              { length: 100 },
                              (_, i) => new Date().getFullYear() - i
                            ).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={recordingMonth}
                          onValueChange={setRecordingMonth}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "01",
                              "02",
                              "03",
                              "04",
                              "05",
                              "06",
                              "07",
                              "08",
                              "09",
                              "10",
                              "11",
                              "12",
                            ].map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={recordingDay}
                          onValueChange={setRecordingDay}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) =>
                              (i + 1).toString().padStart(2, "0")
                            ).map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="culturalSignificance">
                        Cultural Significance Note (Optional)
                      </Label>
                      <Textarea
                        id="culturalSignificance"
                        value={culturalSignificance}
                        onChange={(e) =>
                          setCulturalSignificance(e.target.value)
                        }
                        placeholder="Explain the cultural importance of this material..."
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Upload Content File */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Choose File Type *</Label>
                      <RadioGroup
                        value={contentFileType}
                        onValueChange={(v: any) => setContentFileType(v)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="audio" id="audio" />
                          <Label
                            htmlFor="audio"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Music className="h-4 w-4" /> Audio (.mp3, .wav)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="video" id="video" />
                          <Label
                            htmlFor="video"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Video className="h-4 w-4" /> Video (.mp4, .mov)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="image" id="image" />
                          <Label
                            htmlFor="image"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <ImageIcon className="h-4 w-4" /> Image (.jpg, .png)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="text" id="text" />
                          <Label
                            htmlFor="text"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <FileText className="h-4 w-4" /> Text (.pdf, .docx)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3d" id="3d" />
                          <Label
                            htmlFor="3d"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Box className="h-4 w-4" /> 3D Model (.obj, .glb)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {contentFileType !== "image" && (
                      <div className="grid gap-2">
                        <Label htmlFor="language">
                          Language / Dialect Used *
                        </Label>
                        <Input
                          id="language"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          placeholder="e.g., Māori, Hindi"
                        />
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label htmlFor="contentFile">Upload File *</Label>
                      <Label className="text-red-700">Supported Max File Size: 10MB</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <Input
                          id="contentFile"
                          type="file"
                          onChange={handleContentFileChange}
                          className="hidden"
                          accept={
                            contentFileType === "audio"
                              ? "audio/mp3,audio/wav"
                              : contentFileType === "video"
                              ? "video/mp4,video/quicktime"
                              : contentFileType === "image"
                              ? "image/jpeg,image/png"
                              : contentFileType === "text"
                              ? "application/pdf,.docx"
                              : ".obj,.glb"
                          }
                        />
                        <label htmlFor="contentFile" className="cursor-pointer">
                          <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {contentFile
                              ? contentFile.name
                              : "Click to upload or drag and drop"}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Consent Upload */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Ethical consent is required for all uploads. Please
                        provide documentation.
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-2">
                      <Label>Consent File Type *</Label>
                      <RadioGroup
                        value={consentFileType}
                        onValueChange={(v: any) => setConsentFileType(v)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pdf" id="pdf" />
                          <Label htmlFor="pdf" className="cursor-pointer">
                            PDF (Written)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="audio" id="consent-audio" />
                          <Label
                            htmlFor="consent-audio"
                            className="cursor-pointer"
                          >
                            Audio Recording
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="video" id="consent-video" />
                          <Label
                            htmlFor="consent-video"
                            className="cursor-pointer"
                          >
                            Video Recording
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="consentFile">Upload Consent File *</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <Input
                          id="consentFile"
                          type="file"
                          onChange={handleConsentFileChange}
                          className="hidden"
                          accept={
                            consentFileType === "pdf"
                              ? "application/pdf"
                              : consentFileType === "audio"
                              ? "audio/*"
                              : "video/*"
                          }
                        />
                        <label htmlFor="consentFile" className="cursor-pointer">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {consentFile
                              ? consentFile.name
                              : "Click to upload consent document"}
                          </p>
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="consentType">Consent Type *</Label>
                      <Select
                        value={consentType}
                        onValueChange={setConsentType}
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

                    <div className="grid gap-2">
                      <Label htmlFor="consentNames">
                        Name(s) of Consenting Person(s) *
                      </Label>
                      <Input
                        id="consentNames"
                        value={consentNames}
                        onChange={(e) => setConsentNames(e.target.value)}
                        placeholder="Enter names"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="consentDate">Date of Consent *</Label>
                      <Input
                        id="consentDate"
                        type="date"
                        value={consentDate}
                        onChange={(e) => setConsentDate(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Type of Permission *</Label>
                      <div className="space-y-2">
                        {permissionTypes.map((pt) => (
                          <div key={pt} className="flex items-center space-x-2">
                            <Checkbox
                              id={pt}
                              checked={permissionType.includes(pt)}
                              onCheckedChange={() => handlePermissionToggle(pt)}
                            />
                            <Label htmlFor={pt} className="cursor-pointer">
                              {pt}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="consentDuration">
                        Duration / Validity *
                      </Label>
                      <Select
                        value={consentDuration}
                        onValueChange={setConsentDuration}
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

                    <div className="grid gap-2">
                      <Label htmlFor="digitalSignature">
                        Digital Signature (Optional)
                      </Label>
                      <Input
                        id="digitalSignature"
                        value={digitalSignature}
                        onChange={(e) => setDigitalSignature(e.target.value)}
                        placeholder="Enter signature or leave blank"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 5: Access Classification */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="accessTier">Access Tier *</Label>
                      <Select value={accessTier} onValueChange={setAccessTier}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                        <SelectContent>
                          {accessTiers.map((at) => (
                            <SelectItem key={at} value={at}>
                              {at}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {accessTier === "Public" &&
                          "Open for general or educational sharing"}
                        {accessTier === "Restricted" &&
                          "For approved researchers or verified community members only"}
                        {accessTier === "Confidential/Sacred" &&
                          "Viewable only with explicit community consent"}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label>Content Warnings (Optional)</Label>
                      <div className="space-y-2">
                        {warningOptions.map((wo) => (
                          <div key={wo} className="flex items-center space-x-2">
                            <Checkbox
                              id={wo}
                              checked={contentWarnings.includes(wo)}
                              onCheckedChange={() => handleWarningToggle(wo)}
                            />
                            <Label htmlFor={wo} className="cursor-pointer">
                              {wo}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {contentWarnings.includes("Other") && (
                        <Input
                          placeholder="Specify other warning"
                          value={warningOther}
                          onChange={(e) => setWarningOther(e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 6: Additional Verification */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      All fields in this step are optional but recommended.
                    </p>

                    <div className="grid gap-2">
                      <Label htmlFor="translationFile">Translation File</Label>
                      <Input
                        id="translationFile"
                        type="file"
                        onChange={(e) =>
                          e.target.files &&
                          setTranslationFile(e.target.files[0])
                        }
                        accept=".pdf,.docx,.txt"
                      />
                      {translationFile && (
                        <p className="text-xs text-muted-foreground">
                          Selected: {translationFile.name}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="backgroundInfo">
                        Background Information
                      </Label>
                      <Textarea
                        id="backgroundInfo"
                        value={backgroundInfo}
                        onChange={(e) => setBackgroundInfo(e.target.value)}
                        placeholder="Additional context about the material..."
                        rows={4}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="verificationDoc">
                        Verification Document from Community Elders/Scholars
                      </Label>
                      <Input
                        id="verificationDoc"
                        type="file"
                        onChange={(e) =>
                          e.target.files &&
                          setVerificationDoc(e.target.files[0])
                        }
                        accept=".pdf,.jpg,.png"
                      />
                      {verificationDoc && (
                        <p className="text-xs text-muted-foreground">
                          Selected: {verificationDoc.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 7: Ethics Acknowledgement */}
                {currentStep === 7 && (
                  <div className="space-y-4">
                    <Alert className="border-primary">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Important:</strong> Before submitting, please
                        review and acknowledge the following ethics statement.
                      </AlertDescription>
                    </Alert>

                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="ethicsAgreed"
                            checked={ethicsAgreed}
                            onCheckedChange={(checked) =>
                              setEthicsAgreed(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="ethicsAgreed"
                            className="cursor-pointer text-sm leading-relaxed"
                          >
                            I acknowledge that this content is uploaded with{" "}
                            <strong>informed consent</strong> and{" "}
                            <strong>cultural approval</strong>. I agree that
                            once uploaded, it cannot be deleted or altered
                            except by authorised custodians.
                          </Label>
                        </div>
                      </CardContent>
                    </Card>

                    {!ethicsAgreed && (
                      <p className="text-sm text-red-600">
                        ⚠️ You must acknowledge the ethics statement to proceed
                        with submission.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || submitting}
              >
                Previous
              </Button>

              {currentStep < 7 ? (
                <Button type="button" onClick={nextStep} disabled={submitting}>
                  Next Step
                </Button>
              ) : (
                <Button type="submit" disabled={submitting || !ethicsAgreed}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Upload"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
