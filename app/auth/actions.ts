"use server";
import { signIn } from "@/auth";
import { signOut } from "next-auth/react";
export async function login() {
	return await signIn("discord");
}

export async function logout() {
  return await signOut();
}
