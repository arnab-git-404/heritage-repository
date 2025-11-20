import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Form submitted! We'll get back to you soon.");
    alert("Function will Be implemented soon.");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more..." 
                    rows={5}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">moamen2lkr@gmail.com </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">+91 977510xxxx</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm IST</p>
                  </div>
                </div>


                <div className="flex items-start gap-3">
  <MapPin className="h-5 w-5 mt-1 text-primary" />
  <div className="w-full">
    <h3 className="font-semibold">Address</h3>
    <p className="text-muted-foreground mb-3">
      CHRIST (Deemed to be University)<br/>
      VHHW+48F, Bannerghatta Rd, Pai Layout<br/>
      Hulimavu, Bengaluru,<br/> 
      Karnataka 560076
    </p>
    
    {/* Embedded Map */}
 <div className="mt-3 rounded-lg overflow-hidden border">
  <iframe

src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.5324816772254!2d77.5932245748913!3d12.877813287428994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1532a4bd03d5%3A0x315589772baa7a26!2sChrist%20University%20Bannerghatta%20Road%20Campus!5e1!3m2!1sen!2sin!4v1763659632332!5m2!1sen!2sin" 

    width="100%"
    height="300"
    className="w-full h-[300px] sm:h-[200px] md:h-[250px]"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="CHRIST University Location"
  />
</div>
    



    {/* Optional: View in Maps button */}
    <Button
      variant="outline"
      size="sm"
      className="mt-3 w-full"
      onClick={() => window.open(
      
        "https://maps.google.com/maps?ll=12.877813,77.5958&z=15&t=h&hl=en&gl=IN&mapclient=embed&cid=3554898625805580838",
        "_blank"
      )}
    >
      <MapPin className="h-3 w-3 mr-2" />
      Open in Google Maps
    </Button>
  </div>
</div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-muted-foreground">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We typically respond to all inquiries within 24-48 hours during business days.
                  For urgent matters, please call us directly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}