import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import getPrice, { symbolMap } from "../utils/crypto-price";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { getBestOffer } from "../redux/pifSlice";
import Button from "react-bootstrap/Button";
import CircularProgress from "@mui/material/CircularProgress";
import toastDefault from "../utils/toast";
import { sendEth } from "../utils/eth";
import { sendInwardResponse, getInwardInvoices } from "../redux/invoiceSlice";
function GenerateInvoice() {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice-001.pdf");
  });
}

class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPriceLoading: false,
      finalTotal: 0,
      pmethod: "",
      isDisable: true,
    };
  }

  componentDidMount(props) {
    if (this.props.info.status == "Paid") {
      this.setState({ pmethod: "paid" });
    }
    //this.setState({ isPriceLoading: true });
  }

  render() {
    return (
      <div className="mt-4">
        <Row>
          <Col md={this.props.inwardResponse ? 8 : 12} lg={this.props.inwardResponse ? 8 : 12}>
            <div id="invoiceCapture">
              <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                <div className="w-100">
                  <h6 className="fw-bold text-secondary mb-1">
                    Invoice #: {this.props.info.invoiceNumber || ""}
                  </h6>
                  <h6 className="fw-bold text-secondary mb-1">
                    Tag #: {this.props.info.invoiceTag || ""}
                  </h6>
                </div>
                <div className="text-end ms-4">
                  <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                  <h5 className="fw-bold text-secondary">
                    {" "}
                    {this.props.currency} {this.props.total}
                  </h5>
                </div>
              </div>

              <div className="p-4">
                <Row className="mb-4 ">
                  <Col md={4}>
                    <div className="fw-bold">Billed to:</div>
                    <div className="overflow-x-scroll select-text">
                      {this.props.info.billTo || ""}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="fw-bold">Billed From:</div>
                    <div className="overflow-x-scroll select-text">
                      {this.props.info.billFrom || ""}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="fw-bold mt-2">Date Of Issue:</div>
                    <div>{this.props.info.dateOfIssue || ""}</div>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col md={4}>
                    <div className="fw-bold">Accepts Payment In:</div>
                    <div>{this.props.info.acceptIn || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="fw-bold ">Payment Account Info:</div>
                    <div className="select-text">
                      {this.props.info.acceptInInfo || ""}
                    </div>
                  </Col>
                </Row>
                <Table className="mb-0">
                  <thead>
                    <tr>
                      <th>QTY</th>
                      <th>DESCRIPTION</th>
                      <th className="text-end">PRICE</th>
                      <th className="text-end">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.items.map((item, i) => {
                      return (
                        <tr id={i} key={i}>
                          <td style={{ width: "70px" }}>{item.quantity}</td>
                          <td>
                            {item.name} - {item.description}
                          </td>
                          <td className="text-end" style={{ width: "100px" }}>
                            {this.props.currency} {item.price}
                          </td>
                          <td className="text-end" style={{ width: "100px" }}>
                            {this.props.currency} {item.price * item.quantity}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <Table>
                  <tbody>
                    <tr>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: "100px" }}>
                        SUBTOTAL
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {this.props.currency} {this.props.subTotal}
                      </td>
                    </tr>
                    {this.props.taxAmmount != 0.0 && (
                      <tr className="text-end">
                        <td></td>
                        <td className="fw-bold" style={{ width: "100px" }}>
                          TAX
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          {this.props.currency} {this.props.taxAmmount}
                        </td>
                      </tr>
                    )}
                    {this.props.discountAmmount != 0.0 && (
                      <tr className="text-end">
                        <td></td>
                        <td className="fw-bold" style={{ width: "100px" }}>
                          DISCOUNT
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          {this.props.currency} {this.props.discountAmmount}
                        </td>
                      </tr>
                    )}
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: "100px" }}>
                        TOTAL
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {this.props.currency} {this.props.total}
                      </td>
                    </tr>
                  </tbody>
                </Table>
                {this.props.info.notes && (
                  <div className="bg-light py-3 px-4 rounded">
                    {this.props.info.notes}
                  </div>
                )}
              </div>
            </div>
            <div className="pb-4 px-4">
              <Row>
                <Col md={6}>{this.props.info?.inwardResponse?.receiipt ?  `Payment Receipt: ${this.props.info.inwardResponse?.receiipt}` : "" }</Col>
                <Col md={6} className="flex">
                  <div className="flex-1"></div>
                  <div
                    className="dbutton p-2 px-4 active:scale-90 cursor-pointer"
                    onClick={GenerateInvoice}
                  >
                    Download Copy
                  </div>
                </Col>
              </Row>
            </div>
            <hr className="mt-4 mb-3" />
          </Col>
          {this.props.inwardResponse && <Col md={4} lg={3}>
            <div className="mb-3">
              <Form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (this.state.pmethod == "ETH") {
                      this.setState({ isPriceLoading: true, isDisable: true });
                      const hash = await sendEth(
                        this.state.finalTotal,
                        this.props.info.acceptInInfo
                      );
                      await this.props.dispatch(
                        sendInwardResponse({
                          recordId: this.props.info.recordId,
                          receiipt: `TX Hash ${hash}`,
                          recipientDid: this.props.info.billFrom,
                        })
                      );
                      this.setState({
                        isPriceLoading: false,
                        finalTotal: 0,
                        pmethod: "paid",
                      });
                      this.props.dispatch(getInwardInvoices());
                    }
                  } catch (e) {
                    this.setState({ isPriceLoading: false, isDisable: false });
                  }
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Pay In:</Form.Label>
                  <Form.Select
                    disabled={this.state.pmethod == "paid"}
                    className="btn btn-light my-1"
                    aria-label="Change Currency"
                    onChange={async (event) => {
                      const pmethod = event.target.value;
                      if (pmethod == "") {
                        this.setState({
                          pmethod: "",
                          isDisable: true,
                          finalTotal: 0,
                        });
                        return;
                      }
                      if (pmethod == this.props.info.acceptIn) {
                        this.setState({ isPriceLoading: true });
                        toastDefault(`Fetching current ${pmethod} price.`);
                        const p = await getPrice(
                          symbolMap[this.props.currency],
                          pmethod
                        );
                        const ft = parseFloat(parseFloat(this.props.total) / p);
                        this.setState({
                          isPriceLoading: false,
                          finalTotal: ft,
                          isDisable: false,
                          pmethod,
                        });
                      } else {
                        this.setState({
                          isPriceLoading: true,
                          isDisable: true,
                        });
                        await this.props.dispatch(
                          getBestOffer({
                            payinCurrency: pmethod,
                            payoutCurrency: this.props.acceptIn,
                          })
                        );
                        this.setState({ isPriceLoading: false });
                      }
                    }}
                  >
                    <option value="">Select Method</option>
                    <option value="BTC">BTC (Bitcoin)</option>
                    <option value="ETH">ETH (Ethereum)</option>
                  </Form.Select>
                  <Button
                    variant="primary"
                    type="submit"
                    className="dbutton d-block w-100 active:scale-90 mt-2"
                    disabled={this.state.isDisable}
                  >
                    {this.state.isPriceLoading ? (
                      <CircularProgress size={24} className="text-white" />
                    ) : this.state.pmethod == "paid" ? (
                      "Already Paid"
                    ) : this.state.isDisable ? (
                      "Change pair to send"
                    ) : (
                      `Send ${this.state.finalTotal} ${this.state.pmethod}`
                    )}
                  </Button>
                </Form.Group>
              </Form>
            </div>
          </Col>}
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const did = state.did;
  return {
    did,
  };
}

export default connect(mapStateToProps)(InvoiceModal);
