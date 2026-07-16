import { Link } from 'react-router-dom';
import { BeachUmbrellaMap } from '../components/BeachUmbrellaMap';
import { ProfileIcon } from '../components/ProfileIcon';

export function Temp() {
  return (
    <div className="w-full min-h-screen font-montserrat relative bg-[#ddb678]" id="temp-page-root">
      <Link
        to="/profile"
        aria-label="Profilo"
        className="fixed top-5 right-5 z-50 w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform"
        id="profile-life-ring"
      >
        <ProfileIcon size={44} vibrate />
      </Link>

      <BeachUmbrellaMap bottomNavOffset />
    </div>
  );
}
