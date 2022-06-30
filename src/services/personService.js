import http from "./httpService";
import { environment } from "../settings";

const apiEndpoint = `${environment.apiUrl}/people`;

function personUrl(id) {
  return `${apiEndpoint}/${id}/`;
}

export function getPeople(sortColumn, currentPage, searchQuery) {
  const order = sortColumn && sortColumn.order === "desc" ? "-" : "";
  const column =
    sortColumn && sortColumn.path ? sortColumn.path : "created_date";
  const page = currentPage ? currentPage : 1;

  let urlQuery = `${apiEndpoint}/?ordering=${order}${column}&page=${page}`;

  if (searchQuery) urlQuery += `&search=${searchQuery}`;

  return http.get(urlQuery);
}

export function getPersonByFirstLastName(first_name, last_name) {
  return http.get(
    `${apiEndpoint}/?first_name=${first_name}&last_name=${last_name}`
  );
}

export function getPerson(personId) {
  return http.get(`${apiEndpoint}/?id=${personId}`);
}

export function getPeopleByName(searchText) {
  if (searchText)
    return http.get(
      `${apiEndpoint}/?search=${searchText}`
    );

  return http.get(`${apiEndpoint}/`);
}

export function savePerson(person) {
  if (!person.identification.trim()) delete person.identification;
  if (!person.church_id) delete person.church_id;
  if (!person.obrero_inicial) delete person.obrero_inicial;
  if (!person.obrero_exhortador) delete person.obrero_exhortador;
  if (!person.obrero_licenciado) delete person.obrero_licenciado;
  if (!person.min_licenciado) delete person.min_licenciado;
  if (!person.min_ordenado) delete person.min_ordenado;

  if (person.id) {
    const body = { ...person };
    delete body.id;
    return http.put(personUrl(person.id), body);
  }

  if (!person.church_id) delete person.church_id;

  return http.post(`${apiEndpoint}/`, person);
}

export function deletePerson(personId) {
  return http.delete(personUrl(personId));
}
