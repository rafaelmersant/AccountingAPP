import http from "./httpService";
import { environment } from "../settings";

const apiEndpointHeader = `${environment.apiUrl}/entries`;

function entryHeaderUrl(id) {
  return `${apiEndpointHeader}/${id}/`;
}

function entryDetailUrl(entryId, id) {
  return `${entryHeaderUrl(entryId)}items/${id}/`;
}

function entryItemsUrl(id) {
  return `${apiEndpointHeader}/${id}/items/`
}

export function getEntriesHeader(
  entryId,
  churchId,
  personId,
  currentPage,
  sortColumn
) {
  const order = sortColumn && sortColumn.order === "desc" ? "-" : "";
  const column =
    sortColumn && sortColumn.path ? sortColumn.path : "created_date";
  const page = currentPage ? currentPage : 1;

  let urlQuery = `${apiEndpointHeader}/?ordering=${order}${column}&page=${page}`;

  if (entryId) urlQuery += `&id=${entryId}`;
  if (churchId) urlQuery += `&church_id=${churchId}`;
  if (personId) urlQuery += `&person_id=${personId}`;
  
  return http.get(urlQuery);
}

export function getEntryHeaderByRange(start_date, end_date) {
  return http.get(
    `${apiEndpointHeader}/?start_date=${start_date}&end_date=${end_date}&ordering=-created_date`
  );
}

export function getEntryHeaderByRangeDashboard(period_month, period_year) {
  return http.get(
    `${apiEndpointHeader}/?period_month=${period_month}&period_year=${period_year}&dashboard=yes`
  );
}

export function getEntryHeaderByRangeChurchesReport(period_month, period_year) {
  return http.get(
    `${environment.apiUrl}/churchesreport?period_month=${period_month}&period_year=${period_year}`
  );
}

export function getEntryHeader(entryId) {
  return http.get(
    `${apiEndpointHeader}/${entryId}`
  );
}

export function getEntryDetail(entryId) {
  return http.get(entryItemsUrl(entryId));
}

export function saveEntryHeader(entry) {
  delete entry.church;
  delete entry.person;

  if (!entry.church_id) delete entry.church_id;
  if (!entry.person_id) delete entry.person_id;

  if (entry.id) {
    const body = { ...entry };
    delete body.id;
    return http.put(entryHeaderUrl(entry.id), body);
  }

  return http.post(`${apiEndpointHeader}/`, entry);
}

export function saveEntryDetail(item) {
  if (item.id) {
    const body = { ...item };
    delete body.id;
    return http.put(entryDetailUrl(item.entry_id, item.id), body);
  }

  return http.post(entryItemsUrl(item.entry_id), item);
}

export function deleteEntryHeader(id) {
  return http.delete(entryHeaderUrl(id));
}

export function deleteEntryDetail(entryId, id) {
  return http.delete(entryDetailUrl(entryId, id));
}
