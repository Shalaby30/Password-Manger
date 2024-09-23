import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


function App() {
  const router = createBrowserRouter([
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
