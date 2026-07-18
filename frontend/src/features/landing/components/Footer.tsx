import { motion, type Variants } from 'framer-motion';
import { Globe, Link2, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const socialVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 10 } },
};

interface FooterNavLink {
  label: string;
  to: string;
}

// Hoisted to module scope: a component declared inside Footer's render body would remount
// (and reset its animation state) on every re-render.
function NavList({ title, links }: { title: string; links: FooterNavLink[] }) {
  return (
    <motion.nav variants={itemVariants} aria-label={title}>
      <p className="mb-2 border-b border-border pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <motion.li key={link.to} variants={linkVariants}>
            <Link
              to={link.to}
              className="group relative text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
              <motion.span
                className="absolute bottom-0 left-0 h-0.5 bg-primary"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}

export function Footer() {
  const { t } = useTranslation();

  const navLinks: FooterNavLink[] = [
    { label: t('landing.footer.home'), to: ROUTES.HOME },
    { label: t('landing.footer.login'), to: ROUTES.LOGIN },
    { label: t('landing.footer.register'), to: ROUTES.REGISTER },
  ];

  const quickLinks: FooterNavLink[] = [
    { label: t('nav.pricing'), to: ROUTES.PRICING },
    { label: t('landing.footer.books'), to: ROUTES.BOOKS },
    { label: t('landing.footer.community'), to: ROUTES.COMMUNITY },
    { label: t('landing.footer.events'), to: ROUTES.EVENTS },
  ];

  const socialLinks = [
    { label: t('landing.footer.website'), href: '#', icon: Globe },
    { label: t('landing.footer.communityForum'), href: '#', icon: MessageCircle },
    { label: t('landing.footer.newsletter'), href: '#', icon: Link2 },
  ];

  return (
    // ponytail: clip-path sticky-reveal trick, swap for scroll-driven animation API when browser support allows
    <div
      className="relative h-[70vh]"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
    >
      <div className="relative top-[-100vh] h-[170vh]">
        <div className="sticky top-[30vh] h-[70vh]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-surface px-4 py-6 md:px-12 md:py-12"
          >
            <h2 id="footer-heading" className="sr-only">
              {t('landing.footer.heading')}
            </h2>

            <motion.div
              className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl md:h-96 md:w-96"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-secondary/5 blur-3xl md:h-96 md:w-96"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 1,
              }}
            />

            <div className="relative z-10 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-12 lg:gap-20">
              <motion.div variants={itemVariants}>
                <p className="text-sm font-semibold text-foreground">{t('landing.footer.brand')}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('landing.footer.description')}
                </p>
              </motion.div>
              <NavList title={t('landing.footer.navigation')} links={navLinks} />
              <NavList title={t('landing.footer.quickLinks')} links={quickLinks} />
              <motion.div variants={itemVariants}>
                <p className="mb-2 text-sm font-semibold text-foreground">
                  {t('landing.footer.contact')}
                </p>
                <a
                  href="mailto:hello@communityreadingclub.org"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Mail className="size-4" />
                  hello@communityreadingclub.org
                </a>
                <div className="mt-4 flex gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      variants={socialVariants}
                      href={social.href}
                      aria-label={social.label}
                      whileHover={{
                        scale: 1.2,
                        rotate: 12,
                        transition: { type: 'spring', stiffness: 300, damping: 15 },
                      }}
                      whileTap={{ scale: 0.9 }}
                      className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-300 hover:bg-linear-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground"
                    >
                      <social.icon className="size-4" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.p
              variants={itemVariants}
              className="relative z-10 mt-6 text-xs text-muted-foreground md:text-sm"
            >
              © {new Date().getFullYear()} {t('landing.footer.brand')}.{' '}
              {t('landing.footer.description') && ''}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
