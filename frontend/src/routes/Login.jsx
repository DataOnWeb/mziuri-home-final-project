import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function Login() {
  useEffect(() => {
    document.title = "Login - Pronia";
  }, []);

  return (
    <div>
      <RouteBanner title="Login" />
    </div>
  );
}