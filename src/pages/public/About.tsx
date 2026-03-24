import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Users,
  Lock,
  Heart,
  BookOpen,
  Globe,
  CheckCircle2,
  Sparkles,
  Linkedin,
} from "lucide-react";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {/* Hero Section with Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24 px-4">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
          <div className=" mx-auto max-w-6xl relative z-10">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Ethical Cultural Preservation
              </Badge>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary tracking-tight">
                Preserving Heritage,
                <br />
                <span className="text-foreground">Honoring Voices</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                A consent-based digital archive dedicated to preserving and
                sharing indigenous cultural heritage through community-led
                documentation and ethical stewardship.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-20 px-4 bg-background">
          <div className="mx-auto max-w-6xl space-y-16">
            <Separator className="my-12" />

            {/* Testimonial Section */}
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
                  Our Story
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Born from fieldwork and community voices
                </p>
              </div>

              <Card className="border-2 bg-gradient-to-br from-primary/5 to-background">
                <CardContent className="pt-6 px-6 sm:px-8 md:px-10">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-primary">
                        Genesis of CBT-Heritage Repository
                      </h3>
                    </div>
                    <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                      <p>
                        The website was conceptualised based on extensive
                        fieldwork that revealed how Naga oral traditions vary
                        across generations and even within the same village,
                        raising concerns about cultural dilution and the loss of
                        memory. Community members consistently expressed the
                        need for a reliable, culturally sensitive digital
                        platform that could preserve oral histories while
                        preventing misrepresentation and distortion.
                      </p>
                      <p>
                        In response, the{" "}
                        <span className="font-semibold text-foreground">
                          Consent-Based, Tiered Digital Heritage Repository
                          (CBT-Heritage)
                        </span>{" "}
                        was developed to ensure that verified,
                        community-approved, and ethically archived cultural
                        content is maintained. This repository aims to protect
                        sensitive materials, support meaningful research
                        engagement, and empower communities to shape the digital
                        preservation of their heritage, serving both as an
                        academic resource and a cultural safeguard.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="my-12" />

            {/* Team Section */}
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
                  Meet Our Team
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Dedicated scholars committed to ethical cultural preservation
                </p>
              </div>

              <div className="space-y-8">
                {/* Founder */}
                <Card className="border-2 hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="grid md:grid-cols-[300px_1fr] gap-8 p-8">
                    <div className="flex justify-center items-start">
                      <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-xl overflow-hidden border-4 border-primary/30 shadow-lg">
                        <img
                          src="/founders/moamenla_longkumer.jpg"
                          alt="Moamenla Longkumer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <Badge
                            variant="secondary"
                            className="text-sm font-semibold"
                          >
                            Founder
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                          Moamenla Longkumer
                        </h3>
                        <p className="text-base md:text-lg font-semibold text-primary/80 mb-3">
                          Founder & PhD Scholar
                        </p>
                        <Badge variant="outline" className="text-sm">
                          Liberal Arts Department, CHRIST University
                        </Badge>
                      </div>
                      <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                        PhD scholar in the Liberal Arts Department at CHRIST
                        (Deemed to be University). The area of research includes
                        Memory Studies, Identity Studies, Gender Studies, Myths,
                        Folklore, Folktales, Oral Tradition, and Ethnographic
                        Studies.
                      </p>
                      <div className="flex gap-3 mt-4">
                        <a
                          href="https://www.linkedin.com/in/moamenla-longkumer-phd-a54418175/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            Connect on LinkedIn
                          </span>
                          <span className="sm:hidden">LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Co-Founder 1 */}
                <Card className="border-2 hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="grid md:grid-cols-[300px_1fr] gap-8 p-8">
                    <div className="flex justify-center items-start">
                      <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-xl overflow-hidden border-4 border-primary/30 shadow-lg">
                        <img
                          src="/founders/dr_prerana_srimaal.png"
                          alt="Dr Prerana Srimaal"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <Badge
                            variant="secondary"
                            className="text-sm font-semibold"
                          >
                            Co-Founder
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                          Dr Prerana Srimaal
                        </h3>
                        <p className="text-base md:text-lg font-semibold text-primary/80 mb-3">
                          Co-Founder & Head of Department
                        </p>
                        <Badge variant="outline" className="text-sm mb-2">
                          Liberal Arts Department, CHRIST University
                        </Badge>
                      </div>
                      <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                        Head, Department of Liberal Arts, CHRIST (Deemed to Be
                        University), Bannerghatta Road Campus. Doctorate from
                        the Centre for Historical Studies, Jawaharlal Nehru
                        University, New Delhi. Dr Srimaal leads three major
                        projects with the ASI, ICSSR, and Indo-Korea Science and
                        Technology Centre focusing on documenting 1000 heritage
                        sites in Bangalore. Collaborated on a project with the
                        Ford Foundation at the American University in Cairo.
                        Currently writing a two-volume book with Routledge on
                        the intersection of political dynamics, technology, and
                        social innovation.
                      </p>
                      <div className="flex gap-3 mt-4">
                        <a
                          href="https://www.linkedin.com/in/prerana-srimaal-phd-79226b38/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            Connect on LinkedIn
                          </span>
                          <span className="sm:hidden">LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Co-Founder 2 */}
                <Card className="border-2 hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="grid md:grid-cols-[300px_1fr] gap-8 p-8">
                    <div className="flex justify-center items-start">
                      <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-xl overflow-hidden border-4 border-primary/30 shadow-lg">
                        <img
                          src="/founders/laldinpuia_hmar.jpg"
                          alt="Laldinpuia Hmar"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <Badge
                            variant="secondary"
                            className="text-sm font-semibold"
                          >
                            Co-Founder
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                          Laldinpuia Hmar
                        </h3>
                        <p className="text-base md:text-lg font-semibold text-primary/80 mb-3">
                          Co-Founder, AI Engineer & Faculty Member
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-sm">
                            AI Engineer, LushAITech
                          </Badge>
                          <Badge variant="outline" className="text-sm">
                            Faculty, CHRIST University
                          </Badge>
                        </div>
                      </div>
                      <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                        AI Engineer at LushAITech and faculty member in the
                        Department of Liberal Arts at CHRIST (Deemed to Be
                        University), Bannerghatta Road Campus. Brings technical
                        expertise in artificial intelligence and digital
                        solutions to the ethical preservation of cultural
                        heritage.
                      </p>
                      <div className="flex gap-3 mt-4">
                        <a
                          href="https://www.linkedin.com/in/laldinpuia-hmar/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            Connect on LinkedIn
                          </span>
                          <span className="sm:hidden">LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Separator className="my-12" />

            {/* What We Do */}
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
                  What We Do
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Bridging tradition and technology to preserve cultural
                  knowledge for future generations
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Globe className="h-10 w-10 text-primary mb-3" />
                    <CardTitle>Community-Led Documentation</CardTitle>
                    <CardDescription>
                      We work directly with indigenous communities to document
                      folktales, folksongs, folk dances, ritual practices, and
                      material culture using modern tools like 3D scanning,
                      drone imaging, and high-resolution recording.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Shield className="h-10 w-10 text-primary mb-3" />
                    <CardTitle>Ethical Consent Framework</CardTitle>
                    <CardDescription>
                      Every piece of content is stored and shared only with
                      explicit consent from knowledge holders. Cultural
                      materials undergo verification by elders and scholars,
                      maintaining authenticity and ownership.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Lock className="h-10 w-10 text-primary mb-3" />
                    <CardTitle>Tiered Access Control</CardTitle>
                    <CardDescription>
                      Content is classified as public, restricted, or
                      confidential to protect sacred knowledge. This ensures
                      cultural sensitivity while making appropriate materials
                      accessible for education and research.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Heart className="h-10 w-10 text-primary mb-3" />
                    <CardTitle>Cultural Respect & Sensitivity</CardTitle>
                    <CardDescription>
                      We encourage viewers to approach content with awareness
                      and respect for its deep ancestral and communal
                      significance. Sacred materials require special permission
                      and understanding.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            <Separator className="my-12" />

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Our Mission</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed text-foreground/80">
                    Build an accessible, community-informed archive that honors
                    traditional knowledge, supports cultural continuity, and
                    empowers the next generation with authentic resources rooted
                    in their heritage.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Users className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Our Approach</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed text-foreground/80">
                    Work closely with community members, elders, and cultural
                    practitioners to ensure respectful representation,
                    appropriate sensitivity, and community governance over
                    cultural materials.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Separator className="my-12" />

            {/* Core Values */}
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
                  Our Core Values
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Guided by ethical principles and community empowerment
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Consent-First",
                    description:
                      "Every entry is published only with informed permission and clear terms of sharing. Knowledge holders maintain control over their cultural materials.",
                  },
                  {
                    icon: Users,
                    title: "Community-Led",
                    description:
                      "Curation and verification are guided by community elders, scholars, and culture bearers who understand the true context and significance.",
                  },
                  {
                    icon: Lock,
                    title: "Cultural Care",
                    description:
                      "Sensitive materials are protected through tiered access levels and cultural safeguards that respect sacred knowledge.",
                  },
                  {
                    icon: Heart,
                    title: "Respectful Stewardship",
                    description:
                      "We handle all cultural materials with deep respect, understanding their ancestral significance and living importance to communities.",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Verified Authenticity",
                    description:
                      "All content undergoes cultural verification by recognized elders and scholars to ensure accuracy and proper representation.",
                  },
                  {
                    icon: Globe,
                    title: "Empowered Access",
                    description:
                      "Communities maintain ownership and control of their heritage in the digital space, supporting continuity, not erasure.",
                  },
                ].map((value, index) => (
                  <Card
                    key={index}
                    className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-primary/50"
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <value.icon className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {value.title}
                          </h3>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {value.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cultural Sensitivity Notice */}
            <Card className="border-2 border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Heart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-orange-900 dark:text-orange-100">
                      A Note on Cultural Sensitivity
                    </CardTitle>
                    <CardDescription className="text-orange-800/80 dark:text-orange-200/80 text-base leading-relaxed">
                      Viewers are encouraged to approach all content with
                      awareness and cultural sensitivity. If any practices feel
                      too personal or sacred, you may skip or exit. Otherwise,
                      proceed with respect for the deep ancestral and communal
                      significance these materials hold.
                    </CardDescription>
                    <CardDescription className="text-orange-800/80 dark:text-orange-200/80 text-base leading-relaxed font-semibold mt-3">
                      This repository empowers communities to manage and control
                      their heritage in the digital space—supporting continuity,
                      not erasure.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Call to Action */}
            <div className="text-center space-y-6 py-8">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                Join Us in Preserving Cultural Heritage
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Together, we can ensure that indigenous knowledge, traditions,
                and stories are preserved with dignity and shared with respect
                for future generations.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Badge variant="outline" className="text-base px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Ethical
                </Badge>
                <Badge variant="outline" className="text-base px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Community-Driven
                </Badge>
                <Badge variant="outline" className="text-base px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Respectful
                </Badge>
                <Badge variant="outline" className="text-base px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Authentic
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
