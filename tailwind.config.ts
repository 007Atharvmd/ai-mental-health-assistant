import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#F7F9FC", // Soft grayish blue
                foreground: "#333333", // Dark gray text
                card: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#333333",
                },
                popover: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#333333",
                },
                primary: {
                    DEFAULT: "#4A90E2", // Calm Blue
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#F5A623", // Warm Orange
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "#E0E0E0", // Light Gray
                    foreground: "#333333",
                },
                accent: {
                    DEFAULT: "#D1E8FF", // Light Blue Tint
                    foreground: "#333333",
                },
                destructive: {
                    DEFAULT: "#D9534F", // Soft Red
                    foreground: "#FFFFFF",
                },
                border: "#D1D5DB", // Light gray border
                input: "#FFFFFF",
                ring: "#4A90E2",
                chart: {
                    "1": "#4A90E2",
                    "2": "#F5A623",
                    "3": "#50E3C2",
                    "4": "#9013FE",
                    "5": "#D0021B",
                },
            },
            fontFamily: {
                heading: ["Poppins", "sans-serif"], // Modern & Friendly
                body: ["Inter", "sans-serif"], // Clean & Readable
            },
            borderRadius: {
                lg: "12px",
                md: "8px",
                sm: "4px",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
