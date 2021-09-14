import "./Splashpage.css";
import pic from '../../assets/E3zG31FXoAcBVNu.jpg'

// FONT AWESOME IMPORTS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

export default function Splashpage(props) {
  return (
    <main className="main-wrapper">
      <div className="hook-wrapper">
        The tool to track those training totals.
      </div>
      <div className="description-wrapper">
        You know what? It is beets. I've crashed into a beet truck. They're
        using our own satellites against us. And the clock is ticking. Must go
        faster... go, go, go, go, go! We gotta burn the rain forest, dump toxic
        waste, pollute the air, and rip up the OZONE! 'Cause maybe if we screw
        up this planet enough, they won't want it anymore!
      </div>
      <div className="img-wrapper">
        <div style={{ position: "relative" }}>
          <p className="flavor-text left">First do this!</p>
          <img className="intro-img" src="https://www.placecage.com/400/220" />
        </div>
        <div style={{ position: "relative" }}>
          <p className="flavor-text right">Then try this!</p>
          <img className="intro-img" src="https://www.fillmurray.com/400/220" />
        </div>
      </div>
      <div className="button-wrapper">
        <button
          className="create-account-button"
          onClick={() => {
            props.setTabSignup();
            props.openModal();
          }}
        >
          Create an Account
          <FontAwesomeIcon icon={faCaretRight} style={{ marginLeft: "10px" }} />
        </button>
        <button
          className="log-into-account-button"
          onClick={() => {
            props.setTabLogin();
            props.openModal();
          }}
        >
          or log in
        </button>
      </div>
    </main>
  );
}
