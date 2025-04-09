// src/App.tsx
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Header from "./components/structure/Header";
import Footer from "./components/structure/Footer";
import PrivateRoute from "./components/structure/PrivateRoute";
import {AuthProvider} from "./context/AuthContext";
import NotFound from "./components/structure/NotFound.tsx"
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/common/Home";
import Profile from "./pages/common/Profile";
import StudentGrades from "./pages/student/StudentGrades";
import StudentClasses from "./pages/student/StudentClasses";
import StudentDashboard from "./pages/student/StudentDashBoard";
import GradeManagement from "./pages/professor/GradeManagement";
import ClassManagement from "./pages/professor/ClassManagement";
import ClassPage from "./pages/common/ClassPage";
import ProfessorDashboard from "./pages/professor/ProfessorDashBoard";
import ClassManagementDetail from "./pages/professor/ClassManagementDetail.tsx";


function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-grow min-h-screen">
                    <Header/>
                    <div className="flex-grow p-4">
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>

                            {/* Routes communes aux deux rôles */}
                            <Route element={<PrivateRoute/>}>
                                <Route path="/profile" element={<Profile/>}/>
                                <Route path="/class/:id" element={<ClassPage/>}/>
                            </Route>

                            {/* Routes pour les étudiants */}
                            <Route element={<PrivateRoute requiredRole="student"/>}>
                                <Route path="/student-dashboard" element={<StudentDashboard/>}/>
                                <Route path="/grades" element={<StudentGrades/>}/>
                                <Route path="/classes" element={<StudentClasses/>}/>
                            </Route>

                            {/* Routes pour les professeurs */}
                            <Route element={<PrivateRoute requiredRole="professor"/>}>
                                <Route path="/professor/classes/:id" element={<ClassManagementDetail />} />
                                <Route path="/professor-dashboard" element={<ProfessorDashboard/>}/>
                                <Route path="/grade-management" element={<GradeManagement/>}/>
                                <Route path="/class-management" element={<ClassManagement/>}/>
                            </Route>

                            {/* Route 404 pour toutes les autres URL */}
                            <Route path="*" element={<NotFound/>}/>

                        </Routes>
                    </div>
                    <Footer/>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;