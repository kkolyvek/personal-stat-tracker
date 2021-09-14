import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations.js";
import Auth from "../utils/auth.js";

// COMPONENTS
import Navigation from "../Components/Navigation/Navigation.js";
import Loadingbar from "../Components/Loadingbar/Loadingbar.js";
import Modal from "../Components/Modal/Modal.js";
import Mainpage from "./Mainpage.js";
import Userpage from "./Userpage.js";

// =====================================================================================

export default function Authwrapper() {
  // STATE VARIABLES
  const [visible, setVisible] = useState(false); // modal visibility
  const [activeModalTab, setActiveModalTab] = useState("login"); // initial modal tab
  const [loadingPercent, setLoadingPercent] = useState(0); // percentage for loading bar
  const [user, setUser] = useState(null); // logged in user
  const [token, setToken] = useState(null); // JWT

  // Check for login on initial load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("id_token");

    if (user && token) {
      setUser(user);
      setToken(token);
    }
  }, []);

  // VISUAL TOGGLERS
  const handleModalOpen = () => {
    setVisible(true);
  };

  const handleModalClose = () => {
    setVisible(false);
  };

  // LOGIN / SIGNUP / LOGOUT METHODS
  // eslint-disable-next-line
  const [login, { error, data }] = useMutation(LOGIN_USER);
  const handleLogIn = async (credentials) => {
    try {
      setLoadingPercent(30);
      const { data } = await login({
        variables: credentials,
      });

      setLoadingPercent(80);

      console.log(data);
      Auth.login(data.login.token, data.login.user);
      setUser(data.login.user);
      setToken(data.login.token);

      setLoadingPercent(100);
      // pause for the duration of the loading bar animation
      // eslint-disable-next-line
      const timer = setTimeout(() => {
        setLoadingPercent(0);
      }, 200);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  const handleLogOut = async () => {
    setLoadingPercent(80);
    Auth.logout();
    setUser(null);
    setToken(null);

    setLoadingPercent(100);
    // pause for the duration of the loading bar animation
    // eslint-disable-next-line
    const timer = setTimeout(() => {
      setLoadingPercent(0);
    }, 200);
  };

  return (
    <div>
      <Navigation
        user={user}
        openModal={handleModalOpen}
        userLogout={handleLogOut}
      />
      <Loadingbar loaded={loadingPercent} />
      <Modal
        visible={visible}
        openModal={handleModalOpen}
        closeModal={handleModalClose}
        userLogin={handleLogIn}
        activeTab={activeModalTab}
        setTabLogin={() => {
          setActiveModalTab("login");
        }}
        setTabSignup={() => {
          setActiveModalTab("signup");
        }}
      />
      <Router>
        <Switch>
          <Route exact path="/">
            <Mainpage
              handleModalOpen={handleModalOpen}
              setTabLogin={() => {
                setActiveModalTab("login");
              }}
              setTabSignup={() => {
                setActiveModalTab("signup");
              }}
            />
          </Route>
          <Route path="/:user">
            <Userpage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
