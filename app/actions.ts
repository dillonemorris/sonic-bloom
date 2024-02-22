"use server";

// TODO: Maybe delete
import { redirect } from "next/navigation";

export async function navigateToSignIn() {
  redirect("/api/auth/signin/");
}
