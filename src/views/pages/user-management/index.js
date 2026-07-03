import React, { useState } from "react";
import { Tabs, Card, Avatar, Descriptions, Divider, Col, Row, Tag } from "antd";
import dayjs from "dayjs";
import util from "../../../utils/util";

const { TabPane } = Tabs;

export default function UserDetail({ data }) {

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
                    data?.avatar || "https://via.placeholder.com/150"
                  }
                  style={{ border: "2px solid #eee" }}
                />
                <h3 style={{ marginTop: 12 }}>{data?.name || "N/A"}</h3>
                {/* <Tag color="blue">
                  {Object.entries(UserConstants?.gender || {}).find(
                    ([key, val]) => val === data?.gender
                  )?.[0] || "-"}
                </Tag> */}
              </Col>
              {/* Right Side: Details */}

              <Col span={16}>
                <Descriptions title="Basic Information" bordered column={2}>
                  <Descriptions.Item label="Email">
                    {data?.email || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mobile">
                    {data?.phone || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>

            </Row>
          </Card>
        </TabPane>
        <TabPane tab="Product Booking History" key="2">
          {/* <UserProductBooking user_id={data?._id} /> */}
        </TabPane>

      </Tabs>
    </div>
  );
}
