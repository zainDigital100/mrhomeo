import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Search, ArrowRight, Filter, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Disease {
  id: string;
  slug: string;
  name: string;
  summary: string;
  symptoms: string[];
  category: string;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  useEffect(() => {
    fetchDiseases();
  }, []);

  // Auto-generate diseases if less than 100 exist
  useEffect(() => {
    if (!isLoading && diseases.length < 100 && !isGenerating) {
      generateDiseases();
    }
  }, [isLoading, diseases.length]);

  const fetchDiseases = async () => {
    try {
      const { data, error } = await supabase
        .from('diseases')
        .select('id, slug, name, summary, symptoms, category')
        .order('name');

      if (error) throw error;
      setDiseases(data || []);
    } catch (error) {
      console.error('Error fetching diseases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDiseases = async () => {
    setIsGenerating(true);
    let batchStart = 0;
    const batchSize = 5;

    try {
      toast({
        title: "Generating Diseases",
        description: "This may take a few minutes. Please wait...",
      });

      while (true) {
        const { data, error } = await supabase.functions.invoke('generate-diseases', {
          body: { batchStart, batchSize }
        });

        if (error) {
          console.error('Generation error:', error);
          throw error;
        }

        console.log('Batch result:', data);

        if (data.remaining <= 0 || batchStart >= 120) {
          break;
        }

        batchStart = data.nextBatch;
        
        // Refresh the list after each batch
        await fetchDiseases();
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: "Generation Complete",
        description: "All diseases have been generated successfully!",
      });

      await fetchDiseases();
    } catch (error) {
      console.error('Error generating diseases:', error);
      toast({
        title: "Generation Error",
        description: "There was an error generating diseases. Some may have been created.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredDiseases = useMemo(() => {
    let result = diseases;

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      result = diseases.filter(
        disease =>
          disease.name.toLowerCase().includes(lowercaseQuery) ||
          disease.summary.toLowerCase().includes(lowercaseQuery) ||
          disease.symptoms.some(s => s.toLowerCase().includes(lowercaseQuery)) ||
          disease.category.toLowerCase().includes(lowercaseQuery)
      );
    } else if (selectedLetter) {
      result = diseases.filter(disease => 
        disease.name.toLowerCase().startsWith(selectedLetter.toLowerCase())
      );
    }

    return result.sort((a, b) => {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  }, [diseases, searchQuery, selectedLetter, sortOrder]);

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
    setSearchQuery("");
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 md:py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4"
            >
              Disease Library
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-8"
            >
              Explore our comprehensive collection of {diseases.length}+ health conditions and their 
              homeopathic treatments. Each article provides educational insights 
              into natural remedies.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={fadeInUp} className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search diseases, symptoms, or categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedLetter(null);
                }}
                className="pl-12 h-14 rounded-2xl text-lg border-2 border-border focus:border-primary bg-card"
              />
            </motion.div>

            {/* Auto-generation status */}
            {isGenerating && (
              <motion.div variants={fadeInUp} className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating disease database with AI... This may take a few minutes.</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Alphabet Index & Filters */}
      <section className="py-8 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Alphabet */}
            <div className="flex flex-wrap justify-center gap-1">
              {alphabet.map((letter) => {
                const hasItems = diseases.some(d => 
                  d.name.toLowerCase().startsWith(letter.toLowerCase())
                );
                return (
                  <button
                    key={letter}
                    onClick={() => hasItems && handleLetterClick(letter)}
                    disabled={!hasItems}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      selectedLetter === letter
                        ? "gradient-primary text-primary-foreground"
                        : hasItems
                        ? "hover:bg-accent text-foreground"
                        : "text-muted-foreground/40 cursor-not-allowed"
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Button
                variant={sortOrder === "asc" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortOrder("asc")}
              >
                A → Z
              </Button>
              <Button
                variant={sortOrder === "desc" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortOrder("desc")}
              >
                Z → A
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filteredDiseases.length}</span> conditions
              {selectedLetter && ` starting with "${selectedLetter}"`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredDiseases.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDiseases.map((disease) => (
                <motion.div
                  key={disease.id}
                  variants={fadeInUp}
                  className="group"
                >
                  <Link to={`/diseases/${disease.slug}`}>
                    <article className="bg-card rounded-2xl p-6 h-full shadow-soft hover:shadow-card transition-all duration-300 border border-border hover:border-primary/20 flex flex-col">
                      {/* Category Badge */}
                      <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-4 w-fit">
                        {disease.category}
                      </span>

                      {/* Title */}
                      <h3 className="text-xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {disease.name}
                      </h3>

                      {/* Summary */}
                      <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-2">
                        {disease.summary}
                      </p>

                      {/* Symptoms Preview */}
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Common Symptoms</p>
                        <div className="flex flex-wrap gap-2">
                          {disease.symptoms.slice(0, 3).map((symptom) => (
                            <span
                              key={symptom}
                              className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs"
                            >
                              {symptom}
                            </span>
                          ))}
                          {disease.symptoms.length > 3 && (
                            <span className="px-2 py-1 text-xs text-muted-foreground">
                              +{disease.symptoms.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Read More */}
                      <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                        Read Full Article
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                {diseases.length === 0 
                  ? "No diseases in the database yet. Click the button above to generate them!"
                  : "No diseases found matching your search."}
              </p>
              {diseases.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLetter(null);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
