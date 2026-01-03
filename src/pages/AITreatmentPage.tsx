import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useSmartScroll } from "@/hooks/useSmartScroll";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  AlertCircle,
  Sparkles,
  MessageSquare,
  Shield
} from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { containerRef, scrollToBottom, forceScrollToBottom } = useSmartScroll<HTMLDivElement>({
    threshold: 200
  });

  // Scroll on new messages (smart scroll)
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date()
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);
    
    // Force scroll after user sends message
    setTimeout(() => forceScrollToBottom(), 50);

    try {
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
      setMessages(prev => prev.filter(m => m.id !== assistantMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="flex flex-col h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] md:h-[calc(100vh-80px)]">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-hero border-b border-border px-3 sm:px-4 py-3 sm:py-4 md:py-5 flex-shrink-0"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl gradient-primary flex items-center justify-center shadow-soft"
                >
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </motion.div>
                <div>
                  <h1 className="text-base sm:text-lg md:text-xl font-display font-bold text-foreground">
                    AI Homeopathic Doctor
                  </h1>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Online & Ready
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-border">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-secondary-foreground">Powered by Gemini</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer Banner */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/40 border-b border-border px-3 sm:px-4 py-2 flex-shrink-0"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
              <p className="text-muted-foreground text-center">
                <span className="hidden sm:inline">Educational information only. </span>
                <span className="font-medium text-foreground">Not medical advice.</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Messages Container */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 scroll-smooth"
        >
          <div className="container mx-auto max-w-3xl">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <div key={message.id} className="mb-4 sm:mb-5">
                  <ChatMessage 
                    message={message} 
                    isTyping={isLoading && index === messages.length - 1 && message.role === "assistant" && message.content === ""}
                  />
                </div>
              ))}
            </AnimatePresence>
            
            {/* Quick prompts when empty */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <p className="text-xs text-muted-foreground mb-3 text-center">Try asking about:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Headache remedies", "Sleep issues", "Digestive problems", "Stress & anxiety"].map((prompt) => (
                    <motion.button
                      key={prompt}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-3 py-2 rounded-xl bg-card border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-soft transition-all flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
}
