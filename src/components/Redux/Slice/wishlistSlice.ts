import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TProduct } from "@/types";

interface WishlistState {
  items: TProduct[];
}

const initialState: WishlistState = {
  items: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<TProduct>) => {
      const exists = state.items.some((item) => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    toggleWishlist: (state, action: PayloadAction<TProduct>) => {
      const index = state.items.findIndex((item) => item._id === action.payload._id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist?.items || [];
export const selectWishlistCount = (state: { wishlist: WishlistState }) => state.wishlist?.items?.length || 0;
export const selectIsInWishlist = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist?.items?.some((item) => item._id === productId) || false;
