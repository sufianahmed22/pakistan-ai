import { createContext, useCallback, useState } from 'react';
import { toast } from 'sonner';
import chatService from '../services/chatService';

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]); // { id, role: 'user'|'assistant', content, pending?, error? }
  const [loading, setLoading] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(null);

  const reset = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setRateLimitError(null);
  }, []);

  const clearRateLimitError = useCallback(() => {
    setRateLimitError(null);
  }, []);

  // Accepts the { conversation, messages } shape returned by
  // conversationService.get() — messages are individual { role, content }
  // records (see server Message model), not question/answer pairs.
  const loadConversation = useCallback((res) => {
    const conv = res?.conversation || res;
    const msgs = res?.messages || conv?.messages || [];
    setConversationId(conv?._id || conv?.id || null);
    setMessages(
      msgs.map((m, i) => ({
        id: m._id || m.id || `${i}`,
        role: m.role,
        content: m.content,
      }))
    );
  }, []);

  const send = useCallback(
    async (question) => {
      if (!question?.trim()) return;
      const userMsg = { id: `u-${Date.now()}`, role: 'user', content: question };
      const pendingMsg = { id: `a-${Date.now()}`, role: 'assistant', content: '', pending: true, lastQuestion: question };
      setMessages((prev) => [...prev, userMsg, pendingMsg]);
      setLoading(true);
      try {
        const res = await chatService.ask({ question, conversationId });
        setConversationId(res?.conversationId || conversationId);
        setMessages((prev) =>
          prev.map((m) => (m.id === pendingMsg.id ? { ...m, content: res?.answer || '', pending: false, lastQuestion: question } : m))
        );
        setRateLimitError(null);
      } catch (err) {
        if (err.status === 429 || err.data?.code?.includes('LIMIT') || err.message?.includes('limit')) {
          setRateLimitError({
            status: err.status || 429,
            code: err.data?.code,
            message: err.message,
            limit: err.data?.limit,
          });
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingMsg.id ? { ...m, content: '', pending: false, error: err.message, lastQuestion: question } : m
          )
        );
        toast.error(err.message || 'Failed to get an answer. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [conversationId]
  );

  const retry = useCallback(
    (messageId) => {
      const msg = messages.find((m) => m.id === messageId);
      if (msg?.lastQuestion) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        send(msg.lastQuestion);
      }
    },
    [messages, send]
  );

  return (
    <ChatContext.Provider
      value={{
        conversationId,
        messages,
        loading,
        rateLimitError,
        clearRateLimitError,
        send,
        reset,
        loadConversation,
        retry,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
