import logo from "../../logo.svg";
import classes from "./Navbar.module.css";

const Navbar = () => {
  return (
    <header>
      <div className={classes.wrraper}>
        <img src={logo} className={classes.appLogo} alt="logo" />
        <h3 className="text-[#e4b21e] font-extrabold text-3xl">
          OPERATION TEAM
        </h3>
      </div>
    </header>
  );
};

export default Navbar;
