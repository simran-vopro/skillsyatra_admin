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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Dummy tickets data
const tickets = [
  {
    id: "TCK-101",
    subject: "Unable to access JavaScript course",
    raisedBy: "John Doe",
    role: "Student",
    date: "2025-03-10",
    status: "Open",
    urgency: "High",
    assignedTo: "Unassigned",
  },
  {
    id: "TCK-102",
    subject: "Payment not reflecting",
    raisedBy: "Sarah Lee",
    role: "Student",
    date: "2025-03-09",
    status: "In Progress",
    urgency: "Medium",
    assignedTo: "Support Team A",
  },
  {
    id: "TCK-103",
    subject: "Issue with assignment grading",
    raisedBy: "Mark Smith",
    role: "Instructor",
    date: "2025-03-08",
    status: "Resolved",
    urgency: "Low",
    assignedTo: "Support Team B",
  },
];

export default function SupportTicketsPage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [search, setSearch] = useState("");

  const filteredTickets = tickets.filter(
    (t) =>
      (!filterStatus || t.status === filterStatus) &&
      (!filterUrgency || t.urgency === filterUrgency) &&
      (!filterRole || t.role === filterRole) &&
      (!search ||
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.raisedBy.toLowerCase().includes(search.toLowerCase()))
  );

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
          <MessageSquare size={28} /> Support & Ticketing
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Search"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Urgency</InputLabel>
              <Select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                label="Urgency"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>User Type</InputLabel>
              <Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                label="User Type"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Instructor">Instructor</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader title="🎫 All Support Tickets" />
        <Divider />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticket ID</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Raised By</TableCell>
                <TableCell>User Role</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Urgency</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.subject}</TableCell>
                  <TableCell>{t.raisedBy}</TableCell>
                  <TableCell>{t.role}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={t.status}
                      color={
                        t.status === "Open"
                          ? "warning"
                          : t.status === "In Progress"
                          ? "info"
                          : "success"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t.urgency}
                      color={
                        t.urgency === "High"
                          ? "error"
                          : t.urgency === "Medium"
                          ? "warning"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>{t.assignedTo}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => console.log("Assign ticket", t.id)}
                      >
                        Assign
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => console.log("Respond", t.id)}
                      >
                        Respond
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => console.log("Escalate", t.id)}
                      >
                        Escalate
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
