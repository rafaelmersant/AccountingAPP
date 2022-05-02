import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = `${apiUrl}/churches`;

function churchUrl(id) {
  return `${apiEndpoint}/${id}/`;
}

export function getChurches() {
  return http.get(`${apiEndpoint}/`);
}

export function getChurch(churchId) {
  return http.get(`${apiEndpoint}/?id=${churchId}`);
}

export function getChurchesByName(searchText) {
  if (searchText)
    return http.get(
      `${apiEndpoint}/?search=${searchText}`
    );

  return http.get(`${apiEndpoint}/`);
}

export function saveChurch(church) {
  if (!church.shepherd_id) delete church.shepherd_id;
  if (!church.local_title) delete church.local_title;
  if (!church.location) delete church.location;
  
  if (church.id) {
    const body = { ...church };
    delete body.id;
    return http.put(churchUrl(church.id), body);
  }

  return http.post(`${apiEndpoint}/`, church);
}

export function deleteChurch(churchId) {
  return http.delete(churchUrl(churchId));
}
