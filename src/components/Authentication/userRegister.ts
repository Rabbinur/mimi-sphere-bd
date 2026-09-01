"use server";
import { FieldValues } from "react-hook-form";

export const userRegister = async (formData: FieldValues) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/create-account`, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const userInfo = await res.json();
  return { status: res.status, data: userInfo };
};
