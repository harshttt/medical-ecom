import React from "react";
import { Tabs, Card, Descriptions, Tag } from "antd";
import dayjs from "dayjs";

const { TabPane } = Tabs;

export default function UserDetail({ data }) {
  const formatDate = (date) =>
    date ? dayjs(date).format("DD MMM YYYY, hh:mm A") : "N/A";

  const statusMap = {
    1: { text: "Active", color: "green" },
    0: { text: "Inactive", color: "red" },
  };

  const roleMap = {
    1: "Admin",
    2: "Manager",
    3: "Staff",
    4: "User",
  };

  return (
    <div style={{ marginTop: 5, padding: 0 }}>
      <Tabs defaultActiveKey="1" type="card">
        {/* Tab 1 - User Details */}
        <TabPane tab="User Details" key="1">
          <Card bordered style={{ margin: "auto", padding: 20 }}>
            {/* Name + Status together at top */}
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: 0, display: "inline-block", marginRight: 12 }}>
                {data?.name || "N/A"}
              </h2>
              <Tag color={statusMap[data?.status]?.color || "default"}>
                {statusMap[data?.status]?.text || "Unknown"}
              </Tag>
            </div>

            <Descriptions title="Basic Information" bordered column={2}>
              <Descriptions.Item label="Email">
                {data?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile">
                {data?.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {roleMap[data?.role] || data?.role || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusMap[data?.status]?.color || "default"}>
                  {statusMap[data?.status]?.text || "Unknown"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">
                {formatDate(data?.lastLoginAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {formatDate(data?.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {formatDate(data?.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                {data?._id || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        {/* Tab 2 - Product Booking History */}
        <TabPane tab="Product Booking History" key="2">
          {/* <UserProductBooking user_id={data?._id} /> */}
        </TabPane>
      </Tabs>
    </div>
  );
}