import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Mic, MicOff, Loader2, Sparkles, ImagePlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImagePreview {
  id: string;
  file: File;
  preview: string;
  base64: string;
}

interface ChatInputProps {
  onSendMessage: (message: string, images?: { base64: string; mimeType: string }[]) => void;
  isLoading: boolean;
  disabled?: boolean;
  creditsPerImage?: number;
}

export function ChatInput({ onSendMessage, isLoading, disabled, creditsPerImage = 2 }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [inputValue]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Extract base64 data without the data URL prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImages(true);

    try {
      const newImages: ImagePreview[] = [];
      
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file.`,
            variant: "destructive"
          });
          continue;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast({
            title: "File too large",
            description: `${file.name} is larger than 10MB.`,
            variant: "destructive"
          });
          continue;
        }

        const base64 = await convertToBase64(file);
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview: URL.createObjectURL(file),
          base64
        });
      }

      setImages(prev => [...prev, ...newImages]);
      
      if (newImages.length > 0) {
        toast({
          title: `${newImages.length} image${newImages.length > 1 ? 's' : ''} added`,
          description: `Each image uses ${creditsPerImage} credits for analysis.`,
        });
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to process images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputValue.trim() && images.length === 0) || isLoading) return;

    const imageData = images.map(img => ({
      base64: img.base64,
      mimeType: img.file.type
    }));

    onSendMessage(inputValue.trim(), imageData.length > 0 ? imageData : undefined);
    setInputValue("");
    
    // Clean up image previews
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    setIsListening(!isListening);
    
    if (!isListening) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive"
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  const totalCreditsNeeded = images.length * creditsPerImage;

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-t border-border bg-card/80 backdrop-blur-xl px-3 sm:px-4 py-3 sm:py-4"
    >
      <div className="container mx-auto max-w-3xl">
        {/* Image Previews */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">
                  {images.length} image{images.length > 1 ? 's' : ''} attached
                </span>
                <span className="text-xs font-medium text-primary">
                  ({totalCreditsNeeded} credits will be used)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {images.map((img) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group"
                  >
                    <img
                      src={img.preview}
                      alt="Upload preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-border"
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="relative">
          <motion.div 
            className={`relative rounded-2xl border-2 transition-all duration-300 bg-background ${
              isFocused 
                ? "border-primary shadow-soft" 
                : "border-border"
            }`}
            animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
          >
            <textarea
              ref={inputRef}
              placeholder={images.length > 0 ? "Add a description or ask about the images..." : "Describe your symptoms in detail..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || disabled}
              rows={1}
              className="w-full resize-none bg-transparent px-4 py-3 pr-32 sm:pr-36 text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 min-h-[48px] max-h-[120px]"
              aria-label="Type your symptoms"
            />
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {/* Actions */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1.5 sm:gap-2">
              {/* Image Upload Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isProcessingImages}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10"
                  aria-label="Upload images"
                >
                  {isProcessingImages ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImagePlus className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>

              {/* Voice Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleVoiceInput}
                  className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl transition-all ${
                    isListening 
                      ? "bg-primary text-primary-foreground animate-pulse" 
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                >
                  <AnimatePresence mode="wait">
                    {isListening ? (
                      <motion.div
                        key="mic-off"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <MicOff className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="mic"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Mic className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
              
              {/* Send Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  variant="hero"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl"
                  disabled={(!inputValue.trim() && images.length === 0) || isLoading}
                  aria-label="Send message"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loader"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="send"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Send className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </form>
        
        {/* Hints */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mt-2.5 text-[10px] sm:text-xs text-muted-foreground"
        >
          <Sparkles className="w-3 h-3 text-primary" />
          <span>Upload medical reports/images ({creditsPerImage} credits each) • Voice input available</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
