import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = `${apiUrl}/churchs`;

function churchUrl(id) {
  return `${apiEndpoint}/${id}/`;
}

export function getChurchs() {
  return http.get(`${apiEndpoint}/`);
}

export function getChurch(churchId) {
  return http.get(`${apiEndpoint}/?id=${churchId}`);
}

export function saveChurch(church) {
  if (church.id) {
    const body = { ...church };
    delete body.id;
    return http.put(churchUrl(church.id), body);
  }

  if (!church.shepherd_id) delete church.shepherd_id;
  
  return http.post(`${apiEndpoint}/`, church);
}

export function deleteChurch(churchId) {
  return http.delete(churchUrl(churchId));
}
