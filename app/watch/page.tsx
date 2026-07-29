import { Suspense } from 'react';
import VideoPlayer from '@/components/site/video-player';

export const dynamic = 'force-dynamic';

export default function WatchPage({
  searchParams,
}: {
  searchParams: { id?: string; type?: string; season?: string; episode?: string };
}) {
  return (
    <Suspense fallback={null}>
      <VideoPlayer searchParams={searchParams} />
    </Suspense>
  );
}