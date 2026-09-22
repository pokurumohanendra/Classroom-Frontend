import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";

import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
  CatchAllNavigate,
  NavigateToResource,
} from "@refinedev/react-router";
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth";
import { accessControlProvider } from "./providers/access-control";
import { RequireRole } from "./components/require-role";
import { Layout } from "./components/refine-ui/layout/layout";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import "./App.css";
import { Dashboard } from "./Pages/dashboard";
import { BookOpen, ClipboardList, GraduationCap, Home, Layers, Presentation, Users } from "lucide-react";
import Login from "./Pages/login";
import Register from "./Pages/register";
import ForgotPassword from "./Pages/forgot-password";
import SubjectsList from "./Pages/subjects/list";
import SubjectsCreate from "./Pages/subjects/create";
import SubjectsEdit from "./Pages/subjects/edit";
import SubjectsShow from "./Pages/subjects/show";
import DepartmentsList from "./Pages/departments/list";
import DepartmentsCreate from "./Pages/departments/create";
import DepartmentsEdit from "./Pages/departments/edit";
import DepartmentsShow from "./Pages/departments/show";
import ClassesList from "./Pages/classes/list";
import ClassesCreate from "./Pages/classes/create";
import ClassesEdit from "./Pages/classes/edit";
import ClassesShow from "./Pages/classes/show";
import EnrollmentsList from "./Pages/enrollments/list";
import EnrollmentsCreate from "./Pages/enrollments/create";
import EnrollmentsEdit from "./Pages/enrollments/edit";
import UsersList from "./Pages/users/list";
import UsersCreate from "./Pages/users/create";
import UsersEdit from "./Pages/users/edit";
import UsersShow from "./Pages/users/show";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              accessControlProvider={accessControlProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "yxSKYM-4pW1xD-eoYfym",
                title: { text: "Learn New Skill", icon: <GraduationCap /> },
              }}
              resources={[
                { name: "dashboard", list: "/", meta: { label: "Home", icon: <Home /> } },
                {
                  name: "departments",
                  list: "/departments",
                  create: "/departments/create",
                  edit: "/departments/edit/:id",
                  show: "/departments/show/:id",
                  meta: { label: "Departments", icon: <Layers /> },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  edit: "/subjects/edit/:id",
                  show: "/subjects/show/:id",
                  meta: { label: "Subjects", icon: <BookOpen /> },
                },
                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  edit: "/classes/edit/:id",
                  show: "/classes/show/:id",
                  meta: { label: "Classes", icon: <Presentation /> },
                },
                {
                  name: "enrollments",
                  list: "/enrollments",
                  create: "/enrollments/create",
                  edit: "/enrollments/edit/:id",
                  meta: { label: "Enrollments", icon: <ClipboardList /> },
                },
                {
                  name: "users",
                  list: "/users",
                  create: "/users/create",
                  edit: "/users/edit/:id",
                  show: "/users/show/:id",
                  meta: { label: "Users", icon: <Users /> },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="/" element={<Dashboard />} />
                  <Route path="departments">
                    <Route index element={<DepartmentsList />} />
                    <Route path="create" element={<DepartmentsCreate />} />
                    <Route path="edit/:id" element={<DepartmentsEdit />} />
                    <Route path="show/:id" element={<DepartmentsShow />} />
                  </Route>
                  <Route path="subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                    <Route path="edit/:id" element={<SubjectsEdit />} />
                    <Route path="show/:id" element={<SubjectsShow />} />
                  </Route>
                  <Route path="classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassesCreate />} />
                    <Route path="edit/:id" element={<ClassesEdit />} />
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>
                  <Route path="enrollments">
                    <Route index element={<EnrollmentsList />} />
                    <Route path="create" element={<EnrollmentsCreate />} />
                    <Route path="edit/:id" element={<EnrollmentsEdit />} />
                  </Route>
                  <Route
                    path="users"
                    element={
                      <RequireRole roles={["admin"]}>
                        <Outlet />
                      </RequireRole>
                    }
                  >
                    <Route index element={<UsersList />} />
                    <Route path="create" element={<UsersCreate />} />
                    <Route path="edit/:id" element={<UsersEdit />} />
                    <Route path="show/:id" element={<UsersShow />} />
                  </Route>
                </Route>

                <Route
                  element={
                    <Authenticated key="authenticated-auth" fallback={<Outlet />}>
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
