import PlantCarousel from '../components/PlantCarousel';
import CarouselImage1 from '../assets/images/plant1.png';
import CarouselImage2 from '../assets/images/plant2.png';
import { useEffect } from 'react';
import { useLoader } from '../hooks/useLoader';
import { useTranslation } from 'react-i18next';
const Home = () => {
  const { t } = useTranslation();
  const carouselSlides = [
    {
      discount: t('plantCarousel.discount1'),
      title: t('plantCarousel.title1'),
      description: t('plantCarousel.description1'),
      buttonText: t('plantCarousel.buttonText'),
      imageUrl: CarouselImage1,
      imageAlt: 'Leafy Green Plant in Gray Pot',
    },
    {
      discount: t('plantCarousel.discount2'),
      title: t('plantCarousel.title2'),
      description: t('plantCarousel.description2'),
      buttonText: t('plantCarousel.buttonText2'),
      imageUrl: CarouselImage2,
      imageAlt: 'Geometric Planters with Green Plants',
    },
  ];
  const { useFakeLoader } = useLoader();

  useEffect(() => {
    useFakeLoader();
    document.title = 'Pronia - Home';
  }, []);

  return <PlantCarousel slides={carouselSlides}></PlantCarousel>;
};

export default Home;
