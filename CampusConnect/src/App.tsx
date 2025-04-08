// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import Header from "./components/structure/Header";
import Footer from "./components/structure/Footer";
import PrivateRoute from "./components/structure/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
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
//import RoleBasedRoute from "./components/structure/RoleBasedRoute";

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
      <ApolloProvider client={client}>
        <AuthProvider>
          <Router>
            {/* Utilisation d'un conteneur flex pour occuper toute la hauteur de l'écran */}
            <div className="flex flex-grow min-h-screen">
              <Header />
              {/* Le contenu principal avec flex-grow pour qu'il prenne tout l'espace disponible */}
              <div className="flex-grow p-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Routes communes aux deux rôles */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/class/:id" element={<ClassPage />} />
                  </Route>

                  {/* Routes pour les étudiants */}
                  <Route element={<PrivateRoute requiredRole="student" />}>
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                    <Route path="/grades" element={<StudentGrades />} />
                    <Route path="/classes" element={<StudentClasses />} />
                  </Route>

                  {/* Routes pour les professeurs */}
                  <Route element={<PrivateRoute requiredRole="professor" />}>
                    <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
                    <Route path="/grade-management" element={<GradeManagement />} />
                    <Route path="/class-management" element={<ClassManagement />} />
                  </Route>
                </Routes>
              </div>
              {/* Le footer sera toujours en bas */}
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ApolloProvider>
  );
}

export default App;