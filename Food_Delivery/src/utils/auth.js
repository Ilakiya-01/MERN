export function setToken(t) {
  localStorage.setItem("token", t);
}
export function getToken() {
  return localStorage.getItem("token");
}
export function parseJwt(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}
