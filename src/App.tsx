import { Navigate, Outlet } from "react-router-dom";
import "./App.css";
import { UserButton, useUser } from "@clerk/clerk-react";

function App() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isSignedIn && isLoaded) return <Navigate to={"/auth/sign-in"} />;

  return (
    <>
      <UserButton />
      <Outlet />
    </>
  );
}

export default App;
