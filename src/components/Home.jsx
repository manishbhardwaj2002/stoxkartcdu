import React from 'react'
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Container from "./Container/Container";
import RightNavbar from "./RightNavbar/RightNavbar";
import Dashboard from "./Dashboard/Dashboard";
import Analytics from "./Analytics/Analytics";
import Campaings from "./Campaigns/Campaings";
import Team from "./Team/Team";
import NavContext from "../Context/NavContext";
import Mobile from './Mobile/Mobile';

const Home = () => {
    const [nav, setNav] = useState(false);
    const value = { nav, setNav };
  return (
    <div>
          <NavContext.Provider value={value}>
        <Navbar />
        <Container
          stickyNav={<RightNavbar />}
          content={
            <Routes>
              <Route path="*" element={<main>NOT FOUND</main>} />
              <Route path="/home" element={<Dashboard />} />
              <Route path="mobile" element={<Mobile />} />
              <Route path="/campaings" element={<Campaings />} />
              <Route path="/team" element={<Team />} />
              <Route path="/messages" element={<main>Messages</main>} />
            </Routes>
          }
        />
      </NavContext.Provider>
    </div>
  )
}

export default Home