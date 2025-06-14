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
const About = () => {
  const { useFakeLoader } = useLoader();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Add your video URL here
  const videoUrl = 'https://player.vimeo.com/video/172601404?autoplay=1';

  const features = [
    {
      id: 1,
      icon: <Truck className="w-10 h-10" />,
      title: 'Free Shipping',
      description: 'Capped at $319 per order',
      iconClass: 'text-green-500',
    },
    {
      id: 2,
      icon: <CreditCard className="w-10 h-10" />,
      title: 'Safe Payment',
      description: 'With our payment gateway',
      iconClass: 'text-green-500',
    },
    {
      id: 3,
      icon: <Headphones className="w-10 h-10" />,
      title: 'Best Services',
      description: 'Friendly & Supper Services',
      iconClass: 'text-green-500',
    },
  ];

  const stats = [
    { number: '150+', label: 'Projects' },
    { number: '359+', label: 'Clients' },
    { number: '251+', label: 'Rating' },
    { number: '110+', label: 'Award' },
  ];

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Micheal Murphy',
      role: 'Sales man',
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
      name: 'Britney Cooper',
      role: 'Designer',
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
      name: 'Kari James',
      role: 'Developer',
      image: kari, // Replace with your image path
      bgColor: 'purple',
      social: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
      },
    },
    {
      id: 4,
      name: 'Marissa Swan',
      role: 'Manager',
      image: marissa, // Replace with your image path
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
              Our <span className="highlight">Story</span>
            </h2>
          </div>

          {/* Story Content */}
          <div className="story-content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum. Sed ut perspiciatis
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
                {/* Icon */}
                <div className={`feature-icon ${feature.iconClass}`}>{feature.icon}</div>

                {/* Content */}
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Video Section */}
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
          {/* Stats Section */}
          <div className="stats-section">
            <div className="stats-content">
              <p className="stats-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do{' '}
                <span className="highlight-green">eiusmod tempor</span> incididunt.
              </p>
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="stat-item"
                  >
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="team-section">
            <div className="team-header">
              <h2 className="team-title">OUR TEAM</h2>
              <p className="team-description">
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots
                <br />
                in a piece of classical Latin literature
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
    </div>
  );
};

export default About;
