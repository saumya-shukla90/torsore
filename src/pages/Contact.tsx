import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent", description: "We will contact you shortly." });
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <Layout>
      <section className="relative h-64 md:h-80 bg-secondary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1525120334885-38f4ec7ee422?w=1920&h=600&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 mt-6">Contact Us</h1>
            <p className="text-white/80 text-lg">We’re here for sizing, styling, and custom orders</p>
          </div>
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8" />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={submit}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <Input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <Textarea rows={5} placeholder="Your message" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <Button type="submit" className="w-full">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Studio Address</div>
                    <div className="text-sm text-muted-foreground">Luxury Lane, Fashion District, Mumbai, India</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">+91 90000 00000</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">support@torsore.com</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Hours</div>
                    <div className="text-sm text-muted-foreground">Mon–Sat: 10:00–19:00 IST</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
