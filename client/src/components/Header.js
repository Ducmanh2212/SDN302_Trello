// Header.js
import React from "react";
import { Navbar, Nav, Form, FormControl } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "./styles/Header.css";

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="justify-content-between">
      <Navbar.Brand href="/">ProjectLogo</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="ml-auto">
          <Form inline className="search-form">
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <FaSearch className="search-icon" />
          </Form>
          <Nav.Link href="/profile" className="profile-link">
            <i className="fas fa-user">Profile</i>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
