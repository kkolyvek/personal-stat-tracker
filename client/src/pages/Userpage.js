import React, { useState, useEffect } from "react";

import "./Userpage.css";
import Userchart from "../Components/Chart/Userchart.tsx";
import Userdatainput from "../Components/Userdatainput/Userdatainput.js";

export default function Userpage(props) {
  // States for toggling data
  const [showCalories, setShowCalories] = useState(true);
  const [showWeight, setShowWeight] = useState(true);

  return (
    <div className="user-content-wrapper">
      <div className="user-content">
        <div className="user-data">
          <div className="chart-tools">
            <div className="chart-timescale-togglers">
              7D 1M 1Y MAX
            </div>
            <div className="chart-data-togglers">
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
          <Userchart
            showCalories={showCalories}
           showWeight={showWeight}
          />
        </div>
        <div className="user-input">
          <Userdatainput />
        </div>
      </div>
    </div>
  );
}