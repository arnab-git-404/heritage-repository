

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroBg from "@/assets/hero-bg.jpg";
import { useRef, useState } from "react";
import { ArrowDown, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const archivePhotos = [
  {
    src: "/rituals.jpeg",
    caption: "Woodcarving from a tree at Shangnyu Village",
    tags: ["community", "Shangnyu Village"],
  },
  {
    src: "/material.jpg",
    caption:
      "Ornaments and Tools showpiece at Longwa Village - Angh's Residence",
    tags: ["showpiece", "Longwa Village"],
  },
  {
    src: "/folksongs.jpg",
    caption: "Folktales, Folksongs sharing space. Meeting place for warfare.",
    tags: ["folktales", "folksongs"],
  },
  { src: "/folkdances.jpg", caption: "Logdrum", tags: ["Logdrum"] },
  {
    src: "/tools.jpg",
    caption: "Craft tools and artefacts",
    tags: ["tools", "craft"],
  },
  {
    src: "/folktales.jpg",
    caption: "Origin Stone at Chungliyimti Village",
    tags: ["Stone", "Chungliyimti Village"],
  },
];

const Landing = () => {
  const howRef = useRef<HTMLDivElement | null>(null);
  const roadmapRef = useRef<HTMLDivElement | null>(null);
  const visualsRef = useRef<HTMLDivElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return;

    if (direction === "prev") {
      setSelectedImage(
        selectedImage === 0 ? archivePhotos.length - 1 : selectedImage - 1
      );
    } else {
      setSelectedImage(
        selectedImage === archivePhotos.length - 1 ? 0 : selectedImage + 1
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden font-sans leading-relaxed">

      {/* Hero Section */}
      <section
        className="relative h-[86svh] md:h-[92svh] flex items-center justify-start overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.5)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 pattern-weave opacity-[.12]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-secondary/20 to-transparent" />

        <svg
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,600 C240,520 480,680 720,600 C960,520 1200,680 1440,600"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M0,500 C240,420 480,580 720,500 C960,420 1200,580 1440,500"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          />
          <path
            d="M0,700 C240,620 480,780 720,700 C960,620 1200,780 1440,700"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        </svg>

        <div className="container relative z-10 px-0 md:px-0 ">
          <div className="max-w-2xl md:max-w-3xl lg:max-w-3xl text-left pl-4 sm:pl-6 md:pl-8">
            <h1 className="font-body uppercase tracking-[0.08em] text-primary-foreground dark:text-primary text-4xl md:text-6xl lg:text-7xl leading-[1.1] font-semibold">
              Heritage Repository
            </h1>
            <h2 className="font-body uppercase tracking-[0.22em] text-primary-foreground/95 dark:text-primary text-lg md:text-2xl lg:text-3xl mt-1 font-medium">
              Consent-Based, Tiered Digital Archive
            </h2>
            <p className="text-primary-foreground/90 text-sm md:text-base dark:text-primary max-w-[55ch] mt-5">
              Safeguarding heritage — ethically and authentically. Discover,
              learn, and contribute with consent-first principles.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full bg-white text-secondary hover:bg-white/90 px-8 py-6 text-base"
                asChild
              >
                <Link to="/explore">Explore Archive</Link>
              </Button>
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 py-6 text-base"
                asChild
              >
                <Link to="/upload">Contribute</Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 md:mt-8 flex items-center justify-start gap-3 text-primary-foreground/90 pl-4 sm:pl-6 md:pl-8">
            <button
              onClick={() => scrollTo(howRef)}
              className="inline-flex items-center dark:text-primary gap-2 text-xs md:text-sm hover:text-primary transition-colors"
              aria-label="Scroll to how it works"
            >
              Learn how it works
              <ArrowDown className="h-5 w-5 animate-bounce" />
            </button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/40 to-transparent" />
      </section>

      {/* How It Works */}
      <section
        ref={howRef}
        className="relative py-20 md:py-32 bg-background border-t border-border/60"
      >
        <div className="absolute inset-0 bg-tribal-shawl/5 w-full" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold heading-accent inline-block">
              How to Use the Repository
            </h2>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover, contribute, and steward cultural knowledge in an
              ethical, consent-first way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group relative rounded-2xl p-8 bg-card border-2 hover:border-primary/50 transition-all hover:shadow-xl">
              <div className="mb-6 w-full h-56 rounded-xl overflow-hidden border-2 border-primary/20">
                <img
                  src="/collection02.jpeg"
                  alt="Explore and learn about cultural heritage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  1
                </span>
                <h3 className="text-xl md:text-2xl font-semibold">
                  Learn & Explore
                </h3>
              </div>
              <ul className="list-disc pl-5 text-sm md:text-base text-foreground/85 space-y-2">
                <li>
                  Browse Folksongs, Folktales, Ritual Practices and Material
                  Culture
                </li>
                <li>
                  Each entry displays its consent level — Public, Restricted, or
                  Confidential
                </li>
                <li>
                  Access detailed descriptions, audio clips, videos and cultural
                  content
                </li>
                <li>Save stories to your collection for future learning</li>
              </ul>
            </div>

            <div className="group relative rounded-2xl p-8 bg-card border-2 hover:border-primary/50 transition-all hover:shadow-xl">
              <div className="mb-6 w-full h-56 rounded-xl overflow-hidden border-2 border-primary/20">
                <img
                  src="/contribute.jpg"
                  alt="Contribute to cultural preservation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  2
                </span>
                <h3 className="text-xl md:text-2xl font-semibold">
                  Contribute Ethically
                </h3>
              </div>
              <ul className="list-disc pl-5 text-sm md:text-base text-foreground/85 space-y-2">
                <li>
                  Share your own cultural content as text, image, audio, or
                  video
                </li>
                <li>
                  Ensure you have clear community consent before uploading
                </li>
                <li>
                  Fill in required metadata: category, tribe, region, and
                  description
                </li>
                <li>Upload consent document and select sensitivity level</li>
              </ul>
            </div>

            <div className="group relative rounded-2xl p-8 bg-card border-2 hover:border-primary/50 transition-all hover:shadow-xl">
              <div className="mb-6 w-full h-56 rounded-xl overflow-hidden border-2 border-primary/20">
                <img
                  src="/follow.jpg"
                  alt="Follow our cultural preservation roadmap"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  3
                </span>
                <h3 className="text-xl md:text-2xl font-semibold">
                  Follow the Roadmap
                </h3>
              </div>
              <ul className="list-disc pl-5 text-sm md:text-base text-foreground/85 space-y-2">
                <li>Collection: Gathering Folk Stories with consent</li>
                <li>Verification: Elders and experts ensure accuracy</li>
                <li>
                  Publication: Approved items published with tiered access
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/explore">Start Exploring</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="px-8">
              <Link to="/upload">Contribute a Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section
        ref={roadmapRef}
        className="relative py-20 md:py-32 bg-muted/30 border-t border-border/60"
      >
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold heading-accent inline-block">
              Heritage Repository Roadmap
            </h2>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              A clear path from collection to publication — transparent,
              consent-based, and authentic.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-2/5 flex-shrink-0">
                <div className="w-full h-72 rounded-2xl overflow-hidden border-4 border-primary/30 shadow-xl">
                  <img
                    src="/collection.jpg"
                    alt="Collection of cultural artifacts"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                    1
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">
                    Collection
                  </h3>
                </div>
                <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                  Community members document Folksongs, Folktales, Ritual
                  Practices and Material Culture with informed consent from the
                  knowledge holders.
                </p>
                <p className="mt-4 text-sm md:text-base text-muted-foreground italic">
                  Goal: Preserve Cultural Heritage Ethically
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 items-start">
              <div className="md:w-2/5 flex-shrink-0">
                <div className="w-full h-auto rounded-2xl overflow-hidden border-4 border-primary/30 shadow-xl">
                  <img
                    src="/verification02.jpg"
                    alt="Verification process by community elders"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                    2
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">
                    Verification
                  </h3>
                </div>
                <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                  Community elders and cultural experts carefully review each
                  submission for accuracy, sensitivity, and cultural integrity.
                </p>
                <p className="mt-4 text-sm md:text-base text-muted-foreground italic">
                  Goal: Ensure Authenticity and Ethical Handling
                </p>
              </div>
            </div>
            {/* 
<div className="flex flex-col md:flex-row-reverse gap-8 items-center">
  <div className="md:w-2/5 flex-shrink-0">
    <div className="w-full h-auto rounded-2xl overflow-hidden border-4 border-primary/30 shadow-xl">
      <img 
        src="/verification02.jpg"
        alt="Verification process by community elders"
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  </div>
  
  <div className="flex-1">
    <div className="inline-flex items-center gap-3 mb-4">
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl">2</span>
      <h3 className="text-2xl md:text-3xl font-bold text-primary">Verification</h3>
    </div>
    <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
      Community elders and cultural experts carefully review each submission for accuracy, sensitivity, and cultural integrity.
    </p>
    <p className="mt-4 text-sm md:text-base text-muted-foreground italic">
      Goal: Ensure Authenticity and Ethical Handling
    </p>
  </div>
</div> */}

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-2/5 flex-shrink-0">
                <div className="w-full h-72 rounded-2xl overflow-hidden border-4 border-primary/30 shadow-xl">
                  <img
                    src="/publication.jpg"
                    alt="Publication with tiered access"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                    3
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">
                    Publication
                  </h3>
                </div>
                <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-4">
                  Once verified, the content is published in the Repository with
                  tiered access:
                </p>
                <ul className="space-y-2 text-base md:text-lg">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500">
                      Public
                    </Badge>
                    <span className="text-foreground/85">
                      Open for all viewers
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-500">
                      Restricted
                    </Badge>
                    <span className="text-foreground/85">
                      Limited to researchers/learners
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-500">
                      Confidential
                    </Badge>
                    <span className="text-foreground/85">
                      Accessible only to designated custodians
                    </span>
                  </li>
                </ul>
                <p className="mt-4 text-sm md:text-base text-muted-foreground italic">
                  Goal: Protect Cultural Knowledge while promoting awareness and
                  continuity
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photos from Archive - with Lightbox */}
      <section
        ref={visualsRef}
        className="relative py-20 md:py-32 bg-background border-t border-border/60"
      >
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold heading-accent inline-block">
              Photos from the Archive
            </h2>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              A glimpse of real visual stories. Click any image to view in full
              screen.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {archivePhotos.map((photo, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border-2 border-border hover:border-primary/50 bg-card cursor-pointer transition-all hover:shadow-2xl"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="text-base md:text-lg font-medium text-foreground mb-3">
                    {photo.caption}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {photo.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs ">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                    Click to view
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/explore">Explore More</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="px-8">
              <Link to="/upload">Contribute a Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {selectedImage !== null && (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <div className="relative max-w-6xl max-h-[80vh] w-full">
                <img
                  src={archivePhotos[selectedImage].src}
                  alt={archivePhotos[selectedImage].caption}
                  className="w-full h-full object-contain rounded-lg"
                />

                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>

                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="mt-6 text-center max-w-2xl">
                <p className="text-white text-lg md:text-xl font-medium mb-3">
                  {archivePhotos[selectedImage].caption}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {archivePhotos[selectedImage].tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/10 text-white border-white/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-white/60 text-sm mt-4">
                  {selectedImage + 1} / {archivePhotos.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Final CTA */}
      <section className="relative py-20 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-4xl font-bold mb-4">
            Join us in safeguarding living heritage
          </h3>
          <p className="text-base md:text-lg text-muted-foreground mb-8">
            Your curiosity and care help traditions thrive for generations to
            come.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/explore">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
