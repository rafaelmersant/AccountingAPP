import { getCurrentUser } from "../../services/authService";

export function mapToViewEntryHeader(entryHeader) {
  return {
    id: entryHeader.id,
    church_id: entryHeader.church ? entryHeader.church.id : "",
    church: entryHeader.church,
    person_id: entryHeader.person ? entryHeader.person.id : "",
    person: entryHeader.person,
    note: entryHeader.note ? entryHeader.note : "",
    period_year: entryHeader.period_year,
    period_month: entryHeader.period_month,
    total_amount: entryHeader.total_amount,
    created_by: entryHeader.created_by
      ? entryHeader.created_by.id
      : getCurrentUser().id,
    created_date: entryHeader.created_date,
  };
}

export function mapToViewEntryDetail(entryDetail) {
  let details = [];
  for (const item of entryDetail) {
    details.push({
      id: item.id,
      entry_id: item.entry.id,
      concept_id: item.concept.id,
      concept: item.concept.description,
      reference: item.reference,
      type: item.type,
      amount: item.amount,
    });
  }

  return details;
}
