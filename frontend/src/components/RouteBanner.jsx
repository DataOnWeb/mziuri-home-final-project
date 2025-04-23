
import { Link } from 'react-router-dom';


function RouteBanner({ title }) {
  return (
    <div className="route-banner">
      <div className="route-banner__container">
        <div className="route-banner__content">
          <h1 className="route-banner__title">{title}</h1>
          <div className="route-banner__breadcrumb">
            <Link to="/" className="route-banner__home-link">Home</Link>
            <span className="route-banner__separator"></span>
            <span className="route-banner__current">{title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteBanner;