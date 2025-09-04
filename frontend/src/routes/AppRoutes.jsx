// AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Register from "../components/Auth/Register";
// import Login from "../components/Auth/Login";
import Profile from "../components/Auth/Profile";
import UrlCreate from "../components/Url/UrlCreate";
import UrlList from "../components/Url/UrlList";
import PublicRoute from "../components/Auth/PublicRoute";
import Protectedroute from "../components/Auth/Protectedroute";
import EditProfile from "../components/Auth/EditProfile";
import UrlShortener from "../components/pages/UrlShortener";
import Home from "../components/pages/Home";
import AnalyticsPage from "../components/pages/AnalyticsPage";
import Dashboard from "../components/pages/Dashboard";
import Login from "../components/fireBase/Login";
import Register from "../components/fireBase/Register";
import DashboardLayout from "../components/pages/DashboardLayout";
import UpdateUrl from "../components/Url/UpdateUrl";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* <Route path="/dashboard" element={  <Dashboard />  } /> */}

        {/* FireBase Auth  */}
        {/* <Route path="/login" element={  <Login />  } /> */}
        <Route path="/register" element={ <Register />} />


        {/*  public routes */}
        <Route path="/login" element={ <PublicRoute> <Login /> </PublicRoute> } />
        {/* <Route path="/register" element={<PublicRoute> <Register /> </PublicRoute>} /> */}

        <Route path="/urlshort" element={<PublicRoute> <UrlShortener /> </PublicRoute>} />

        {/* <Route path="/analytics/:shortCode" element={ <Protectedroute> <AnalyticsPage /> </Protectedroute> } /> */}

        {/* demo Routes  */}
        <Route element={<Protectedroute><DashboardLayout /></Protectedroute>}>
        <Route path="/me" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit" element={<EditProfile />} />
        <Route path="/urls" element={<UrlList />} />
        <Route path="/urls/create" element={<UrlCreate />} />
        <Route path="/urls/update/:id" element={<UpdateUrl />} />
        <Route path="/analytics/:shortCode" element={<AnalyticsPage />} />
      </Route>

        {/* correct path */}
        {/* <Route path="/edit" element={ <Protectedroute> <EditProfile /> </Protectedroute> } />
        <Route path="/me" element={ <Protectedroute> <Profile /> </Protectedroute> } />
        <Route path="/urls" element={ <Protectedroute> <UrlList /> </Protectedroute> } />
        <Route path="/urls/create" element={ <Protectedroute> <UrlCreate /> </Protectedroute>} /> */}
      </Routes>
    </BrowserRouter>
  );
}
