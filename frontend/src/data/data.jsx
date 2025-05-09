import marigold from '../assets/images/marigold.jpg'
import bonzai from '../assets/images/bonzai.jpg'
import viburnum from '../assets/images/viburnum.jpg'
import reed from '../assets/images/reed.jpg'
import weed from '../assets/images/weed.jpg'
import hybrid from '../assets/images/hybrid.jpg'
import million from '../assets/images/million.jpg'
import verbena from '../assets/images/verbena.jpg'
import butterfly from '../assets/images/butterfly.jpg'
export const products = [
    {
      id: 1,
      title: "American Marigold",
      price: 23.45,
      rating: 5,
      image: marigold,
      category: "House Plants",
      color: "Gold"
    },
    {
      id: 2,
      title: "Black Eyed Susan",
      price: 25.45,
      rating: 5,
      image: reed,
      category: "House Plants",
      color: "White"
    },
    {
      id: 3,
      title: "Bleedin Heart",
      price: 30.45,
      rating: 5,
      image: bonzai,
      category: "House Plants",
      color: "Green"
    },
    {
      id: 4,
      title: "Bloody Cranesbill",
      price: 45.00,
      rating: 5,
      image: weed,
      category: "Bonsai",
      color: "Green"
    },
    {
      id: 5,
      title: "Butterfly Weed",
      price: 50.45,
      rating: 5,
      image: hybrid,
      category: "Indoor Living",
      color: "Black"
    },
    {
      id: 6,
      title: "Common Yarrow",
      price: 65.00,
      rating: 5,
      image: viburnum,
      category: "Perennials",
      color: "Green"
    },
    {
        id: 7,
        title: "Moss Verbena",
        price: 45.00,
        rating: 5,
        image: verbena,
        category: "Bonsai",
        color: "Black"
      },
      {
        id: 8,
        title: "Butterfly Weed",
        price: 50.45,
        rating: 5,
        image: butterfly,
        category: "Indoor Living",
        color: "White"
      },
      {
        id: 9,
        title: "Million Gold",
        price: 65.00,
        rating: 5,
        image: million,
        category: "Perennials",
        color: "Gold"
      },
      {
        id: 10,
        title: "Moss Viburnum",
        price: 45.00,
        rating: 5,
        image: hybrid,
        category: "Bonsai",
        color: "Black"
      },
      {
        id: 11,
        title: "Special Weed",
        price: 50.45,
        rating: 5,
        image: weed,
        category: "Indoor Living",
        color: "Green"
      },
      {
        id: 12,
        title: "Outdoor Bonsai",
        price: 65.00,
        rating: 5,
        image: bonzai,
        category: "Perennials",
        color: "Black"
      }
  ];
  
  export const categories = [
    { name: "All", count: 65 },
    { name: "Bonsai", count: 12 },
    { name: "House Plants", count: 22 },
    { name: "Indoor Living", count: 19 },
    { name: "Perennials", count: 17 },
    { name: "Plant For Gift", count: 1 },
    { name: "Garden Tools", count: 12 }
  ];
  
  export const colors = [
    { name: "All", count: 65 },
    { name: "Gold", count: 12 },
    { name: "Green", count: 22 },
    { name: "White", count: 13 },
    { name: "Black", count: 10 }
  ];
  
  export const totalProducts = 30;