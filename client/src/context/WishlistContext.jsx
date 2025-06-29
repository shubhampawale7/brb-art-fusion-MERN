import { createContext, useReducer, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import API from "../services/api";

export const WishlistContext = createContext();

const initialState = {
  wishlistItems: [],
  loading: true,
};

function wishlistReducer(state, action) {
  switch (action.type) {
    case "SET_WISHLIST":
      return { ...state, wishlistItems: action.payload, loading: false };
    case "ADD_TO_WISHLIST":
      return {
        ...state,
        wishlistItems: [...state.wishlistItems, action.payload],
      };
    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(
          (p) => p._id !== action.payload._id
        ),
      };
    case "CLEAR_WISHLIST":
      return { ...state, wishlistItems: [] };
    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { state: authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (authState.userInfo) {
        try {
          const { data } = await API.get("/wishlist", {
            headers: { Authorization: `Bearer ${authState.userInfo.token}` },
          });
          dispatch({ type: "SET_WISHLIST", payload: data });
        } catch (error) {
          console.error("Failed to fetch wishlist");
        }
      } else {
        dispatch({ type: "CLEAR_WISHLIST" });
      }
    };
    fetchWishlist();
  }, [authState.userInfo]);

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
}
