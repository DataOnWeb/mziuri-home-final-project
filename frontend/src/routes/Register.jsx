import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function Register() {
  useEffect(() => {
    document.title = "Register - Pronia";
  }, []);

  return (
    <div>
      <RouteBanner title="Register" />
    </div>
  );
}