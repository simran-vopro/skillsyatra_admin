import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Avatar, Box, IconButton, Switch, Tooltip } from "@mui/material";
import { Edit2, Eye, Trash2 } from "lucide-react";
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

    console.log("courseData ==> ", courseData);

    // Modal state
    const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
    const [statusChangeCourse, setStatusChangeCourse] = useState<Course | null>(null);


    // ========================================> handle delete
    const {
        refetch: deleteCourseById,
    } = useAxios({
        url: deleteCourse ? `${API_PATHS.COURSE_DELETE}/${deleteCourse._id}` : "",
        method: "delete",
        manual: true,
    });
    const handleDelete = async () => {
        await deleteCourseById();
        refetch();
        setDeleteCourse(null);
    };


    // ========================================> update visisbility
    // Change Status
    const {
        refetch: statusChangeRequest,
    } = useAxios({
        url: statusChangeCourse ? `${API_PATHS.COURSE_VISIBILITY}/${statusChangeCourse._id}` : "",
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


    const courseColumns: GridColDef[] = useMemo(
        () => [
            {
                field: "thumbnail",
                headerName: "Image",
                width: 80,
                renderCell: (params) => (
                    <Avatar
                        src={params.value.startsWith("/uploads") ? IMAGE_URL + params.value : params.value}
                        alt={params.row.title}
                        variant="square"
                        sx={{ width: 48, height: 48 }}
                    />
                ),
                sortable: false,
                filterable: false,
            },
            {
                field: "createdAt", headerName: "Created At", width: 150, renderCell: (params) => (
                    <>
                        {moment(params.value).format("DD-MM-YYYY HH:MM")}
                    </>
                )
            },
            {
                field: "updatedAt", headerName: "Updated At", width: 150, renderCell: (params) => (
                    <>
                        {moment(params.value).format("DD-MM-YYYY HH:MM")}
                    </>
                )
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
                        bgcolor={params.value === "free" ? "success.light" : "warning.light"}
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
                renderCell: (params) => params.row.pricingType === "paid" ? `$${params.value}` : "Free",
            },
            {
                field: "instructor",
                headerName: "Instructor",
                width: 160,
                renderCell: (params) =>
                    `${params.row.instructor?.firstName || ""} ${params.row.instructor?.lastName || ""}`,
            },
            {
                field: "category",
                headerName: "Category",
                width: 140,
                renderCell: (params) => <>{params.row.category?.name || "—"}</>,
            },
            {
                field: "status",
                headerName: "Status",
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
                field: "actions",
                headerName: "Actions",
                width: 120,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Box>

                        <Tooltip title="Edit">
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() =>
                                    navigate("/editCourse", { state: { courseId: params.row._id } })
                                }
                            >
                                <Eye size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() =>
                                    navigate("/editCourse", { state: { courseId: params.row._id } })
                                }
                            >
                                <Edit2 size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => setDeleteCourse(params.row)}
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
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
                    <div>
                        <Input
                            name="search"
                            type="search"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                            navigate("/addCourse")
                        }}
                    >
                        Add New Course
                    </Button>

                    {/* <Button variant="outline" size="sm" onClick={() => setCsvModalOpen(true)}>
                        Upload CSV
                    </Button> */}
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
                        <strong>{statusChangeCourse?.status ? "deactivate" : "activate"}</strong>{" "}
                        course <strong>{statusChangeCourse?.title}</strong>?
                    </>
                }
            />



        </div>
    );
}
