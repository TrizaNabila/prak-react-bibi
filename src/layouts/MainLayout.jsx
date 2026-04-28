import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

export default function MainLayout() {
    return(
         <div id="app-container" className="bg-gray-100 min-h-screen flex">
      <div id="layout-wrapper" className="flex flex-row flex-1">
        {/* Sidebar di sebelah kiri */}
        <Sidebar />

        {/* Konten utama di sebelah kanan */}
        <div id="main-content" className="flex-1 p-4 overflow-y-auto">
          <Header />
          <Outlet/> 
        </div>
      </div>
    </div>
    )
}