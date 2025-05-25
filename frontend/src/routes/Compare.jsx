import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function Compare() {
  useEffect(() => {
    document.title = 'Compare Products - Pronia';
  }, []);

  return (
    <div>
      <RouteBanner title="compare" />
    </div>
  );
}
