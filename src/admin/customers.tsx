import React, { useEffect, useState } from 'react';
import AdminLayout from './adminLayout';
import { BACKEND_URL } from '../config';

type User = {
    id: number;
    name: string;
};

type Message = {
    sender: string;
    content: string;
    timestamp: string;
};

const CustomerSupport: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [botEnabled, setBotEnabled] = useState<boolean | null>(null);

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/admin/users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error('Failed to fetch users:', err));
    }, []);

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        fetch(`${BACKEND_URL}/api/admin/chats/${user.id}`)
            .then(res => res.json())
            .then(data => {
                setMessages(data.messages || []);
                setBotEnabled(data.bot_enabled ?? false);
            })
            .catch(err => {
                console.error('Failed to fetch messages:', err);
                setMessages([]);
                setBotEnabled(null);
            });
    };

    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = () => {
            fetch(`${BACKEND_URL}/api/admin/chats/${selectedUser.id}`)
                .then(res => res.json())
                .then(data => {
                    setMessages(data.messages || []);
                    setBotEnabled(data.bot_enabled ?? false);
                })
                .catch(err => {
                    console.error('Failed to fetch messages:', err);
                    setMessages([]);
                    setBotEnabled(null);
                });
        };

        fetchMessages();

        const intervalId = setInterval(fetchMessages, 500);

        return () => clearInterval(intervalId);

    }, [selectedUser]);

    return (
        <AdminLayout pageName="Customer Support">
            <div
                className="bg-white bg-opacity-60 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-screen-2xl overflow-hidden p-4 flex gap-4"
                style={{ height: 'calc(100vh - 210px)' }}
            >
                <div className="w-1/3 border-r pr-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-2">Users</h2>
                    {users.map(user => (
                        <div
                            key={user.id}
                            onClick={() => handleUserClick(user)}
                            className={`cursor-pointer p-2 rounded-md hover:bg-gray-200 ${selectedUser?.id === user.id ? 'bg-gray-300 font-bold' : ''
                                }`}
                        >
                            {user.name}
                        </div>
                    ))}
                </div>

                <div
                    className="w-2/3 flex flex-col"
                    style={{ height: 'calc(100vh - 220px)', position: 'relative' }}
                >
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">
                            {selectedUser ? `Chat with ${selectedUser.name}` : 'Select a user'}
                        </h2>

                        {selectedUser && botEnabled !== null && (
                            <button
                                className={`px-4 py-1 rounded-full font-semibold border-2
          ${botEnabled ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}
        `}
                                type="button"
                                aria-label="Bot Enabled Status"
                                onClick={async () => {
                                    if (!selectedUser) return;

                                    const newBotStatus = !botEnabled;

                                    try {
                                        const res = await fetch(`${BACKEND_URL}/api/admin/bot_status/${selectedUser.id}`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ bot_enabled: newBotStatus }),
                                        });

                                        if (!res.ok) throw new Error('Failed to update bot status');

                                        setBotEnabled(newBotStatus);
                                    } catch (error) {
                                        console.error('Error updating bot status:', error);
                                        alert('Failed to update bot status');
                                    }
                                }}
                            >
                                BOT Enabled
                            </button>
                        )}
                    </div>

                    {selectedUser ? (
                        <>
                            <div className="flex flex-col space-y-2 flex-grow overflow-y-auto px-4 pt-4 pb-24">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-md border shadow max-w-[70%] break-words
                        ${msg.sender === 'user'
                                                ? 'bg-white text-left self-start'
                                                : 'bg-blue-100 text-right self-end'
                                            }
                    `}
                                    >
                                        <div className="text-xs text-gray-500">{msg.timestamp}</div>
                                        {msg.sender !== 'user' && (
                                            <div className="text-sm font-semibold">
                                                {msg.sender === 'admin' ? 'Admin' : 'Bot'}
                                            </div>
                                        )}
                                        <div>{msg.content}</div>
                                    </div>
                                ))}
                            </div>

                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const input = (e.currentTarget.elements.namedItem('message') as HTMLInputElement);
                                    const message = input.value.trim();
                                    if (!message || !selectedUser) return;

                                    try {
                                        const timestamp = new Date().toISOString();

                                        const res = await fetch(`${BACKEND_URL}/api/admin/send_message/${selectedUser.id}`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                user_id: selectedUser.id,
                                                content: message,
                                                sender: 'admin',
                                                receiver: 'user',
                                                timestamp,
                                            }),
                                        });

                                        if (!res.ok) throw new Error('Failed to send message');

                                        setMessages(prev => [...prev, {
                                            sender: 'admin',
                                            content: message,
                                            timestamp,
                                        }]);

                                        input.value = '';
                                    } catch (error) {
                                        console.error('Failed to send message:', error);
                                        alert('Failed to send message');
                                    }
                                }}
                                className="absolute bottom-0 w-full bg-white bg-opacity-90 backdrop-blur-md px-4 py-3 border-t flex gap-2"
                            >
                                <input
                                    name="message"
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-grow border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ring-blue-300"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold hover:bg-blue-700"
                                >
                                    Send
                                </button>
                            </form>

                        </>
                    ) : (
                        <div className="p-4 text-gray-500">Select a user to view messages.</div>
                    )}

                </div>
            </div>
        </AdminLayout>
    );
};

export default CustomerSupport;