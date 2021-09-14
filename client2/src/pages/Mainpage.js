import React from "react";
import Splashpage from "../Components/Splashpage/Splashpage.js";

export default function Mainpage(props) {
  return (
    <div>
      <Splashpage
        openModal={props.handleModalOpen}
        setTabLogin={props.setTabLogin}
        setTabSignup={props.setTabSignup}
      />
    </div>
  );
}
