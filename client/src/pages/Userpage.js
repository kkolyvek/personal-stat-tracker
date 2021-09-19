import React, { useState } from "react";

import "./Userpage.css";
import Userchart from "../Components/Chart/Userchart.tsx";
import Userdatainput from "../Components/Userdatainput/Userdatainput.js";

export default function Userpage() {
  // States for toggling data
  const [showCalories, setShowCalories] = useState(true);
  const [showWeight, setShowWeight] = useState(true);

  return (
    <div>
      <div className="pre-chart-wrapper">
        <div className="pre-chart-data-checkboxes-wrapper">
          <strong>Data: </strong>

          {/* CALORIES CHECKBOX */}
          <input
            type="checkbox"
            id="calories"
            checked={showCalories}
            onClick={() => {
              setShowCalories(!showCalories);
            }}
          />
          <label for="calories">Calories</label>

          {/* WEIGHT CHECKBOX */}
          <input
            type="checkbox"
            id="weight"
            checked={showWeight}
            onClick={() => {
              setShowWeight(!showWeight);
            }}
          />
          <label for="weight">Weight</label>
        </div>
      </div>
      <Userchart showCalories={showCalories} showWeight={showWeight} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "10em",
        }}
      >
        <div>
          <input type="date" />
        </div>
        {/* <Userdatainput /> */}
      </div>
    </div>
  );
}
