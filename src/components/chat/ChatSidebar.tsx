import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Bot,
  Plus, 
  Trash2, 
  MessageSquare,
  Search,
  X,
  LogOut,
  Coins,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onLoadConversation: (id: string) => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  onClose?: () => void;
  user: { email?: string } | null;
  credits: number | null;
  onSignOut?: () => void;
  isMobile?: boolean;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onLoadConversation,
  onDeleteConversation,
  onClose,
  user,
  credits,
  onSignOut,
  isMobile = false
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const groupedConversations = {
    today: [] as Conversation[],
    yesterday: [] as Conversation[],
    lastWeek: [] as Conversation[],
    older: [] as Conversation[]
  };

  filteredConversations.forEach(conv => {
    const convDate = new Date(conv.updated_at);
    convDate.setHours(0, 0, 0, 0);
    
    if (convDate >= today) {
      groupedConversations.today.push(conv);
    } else if (convDate >= yesterday) {
      groupedConversations.yesterday.push(conv);
    } else if (convDate >= lastWeek) {
      groupedConversations.lastWeek.push(conv);
    } else {
      groupedConversations.older.push(conv);
    }
  });

  const renderConversationGroup = (title: string, convs: Conversation[]) => {
    if (convs.length === 0) return null;
    
    return (
      <div className="mb-4">
        <p className="text-xs font-medium text-muted-foreground px-3 mb-2 uppercase tracking-wider">
          {title}
        </p>
        <div className="space-y-0.5">
          {convs.map((conv) => (
            <motion.button
              key={conv.id}
              onClick={() => onLoadConversation(conv.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group flex items-center gap-2 ${
                currentConversationId === conv.id 
                  ? 'bg-accent text-accent-foreground' 
                  : 'hover:bg-muted text-foreground'
              }`}
              whileTap={{ scale: 0.99 }}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-60" />
              <span className="flex-1 truncate text-sm">
                {conv.title}
              </span>
              <button
                onClick={(e) => onDeleteConversation(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-sidebar-background">
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          {!isMobile && (
            <span className="font-display font-semibold text-sidebar-foreground">Mr Homeo</span>
          )}
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button 
          onClick={() => {
            onNewChat();
            if (isMobile && onClose) onClose();
          }}
          variant="outline" 
          className="w-full justify-start gap-2 h-10 bg-background hover:bg-muted border-border"
        >
          <Plus className="w-4 h-4" />
          New chat
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              No conversations yet
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Start a new chat to begin
            </p>
          </div>
        ) : (
          <div className="py-2">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-3 uppercase tracking-wider">
              Your chats
            </p>
            {renderConversationGroup("Today", groupedConversations.today)}
            {renderConversationGroup("Yesterday", groupedConversations.yesterday)}
            {renderConversationGroup("Previous 7 Days", groupedConversations.lastWeek)}
            {renderConversationGroup("Older", groupedConversations.older)}
            
            {filteredConversations.length === 0 && searchQuery && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No chats matching "{searchQuery}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.email?.split('@')[0] || 'User'}
              </p>
              {credits !== null && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Coins className="w-3 h-3" />
                  <span>{credits} credits</span>
                </div>
              )}
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-1.5 hover:bg-destructive/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sign in prompt for non-authenticated users */}
      {!user && (
        <div className="p-3 border-t border-sidebar-border">
          <Link to="/auth">
            <Button variant="default" className="w-full gap-2">
              Sign in to save chats
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
