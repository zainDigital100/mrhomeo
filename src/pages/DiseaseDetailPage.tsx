import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getDiseaseById } from "@/data/diseases";
import { 
  ArrowLeft, 
  AlertCircle, 
  Pill, 
  Leaf, 
  Heart, 
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Stethoscope
} from "lucide-react";

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

export default function DiseaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const disease = getDiseaseById(id || "");

  if (!disease) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">
            Disease Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The condition you're looking for doesn't exist in our database.
          </p>
          <Link to="/diseases">
            <Button variant="default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Disease Library
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 md:py-16 bg-gradient-hero border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Back Button */}
            <motion.div variants={fadeInUp} className="mb-6">
              <Link to="/diseases">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Library
                </Button>
              </Link>
            </motion.div>

            {/* Category */}
            <motion.span 
              variants={fadeInUp}
              className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4"
            >
              {disease.category}
            </motion.span>

            {/* Title */}
            <motion.h1 
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
            >
              {disease.name}
            </motion.h1>

            {/* Summary */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl"
            >
              {disease.summary}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-12"
            >
              {/* Overview */}
              <motion.div variants={fadeInUp} className="prose-section">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Overview</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {disease.overview}
                </p>
              </motion.div>

              {/* Causes */}
              <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Causes & Risk Factors</h2>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {disease.causes.map((cause, index) => (
                    <li key={index} className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{cause}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Symptoms */}
              <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Symptoms</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Early Symptoms */}
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      Early Symptoms
                    </h3>
                    <ul className="space-y-2">
                      {disease.earlySymptoms.map((symptom, index) => (
                        <li key={index} className="text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Advanced Symptoms */}
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive"></span>
                      Advanced Symptoms
                    </h3>
                    <ul className="space-y-2">
                      {disease.advancedSymptoms.map((symptom, index) => (
                        <li key={index} className="text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-destructive">•</span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Homeopathic Perspective */}
              <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Homeopathic Perspective</h2>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-6 border border-primary/10">
                  <p className="text-foreground leading-relaxed">
                    {disease.homeopathicPerspective}
                  </p>
                </div>
              </motion.div>

              {/* Homeopathic Medicines */}
              <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <Pill className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Homeopathic Medicines</h2>
                </div>
                <div className="space-y-4">
                  {disease.medicines.map((medicine, index) => (
                    <div key={index} className="bg-card rounded-2xl p-6 border border-border hover:border-primary/20 transition-colors">
                      <h3 className="text-lg font-display font-semibold text-primary mb-2">
                        {medicine.name}
                      </h3>
                      <div className="mb-3">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Key Indications</p>
                        <p className="text-foreground text-sm">{medicine.indications}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Usage Guidance</p>
                        <p className="text-muted-foreground text-sm">{medicine.guidance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Lifestyle Tips */}
              <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Heart className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Lifestyle & Prevention Tips</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {disease.lifestyleTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* When to Consult */}
              <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">When to Consult a Doctor</h2>
                </div>
                <div className="bg-destructive/5 rounded-2xl p-6 border border-destructive/20">
                  <ul className="space-y-3">
                    {disease.whenToConsult.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Disclaimer */}
              <motion.div variants={fadeInUp} className="bg-muted rounded-2xl p-6 border border-border">
                <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Medical Disclaimer
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  This information is provided for educational purposes only and should not be used for 
                  self-diagnosis or self-treatment. Homeopathic remedies should be taken under the guidance 
                  of a qualified homeopathic practitioner. Always consult a licensed healthcare provider 
                  before starting any treatment, especially if you are pregnant, nursing, taking medications, 
                  or have a medical condition.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeInUp} className="text-center pt-8">
                <p className="text-muted-foreground mb-4">
                  Want personalized guidance for your symptoms?
                </p>
                <Link to="/ai-treatment">
                  <Button variant="hero" size="lg">
                    Try AI Consultation
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
