"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  const router = useRouter(); // Initialize Next.js router
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // 🔹 Added loading state

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // 🔹 Show loading state

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/register", {
        name: formData.name.trim(), // 🔹 Trim input values
        username: formData.username.trim(),
        password: formData.password.trim(),
      });

      if (response.status === 201) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push('/'); // Redirect after 2s
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Try again."); // 🔹 Improved error handling
    } finally {
      setLoading(false); // 🔹 Reset loading state
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header with Centered Title */}
      <header className="flex justify-center items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-heading text-primary">Mental Health Assistant</h1>
      </header>

      {/* Registration Card */}
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  name="username"
                  placeholder="Email"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Registering..." : "Register"} {/* 🔹 Show loading text */}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
