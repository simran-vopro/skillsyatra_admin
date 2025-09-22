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
} from "@mui/material";
import { DollarSign, ArrowLeft, FileText, Check, X, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy Finance Data
const payouts = [
  {
    id: "PAYOUT-101",
    instructor: "Jane Smith",
    avatar: "/images/user/user-02.jpg",
    amount: 1200,
    date: "2025-03-10",
    status: "Pending",
    method: "Bank Transfer",
  },
  {
    id: "PAYOUT-102",
    instructor: "Alex Johnson",
    avatar: "/images/user/user-03.jpg",
    amount: 900,
    date: "2025-03-09",
    status: "Approved",
    method: "PayPal",
  },
];

const payments = [
  {
    id: "PAY-301",
    user: "John Doe",
    course: "React Basics",
    amount: 200,
    date: "2025-03-01",
    status: "Success",
  },
  {
    id: "PAY-302",
    user: "Mary Johnson",
    course: "UI/UX Design",
    amount: 150,
    date: "2025-02-28",
    status: "Refunded",
  },
];

const courseRevenue = [
  { course: "React Basics", revenue: 5000 },
  { course: "Advanced JavaScript", revenue: 7000 },
  { course: "UI/UX Design", revenue: 3500 },
];

export default function EarningsFinancePage() {
  const navigate = useNavigate();

  // Summary Calculations
  const totalEarnings = payments
    .filter((p) => p.status === "Success")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunds = payments
    .filter((p) => p.status === "Refunded")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayouts = payouts.filter((p) => p.status === "Pending").length;

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
          <DollarSign size={28} /> Earnings & Finance
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      {/* Finance Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center shadow-md">
          <Typography variant="h6">💰 Total Earnings</Typography>
          <Typography variant="h5" fontWeight="bold">
            ${totalEarnings}
          </Typography>
        </Card>
        <Card className="p-4 text-center shadow-md">
          <Typography variant="h6">⏳ Pending Payouts</Typography>
          <Typography variant="h5" fontWeight="bold">
            {pendingPayouts}
          </Typography>
        </Card>
        <Card className="p-4 text-center shadow-md">
          <Typography variant="h6">🔄 Refunds Processed</Typography>
          <Typography variant="h5" fontWeight="bold" color="error">
            ${totalRefunds}
          </Typography>
        </Card>
        <Card className="p-4 text-center shadow-md">
          <Typography variant="h6">📊 Courses Tracked</Typography>
          <Typography variant="h5" fontWeight="bold">
            {courseRevenue.length}
          </Typography>
        </Card>
      </div>

      {/* Instructor Payout Requests */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="🏦 Instructor Payout Requests" />
        <Divider />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Instructor</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payouts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={p.avatar} />
                      {p.instructor}
                    </Box>
                  </TableCell>
                  <TableCell>${p.amount}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.status}
                      color={
                        p.status === "Pending"
                          ? "warning"
                          : p.status === "Approved"
                          ? "success"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {p.status === "Pending" && (
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                          startIcon={<Check />}
                          onClick={() => console.log("Approve", p.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          color="warning"
                          variant="contained"
                          startIcon={<Pause />}
                          onClick={() => console.log("Hold", p.id)}
                        >
                          Hold
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          startIcon={<X />}
                          onClick={() => console.log("Reject", p.id)}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="💳 Payment History" />
        <Divider />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((pay) => (
                <TableRow key={pay.id}>
                  <TableCell>{pay.user}</TableCell>
                  <TableCell>{pay.course}</TableCell>
                  <TableCell>${pay.amount}</TableCell>
                  <TableCell>{pay.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={pay.status}
                      color={
                        pay.status === "Success"
                          ? "success"
                          : pay.status === "Refunded"
                          ? "error"
                          : "default"
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Course-wise Revenue Breakdown */}
      <Card>
        <CardHeader title="📊 Course-wise Revenue Breakdown" />
        <Divider />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courseRevenue.map((c, index) => (
                <TableRow key={index}>
                  <TableCell>{c.course}</TableCell>
                  <TableCell>${c.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
