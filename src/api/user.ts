//user.ts är som en specialiserad detektiv som har i uppgift att kolla namn pom den är tillgänglig.

//Detektiven lånar vårt apiClient (postkontoret vi byggde tidigare).
// Det betyder att när detektiven skickar brev, så sköts allt med "nycklar" och "kontrollanter" automatiskt i bakgrunden.
import apiClient from "./client";

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const res = await apiClient.get("/check-username", {
    params: { username },
  });

  return res.data.available;
}
