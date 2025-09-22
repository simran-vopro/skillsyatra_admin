import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import { Award, Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy achievements
const achievements = [
  {
    id: "ach_101",
    title: "Top Performer - React Basics",
    description: "Awarded for scoring above 90% in React Basics final exam.",
    date: "2025-02-20",
    icon: "/images/icons/medal.png",
    type: "Gold",
  },
  {
    id: "ach_102",
    title: "Quiz Champion - JavaScript",
    description: "Completed 5 consecutive quizzes with full marks.",
    date: "2025-03-05",
    icon: "/images/icons/trophy.png",
    type: "Silver",
  },
  {
    id: "ach_103",
    title: "Consistent Learner",
    description: "Maintained daily streak for 30 days.",
    date: "2025-03-10",
    icon: "/images/icons/badge.png",
    type: "Bronze",
  },
];

// Dummy certificates
const certificates = [
  {
    id: "cert_201",
    name: "React Basics Completion",
    issuedOn: "2025-02-15",
    issuedBy: "Code Academy",
    url: "#",
  },
  {
    id: "cert_202",
    name: "Advanced JavaScript",
    issuedOn: "2025-03-01",
    issuedBy: "SkillUp",
    url: "#",
  },
];

export default function AchievementsPage() {
  const navigate = useNavigate();

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
          <Award size={28} /> Achievements & Certificates
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      {/* Achievements Section */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="🏆 Achievements" />
        <Divider />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {achievements.map((ach) => (
              <Card
                key={ach.id}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Box display="flex" gap={2} alignItems="center">
                  <Avatar
                    src={ach.icon}
                    alt={ach.title}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Box>
                    <Typography fontWeight="bold">{ach.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {ach.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ach.date}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={ach.type}
                  color={
                    ach.type === "Gold"
                      ? "warning"
                      : ach.type === "Silver"
                      ? "info"
                      : "secondary"
                  }
                  sx={{ fontWeight: "bold" }}
                />
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Certificates Section */}
      <Card>
        <CardHeader title="🎓 Certificates" />
        <Divider />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {certificates.map((cert) => (
              <Card
                key={cert.id}
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
                  <Typography fontWeight="bold">{cert.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Issued by {cert.issuedBy} on {cert.issuedOn}
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    href={cert.url}
                    target="_blank"
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Download />}
                    onClick={() => console.log("Download certificate:", cert.id)}
                  >
                    Download
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
