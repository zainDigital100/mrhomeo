import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Search, ArrowRight, Filter, Loader2, Sparkles, Activity } from "lucide-react";

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
    transition: { staggerChildren: 0.03 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchDiseases();
  }, []);

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
    
    // Scroll to results section after a brief delay to allow filtering
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <Layout>
      {/* Header with wave pattern */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-hero overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 wave-pattern opacity-50" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Comprehensive Library</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-4"
            >
              Disease Library
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4"
            >
              Explore our comprehensive collection of <span className="text-primary font-semibold">{diseases.length}+</span> health conditions and their 
              homeopathic treatments.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={fadeInUp} className="relative max-w-xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search diseases, symptoms, or categories..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedLetter(null);
                  }}
                  className="pl-12 h-12 sm:h-14 rounded-2xl text-base sm:text-lg border-2 border-border focus:border-primary bg-card/90 backdrop-blur-sm shadow-soft focus:shadow-card transition-all"
                  aria-label="Search diseases"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Alphabet Index & Filters */}
      <section className="py-4 sm:py-6 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-lg z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Alphabet */}
            <div className="flex flex-wrap justify-center gap-0.5 sm:gap-1">
              {alphabet.map((letter) => {
                const hasItems = diseases.some(d => 
                  d.name.toLowerCase().startsWith(letter.toLowerCase())
                );
                const isSelected = selectedLetter === letter;
                
                return (
                  <motion.button
                    key={letter}
                    whileHover={hasItems ? { scale: 1.1 } : {}}
                    whileTap={hasItems ? { scale: 0.95 } : {}}
                    onClick={() => hasItems && handleLetterClick(letter)}
                    disabled={!hasItems}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? "gradient-primary text-primary-foreground shadow-soft"
                        : hasItems
                        ? "hover:bg-accent text-foreground hover:shadow-soft"
                        : "text-muted-foreground/30 cursor-not-allowed"
                    }`}
                    aria-label={`Filter by letter ${letter}`}
                  >
                    {letter}
                  </motion.button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex rounded-lg border border-border overflow-hidden">
                <Button
                  variant={sortOrder === "asc" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSortOrder("asc")}
                  className="rounded-none border-0"
                >
                  A → Z
                </Button>
                <Button
                  variant={sortOrder === "desc" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSortOrder("desc")}
                  className="rounded-none border-0 border-l"
                >
                  Z → A
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section ref={resultsRef} className="py-8 sm:py-12 md:py-16 scroll-mt-32">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 sm:mb-8 flex items-center justify-between flex-wrap gap-2"
          >
            <p className="text-sm sm:text-base text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{filteredDiseases.length}</span> conditions
              {selectedLetter && <span className="text-primary"> starting with "{selectedLetter}"</span>}
              {searchQuery && <span className="text-primary"> matching "{searchQuery}"</span>}
            </p>
            
            {(selectedLetter || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLetter(null);
                }}
                className="text-primary"
              >
                Clear filters
              </Button>
            )}
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-10 h-10 text-primary" />
              </motion.div>
              <p className="text-muted-foreground">Loading conditions...</p>
            </div>
          ) : filteredDiseases.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredDiseases.map((disease) => (
                  <motion.div
                    key={disease.id}
                    variants={cardVariants}
                    layout
                    className="group"
                    onMouseEnter={() => setHoveredCard(disease.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Link to={`/diseases/${disease.slug}`}>
                      <motion.article 
                        className="bg-card rounded-2xl p-5 sm:p-6 h-full shadow-soft border border-border flex flex-col relative overflow-hidden cursor-pointer"
                        whileHover={{ 
                          y: -4, 
                          boxShadow: "0 20px 50px -15px hsl(160 40% 40% / 0.18)",
                          borderColor: "hsl(160 84% 39% / 0.3)"
                        }}
                        whileTap={{ 
                          scale: 0.97,
                          y: 0,
                          transition: { duration: 0.1 }
                        }}
                        transition={{ 
                          duration: 0.3,
                          type: "spring",
                          stiffness: 400,
                          damping: 25
                        }}
                      >
                        {/* Hover glow effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 pointer-events-none"
                          animate={{ opacity: hoveredCard === disease.id ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Category Badge */}
                        <motion.span 
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-4 w-fit relative z-10"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Activity className="w-3 h-3" />
                          {disease.category}
                        </motion.span>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors relative z-10">
                          {disease.name}
                        </h3>

                        {/* Summary */}
                        <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-2 relative z-10">
                          {disease.summary}
                        </p>

                        {/* Symptoms Preview */}
                        <div className="mb-4 relative z-10">
                          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-2">Common Symptoms</p>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {disease.symptoms.slice(0, 3).map((symptom) => (
                              <span
                                key={symptom}
                                className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs truncate max-w-[120px]"
                              >
                                {symptom}
                              </span>
                            ))}
                            {disease.symptoms.length > 3 && (
                              <span className="px-2 py-1 text-xs text-primary font-medium">
                                +{disease.symptoms.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Read More */}
                        <motion.div 
                          className="flex items-center gap-2 text-primary font-medium text-sm relative z-10"
                          animate={{ x: hoveredCard === disease.id ? 4 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          Read Full Article
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </motion.article>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg mb-4">
                {diseases.length === 0 
                  ? "Loading disease articles..."
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
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
