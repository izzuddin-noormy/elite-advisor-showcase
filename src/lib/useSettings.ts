'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GlobalSettings } from '@/integrations/supabase/cms-types';

let cache: GlobalSettings | null = null;

/** Fetch the global site settings (contact info, socials, default SEO). Cached per session. */
export function useSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(cache || {});
  const [loaded, setLoaded] = useState(!!cache);

  useEffect(() => {
    if (cache) return;
    (async () => {
      try {
        const { data } = await supabase.from('settings').select('value').eq('key', 'global').maybeSingle();
        const value = (data?.value as GlobalSettings) || {};
        cache = value;
        setSettings(value);
      } catch {
        setSettings({});
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  return { settings, loaded };
}

export function clearSettingsCache() {
  cache = null;
}
