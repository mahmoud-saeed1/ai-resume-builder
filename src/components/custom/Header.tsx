import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const { isSignedIn } = useUser();
  return (
    <header>
      <NavLink to={"/"}>
        <img
          src="/public/Logo.svg"
          className="repeat-0"
          width={50}
          height={50}
          alt="logo"
        />
      </NavLink>

      {isSignedIn ? (
        <div className="header-btns">
          <Link
            to={"/dashboard"}
            className="bg-primary px-4 py-2 rounded-[5px] text-white font-bold tracking-wider capitalize"
          >
            dashboard
          </Link>
          <UserButton />
        </div>
      ) : (
        <Link to={"/auth/sign-in"} className="link-primary">
          get started
        </Link>
      )}
    </header>
  );
};

export default Header;
