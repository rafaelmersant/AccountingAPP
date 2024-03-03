import http from "./httpService";
import { environment } from "../settings";

const apiEndpoint = `${environment.apiUrl}/attendances`;

function attendanceUrl(id) {
  return `${apiEndpoint}/${id}/`;
}

export function getAttendances(sortColumn, currentPage) {
  const order = "-"; //sortColumn && sortColumn.order === "desc" ? "-" : "";
  const column =
    sortColumn && sortColumn.path ? sortColumn.path : "created_date";
  const page = currentPage ? currentPage : 1;

  let urlQuery = `${apiEndpoint}/?ordering=${order}${column}&page=${page}`;

  return http.get(urlQuery);
}

export function getAttendanceByPerson(personId, date) {
  return http.get(`${apiEndpoint}/?person_id=${personId}&attendance_date=${date}`);
}

export function saveAttendance(attendance) {
  if (attendance.id) {
    const body = { ...attendance };
    delete body.id;
    return http.put(attendanceUrl(attendance.id), body);
  }

  return http.post(`${apiEndpoint}/`, attendance);
}

export function deleteAttendance(attendanceId) {
  return http.delete(attendanceUrl(attendanceId));
}
