import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function Shop() {
  useEffect(() => {
    document.title = "Shop - Pronia";
  }, []);

  return (
    <div>
      <RouteBanner title="Shop" />
    </div>
  );
}