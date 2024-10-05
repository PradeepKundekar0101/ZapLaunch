import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from "@/components/ui/loader";
import { ProtectedRoute } from "./protectedRoute";
import App from "../App";
import ErrorBoundary from "@/components/common/error";

const LandingPage = lazy((): any => import("../pages/Landing"));
const LoginPage = lazy((): any => import("../pages/Auth/Login"));
const AuthCallback = lazy((): any => import("../pages/Auth/Auth-Callback"));
const Dashboard = lazy((): any => import("../pages/Dashboard"));
const NotFound = lazy((): any => import("../pages/NotFound"));
const SingleProject = lazy((): any => import("../pages/Project/SingleProject"));
const CreateProject = lazy((): any => import("../pages/Project/New"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loader />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "new",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "project/:projectId",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute>
              <SingleProject />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "auth-callback",
        element: (
          <Suspense fallback={<Loader />}>
            <AuthCallback />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
export default router;
