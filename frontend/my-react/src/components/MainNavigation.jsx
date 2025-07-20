import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navber.jsx";
import Footer from "./footer.jsx";

export default function MainNavigation(){
    return(
        <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-14">
          <Outlet />
        </main>
       <Footer />
        </div>

    )
}