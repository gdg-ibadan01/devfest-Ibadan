import type { Metadata } from 'next';
import ConciergeView from './ConciergeView';

export const metadata: Metadata = {
  title: 'Session Concierge',
  description:
    'Describe what you build and get personalized DevFest Ibadan 2026 talks and workshops.',
};

export default function Schedule() {
  return <ConciergeView />;
}
