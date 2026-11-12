import React from "react";
import { formatNumber } from "../../utils/custom";

const actions = { added: "Concepto agregado", updated: "Modificación", deleted: "Eliminación" };
const methods = { E: "Efectivo", D: "Depósito", C: "Cheque", R: "Retenido" };

function visibleChanges(event) {
  if (event.concept && (event.action === "added" || event.action === "deleted")) {
    const side = event.action === "added" ? "new" : "old";
    const conceptChange = event.changes.find(change => change.field === "concept");
    const amountChange = event.changes.find(change => change.field === "amount");
    const concept = conceptChange ? valueText(conceptChange[side], "concept") : event.concept;
    const amount = amountChange ? valueText(amountChange[side], "amount") : "Sin valor";
    return [{
      field: "concept",
      label: "Concepto",
      old: null,
      new: `Concepto: ${concept}\nMonto: ${amount}`,
    }];
  }
  return event.changes;
}

function valueText(value, field) {
  if (value === null || value === undefined || value === "") return "Sin valor";
  if (typeof value === "object") return value.name;
  if (field === "amount" || field === "total_amount") return formatNumber(value);
  if (field === "method") return methods[value] || value;
  if (field === "type") return value === "E" ? "Entrada" : value === "S" ? "Salida" : value;
  if (field === "period_month") return new Date(2026, Number(value) - 1, 1).toLocaleString("es-DO", { month: "long" });
  return String(value);
}

export default function EntryHistoryModal({ entryId, history, loading, error, onRetry }) {
  return (
    <div className="modal fade" id="entryHistoryModal" tabIndex="-1" role="dialog" aria-labelledby="entryHistoryTitle" aria-hidden="true">
      <div className="modal-dialog modal-xl" role="document" style={{ maxWidth: "1100px" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="entryHistoryTitle">Histórico del registro No. {entryId}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>
          </div>
          <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {loading && <p role="status">Cargando histórico...</p>}
            {error && <div role="alert" className="alert alert-danger">No se pudo cargar el histórico. <button type="button" className="btn btn-link" onClick={onRetry}>Reintentar</button></div>}
            {!loading && !error && history.length === 0 && <p>No hay cambios registrados.</p>}
            {!loading && !error && history.length > 0 && (
              <div className="table-responsive">
                <table className="table table-sm table-bordered table-striped mb-0">
                  <thead className="thead-light">
                    <tr><th>Fecha de modificación</th><th>Usuario</th><th>Concepto</th><th>Acción</th><th>Campo</th><th>Valor anterior</th><th>Valor nuevo</th></tr>
                  </thead>
                  <tbody>
                    {history.map(event => visibleChanges(event).map(change => (
                      <tr key={`${event.id}-${change.field}`}>
                        <td>{new Date(event.changed_at).toLocaleString("es-DO", { timeZone: "America/Santo_Domingo", dateStyle: "short", timeStyle: "medium" })}</td>
                        <td>{event.actor_name}</td>
                        <td>{event.concept || "Datos del registro"}</td>
                        <td>{actions[event.action] || event.action}</td>
                        <td>{change.label}</td>
                        <td style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{valueText(change.old, change.field)}</td>
                        <td style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{valueText(change.new, change.field)}</td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-footer"><button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button></div>
        </div>
      </div>
    </div>
  );
}
