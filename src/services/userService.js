import http from "./httpService";
import { environment } from "../settings";

const apiEndpoint = `${environment.apiUrl}/users`;

function userUrl(id) {
  return `${apiEndpoint}/${id}/`;
}

export function getUsers() {
  return http.get(`${apiEndpoint}/`);
}

export function getUser(userId) {
  return http.get(`${apiEndpoint}/?id=${userId}`);
}

export function getUserByEmail(email) {
  return http.get(`${apiEndpoint}/?email=${email}`);
}

export function getEmailExists(email) {
  return http.get(`${apiEndpoint}/?email=${email}`);
}

export function saveUser(user) {
  if (user.id) {
    const body = { ...user };
    delete body.id;
    return http.put(userUrl(user.id), body);
  }

  return http.post(`${apiEndpoint}/`, user);
}

export function deleteUser(userId) {
  return http.delete(userUrl(userId));
}

export function register(user) {
  return http.post(`${apiEndpoint}/`, {
    email: user.username,
    password: user.password,
    name: user.name
  });
}
