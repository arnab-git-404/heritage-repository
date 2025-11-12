// import { useEffect, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";

// import Footer from "@/components/Footer";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/components/ui/use-toast";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";

// const Upload = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const { token, isAuthenticated } = useAuth();
//   const [title, setTitle] = useState("");
//   const [textContent, setTextContent] = useState("");
//   const [type, setType] = useState<'text' | 'audio' | 'video' | 'image'>('text');
//   const [contentUrl, setContentUrl] = useState("");
//   const [contentFile, setContentFile] = useState<File | null>(null);
//   const [category, setCategory] = useState<string>("");
//   const [submitting, setSubmitting] = useState(false);
//   const [tribe, setTribe] = useState<string>("");
//   const [country, setCountry] = useState<string>("");
//   const [stateRegion, setStateRegion] = useState<string>("");
//   const [village, setVillage] = useState<string>("");
//   const [consentGiven, setConsentGiven] = useState(false);
//   const [consentName, setConsentName] = useState("");
//   const [consentFile, setConsentFile] = useState<File | null>(null);
//   // Content warnings 'Other'
//   const [warningOther, setWarningOther] = useState(false);
//   const [warningOtherText, setWarningOtherText] = useState("");
//   const [tribeOptions, setTribeOptions] = useState<string[]>([]);
//   const [tribesLoading, setTribesLoading] = useState(false);
//   const [villageOptions, setVillageOptions] = useState<string[]>([]);
//   const [villagesLoading, setVillagesLoading] = useState(false);
//   const [preloadedTribes, setPreloadedTribes] = useState<string[]>([]);
//   const [preloadedVillages, setPreloadedVillages] = useState<string[]>([]);

//   const categories = [
//     "Folktales",
//     "Folksongs",
//     "Folk Dances",
//     "Material Culture",
//     "Ritual Practices"
//   ];

//   const countries = [
//     "New Zealand",
//     "Australia",
//     "United States of America",
//     "Norway",
//     "Sweden",
//     "India",
//   ];

//   const regionsByCountry: Record<string, string[]> = {
//     "New Zealand": ["Auckland","Wellington","Canterbury","Otago","Waikato","Bay of Plenty","Northland","Southland","Hawke’s Bay","Manawatu-Wanganui","Taranaki","Gisborne","Marlborough","Nelson","West Coast"],
//     "Australia": ["New South Wales (NSW)","Victoria (VIC)","Queensland (QLD)","Western Australia (WA)","South Australia (SA)","Tasmania (TAS)","Australian Capital Territory (ACT)","Northern Territory (NT)"],
//     "United States of America": ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
//     "Norway": ["Oslo","Viken","Innlandet","Vestfold og Telemark","Agder","Rogaland","Vestland","Møre og Romsdal","Trøndelag","Nordland","Troms og Finnmark"],
//     "Sweden": ["Stockholm County","Västra Götaland County","Skåne County","Uppsala County","Södermanland County","Östergötland County","Jönköping County","Kronoberg County","Kalmar County","Gotland County","Blekinge County","Halland County","Värmland County","Örebro County","Västmanland County","Dalarna County","Gävleborg County","Västernorrland County","Jämtland County","Västerbotten County","Norrbotten County"],
//     "India": ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh","Puducherry","Lakshadweep","Andaman and Nicobar Islands","Dadra and Nagar Haveli and Daman and Diu","Ladakh","Jammu & Kashmir"],
//   };

//   // Fetch tribes when country/state change (same behavior as Explore page)
//   useEffect(() => {
//     let active = true;
//     (async () => {
//       setTribesLoading(true);
//       try {
//         if (!country || !stateRegion) {
//           if (active) setTribeOptions([]);
//           return;
//         }
//         const qs = new URLSearchParams();
//         qs.set("country", country);
//         qs.set("state", stateRegion);
//         const res = await fetch(`/api/submissions/tribes?${qs.toString()}`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to load tribes");
//         if (active) setTribeOptions(Array.isArray(data) ? data : []);
//       } catch (_e) {
//         if (active) setTribeOptions([]);
//       } finally {
//         if (active) setTribesLoading(false);
//       }
//     })();
//     return () => { active = false; };
//   }, [country, stateRegion]);

//   // Fetch villages when tribe/country/state change for typeahead with fallback
//   useEffect(() => {
//     let active = true;
//     (async () => {
//       setVillagesLoading(true);
//       try {
//         // Prefer DB villages if tribe specified
//         if (tribe) {
//           const qs = new URLSearchParams();
//           qs.set('tribe', String(tribe).toLowerCase());
//           if (country) qs.set('country', country);
//           if (stateRegion) qs.set('state', stateRegion);
//           const res = await fetch(`/api/submissions/villages?${qs.toString()}`);
//           const data = await res.json();
//           if (active && Array.isArray(data) && data.length > 0) {
//             setVillageOptions(data);
//             return;
//           }
//         }
//         // Fallback to curated reference by state for India
//         if (country && stateRegion) {
//           const qs2 = new URLSearchParams();
//           qs2.set('country', country);
//           qs2.set('state', stateRegion);
//           const res2 = await fetch(`/api/reference/villages?${qs2.toString()}`);
//           const data2 = await res2.json();
//           if (active) setVillageOptions(Array.isArray(data2) ? data2 : []);
//           return;
//         }
//         if (active) setVillageOptions([]);
//       } catch (_e) {
//         if (active) setVillageOptions([]);
//       } finally {
//         if (active) setVillagesLoading(false);
//       }
//     })();
//     return () => { active = false; };
//   }, [tribe, country, stateRegion]);

//   useEffect(() => {
//     let active = true;
//     (async () => {
//       try {
//         const [tRes, vRes] = await Promise.all([
//           fetch('/api/reference/preloaded-tribes'),
//           fetch('/api/reference/preloaded-villages'),
//         ]);
//         const [tData, vData] = await Promise.all([tRes.json(), vRes.json()]);
//         if (active) {
//           setPreloadedTribes(Array.isArray(tData) ? tData : []);
//           setPreloadedVillages(Array.isArray(vData) ? vData : []);
//         }
//       } catch (_) {
//         if (active) {
//           setPreloadedTribes([]);
//           setPreloadedVillages([]);
//         }
//       }
//     })();
//     return () => { active = false; };
//   }, []);

//   // No localStorage persistence; keep in-memory only

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="flex-1 py-12 px-4">
//         <div className="container mx-auto max-w-3xl">
//           <div className="text-center mb-8">
//             <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
//               Upload Content
//             </h1>
//             <p className="text-lg text-muted-foreground">
//               Share your cultural heritage with the community
//             </p>
//           </div>

//           {/* No additional top filters; typeahead is inside the form fields below */}

//           <div className="bg-background border rounded-lg p-6 space-y-6">
//             <div>
//               <h2 className="text-2xl font-heading">Content Submission Form</h2>
//               <p className="text-sm text-muted-foreground">All fields are required for review</p>
//             </div>

//               {/* Category → Country → State/Region → Tribe → Village */}
//               <div className="space-y-4">
//                 {/* Category */}
//                 <div className="space-y-2">
//                   <Label htmlFor="category">Category</Label>
//                   <Select value={category} onValueChange={setCategory}>
//                     <SelectTrigger id="category">
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.map((cat) => (
//                         <SelectItem key={cat} value={cat.toLowerCase().replace(/\s+/g, '-')}>{cat}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Country */}
//                 <div className="space-y-2">
//                   <Label htmlFor="country">Country</Label>
//                   <Select value={country} onValueChange={(v) => { setCountry(v); setStateRegion(""); }}>
//                     <SelectTrigger id="country">
//                       <SelectValue placeholder="Select country" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {countries.map((c) => (
//                         <SelectItem key={c} value={c}>{c}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* State/Region */}
//                 <div className="space-y-2">
//                   <Label htmlFor="state">State/Region</Label>
//                   <Select value={stateRegion} onValueChange={setStateRegion} disabled={!country}>
//                     <SelectTrigger id="state">
//                       <SelectValue placeholder={country ? "Select state/region" : "Select country first"} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {(regionsByCountry[country] || []).map((r) => (
//                         <SelectItem key={r} value={r}>{r}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Tribe (typeahead) */}
//                 <div className="space-y-2">
//                   <Label htmlFor="tribe">Tribe</Label>
//                   <div className="relative">
//                     <Input
//                       id="tribe"
//                       placeholder={"Start typing tribe…"}
//                       value={tribe}
//                       onChange={(e) => setTribe(e.target.value)}
//                       autoComplete="off"
//                     />
//                     {/* Suggestions */}
//                     {Boolean(tribe) && !tribesLoading && (new Set([...(preloadedTribes||[]), ...(tribeOptions||[])]).size > 0) && (
//                       <div className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
//                         {Array.from(new Set([...(preloadedTribes||[]), ...(tribeOptions||[])].map((t) => String(t).toLowerCase())))
//                           .filter((t) => t.includes(tribe.toLowerCase()))
//                           .slice(0, 8)
//                           .map((t) => (
//                             <button
//                               type="button"
//                               key={t}
//                               className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
//                               onClick={() => setTribe(String(t))}
//                             >
//                               {t}
//                             </button>
//                           ))}
//                         {Array.from(new Set([...(preloadedTribes||[]), ...(tribeOptions||[])]))
//                           .filter((t) => String(t).toLowerCase().includes(tribe.toLowerCase())).length === 0 && (
//                           <div className="px-3 py-2 text-sm text-muted-foreground">No matches</div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   {tribesLoading && <div className="text-xs text-muted-foreground">Loading tribes…</div>}
//                 </div>

//                 {/* Village (typeahead) */}
//                 <div className="space-y-2">
//                   <Label htmlFor="village">Village</Label>
//                   <div className="relative">
//                     <Input
//                       id="village"
//                       placeholder={!tribe ? "Select or type tribe first" : "Start typing village…"}
//                       value={village}
//                       onChange={(e) => setVillage(e.target.value)}
//                       autoComplete="off"
//                     />
//                     {Boolean(village) && !villagesLoading && (new Set([...(preloadedVillages||[]), ...(villageOptions||[])]).size > 0) && (
//                       <div className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
//                         {Array.from(new Set([...(preloadedVillages||[]), ...(villageOptions||[])]))
//                           .filter((v) => String(v).toLowerCase().includes(village.toLowerCase()))
//                           .slice(0, 8)
//                           .map((v) => (
//                             <button
//                               type="button"
//                               key={String(v)}
//                               className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
//                               onClick={() => setVillage(String(v))}
//                             >
//                               {String(v)}
//                             </button>
//                           ))}
//                         {Array.from(new Set([...(preloadedVillages||[]), ...(villageOptions||[])]))
//                           .filter((v) => String(v).toLowerCase().includes(village.toLowerCase())).length === 0 && (
//                           <div className="px-3 py-2 text-sm text-muted-foreground">No matches</div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   {villagesLoading && <div className="text-xs text-muted-foreground">Loading villages…</div>}
//                 </div>
//               </div>

//               {/* Content Section */}
//               <div className="rounded-lg border p-4 bg-indigo-50/40">
//                 {/* Title */}
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Title</Label>
//                   <Input id="title" placeholder="Enter content title" value={title} onChange={(e) => setTitle(e.target.value)} />
//                 </div>

//                 {/* Content Type */}
//                 <div className="space-y-2 mt-4">
//                   <Label htmlFor="type">Content Type</Label>
//                   <Select value={type} onValueChange={(v) => setType(v as any)}>
//                     <SelectTrigger id="type">
//                       <SelectValue placeholder="Select content type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="text">Text</SelectItem>
//                       <SelectItem value="audio">Audio</SelectItem>
//                       <SelectItem value="video">Video</SelectItem>
//                       <SelectItem value="image">Image</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Text Content (Short Description) */}
//                 <div className="space-y-2 mt-4">
//                   <Label htmlFor="text-content">Text Content (Short Description)</Label>
//                   <Textarea
//                     id="text-content"
//                     placeholder={type === 'text' ? 'Write or paste the text content (used as both description and full text)' : 'Write a short description'}
//                     rows={type === 'text' ? 8 : 5}
//                     value={textContent}
//                     onChange={(e) => setTextContent(e.target.value)}
//                   />
//                   {type === 'text' && (
//                     <p className="text-xs text-muted-foreground">Or upload a PDF below.</p>
//                   )}
//                 </div>

//                 {/* Content URL or File */}
//                 {type !== 'text' && (
//                   <div className="space-y-2 mt-4">
//                     <Label htmlFor="contentUrl">{type === 'image' ? 'Image URL' : (type === 'audio' ? 'Audio URL' : 'Video URL')}</Label>
//                     <Input
//                       id="contentUrl"
//                       placeholder={type === 'image' ? 'https://example.com/file.jpg' : (type === 'audio' ? 'https://example.com/file.mp3' : 'https://example.com/file.mp4')}
//                       value={contentUrl}
//                       onChange={(e) => setContentUrl(e.target.value)}
//                     />
//                   </div>
//                 )}

//                 <div className="space-y-2 mt-4">
//                   <Label htmlFor="content-file" className="text-indigo-900">{type === 'text' ? 'Upload PDF (optional)' : 'Upload Content File'}</Label>
//                   <Input
//                     id="content-file"
//                     type="file"
//                     accept={
//                       type === 'video' ? 'video/*' : (
//                         type === 'audio' ? 'audio/*' : (
//                           type === 'image' ? 'image/*' : 'application/pdf'
//                         )
//                       )
//                     }
//                     className="border-indigo-300 bg-indigo-50/60 focus-visible:ring-indigo-500"
//                     onChange={(e) => setContentFile(e.target.files?.[0] || null)}
//                   />
//                 </div>

//                 {/* Sensitivity Level */}
//                 <div className="space-y-2 mt-4">
//                   <Label htmlFor="sensitivity">Sensitivity Level</Label>
//                   <Select>
//                     <SelectTrigger id="sensitivity">
//                       <SelectValue placeholder="Select sensitivity level" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="public">Public</SelectItem>
//                       <SelectItem value="restricted">Restricted</SelectItem>
//                       <SelectItem value="confidential">Confidential</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Content Warnings */}
//                 <div className="space-y-3 mt-4">
//                   <Label>Content Warnings (check all that apply)</Label>
//                   <div className="space-y-2">
//                     <div className="flex items-center space-x-2">
//                       <Checkbox id="ritual" />
//                       <label htmlFor="ritual" className="text-sm cursor-pointer">Ritual Practices</label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox id="nudity" />
//                       <label htmlFor="nudity" className="text-sm cursor-pointer">Partial Nudity</label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox id="cultural" />
//                       <label htmlFor="cultural" className="text-sm cursor-pointer">Cultural Practices</label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox id="others" checked={warningOther} onCheckedChange={(v) => setWarningOther(Boolean(v))} />
//                       <label htmlFor="others" className="text-sm cursor-pointer">Others</label>
//                     </div>
//                   </div>
//                   {warningOther && (
//                     <div className="space-y-2">
//                       <Label htmlFor="others-text">Please specify</Label>
//                       <Input id="others-text" placeholder="Type the content warning" value={warningOtherText} onChange={(e) => setWarningOtherText(e.target.value)} />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Consent Section */}
//               <div className="rounded-lg border p-4 bg-emerald-50/50">
//                 <div className="space-y-2">
//                   <Label htmlFor="consent-file" className="text-emerald-900">Upload Consent File</Label>
//                   <Input
//                     id="consent-file"
//                     type="file"
//                     className="border-emerald-300 bg-emerald-50/60 focus-visible:ring-emerald-500"
//                     onChange={(e) => setConsentFile(e.target.files?.[0] || null)}
//                   />
//                 </div>

//                 <div className="space-y-2 mt-4">
//                   <Label htmlFor="consent-type">Consent Type</Label>
//                   <Select>
//                     <SelectTrigger id="consent-type">
//                       <SelectValue placeholder="Select consent type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="written">Written</SelectItem>
//                       <SelectItem value="audio">Audio</SelectItem>
//                       <SelectItem value="video">Video</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2 mt-4">
//                   <Label htmlFor="consent-name">Consent Name</Label>
//                   <Input
//                     id="consent-name"
//                     placeholder="Name of consenting person"
//                     value={consentName}
//                     onChange={(e) => setConsentName(e.target.value)}
//                   />
//                 </div>

//                 <div className="flex items-center space-x-2 mt-4">
//                   <Checkbox id="consent-given" checked={consentGiven} onCheckedChange={(v) => setConsentGiven(Boolean(v))} />
//                   <label htmlFor="consent-given" className="text-sm cursor-pointer">I confirm that consent has been given</label>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <Button
//                 className="w-full"
//                 size="lg"
//                 disabled={
//                   submitting ||
//                   !title.trim() ||
//                   !textContent.trim() ||
//                   !category
//                 }
//                 onClick={async () => {
//                   // Validate required fields (already gated by disabled)
//                   try {
//                     setSubmitting(true);
//                     // Use selected values directly
//                     const effectiveCategory = category;
//                     const effectiveTribe = tribe || undefined;
//                     const effectiveCountry = country || undefined;
//                     const effectiveState = stateRegion || undefined;
//                     const effectiveVillage = village || undefined;

//                     // Enforce content presence rules
//                     if (type === 'text' && !textContent.trim()) {
//                       if (!contentFile) {
//                         toast({ title: 'Missing content', description: 'Provide text content or upload a PDF', variant: 'destructive' });
//                         setSubmitting(false);
//                         return;
//                       }
//                     }
//                     if ((type !== 'text') && !(contentFile || contentUrl.trim())) {
//                       toast({ title: 'Missing media', description: 'Provide a media URL or upload a file', variant: 'destructive' });
//                       setSubmitting(false);
//                       return;
//                     }

//                     let mediaUrl = contentUrl.trim();
//                     let consentFileUrl = "";

//                     // Upload media file if provided
//                     if (contentFile) {
//                       const fd = new FormData();
//                       fd.append('file', contentFile);
//                       if (!isAuthenticated || !token) {
//                         toast({ title: 'Login required', description: 'Please login to upload files', variant: 'destructive' });
//                         navigate('/signup');
//                         setSubmitting(false);
//                         return;
//                       }
//                       const up = await fetch('/api/uploads', {
//                         method: 'POST',
//                         headers: { 'Authorization': `Bearer ${token}` },
//                         body: fd
//                       });
//                       if (up.status === 401) {
//                         toast({ title: 'Session expired', description: 'Please login again', variant: 'destructive' });
//                         navigate('/login');
//                         setSubmitting(false);
//                         return;
//                       }
//                       const upData = await up.json();
//                       if (!up.ok) throw new Error(upData?.errors?.[0]?.msg || 'Upload failed');
//                       mediaUrl = upData.path || upData.url;
//                     }

//                     // Upload consent file if provided
//                     if (consentFile) {
//                       const fd2 = new FormData();
//                       fd2.append('file', consentFile);
//                       if (!isAuthenticated || !token) {
//                         toast({ title: 'Login required', description: 'Please login to upload files', variant: 'destructive' });
//                         navigate('/signup');
//                         setSubmitting(false);
//                         return;
//                       }
//                       const up2 = await fetch('/api/uploads', {
//                         method: 'POST',
//                         headers: { 'Authorization': `Bearer ${token}` },
//                         body: fd2
//                       });
//                       if (up2.status === 401) {
//                         toast({ title: 'Session expired', description: 'Please login again', variant: 'destructive' });
//                         navigate('/login');
//                         setSubmitting(false);
//                         return;
//                       }
//                       const upData2 = await up2.json();
//                       if (!up2.ok) throw new Error(upData2?.errors?.[0]?.msg || 'Consent upload failed');
//                       consentFileUrl = upData2.path || upData2.url;
//                     }

//                     if (!isAuthenticated || !token) {
//                       toast({ title: 'Login required', description: 'Please login to submit content', variant: 'destructive' });
//                       navigate('/signup');
//                       setSubmitting(false);
//                       return;
//                     }

//                     const res = await fetch('/api/submissions', {
//                       method: 'POST',
//                       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//                       body: JSON.stringify({
//                         title: title.trim(),
//                         description: textContent.trim(),
//                         category: effectiveCategory,
//                         tribe: effectiveTribe,
//                         country: effectiveCountry,
//                         state: effectiveState,
//                         village: effectiveVillage,
//                         type,
//                         contentUrl: ((type !== 'text') || (mediaUrl)) ? mediaUrl : undefined,
//                         text: type === 'text' ? (textContent.trim() || undefined) : undefined,
//                         consent: {
//                           given: consentGiven,
//                           name: consentName.trim(),
//                           fileUrl: consentFileUrl || undefined,
//                         }
//                       })
//                     });
//                     if (res.status === 401) {
//                       toast({ title: 'Session expired', description: 'Please login again', variant: 'destructive' });
//                       navigate('/login');
//                       setSubmitting(false);
//                       return;
//                     }
//                     const data = await res.json();
//                     if (!res.ok) throw new Error(data?.errors?.[0]?.msg || 'Submit failed');
//                     toast({ title: 'Submitted for review', description: 'Your content was sent to admin for approval' });
//                     // Reset form
//                     setTitle("");
//                     setTextContent("");
//                     setType('text');
//                     setContentUrl("");
//                     setContentFile(null);
//                     setCategory("");
//                     setTribe("");
//                     setCountry("");
//                     setStateRegion("");
//                     setVillage("");
//                     setWarningOther(false);
//                     setWarningOtherText("");
//                     try { localStorage.removeItem('uploadForm'); } catch {}
//                     navigate('/explore');
//                   } catch (err: any) {
//                     toast({ title: 'Error', description: err.message || 'Submit failed', variant: 'destructive' });
//                   } finally {
//                     setSubmitting(false);
//                   }
//                 }}
//               >
//                 {submitting ? 'Submitting...' : 'Submit for Review'}
//               </Button>
//             </div>
//           </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Upload;

// GitHub Code
// import { useState, FormEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/context/AuthContext";
// import Footer from "@/components/Footer";
// import { Upload as UploadIcon, FileText, Image as ImageIcon, Video, Music, Box, AlertCircle } from "lucide-react";

// const Upload = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();

//   // Step 2: Category Selection
//   const [country, setCountry] = useState("");
//   const [stateRegion, setStateRegion] = useState("");
//   const [tribe, setTribe] = useState("");
//   const [village, setVillage] = useState("");
//   const [culturalDomain, setCulturalDomain] = useState("");
//   const [title, setTitle] = useState("");

//   // Step 3: Content Description
//   const [description, setDescription] = useState("");
//   const [keywords, setKeywords] = useState("");
//   const [language, setLanguage] = useState("");
//   const [dateOfRecording, setDateOfRecording] = useState("");
//   const [culturalSignificance, setCulturalSignificance] = useState("");

//   // Step 4: Content File
//   const [contentFileType, setContentFileType] = useState<"audio" | "video" | "image" | "text" | "3d">("audio");
//   const [contentFile, setContentFile] = useState<File | null>(null);

//   // Step 5: Consent Upload
//   const [consentFileType, setConsentFileType] = useState<"pdf" | "audio" | "video">("pdf");
//   const [consentFile, setConsentFile] = useState<File | null>(null);
//   const [consentType, setConsentType] = useState("");
//   const [consentNames, setConsentNames] = useState("");
//   const [consentDate, setConsentDate] = useState("");
//   const [permissionType, setPermissionType] = useState<string[]>([]);
//   const [consentDuration, setConsentDuration] = useState("");
//   const [digitalSignature, setDigitalSignature] = useState("");

//   // Step 6: Access Classification
//   const [accessTier, setAccessTier] = useState("");
//   const [contentWarnings, setContentWarnings] = useState<string[]>([]);
//   const [warningOther, setWarningOther] = useState("");

//   // Step 7: Additional Verification
//   const [translationFile, setTranslationFile] = useState<File | null>(null);
//   const [backgroundInfo, setBackgroundInfo] = useState("");
//   const [verificationDoc, setVerificationDoc] = useState<File | null>(null);

//   // Step 8: Ethics Acknowledgement
//   const [ethicsAgreed, setEthicsAgreed] = useState(false);

//   const [currentStep, setCurrentStep] = useState(1);
//   const [submitting, setSubmitting] = useState(false);

//   // Static data
//   const countries = ["New Zealand", "Australia", "United States of America", "Norway", "Sweden", "India"];
//   const culturalDomains = [
//     "Folk Song", "Folk Dance", "Folk Tale", "Ritual", "Material Culture",
//     "Sacred Site", "Oral Narrative", "Other"
//   ];
//   const consentTypes = ["Individual Consent", "Collective / Community Consent", "Custodian Consent"];
//   const permissionTypes = ["Educational", "Research", "Cultural Display", "All the above"];
//   const accessTiers = ["Public", "Restricted", "Confidential/Sacred"];
//   const warningOptions = ["Sacred object", "Deceased person", "Ritual context", "Other"];

//   const handleContentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setContentFile(e.target.files[0]);
//     }
//   };

//   const handleConsentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setConsentFile(e.target.files[0]);
//     }
//   };

//   const handlePermissionToggle = (value: string) => {
//     setPermissionType(prev =>
//       prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
//     );
//   };

//   const handleWarningToggle = (value: string) => {
//     setContentWarnings(prev =>
//       prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
//     );
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!ethicsAgreed) {
//       toast({
//         title: "Ethics Agreement Required",
//         description: "Please acknowledge the ethics statement before submitting.",
//         variant: "destructive"
//       });
//       return;
//     }

//     setSubmitting(true);

//     try {
//       // TODO: Implement API call
//       // const formData = new FormData();
//       // ... append all fields
//       // const response = await authFetch('/api/submissions', { method: 'POST', body: formData });

//       await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

//       toast({
//         title: "Success!",
//         description: "Your submission has been uploaded successfully."
//       });

//       navigate("/profile");
//     } catch (error: any) {
//       toast({
//         title: "Upload Failed",
//         description: error.message || "An error occurred during upload.",
//         variant: "destructive"
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Card className="max-w-md">
//           <CardHeader>
//             <CardTitle>Authentication Required</CardTitle>
//             <CardDescription>Please log in to upload content.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button onClick={() => navigate("/login?redirect=/upload")} className="w-full">
//               Go to Login
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const stepTitles = [
//     "Category Selection",
//     "Content Description",
//     "Upload Content File",
//     "Consent Upload",
//     "Access Classification",
//     "Additional Verification",
//     "Ethics Acknowledgement"
//   ];

//   const nextStep = () => {
//     if (currentStep < 7) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="flex-1 py-12 px-4">
//         <div className="container mx-auto max-w-4xl">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary">
//               Upload Cultural Heritage Content
//             </h1>
//             <p className="mt-2 text-muted-foreground">
//               Step {currentStep} of 7: {stepTitles[currentStep - 1]}
//             </p>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-8">
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-primary h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${(currentStep / 7) * 100}%` }}
//               />
//             </div>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <Card>
//               <CardContent className="pt-6 space-y-6">

//                 {/* STEP 1: Category Selection */}
//                 {currentStep === 1 && (
//                   <div className="space-y-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="country">Country *</Label>
//                       <Select value={country} onValueChange={setCountry}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select country" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {countries.map(c => (
//                             <SelectItem key={c} value={c}>{c}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="stateRegion">State / Region *</Label>
//                       <Input
//                         id="stateRegion"
//                         value={stateRegion}
//                         onChange={(e) => setStateRegion(e.target.value)}
//                         placeholder="Enter state or region"
//                         required
//                       />
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="tribe">Tribe *</Label>
//                       <Input
//                         id="tribe"
//                         value={tribe}
//                         onChange={(e) => setTribe(e.target.value)}
//                         placeholder="Enter tribe name"
//                         required
//                       />
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="village">Village</Label>
//                       <Input
//                         id="village"
//                         value={village}
//                         onChange={(e) => setVillage(e.target.value)}
//                         placeholder="Enter village name"
//                       />
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="culturalDomain">Cultural Domain *</Label>
//                       <Select value={culturalDomain} onValueChange={setCulturalDomain}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select cultural domain" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {culturalDomains.map(d => (
//                             <SelectItem key={d} value={d}>{d}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="title">Title of the Material *</Label>
//                       <Input
//                         id="title"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         placeholder="Enter a descriptive title"
//                         required
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 2: Content Description */}
//                 {currentStep === 2 && (
//                   <div className="space-y-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="description">Short Description (max 250 words) *</Label>
//                       <Textarea
//                         id="description"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         placeholder="Describe what this material is about..."
//                         rows={5}
//                         maxLength={1500}
//                         required
//                       />
//                       <p className="text-xs text-muted-foreground">{description.length}/1500 characters</p>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="keywords">Keywords (comma-separated) *</Label>
//                       <Input
//                         id="keywords"
//                         value={keywords}
//                         onChange={(e) => setKeywords(e.target.value)}
//                         placeholder="e.g., traditional, ceremony, harvest"
//                         required
//                       />
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="language">Language / Dialect Used *</Label>
//                       <Input
//                         id="language"
//                         value={language}
//                         onChange={(e) => setLanguage(e.target.value)}
//                         placeholder="e.g., Māori, Hindi"
//                         required
//                       />
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="dateOfRecording">Date of Recording / Creation</Label>
//                       <Input
//                         id="dateOfRecording"
//                         type="date"
//                         value={dateOfRecording}
//                         onChange={(e) => setDateOfRecording(e.target.value)}
//                       />
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="culturalSignificance">Cultural Significance Note (Optional)</Label>
//                       <Textarea
//                         id="culturalSignificance"
//                         value={culturalSignificance}
//                         onChange={(e) => setCulturalSignificance(e.target.value)}
//                         placeholder="Explain the cultural importance of this material..."
//                         rows={4}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 3: Upload Content File */}
//                 {currentStep === 3 && (
//                   <div className="space-y-4">
//                     <div className="grid gap-2">
//                       <Label>Choose File Type *</Label>
//                       <RadioGroup value={contentFileType} onValueChange={(v: any) => setContentFileType(v)}>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="audio" id="audio" />
//                           <Label htmlFor="audio" className="flex items-center gap-2 cursor-pointer">
//                             <Music className="h-4 w-4" /> Audio (.mp3, .wav)
//                           </Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="video" id="video" />
//                           <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
//                             <Video className="h-4 w-4" /> Video (.mp4, .mov)
//                           </Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="image" id="image" />
//                           <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer">
//                             <ImageIcon className="h-4 w-4" /> Image (.jpg, .png)
//                           </Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="text" id="text" />
//                           <Label htmlFor="text" className="flex items-center gap-2 cursor-pointer">
//                             <FileText className="h-4 w-4" /> Text (.pdf, .docx)
//                           </Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="3d" id="3d" />
//                           <Label htmlFor="3d" className="flex items-center gap-2 cursor-pointer">
//                             <Box className="h-4 w-4" /> 3D Model (.obj, .glb)
//                           </Label>
//                         </div>
//                       </RadioGroup>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="contentFile">Upload File *</Label>
//                       <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
//                         <Input
//                           id="contentFile"
//                           type="file"
//                           onChange={handleContentFileChange}
//                           className="hidden"
//                           accept={
//                             contentFileType === 'audio' ? 'audio/mp3,audio/wav' :
//                             contentFileType === 'video' ? 'video/mp4,video/quicktime' :
//                             contentFileType === 'image' ? 'image/jpeg,image/png' :
//                             contentFileType === 'text' ? 'application/pdf,.docx' :
//                             '.obj,.glb'
//                           }
//                         />
//                         <label htmlFor="contentFile" className="cursor-pointer">
//                           <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
//                           <p className="text-sm text-muted-foreground">
//                             {contentFile ? contentFile.name : 'Click to upload or drag and drop'}
//                           </p>
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 4: Consent Upload */}
//                 {currentStep === 4 && (
//                   <div className="space-y-4">
//                     <Alert>
//                       <AlertCircle className="h-4 w-4" />
//                       <AlertDescription>
//                         Ethical consent is required for all uploads. Please provide documentation.
//                       </AlertDescription>
//                     </Alert>

//                     <div className="grid gap-2">
//                       <Label>Consent File Type *</Label>
//                       <RadioGroup value={consentFileType} onValueChange={(v: any) => setConsentFileType(v)}>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="pdf" id="pdf" />
//                           <Label htmlFor="pdf" className="cursor-pointer">PDF (Written)</Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="audio" id="consent-audio" />
//                           <Label htmlFor="consent-audio" className="cursor-pointer">Audio Recording</Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="video" id="consent-video" />
//                           <Label htmlFor="consent-video" className="cursor-pointer">Video Recording</Label>
//                         </div>
//                       </RadioGroup>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="consentFile">Upload Consent File *</Label>
//                       <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
//                         <Input
//                           id="consentFile"
//                           type="file"
//                           onChange={handleConsentFileChange}
//                           className="hidden"
//                           accept={
//                             consentFileType === 'pdf' ? 'application/pdf' :
//                             consentFileType === 'audio' ? 'audio/*' :
//                             'video/*'
//                           }
//                         />
//                         <label htmlFor="consentFile" className="cursor-pointer">
//                           <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
//                           <p className="text-sm text-muted-foreground">
//                             {consentFile ? consentFile.name : 'Click to upload consent document'}
//                           </p>
//                         </label>
//                       </div>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="consentType">Consent Type *</Label>
//                       <Select value={consentType} onValueChange={setConsentType}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select consent type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {consentTypes.map(ct => (
//                             <SelectItem key={ct} value={ct}>{ct}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="consentNames">Name(s) of Consenting Person(s) *</Label>
//                       <Input
//                         id="consentNames"
//                         value={consentNames}
//                         onChange={(e) => setConsentNames(e.target.value)}
//                         placeholder="Enter names"
//                         required
//                       />
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="consentDate">Date of Consent *</Label>
//                       <Input
//                         id="consentDate"
//                         type="date"
//                         value={consentDate}
//                         onChange={(e) => setConsentDate(e.target.value)}
//                         required
//                       />
//                     </div>

//                     <div className="grid gap-2">
//                       <Label>Type of Permission *</Label>
//                       <div className="space-y-2">
//                         {permissionTypes.map(pt => (
//                           <div key={pt} className="flex items-center space-x-2">
//                             <Checkbox
//                               id={pt}
//                               checked={permissionType.includes(pt)}
//                               onCheckedChange={() => handlePermissionToggle(pt)}
//                             />
//                             <Label htmlFor={pt} className="cursor-pointer">{pt}</Label>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="consentDuration">Duration / Validity *</Label>
//                       <Select value={consentDuration} onValueChange={setConsentDuration}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select duration" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="permanent">Permanent</SelectItem>
//                           <SelectItem value="temporary">Temporary</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="digitalSignature">Digital Signature (Optional)</Label>
//                       <Input
//                         id="digitalSignature"
//                         value={digitalSignature}
//                         onChange={(e) => setDigitalSignature(e.target.value)}
//                         placeholder="Enter signature or leave blank"
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 5: Access Classification */}
//                 {currentStep === 5 && (
//                   <div className="space-y-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="accessTier">Access Tier *</Label>
//                       <Select value={accessTier} onValueChange={setAccessTier}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select access level" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {accessTiers.map(at => (
//                             <SelectItem key={at} value={at}>{at}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <p className="text-xs text-muted-foreground">
//                         {accessTier === "Public" && "Open for general or educational sharing"}
//                         {accessTier === "Restricted" && "For approved researchers or verified community members only"}
//                         {accessTier === "Confidential/Sacred" && "Viewable only with explicit community consent"}
//                       </p>
//                     </div>

//                     <div className="grid gap-2">
//                       <Label>Content Warnings (Optional)</Label>
//                       <div className="space-y-2">
//                         {warningOptions.map(wo => (
//                           <div key={wo} className="flex items-center space-x-2">
//                             <Checkbox
//                               id={wo}
//                               checked={contentWarnings.includes(wo)}
//                               onCheckedChange={() => handleWarningToggle(wo)}
//                             />
//                             <Label htmlFor={wo} className="cursor-pointer">{wo}</Label>
//                           </div>
//                         ))}
//                       </div>
//                       {contentWarnings.includes("Other") && (
//                         <Input
//                           placeholder="Specify other warning"
//                           value={warningOther}
//                           onChange={(e) => setWarningOther(e.target.value)}
//                           className="mt-2"
//                         />
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 6: Additional Verification */}
//                 {currentStep === 6 && (
//                   <div className="space-y-4">
//                     <p className="text-sm text-muted-foreground">All fields in this step are optional but recommended.</p>

//                     <div className="grid gap-2">
//                       <Label htmlFor="translationFile">Translation File</Label>
//                       <Input
//                         id="translationFile"
//                         type="file"
//                         onChange={(e) => e.target.files && setTranslationFile(e.target.files[0])}
//                         accept=".pdf,.docx,.txt"
//                       />
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="backgroundInfo">Background Information</Label>
//                       <Textarea
//                         id="backgroundInfo"
//                         value={backgroundInfo}
//                         onChange={(e) => setBackgroundInfo(e.target.value)}
//                         placeholder="Additional context about the material..."
//                         rows={4}
//                       />
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor="verificationDoc">Verification Document from Community Elders/Scholars</Label>
//                       <Input
//                         id="verificationDoc"
//                         type="file"
//                         onChange={(e) => e.target.files && setVerificationDoc(e.target.files[0])}
//                         accept=".pdf,.jpg,.png"
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 7: Ethics Acknowledgement */}
//                 {currentStep === 7 && (
//                   <div className="space-y-4">
//                     <Alert className="border-primary">
//                       <AlertCircle className="h-4 w-4" />
//                       <AlertDescription>
//                         <strong>Important:</strong> Before submitting, please review and acknowledge the following ethics statement.
//                       </AlertDescription>
//                     </Alert>

//                     <Card className="bg-muted/50">
//                       <CardContent className="pt-6">
//                         <div className="flex items-start space-x-2">
//                           <Checkbox
//                             id="ethicsAgreed"
//                             checked={ethicsAgreed}
//                             onCheckedChange={(checked) => setEthicsAgreed(checked as boolean)}
//                           />
//                           <Label htmlFor="ethicsAgreed" className="cursor-pointer text-sm leading-relaxed">
//                             I acknowledge that this content is uploaded with <strong>informed consent</strong> and <strong>cultural approval</strong>.
//                             I agree that once uploaded, it cannot be deleted or altered except by authorised custodians.
//                           </Label>
//                         </div>
//                       </CardContent>
//                     </Card>

//                     {!ethicsAgreed && (
//                       <p className="text-sm text-red-600">
//                         ⚠️ You must acknowledge the ethics statement to proceed with submission.
//                       </p>
//                     )}
//                   </div>
//                 )}

//               </CardContent>
//             </Card>

//             {/* Navigation Buttons */}
//             <div className="flex justify-between mt-6">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={prevStep}
//                 disabled={currentStep === 1}
//               >
//                 Previous
//               </Button>

//               {currentStep < 7 ? (
//                 <Button type="button" onClick={nextStep}>
//                   Next Step
//                 </Button>
//               ) : (
//                 <Button type="submit" disabled={submitting || !ethicsAgreed}>
//                   {submitting ? "Submitting..." : "Submit Upload"}
//                 </Button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Upload;

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.errors?.[0]?.msg || "Submission failed");
      }

      toast({
        title: "Success!",
        description:
          "Your submission has been uploaded successfully and is pending review.",
        variant: "default",
      });

      // Navigate to profile to see submissions
      navigate("/profile");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "An error occurred during upload.",
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

                    <div className="grid gap-2">
                      <Label htmlFor="stateRegion">State / Region *</Label>
                      <Input
                        id="stateRegion"
                        value={stateRegion}
                        onChange={(e) => setStateRegion(e.target.value)}
                        placeholder="Enter state or region"
                      />
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
      <Footer />
    </div>
  );
};

export default Upload;
