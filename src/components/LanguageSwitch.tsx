import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
  ];

  return (
    <Select value={language} onValueChange={(value: 'en' | 'zh') => setLanguage(value)}>
      <SelectTrigger className="w-[120px] bg-transparent border-gold/30 text-foreground hover:border-gold transition-colors">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-background/95 backdrop-blur-md border-border">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {lang.nativeName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitch;