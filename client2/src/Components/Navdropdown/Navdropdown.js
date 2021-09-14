import React from "react";
import { CSSTransition } from "react-transition-group";
import "./Navdropdown.css";

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==

export default function Navdropdown(props) {
  //   const [dropdownHeight, setDropdownHeight] = useState(0);
  //   const calcHeight = (element) => {
  //     const height = element.offsetHeight;
  //     setDropdownHeight(height);
  //   };

  return (
    <CSSTransition
      in={props.isOpen}
      unmountOnExit
      classNames="dropdown"
      timeout={{ enter: 0, exit: 300 }}
    >
      <div className="nav-dropdown">
        <div className="nav-dropdown-content-wrapper">
          <button
            className="nav-dropdown-btn"
            onClick={() => {
              window.location = `/${props.user.username}`;
            }}
          >
            <h4>Profile</h4>
          </button>
          <button
            className="nav-dropdown-btn"
            onClick={() => {
              props.userLogout();
            }}
          >
            <h4>Logout</h4>
          </button>
        </div>
      </div>
    </CSSTransition>
  );
}
