import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, 
  Mic, 
  MicOff,
  Bot, 
  User, 
  AlertCircle,
  Loader2,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialMessage: Message = {
  id: "welcome",
  role: "assistant",
  content: `Hello! I'm your AI homeopathic consultant. I'm here to help you understand your symptoms and suggest natural remedies based on homeopathic principles.

**How I can help:**
• Analyze your symptoms
• Suggest possible conditions
• Recommend homeopathic remedies
• Provide lifestyle guidance

**Please note:** I provide educational information only. Always consult a licensed healthcare provider for medical advice.

How are you feeling today? Please describe your symptoms in detail.`,
  timestamp: new Date()
};

export default function AITreatmentPage() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessages: { role: string; content: string }[]) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/homeopathy-chat`;
    
    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get response');
    }

    if (!resp.body) throw new Error('No response body');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let fullContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            fullContent += content;
            // Update the assistant message in real-time
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && last.id !== "welcome") {
                return prev.map((m, i) => 
                  i === prev.length - 1 ? { ...m, content: fullContent } : m
                );
              }
              return prev;
            });
          }
        } catch {
          // Incomplete JSON, continue
        }
      }
    }

    return fullContent;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    };

    // Create placeholder assistant message
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Build message history for API
      const apiMessages = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({ role: m.role, content: m.content }));
      apiMessages.push({ role: "user", content: userMessage.content });

      await streamChat(apiMessages);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive"
      });
      // Remove the empty assistant message on error
      setMessages(prev => prev.filter(m => m.id !== assistantMessage.id));
    } finally {
      setIsLoading(false);
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
    <Layout>
      <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-96px)]">
        {/* Header */}
        <div className="bg-gradient-hero border-b border-border px-4 py-4 md:py-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                    AI Homeopathic Doctor
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Natural healing guidance powered by AI
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Powered by Gemini AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-secondary/50 border-b border-border px-4 py-2">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="text-muted-foreground text-center">
                <span className="hidden md:inline">Consult a licensed healthcare professional before taking any medication. </span>
                <span className="font-medium text-foreground">This is not medical advice.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="container mx-auto max-w-3xl">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 mb-6 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                      message.role === "assistant"
                        ? "gradient-primary"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex-1 ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block rounded-2xl px-4 py-3 max-w-full md:max-w-[85%] text-left ${
                        message.role === "assistant"
                          ? "bg-card border border-border shadow-soft"
                          : "gradient-primary text-primary-foreground"
                      }`}
                    >
                      {message.role === "assistant" && message.content === "" ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Analyzing your symptoms...</span>
                        </div>
                      ) : (
                        <div 
                          className={`text-sm md:text-base whitespace-pre-wrap ${
                            message.role === "assistant" ? "prose prose-sm max-w-none" : ""
                          }`}
                          dangerouslySetInnerHTML={{ 
                            __html: message.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n/g, '<br/>')
                          }}
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card/50 backdrop-blur-sm px-4 py-4">
          <div className="container mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Describe your symptoms..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  className="h-12 md:h-14 rounded-2xl pr-12 text-base border-2 border-border focus:border-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleVoiceInput}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                    isListening ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <Button
                type="submit"
                variant="hero"
                size="icon"
                className="h-12 w-12 md:h-14 md:w-14 rounded-2xl"
                disabled={!inputValue.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Press Enter to send • Voice input available
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
