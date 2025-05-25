import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function Pages() {
  useEffect(() => {
    document.title = 'Other Pages - Pronia';
  }, []);

  return (
    <div>
      <RouteBanner title="pages" />
    </div>
  );
}
