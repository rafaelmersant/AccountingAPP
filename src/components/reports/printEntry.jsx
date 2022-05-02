import React, { Component } from "react";
import { formatNumber } from "../../utils/custom";

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
      <div className="mt-1" style={{ width: "338px" }}>
        {entryHeader && (
          <div>
            <div className="text-center">
              <img
                width="140px"
                src={process.env.PUBLIC_URL + "/images/logocepasH50.png"}
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
                Concilio Evangelico Pentecostal
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
              <span className="font-receipt font-receipt-small-invoice">
                B No 3, V Duarte, Santo Domingo
              </span>
            </div>
            <div className="text-center">
              <span className="font-receipt font-receipt-small-invoice">
                809-594-3222
              </span>
            </div>
            <div className="text-center">
              <span className="font-receipt font-receipt-small-invoice">
                arcadesalvacion@gmail.com
              </span>
            </div>

            <div className="text-center">
              <span className="font-receipt font-receipt-small-invoice">
                RNC: 00001111111
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

            {entryHeader.person && (
              <span className="font-receipt font-receipt-small-invoice d-block">
                Obrero: {entryHeader.person.first_name}{" "}
                {entryHeader.person.last_name}
              </span>
            )}

            {entryHeader.person &&
              entryHeader.person.identification.length > 0 && (
                <span className="font-receipt font-receipt-small-invoice d-block">
                  Cédula:{" "}
                  {entryHeader.person && entryHeader.person.identification}
                </span>
              )}
          </div>
        )}

        <div className="d-block">
          <span className="d-block">
            ----------------------------------------------------
          </span>

          <div className="text-center">
            <span className="font-receipt font-receipt-small-2-invoice">
              {"RECIBO"}
            </span>
          </div>
        </div>

        {entryDetail.length && (
          <table>
            <thead>
              <tr key="h1">
                <td colSpan="2">
                  ----------------------------------------------------
                </td>
              </tr>
              <tr key="h2">
                <td style={{ cellSpacing: "10px" }}>
                  <span className="font-receipt">CONCEPTO</span>
                </td>
                <td className="text-right" style={{ cellSpacing: "10px" }}>
                  <span className="font-receipt">MONTO</span>
                </td>
              </tr>
              <tr key="h3">
                <td colSpan="2">
                  ----------------------------------------------------
                </td>
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
                    </td>
                    <td className="text-right">
                      <span className="font-receipt font-receipt-small-invoice">
                        {formatNumber(item.amount)}
                      </span>
                    </td>
                  </tr>

                  {/* <tr key={item.concept.id}>
                    <td className="text-right">
                      <span className="font-receipt font-receipt-small-invoice">
                        {formatNumber(item.amount)}
                      </span>
                    </td>
                  </tr> */}

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
                <td colSpan="2">
                  ----------------------------------------------------
                </td>
              </tr>
              <tr key="f5">
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
      </div>
    );
  }
}

export default PrintEntry;
