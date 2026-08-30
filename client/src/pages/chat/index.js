import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ConversationSidebar from '../../components/ConversationSidebar';
import ChatWindow from '../../components/ChatWindow';
import { useChatStore } from '../../store/chatStore';

export default function ChatIndexPage() {
  const router = useRouter();
  const { autoSend } = router.query;
  const { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    resetChat 
  } = useChatStore();

  // Reset chat state on clean mount
  useEffect(() => {
    resetChat();
  }, []);

  // Handle suggested questions autoSend redirection trigger
  useEffect(() => {
    if (autoSend && typeof autoSend === 'string') {
      const triggerAutoSend = async () => {
        // Wait slightly for store reset to finish
        await new Promise(r => setTimeout(r, 100));
        const newId = await sendMessage(autoSend);
        if (newId) {
          router.replace(`/chat/${newId}`);
        }
      };
      triggerAutoSend();
    }
  }, [autoSend]);

  const handleSendMessage = async (text) => {
    const newId = await sendMessage(text);
    if (newId) {
      router.push(`/chat/${newId}`);
    }
  };

  return (
    <>
      <Head>
        <title>Campus Chatbot | CollegeRAG</title>
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
