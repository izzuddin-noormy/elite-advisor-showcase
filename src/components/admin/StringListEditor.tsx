import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StringListEditorProps {
  label: string;
  value: string[];
  onChange: (list: string[]) => void;
  placeholder?: string;
}

/** Edits a list of strings, one item per line. */
const StringListEditor = ({ label, value, onChange, placeholder }: StringListEditorProps) => {
  const text = (value || []).join('\n');
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        rows={4}
        value={text}
        placeholder={placeholder || 'One item per line'}
        onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
      />
      <p className="text-xs text-muted-foreground">One item per line.</p>
    </div>
  );
};

export default StringListEditor;
