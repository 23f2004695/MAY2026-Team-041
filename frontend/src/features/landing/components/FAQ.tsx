import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { faqs } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function FAQ() {
  return (
    <section aria-labelledby="faq-heading" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 lg:py-30">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          id="faq-heading"
          className="mb-8 text-3xl font-semibold text-foreground"
        >
          Frequently asked questions
        </motion.h2>

        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-border bg-surface p-4 open:pb-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground">
                {faq.question}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
