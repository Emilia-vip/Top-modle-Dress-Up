import { useContext } from "react";
import { AuthContext as LegacyAuthContext } from "../contexts/AuthContext";
import { AuthContext as Auth0Context } from "../Auth0/AuthContext";

export const useActiveAuth = () => {
  const legacy = useContext(LegacyAuthContext);
  const auth0 = useContext(Auth0Context);

  const activeUser = legacy.user ?? auth0.user ?? null;
  const hasLegacySession = Boolean(legacy.user);

  const logout = () => {
    legacy.logout();

    if (auth0.user && typeof auth0.logout === "function") {
      auth0.logout();
    }
  };

  return {
    user: activeUser,
    hasLegacySession,
    logout,
    auth0User: auth0.user,
  };
};
