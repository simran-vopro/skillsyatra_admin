import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import PrivateRoute from "./components/routes/PrivateRoute";
import { Toaster } from "react-hot-toast";

import CourseManagement from "./pages/manageCourse/courses";

// import EditCourse from "./pages/manageCourse/editCourse";
import CourseCreate from "./pages/manageCourse/courseCreate";
import Tiptap from "./Tiptap";
import InstructorManagement from "./pages/manageInstructors/instructor";
import InstructorCreate from "./pages/manageInstructors/instructorCreate";
import TierPathwayControl from "./pages/manageTiers/tierPathwayControl";

import StudentsManagement from "./pages/manageStudents/students";
import PracticalCalendarManagement from "./pages/practicalManagement/practicalCalendarManagement";
import StudentCreate from "./pages/manageStudents/studentCreate";
import StudentDetails from "./pages/manageStudents/studentDetails";

export default function App() {
  return (
    <Router basename="/admin/">
      <Toaster containerStyle={{ zIndex: 999999999999 }} position="top-right" />
      <ScrollToTop />
      <Routes>
        <Route index path="/Texteditor" element={<Tiptap />} />
        {/* Protected Admin Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route path="/courses" element={<CourseManagement />} />
            <Route path="/addCourse" element={<CourseCreate />} />
            {/* <Route path="/editCourse" element={<EditCourse />} /> */}

            <Route path="/instructors" element={<InstructorManagement />} />
            <Route path="/addInstructor" element={<InstructorCreate />} />

            <Route path="/tiers" element={<TierPathwayControl />} />
            <Route path="/practicals" element={<PracticalCalendarManagement />} />

            <Route path="/students" element={<StudentsManagement />} />
            <Route path="/studentCreate" element={<StudentCreate />} />
            <Route path="/studentDetails" element={<StudentDetails />} />
          </Route>
        </Route>

        {/* Auth Page */}
        <Route path="/signin" element={<SignIn />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
