import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ConversationSidebar from '../../components/ConversationSidebar';
import ChatWindow from '../../components/ChatWindow';
import { useChatStore } from '../../store/chatStore';

export default function ChatDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { 
    messages, 
    loading, 
    error, 
    fetchMessages, 
    sendMessage 
  } = useChatStore();

  // Load message logs when the route dynamic ID changes
  useEffect(() => {
    if (id) {
      fetchMessages(id);
    }
  }, [id]);

  const handleSendMessage = async (text) => {
    await sendMessage(text);
  };

  return (
    <>
      <Head>
        <title>Chat Session | CollegeRAG</title>
      </Head>

      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
        {/* Sidebar */}
        <ConversationSidebar />

        {/* Chat Window */}
        <ChatWindow
          messages={messages}
          loading={loading}
          error={error}
          onSendMessage={handleSendMessage}
        />
      </div>
    </>
  );
}
