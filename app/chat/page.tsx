"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function Chat() {
  const [messages, setMessages] = useState<{ message: string; role: string }[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  // Fetch user_id from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    
    if (storedUserId) {
      const parsedUserId = parseInt(storedUserId, 10);
      if (!isNaN(parsedUserId)) {
        setUserId(parsedUserId);
        fetchChatHistory(parsedUserId);
      } else {
        console.error("❌ Invalid user_id format in localStorage:", storedUserId);
      }
    } else {
      console.warn("⚠️ User ID not found! Redirecting to login...");
      router.push("/");
    }
  }, []);

  // Fetch chat history from backend
const fetchChatHistory = async (userId: number) => {
  try {
    const response = await fetch(`http://localhost:8000/chat-history/${userId}`);
    const data = await response.json();

    if (Array.isArray(data)) {
      const formattedMessages = [];
      data.forEach((chat) => {
        formattedMessages.push({ message: chat.message, role: "user" }); // Store user message
        if (chat.ai_response) {
          formattedMessages.push({ message: chat.ai_response, role: "ai" }); // Store AI response
        }
      });
      setMessages(formattedMessages);
    }
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
  }
};

  // Handle sending a message
  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    if (userId === null) {
      alert("Please log in to start chatting.");
      console.error("❌ User ID is missing! Please log in.");
      return;
    }

    const messageToSend = input;
    setInput("");

    // Append user message to chat
    setMessages((prev) => [...prev, { message: messageToSend, role: "user" }]);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: messageToSend }),
      });

      if (!response.ok) {
        throw new Error(`❌ Failed to send message. Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.ai_response) {
        setMessages((prev) => [...prev, { message: data.ai_response, role: "ai" }]);
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="relative flex justify-center items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-heading text-primary">Mental Health Assistant</h1>
        <div className="absolute right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => alert("Settings coming soon!")}>Settings</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {
              localStorage.removeItem("user_id");
              router.push("/");
            }}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
       </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-md p-2 rounded ${
                message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {message.message}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}
