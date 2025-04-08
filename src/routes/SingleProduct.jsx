import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function SingleProduct() {
  useEffect(() => {
    document.title = "Product Details - Pronia";
  }, []);

  return (
    <div>
      <RouteBanner title="Product Details" />
    </div>
  );
}