import PlantCarousel from "../components/PlantCarousel";
import CarouselImage1 from '../assets/images/plant1.png'
import CarouselImage2 from '../assets/images/plant2.png'

const Home = () =>{
    const carouselSlides = [
        {
          discount: "65% OFF",
          title: "NEW PLANT",
          description: "Pronia, With 100% Natural, Organic & Plant Shop.",
          buttonText: "DISCOVER NOW",
          imageUrl: CarouselImage1,
          imageAlt: "Leafy Green Plant in Gray Pot"
        },
        {
          discount: "40% OFF",
          title: "FRESH HERBS",
          description: "Modern planters with organic herbs for your home.",
          buttonText: "SHOP NOW",
          imageUrl: CarouselImage2,
          imageAlt: "Geometric Planters with Green Plants"
        },
      ];
    return  (
    <PlantCarousel slides={carouselSlides}></PlantCarousel>

    )
}

export default Home