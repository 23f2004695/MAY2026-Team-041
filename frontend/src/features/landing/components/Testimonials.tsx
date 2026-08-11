import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReviewCard, Section, SectionHeading } from '@/components/common';
import { getAllLibraryReviews, type LibraryReview } from '@/lib/libraryReviews';
import { useActiveSection } from '@/providers/ActiveSectionProvider';

import { Marquee } from './Marquee';

const SECTION_ID = 'testimonials';

export function Testimonials() {
  const { t } = useTranslation();
  const { setActiveSection } = useActiveSection();
  const [reviewsList, setReviewsList] = useState<LibraryReview[]>(getAllLibraryReviews);

  useEffect(() => {
    function handleUpdate() {
      setReviewsList(getAllLibraryReviews());
    }
    window.addEventListener('library_reviews_updated', handleUpdate);
    return () => window.removeEventListener('library_reviews_updated', handleUpdate);
  }, []);

  // Marks "testimonials" as the active nav section only while it's actually visible in the
  // viewport, so the "Reviews" header link highlights on scroll — not just on the home route.
  useEffect(() => {
    const node = document.getElementById(SECTION_ID);
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActiveSection(entry.isIntersecting ? SECTION_ID : null),
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      setActiveSection(null);
    };
  }, [setActiveSection]);

  return (
    <Section id="testimonials" ariaLabelledBy="testimonials-heading">
      <SectionHeading
        id="testimonials-heading"
        title={t('landing.testimonials.heading')}
        headingClassName="mb-8"
      />

      <Marquee gap={16} duration={30}>
        {reviewsList.map((item) => {
          const isCustom = item.id.startsWith('review_');
          const roleText = isCustom
            ? item.role
            : t(`landing.testimonials.items.${item.id}.role`, { defaultValue: item.role });
          const quoteText = isCustom
            ? item.quote
            : t(`landing.testimonials.items.${item.id}.quote`, { defaultValue: item.quote });

          return (
            <div key={item.id} className="w-72 sm:w-80">
              <ReviewCard
                name={item.name}
                role={roleText}
                quote={quoteText}
                rating={item.rating}
              />
            </div>
          );
        })}
      </Marquee>
    </Section>
  );
}
