"use server";
import { cookies } from "next/headers";

export const saveToken = async (access: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set("access", access, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const getCurrentUser = async (): Promise<{ access: string | undefined }> => {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;
  return { access };
};

export const removeToken = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("access");
};