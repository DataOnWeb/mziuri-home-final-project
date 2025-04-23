import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function Cart() {
  useEffect(() => {
    document.title = "Shopping Cart - Pronia";
  }, []);

  return (
    <div>
      <RouteBanner title="Shopping Cart" />
    </div>
  );
}