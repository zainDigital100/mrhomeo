import { Link } from "react-router-dom";
import { Leaf, Heart, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
            <span className="text-xl font-display font-semibold text-foreground">
              Mr <span className="text-primary">Homeo</span>
            </span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-4">
              Your AI-powered homeopathic consultant. Get instant, natural remedy suggestions 
              tailored to your symptoms, backed by centuries of holistic wisdom.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@mrhomeo.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/diseases", label: "Browse Diseases" },
                { to: "/ai-treatment", label: "AI Treatment" },
                { to: "/about", label: "About Us" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                "What is Homeopathy?",
                "How AI Works",
                "Safety Guidelines",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="bg-secondary/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Medical Disclaimer:</strong> This platform provides 
              educational information only and does not replace professional medical advice, diagnosis, 
              or treatment. Always consult a licensed healthcare provider before taking any medication.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Mr Homeo. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for natural healing
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
