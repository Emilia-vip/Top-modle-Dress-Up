import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import HomePage from "../page/HomePage";
import ProfilePage from "../page/ProfilePage";
import RatingPage from "../page/RatingPage";
import GamePage from "../page/GamePage";

export default function appRouter(data) {
  const { dolls, tops, bottoms } = data;

  return createBrowserRouter([
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
}
