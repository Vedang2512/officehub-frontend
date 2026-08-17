import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Chat from "../pages/chat/Chat";
import TaskBoard from "../pages/tasks/TaskBoard";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";
import ProtectedRoute from "../components/ProtectedRoute";
import Organization from "../pages/organization/Organization";
import Employees from "../pages/employees/Employees";
import EmployeeJoin from "../pages/employees/EmployeeJoin";
import CreateTask from "../pages/tasks/CreateTask";
import CreateTeam from "../pages/teams/CreateTeam";
import TaskDetails from "../pages/tasks/TaskDetails";
import Teams from "../pages/teams/Teams";
import EditTask from "../pages/tasks/EditTask";
import Forbidden from "../pages/errors/Forbidden";
import NotFound from "../pages/errors/NotFound";
import ServerError from "../pages/errors/ServerError";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route 
                    path="/employee/join" 
                    element={<EmployeeJoin />} 
                />

                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teams/create"
                    element={
                        <ProtectedRoute>
                            <CreateTeam />
                        </ProtectedRoute>
                    }
                />    

                <Route
                    path="/tasks/:taskId"
                    element={
                        <ProtectedRoute>
                            <TaskDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teams"
                    element={
                        <ProtectedRoute>
                            <Teams />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <TaskBoard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks/create"
                    element={
                        <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
                            <CreateTask />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks/:taskId/edit"
                    element={
                        <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
                            <EditTask />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/organization"
                    element={
                        <ProtectedRoute>
                            <Organization />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employees"
                    element={
                        <ProtectedRoute>
                            <Employees />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/403"
                    element={<Forbidden />}
                />

                <Route
                    path="/500"
                    element={<ServerError />}
                />

                <Route
                    path="*"
                    element={<NotFound />}
                />    


            </Routes>
        </BrowserRouter>
    );
}