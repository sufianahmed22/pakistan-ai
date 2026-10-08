import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PanelLeftOpen, X, Sparkles, Info, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import PageSEO from '../../components/layout/PageSEO';
import ConversationSidebar from '../../components/chatbot/ConversationSidebar';
import ChatMessage from '../../components/chatbot/ChatMessage';
import ChatInput from '../../components/chatbot/ChatInput';
import SuggestedQuestions from '../../components/chatbot/SuggestedQuestions';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import conversationService from '../../services/conversationService';

export default function Ask() {
  const { messages, loading, send, reset, loadConversation, retry, conversationId, rateLimitError } = useChat();
  const { user, isAuthenticated } = useAuth();
  const [params, setParams] = useSearchParams();
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const scrollRef = useRef(null);
  const initialQ = params.get('q');
  const initialConvId = params.get('c');
  const firedInitial = useRef(false);

  const isAdmin = isAuthenticated && ['admin', 'superadmin'].includes(user?.role);

  const [guestCount, setGuestCount] = useState(() => {
    const saved = parseInt(sessionStorage.getItem('pakistan_ai_guest_q_count') || '0', 10);
    return isNaN(saved) ? 0 : saved;
  });

  const userQuestionsCount = messages.filter((m) => m.role === 'user').length;

  useEffect(() => {
    if (!isAuthenticated) {
      const activeCount = Math.max(guestCount, userQuestionsCount);
      if (activeCount !== guestCount) {
        setGuestCount(activeCount);
        sessionStorage.setItem('pakistan_ai_guest_q_count', String(activeCount));
      }
    }
  }, [messages, isAuthenticated, guestCount, userQuestionsCount]);

  const isGuestLimitReached =
    !isAuthenticated &&
    (guestCount >= 3 || rateLimitError?.code === 'GUEST_LIMIT_REACHED' || rateLimitError?.status === 429);
  const isUserLimitReached =
    isAuthenticated &&
    !isAdmin &&
    (userQuestionsCount >= 10 || rateLimitError?.code === 'USER_LIMIT_REACHED');
  const isAdminLimitReached = isAdmin && rateLimitError?.code === 'ADMIN_RATE_LIMIT_REACHED';

  const isInputDisabled = isGuestLimitReached || isUserLimitReached || isAdminLimitReached;

  let inputPlaceholder = 'Ask anything about Pakistan…';
  if (isGuestLimitReached) {
    inputPlaceholder = 'Guest limit of 3 questions reached. Log in or sign up to continue…';
  } else if (isUserLimitReached) {
    inputPlaceholder = 'Session limit of 10 questions reached. Please wait before asking more…';
  } else if (isAdminLimitReached) {
    inputPlaceholder = 'Admin rate limit reached. Please wait a moment…';
  }

  const handleSend = (question) => {
    if (isGuestLimitReached) {
      toast.error('Guest limit of 3 questions reached. Please log in or sign up to continue.');
      return;
    }
    if (isUserLimitReached) {
      toast.error('You have reached your limit of 10 questions. Please wait before asking more.');
      return;
    }
    if (isAdminLimitReached) {
      toast.error('Admin rate limit reached. Please wait a moment.');
      return;
    }

    if (!isAuthenticated) {
      const nextCount = Math.max(guestCount, userQuestionsCount) + 1;
      setGuestCount(nextCount);
      sessionStorage.setItem('pakistan_ai_guest_q_count', String(nextCount));
    }

    send(question);
  };

  useEffect(() => {
    if (firedInitial.current) return;
    firedInitial.current = true;
    if (initialConvId) {
      conversationService.get(initialConvId).then(loadConversation).catch(() => {});
    } else if (initialQ) {
      handleSend(initialQ);
      setParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conv) => {
    // Sidebar rows are conversation summaries only (no embedded messages),
    // so fetch the full conversation + messages before loading it into the chat.
    const id = conv?._id || conv?.id;
    if (id) {
      conversationService.get(id).then(loadConversation).catch(() => {});
    }
    setMobileSidebar(false);
  };

  return (
    <div className="flex h-[calc(100vh-0px)] pt-20 bg-charcoal-50/40">
      <PageSEO
        title="Ask Pakistan AI"
        description="Ask Pakistan AI anything about Pakistan's history, culture, geography, and more."
        canonical="/ask"
      />

      <aside className="hidden lg:block w-72 shrink-0 border-r border-charcoal-100 bg-white">
        <ConversationSidebar activeId={conversationId} onSelect={handleSelectConversation} onNew={reset} />
      </aside>

      {mobileSidebar && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="w-72 bg-white">
            <div className="flex items-center justify-between p-4 border-b border-charcoal-100">
              <span className="font-semibold">Conversations</span>
              <button onClick={() => setMobileSidebar(false)} aria-label="Close sidebar">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ConversationSidebar
              activeId={conversationId}
              onSelect={handleSelectConversation}
              onNew={() => {
                reset();
                setMobileSidebar(false);
              }}
            />
          </div>
          <div className="flex-1 bg-charcoal-950/40" onClick={() => setMobileSidebar(false)} />
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center gap-3 border-b border-charcoal-100 bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setMobileSidebar(true)} aria-label="Open conversations">
            <PanelLeftOpen className="h-5 w-5" />
          </button>
          <span className="font-display font-semibold">Ask Pakistan AI</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-8 py-8">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 ? (
              <div className="pt-8 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <Sparkles className="h-7 w-7" />
                </span>
                <h1 className="text-h3">Ask anything about Pakistan</h1>
                <p className="text-body mt-2 mb-4">History, culture, geography, tourism, statistics — ask away.</p>

                {!isAuthenticated && (
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs text-emerald-800 font-medium">
                    <Info className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>Guest AI is limited to 3 questions only. Log in or sign up to ask up to 10 questions.</span>
                  </div>
                )}

                <SuggestedQuestions onSelect={handleSend} />
              </div>
            ) : (
              messages.map((m) => (
                <ChatMessage key={m.id} message={m} onRetry={retry} onRegenerate={() => retry(m.id)} />
              ))
            )}
          </div>
        </div>

        <div className="border-t border-charcoal-100 bg-white px-4 sm:px-8 py-4">
          <div className="mx-auto max-w-3xl">
            {/* Information Box showing AI limits */}
            {!isAuthenticated && (
              isGuestLimitReached ? (
                <div className="mb-3 rounded-2xl border border-amber-300 bg-amber-50/95 p-4 shadow-sm animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                            Guest Limit Reached (3 of 3 Questions Used)
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-amber-900/90 leading-relaxed">
                          You have used all <strong>3 free guest questions</strong>. Log in or create a free account to unlock{' '}
                          <strong>10 questions</strong> and save your conversations!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Link
                        to="/login"
                        className="rounded-xl border border-amber-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-amber-900 shadow-xs hover:bg-amber-100 transition-colors"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        className="rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
                      >
                        Sign up for 10 questions
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-3 rounded-2xl border border-emerald-200/90 bg-emerald-50/70 p-3.5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
                        <Info className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                            Guest AI Access
                          </span>
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                            {guestCount}/3 questions used ({Math.max(0, 3 - guestCount)} remaining)
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-emerald-900/80 leading-relaxed">
                          Guest access is <strong>limited to 3 questions only</strong>. Log in or sign up to ask up to{' '}
                          <strong>10 questions</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Link
                        to="/login"
                        className="rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-xs hover:bg-emerald-50 transition-colors"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        className="rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-emerald-800 transition-colors"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}

            {isAuthenticated && !isAdmin && (
              isUserLimitReached ? (
                <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50/90 p-3.5 text-amber-950 flex items-center gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <p className="text-xs font-medium">
                    You have reached your limit of <strong>10 questions</strong>. Please wait before asking more questions.
                  </p>
                </div>
              ) : (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-charcoal-200/80 bg-charcoal-50/60 px-3.5 py-2 text-xs text-charcoal-600">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <span>
                      Logged in as <strong className="text-charcoal-900">{user?.name || user?.email}</strong> — Member quota:{' '}
                      <strong>10 questions</strong>.
                    </span>
                  </div>
                  <span className="font-medium text-charcoal-700">
                    {userQuestionsCount}/10 questions ({Math.max(0, 10 - userQuestionsCount)} remaining)
                  </span>
                </div>
              )
            )}

            {isAdmin && (
              <div className="mb-3 flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50/70 px-3.5 py-2 text-xs text-purple-900">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-700 shrink-0" />
                  <span>
                    Admin Access ({user?.role}) — Chat rate limit applies to admin only (up to 30 requests/window).
                  </span>
                </div>
                <span className="font-semibold text-purple-800">
                  {userQuestionsCount}/30
                </span>
              </div>
            )}

            <ChatInput
              onSend={handleSend}
              loading={loading}
              disabled={isInputDisabled}
              placeholder={inputPlaceholder}
              autoFocus
            />
            <p className="mt-2 text-center text-xs text-charcoal-300">
              Pakistan AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
