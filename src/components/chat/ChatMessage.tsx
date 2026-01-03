import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { TypingIndicator } from "./TypingIndicator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const isEmpty = message.content === "";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={`flex gap-3 ${!isAssistant ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-soft ${
          isAssistant
            ? "gradient-primary"
            : "bg-muted border border-border"
        }`}
      >
        {isAssistant ? (
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        ) : (
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        )}
      </motion.div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${!isAssistant ? "text-right" : ""}`}>
        <motion.div
          initial={{ opacity: 0, x: isAssistant ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.25 }}
          className={`inline-block rounded-2xl px-4 py-3 max-w-[90%] sm:max-w-[85%] text-left ${
            isAssistant
              ? "bg-card border border-border shadow-soft"
              : "gradient-primary text-primary-foreground shadow-card"
          }`}
        >
          {isAssistant && isEmpty ? (
            <TypingIndicator />
          ) : (
            <div 
              className={`text-sm sm:text-base whitespace-pre-wrap leading-relaxed ${
                isAssistant ? "prose prose-sm max-w-none text-foreground" : ""
              }`}
              dangerouslySetInnerHTML={{ 
                __html: message.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                  .replace(/\n/g, '<br/>')
                  .replace(/• /g, '<span class="text-primary">•</span> ')
              }}
            />
          )}
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 px-1"
        >
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </motion.p>
      </div>
    </motion.div>
  );
}
