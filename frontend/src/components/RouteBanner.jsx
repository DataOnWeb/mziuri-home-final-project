import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function RouteBanner({ title }) {
  const { t } = useTranslation();

  return (
    <div className="route-banner">
      <div className="route-banner__container">
        <div className="route-banner__content">
          <h1 className="route-banner__title">{t(title)}</h1>
          <div className="route-banner__breadcrumb">
            <Link
              to="/"
              className="route-banner__home-link"
            >
              {t('home')}
            </Link>
            <span className="route-banner__separator"></span>
            <span className="route-banner__current">{t(title)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteBanner