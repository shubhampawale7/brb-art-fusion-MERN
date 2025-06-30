import { createContext, useReducer, useEffect } from "react";

export const CartContext = createContext();

const initialState = {
  isCartOpen: false,
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  shippingAddress: localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress"))
    : {},
  // The default value ensures it's never empty on first load
  paymentMethod: localStorage.getItem("paymentMethod")
    ? JSON.parse(localStorage.getItem("paymentMethod"))
    : "Razorpay",
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const newItem = action.payload;
      const existItem = state.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cartItems, newItem];
      return { ...state, cartItems };
    }
    case "REMOVE_FROM_CART": {
      const itemToRemove = action.payload;
      const cartItems = state.cartItems.filter(
        (item) => item._id !== itemToRemove._id
      );
      return { ...state, cartItems };
    }
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case "CART_CLEAR":
      return {
        ...state,
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "Razorpay", // Reset to default on clear
      };
    case "OPEN_CART":
      return { ...state, isCartOpen: true };
    case "CLOSE_CART":
      return { ...state, isCartOpen: false };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // === THIS IS THE CORRECTED PART ===
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify(state.shippingAddress)
    );
    // This line ensures the payment method is saved to local storage
    localStorage.setItem("paymentMethod", JSON.stringify(state.paymentMethod));
  }, [state.cartItems, state.shippingAddress, state.paymentMethod]); // Add state.paymentMethod to the dependency array

  const value = { state, dispatch };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
