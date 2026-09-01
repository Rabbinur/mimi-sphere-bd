"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { useCurrentUserInfo } from "../Redux/Slice/authSlice";
import {
  useGetCartQuery,
  useSyncCartServerMutation,
} from "../Redux/RTK/cartApi";
import { setCart } from "../Redux/Slice/cartSlice";

const CartSync = () => {
  const userInfo = useAppSelector(useCurrentUserInfo);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const dispatch = useAppDispatch();
  const [syncCart] = useSyncCartServerMutation();

  // Skip fetching if not logged in
  const { data: serverCart, isSuccess: isCartFetched } = useGetCartQuery(
    undefined,
    {
      skip: !userInfo,
    },
  );

  const lastSyncRef = useRef<string>("");
  const initialSyncDone = useRef<boolean>(false);

  // 1. When user logs in or server cart is fetched, merge local and server items
  useEffect(() => {
    // We proceed if the cart was fetched successfully, even if data is null (new user)
    if (userInfo && isCartFetched && !initialSyncDone.current) {
      console.log(
        "CartSync: Initial cart fetch successful. Data:",
        serverCart?.data,
      );

      const serverItems =
        serverCart?.data?.items
          ?.filter((item: any) => item.product)
          ?.map((item: any) => ({
            id: item.variantId
              ? `${item.product._id}::${item.variantId}`
              : `${item.product._id}::default`,
            product_id: item.product._id,
            variant_id: item.variantId || null,
            title: item.product.product_title,
            thumbnail: item.product.thumbnail,
            price: item.price,
            quantity: item.quantity,
          })) || [];

      if (serverItems.length > 0 || cartItems.length > 0) {
        // Merge Logic: Server items + Local items not in server
        const mergedItems = [...serverItems];

        cartItems.forEach((localItem) => {
          const existsInServer = serverItems.some(
            (si: any) => si.id === localItem.id,
          );
          if (!existsInServer) {
            mergedItems.push(localItem);
          }
        });

        // If there's a difference, update local state
        if (JSON.stringify(mergedItems) !== JSON.stringify(cartItems)) {
          console.log(
            "CartSync: Updating local cart with merged items",
            mergedItems,
          );
          dispatch(setCart(mergedItems));
        } else {
          console.log(
            "CartSync: No merge needed, local cart is already up to date.",
          );
        }

        // We mark initialSyncDone so subsequent changes can be pushed to server
        initialSyncDone.current = true;
        lastSyncRef.current = JSON.stringify(mergedItems);

        // Immediately trigger a sync to server if local items were merged or if server was empty
        const itemsToSync = mergedItems.map((item) => ({
          product: item.product_id,
          variantId: item.variant_id || "default",
          quantity: item.quantity,
          price: item.price,
        }));

        console.log("CartSync: Triggering immediate sync to server...");
        syncCart({ items: itemsToSync });
      } else {
        // Both carts are empty
        console.log("CartSync: Both server and local carts are empty.");
        initialSyncDone.current = true;
      }
    }
  }, [userInfo, isCartFetched, serverCart, dispatch]); // Removed cartItems from deps to avoid loop

  // Reset initialSyncDone if user logs out
  useEffect(() => {
    if (!userInfo) {
      initialSyncDone.current = false;
      lastSyncRef.current = "";
    }
  }, [userInfo]);

  // 2. Watch local cart changes and sync to server if logged in
  useEffect(() => {
    if (userInfo && initialSyncDone.current) {
      const currentCartStr = JSON.stringify(cartItems);
      if (currentCartStr !== lastSyncRef.current) {
        console.log("CartSync: Local cart changed, syncing to server...");
        lastSyncRef.current = currentCartStr;

        const itemsToSync = cartItems.map((item) => ({
          product: item.product_id,
          variantId: item.variant_id || "default",
          quantity: item.quantity,
          price: item.price,
        }));

        syncCart({ items: itemsToSync });
      }
    }
  }, [cartItems, userInfo, syncCart]);

  return null;
};

export default CartSync;
