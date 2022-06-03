//import jwtDecode from "jwt-decode";
import http from "./httpService";
import * as config from "../config.json";

const apiEndpoint = `${config.apiUrl}/auth`;
const token = {
  userId: "cepas_userId",
  username: "cepas_username",
  email: "cepas_email",
  name: "cepas_name",
  role: "cepas_role"
};

//http.setJwt(getJwt());

export async function login(credentials) {
  const { data: jwt } = await http.post(`${apiEndpoint}/login/`, credentials);

  localStorage.setItem(token.userId, jwt.id);
  localStorage.setItem(token.username, jwt.username);
  localStorage.setItem(token.email, jwt.email);
  localStorage.setItem(token.name, jwt.name);
  localStorage.setItem(token.role, jwt.role);
}

export function logout() {
  localStorage.removeItem(token.userId);
  localStorage.removeItem(token.username);
  localStorage.removeItem(token.email);
  localStorage.removeItem(token.name);
  localStorage.removeItem(token.role);
}

export function getCurrentUser() {
  try {
    if (!localStorage.getItem(token.username)) return null;

    return {
      id: parseInt(localStorage.getItem(token.userId)),
      name: localStorage.getItem(token.name),
      username: localStorage.getItem(token.username),
      email: localStorage.getItem(token.email),
      role: localStorage.getItem(token.role)
    };

    //jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

// export function getJwt() {
//   return localStorage.getItem(tokenKey);
// }

// export function loginWithJwt(jwt) {
//   localStorage.setItem(tokenKey, jwt);
// }

export default {
  login,
  logout,
  getCurrentUser
};
