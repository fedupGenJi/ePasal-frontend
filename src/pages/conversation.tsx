import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from '../config';
import { Link } from "react-router-dom";
import dayjs from "dayjs";

interface Message {
    userId: string;
    content: string;
    timestamp: string;
    sender: "user" | "admin";
}

const Conversation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId || sessionStorage.getItem("userId");

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (userId) {
            fetch(`${BACKEND_URL}/messages?userId=${userId}`)
                .then((res) => res.json())
                .then((data) => setMessages(data))
                .catch((err) => console.error("Fetch error:", err));
        }
    }, [userId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMsg: Message = {
            userId: userId as string,
            content: input,
            timestamp: new Date().toISOString(),
            sender: "user",
        };

        try {
            const res = await fetch(`${BACKEND_URL}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMsg),
            });

            if (res.ok) {
                const saved = await res.json();
                setMessages((prev) => [...prev, saved]);
                setInput("");
                scrollToBottom();
            } else {
                alert("Message failed to send.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!userId) {
        return (
            <div className="flex flex-col h-screen bg-white text-black font-inter">
                <header className="bg-black text-white p-4 flex items-center justify-between shadow-md">
                    <Link to="/" className="text-xl md:text-2xl font-semibold">
                        EPasal
                    </Link>
                    <div className="text-sm md:text-base text-gray-300">
                        Chat with <span className="text-white font-bold">Shop Support</span>
                    </div>
                </header>

                <div className="min-h-screen bg-white flex items-center justify-center flex-col p-6 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        You need to login first to access this page.
                    </h2>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        🔐 Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white text-black font-inter">
            <header className="bg-black text-white p-4 flex items-center justify-between shadow-md">
                <Link to="/" className="text-xl md:text-2xl font-semibold">
                    EPasal
                </Link>
                <div className="text-sm md:text-base text-gray-300">
                    Chat with <span className="text-white font-bold">Shop Support</span>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto flex justify-center">
                <main className="w-full max-w-2xl px-4 py-2 sm:p-4">
                    <div className="flex flex-col space-y-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    title={dayjs(msg.timestamp).format("MMMM D, YYYY h:mm A")}
                                    className={`max-w-xs sm:max-w-md md:max-w-lg px-4 py-2 rounded-lg shadow
            ${msg.sender === "user"
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-gray-200 text-black rounded-bl-none"}`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>
                </main>
            </div>

            <footer className="p-2 sm:p-4 bg-white border-t flex justify-center">
                <div className="w-full max-w-2xl flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        Send
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Conversation;