import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Check, X, Plus } from "lucide-react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function PracticalCalendarManagement() {
  const [tab, setTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Dummy schedules
  const schedules = [
    { id: 1, subject: "Anatomy Practical", venue: "Lab A", instructor: "Dr. Smith", time: "10:00 - 12:00" },
    { id: 2, subject: "Physics Lab", venue: "Lab B", instructor: "Prof. Johnson", time: "14:00 - 16:00" },
  ];

  // Dummy bookings
  const bookings = [
    { id: 1, student: "Alice Johnson", slot: "Anatomy Practical", status: "pending" },
    { id: 2, student: "Bob Smith", slot: "Physics Lab", status: "approved" },
  ];

  // Dummy attendance
  const attendance = [
    { id: 1, student: "Charlie Brown", slot: "Anatomy Practical", present: true },
    { id: 2, student: "Diana Prince", slot: "Physics Lab", present: false },
  ];

  const handleDateClick = (info: any) => {
    console.log("Clicked date: ", info.dateStr);
    setDrawerOpen(true);
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Practical & Calendar Management</Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setDrawerOpen(true)}
        >
          Create Schedule
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} sx={{ mb: 2 }}>
        <Tab label="Calendar" />
        <Tab label="Schedules" />
        <Tab label="Bookings" />
        <Tab label="Attendance" />
      </Tabs>

      {/* Calendar View */}
      {tab === 0 && (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          selectable={true}
          editable={true}
          events={[
            {
              title: "Anatomy Practical",
              start: "2025-09-15T10:00:00",
              end: "2025-09-15T12:00:00",
            },
            {
              title: "Physics Lab",
              start: "2025-09-16T14:00:00",
              end: "2025-09-16T16:00:00",
            },
          ]}
          dateClick={handleDateClick}
          height="75vh"
        />
      )}

      {/* Schedules Tab */}
      {tab === 1 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.subject}</TableCell>
                <TableCell>{s.venue}</TableCell>
                <TableCell>{s.instructor}</TableCell>
                <TableCell>{s.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Bookings Tab */}
      {tab === 2 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.student}</TableCell>
                <TableCell>{b.slot}</TableCell>
                <TableCell>{b.status}</TableCell>
                <TableCell align="center">
                  {b.status === "pending" && (
                    <>
                      <Tooltip title="Approve">
                        <IconButton color="success" size="small">
                          <Check size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton color="error" size="small">
                          <X size={16} />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Attendance Tab */}
      {tab === 3 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Present</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.student}</TableCell>
                <TableCell>{a.slot}</TableCell>
                <TableCell>
                  <Switch checked={a.present} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Drawer for Create Schedule */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 400 } }}
      >
        <Box p={3}>
          <Typography variant="h6" mb={2}>
            Create Practical Schedule
          </Typography>
          {/* TODO: Replace with proper form fields */}
          <Typography variant="body2">Form: Venue, Instructor, Slot, Capacity</Typography>
          <Button variant="contained" sx={{ mt: 3 }} fullWidth>
            Save
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
