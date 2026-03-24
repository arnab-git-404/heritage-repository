import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CardDescription, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Eye,
  Download,
  FileText,
  Music,
  Video,
  Image as ImageIcon,
  X,
  RefreshCw,
} from "lucide-react";

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

const countries = [
  "New Zealand",
  "Australia",
  "United States of America",
  "Norway",
  "Sweden",
  "India",
];

const accessTiers = ["Public", "Restricted", "Confidential/Sacred"];

interface ApprovedContent {
  _id: string;
  submissionId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
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
  views: number;
  downloads: number;
  approvedAt: string;
  createdAt: string;
}

interface CachedData {
  items: ApprovedContent[];
  timestamp: number;
  filters: {
    tribe: string;
    culturalDomain: string;
    country: string;
    stateRegion: string;
    village: string;
    accessTier: string;
    q: string;
    sort: string;
  };
}

const CACHE_KEY = 'approved_content_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds


const getCacheKey = (filters: any) => {
  return `${CACHE_KEY}_${JSON.stringify(filters)}`;
};

const getFromCache = (filters: any): ApprovedContent[] | null => {
  try {
    const cacheKey = getCacheKey(filters);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const data: CachedData = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    // Verify filters match
    if (JSON.stringify(data.filters) !== JSON.stringify(filters)) {
      return null;
    }
    
    return data.items;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

const saveToCache = (items: ApprovedContent[], filters: any) => {
  try {
    const cacheKey = getCacheKey(filters);
    const data: CachedData = {
      items,
      timestamp: Date.now(),
      filters,
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(data));
    
    // Clean old cache entries (keep only last 10)
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY));
    if (allKeys.length > 10) {
      allKeys.slice(0, allKeys.length - 10).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.error('Cache write error:', error);
    // If localStorage is full, clear old caches
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearOldCaches();
    }
  }
};

const clearOldCaches = () => {
  const allKeys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY));
  allKeys.forEach(key => localStorage.removeItem(key));
};



const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<ApprovedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<ApprovedContent | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openItem, setOpenItem] = useState<ApprovedContent | null>(null);
  const [openConsentId, setOpenConsentId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const q = searchParams.get("q") || "";
  const tribe = searchParams.get("tribe") || "";
  const culturalDomain = searchParams.get("domain") || "";
  const sort = (searchParams.get("sort") || "latest") as
    | "latest"
    | "oldest"
    | "views";
  const country = searchParams.get("country") || "";
  const stateRegion = searchParams.get("state") || "";
  const village = searchParams.get("village") || "";
  const accessTier = searchParams.get("access") || "";

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const changeParam = (key: string, value: string) => {
    if (value === "__all__") value = "";

    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    if (key === "country") {
      next.delete("state");
      next.delete("tribe");
      next.delete("village");
    }
    if (key === "state") {
      next.delete("tribe");
      next.delete("village");
    }
    if (key === "tribe") {
      next.delete("village");
    }
    setSearchParams(next, { replace: true });
  };

  // Fetch approved content WITHOUT caching
  // useEffect(() => {
  //   let active = true;
  //   (async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);

  //       const qs = new URLSearchParams();
  //       if (tribe) qs.set("tribe", tribe);
  //       if (culturalDomain) qs.set("culturalDomain", culturalDomain);
  //       if (country) qs.set("country", country);
  //       if (stateRegion) qs.set("state", stateRegion);
  //       if (village) qs.set("village", village);
  //       if (accessTier) qs.set("accessTier", accessTier);
  //       if (q) qs.set("q", q);
  //       if (sort) qs.set("sort", sort);

  //       const res = await fetch(`${API_URL}/api/approved?${qs.toString()}`);
  //       const data = await res.json();

  //       if (!res.ok) {
  //         throw new Error(data?.errors?.[0]?.msg || "Failed to load content");
  //       }

  //       if (active) {
  //         setItems(Array.isArray(data) ? data : []);
  //       }
  //     } catch (e: any) {
  //       if (active) {
  //         console.error("Fetch error:", e);
  //         setError(e.message || "Failed to load content");
  //       }
  //     } finally {
  //       if (active) setLoading(false);
  //     }
  //   })();
  //   return () => {
  //     active = false;
  //   };
  // }, [
  //   tribe,
  //   culturalDomain,
  //   country,
  //   stateRegion,
  //   village,
  //   accessTier,
  //   q,
  //   sort,
  // ]);



  // Fetch approved content WITH caching
useEffect(() => {
  let active = true;
  
  const filters = {
    tribe,
    culturalDomain,
    country,
    stateRegion,
    village,
    accessTier,
    q,
    sort,
  };
  
  (async () => {
    try {
      // ✅ STEP 1: Try to get from cache first
      const cached = getFromCache(filters);
      
      if (cached && active) {
        console.log('📦 Using cached data');
        setItems(cached);
        setLoading(false);
        return;
      }
      
      // ✅ STEP 2: If no cache, fetch from API
      console.log('🌐 Fetching fresh data');
      setLoading(true);
      setError(null);

      const qs = new URLSearchParams();
      if (tribe) qs.set("tribe", tribe);
      if (culturalDomain) qs.set("culturalDomain", culturalDomain);
      if (country) qs.set("country", country);
      if (stateRegion) qs.set("state", stateRegion);
      if (village) qs.set("village", village);
      if (accessTier) qs.set("accessTier", accessTier);
      if (q) qs.set("q", q);
      if (sort) qs.set("sort", sort);

      const res = await fetch(`${API_URL}/api/approved?${qs.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.errors?.[0]?.msg || "Failed to load content");
      }

      const items = Array.isArray(data) ? data : [];
      
      if (active) {
        setItems(items);
        // ✅ STEP 3: Save to cache
        saveToCache(items, filters);
      }
    } catch (e: any) {
      if (active) {
        console.error("Fetch error:", e);
        setError(e.message || "Failed to load content");
      }
    } finally {
      if (active) {
        setRefreshing(false);
        setLoading(false);
      }
    }
  })();
  
  return () => {
    active = false;
  };
}, [
  tribe,
  culturalDomain,
  country,
  stateRegion,
  village,
  accessTier,
  q,
  sort,
  refreshing,
]);


  const filtered = useMemo(() => {
    return items;
  }, [items]);

  const fmtAgo = (iso?: string) => {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const handleCardClick = (item: ApprovedContent) => {
    const level = item.accessTier.toLowerCase();

    if (level === "restricted" || level === "confidential/sacred") {
      setPendingItem(item);
      setDisclaimerOpen(true);
      return;
    }

    setOpenItem(item);
    setPreviewOpen(true);
  };

  const handleView = async (item: ApprovedContent) => {
    // Track view
    try {
      await fetch(`${API_URL}/api/approved/${item._id}/view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to track view:", error);
    }
  };

  const handleDownload = async (item: ApprovedContent) => {
    // Track download
    try {
      await fetch(`${API_URL}/api/approved/${item._id}/download`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to track download:", error);
    }
  };

  const renderFileIcon = (fileType: string) => {
    switch (fileType) {
      case "audio":
        return <Music className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "text":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const renderThumbnail = (item: ApprovedContent) => {
    const thumbIsPdf =
      item.contentFileType === "text" && /\.pdf(\?|$)/i.test(item.contentUrl);

    if (item.contentFileType === "video") {
      return (
        <video
          src={item.contentUrl}
          className="w-full h-full object-cover"
          muted
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
      );
    }

    if (item.contentFileType === "audio") {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
          <Music className="h-16 w-16 text-purple-600" />
        </div>
      );
    }

    if (item.contentFileType === "image") {
      return (
        <img
          src={item.contentUrl}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
          }}
        />
      );
    }

    if (thumbIsPdf) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
          <FileText className="h-16 w-16 text-blue-600" />
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <FileText className="h-16 w-16 text-gray-600" />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans leading-relaxed">
      <div className="flex-1 py-6 md:py-8 px-4">
        <div className=" mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              Explore Cultural Heritage
            </h1>
            <p className="mt-2 text-muted-foreground">
              Discover approved cultural content from indigenous communities
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  value={q}
                  onChange={(e) => changeParam("q", e.target.value)}
                  placeholder="Search by title, keyword, or tribe..."
                  aria-label="Search"
                  className="w-full"
                />
              </div>
              <Select
                value={sort}
                onValueChange={(v) => changeParam("sort", v)}
              >
                <SelectTrigger
                  aria-label="Sort by"
                  className="w-full md:w-[180px]"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <Select
                value={country}
                onValueChange={(v) => changeParam("country", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Countries</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={stateRegion}
                onChange={(e) => changeParam("state", e.target.value)}
                placeholder="State/Region"
                disabled={!country}
              />

              <Input
                value={tribe}
                onChange={(e) => changeParam("tribe", e.target.value)}
                placeholder="Tribe"
                disabled={!country}
              />

              <Input
                value={village}
                onChange={(e) => changeParam("village", e.target.value)}
                placeholder="Village"
                disabled={!country}
              />

              <Select
                value={culturalDomain}
                onValueChange={(v) => changeParam("domain", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Domains</SelectItem>
                  {culturalDomains.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={accessTier}
                onValueChange={(v) => changeParam("access", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Access Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Levels</SelectItem>
                  {accessTiers.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center">
              <Button
    variant="ghost"
    size="sm"
    onClick={() => {
      clearOldCaches();
      // window.location.reload();
      setRefreshing(true);

    }}
  >
  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />

    🔄 Refresh Data
  </Button>

              <Button
                variant="outline"
                onClick={() => setSearchParams({}, { replace: true })}
                size="sm"
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Content Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading content...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No approved content found matching your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleCardClick(item)}
                  className="group w-full text-left rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48  overflow-hidden">
                    {renderThumbnail(item)}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <div className="flex items-center gap-2 text-white">
                        {renderFileIcon(item.contentFileType)}
                        <span className="text-sm font-medium">
                          {item.contentFileType}
                        </span>
                      </div>
                    </div>

                    {/* Access Tier Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={
                          item.accessTier === "Public"
                            ? "default"
                            : item.accessTier === "Restricted"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {item.accessTier}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <CardTitle className="text-lg font-heading line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2 text-sm">
                        {item.description}
                      </CardDescription>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <Badge variant="outline">{item.tribe}</Badge>
                      <Badge variant="secondary">{item.culturalDomain}</Badge>
                      {item.village && (
                        <Badge variant="outline">{item.village}</Badge>
                      )}
                    </div>

                    {/* Keywords */}
                    {item.keywords && item.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.keywords.slice(0, 3).map((keyword, idx) => (
                          // <span
                          //   key={idx}
                          //   className="text-xs px-2 py-0.5 rounded"
                          // >
                          //   {keyword}
                          // </span>

                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                        {item.keywords.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{item.keywords.length - 3} more
                          </span>
                        )}

                        <Button
                          variant="outline"
                          className="border-2 rounded-2xl"
                          size="sm"
                          onClick={() =>
                            setOpenConsentId(
                              openConsentId === item._id ? null : item._id
                            )
                          }
                        >
                          {openConsentId === item._id ? (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Hide Consent
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              View Consent
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Stats & Date */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {item.downloads || 0}
                        </span>
                      </div>
                      <span>{fmtAgo(item.approvedAt)}</span>
                    </div>

                    {/* Content Warnings */}
                    {item.contentWarnings &&
                      item.contentWarnings.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.contentWarnings.map((warning, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs text-orange-600 border-orange-600"
                            >
                              ⚠️ {warning}
                            </Badge>
                          ))}
                        </div>
                      )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer Dialog */}
      <AlertDialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Cultural Sensitivity Notice</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This content has been classified as{" "}
                <strong>{pendingItem?.accessTier}</strong>.
              </p>
              <p>
                It may include sacred or sensitive cultural material. Please
                view with respect and do not reproduce or redistribute without
                proper consent.
              </p>
              {pendingItem?.contentWarnings &&
                pendingItem.contentWarnings.length > 0 && (
                  <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950 rounded">
                    <p className="font-semibold text-sm mb-1">
                      Content Warnings:
                    </p>
                    <ul className="list-disc list-inside text-sm">
                      {pendingItem.contentWarnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingItem(null)}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingItem) {
                  setOpenItem(pendingItem);
                  setPreviewOpen(true);
                  handleView(pendingItem);
                }
                setPendingItem(null);
              }}
            >
              I Understand, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Modal */}
      <AlertDialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-x-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              {openItem?.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {openItem?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpenConsentId(null),
                  setPreviewOpen(false),
                  handleView(openItem);
              }}
            >
              Close
            </AlertDialogCancel>
            {openItem?.contentUrl && (
              <a
                href={openItem.contentUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => openItem && handleDownload(openItem)}
                className="inline-flex items-center justify-center h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            )}
          </AlertDialogFooter>

          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden border">
              {openItem?.contentFileType === "video" && (
                <video
                  src={openItem.contentUrl}
                  controls
                  className="w-full max-h-[500px]"
                />
              )}
              {openItem?.contentFileType === "audio" && (
                <div className="p-8 border flex items-center justify-center">
                  <audio
                    src={openItem.contentUrl}
                    controls
                    className="w-full max-w-md"
                  />
                </div>
              )}
              {openItem?.contentFileType === "image" && (
                <img
                  src={openItem.contentUrl}
                  alt={openItem.title}
                  className="w-full max-h-[500px] object-contain"
                />
              )}
              {/* {openItem?.contentFileType === 'text' && /\.pdf(\?|$)/i.test(openItem?.contentUrl || '') && (
                <iframe 
                  src={openItem.contentUrl} 
                  title="PDF preview" 
                  className="w-full h-[500px] border-0"
                />
              )} */}

              {/* ✅ UPDATED: Better PDF handling */}
              {openItem?.contentFileType === "text" && (
                <div className="space-y-4">
                  <iframe
                    src={`${openItem.contentUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                    title="PDF preview"
                    className="w-full h-[600px] border-0 bg-gray-50"
                    loading="lazy"
                  />
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(openItem.contentUrl, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold">Country:</span>
                <p className="text-muted-foreground">{openItem?.country}</p>
              </div>
              <div>
                <span className="font-semibold">Region:</span>
                <p className="text-muted-foreground">{openItem?.stateRegion}</p>
              </div>
              <div>
                <span className="font-semibold">Tribe:</span>
                <p className="text-muted-foreground">{openItem?.tribe}</p>
              </div>
              {openItem?.village && (
                <div>
                  <span className="font-semibold">Village:</span>
                  <p className="text-muted-foreground">{openItem.village}</p>
                </div>
              )}
              <div>
                <span className="font-semibold">Domain:</span>
                <p className="text-muted-foreground">
                  {openItem?.culturalDomain}
                </p>
              </div>
              <div>
                <span className="font-semibold">Language:</span>
                <p className="text-muted-foreground">{openItem?.language}</p>
              </div>
              <div>
                <span className="font-semibold">Access:</span>
                <p className="text-muted-foreground">{openItem?.accessTier}</p>
              </div>
              {openItem?.dateOfRecording && (
                <div>
                  <span className="font-semibold">Recorded:</span>
                  <p className="text-muted-foreground">
                    {new Date(openItem.dateOfRecording).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Cultural Significance */}
            {openItem?.culturalSignificance && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Cultural Significance</h4>
                <p className="text-sm text-muted-foreground">
                  {openItem.culturalSignificance}
                </p>
              </div>
            )}

            {/* Background Info */}
            {openItem?.backgroundInfo && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Background Information</h4>
                <p className="text-sm text-muted-foreground">
                  {openItem.backgroundInfo}
                </p>
              </div>
            )}

            {/* 🎯 ADD CONSENT SECTION HERE */}
            {openItem?.consent && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-base">
                    Consent Information
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setOpenConsentId(
                        openConsentId === openItem._id ? null : openItem._id
                      )
                    }
                  >
                    {openConsentId === openItem._id ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Hide Consent
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        View Consent
                      </>
                    )}
                  </Button>
                </div>

                {openConsentId === openItem._id && (
                  <div className="border rounded-lg p-3 sm:p-4 bg-blue-50 dark:bg-blue-950 space-y-3">
                    {/* Consent File Preview */}
                    <div className="rounded-lg overflow-hidden border bg-white">
                      {openItem.consent.fileType === "pdf" && (
                        <div className="space-y-2">
                          <iframe
                            src={`${openItem.consent.fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                            title="Consent Document"
                            className="w-full h-[300px] sm:h-[400px] border-0"
                            loading="lazy"
                          />
                          <div className="flex justify-center p-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(openItem.consent.fileUrl, "_blank")
                              }
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Open in New Tab
                            </Button>
                          </div>
                        </div>
                      )}
                      {openItem.consent.fileType === "audio" && (
                        <div className="p-4 sm:p-6 flex items-center justify-center">
                          <audio
                            src={openItem.consent.fileUrl}
                            controls
                            className="w-full max-w-md"
                          />
                        </div>
                      )}
                      {openItem.consent.fileType === "video" && (
                        <video
                          src={openItem.consent.fileUrl}
                          controls
                          className="w-full max-h-[400px]"
                        />
                      )}
                    </div>

                    {/* Consent Details - Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="p-2 sm:p-3 bg-white dark:bg-gray-900 rounded">
                        <span className="font-semibold text-blue-900 dark:text-blue-300">
                          Type:
                        </span>
                        <p className="text-muted-foreground mt-1">
                          {openItem.consent.consentType}
                        </p>
                      </div>
                      <div className="p-2 sm:p-3 bg-white dark:bg-gray-900 rounded">
                        <span className="font-semibold text-blue-900 dark:text-blue-300">
                          Consenting Person(s):
                        </span>
                        <p className="text-muted-foreground mt-1">
                          {openItem.consent.consentNames}
                        </p>
                      </div>
                      <div className="p-2 sm:p-3 bg-white dark:bg-gray-900 rounded">
                        <span className="font-semibold text-blue-900 dark:text-blue-300">
                          Date:
                        </span>
                        <p className="text-muted-foreground mt-1">
                          {new Date(
                            openItem.consent.consentDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-2 sm:p-3 bg-white dark:bg-gray-900 rounded">
                        <span className="font-semibold text-blue-900 dark:text-blue-300">
                          Duration:
                        </span>
                        <p className="text-muted-foreground mt-1 capitalize">
                          {openItem.consent.duration}
                        </p>
                      </div>
                      <div className="p-2 sm:p-3 bg-white dark:bg-gray-900 rounded col-span-1 sm:col-span-2">
                        <span className="font-semibold text-blue-900 dark:text-blue-300">
                          Permissions:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {openItem.consent.permissionType.map((perm, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-[10px] sm:text-xs"
                            >
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {openItem.consent.digitalSignature && (
                        <div className="p-2 sm:p-3 bg-white dark:bg-gray-900 rounded col-span-1 sm:col-span-2">
                          <span className="font-semibold text-blue-900 dark:text-blue-300">
                            Digital Signature:
                          </span>
                          <p className="text-muted-foreground mt-1 break-all">
                            {openItem.consent.digitalSignature}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional Files */}
            {(openItem?.translationFileUrl || openItem?.verificationDocUrl) && (
              <div className="space-y-2">
                <h4 className="font-semibold">Additional Documents</h4>
                <div className="flex gap-2">
                  {openItem.translationFileUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(openItem.translationFileUrl, "_blank")
                      }
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Translation
                    </Button>
                  )}
                  {openItem.verificationDocUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(openItem.verificationDocUrl, "_blank")
                      }
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Verification
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPreviewOpen(false)}>
              Close
            </AlertDialogCancel>
            {openItem?.contentUrl && (
              <a 
                href={openItem.contentUrl} 
                target="_blank" 
                rel="noreferrer"
                onClick={() => openItem && handleDownload(openItem)}
                className="inline-flex items-center justify-center h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            )}
          </AlertDialogFooter> */}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Explore;
