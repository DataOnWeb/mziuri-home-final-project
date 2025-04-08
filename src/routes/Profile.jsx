import { useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function Profile() {
  useEffect(() => {
    document.title = "My Profile - Your Store";
  }, []);

  return (
    <div>
      <RouteBanner title="My Profile" />
    </div>
  );
}