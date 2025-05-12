import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact Us - Pronia';
  }, []);

  return (
    <div>
      <RouteBanner title="Contact" />
    </div>
  );
}
