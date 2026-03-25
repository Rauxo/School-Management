// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
// import AdminDashboard from './pages/AdminDashboard';
// import StaffDashboard from './pages/StaffDashboard';
// import StudentDashboard from './pages/StudentDashboard';
// import StudentManagement from './pages/StudentManagement';
// import StaffManagement from './pages/StaffManagement';
// import FeeManagement from './pages/FeeManagement';
// import AttendanceMarking from './pages/AttendanceMarking';
// import { useSelector } from 'react-redux';

// function App() {
//     const { user } = useSelector((state) => state.auth);

//     return (
//         <Router>
//             <Routes>
//                 <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                
//                 {/* Protected Routes */}
//                 <Route 
//                     path="/" 
//                     element={
//                         user ? (
//                             user.role === 'admin' ? <AdminDashboard /> :
//                             user.role === 'staff' ? <StaffDashboard /> :
//                             <StudentDashboard />
//                         ) : <Navigate to="/login" />
//                     } 
//                 />

//                 <Route path="/students" element={user?.role === 'admin' ? <StudentManagement /> : <Navigate to="/" />} />
//                 <Route path="/staff" element={user?.role === 'admin' ? <StaffManagement /> : <Navigate to="/" />} />
//                 <Route path="/fees" element={user?.role === 'admin' ? <FeeManagement /> : <Navigate to="/" />} />
                
//                 {/* Staff Specific Routes */}
//                 <Route path="/attendance" element={user?.role === 'staff' ? <AttendanceMarking /> : <Navigate to="/" />} />
                
//                 {/* Fallback */}
//                 <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//         </Router>
//     );
// }

// export default App;
