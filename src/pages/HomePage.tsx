import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Clock, 
  Leaf,
  Heart,
  Users,
  Zap,
  CheckCircle2,
  MessageCircle
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const principles = [
  {
    icon: Leaf,
    title: "Like Cures Like",
    description: "A substance that causes symptoms in a healthy person can treat similar symptoms in illness."
  },
  {
    icon: Zap,
    title: "Minimum Dose",
    description: "Highly diluted remedies stimulate the body's natural healing response gently and effectively."
  },
  {
    icon: Heart,
    title: "Whole Person",
    description: "Treatment considers physical, emotional, and mental aspects for truly personalized care."
  }
];

const benefits = [
  { value: "100%", label: "Natural", desc: "Plant & mineral based" },
  { value: "200+", label: "Years", desc: "Of holistic practice" },
  { value: "5M+", label: "Users", desc: "Trust homeopathy" },
  { value: "24/7", label: "Available", desc: "AI-powered support" }
];

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        
        {/* Subtle decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-accent/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div variants={fadeIn}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  AI-Powered Homeopathy
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1 
                variants={fadeIn}
                className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground leading-[1.1]"
              >
                Natural Healing,{" "}
                <span className="text-primary">Modern Wisdom</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                variants={fadeIn}
                className="text-lg text-muted-foreground max-w-xl leading-relaxed"
              >
                Your personal AI homeopathic consultant. Get instant, natural remedy 
                suggestions tailored to your symptoms—backed by centuries of holistic practice.
              </motion.p>

              {/* CTAs */}
              <motion.div 
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <Link to="/ai-treatment">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Start Consultation
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/diseases">
                  <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                    Browse Diseases
                  </Button>
                </Link>
              </motion.div>

              {/* Quick stats */}
              <motion.div 
                variants={fadeIn}
                className="flex flex-wrap gap-6 pt-6"
              >
                {[
                  { icon: Zap, text: "Instant Analysis" },
                  { icon: Shield, text: "100% Private" },
                  { icon: Clock, text: "Always Available" }
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="w-4 h-4 text-primary" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              The Foundations of Homeopathy
            </h2>
            <p className="text-muted-foreground text-lg">
              A gentle, holistic approach to healing that has helped millions worldwide for over two centuries.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border/50 card-interactive"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <principle.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-5">
                Gentle, Natural, Effective
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Homeopathy works with your body's natural healing abilities, offering 
                a safe alternative for the whole family—from infants to elderly.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Safe for all ages including infants and pregnant women",
                  "No known harmful side effects or drug interactions",
                  "Addresses root causes, not just symptoms",
                  "Personalized treatment for your unique constitution"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {benefits.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 text-center shadow-soft border border-border/50"
                >
                  <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Your Safety Matters</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              This platform provides educational information about homeopathy and natural remedies. 
              It does not replace professional medical advice, diagnosis, or treatment. 
              Always consult a licensed healthcare provider for serious health concerns.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary/5 rounded-3xl p-8 md:p-14 text-center border border-primary/10"
          >
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Ready to Explore Natural Healing?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start a free consultation with our AI and discover personalized homeopathic remedies for your symptoms.
              </p>
              <Link to="/ai-treatment">
                <Button variant="hero" size="xl" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Start Free Consultation
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
