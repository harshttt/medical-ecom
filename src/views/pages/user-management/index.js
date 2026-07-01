import React, { useState } from "react";
import { Tabs, Card, Avatar, Descriptions, Divider, Col, Row, Tag } from "antd";
import dayjs from "dayjs";
import util from "../../../utils/util";
import UserProductBooking from "./product-booking-history";
import AllSessionHistory from "./userSession-history/sessionHistory";
import UserPoojaBookingHistory from "./userPoojaBookingHistory/pooja-booking-history";
import UserLedger from "./Ledger/userLedger";

const { TabPane } = Tabs;

export default function UserDetail({ data }) {
  const [UserConstants, setUserConstants] = useState({
    gender: util.constants()?.USER?.GENDER || null,
  });
  return (
    <div bordered={false} style={{ marginTop: 5, padding: 0 }}>
      <Tabs defaultActiveKey="1" type="card">
        {/* Tab 1 */}
        <TabPane tab="User Details" key="1">
          <Card bordered style={{ margin: "auto", padding: 20 }}>
            <Row gutter={20} align="middle">
              {/* Left Side: Profile Image */}
              <Col span={8} style={{ textAlign: "center" }}>
                <Avatar
                  size={150}
                  src={
                    data?.profilePicture || "./images.png"
                  }
                  fallback="./images.png"
                  style={{ border: "2px solid #eee" }}
                />
                <h3 style={{ marginTop: 12 }}>{data?.name || "N/A"}</h3>
                <Tag color="blue">
                  {Object.entries(UserConstants?.gender || {}).find(
                    ([key, val]) => val === data?.gender
                  )?.[0] || "-"}
                </Tag>
              </Col>

              {/* Right Side: Details */}
              <Col span={16}>
                <Descriptions title="Basic Information" bordered column={2}>
                  <Descriptions.Item label="Email">
                    {data?.email || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mobile">
                    {data?.mobileNumber || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Birth Date">
                    {data?.birthDate
                      ? dayjs(data.birthDate).format("DD MMM YYYY")
                      : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Birth Time">
                    {data?.birthTime || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Birth Place" span={2}>
                    {data?.birthPlace || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </TabPane>

        {/* Tab 3 */}
        <TabPane tab="Product Booking History" key="3">
          <UserProductBooking user_id={data?._id} />
        </TabPane>

        {/* Tab 4 */}
        <TabPane tab="Transaction History" key="5">
         <UserLedger  userId={data?._id}/>
        </TabPane>
      </Tabs>
    </div>
  );
}
