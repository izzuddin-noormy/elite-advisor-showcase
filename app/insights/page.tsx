import InsightsList from '@/screens/InsightsList';
import type { Metadata } from 'next';
export const metadata: Metadata = {"title":"Market Insights"};

export default function Page() {
  return <InsightsList />;
}
