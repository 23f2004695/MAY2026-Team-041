import { Bot, SendHorizontal, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge, Button, Input } from '@/components/ui';
import { cn } from '@/lib/cn';

interface ChatMessage {
  id: string;
  from: 'bot' | 'user';
  text: string;
}

// ponytail: no backend yet — this is a UI-only demo of what an AI chat widget
// would look/feel like.
export function ChatbotWidget() {
  const { t } = useTranslation();
  const headingId = useId();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 'greeting', from: 'bot', text: t('chatbot.greeting') },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSend(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: 'user', text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), from: 'bot', text: t('chatbot.demoReply') },
      ]);
      setIsTyping(false);
    }, 900);
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby={headingId}
        className={cn(
          'flex w-80 origin-bottom-right flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-panel transition-all duration-200 ease-out sm:w-96',
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
        )}
        style={{ height: open ? 460 : 0 }}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border-muted px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="size-4" />
            </span>
            <span id={headingId} className="text-sm font-semibold text-foreground">
              {t('chatbot.title')}
            </span>
            <Badge variant="outline">{t('chatbot.demoBadge')}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0"
            onClick={() => setOpen(false)}
            aria-label={t('chatbot.closeChat')}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-2',
                message.from === 'user' && 'flex-row-reverse',
              )}
            >
              {message.from === 'bot' && (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-3.5" />
                </span>
              )}
              <p
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                  message.from === 'bot'
                    ? 'bg-secondary text-foreground'
                    : 'bg-primary text-primary-foreground',
                )}
              >
                {message.text}
              </p>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="size-3.5" />
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-2.5">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${dot * 0.15}s` }}
                  />
                ))}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border-muted p-3">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t('chatbot.placeholder')}
            aria-label={t('chatbot.placeholder')}
            className="h-9"
          />
          <Button type="submit" size="sm" className="size-9 p-0" aria-label={t('chatbot.send')}>
            <SendHorizontal className="size-4" />
          </Button>
        </form>
      </div>

      <div className="group relative">
        {!open && (
          <span
            className={cn(
              'pointer-events-none absolute bottom-1/2 right-full mr-3 translate-y-1/2 whitespace-nowrap',
              'rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-panel',
              'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
            )}
          >
            {t('chatbot.tooltip')}
          </span>
        )}
        <Button
          variant="primary"
          onClick={() => setOpen((value) => !value)}
          aria-label={t(open ? 'chatbot.closeChat' : 'chatbot.openChat')}
          className="size-14 rounded-full p-0 shadow-panel"
        >
          {open ? <X className="size-5" /> : <Bot className="size-5" />}
        </Button>
      </div>
    </div>
  );
}
