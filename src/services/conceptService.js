import http from "./httpService";
import * as config from "../config.json";

const apiEndpoint = `${config.apiUrl}/concepts`;

function conceptUrl(id) {
  return `${apiEndpoint}/${id}/`;
}

export function getConcepts() {
  return http.get(`${apiEndpoint}/`);
}

export function getConcept(conceptId) {
  return http.get(`${apiEndpoint}/?id=${conceptId}`);
}

export function getConceptsByName(searchText) {
  if (searchText)
    return http.get(
      `${apiEndpoint}/?search=${searchText}`
    );

  return http.get(`${apiEndpoint}/`);
}

export function saveConcept(concept) {
  if (concept.id) {
    const body = { ...concept };
    delete body.id;
    return http.put(conceptUrl(concept.id), body);
  }

  return http.post(`${apiEndpoint}/`, concept);
}

export function deleteConcept(conceptId) {
  return http.delete(conceptUrl(conceptId));
}
