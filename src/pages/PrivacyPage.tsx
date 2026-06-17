import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <div className="pt-24 pb-20 min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        
        <div className="mb-12">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-text-secondary">{t('privacy.updated')}</p>
        </div>

        <div 
          className="bg-surface p-6 md:p-10 rounded-[32px] shadow-soft border border-border/50 prose prose-p:text-text-secondary prose-headings:text-primary prose-headings:font-heading prose-a:text-accent-dark"
          dangerouslySetInnerHTML={{ __html: t('privacy.content') }}
        />

      </div>
    </div>
  );
}
