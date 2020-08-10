import React, { useEffect, useState } from "react";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import {
  faHome,
  faUsers,
  faProjectDiagram,
} from "@fortawesome/free-solid-svg-icons";

const NavbarLy = (props) => {
  return (
    <div className='Navbar'>
      <Navbar bg='light' expand='lg'>
        <Navbar.Brand>SUyT-VIZ Versión 1.0</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <NavDropdown title='Cambiar Escenario' id='basic-nav-dropdown'>
              <NavDropdown.Item>Escenario 1</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavbarLy;
