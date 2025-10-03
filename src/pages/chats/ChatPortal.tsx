import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Shield, Users, Send, User, MessageSquareText, Search, Settings } from 'lucide-react';

// --- TYPE DEFINITIONS ---

interface User {
    id: string;
    name: string;
    role: 'Super Admin' | 'Instructor' | 'Student';
    avatar: string;
}

interface Message {
    senderId: string;
    text: string;
    time: string;
    adminIntervention?: boolean;
}

interface Conversation {
    id: string;
    type: 'Audit' | 'Direct';
    participants: string[]; // Array of User IDs
    title: string;
    lastMessage: string;
    lastTime: string;
    messages: Message[];
}

type ActiveTab = 'Audit' | 'Direct';
type ViewMode = 'list' | 'chat';

// Map of User IDs to User objects
interface MockUsersMap {
    [key: string]: User;
}

// --- MOCK DATA ---
const MOCK_USERS: MockUsersMap = {
    'admin-1': { id: 'admin-1', name: 'Super Admin Ava', role: 'Super Admin', avatar: 'https://placehold.co/40x40/5b21b6/ffffff?text=SA' },
    'instr-1': { id: 'instr-1', name: 'Instructor Jane Doe', role: 'Instructor', avatar: 'https://placehold.co/40x40/059669/ffffff?text=JD' },
    'instr-2': { id: 'instr-2', name: 'Instructor Alex Ray', role: 'Instructor', avatar: 'https://placehold.co/40x40/c2410c/ffffff?text=AR' },
    'stud-1': { id: 'stud-1', name: 'Student Ben Smith', role: 'Student', avatar: 'https://placehold.co/40x40/6366f1/ffffff?text=BS' },
    'stud-2': { id: 'stud-2', name: 'Student Chris Lee', role: 'Student', avatar: 'https://placehold.co/40x40/e11d48/ffffff?text=CL' },
};

const INITIAL_CONVERSATIONS: Conversation[] = [
    {
        id: 'audit-1',
        type: 'Audit',
        participants: ['instr-1', 'stud-1', 'admin-1'],
        title: 'Jane Doe & Ben Smith (Course Qs)',
        lastMessage: 'Admin Intervention: Please review the documentation.',
        lastTime: '10:05 AM',
        messages: [
            { senderId: 'stud-1', text: 'I am stuck on module 3. The code won\'t compile.', time: '9:50 AM' },
            { senderId: 'instr-1', text: 'I see. Can you send me the screenshot of your error message?', time: '9:52 AM' },
            { senderId: 'stud-1', text: 'Yes, here it is (image attached).', time: '9:55 AM' },
            { senderId: 'instr-1', text: 'Ah, you have a missing semicolon. It\'s a common mistake!', time: '10:00 AM' },
            { senderId: 'admin-1', text: 'Please review the documentation on basic syntax errors. It is linked in the course resources.', time: '10:05 AM', adminIntervention: true },
        ]
    },
    {
        id: 'audit-2',
        type: 'Audit',
        participants: ['instr-2', 'stud-2'],
        title: 'Alex Ray & Chris Lee (Grading Issue)',
        lastMessage: 'I will submit the request to the admin panel.',
        lastTime: 'Yesterday',
        messages: [
            { senderId: 'stud-2', text: 'I think my grade for the final project is incorrect.', time: '4:00 PM' },
            { senderId: 'instr-2', text: 'Let me double-check the rubric against your submission. Can you specify which part is the concern?', time: '4:15 PM' },
            { senderId: 'instr-2', text: 'I will submit the request to the admin panel.', time: '4:16 PM' },
        ]
    },
    {
        id: 'direct-1',
        type: 'Direct',
        participants: ['admin-1', 'instr-1'],
        title: 'Instructor Jane Doe (Direct)',
        lastMessage: 'I have approved your new course proposal.',
        lastTime: '1 day ago',
        messages: [
            { senderId: 'instr-1', text: 'Hi Ava, I submitted the Advanced React course proposal yesterday. Could you take a look?', time: '9:30 AM' },
            { senderId: 'admin-1', text: 'Just reviewed it. Looks excellent. I have approved your new course proposal.', time: '10:00 AM' },
        ]
    },
    {
        id: 'direct-2',
        type: 'Direct',
        participants: ['admin-1', 'instr-2'],
        title: 'Instructor Alex Ray (Direct)',
        lastMessage: 'Please update your payment info by Friday.',
        lastTime: '3 days ago',
        messages: [
            { senderId: 'admin-1', text: 'Hi Alex, we noticed your payment information is outdated. Please update it by Friday to ensure timely payouts.', time: '1:00 PM' },
        ]
    },
];

// --- COMPONENTS ---

interface UserAvatarProps {
    userId: string;
    size?: string;
}

/**
 * Avatar Helper
 */
const UserAvatar: React.FC<UserAvatarProps> = ({ userId, size = 'h-8 w-8' }) => {
    const user: User = MOCK_USERS[userId] || {} as User;
    const initials = user.name?.split(' ').map(n => n[0]).join('') || '??';

    return (
        <div className={`relative flex items-center justify-center rounded-full bg-purple-100 font-semibold text-xs text-purple-600 ${size} flex-shrink-0`}>
            <span className="p-1">{initials}</span>
            {user.role === 'Super Admin' && (
                <Settings size={12} className="absolute -bottom-0.5 -right-0.5 text-yellow-500 bg-white rounded-full p-0.5 border border-white" />
            )}
        </div>
    );
};

interface ConversationItemProps {
    convo: Conversation;
    selected: boolean;
    onClick: (convo: Conversation) => void;
}

/**
 * Conversation Item in the List
 */
const ConversationItem: React.FC<ConversationItemProps> = ({ convo, selected, onClick }) => {
    const adminId = MOCK_USERS['admin-1'].id;
    // Find the primary non-admin user for the avatar
    const primaryUserId = convo.participants.find(id => id !== adminId) || convo.participants[0];
    const unread = convo.type === 'Audit' && convo.messages.slice(-1)[0].senderId !== adminId;

    return (
        <div
            onClick={() => onClick(convo)}
            className={`flex items-center p-3 border-b cursor-pointer transition-colors ${selected ? 'bg-purple-100 border-purple-300' : 'hover:bg-gray-50'}`}
        >
            <UserAvatar userId={primaryUserId} />
            <div className="ml-3 flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${selected ? 'text-purple-900' : 'text-gray-800'}`}>
                    {convo.title}
                </p>
                <p className={`text-xs truncate mt-0.5 ${unread ? 'font-bold text-gray-700' : 'text-gray-500'}`}>
                    {convo.lastMessage}
                </p>
            </div>
            <div className="text-xs text-gray-400 ml-2 flex-shrink-0 text-right">
                {convo.lastTime}
                {unread && (
                    <div className="h-2 w-2 bg-red-500 rounded-full ml-auto mt-1"></div>
                )}
            </div>
        </div>
    );
};

interface ChatMessageProps {
    message: Message;
    isSender: boolean;
    isIntervention: boolean | undefined;
}

/**
 * Chat Message Bubble
 */
const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSender, isIntervention }) => {
    const sender: User = MOCK_USERS[message.senderId] || {} as User;
    const isStudent = sender.role === 'Student';
    const isInstructor = sender.role === 'Instructor';

    let bubbleClass = 'p-3 rounded-xl max-w-xs sm:max-w-md';
    const textClass = 'text-sm';
    let containerClass = 'flex my-3';

    if (isIntervention) {
        // Admin Intervention (in Audit chats)
        bubbleClass += ' bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 shadow-lg';
        containerClass += ' justify-center';
    } else if (isSender) {
        // Super Admin Direct Chat
        bubbleClass += ' bg-purple-600 text-white rounded-br-none shadow-md';
        containerClass += ' justify-end';
    } else if (isStudent) {
        // Student Message
        bubbleClass += ' bg-gray-200 text-gray-800 rounded-tl-none shadow-sm';
        containerClass += ' justify-start';
    } else if (isInstructor) {
        // Instructor Message
        bubbleClass += ' bg-blue-100 text-blue-800 rounded-tl-none shadow-sm';
        containerClass += ' justify-start';
    }

    return (
        <div className={containerClass}>
            {!isIntervention && !isSender && <UserAvatar userId={message.senderId} size="h-8 w-8" />}
            <div className={`flex flex-col ${isIntervention ? 'items-center' : isSender ? 'items-end' : 'items-start'} ${isIntervention ? 'w-full' : 'mx-2'}`}>
                {/* Sender Name for non-Admin messages */}
                {!isSender && !isIntervention && (
                    <span className={`text-xs font-medium mb-1 ${isInstructor ? 'text-blue-700' : 'text-gray-600'}`}>
                        {sender.name} ({sender.role})
                    </span>
                )}

                {/* The Bubble */}
                <div className={bubbleClass}>
                    {isIntervention && <div className="font-bold mb-1 text-center">🛡️ ADMIN INTERVENTION</div>}
                    <p className={textClass}>
                        {message.text}
                    </p>
                    <span className={`block text-right mt-1 ${isSender ? 'text-purple-200' : isIntervention ? 'text-yellow-600' : 'text-gray-500'} text-[10px]`}>
                        {message.time}
                    </span>
                </div>
            </div>
            {isSender && <UserAvatar userId={message.senderId} size="h-8 w-8" />}
        </div>
    );
};

interface ChatWindowProps {
    conversation: Conversation | undefined;
    onSend: (convoId: string | null, text?: string) => void;
}

// Icon added for the mobile back button
const ArrowLeft: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m15 18-6-6 6-6" />
    </svg>
);

/**
 * Chat Window / Message Display
 */
const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onSend }) => {
    const [newMessage, setNewMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (conversation) {
            scrollToBottom();
        }
    }, [conversation]);

    if (!conversation) {
        return (
            <div className="flex-1 hidden md:flex items-center justify-center p-8 bg-gray-50">
                <div className="text-center text-gray-500">
                    <MessageSquare size={48} className="mx-auto text-purple-400" />
                    <p className="mt-4 text-lg font-semibold">Select a Conversation</p>
                    <p className="text-sm">
                        Use the tabs on the left to monitor **Audit Chats** or start a **Direct Chat**.
                    </p>
                </div>
            </div>
        );
    }

    const isAuditChat: boolean = conversation.type === 'Audit';
    const otherParticipants: string = conversation.participants
        .filter(id => id !== MOCK_USERS['admin-1'].id)
        .map(id => MOCK_USERS[id]?.name)
        .join(' & ');

    const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newMessage.trim()) {
            // We know conversation is defined here
            onSend(conversation.id, newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 shadow-sm flex items-center justify-between bg-purple-50">
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        {isAuditChat ? <Shield size={18} className="text-yellow-600 mr-2" /> : <MessageSquareText size={18} className="text-purple-700 mr-2" />}
                        {conversation.title}
                    </h3>
                    <p className={`text-xs font-medium mt-1 ${isAuditChat ? 'text-yellow-700' : 'text-purple-600'}`}>
                        {isAuditChat ? 'Auditing Participants: ' : 'Direct Chat with: '} {otherParticipants}
                    </p>
                </div>
                {/* Mock Back Button for Mobile */}
                <button
                    onClick={() => onSend(null)} // Signals mobile back navigation
                    className="md:hidden p-2 rounded-full hover:bg-purple-100 text-purple-600"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {conversation.messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        message={msg}
                        isSender={msg.senderId === MOCK_USERS['admin-1'].id}
                        isIntervention={msg.adminIntervention}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSend} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isAuditChat ? "Enter message to intervene (visible to all)..." : "Type a direct message..."}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-purple-500 focus:border-purple-500 text-sm placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </form>
                {isAuditChat && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Your messages in this thread are visible to **Instructor** and **Student**.
                    </p>
                )}
            </div>
        </div>
    );
};


/**
 * Main Application Component
 */
export default function SuperAdminChatPortal() {
    const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
    const [selectedConvoId, setSelectedConvoId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
    const [currentView, setCurrentView] = useState<ViewMode>('list');
    const [activeTab, setActiveTab] = useState<ActiveTab>('Audit');

    const selectedConversation = conversations.find(c => c.id === selectedConvoId);

    const filteredConversations = conversations.filter(c => c.type === activeTab);

    const handleSelectConvo = (convo: Conversation) => {
        setSelectedConvoId(convo.id);
        setCurrentView('chat'); // Switch view on mobile
    };

    const handleSendMessage = (convoId: string | null, text?: string) => {
        if (convoId === null) {
            // Used for mobile back navigation
            setCurrentView('list');
            return;
        }

        // This check shouldn't fail if text is provided, but TypeScript requires the check
        if (!text) return;

        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

        const isAudit = activeTab === 'Audit';

        const newMessage: Message = {
            senderId: MOCK_USERS['admin-1'].id,
            text: text,
            time: timeString,
            // Only set adminIntervention flag for audit chats
            adminIntervention: isAudit ? true : undefined,
        };

        setConversations(prevConvos =>
            prevConvos.map(c => {
                if (c.id === convoId) {
                    return {
                        ...c,
                        messages: [...c.messages, newMessage],
                        lastMessage: `${isAudit ? 'Admin Intervention: ' : 'Admin: '} ${text}`,
                        lastTime: timeString,
                    };
                }
                return c;
            })
        );
    };

    return (
        <div className="flex h-190 w-full bg-gray-100 font-sans">
            <div className="flex w-full max-w-full h-full bg-whiteoverflow-hidden">

                {/* Left Panel: Conversation List - Now includes flex-shrink-0 for guaranteed sticky width */}
                <div
                    className={`h-full border-r border-gray-200 transition-all duration-300 ease-in-out 
                        flex flex-col w-full md:w-80 lg:w-96 flex-shrink-0
                        ${currentView === 'chat' ? 'hidden md:flex' : ''}`
                    }
                >
                    <div className="p-4 border-b bg-purple-700 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Shield size={24} /> Super Admin Portal
                        </h2>
                        <p className="text-sm opacity-80 mt-1">{MOCK_USERS['admin-1'].name}</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('Audit')}
                            className={`flex-1 p-3 text-sm font-semibold flex items-center justify-center transition-colors ${activeTab === 'Audit' ? 'text-purple-700 border-b-2 border-purple-700 bg-purple-50' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Users size={18} className="mr-2" /> Audit Chats
                        </button>
                        <button
                            onClick={() => setActiveTab('Direct')}
                            className={`flex-1 p-3 text-sm font-semibold flex items-center justify-center transition-colors ${activeTab === 'Direct' ? 'text-purple-700 border-b-2 border-purple-700 bg-purple-50' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <MessageSquareText size={18} className="mr-2" /> Direct Chats
                        </button>
                    </div>

                    {/* Search Mock */}
                    <div className="p-3 border-b">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    {/* Conversation List - This area scrolls */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map(convo => (
                                <ConversationItem
                                    key={convo.id}
                                    convo={convo}
                                    selected={convo.id === selectedConvoId}
                                    onClick={handleSelectConvo}
                                />
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">No active chats in this category.</div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Chat Window */}
                <div
                    className={`h-full flex-1 transition-all duration-300 ease-in-out 
                        ${currentView === 'list' ? 'hidden md:flex' : 'flex'}`
                    }
                >
                    <ChatWindow
                        conversation={selectedConversation}
                        onSend={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
}
