import { useTranslation } from 'react-i18next';

import { Section } from '@/components/common';
import platformPreview from '@/assets/platform-preview.png';

import { ContainerScroll } from './ContainerScroll';

export function PlatformPreview() {
  const { t } = useTranslation();

  return (
    <Section ariaLabelledBy="platform-preview-heading">
      <ContainerScroll
        titleComponent={
          <h2 id="platform-preview-heading" className="text-3xl font-semibold text-foreground md:text-4xl">
            {t('landing.preview.title')}
          </h2>
        }
      >
        <img
          src={platformPreview}
          alt={t('landing.preview.imgAlt')}
          className="mx-auto h-full w-full rounded-2xl object-cover object-top-left"
          draggable={false}
        />
      </ContainerScroll>
    </Section>
  );
}
