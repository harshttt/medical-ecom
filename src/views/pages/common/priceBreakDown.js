import { Card, Col, Row, Tooltip, Divider } from "antd";
import {
  InfoCircleOutlined,
} from "@ant-design/icons";


function PriceBreakDown({ record, paymentConstants }) {
  return (
    <>
      <Card
        title="Payment Summary"
        bordered={false}
        style={{ marginTop: 1 }}
      >
        <Row>
          <Col span={12}>
            <p>Product Base Price</p>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            ₹{record?.base_price || 0}
          </Col>

          <Col span={12}>
            <p>Discount</p>
          </Col>
          <Col
            span={12}
            style={{ textAlign: "right", color: "green" }}
          >
            -{record?.totalDiscount || 0}
          </Col>

          {/* <Col span={12}>
            <p>Product Selling Total</p>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            ₹{record?.price_snapshot?.selling_price || 0}
          </Col> */}

          <Col span={12}>
            <p>Gst ({record?.price_snapshot?.gst_percent || 0}%)</p>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            + ₹{record?.totalGst || 0}
          </Col>

          <Col span={12}>
            <p>Sub Total</p>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            ₹{record?.subtotal || 0}
          </Col>








          <Col span={12}>
            <p>Payment Method</p>
          </Col>
          <Col
            span={12}
            style={{ textAlign: "right", color: "#4a3aff" }}
          >
            {Object.entries(paymentConstants?.METHOD || {}).find(
              ([key, val]) => val === record?.payment_method
            )?.[0] || "-"}
          </Col>

          <Col span={12}>
            <p>Payment Status</p>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {Object.entries(paymentConstants?.STATUS || {}).find(
              ([key, val]) => val === record?.payment_status
            )?.[0] || "-"}
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col span={12}>
            <h3>Total Payable</h3>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <h3>
              ₹{(record?.grandTotal || 0).toLocaleString("en-IN")}
            </h3>
          </Col>
        </Row>

      </Card>
    </>
  );
}

export default PriceBreakDown;