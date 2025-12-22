const usernameRegex =
  /^(?![._])(?!.*[._]{2})[a-zA-Z0-9._]{3,20}(?<![._])$/;

export default function validateUsername(username: string): boolean {
  if (!username) return false;
  if (username.length < 3 || username.length > 20) return false;

  return usernameRegex.test(username);
}

