import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <h1>Hello from App</h1>
      <Outlet />
    </>
  );
}

export default App;
