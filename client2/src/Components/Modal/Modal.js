// FUNCTIONALITY IMPORTS
import React, { useState, useEffect } from "react";

// STYLE IMPORTS
import "./Modal.css";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Modal(props) {
  // variable states
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // submit login form
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const res = await props.userLogin({
      username: usernameInput,
      password: passwordInput,
    });

    if (res === true) {
      props.closeModal();
    }

    // clear inputs
    setUsernameInput("");
    setPasswordInput("");
  };

  // dismiss modal on 'esc' key event
  useEffect(() => {
    document.body.addEventListener("keydown", (e) => {
      if ((e.charCode || e.keyCode) === 27) {
        props.closeModal();
      }
    });
    // eslint-disable-next-line
  }, []);

  return (
    <CSSTransition
      in={props.visible}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div className="modal" onClick={props.closeModal}>
        <div
          className="modal-content"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button className="modal-dismiss-button" onClick={props.closeModal}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="modal-header">
            <button className="modal-title" onClick={props.setTabLogin}>
              <h4
                style={{
                  textDecoration:
                    props.activeTab === "login" ? "underline" : "none",
                }}
              >
                Log in
              </h4>
            </button>
            <button className="modal-title" onClick={props.setTabSignup}>
              <h4
                style={{
                  textDecoration:
                    props.activeTab === "signup" ? "underline" : "none",
                }}
              >
                Sign Up
              </h4>
            </button>
          </div>
          <CSSTransition
            in={props.activeTab === "login"}
            unmountOnExit
            timeout={300}
            classNames="modal-primary"
          >
            <div className="modal-body">
              <form className="login-form" onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  required
                  placeholder="username"
                  value={usernameInput}
                  onChange={(e) => {
                    e.preventDefault();
                    setUsernameInput(e.target.value);
                  }}
                  className="custom-login-signup-input"
                />
                <input
                  type="password"
                  required
                  placeholder="password"
                  value={passwordInput}
                  onChange={(e) => {
                    e.preventDefault();
                    setPasswordInput(e.target.value);
                  }}
                  className="custom-login-signup-input"
                />
                <input
                  type="submit"
                  value="Go!"
                  className="custom-submit-input"
                />
              </form>
            </div>
          </CSSTransition>

          <CSSTransition
            in={props.activeTab === "signup"}
            unmountOnExit
            timeout={300}
            classNames="modal-secondary"
          >
            <div className="modal-body">
              <form className="login-form" onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  required
                  placeholder="username"
                  value={usernameInput}
                  onChange={(e) => {
                    e.preventDefault();
                    setUsernameInput(e.target.value);
                  }}
                  className="custom-login-signup-input"
                />
                <input
                  type="password"
                  required
                  placeholder="password"
                  value={passwordInput}
                  onChange={(e) => {
                    e.preventDefault();
                    setPasswordInput(e.target.value);
                  }}
                  className="custom-login-signup-input"
                />
                <input
                  type="submit"
                  value="Go!"
                  className="custom-submit-input"
                />
              </form>
            </div>
          </CSSTransition>
        </div>
      </div>
    </CSSTransition>
  );
}
