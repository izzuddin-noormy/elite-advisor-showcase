'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { FAQ } from '@/integrations/supabase/cms-types';

interface FaqEditorProps {
  value: FAQ[];
  onChange: (faqs: FAQ[]) => void;
}

const FaqEditor = ({ value, onChange }: FaqEditorProps) => {
  const faqs = value || [];
  const update = (i: number, patch: Partial<FAQ>) => {
    const next = faqs.map((f, idx) => (idx === i ? { ...f, ...patch } : f));
    onChange(next);
  };
  const add = () => onChange([...faqs, { q_en: '', q_zh: '', a_en: '', a_zh: '' }]);
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        FAQs are shown on the page and emitted as FAQPage structured data — this is what answer engines (Google AI, etc.) surface directly.
      </p>
      {faqs.map((f, i) => (
        <div key={i} className="border rounded-md p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Q{i + 1}</span>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}><Trash2 className="h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Question (EN)</Label>
              <Input value={f.q_en || ''} onChange={(e) => update(i, { q_en: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Question (中文)</Label>
              <Input value={f.q_zh || ''} onChange={(e) => update(i, { q_zh: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Answer (EN)</Label>
              <Textarea rows={2} value={f.a_en || ''} onChange={(e) => update(i, { a_en: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Answer (中文)</Label>
              <Textarea rows={2} value={f.a_zh || ''} onChange={(e) => update(i, { a_zh: e.target.value })} />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}><Plus className="h-4 w-4 mr-2" /> Add FAQ</Button>
    </div>
  );
};

export default FaqEditor;
