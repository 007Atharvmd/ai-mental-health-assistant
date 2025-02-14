"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Globe } from "lucide-react"; // Import Mic and Globe icons
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
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en"); // Language state
  const router = useRouter();

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

  // Fetch chat history
  const fetchChatHistory = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/chat-history/${userId}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const formattedMessages = [];
        data.forEach((chat) => {
          formattedMessages.push({ message: chat.message, role: "user" });
          if (chat.ai_response) {
            formattedMessages.push({ message: chat.ai_response, role: "ai" });
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
    setMessages((prev) => [...prev, { message: messageToSend, role: "user" }]);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: messageToSend, language }),
      });

      const data = await response.json();
      if (data.ai_response) {
        setMessages((prev) => [...prev, { message: data.ai_response, role: "ai" }]);
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  // Speech Recognition Functionality
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="relative flex justify-center items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-heading text-primary">Mental Health Assistant</h1>
        <div className="absolute right-4 flex items-center space-x-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setLanguage("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setLanguage("hi")}>हिन्दी</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* User Avatar */}
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
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-md p-2 rounded ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              {message.message}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input with Voice Button */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex space-x-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
        <Button type="button" onClick={startListening} className="p-2">
          {isListening ? <MicOff className="text-red-500" /> : <Mic />}
        </Button>
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
