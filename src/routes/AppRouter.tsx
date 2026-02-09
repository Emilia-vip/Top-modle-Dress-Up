import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import HomePage from "../page/HomePage";
import ProfilePage from "../page/ProfilePage";
import RatingPage from "../page/RatingPage";
import GamePage from "../page/GamePage";
import ScorePage from "../page/ScorePage";

export default function appRouter(data: any) {
  const { tops, bottoms } = data;

  return createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "", element: <HomePage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "rating", element: <RatingPage /> },
        { path: "score", element: <ScorePage /> },
        { path: "game", element: <GamePage tops={tops} bottoms={bottoms}/> },
      ],
    },
  ]);
}
