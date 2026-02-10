import apiClient from "./client";
export async function isUsernameAvailable(username) {
    const res = await apiClient.get("/check-username", {
        params: { username },
    });
    return res.data.available;
}
