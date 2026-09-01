"use client";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "../Redux/store";
import AuthProvider from "./AuthProvider";
import CartSync from "./CartSync";





const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <Toaster position="top-right" richColors />
      <AuthProvider>
        <CartSync />
        {children}
      </AuthProvider>
    </ReduxProvider>
  );
};

export default Provider;
