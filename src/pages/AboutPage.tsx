import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Brain, Shield, Heart, Users, Sparkles, CheckCircle, ArrowRight, BookOpen, MessageSquare } from "lucide-react";
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0
  }
};
const staggerContainer = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
export default function AboutPage() {
  return <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-elevated">
                <Leaf className="w-10 h-10 text-primary-foreground" />
              </div>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">About Mr Homeo</motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground">
              Ancient healing wisdom meets modern AI.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{
            once: true
          }} variants={staggerContainer}>
              <motion.span variants={fadeInUp} className="text-primary font-medium text-sm uppercase tracking-wider">
                Our Mission
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-bold text-foreground mt-4 mb-6">
                Empowering Natural Health Choices
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-lg">
                Combining homeopathic principles with AI to provide personalized, educational health guidance—complementing, not replacing, professional care.
              </motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{
            once: true
          }} variants={staggerContainer} className="grid grid-cols-2 gap-4">
              {[{
              icon: Heart,
              label: "Compassionate Care",
              desc: "Treating every person with empathy"
            }, {
              icon: Leaf,
              label: "Natural Approach",
              desc: "Gentle, holistic remedies"
            }, {
              icon: Brain,
              label: "AI Powered",
              desc: "Intelligent symptom analysis"
            }, {
              icon: Shield,
              label: "Safe & Ethical",
              desc: "Your safety comes first"
            }].map((item, index) => <motion.div key={item.label} variants={fadeInUp} className={`bg-card rounded-2xl p-6 shadow-card border border-border ${index === 1 || index === 2 ? "mt-8" : ""}`}>
                  <item.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>)}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How AI Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="text-center max-w-3xl mx-auto mb-16">
            <motion.span variants={fadeInUp} className="text-primary font-medium text-sm uppercase tracking-wider">
              How It Works
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-bold text-foreground mt-4 mb-6">
              AI-Powered Health Guidance
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg">
              AI trained on comprehensive homeopathic knowledge.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            step: "01",
            title: "Share Symptoms",
            description: "Describe how you're feeling or upload medical reports.",
            icon: MessageSquare
          }, {
            step: "02",
            title: "AI Analysis",
            description: "AI identifies patterns and potential remedies.",
            icon: Brain
          }, {
            step: "03",
            title: "Get Guidance",
            description: "Receive personalized remedy and lifestyle suggestions.",
            icon: Sparkles
          }].map(item => <motion.div key={item.step} variants={fadeInUp} className="relative">
                <div className="bg-card rounded-2xl p-8 h-full shadow-card border border-border">
                  <div className="text-6xl font-display font-bold absolute top-4 right-6 text-slate-900">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>)}
          </motion.div>
        </div>
      </section>

      {/* Ethics & Safety */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Ethics & Safety First
              </h2>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Not a replacement for medical professionals", "No cure guarantees", "Call emergency services for emergencies", "Consult professionals for serious symptoms", "Educational only—never prescriptive", "Your privacy is protected"].map((item, index) => <motion.div key={index} variants={fadeInUp} className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground text-sm">{item}</span>
                </motion.div>)}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="text-center max-w-3xl mx-auto">
            <motion.span variants={fadeInUp} className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Vision
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-bold text-foreground mt-4 mb-6">
              Informed Health Choices for All
            </motion.h2>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Link to="/ai-treatment">
                <Button variant="hero" size="lg">
                  Try AI Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/diseases">
                <Button variant="hero-outline" size="lg">
                  <BookOpen className="w-5 h-5" />
                  Browse Disease Library
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact/Feedback */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="text-center max-w-2xl mx-auto">
            <motion.div variants={fadeInUp}>
              <Users className="w-12 h-12 text-primary mx-auto mb-6" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl font-display font-bold text-foreground mb-6">
              Questions or Feedback?
            </motion.h2>
            <motion.div variants={fadeInUp}>
              <a href="mailto:contact@holisticai.com">
                <Button variant="secondary" size="lg">
                  Contact Us
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>;
}