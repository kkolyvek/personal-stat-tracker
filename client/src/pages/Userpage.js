import React, { useState } from "react";

import "./Userpage.css";
import Userchart from "../Components/Chart/Userchart.tsx";
import Userdatainput from "../Components/Userdatainput/Userdatainput.js";

export default function Userpage(props) {
  // States for toggling time scale
  const [timeScale, setTimeScale] = useState('max');
  // States for toggling data
  const [showCalories, setShowCalories] = useState(true);
  const [showWeight, setShowWeight] = useState(true);

  return (
    <div className="user-content-wrapper">
      <div className="user-content">
        <div className="user-data">
          <div className="chart-tools">
            <div className="chart-timescale-togglers">
              <button className="timescale-toggler-button" onClick={() => setTimeScale('7d')}>7d</button>
              <button className="timescale-toggler-button" onClick={() => setTimeScale('1m')}>1m</button>
              <button className="timescale-toggler-button" onClick={() => setTimeScale('1y')}>1y</button>
              <button className="timescale-toggler-button" onClick={() => setTimeScale('max')}>Max</button>
            </div>
            <div className="chart-data-togglers">
              <strong>Data: </strong>
              {/* CALORIES CHECKBOX */}
              <input
                type="checkbox"
                className="chart-data-toggler-checkbox"
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
                className="chart-data-toggler-checkbox"
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
            timeScale={timeScale}
          />
        </div>
        <div className="user-input">
          <Userdatainput />
        </div>
      </div>
    </div>
  );
}