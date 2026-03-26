import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";
import { ProtectedRoute, RoleRoute } from "./routes/Guards";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Students = lazy(() => import("./pages/admin/Students"));
const Staff = lazy(() => import("./pages/admin/Staff"));
const Fees = lazy(() => import("./pages/admin/Fees"));
const Batches = lazy(() => import("./pages/admin/Batches"));
const Exams = lazy(() => import("./pages/admin/Exams"));
const Materials = lazy(() => import("./pages/admin/Materials"));
const AdminResults = lazy(() => import("./pages/admin/Results"));
const AdminStaffAttendance = lazy(() =>
  import("./pages/admin/StaffAttendance")
);
const AdminCertificates = lazy(() =>
  import("./pages/admin/Certificates")
);
const Banners = lazy(() => import("./pages/admin/Banners"));

const Attendance = lazy(() => import("./pages/staff/Attendance"));
const StaffStudents = lazy(() => import("./pages/staff/Students"));
const MarksEntry = lazy(() => import("./pages/staff/MarksEntry"));
const StaffExams = lazy(() => import("./pages/staff/Exams"));
const StaffResults = lazy(() => import("./pages/staff/Results"));
const StaffMaterials = lazy(() => import("./pages/staff/Materials"));
const StaffDashboard = lazy(() => import("./pages/staff/Dashboard"));

const StudentDashboard = lazy(() =>
  import("./pages/student/Dashboard")
);
const StudentFees = lazy(() => import("./pages/student/Fees"));
const StudentAttendance = lazy(() =>
  import("./pages/student/Attendance")
);
const StudentMaterials = lazy(() =>
  import("./pages/student/Materials")
);
const StudentCertificates = lazy(() =>
  import("./pages/student/Certificates")
);
const StudentResults = lazy(() =>
  import("./pages/student/Results")
);

const Notices = lazy(() => import("./pages/common/Notices"));

const HomePage = lazy(() => import("./pages/HomePage"));
const About = lazy(() => import("./pages/About"));
const OurStaff = lazy(() => import("./pages/OurStaff"));
const OurBatches = lazy(() => import("./pages/OurBatches"));

const AppRoutes = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter>
        <Suspense fallback={<div className="p-5">Loading page...</div>}>
          <Routes>
            {/* Login */}
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
              {/* Admin */}
              <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<Students />} />
                <Route path="/admin/staff" element={<Staff />} />
                <Route
                  path="/admin/staff-attendance"
                  element={<AdminStaffAttendance />}
                />
                <Route path="/admin/batches" element={<Batches />} />
                <Route path="/admin/exams" element={<Exams />} />
                <Route path="/admin/fees" element={<Fees />} />
                <Route path="/admin/notices" element={<Notices />} />
                <Route path="/admin/materials" element={<Materials />} />
                <Route
                  path="/admin/certificates"
                  element={<AdminCertificates />}
                />
                <Route path="/admin/results" element={<AdminResults />} />
                <Route path="/admin/banners" element={<Banners />} />
              </Route>

              {/* Staff */}
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

              {/* Student */}
              <Route element={<RoleRoute allowedRoles={["student"]} />}>
                <Route
                  path="/student/dashboard"
                  element={<StudentDashboard />}
                />
                <Route path="/student/fees" element={<StudentFees />} />
                <Route
                  path="/student/attendance"
                  element={<StudentAttendance />}
                />
                <Route
                  path="/student/materials"
                  element={<StudentMaterials />}
                />
                <Route
                  path="/student/certificates"
                  element={<StudentCertificates />}
                />
                <Route path="/student/results" element={<StudentResults />} />
                <Route path="/student/notices" element={<Notices />} />
              </Route>
            </Route>

            {/* Public */}
            <Route
              path="/"
              element={isLoading ? <div>Loading...</div> : <HomePage />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/staff" element={<OurStaff />} />
            <Route path="/batches" element={<OurBatches />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;