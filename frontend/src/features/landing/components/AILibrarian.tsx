import { AnimatePresence, motion } from 'framer-motion';
import { Bot, BookOpen, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge, Button, Card } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { aiRecommendedBooks } from '@/mocks/landing';

import { FadeUp } from './FadeUp';
import { viewportOnce } from '../motion';

const STEP_USER = 1;
const STEP_TYPING = 2;
const STEP_REPLY = 3;
const STEP_BOOKS = 4;

export function AILibrarian() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const hasStarted = useRef(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const scheduled = timeouts.current;
    return () => {
      scheduled.forEach(clearTimeout);
    };
  }, []);

  function startSequence() {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const schedule = (delay: number, value: number) => {
      timeouts.current.push(setTimeout(() => setStep(value), delay));
    };

    schedule(0, STEP_USER);
    schedule(650, STEP_TYPING);
    schedule(1900, STEP_REPLY);
    schedule(2250, STEP_BOOKS);
  }

  return (
    <section
      aria-labelledby="ai-librarian-heading"
      className="border-b border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 lg:py-30">
        <motion.div viewport={viewportOnce} onViewportEnter={startSequence}>
          <FadeUp>
            <h2 id="ai-librarian-heading" className="text-3xl font-semibold text-foreground">
              {t('landing.aiLibrarian.heading')}
            </h2>
          </FadeUp>
          <FadeUp delay={1}>
            <p className="mt-2 text-muted-foreground">{t('landing.aiLibrarian.subheading')}</p>
          </FadeUp>

          <motion.div
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative mt-8"
          >
            <Card className="relative overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border-muted bg-secondary/40 px-4 py-3">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-danger/50" />
                  <span className="size-2.5 rounded-full bg-warning/50" />
                  <span className="size-2.5 rounded-full bg-success/50" />
                </span>
                <span className="ml-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Bot className="size-3.5 text-primary" />
                  {t('landing.aiLibrarian.windowTitle')}
                </span>
              </div>

              <div className="flex flex-col gap-4 p-5">
                {step >= STEP_USER && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex flex-row-reverse items-start gap-3"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                      <User className="size-4" />
                    </span>
                    <p className="max-w-md rounded-lg bg-secondary px-4 py-2 text-sm text-foreground">
                      {t('landing.aiLibrarian.prompt')}
                    </p>
                  </motion.div>
                )}

                {step >= STEP_TYPING && (
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Bot className="size-4" />
                    </span>
                    <div className="flex max-w-md flex-col gap-3">
                      <AnimatePresence mode="wait">
                        {step === STEP_TYPING && (
                          <motion.div
                            key="typing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex w-fit items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-3"
                          >
                            {[0, 1, 2].map((dot) => (
                              <motion.span
                                key={dot}
                                className="size-1.5 rounded-full bg-primary/70"
                                animate={{ y: [0, -4, 0] }}
                                transition={{
                                  duration: 0.9,
                                  repeat: Infinity,
                                  delay: dot * 0.15,
                                  ease: 'easeInOut',
                                }}
                              />
                            ))}
                          </motion.div>
                        )}

                        {step >= STEP_REPLY && (
                          <motion.p
                            key="reply"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="w-fit rounded-lg bg-primary/10 px-4 py-2 text-sm text-foreground"
                          >
                            {t('landing.aiLibrarian.reply')}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {step >= STEP_BOOKS && (
                        <div className="flex flex-col gap-2">
                          {aiRecommendedBooks.map((book, index) => (
                            <motion.div
                              key={book.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.12, ease: 'easeOut' }}
                            >
                              <Card className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2.5">
                                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <BookOpen className="size-4" />
                                  </span>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {book.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {t(`landing.aiLibrarian.shelves.${book.id}`)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={book.available ? 'success' : 'warning'}>
                                    {book.available
                                      ? t('landing.aiLibrarian.available')
                                      : t('landing.aiLibrarian.reserved')}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant={book.available ? 'primary' : 'outline'}
                                    onClick={() => comingSoonToast(`Reserving "${book.title}"`)}
                                  >
                                    {t('landing.aiLibrarian.reserveBook')}
                                  </Button>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
