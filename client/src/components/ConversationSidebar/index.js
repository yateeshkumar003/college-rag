import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useChatStore } from '../../store/chatStore';
import { Plus, MessageSquare, Trash2, Loader2 } from 'lucide-react';

export default function ConversationSidebar() {
  const router = useRouter();
  const { id } = router.query;
  const { 
    conversations, 
    fetchingConvs, 
    fetchConversations, 
    deleteConversation, 
    resetChat 
  } = useChatStore();

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleNewChat = () => {
    resetChat();
    router.push('/chat');
  };

  const handleSelectConv = (convId) => {
    router.push(`/chat/${convId}`);
  };

  const handleDeleteConv = async (e, convId) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation thread?')) {
      await deleteConversation(convId);
      if (id === convId) {
        router.push('/chat');
      }
    }
  };

  return (
    <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-64px)] flex-shrink-0">
      
      {/* New Chat Action */}
      <div className="p-4 border-b border-slate-850">
        <button
          onClick={handleNewChat}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-650 hover:bg-indigo-600 text-white flex items-center justify-center space-x-2 shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {fetchingConvs && conversations.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-slate-500 text-xs space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Loading chats...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 text-slate-600 text-[11px]">
            <MessageSquare className="w-6 h-6 mx-auto text-slate-700 mb-2.5" />
            <p>No chat history yet</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = id === conv._id;
            return (
              <div
                key={conv._id}
                onClick={() => handleSelectConv(conv._id)}
                className={`group w-full py-2.5 px-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-150 ${
                  isActive 
                    ? 'bg-indigo-950/40 border border-indigo-900/50 text-indigo-200' 
                    : 'text-slate-400 hover:bg-slate-850/60 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-550'}`} />
                  <span className="text-xs truncate font-medium">{conv.title}</span>
                </div>
                
                {/* Delete button (hidden by default, visible on hover) */}
                <button
                  onClick={(e) => handleDeleteConv(e, conv._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-700/40 text-slate-500 hover:text-rose-450 transition-all duration-150"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
