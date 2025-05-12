import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function Wishlist() {
  useEffect(() => {
    document.title = 'My Wishlist - Pronia';
  }, []);

  return (
    <div>
      <RouteBanner title="Wishlist" />
    </div>
  );
}
