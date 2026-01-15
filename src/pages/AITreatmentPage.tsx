import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useSmartScroll } from "@/hooks/useSmartScroll";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useCredits } from "@/hooks/useCredits";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Sparkles,
  MessageSquare,
  Shield,
  History,
  Plus,
  Trash2,
  LogIn,
  ChevronLeft,
  Coins,
  ImageIcon
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  images?: string[]; // Base64 image previews for display
}

const CREDITS_PER_IMAGE = 2;

const initialMessage: Message = {
  id: "welcome",
  role: "assistant",
  content: `Hello! I'm your AI homeopathic consultant. I'm here to help you understand your symptoms and suggest natural remedies based on homeopathic principles.

**How I can help:**
• Analyze your symptoms
• Suggest possible conditions
• Recommend homeopathic remedies
• Provide lifestyle guidance
• **📷 Analyze medical reports & images** (2 credits per image)

**Please note:** I provide educational information only. Always consult a licensed healthcare provider for medical advice.

How are you feeling today? Please describe your symptoms or upload a medical report for analysis.`,
  timestamp: new Date()
};

export default function AITreatmentPage() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  
  const {
    user,
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    saveMessage,
    loadMessages,
    deleteConversation
  } = useChatHistory();

  const { credits, deductCredit, hasCredits, isLoading: creditsLoading } = useCredits();
  
  const { containerRef, scrollToBottom, forceScrollToBottom } = useSmartScroll<HTMLDivElement>({
    threshold: 200
  });

  // Scroll on new messages (smart scroll)
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load messages when conversation changes
  useEffect(() => {
    const loadConversationMessages = async () => {
      if (currentConversationId && user) {
        const loadedMessages = await loadMessages(currentConversationId);
        if (loadedMessages.length > 0) {
          setMessages([initialMessage, ...loadedMessages]);
        }
      }
    };
    loadConversationMessages();
  }, [currentConversationId, user]);

  const streamChat = async (
    userMessages: { role: string; content: string }[], 
    images?: { base64: string; mimeType: string }[]
  ) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/homeopathy-chat`;
    
    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages, images }),
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

  const handleSendMessage = async (content: string, images?: { base64: string; mimeType: string }[]) => {
    const imageCount = images?.length || 0;
    const creditsNeeded = imageCount > 0 ? imageCount * CREDITS_PER_IMAGE : 1;
    
    // Check if user has enough credits
    if (credits !== null && credits < creditsNeeded) {
      toast({
        title: "Not enough credits",
        description: user 
          ? `You need ${creditsNeeded} credits but only have ${credits}. Images require ${CREDITS_PER_IMAGE} credits each.`
          : `Sign in to get 15 free credits!`,
        variant: "destructive"
      });
      return;
    }

    // Create image previews for display
    const imageDataUrls = images?.map(img => `data:${img.mimeType};base64,${img.base64}`);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content || (imageCount > 0 ? `Analyzing ${imageCount} image${imageCount > 1 ? 's' : ''}...` : ''),
      timestamp: new Date(),
      images: imageDataUrls
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

    // Create conversation if user is signed in and no current conversation
    let conversationId = currentConversationId;
    if (user && !conversationId) {
      const title = content?.slice(0, 50) || `Image analysis (${imageCount} image${imageCount > 1 ? 's' : ''})`;
      conversationId = await createConversation(title);
    }

    try {
      const apiMessages = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({ role: m.role, content: m.content }));
      apiMessages.push({ role: "user", content: userMessage.content });

      const aiResponse = await streamChat(apiMessages, images);

      // Deduct credits based on images or text
      if (imageCount > 0) {
        for (let i = 0; i < imageCount; i++) {
          await deductCredit();
          await deductCredit(); // 2 credits per image
        }
      } else {
        await deductCredit();
      }

      // Show remaining credits toast
      if (imageCount > 0) {
        toast({
          title: "Analysis Complete",
          description: `Used ${creditsNeeded} credits for ${imageCount} image${imageCount > 1 ? 's' : ''}.`,
        });
      }

      // Save messages if user is signed in
      if (user && conversationId) {
        await saveMessage(conversationId, 'user', userMessage.content);
        await saveMessage(conversationId, 'assistant', aiResponse);
      }
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

  const handleNewChat = () => {
    setMessages([initialMessage]);
    setCurrentConversationId(null);
  };

  const handleLoadConversation = async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setShowHistory(false);
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteConversation(conversationId);
    if (currentConversationId === conversationId) {
      handleNewChat();
    }
  };

  return (
    <Layout hideFooter>
      <div className="flex h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] md:h-[calc(100vh-80px)]">
        {/* History Sidebar - Desktop */}
        {user && (
          <motion.div 
            initial={{ width: showHistory ? 280 : 0 }}
            animate={{ width: showHistory ? 280 : 0 }}
            className="hidden md:block bg-muted/30 border-r border-border overflow-hidden flex-shrink-0"
          >
            <div className="w-[280px] h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <Button 
                  onClick={handleNewChat}
                  variant="outline" 
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {conversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No chat history yet
                  </p>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conv) => (
                      <motion.button
                        key={conv.id}
                        onClick={() => handleLoadConversation(conv.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors group ${
                          currentConversationId === conv.id 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {conv.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(conv.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteConversation(conv.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </button>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-hero border-b border-border px-3 sm:px-4 py-3 sm:py-4 md:py-5 flex-shrink-0"
          >
            <div className="container mx-auto max-w-4xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* History toggle for desktop */}
                  {user && (
                    <motion.button
                      onClick={() => setShowHistory(!showHistory)}
                      className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/60 border border-border hover:bg-secondary transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {showHistory ? (
                        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <History className="w-5 h-5 text-muted-foreground" />
                      )}
                    </motion.button>
                  )}
                  
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
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                        Online <ImageIcon className="w-3 h-3 inline" /> Image Analysis
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-border">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-secondary-foreground">Powered by Gemini</span>
                  </div>
                  
                  {/* Credits display */}
                  {!creditsLoading && credits !== null && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                      credits > 0 ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'
                    }`}>
                      <Coins className={`w-3.5 h-3.5 ${credits > 0 ? 'text-primary' : 'text-destructive'}`} />
                      <span className={`text-xs font-semibold ${credits > 0 ? 'text-primary' : 'text-destructive'}`}>
                        {credits} credit{credits !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  
                  {/* Mobile history button */}
                  {user && (
                    <motion.button
                      onClick={() => setShowHistory(!showHistory)}
                      className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-secondary/60 border border-border hover:bg-secondary transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <History className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                  )}
                  
                  {!user && (
                    <Link to="/auth">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <LogIn className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Sign in to save</span>
                        <span className="sm:hidden">Sign in</span>
                      </Button>
                    </Link>
                  )}
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
                  <span className="hidden md:inline text-primary ml-1">• Images: 2 credits each</span>
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
                    {/* Show images if present */}
                    {message.images && message.images.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2 mb-2 justify-end"
                      >
                        {message.images.map((img, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={img}
                            alt={`Uploaded image ${imgIndex + 1}`}
                            className="max-w-[150px] max-h-[150px] rounded-lg border border-border object-cover"
                          />
                        ))}
                      </motion.div>
                    )}
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
                    {["Headache remedies", "Sleep issues", "Digestive problems", "📷 Upload a report"].map((prompt) => (
                      <motion.button
                        key={prompt}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => !prompt.includes("📷") && handleSendMessage(prompt)}
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
            creditsPerImage={CREDITS_PER_IMAGE}
          />
        </div>

        {/* Mobile History Overlay */}
        <AnimatePresence>
          {showHistory && user && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHistory(false)}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="md:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-background border-r border-border z-50 flex flex-col"
              >
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Chat History</h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 border-b border-border">
                  <Button 
                    onClick={() => { handleNewChat(); setShowHistory(false); }}
                    variant="outline" 
                    className="w-full gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Chat
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {conversations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No chat history yet
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {conversations.map((conv) => (
                        <motion.button
                          key={conv.id}
                          onClick={() => handleLoadConversation(conv.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors group ${
                            currentConversationId === conv.id 
                              ? 'bg-primary/10 border border-primary/20' 
                              : 'hover:bg-muted'
                          }`}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {conv.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(conv.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => handleDeleteConversation(conv.id, e)}
                              className="p-1 hover:bg-destructive/10 rounded transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </button>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
