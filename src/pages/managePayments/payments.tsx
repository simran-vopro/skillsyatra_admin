import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Divider,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  CreditCard,
  FileText,
  ArrowLeft,
  Download,
  User,
  Users,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Dummy payment history
const payments = [
  {
    id: "pay_301",
    userType: "Student",
    userName: "John Doe",
    userAvatar: "/images/user/user-01.jpg",
    course: "React Basics",
    amount: 200,
    method: "Credit Card",
    transactionId: "TXN89321",
    date: "2025-03-01",
    status: "Success",
    invoiceUrl: "#",
  },
  {
    id: "pay_302",
    userType: "Instructor",
    userName: "Jane Smith",
    userAvatar: "/images/user/user-02.jpg",
    course: "Advanced JavaScript",
    amount: 450,
    method: "PayPal",
    transactionId: "TXN77210",
    date: "2025-02-20",
    status: "Success",
    invoiceUrl: "#",
  },
  {
    id: "pay_303",
    userType: "Student",
    userName: "Alex Johnson",
    userAvatar: "/images/user/user-03.jpg",
    course: "UI/UX Design",
    amount: 150,
    method: "Stripe",
    transactionId: "TXN45120",
    date: "2025-02-15",
    status: "Failed",
    invoiceUrl: "#",
  },
];

// Dummy pending bills
const bills = [
  {
    id: "bill_101",
    userType: "Student",
    userName: "John Doe",
    description: "Course Renewal - Advanced JavaScript",
    dueDate: "2025-03-20",
    amount: 120,
    status: "Pending",
  },
  {
    id: "bill_102",
    userType: "Instructor",
    userName: "Jane Smith",
    description: "Platform Commission Fee",
    dueDate: "2025-03-25",
    amount: 300,
    status: "Overdue",
  },
];

// Finance summary calculations
const totalCollected = payments
  .filter((p) => p.status === "Success")
  .reduce((sum, p) => sum + p.amount, 0);

const pendingBills = bills.filter((b) => b.status === "Pending").length;
const overdueBills = bills.filter((b) => b.status === "Overdue").length;
const failedPayments = payments.filter((p) => p.status === "Failed").length;

export default function PaymentsPage() {
  const navigate = useNavigate();

  // Filters state
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("All");
  const [status, setStatus] = useState("All");

  // Filtered payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.userName.toLowerCase().includes(search.toLowerCase()) ||
      p.course.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(search.toLowerCase());

    const matchesUserType =
      userType === "All" ? true : p.userType === userType;

    const matchesStatus = status === "All" ? true : p.status === status;

    return matchesSearch && matchesUserType && matchesStatus;
  });

  return (
    <Box p={3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold" display="flex" gap={1}>
          <CreditCard size={28} /> Payments & Bills
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      {/* Finance Snapshot (Tailwind instead of Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center shadow-md">
          <Typography variant="h6">💰 Total Collected</Typography>
          <Typography variant="h5" fontWeight="bold">
            ${totalCollected}
          </Typography>
        </Card>
        <Card className="p-4 text-center shadow-md">
          <Typography variant="h6">📑 Pending Bills</Typography>
          <Typography variant="h5" fontWeight="bold">
            {pendingBills}
          </Typography>
        </Card>
        <Card className="p-4 text-center shadow-md">
          <Typography variant="h6">⏰ Overdue Bills</Typography>
          <Typography variant="h5" fontWeight="bold" color="error">
            {overdueBills}
          </Typography>
        </Card>
        <Card className="p-4 text-center shadow-md">
          <Typography variant="h6">❌ Failed Payments</Typography>
          <Typography variant="h5" fontWeight="bold" color="error">
            {failedPayments}
          </Typography>
        </Card>
      </div>

      {/* Pending Bills Section */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="📑 Pending Bills" />
        <Divider />
        <CardContent>
          {bills.length === 0 ? (
            <Typography color="text.secondary">No pending bills 🎉</Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {bills.map((bill) => (
                <Card
                  key={bill.id}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Box>
                    <Typography fontWeight="bold">{bill.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      User: {bill.userName} ({bill.userType})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Due: {bill.dueDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Amount: ${bill.amount}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1} alignItems="center">
                    <Chip
                      label={bill.status}
                      color={
                        bill.status === "Pending"
                          ? "warning"
                          : bill.status === "Overdue"
                          ? "error"
                          : "default"
                      }
                      sx={{ fontWeight: "bold" }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => console.log("Reminder sent for", bill.id)}
                    >
                      Send Reminder
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => console.log("Mark as paid", bill.id)}
                    >
                      Mark as Paid
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Payment History Section */}
      <Card>
        <CardHeader title="💳 Payment History" />
        <Divider />
        <CardContent>
          {/* Filters */}
          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            <TextField
              label="Search (user, course, transaction)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              select
              label="User Type"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Instructor">Instructor</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Success">Success</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </TextField>
          </Box>

          {/* Payments Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>User Type</TableCell>
                <TableCell>Course/Reason</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Invoice</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={p.userAvatar} />
                      {p.userName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={p.userType === "Student" ? <User /> : <Users />}
                      label={p.userType}
                      color={p.userType === "Student" ? "info" : "secondary"}
                    />
                  </TableCell>
                  <TableCell>{p.course}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <DollarSign size={14} /> {p.amount}
                    </Box>
                  </TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell>{p.transactionId}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.status}
                      color={p.status === "Success" ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button size="small" href={p.invoiceUrl} target="_blank">
                        <FileText size={16} />
                      </Button>
                      <Button
                        size="small"
                        onClick={() => console.log("Download invoice", p.id)}
                      >
                        <Download size={16} />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
