import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

import { fadeInUp, viewportOnce } from '../motion';

export function CTA() {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="cta-heading" className="border-b border-border bg-primary">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-16 md:py-20 lg:py-30 text-center"
      >
        <h2 id="cta-heading" className="text-3xl font-semibold text-primary-foreground">
          Become a member and start reading today
        </h2>
        <p className="max-w-xl text-primary-foreground/80">
          Join the reading community, explore the library, and never lose track of a book again.
        </p>
        <Button size="lg" variant="secondary" onClick={() => navigate(ROUTES.REGISTER)}>
          Join the Reading Community
        </Button>
      </motion.div>
    </section>
  );
}
