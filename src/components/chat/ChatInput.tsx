import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Mic, MicOff, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
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

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-t border-border bg-card/80 backdrop-blur-xl px-3 sm:px-4 py-3 sm:py-4"
    >
      <div className="container mx-auto max-w-3xl">
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
              placeholder="Describe your symptoms in detail..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || disabled}
              rows={1}
              className="w-full resize-none bg-transparent px-4 py-3 pr-24 sm:pr-28 text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 min-h-[48px] max-h-[120px]"
              aria-label="Type your symptoms"
            />
            
            {/* Actions */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1.5 sm:gap-2">
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
                  disabled={!inputValue.trim() || isLoading}
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
          <span>Press Enter to send • Shift+Enter for new line • Voice input available</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
