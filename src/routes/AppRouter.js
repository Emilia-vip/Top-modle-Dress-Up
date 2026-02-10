import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import HomePage from "../page/HomePage";
import ProfilePage from "../page/ProfilePage";
import RatingPage from "../page/RatingPage";
import GamePage from "../page/GamePage";
import ScorePage from "../page/ScorePage";
export default function appRouter(data) {
    const { tops, bottoms } = data;
    return createBrowserRouter([
        {
            path: "/",
            element: _jsx(AppLayout, {}),
            children: [
                { path: "", element: _jsx(HomePage, {}) },
                { path: "profile", element: _jsx(ProfilePage, {}) },
                { path: "rating", element: _jsx(RatingPage, {}) },
                { path: "score", element: _jsx(ScorePage, {}) },
                { path: "game", element: _jsx(GamePage, { tops: tops, bottoms: bottoms }) },
            ],
        },
    ]);
}
