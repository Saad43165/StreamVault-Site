import { DetailSkeleton } from '@/components/site/skeletons';
import Navbar from '@/components/site/navbar';

export default function Loading() {
  return (
    <>
      <Navbar />
      <DetailSkeleton />
    </>
  );
}
