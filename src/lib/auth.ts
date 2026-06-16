"use server";
import { cookies } from "next/headers"

export const saveToken = async(access: string): Promise<void> =>{
   (await cookies()).set("access", access);
}

export const getCurrentUser = async(): Promise<{ access: string | undefined; }> => {
  const access = (await cookies()).get("access")?.value;
  return {access};
};

export const removeToken = async() =>{
    (await cookies()).delete("access");
}