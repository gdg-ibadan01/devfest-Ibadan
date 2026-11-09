import type { Metadata } from 'next';
import ComingSoon from '../_module/components/common/ComingSoon';

// Placeholder page: keep it out of search results until it has real content.
export const metadata: Metadata = {
  title: 'Schedule',
  robots: { index: false, follow: true },
};

export default function Schedule() {
  return (
    <>
      <ComingSoon page="Schedule" />
    </>
  );
}
