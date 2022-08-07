import React, { Component } from "react";
import { formatNumber, getMonthName } from "../../utils/custom";

class PrintEntry extends Component {
  render() {
    const { entryHeader, entryDetail } = this.props;

    if (entryHeader) {
      var _date = Date.parse(entryHeader.created_date);
      var entryDate = new Date(_date);
    }

    console.log("entryHeader", entryHeader);
    console.log("entryDetail", entryDetail);

    return (
      <div style={{ width: "378px" }}>
        {entryHeader && (
          <div>
            <div className="text-center">
              <img
                width="140px"
                src={process.env.PUBLIC_URL + "/images/logocepasH50_small.png"}
                alt="CEPAS"
              />
            </div>
            <div className="text-center">
              <span
                style={{
                  fontFamily: "Calisto MT",
                  fontSize: "1.2em",
                  fontWeight: "normal",
                }}
              >
                Concilio Evangélico Pentecostal
              </span>
            </div>
            <div className="text-center">
              <span
                style={{
                  fontFamily: "Calisto MT",
                  fontSize: "1.3em",
                  fontWeight: "bold",
                }}
              >
                Arca de Salvación, INC.
              </span>
            </div>
            <div className="text-center">
              <span
                style={{
                  fontFamily: "Calisto MT",
                  fontSize: "1.0em",
                  fontWeight: "normal",
                }}
              >
                DECRETO 313-2000
              </span>
            </div>

            <div className="text-center">
              <span className="font-receipt font-receipt-small-invoice">
                C/Baltazar de los reyes #5 • Sto. Dgo.
              </span>
            </div>

            <div className="text-center">
              <span className="font-receipt font-receipt-small-invoice">
                Tel. 809-688-7461
              </span>
            </div>
            <div className="text-center">
              <span className="font-receipt font-receipt-small-invoice">
                concilioarcadesalvacion@gmail.com
              </span>
            </div>

            <div className="text-center mb-3">
              <span className="font-receipt font-receipt-small-invoice">
                RNC: 4-01-51549-2
              </span>
            </div>

            <span className="font-receipt font-receipt-small-invoice d-block">
              Fecha: {entryDate.toLocaleDateString("en-GB")}
              <span className="ml-2">
                Hora: {entryDate.toLocaleTimeString()}
              </span>
            </span>

            {entryHeader.church && (
              <span className="font-receipt font-receipt-small-invoice d-block">
                Iglesia: {entryHeader.church.global_title}
              </span>
            )}

            {entryHeader.church && entryHeader.church.shepherd && (
              <span className="font-receipt font-receipt-small-invoice d-block">
                Pastor(a): {entryHeader.church.shepherd.first_name}{" "}
                {entryHeader.church.shepherd.last_name}
              </span>
            )}

            {entryHeader.person && (
              <span className="font-receipt font-receipt-small-invoice d-block">
                Obrero: {entryHeader.person.first_name}{" "}
                {entryHeader.person.last_name}
              </span>
            )}

            {entryHeader.person &&
              !entryHeader.church &&
              entryHeader.person.church && (
                <span className="font-receipt font-receipt-small-invoice d-block">
                  iglesia: {entryHeader.person.church.global_title}
                </span>
              )}

            {entryHeader.person && entryHeader.person.identification &&
              entryHeader.person.identification.trim().length > 0 && (
                <span className="font-receipt font-receipt-small-invoice d-block">
                  Cédula:{" "}
                  {entryHeader.person && entryHeader.person.identification}
                </span>
              )}
          </div>
        )}

        <div className="d-block border-top-dashed border-bottom-dashed mt-2">
          <div className="text-center pt-1 pb-1">
            <span className="font-receipt font-receipt-small-2-invoice">
              {"RECIBO"}
            </span>
          </div>
        </div>

        {entryDetail.length && (
          <table style={{ width: "378px" }} className="mt-2">
            <thead>
              <tr key="header1">
                <td style={{ cellSpacing: "10px" }}>
                  <span className="font-receipt">CONCEPTO</span>
                </td>
                <td className="text-right" style={{ cellSpacing: "10px" }}>
                  <span className="font-receipt">MONTO</span>
                </td>
              </tr>
              <tr key="header2">
                <td colSpan="2" className="border-top-dashed pt-1"></td>
              </tr>
            </thead>
            <tbody>
              {entryDetail.map((item) => (
                <React.Fragment key={"F" + item.id}>
                  <tr key={"M" + item.id}>
                    <td>
                      <span className="font-receipt font-receipt-small-invoice">
                        {item.concept.description}
                      </span>
                      <span className="d-block">{getMonthName(item.period_month)}-{item.period_year}</span>
                    </td>
                    <td className="text-right">
                      <span className="font-receipt font-receipt-small-invoice">
                        {formatNumber(item.amount)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <span
                        className="font-receipt font-receipt-small-invoice"
                        style={{ color: "white", fontSize: "0.6em" }}
                      >
                        |
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              ))}

              <tr key="f1">
                <td colSpan="2" className="border-top-dashed pt-1"></td>
              </tr>
              <tr key="f2">
                <td>
                  <span className="font-receipt font-receipt-big-invoice">
                    <b>TOTAL</b>
                  </span>
                </td>
                <td className="text-right">
                  <span className="font-receipt font-receipt-big-invoice">
                    <b>{formatNumber(entryHeader.total_amount)}</b>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <div className="mt-4">
          <span className="font-receipt font-receipt-small-F-invoice">
            No. Transacción:{" "}
          </span>
          <span className="font-receipt font-receipt-small-F-invoice">
            {entryHeader && entryHeader.id}
          </span>
        </div>
        <div>
          <span className="font-receipt font-receipt-small-F-invoice">
            Le antendió:{" "}
            {entryHeader &&
              entryHeader.created_by &&
              entryHeader.created_by.name}
          </span>
        </div>
        <div className="mt-4 text-center">GRACIAS!! DIOS LE BENDIGA!</div>
        <div
          className="mt-5 font-receipt-small-F-invoice"
          style={{ height: "55px", fontSize: "2px", fontFamily: "TimesNewRoman" }}
        >
          #cepas#
        </div>
      </div>
    );
  }
}

export default PrintEntry;