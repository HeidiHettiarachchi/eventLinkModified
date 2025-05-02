import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { getUserDetails } from "./store/slices/userSlice";

// pages
import AdminView from "./views/AdminView";
import HomeView from "./views/HomeView";
import AuthView from "./views/AuthView";
import StaffView from "./views/StaffAdvisor/StaffView";
import EventView from "./views/EventView/EventView";
import ClubsView from "./views/Clubs/ClubsView";
import OrganizerView from "./views/OrganizerView";
import ErrorPage from "./views/ErrorPage";

// Organizer Pages 
import EventOrg from "./views/EventOrg";
import Profile from "./views/Profile/Profile";
import Committee from "./views/Committee/Committee";
import Resources from "./views/Resources/Resources";
import Calendar from "./views/Calendar/Calendar";

// components
import { LoadingSpinner } from "./components";
import SideBarOrg from "./components/SideBar/SideBarOrg";
import Sidebar from "./components/SideBar/SideBar";
import EventDetail from "./views/EventView/MoreDetailsEventView";
import SideBarStaff from "./components/SideBar/SideBarStaff";
// import ManageOrganizations from "./views/ManageOrganizationsView";
import StaffManageOrganization from "./views/StaffAdvisor/StaffManageOrganisation";
import StaffManageEvents from "./views/StaffAdvisor/StaffManageEvents";
import CalendarStaff from "./views/Calendar/CalendarStaff";
import StaffDetail from "./views/StaffAdvisor/StaffManageEvents";
import SellerView from "./views/SellerView";
import Order from "./views/Order";

function App() {
  const token = localStorage.getItem("token");

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      dispatch(getUserDetails());
    }
  }, [dispatch, token]);


  

  const renderSidebar = () => {
    const role = user.data?.role;

    if (role === "organizer") {
      return <SideBarOrg />;
    } else if (role === "admin") {
      return <Sidebar />;
    } else if (role === "staff") {
      return <SideBarStaff />;
    } else {
      return null;
    }
  };



  return (
    <>
      <div>
        <LoadingSpinner isLoading={user.isLoading} />

        {renderSidebar()}
   
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/login" element={<AuthView />} />

          {/* Staff */}
          <Route path="/staff" element={<StaffView />} />
          <Route path="/staff/eventsAdmin" element={<StaffManageEvents />} />
          <Route path="/staff/organizations" element={<StaffManageOrganization />} />
          <Route path="/staff/calendar" element={<CalendarStaff />} />
          <Route path="/staff/:id" element={<StaffDetail />} />

          {/* Events */}
          <Route path="/events" element={<EventView />} />
          <Route path="/events/:id" element={<EventDetail />} />
          
          <Route path="/clubs" element={<ClubsView />} />
          <Route path="/seller" element={<SellerView />} />
          <Route path="/order/:id" element={<Order />} />

          {/* Organizer */}
          <Route path="/organizer" element={<OrganizerView />} />
          <Route path="/organizer/eventsAdmin" element={<EventOrg />} />
          <Route path="/organizer/profile" element={<Profile />} />
          <Route path="/organizer/committee" element={<Committee />} />
          <Route path="/organizer/resources" element={<Resources />} />
          <Route path="/organizer/calendar" element={<Calendar />} />


     

        </Routes>
      </div>
    </>
  );
}

export default App;
