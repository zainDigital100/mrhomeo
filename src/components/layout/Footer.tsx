import { Link } from "react-router-dom";
import { Leaf, Mail, Heart, ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/40 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
                <Leaf className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-semibold text-foreground">
                Mr <span className="text-primary">Homeo</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-5">
              Your personal AI homeopathic consultant. Get instant, natural remedy 
              suggestions tailored to your symptoms, backed by centuries of holistic wisdom.
            </p>
            <a 
              href="mailto:contact@mrhomeo.com"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              contact@mrhomeo.com
            </a>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-display font-semibold text-foreground mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/diseases", label: "Disease Library" },
                { to: "/ai-treatment", label: "AI Consultation" },
                { to: "/about", label: "About Us" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-4">
            <h4 className="font-display font-semibold text-foreground mb-4">Learn More</h4>
            <ul className="space-y-2.5">
              {[
                "What is Homeopathy?",
                "How Our AI Works",
                "Safety Guidelines",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1 group">
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border/60">
          <div className="bg-accent/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              <strong className="text-foreground font-medium">Medical Disclaimer:</strong> This platform provides 
              educational information only and does not replace professional medical advice, diagnosis, 
              or treatment. Always consult a licensed healthcare provider.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Mr Homeo. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              Crafted with <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> for natural healing
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
