import { useState } from "react";
import {
    Avatar,
    Chip,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";
import {
    User,
    Users,
    Pin,
    AlertTriangle,
    ThumbsUp,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

// Dummy forum messages with replies
const forumMessages = [
    {
        id: "msg_101",
        course: "React Basics",
        forum: "React Basics Forum",
        userType: "Student",
        userName: "John Doe",
        userAvatar: "/images/user/user-01.jpg",
        message: "I didn't understand the useEffect hook 😕",
        timestamp: "14:32, 10 Mar 2025",
        likes: 5,
        flagged: true,
        severity: "High",
        pinned: false,
        officialAnswer: false,
        replies: [
            {
                id: "reply_1011",
                userType: "Instructor",
                userName: "Jane Smith",
                userAvatar: "/images/user/user-02.jpg",
                message: "Check out the official React docs for examples.",
                timestamp: "15:00, 10 Mar 2025",
                likes: 2,
                flagged: false,
            },
        ],
    },
    {
        id: "msg_102",
        course: "Advanced JS",
        forum: "Advanced JS Forum",
        userType: "Instructor",
        userName: "Jane Smith",
        userAvatar: "/images/user/user-02.jpg",
        message: "Remember to always check variable scoping in JS!",
        timestamp: "09:15, 11 Mar 2025",
        likes: 12,
        flagged: false,
        severity: "Low",
        pinned: true,
        officialAnswer: true,
        replies: [],
    },
    {
        id: "msg_103",
        course: "React Basics",
        forum: "React Basics Forum",
        userType: "Student",
        userName: "Alex Johnson",
        userAvatar: "/images/user/user-03.jpg",
        message: "Can someone explain props drilling?",
        timestamp: "11:22, 12 Mar 2025",
        likes: 3,
        flagged: false,
        severity: "Medium",
        pinned: false,
        officialAnswer: false,
        replies: [
            {
                id: "reply_1031",
                userType: "Instructor",
                userName: "Mike Brown",
                userAvatar: "/images/user/user-04.jpg",
                message: "Props drilling is passing props down multiple components.",
                timestamp: "12:05, 12 Mar 2025",
                likes: 4,
                flagged: false,
            },
        ],
    },
    {
        id: "msg_104",
        course: "Advanced JS",
        forum: "Advanced JS Forum",
        userType: "Student",
        userName: "Sarah Lee",
        userAvatar: "/images/user/user-05.jpg",
        message: "What is closure in JavaScript?",
        timestamp: "13:30, 13 Mar 2025",
        likes: 7,
        flagged: true,
        severity: "Medium",
        pinned: false,
        officialAnswer: false,
        replies: [],
    },
    {
        id: "msg_105",
        course: "React Basics",
        forum: "React Basics Forum",
        userType: "Student",
        userName: "Tom Hardy",
        userAvatar: "/images/user/user-06.jpg",
        message: "How do I optimize performance in React?",
        timestamp: "16:45, 13 Mar 2025",
        likes: 2,
        flagged: false,
        severity: "Low",
        pinned: false,
        officialAnswer: false,
        replies: [],
    },
    {
        id: "msg_106",
        course: "Advanced JS",
        forum: "Advanced JS Forum",
        userType: "Instructor",
        userName: "Emily Clark",
        userAvatar: "/images/user/user-07.jpg",
        message: "Always use let/const instead of var to avoid scope issues.",
        timestamp: "10:15, 14 Mar 2025",
        likes: 9,
        flagged: false,
        severity: "Low",
        pinned: false,
        officialAnswer: true,
        replies: [],
    },
    {
        id: "msg_107",
        course: "React Basics",
        forum: "React Basics Forum",
        userType: "Student",
        userName: "David Kim",
        userAvatar: "/images/user/user-08.jpg",
        message: "Is useMemo really necessary here?",
        timestamp: "12:40, 14 Mar 2025",
        likes: 1,
        flagged: false,
        severity: "Low",
        pinned: false,
        officialAnswer: false,
        replies: [],
    },
    {
        id: "msg_108",
        course: "Advanced JS",
        forum: "Advanced JS Forum",
        userType: "Student",
        userName: "Lisa Wong",
        userAvatar: "/images/user/user-09.jpg",
        message: "How do promises work with async/await?",
        timestamp: "15:20, 15 Mar 2025",
        likes: 5,
        flagged: false,
        severity: "Medium",
        pinned: false,
        officialAnswer: false,
        replies: [
            {
                id: "reply_1081",
                userType: "Instructor",
                userName: "Jane Smith",
                userAvatar: "/images/user/user-02.jpg",
                message: "Promises wrap async operations, await pauses execution until resolved.",
                timestamp: "16:00, 15 Mar 2025",
                likes: 3,
                flagged: false,
            },
        ],
    },
    {
        id: "msg_109",
        course: "React Basics",
        forum: "React Basics Forum",
        userType: "Student",
        userName: "Chris Evans",
        userAvatar: "/images/user/user-10.jpg",
        message: "How to lift state up correctly?",
        timestamp: "17:10, 15 Mar 2025",
        likes: 6,
        flagged: false,
        severity: "Low",
        pinned: false,
        officialAnswer: false,
        replies: [],
    },
    {
        id: "msg_110",
        course: "Advanced JS",
        forum: "Advanced JS Forum",
        userType: "Instructor",
        userName: "Mike Brown",
        userAvatar: "/images/user/user-04.jpg",
        message: "Always handle errors in async calls with try/catch.",
        timestamp: "09:50, 16 Mar 2025",
        likes: 8,
        flagged: false,
        severity: "Low",
        pinned: true,
        officialAnswer: true,
        replies: [],
    },
];


// Courses & forums filters
const courses = ["All Courses", "React Basics", "Advanced JS"];
const forums = ["All Forums", "React Basics Forum", "Advanced JS Forum"];

// Sample chart data (computed from forumMessages)
const chartData = [
    { course: "React Basics", Flagged: 1, Pinned: 0, Official: 0 },
    { course: "Advanced JS", Flagged: 0, Pinned: 1, Official: 1 },
];

export default function ForumModerationDashboard() {
    const [selectedCourse, setSelectedCourse] = useState("All Courses");
    const [selectedForum, setSelectedForum] = useState("All Forums");
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [rulesForm, setRulesForm] = useState({
        keywordFlags: "",
        severityLevel: "Medium",
        autoPinOfficial: false,
    });

    const filteredMessages = forumMessages.filter(
        (msg) =>
            (selectedCourse === "All Courses" ? true : msg.course === selectedCourse) &&
            (selectedForum === "All Forums" ? true : msg.forum === selectedForum)
    );

    // Dashboard summary
    const totalMessages = filteredMessages.length;
    const totalFlagged = filteredMessages.filter((m) => m.flagged).length;
    const totalPinned = filteredMessages.filter((m) => m.pinned).length;
    const totalOfficial = filteredMessages.filter((m) => m.officialAnswer).length;

    const renderMessage = (msg: any, isReply = false) => (
        <div
            key={msg.id}
            className={`flex gap-3 p-3 rounded hover:bg-gray-50 items-start border-b ${isReply ? "ml-12" : ""
                }`}
        >
            <Avatar src={msg.userAvatar} className="!w-10 !h-10" />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{msg.userName}</span>
                        {msg.userType && (
                            <Chip
                                icon={msg.userType === "Student" ? <User size={14} /> : <Users size={14} />}
                                label={msg.userType}
                                size="small"
                                color={msg.userType === "Student" ? "info" : "secondary"}
                            />
                        )}
                        {msg.pinned && <Pin size={16} color="#1976d2" />}
                        {msg.officialAnswer && <Chip label="Official" color="success" size="small" />}
                        {msg.flagged && (
                            <Chip
                                label={`Flagged (${msg.severity})`}
                                size="small"
                                color={
                                    msg.severity === "High"
                                        ? "error"
                                        : msg.severity === "Medium"
                                            ? "warning"
                                            : "default"
                                }
                            />
                        )}
                    </div>
                    <span className="text-sm text-gray-500">{msg.timestamp}</span>
                </div>
                <p className="mt-1 text-gray-800">{msg.message}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 flex-wrap">
                    {msg.likes && (
                        <div className="flex items-center gap-1">
                            <ThumbsUp size={14} /> {msg.likes}
                        </div>
                    )}
                    {!isReply && (
                        <div className="flex gap-1 flex-wrap">
                            <Button size="small" variant={msg.pinned ? "contained" : "outlined"} color="primary">
                                {msg.pinned ? "Unpin" : "Pin"}
                            </Button>
                            <Button size="small" variant={msg.officialAnswer ? "contained" : "outlined"} color="success">
                                {msg.officialAnswer ? "Unmark" : "Mark Official"}
                            </Button>
                            <Button size="small" variant="outlined" color="error">
                                Ban
                            </Button>
                        </div>
                    )}
                </div>
                {/* Replies */}
                {msg.replies && msg.replies.length > 0 && msg.replies.map((r: any) => renderMessage(r, true))}
            </div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
                    <AlertTriangle size={24} /> Forum Moderation
                </h2>
                <Button variant="outlined" size="small">Back</Button>
            </div>

            {/* Top Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Messages", value: totalMessages },
                    { label: "Flagged Messages", value: totalFlagged, color: "text-red-500" },
                    { label: "Pinned Messages", value: totalPinned, color: "text-blue-500" },
                    { label: "Official Answers", value: totalOfficial, color: "text-green-500" },
                ].map((item) => (
                    <div key={item.label} className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
                        <span className="text-gray-500 text-sm">{item.label}</span>
                        <span className={`text-xl font-bold ${item.color ?? "text-gray-800"}`}>{item.value}</span>
                    </div>
                ))}
            </div>

            {/* Graph */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Course-wise Trends</h3>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="course" tick={{ fill: '#6b7280' }} />
                        <YAxis tick={{ fill: '#6b7280' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Flagged" fill="#ef4444" />
                        <Bar dataKey="Pinned" fill="#3b82f6" />
                        <Bar dataKey="Official" fill="#10b981" />
                    </BarChart>
                </ResponsiveContainer>



            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <TextField select label="Course" size="small" sx={{ minWidth: 180 }}
                    value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                    {courses.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
                <TextField select label="Forum" size="small" sx={{ minWidth: 200 }}
                    value={selectedForum} onChange={(e) => setSelectedForum(e.target.value)}>
                    {forums.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </TextField>
                <Button variant="contained" size="small" onClick={() => setShowRulesModal(true)}>Manage Rules</Button>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-2">
                {filteredMessages.map((msg, idx) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 p-3 rounded-md items-start border-l-4 border-transparent
                    ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition`}
                    >
                        <Avatar src={msg.userAvatar} className="!w-10 !h-10" />
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-gray-800">{msg.userName}</span>
                                    <Chip
                                        icon={msg.userType === "Student" ? <User size={14} /> : <Users size={14} />}
                                        label={msg.userType} size="small"
                                        color={msg.userType === "Student" ? "info" : "secondary"}
                                    />
                                    {msg.pinned && <Pin size={16} color="#3b82f6" />}
                                    {msg.officialAnswer && <Chip label="Official" color="success" size="small" />}
                                    {msg.flagged && <Chip label={`Flagged (${msg.severity})`} size="small"
                                        color={msg.severity === "High" ? "error" : msg.severity === "Medium" ? "warning" : "default"}
                                    />}
                                </div>
                                <span className="text-xs text-gray-500">{msg.timestamp}</span>
                            </div>
                            <p className="text-gray-700">{msg.message}</p>
                            <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                                {msg.likes > 0 && <div className="flex items-center gap-1"><ThumbsUp size={14} />{msg.likes}</div>}
                                <div className="flex gap-1 flex-wrap">
                                    <Button size="small" variant={msg.pinned ? "contained" : "outlined"} color="primary">{msg.pinned ? "Unpin" : "Pin"}</Button>
                                    <Button size="small" variant={msg.officialAnswer ? "contained" : "outlined"} color="success">{msg.officialAnswer ? "Unmark" : "Mark Official"}</Button>
                                    <Button size="small" variant="outlined" color="error">Ban</Button>
                                </div>
                            </div>

                            {/* Replies */}
                            {msg.replies?.map((r, ridx) => (
                                <div key={r.id} className={`flex gap-3 p-2 mt-2 rounded-md border-l-4 border-gray-300
                                         ${ridx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ml-8 hover:bg-gray-100 transition`}>
                                    <Avatar src={r.userAvatar} className="!w-8 !h-8" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-800">{r.userName}</span>
                                            <span className="text-xs text-gray-500">{r.timestamp}</span>
                                        </div>
                                        <p className="text-gray-700">{r.message}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            {r.likes > 0 && <div className="flex items-center gap-1"><ThumbsUp size={12} />{r.likes}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>


    );
}
