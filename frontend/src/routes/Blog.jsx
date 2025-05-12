import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function Blog() {
  useEffect(() => {
    document.title = 'Blog - Pronia';
  }, []);

  return (
    <div>
      <RouteBanner title="Blog" />
    </div>
  );
}
