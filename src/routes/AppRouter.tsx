import { createBrowserRouter } from "react-router";
import HomePage from "../page/HomePage";
import GamePage from "../page/Gamepage";
import ProfilePage from "../page/ProfilePage";
import RatingPage from "../page/RatingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/GamePage",
    element: <GamePage/>,
  },
   {
    path: "/ProfilePage",
    element: <ProfilePage/>,
  },
   {
    path: "/RatingPage",
    element: <RatingPage/>,
  },
]);

export default router;
