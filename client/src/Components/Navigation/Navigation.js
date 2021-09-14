import React, { useState } from "react";

// LOCAL IMPORTS
import "./Navigation.css";
import Navdropdown from "../Navdropdown/Navdropdown.js";

// FONT AWESOME IMPORTS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faCaretDown } from "@fortawesome/free-solid-svg-icons";

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==

export default function Navigation(props) {
  // STATE VARIABLES
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <a href="/" className="logo-item">
        Cal-Counter 9000
      </a>
      {props.user ? (
        <div>
          <button
            className="nav-user"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
          >
            <h2 className="nav-user-username">{props.user.username}</h2>
            <FontAwesomeIcon
              className="nav-user-pic"
              icon={faUserCircle}
              size="3x"
            />
            <FontAwesomeIcon
              icon={faCaretDown}
              size="2x"
              className={dropdownOpen ? "expand-btn isdown" : "expand-btn"}
            />
          </button>
          {dropdownOpen === true ? (
            <Navdropdown
              isOpen={dropdownOpen}
              user={props.user}
              userLogout={() => {
                props.userLogout();
                setDropdownOpen(false);
              }}
            />
          ) : null}
        </div>
      ) : (
        <button className="nav-user" onClick={props.openModal}>
          <h2>Login</h2>
        </button>
      )}
    </nav>
  );
}
