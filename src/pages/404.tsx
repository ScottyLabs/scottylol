import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function LostPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/help');
  });

  return null;
}
