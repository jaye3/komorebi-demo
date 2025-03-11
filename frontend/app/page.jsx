"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/login-form";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Simulate checking authentication (Replace with actual session check)
    const userToken = localStorage.getItem("token"); // Example: Checking a stored token
    if (userToken) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </main>
  );
}


