import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SUGGESTIONS = [
  '💡 Beat procrastination',
  '📚 Best study technique?',
  '⚡ Quick focus tip',
  '🧠 Explain Flowmodoro',
];

export const AIChatbot = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm FocusBuddy ✨ Your AI study & productivity coach. Ask me anything — focus tips, study techniques, coding help, or how to beat procrastination!",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: 'user', content: text.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        toast({ title: 'AI error', description: err.error || 'Try again', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      setMessages((m) => [...m, { role: 'assistant', content: '' }]);
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: 'assistant', content: assistantText };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      toast({ title: 'Network error', description: String(e), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform animate-pulse-glow"
        aria-label="Open AI assistant"
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-7 w-7" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md h-[70vh] max-h-[600px] rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-purple-600/40 to-pink-600/40">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">FocusBuddy AI</div>
              <div className="text-white/60 text-xs">Your study & focus coach</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {m.content || (loading && i === messages.length - 1 ? '...' : '')}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl px-4 py-2 text-white border border-white/10">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s.replace(/^[^\s]+\s/, ''))}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-white/10 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder:text-white/50 outline-none focus:border-white/40"
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
