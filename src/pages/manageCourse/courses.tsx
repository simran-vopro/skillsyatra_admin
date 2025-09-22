import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import {
  Avatar,
  Box,
  IconButton,
  Switch,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
} from "@mui/material";
import { Check, Edit2, Eye, Trash2, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import DataTable from "../../components/common/DataTable";
import { useNavigate } from "react-router";
import { Course } from "../../types/course";
import { useCourseList } from "../../hooks/userCourseList";
import moment from "moment";
import { useAxios } from "../../hooks/useAxios";
import { API_PATHS, IMAGE_URL } from "../../utils/config";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function CourseManagement() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 50,
    page: 0,
  });

  const { courseData, refetch, metaData, loading } = useCourseList();

  // Delete state
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  // Status toggle state
  const [statusChangeCourse, setStatusChangeCourse] = useState<Course | null>(
    null
  );

  // Approve/Reject state
  const [approvalCourse, setApprovalCourse] = useState<Course | null>(null);
  const [approvalAction, setApprovalAction] = useState<
    "approve" | "reject" | null
  >(null);

  // Assign drawer state
  const [assignCourse, setAssignCourse] = useState<Course | null>(null);

  // ========================================> handle delete
  const { refetch: deleteCourseById } = useAxios({
    url: deleteCourse ? `${API_PATHS.COURSE_DELETE}/${deleteCourse._id}` : "",
    method: "delete",
    manual: true,
  });
  const handleDelete = async () => {
    await deleteCourseById();
    refetch();
    setDeleteCourse(null);
  };

  // ========================================> update visibility
  const { refetch: statusChangeRequest } = useAxios({
    url: statusChangeCourse
      ? `${API_PATHS.COURSE_VISIBILITY}/${statusChangeCourse._id}`
      : "",
    method: "put",
    body: { status: !statusChangeCourse?.status },
    manual: true,
  });

  const handleConfirmStatusChange = async () => {
    if (!statusChangeCourse) return;
    await statusChangeRequest();
    refetch();
    setStatusChangeCourse(null);
  };

  // ========================================> approve/reject (dummy for now)
  const handleConfirmApproval = (reason?: string) => {
    if (approvalAction === "approve") {
      // API call or logic to approve
      console.log("Approved:", approvalCourse);
    } else if (approvalAction === "reject") {
      // API call or logic to reject with reason
      console.log("Rejected:", approvalCourse, "Reason:", reason);
    }

    // cleanup
    setApprovalCourse(null);
    setApprovalAction(null);
    setRejectionReason("");
  };


  // Dummy students/instructors
  const dummyUsers = [
    { id: 1, name: "Alice Johnson (Student)" },
    { id: 2, name: "Bob Smith (Instructor)" },
    { id: 3, name: "Charlie Brown (Student)" },
  ];

  const courseColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "thumbnail",
        headerName: "Image",
        width: 80,
        renderCell: (params) => (
          <Avatar
            src={
              params.value?.startsWith("/uploads")
                ? IMAGE_URL + params.value
                : params.value
            }
            alt={params.row.title}
            variant="square"
            sx={{ width: 48, height: 48 }}
          />
        ),
        sortable: false,
        filterable: false,
      },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 150,
        renderCell: (params) => moment(params.value).format("DD-MM-YYYY HH:mm"),
      },
      {
        field: "updatedAt",
        headerName: "Updated At",
        width: 150,
        renderCell: (params) => moment(params.value).format("DD-MM-YYYY HH:mm"),
      },
      { field: "title", headerName: "Course Title", width: 220 },
      { field: "language", headerName: "Language", width: 120 },
      {
        field: "pricingType",
        headerName: "Type",
        width: 100,
        renderCell: (params) => (
          <Box
            px={1}
            py={0.5}
            bgcolor={
              params.value === "free" ? "success.light" : "warning.light"
            }
            color="black"
            borderRadius="8px"
            textTransform="capitalize"
          >
            {params.value}
          </Box>
        ),
      },
      {
        field: "pricing",
        headerName: "Price",
        width: 100,
        renderCell: (params) =>
          params.row.pricingType === "paid" ? `$${params.value}` : "Free",
      },
      {
        field: "instructor",
        headerName: "Instructor",
        width: 160,
        renderCell: (params) =>
          `${params.row.instructor?.firstName || ""} ${params.row.instructor?.lastName || ""
          }`,
      },
      {
        field: "category",
        headerName: "Category",
        width: 140,
        renderCell: (params) => <>{params.row.category?.name || "—"}</>,
      },
      {
        field: "tier",
        headerName: "Tier Mapping",
        width: 140,
        renderCell: () => <>Tier 1 → A, B, C</>, // dummy value
      },
      {
        field: "status",
        headerName: "Visibility",
        width: 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Box display="flex" justifyContent="center" width="100%">
            <Switch
              checked={params.value}
              onChange={() => setStatusChangeCourse(params.row)}
              size="small"
            />
          </Box>
        ),
      },
      {
        field: "courseStatus",
        headerName: "Status",
        width: 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <p className="capitalize">{params.value || "—"}</p>
        ),
      },
      {
        field: "assign",
        headerName: "Assign",
        width: 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Tooltip title="Assign Course">
            <IconButton
              color="secondary"
              size="small"
              onClick={() => setAssignCourse(params.row)}
            >
              <UserPlus size={16} />
            </IconButton>
          </Tooltip>
        ),
      },
      {
        field: "approvalStatus",
        headerName: "Approval Status",
        width: 140,
        renderCell: (params) => {
          const status = params.row.approvalStatus || "pending"; // default to pending

          if (status === "approved") {
            return (
              <Box
                px={1}
                py={0.5}
                bgcolor="success.light"
                color="white"
                borderRadius="8px"
                textTransform="capitalize"
              >
                Approved
              </Box>
            );
          }

          if (status === "rejected") {
            return (
              <Box
                px={1}
                py={0.5}
                bgcolor="error.light"
                color="white"
                borderRadius="8px"
                textTransform="capitalize"
              >
                Rejected
              </Box>
            );
          }

          // If pending → show action buttons
          return (
            <Box display="flex" gap={1}>
              <Tooltip title="Approve Course">
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => {
                    setApprovalCourse(params.row);
                    setApprovalAction("approve");
                  }}
                >
                  <Check size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Course">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => {
                    setApprovalCourse(params.row);
                    setApprovalAction("reject");
                  }}
                >
                  <X size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 180,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const isPublished = params.row.courseStatus === "published";

          return (
            <Box display="flex" gap={1}>
              {/* Show Approve/Reject only if not published */}
              {!isPublished && (
                <>
                  <Tooltip title="Approve Course (Publish)">
                    <IconButton
                      color="success"
                      size="small"
                      onClick={() => {
                        setApprovalCourse(params.row);
                        setApprovalAction("approve");
                      }}
                    >
                      <Check size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject Course">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => {
                        setApprovalCourse(params.row);
                        setApprovalAction("reject");
                      }}
                    >
                      <X size={18} />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              <Tooltip title="View Course Details">
                <IconButton
                  color="info"
                  size="small"
                  onClick={() =>
                    navigate("/addCourse", {
                      state: { courseId: params.row._id },
                    })
                  }
                >
                  <Eye size={18} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit Course">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() =>
                    navigate("/addCourse", {
                      state: { courseId: params.row._id },
                    })
                  }
                >
                  <Edit2 size={18} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete Course">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => setDeleteCourse(params.row)}
                >
                  <Trash2 size={18} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
        sortable: false,
        filterable: false,
        cellClassName: "actions-column-sticky",
        headerClassName: "actions-column-sticky",
      },
    ],
    [courseData]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Manage Courses
        </h2>
        <div className="flex items-center gap-3">
          <Input
            name="search"
            type="search"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/addCourse")}
          >
            Add New Course
          </Button>
        </div>
      </div>

      <DataTable
        rows={courseData || []}
        rowCount={metaData?.total || 0}
        pagination
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        loading={loading}
        columns={courseColumns}
        getRowId={(row: any) => row._id}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={!!deleteCourse}
        onClose={() => setDeleteCourse(null)}
        onConfirm={() => deleteCourse && handleDelete()}
        title="Confirm Delete Course"
        description={`Are you sure you want to delete this course "${deleteCourse?.title}"?`}
      />

      {/* Confirm Status Change Modal */}
      <ConfirmModal
        open={!!statusChangeCourse}
        onClose={() => setStatusChangeCourse(null)}
        onConfirm={handleConfirmStatusChange}
        title="Confirm Status Change"
        description={
          <>
            Are you sure you want to{" "}
            <strong>
              {statusChangeCourse?.status ? "deactivate" : "activate"}
            </strong>{" "}
            course <strong>{statusChangeCourse?.title}</strong>?
          </>
        }
      />

      {/* Confirm Approve/Reject Modal */}
      <ConfirmModal
        open={!!approvalCourse}
        onClose={() => {
          setApprovalCourse(null);
          setApprovalAction(null);
          setRejectionReason(""); // reset when closing
        }}
        onConfirm={() => handleConfirmApproval(rejectionReason)}
        title={`Confirm ${approvalAction === "approve" ? "Approval" : "Rejection"}`}
        description={
          <>
            <p>
              Are you sure you want to{" "}
              <strong>{approvalAction}</strong> course{" "}
              <strong>{approvalCourse?.title}</strong>?
            </p>

            {approvalAction === "reject" && (
              <TextField
                fullWidth
                multiline
                rows={3}
                margin="normal"
                label="Reason for Rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            )}
          </>
        }
      />


      {/* Assign Drawer */}
      <Drawer
        anchor="right"
        open={!!assignCourse}
        onClose={() => setAssignCourse(null)}
        PaperProps={{ sx: { width: 320, p: 2, zIndex: 1500 } }}
      >
        <h3 className="text-lg font-semibold mb-4">Assign Course</h3>
        <p className="text-sm text-gray-600 mb-3">
          Assign "{assignCourse?.title}" to:
        </p>
        <List>
          {dummyUsers.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemButton
                onClick={() =>
                  console.log(`Assigned ${assignCourse?.title} to ${user.name}`)
                }
              >
                <ListItemText primary={user.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
