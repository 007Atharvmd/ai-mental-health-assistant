"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("user_id", data.user_id); // Store user_id in localStorage

      router.push(`/chat`); // Navigate to chat page
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header with Centered Title */}
      <header className="flex justify-center items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-heading text-primary">Mental Health Assistant</h1>
      </header>

      {/* Login Card */}
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Log In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button className="w-full" type="submit">Log In</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p>
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
