import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import HomePage from "../page/HomePage";
import ProfilePage from "../page/ProfilePage";
import RatingPage from "../page/RatingPage";
import GamePage from "../page/GamePage";
import { dolls, tops, bottoms } from '../data/clothes';
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "rating", element: <RatingPage /> },
      { path: "game", element: <GamePage dolls={dolls} tops={tops} bottoms={bottoms}/> },
    ],
  },
]);

export default appRouter;
