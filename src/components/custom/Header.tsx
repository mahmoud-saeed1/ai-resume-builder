import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";

// const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={800}
//     height={800}
//     viewBox="0 0 512 512"
//     {...props}
//   >
//     <title>{"ai"}</title>
//     <path
//       fill="#2563eb"
//       fillRule="evenodd"
//       d="M384 128v256H128V128h256Zm-148.25 64h-24.932l-47.334 128h22.493l8.936-25.023h56.662L260.32 320h23.847L235.75 192Zm88.344 0h-22.402v128h22.402V192Zm-101 21.475 22.315 63.858h-44.274l21.96-63.858ZM405.335 320H448v42.667h-42.667V320Zm-256 85.333H192V448h-42.667v-42.667Zm85.333 0h42.666V448h-42.666v-42.667ZM149.333 64H192v42.667h-42.667V64ZM320 405.333h42.667V448H320v-42.667ZM234.667 64h42.666v42.667h-42.666V64ZM320 64h42.667v42.667H320V64Zm85.333 170.667H448v42.666h-42.667v-42.666ZM64 320h42.667v42.667H64V320Zm341.333-170.667H448V192h-42.667v-42.667ZM64 234.667h42.667v42.666H64v-42.666Zm0-85.334h42.667V192H64v-42.667Z"
//     />
//   </svg>
// );

const Header = () => {
  const { isSignedIn } = useUser();
  return (
    <header className="header">
      <NavLink to={"/"} className="flex items-center">
        <img src="ai-logo.ico" alt="ResumeBuilder" width={40} height={40} />
        {/* <span className="w-10 h-10 overflow-hidden">
          
        <Logo className="header__logo" width={40} hanging={40}/>
        </span> */}
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
