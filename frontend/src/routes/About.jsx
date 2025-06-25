import { useEffect, useState } from 'react';
import RouteBanner from '../components/RouteBanner';
import { Truck, CreditCard, Headphones, Play, X } from 'lucide-react';
import Calligraphy from '../assets/images/2.png';
import GreenCarousel from '../components/GreenCarousel';
import { useLoader } from '../hooks/useLoader';
import marissa from '../assets/images/marissa.png';
import michael from '../assets/images/michael.png';
import kari from '../assets/images/kari.png';
import britney from '../assets/images/britney.png';
import { faFacebook, faTwitter, faPinterest, faDribbble } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import ScrollToTop from '../components/ScrollToTop';
const About = () => {
  const { useFakeLoader } = useLoader();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const {t} = useTranslation()
  const videoUrl = 'https://player.vimeo.com/video/172601404?autoplay=1';

  const features = [
    {
      id: 1,
      icon: <Truck className="w-10 h-10" />,
      title: t('features.title1'),
      description: t('features.subtitle1'),
      iconClass: 'text-green-500',
    },
    {
      id: 2,
      icon: <CreditCard className="w-10 h-10" />,
      title:  t('features.title2'),
      description: t('features.subtitle2'),
      iconClass: 'text-green-500',
    },
    {
      id: 3,
      icon: <Headphones className="w-10 h-10" />,
      title: t('features.title3'),
      description: t('features.subtitle2'),
      iconClass: 'text-green-500',
    },
  ];

  const stats = [
    { number: '150+', label: t('aboutPage.projects') },
    { number: '359+', label: t('aboutPage.clients') },
    { number: '251+', label: t('aboutPage.rating') },
    { number: '110+', label: t('aboutPage.awards') },
  ];

  const teamMembers = [
    {
      id: 1,
      name: t('aboutPage.worker1'),
      role: t('aboutPage.job1'),
      image: michael,
      bgColor: 'pink',
      social: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
      },
    },
    {
      id: 2,
      name: t('aboutPage.worker2'),
      role: t('aboutPage.job2'),
      image: britney,
      bgColor: 'orange',
      social: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
      },
    },
    {
      id: 3,
      name: t('aboutPage.worker3'),
      role: t('aboutPage.job3'),
      image: kari, 
      bgColor: 'purple',
      social: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
      },
    },
    {
      id: 4,
      name: t('aboutPage.worker4'),
      role: t('aboutPage.job4'),
      image: marissa,
      bgColor: 'yellow',
      social: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
      },
    },
  ];

  useEffect(() => {
    useFakeLoader();
    document.title = 'About - Pronia';
  }, []);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <div>
      <RouteBanner title="about" />

      <div className="about-section">
        <div className="container">
          {/* Story Header */}
          <div className="story-header">
            <h2 className="story-title">
              {t('aboutPage.header1')} <span className="highlight">{t('aboutPage.header2')}</span>
            </h2>
          </div>

          {/* Story Content */}
          <div className="story-content">
            <p>
              {t('aboutPage.text')}
            </p>
          </div>

          {/* Signature */}
          <div className="signature">
            <div className="signature-text">
              <img
                src={Calligraphy}
                alt="Signature"
              />
            </div>
          </div>
          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="feature-card"
              >
                <div className={`feature-icon ${feature.iconClass}`}>{feature.icon}</div>


                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>


          <div className="video-section">
            <div className="video-container">
              <div className="video-background">
                <div className="video-overlay"></div>
                <button
                  className="play-button"
                  onClick={openVideoModal}
                >
                  <div className="play-button-inner">
                    <Play className="play-icon" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <div className="stats-content">
              <p className="stats-description">
                {t('aboutPage.clientQuantity')}{' '} 
                <span className="highlight-green">{t('aboutPage.span1')}</span>{t('aboutPage.span2')}
              </p>
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <di
                    key={index}
                    className="stat-item"
                  >
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </di>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="team-section">
            <div className="team-header">
              <h2 className="team-title">{t('aboutPage.ourTeam')}</h2>
              <p className="team-description">
                {t('aboutPage.subtitle')}
              </p>
            </div>

            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`team-member ${index % 2 === 1 ? 'team-member-bottom' : 'team-member-top'}`}
                >
                  <div className={`team-member-image ${member.bgColor}`}>
                    <img
                      src={member.image}
                      alt={member.name}
                    />
                    <div className="team-member-overlay">
                      <div className="team-member-info">
                        <h3 className="team-member-name">{member.name}</h3>
                        <p className="team-member-role">{member.role}</p>
                        <div className="team-member-social">
                          <a
                            href={member.social.facebook}
                            className="social-link"
                          >
                            <FontAwesomeIcon icon={faFacebook} />
                          </a>
                          <a
                            href={member.social.twitter}
                            className="social-link"
                          >
                            <FontAwesomeIcon icon={faTwitter} />
                          </a>
                          <a
                            href={member.social.instagram}
                            className="social-link"
                          >
                            <FontAwesomeIcon icon={faPinterest} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="team-member-details">
                    <h3 className="team-member-name-bottom">{member.name}</h3>
                    <p className="team-member-role-bottom">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GreenCarousel />
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div
          className="about-video-modal-overlay"
          onClick={closeVideoModal}
        >
          <div
            className="about-video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="about-video-modal-close"
              onClick={closeVideoModal}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="about-video-wrapper">
              <iframe
                src={videoUrl}
                title="Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
      <ScrollToTop 
        showAfter={500}        
        smooth={true}            
      />
    </div>
  );
};

export default About;
