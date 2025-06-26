// import React, { createContext, useContext, useReducer, useEffect } from 'react';

// // Action types
// const CART_ACTIONS = {
//   ADD_TO_CART: 'ADD_TO_CART',
//   REMOVE_FROM_CART: 'REMOVE_FROM_CART',
//   UPDATE_QUANTITY: 'UPDATE_QUANTITY',
//   CLEAR_CART: 'CLEAR_CART',
//   LOAD_CART: 'LOAD_CART'
// };

// const WISHLIST_ACTIONS = {
//   ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
//   REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
//   CLEAR_WISHLIST: 'CLEAR_WISHLIST',
//   LOAD_WISHLIST: 'LOAD_WISHLIST',
//   MOVE_TO_CART: 'MOVE_TO_CART'
// };

// // Initial state
// const initialState = {
//   cart: [],
//   wishlist: []
// };

// // Cart reducer
// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case CART_ACTIONS.ADD_TO_CART: {
//       const { product, quantity = 1 } = action.payload;
//       const existingItem = state.find(item => item._id === product._id);

//       if (existingItem) {
//         return state.map(item =>
//           item._id === product._id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       }

//       return [...state, { ...product, quantity }];
//     }

//     case CART_ACTIONS.REMOVE_FROM_CART:
//       return state.filter(item => item._id !== action.payload);

//     case CART_ACTIONS.UPDATE_QUANTITY: {
//       const { productId, quantity } = action.payload;
//       if (quantity <= 0) {
//         return state.filter(item => item._id !== productId);
//       }
//       return state.map(item =>
//         item._id === productId ? { ...item, quantity } : item
//       );
//     }

//     case CART_ACTIONS.CLEAR_CART:
//       return [];

//     case CART_ACTIONS.LOAD_CART:
//       return action.payload || [];

//     default:
//       return state;
//   }
// };

// // Wishlist reducer
// const wishlistReducer = (state, action) => {
//   switch (action.type) {
//     case WISHLIST_ACTIONS.ADD_TO_WISHLIST: {
//       const product = action.payload;
//       const exists = state.find(item => item._id === product._id);
//       if (exists) return state;
//       return [...state, product];
//     }

//     case WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST:
//       return state.filter(item => item._id !== action.payload);

//     case WISHLIST_ACTIONS.CLEAR_WISHLIST:
//       return [];

//     case WISHLIST_ACTIONS.LOAD_WISHLIST:
//       return action.payload || [];

//     case WISHLIST_ACTIONS.MOVE_TO_CART:
//       return state.filter(item => item._id !== action.payload);

//     default:
//       return state;
//   }
// };

// // Main reducer
// const mainReducer = (state, action) => {
//   return {
//     cart: cartReducer(state.cart, action),
//     wishlist: wishlistReducer(state.wishlist, action)
//   };
// };

// // Create contexts
// const CartWishlistContext = createContext();

// // Provider component
// export const CartWishlistProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(mainReducer, initialState);

//   // Load data from localStorage on mount
//   useEffect(() => {
//     const savedCart = localStorage.getItem('pronia_cart');
//     const savedWishlist = localStorage.getItem('pronia_wishlist');

//     if (savedCart) {
//       try {
//         dispatch({ type: CART_ACTIONS.LOAD_CART, payload: JSON.parse(savedCart) });
//       } catch (error) {
//         console.error('Error loading cart from localStorage:', error);
//       }
//     }

//     if (savedWishlist) {
//       try {
//         dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: JSON.parse(savedWishlist) });
//       } catch (error) {
//         console.error('Error loading wishlist from localStorage:', error);
//       }
//     }
//   }, []);

//   // Save to localStorage whenever state changes
//   useEffect(() => {
//     localStorage.setItem('pronia_cart', JSON.stringify(state.cart));
//   }, [state.cart]);

//   useEffect(() => {
//     localStorage.setItem('pronia_wishlist', JSON.stringify(state.wishlist));
//   }, [state.wishlist]);

//   // Cart functions
//   const addToCart = (product, quantity = 1) => {
//     dispatch({
//       type: CART_ACTIONS.ADD_TO_CART,
//       payload: { product, quantity }
//     });
//   };

//   const removeFromCart = (productId) => {
//     dispatch({
//       type: CART_ACTIONS.REMOVE_FROM_CART,
//       payload: productId
//     });
//   };

//   const updateCartQuantity = (productId, quantity) => {
//     dispatch({
//       type: CART_ACTIONS.UPDATE_QUANTITY,
//       payload: { productId, quantity }
//     });
//   };

//   const clearCart = () => {
//     dispatch({ type: CART_ACTIONS.CLEAR_CART });
//   };

//   // Wishlist functions
//   const addToWishlist = (product) => {
//     dispatch({
//       type: WISHLIST_ACTIONS.ADD_TO_WISHLIST,
//       payload: product
//     });
//   };

//   const removeFromWishlist = (productId) => {
//     dispatch({
//       type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST,
//       payload: productId
//     });
//   };

//   const clearWishlist = () => {
//     dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
//   };

//   const moveToCartFromWishlist = (productId, quantity = 1) => {
//     const wishlistItem = state.wishlist.find(item => item._id === productId);
//     if (wishlistItem) {
//       addToCart(wishlistItem, quantity);
//       dispatch({
//         type: WISHLIST_ACTIONS.MOVE_TO_CART,
//         payload: productId
//       });
//     }
//   };

//   // Helper functions
//   const isInCart = (productId) => {
//     return state.cart.some(item => item._id === productId);
//   };

//   const isInWishlist = (productId) => {
//     return state.wishlist.some(item => item._id === productId);
//   };

//   const getCartItemQuantity = (productId) => {
//     const item = state.cart.find(item => item._id === productId);
//     return item ? item.quantity : 0;
//   };

//   const getCartTotal = () => {
//     return state.cart.reduce((total, item) => {
//       const price = typeof item.price === 'object'
//         ? Object.values(item.price)[0] || 0
//         : item.price || 0;
//       return total + (price * item.quantity);
//     }, 0);
//   };

//   const getCartItemsCount = () => {
//     return state.cart.reduce((total, item) => total + item.quantity, 0);
//   };

//   const value = {
//     // State
//     cart: state.cart,
//     wishlist: state.wishlist,

//     // Cart functions
//     addToCart,
//     removeFromCart,
//     updateCartQuantity,
//     clearCart,

//     // Wishlist functions
//     addToWishlist,
//     removeFromWishlist,
//     clearWishlist,
//     moveToCartFromWishlist,

//     // Helper functions
//     isInCart,
//     isInWishlist,
//     getCartItemQuantity,
//     getCartTotal,
//     getCartItemsCount
//   };

//   return (
//     <CartWishlistContext.Provider value={value}>
//       {children}
//     </CartWishlistContext.Provider>
//   );
// };

// // Custom hook
// export const useCartWishlist = () => {
//   const context = useContext(CartWishlistContext);
//   if (!context) {
//     throw new Error('useCartWishlist must be used within CartWishlistProvider');
//   }
//   return context;
// };
