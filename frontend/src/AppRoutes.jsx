import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./index.css"
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Students from "./pages/admin/Students";
import Staff from "./pages/admin/Staff";
import Fees from "./pages/admin/Fees";
import Batches from "./pages/admin/Batches";
import Exams from "./pages/admin/Exams";
import Materials from "./pages/admin/Materials";
import AdminResults from "./pages/admin/Results";
import AdminStaffAttendance from "./pages/admin/StaffAttendance";
import AdminCertificates from './pages/admin/Certificates';
import Attendance from "./pages/staff/Attendance";
import StaffStudents from "./pages/staff/Students";
import MarksEntry from "./pages/staff/MarksEntry";
import StaffExams from "./pages/staff/Exams";
import StudentDashboard from "./pages/student/Dashboard";
import StudentFees from "./pages/student/Fees";
import StudentAttendance from "./pages/student/Attendance";
import StudentMaterials from "./pages/student/Materials";
import StudentCertificates from "./pages/student/Certificates";
import StudentResults from "./pages/student/Results";
import StaffDashboard from "./pages/staff/Dashboard";
import Notices from "./pages/common/Notices";
import StaffResults from "./pages/staff/Results";
import StaffMaterials from "./pages/staff/Materials";
import { ProtectedRoute, RoleRoute } from "./routes/Guards";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isLoading ? (
                <div>Loading...</div>
              ) : user ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            }
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Admin Routes */}
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<Students />} />
              <Route path="/admin/staff" element={<Staff />} />
              <Route path="/admin/staff-attendance" element={<AdminStaffAttendance />} />
              <Route path="/admin/batches" element={<Batches />} />
              <Route path="/admin/exams" element={<Exams />} />
              <Route path="/admin/fees" element={<Fees />} />
              <Route path="/admin/notices" element={<Notices />} />
              <Route path="/admin/materials" element={<Materials />} />
              <Route path="/admin/certificates" element={<AdminCertificates />} />
              <Route path="/admin/results" element={<AdminResults />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["staff"]} />}>
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/students" element={<StaffStudents />} />
              <Route path="/staff/attendance" element={<Attendance />} />
              <Route path="/staff/marks" element={<MarksEntry />} />
              <Route path="/staff/exams" element={<StaffExams />} />
              <Route path="/staff/results" element={<StaffResults />} />
              <Route path="/staff/materials" element={<StaffMaterials />} />
              <Route path="/staff/notices" element={<Notices />} />
            </Route>

            {/* Student Routes */}
            <Route element={<RoleRoute allowedRoles={["student"]} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/fees" element={<StudentFees />} />
              <Route
                path="/student/attendance"
                element={<StudentAttendance />}
              />
              <Route path="/student/materials" element={<StudentMaterials />} />
              <Route
                path="/student/certificates"
                element={<StudentCertificates />}
              />
              <Route path="/student/results" element={<StudentResults />} />
              <Route path="/student/notices" element={<Notices />} />
            </Route>
          </Route>
          <Route
            path="/"
            element={
              isLoading ? (
                <div>Loading...</div>
              ) : !user ? (
                <Navigate to="/login" replace />
              ) : user.role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : user.role === "staff" ? (
                <Navigate to="/staff/dashboard" replace />
              ) : (
                <Navigate to="/student/dashboard" replace />
              )
            }
          />
          {/* <Route path="/" element={<HomeRedirect />} /> */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
