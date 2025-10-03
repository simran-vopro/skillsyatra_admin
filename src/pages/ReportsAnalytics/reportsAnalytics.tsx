import { Download, Expand, ChevronRight, Users, DollarSign, BookOpen, Activity, Eye } from "lucide-react";
import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts";


export default function ReportsAnalytics() {
    const [modalData, setModalData] = useState<{ title: string; chart: React.ReactElement } | null>(null);

    // KEEPING YOUR ORIGINAL DATA STRUCTURE
    const data = {
        userGrowth: [
            { month: "Jan", users: 120 },
            { month: "Feb", users: 200 },
            { month: "Mar", users: 150 },
            { month: "Apr", users: 250 },
            { month: "May", users: 300 },
        ],
        coursePopularity: [
            { course: "React Basics", enrollments: 120 },
            { course: "Advanced JS", enrollments: 90 },
            { course: "Python 101", enrollments: 150 },
            { course: "Node.js", enrollments: 80 },
        ],
        completionStats: [
            { course: "React Basics", completionRate: 80 },
            { course: "Advanced JS", completionRate: 65 },
            { course: "Python 101", completionRate: 90 },
        ],
        revenue: [
            { month: "Jan", revenue: 5000, payouts: 3000 },
            { month: "Feb", revenue: 7000, payouts: 4000 },
            { month: "Mar", revenue: 6500, payouts: 3500 },
            { month: "Apr", revenue: 8000, payouts: 4500 },
        ],
        instructorPerformance: [
            { instructor: "Alice Johnson", rating: 4.5, coursesCompleted: 5 },
            { instructor: "Bob Smith", rating: 4.2, coursesCompleted: 3 },
            { instructor: "Charlie Brown", rating: 4.8, coursesCompleted: 6 },
        ],
        engagement: [
            { activity: "Forum Posts", count: 120 },
            { activity: "Practical Submissions", count: 90 },
            { activity: "Quiz Attempts", count: 150 },
        ],
    };

    const totals = {
        totalUsers: data.userGrowth.reduce((sum, d) => sum + d.users, 0),
        totalRevenue: data.revenue.reduce((sum, d) => sum + d.revenue, 0),
        totalCourses: data.coursePopularity.length,
        totalEngagements: data.engagement.reduce((sum, d) => sum + d.count, 0),
    };

    // NEW DUMMY DATA for Donut Chart (e.g., Free vs Paid Users)
    const userTypeData = [
        { name: 'Free Users', value: Math.round(totals.totalUsers * 0.7) }, // 70% Free
        { name: 'Paid Subscribers', value: Math.round(totals.totalUsers * 0.3) }, // 30% Paid
    ];
    const PIE_COLORS = ['#38bdf8', '#0ea5e9']; // sky-400 and sky-500

    // Custom Tooltip for Pie Chart
    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 text-sm shadow-md rounded-lg">
                    <p className="font-semibold text-gray-800">{`${payload[0].name}:`}</p>
                    <p className="text-gray-600">{`${payload[0].value} users (${(payload[0].percent * 100).toFixed(1)}%)`}</p>
                </div>
            );
        }
        return null;
    };

    // Dummy export and view more functions
    const handleExport = (format: "pdf" | "excel" | "csv") => {
        // NOTE: The alert function is replaced by console.log for compliance.
        console.log(`Exporting report as ${format.toUpperCase()}`);
    };
    const handleViewMore = (title: string) => {
        // NOTE: The alert function is replaced by console.log for compliance.
        console.log(`Navigating to detailed report for: ${title}`);
    };

    // Refined ChartCard component
    const ChartCard = ({
        title,
        chart,
        className = "",
    }: {
        title: string;
        chart: React.ReactElement;
        className?: string;
    }) => (
        <div className={`flex-1 bg-white rounded-lg border border-gray-100 shadow-sm p-4 relative flex flex-col ${className}`}>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-semibold text-gray-700">{title}</h2>
                <button
                    onClick={() => setModalData({ title, chart })}
                    className="text-gray-400 hover:text-sky-600 transition-colors"
                    title="View Full Chart"
                >
                    <Expand size={16} />
                </button>
            </div>
            {/* Chart container with min-h to ensure it renders correctly */}
            <div className="flex-1 min-h-[16rem]">{chart}</div>

            <div className="flex justify-end pt-3 border-t border-gray-100 mt-4">
                <button
                    onClick={() => handleViewMore(title)}
                    className="text-sky-600 hover:text-sky-800 text-sm font-medium flex items-center transition-colors"
                >
                    View more
                    <ChevronRight size={16} className="ml-1" />
                </button>
            </div>

        </div>
    );

    // --- MAIN RENDER FUNCTION ---
    return (
        <div className="bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex justify-between items-center mx-auto">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Reports & Analytics
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 font-medium">
                            Last 28 days
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleExport("pdf")}
                                className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 text-sm rounded-md flex items-center gap-1 transition-colors shadow-md"
                            >
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Grid Container */}
            <div className="pt-6 space-y-6">

                {/* KPI Summary Row - UPDATED WITH ICONS AND VIEW BUTTONS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Total Users */}
                    <div className="bg-white rounded-lg border border-sky-200 shadow-md p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                            {/* Icon */}
                            <div className="p-2 rounded-lg bg-sky-100 text-sky-600">
                                <Users size={20} />
                            </div>
                            {/* Outline View Button */}
                            <button
                                onClick={() => handleViewMore("Total Users Summary")}
                                className="text-xs text-sky-600 hover:text-sky-800 flex items-center transition-colors px-2 py-1 border border-gray-200 rounded-full font-medium"
                            >
                                <Eye size={12} className="mr-1" />
                                View
                            </button>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{totals.totalUsers}</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white rounded-lg border border-red-200 shadow-md p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                            {/* Icon */}
                            <div className="p-2 rounded-lg bg-red-100 text-red-600">
                                <DollarSign size={20} />
                            </div>
                            {/* Outline View Button */}
                            <button
                                onClick={() => handleViewMore("Total Revenue Summary")}
                                className="text-xs text-red-600 hover:text-red-800 flex items-center transition-colors px-2 py-1 border border-gray-200 rounded-full font-medium"
                            >
                                <Eye size={12} className="mr-1" />
                                View
                            </button>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">${totals.totalRevenue}</p>
                    </div>

                    {/* Total Courses */}
                    <div className="bg-white rounded-lg border border-green-200 shadow-md p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                            {/* Icon */}
                            <div className="p-2 rounded-lg bg-green-100 text-green-600">
                                <BookOpen size={20} />
                            </div>
                            {/* Outline View Button */}
                            <button
                                onClick={() => handleViewMore("Total Courses Summary")}
                                className="text-xs text-green-600 hover:text-green-800 flex items-center transition-colors px-2 py-1 border border-gray-200 rounded-full font-medium"
                            >
                                <Eye size={12} className="mr-1" />
                                View
                            </button>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Total Courses</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{totals.totalCourses}</p>
                    </div>

                    {/* Total Engagements */}
                    <div className="bg-white rounded-lg border border-indigo-200 shadow-md p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                            {/* Icon */}
                            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                                <Activity size={20} />
                            </div>
                            {/* Outline View Button */}
                            <button
                                onClick={() => handleViewMore("Total Engagements Summary")}
                                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center transition-colors px-2 py-1 border border-gray-200 rounded-full font-medium"
                            >
                                <Eye size={12} className="mr-1" />
                                View
                            </button>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Total Engagements</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{totals.totalEngagements}</p>
                    </div>
                </div>

                {/* Charts Row 1: Line Chart and Donut Chart (New) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Monthly User Growth (Line Chart) */}
                    <ChartCard
                        title="Monthly User Growth"
                        className="col-span-1 md:col-span-2"
                        chart={
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.userGrowth}>
                                    {/* Professional Style: Thin, horizontal grid lines, no axis lines */}
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis dataKey="month" stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={2} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        }
                    />

                    {/* NEW: User Type Distribution (Donut Chart) */}
                    <ChartCard
                        title="User Type Distribution"
                        className="col-span-1"
                        chart={
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip content={<CustomPieTooltip />} />
                                    <Pie
                                        data={userTypeData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60} // Donut shape
                                        outerRadius={80}
                                        paddingAngle={5}
                                        labelLine={false}
                                    // Removed label to prevent overlap, relying on Tooltip and Legend
                                    >
                                        {userTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                </PieChart>
                            </ResponsiveContainer>
                        }
                    />
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartCard
                        title="Course Popularity (Enrollments)"
                        chart={
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.coursePopularity}>
                                    {/* Professional Style: Thin, horizontal grid lines, no axis lines */}
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis dataKey="course" stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="enrollments" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        }
                    />
                    <ChartCard
                        title="Completion Stats per Course/Tier"
                        chart={
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.completionStats}>
                                    {/* Professional Style: Thin, horizontal grid lines, no axis lines */}
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis dataKey="course" stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="completionRate" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        }
                    />
                </div>

                {/* Charts Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartCard
                        title="Revenue & Payouts"
                        chart={
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.revenue}>
                                    {/* Professional Style: Thin, horizontal grid lines, no axis lines */}
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis dataKey="month" stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} />
                                    <Line type="monotone" dataKey="payouts" stroke="#f59e0b" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        }
                    />
                    <ChartCard
                        title="Instructor Performance"
                        chart={
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.instructorPerformance} margin={{ top: 20 }}>
                                    {/* Professional Style: Thin, horizontal grid lines, no axis lines */}
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis dataKey="instructor" stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="rating" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="coursesCompleted" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        }
                    />
                </div>

                {/* Charts Row 4 (Engagement) */}
                <div className="grid grid-cols-1 gap-6">
                    <ChartCard
                        title="Engagement Reports"
                        className="h-96"
                        chart={
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.engagement} margin={{ top: 20 }}>
                                    {/* Professional Style: Thin, horizontal grid lines, no axis lines */}
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis dataKey="activity" stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        }
                    />
                </div>
            </div>

            {/* Modal for expanded chart */}
            {modalData && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl w-11/12 md:w-3/4 lg:w-1/2 p-6 relative shadow-2xl">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-sky-600 transition-colors text-2xl font-bold"
                            onClick={() => setModalData(null)}
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{modalData.title}</h2>
                        <div className="h-96">{modalData.chart}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
