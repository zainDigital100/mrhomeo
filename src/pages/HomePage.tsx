import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { 
  Sparkles, 
  Leaf, 
  Heart, 
  Shield, 
  ArrowRight, 
  Brain, 
  Activity,
  Users,
  MessageSquare,
  CheckCircle,
  Zap
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/98 via-background/85 to-background/40 sm:from-background/95 sm:via-background/80 sm:to-transparent" />
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl hidden lg:block"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/3 w-48 h-48 bg-primary/5 rounded-full blur-3xl hidden lg:block"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-5 sm:space-y-6"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp}>
                <motion.span 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm text-secondary-foreground text-xs sm:text-sm font-medium border border-primary/10"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  AI-Powered Homeopathy
                </motion.span>
              </motion.div>

              {/* Heading */}
              <motion.h1 
                variants={fadeInUp}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight"
              >
                Natural Healing{" "}
                <span className="text-gradient">Meets Intelligence</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                variants={fadeInUp}
                className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl"
              >
                Get instant, personalized natural remedy suggestions for your symptoms.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
              >
                <Link to="/ai-treatment" className="w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="hero" size="xl" className="w-full sm:w-auto shadow-glow">
                      Start AI Consultation
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/diseases" className="w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                      Browse Disease
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              
              {/* Quick stats */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 sm:pt-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Instant Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>100% Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>24/7 Available</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Floating Feature Card */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="absolute right-8 bottom-24 hidden lg:block"
        >
          <motion.div 
            className="bg-card/95 backdrop-blur-md rounded-2xl p-6 shadow-elevated border border-border max-w-xs"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <motion.div 
                className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-soft"
                whileHover={{ rotate: 5 }}
              >
                <Heart className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Personalized Care</h4>
                <p className="text-sm text-muted-foreground">
                  Adapts to your unique symptoms and lifestyle.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* What is Homeopathy Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.span 
              variants={fadeInUp}
              className="text-primary font-medium text-sm uppercase tracking-wider"
            >
              Understanding Homeopathy
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-display font-bold text-foreground mt-4 mb-6"
            >
              What is Homeopathy?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-muted-foreground text-lg"
            >
              A natural healing system using highly diluted substances to stimulate your body's own healing.
            </motion.p>
          </motion.div>

          {/* Principles */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Leaf,
                title: "Like Cures Like",
                description: "Similar symptoms in healthy people can cure the same in sick people with minute doses."
              },
              {
                icon: Activity,
                title: "Minimum Dose",
                description: "Smallest effective dose for maximum healing with minimal side effects."
              },
              {
                icon: Brain,
                title: "Individualized",
                description: "Unique treatment based on your complete physical, mental & emotional state."
              }
            ].map((principle, index) => (
              <motion.div
                key={principle.title}
                variants={fadeInUp}
                className="group"
              >
                <div className="bg-card rounded-2xl p-8 h-full shadow-card hover:shadow-elevated transition-all duration-300 border border-border group-hover:border-primary/20">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <principle.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.span 
                variants={fadeInUp}
                className="text-primary font-medium text-sm uppercase tracking-wider"
              >
                Why Choose Homeopathy
              </motion.span>
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-display font-bold text-foreground mt-4 mb-6"
              >
                Gentle, Natural, Effective
              </motion.h2>
              <motion.ul variants={staggerContainer} className="space-y-4 mt-6">
                {[
                  "Safe for all ages—from infants to elderly",
                  "No known side effects when properly prescribed",
                  "Treats the root cause, not just symptoms",
                  "Works alongside conventional medicine",
                  "Affordable and accessible remedies"
                ].map((benefit) => (
                  <motion.li 
                    key={benefit}
                    variants={fadeInUp}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Shield, title: "Safe & Natural", value: "100%", desc: "Natural ingredients" },
                { icon: Users, title: "Trusted By", value: "500M+", desc: "People worldwide" },
                { icon: Activity, title: "Conditions", value: "1000+", desc: "Conditions treated" },
                { icon: MessageSquare, title: "AI Support", value: "24/7", desc: "Always available" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  variants={fadeInUp}
                  className={`bg-card rounded-2xl p-6 shadow-card border border-border ${
                    index === 1 || index === 2 ? "mt-8" : ""
                  }`}
                >
                  <stat.icon className="w-8 h-8 text-primary mb-4" />
                  <div className="text-2xl font-display font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6"
            >
              Your Safety is Our Priority
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-muted-foreground mb-6"
            >
              Educational guidance to complement professional healthcare.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-card rounded-xl p-6 shadow-card border border-border text-sm text-muted-foreground"
            >
              ⚠️ Educational only. Always consult a healthcare provider before making health decisions.
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.div variants={fadeInUp}>
              <Link to="/ai-treatment">
                <Button variant="hero" size="xl">
                  Start Free Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
