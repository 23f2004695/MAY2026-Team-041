import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui';
import { cn } from '@/lib/cn';
import { aiConversation } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function AILibrarian() {
  const { t } = useTranslation('landing');

  return (
    <section
      aria-labelledby="ai-librarian-heading"
      className="border-b border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 lg:py-30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <h2 id="ai-librarian-heading" className="text-3xl font-semibold text-foreground">
            {t('aiLibrarian.heading')}
          </h2>
          <p className="mt-2 text-muted-foreground">{t('aiLibrarian.description')}</p>

          <Card className="mt-8 flex flex-col gap-4 p-6">
            {aiConversation.map((entry, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  entry.role === 'user' && 'flex-row-reverse',
                )}
              >
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full',
                    entry.role === 'user'
                      ? 'bg-secondary text-foreground'
                      : 'bg-primary text-primary-foreground',
                  )}
                >
                  {entry.role === 'user' ? <User className="size-4" /> : <Bot className="size-4" />}
                </span>
                <p
                  className={cn(
                    'max-w-md rounded-lg px-4 py-2 text-sm',
                    entry.role === 'user'
                      ? 'bg-secondary text-foreground'
                      : 'bg-primary/10 text-foreground',
                  )}
                >
                  {t(`aiLibrarian.conversation.${entry.id}.message`)}
                </p>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
