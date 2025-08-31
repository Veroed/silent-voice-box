import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [showSelector, setShowSelector] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    setShowSelector(false);
  };

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSelector(!showSelector)}
        className="gap-2"
      >
        <Globe className="h-4 w-4" />
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.name}</span>
      </Button>

      {showSelector && (
        <Card className="absolute top-full mt-2 right-0 z-50 p-2 min-w-[150px]">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={i18n.language === lang.code ? "default" : "ghost"}
              size="sm"
              onClick={() => changeLanguage(lang.code)}
              className="w-full justify-start gap-2 mb-1 last:mb-0"
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </Button>
          ))}
        </Card>
      )}
    </div>
  );
};

export default LanguageSelector;