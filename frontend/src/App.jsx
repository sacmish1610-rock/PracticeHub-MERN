import { Toaster } from "react-hot-toast";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tracker from "./pages/Tracker.jsx";
import Founder from "./pages/Founder.jsx";

import Subjects from "./pages/Subjects.jsx";
import Chapters from "./pages/Chapters.jsx";
import Quiz from "./pages/Quiz.jsx";
import Analytics from "./pages/Analytics.jsx";

import AdminAddQuestion from "./pages/AdminAddQuestion.jsx";
import AdminQuestions from "./pages/AdminQuestions.jsx";
import AdminBulkUpload from "./pages/AdminBulkUpload.jsx";
import AdminRoute from "./components/AdminRoute.jsx";


export default function App() {
  const location = useLocation();

  // Hide navbar on auth pages
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col bg-surface text-white">
      
      {/* 🔔 GLOBAL TOASTER */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0f172a", // slate-950
            color: "#ffffff",
            border: "1px solid #1e293b",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#0f172a",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#0f172a",
            },
          },
        }}
      />

      {/* NAVBAR */}
      {!hideNavbar && <Navbar />}

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ================= PROTECTED ROUTES ================= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subjects"
            element={
              <ProtectedRoute>
                <Subjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chapters/:subjectId"
            element={
              <ProtectedRoute>
                <Chapters />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:subjectId/:chapterName"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tracker"
            element={
              <ProtectedRoute>
                <Tracker />
              </ProtectedRoute>
            }
          />

          {/* Calendar alias */}
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Tracker />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/founder"
            element={
              <ProtectedRoute>
                <Founder />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route
           path="/admin/add-question"
           element={
           <AdminRoute>
           <AdminAddQuestion />
           </AdminRoute>
          }
         />


         <Route
          path="/admin/questions"
          element={
          <AdminRoute>
          <AdminQuestions />
          </AdminRoute>
          }
         />

          <Route
            path="/admin/bulk-upload"
            element={
              <AdminRoute>
                <AdminBulkUpload />
              </AdminRoute>
            }
          />

          {/* ================= FALLBACK ================= */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-xl font-semibold text-gray-400">
                  404 – Page Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
