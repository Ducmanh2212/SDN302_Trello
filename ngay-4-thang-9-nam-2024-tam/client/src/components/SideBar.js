import React from "react";
import { Nav } from "react-bootstrap";
import "./styles/SideBar.css";
const Sidebar = () => {
  return (
    <div className="sidebar bg-light">
      <Nav className="flex-column">
        <Nav.Link href="/">Projects</Nav.Link>
        <Nav.Link href="/about">About</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
