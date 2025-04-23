import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function About() {
  useEffect(() => {
    document.title = "About - Pronia";
    
  }, []);

  return (
    <div>
      <RouteBanner title="About" />
    </div>
  );
}