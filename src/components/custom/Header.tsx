import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const { isSignedIn } = useUser();
  return (
    <header className="header">
      <NavLink to={"/"}>
        <h1 className="landing__logo">
          ResumeBuilder
        </h1>
      </NavLink>

      {isSignedIn ? (
        <div className="header-btns">
          <Link
            to={"/dashboard"}
            className="header-btn"
          >
            dashboard
          </Link>
          <UserButton />
        </div>
      ) : (
        <Link to={"/auth/sign-in"} className="header-btn">
          get started
        </Link>
      )}
    </header>
  );
};

export default Header;
