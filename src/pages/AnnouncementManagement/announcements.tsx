import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Divider,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Megaphone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Dummy announcements submitted by instructors
const announcements = [
  {
    id: "ANN-101",
    title: "Upcoming Workshop: React Advanced",
    content: "We are organizing a hands-on React workshop next month.",
    submittedBy: "Instructor John",
    date: "2025-03-10",
    status: "Pending",
  },
  {
    id: "ANN-102",
    title: "Deadline Reminder for Assignments",
    content: "All students must submit their assignments by March 15.",
    submittedBy: "Instructor Sarah",
    date: "2025-03-09",
    status: "Approved",
  },
  {
    id: "ANN-103",
    title: "Lab Maintenance Notice",
    content: "The design lab will be closed for maintenance this weekend.",
    submittedBy: "Instructor Alex",
    date: "2025-03-07",
    status: "Rejected",
  },
];

export default function AnnouncementManagementPage() {
  const navigate = useNavigate();
  const [targetRole, setTargetRole] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

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
          <Megaphone size={28} /> Announcement Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      {/* Submitted Announcements */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="📢 Submitted Announcements" />
        <Divider />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {announcements.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">{a.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {a.content}
                    </Typography>
                  </TableCell>
                  <TableCell>{a.submittedBy}</TableCell>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={a.status}
                      color={
                        a.status === "Pending"
                          ? "warning"
                          : a.status === "Approved"
                          ? "success"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {a.status === "Pending" && (
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => console.log("Approve", a.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => console.log("Reject", a.id)}
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

      {/* Platform-wide Alert */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="🚨 Send Platform-wide Alert" />
        <Divider />
        <CardContent>
          <Box display="flex" gap={2} flexDirection="column">
            <TextField
              label="Alert Message"
              fullWidth
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
            />
            <Button
              variant="contained"
              color="error"
              onClick={() => console.log("Send Alert:", alertMessage)}
            >
              Send Alert
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Targeted Message */}
      <Card>
        <CardHeader title="🎯 Send Targeted Message" />
        <Divider />
        <CardContent>
          <Box display="flex" gap={2} flexDirection="column">
            <FormControl fullWidth>
              <InputLabel>Target Role</InputLabel>
              <Select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                label="Target Role"
              >
                <MenuItem value="All">All Users</MenuItem>
                <MenuItem value="Students">Students</MenuItem>
                <MenuItem value="Instructors">Instructors</MenuItem>
                <MenuItem value="Support">Support Team</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Message" fullWidth multiline rows={3} />
            <Button
              variant="contained"
              onClick={() => console.log("Send Targeted Message")}
            >
              Send Message
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
