import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import HomePage from "../page/HomePage";
import ProfilePage from "../page/ProfilePage";
import RatingPage from "../page/RatingPage";
import GamePage from "../page/GamePage";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "rating", element: <RatingPage /> },
      { path: "game", element: <GamePage /> },
    ],
  },
]);

export default appRouter;
