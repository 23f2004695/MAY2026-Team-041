import { AnimatePresence, motion } from 'framer-motion';
import { Bot, RotateCcw, Send, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

import { useChatbotConversation } from './useChatbotConversation';

export function ChatbotWidget() {
  const { t } = useTranslation();
  const headingId = useId();
  const {
    isAuthenticated,
    role,
    messages,
    currentNode,
    input,
    setInput,
    loading,
    sendToLLM,
    selectTreeOption,
    handleReset,
    handleKeyDown,
    showOptions,
    showBackButton,
    sourceLabel,
    scrollRef,
  } = useChatbotConversation();
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && isAuthenticated) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open, isAuthenticated]);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby={headingId}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto flex w-80 flex-col overflow-hidden rounded-2xl border border-border shadow-2xl sm:w-96"
            style={{ height: 540 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-primary to-primary/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                    <Bot className="size-5" />
                  </span>
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-green-400" />
                </div>
                <div>
                  <p id={headingId} className="text-sm font-semibold text-white">
                    {t('chatbot.title')}
                  </p>
                  <p className="text-[11px] text-white/70">
                    {isAuthenticated ? `${role} · AI-powered` : 'Library Assistant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  aria-label="Reset chat"
                  className="flex size-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <RotateCcw className="size-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t('chatbot.closeChat')}
                  className="flex size-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface p-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={cn('flex items-end gap-2', msg.from === 'user' && 'flex-row-reverse')}
                  >
                    {msg.from === 'bot' && (
                      <span className="mb-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot className="size-3.5" />
                      </span>
                    )}
                    <div className={cn('flex max-w-[78%] flex-col gap-1', msg.from === 'user' && 'items-end')}>
                      <p
                        className={cn(
                          'whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm',
                          msg.from === 'bot'
                            ? 'rounded-bl-sm bg-secondary text-foreground'
                            : 'rounded-br-sm bg-primary text-primary-foreground',
                        )}
                      >
                        {msg.text}
                      </p>
                      {msg.source && msg.from === 'bot' && sourceLabel[msg.source] && (
                        <span className="px-1 text-[10px] text-muted-foreground">
                          {sourceLabel[msg.source]}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <span className="mb-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="size-3.5" />
                  </span>
                  <span className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-secondary px-4 py-3 shadow-sm">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: `${dot * 0.15}s` }}
                      />
                    ))}
                  </span>
                </motion.div>
              )}

              {/* Option chips */}
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-1.5 pt-1"
                >
                  {(currentNode.options ?? []).map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => selectTreeOption(option.label, option.nextId)}
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-left text-sm text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Back button for tree leaf nodes (unauthenticated only) */}
              {showBackButton && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/10 active:scale-[0.98]"
                  >
                    Back to topics
                  </button>
                </motion.div>
              )}
            </div>

            {/* Input — only shown when authenticated */}
            {isAuthenticated && (
              <div className="flex items-center gap-2 border-t border-border bg-surface px-3 py-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything…"
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
                />
                <Button
                  size="sm"
                  variant="primary"
                  disabled={!input.trim() || loading}
                  onClick={() => void sendToLLM(input)}
                  className="size-8 shrink-0 rounded-full p-0"
                  aria-label="Send"
                >
                  <Send className="size-3.5" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <div className="pointer-events-auto relative">
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20" />}
        <Button
          variant="primary"
          onClick={() => setOpen((v) => !v)}
          aria-label={t(open ? 'chatbot.closeChat' : 'chatbot.openChat')}
          className="relative size-14 rounded-full p-0 shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'close' : 'bot'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              {open ? <X className="size-5" /> : <Bot className="size-5" />}
            </motion.span>
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
}
