import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Spin, Alert, Typography, Tag, Space } from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  AlertOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import DashboardService from "../../services/dashboard"; // Adjust path as needed

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      console.log("Fetching dashboard data...");

      const response = await DashboardService.getDashboard();

      console.log("Full API Response:", response);
      console.log("Response Data:", response?.data);
      console.log("Success:", response?.data?.success);
      console.log("Dashboard Data:", response?.data?.data);

      console.log("Response:", response);

      if (response?.success) {
        setData(response?.data?.data || response?.data);
      } else {
        console.warn("API returned success = false");
        console.warn("Response:", response?.data);
        setError(response?.message || "Failed to load dashboard data.");
      }
    } catch (err) {
      console.error("Dashboard API Error:", err);
      console.error("Error Response:", err?.response);
      console.error("Error Data:", err?.response?.data);

      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      console.log("Loading finished");
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

useEffect(() => {
  console.log("Dashboard state updated:", data);
}, [data]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" tip="Loading Dashboard..." />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const {
    totalOrders = 0,
    totalRevenue = 0,
    totalCustomers = 0,
    totalVendors = 0,
    pendingOrders = 0,
    totalProducts = 0,
    pendingVendors = 0,
    averageOrderValue = 0,
    todayOrders = 0,
    todayRevenue = 0,
  } = data || {};

  return (
    <div style={{ padding: "24px", background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={3} style={{ margin: 0, color: "#1f2937" }}>
            Medical E-Commerce Overview
          </Title>
          <Text type="secondary">Real-time statistics for vendors, orders, and sales</Text>
        </div>
        <Space>
          <Tag color="blue" style={{ padding: "4px 12px", borderRadius: "16px", fontSize: "13px" }}>
            Live Updates
          </Tag>
        </Space>
      </div>

      {/* Primary KPI Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle}>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix="₹"
              valueStyle={{ color: "#059669", fontWeight: 600 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
              Avg. Order Value: <Text bold>₹{averageOrderValue.toLocaleString()}</Text>
            </div>
            <DollarOutlined style={{ ...iconStyle, color: "#059669", background: "#ecfdf5" }} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle}>
            <Statistic
              title="Total Orders"
              value={totalOrders}
              valueStyle={{ color: "#2563eb", fontWeight: 600 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
              Pending Fulfillment: <Text type="warning">{pendingOrders}</Text>
            </div>
            <ShoppingOutlined style={{ ...iconStyle, color: "#2563eb", background: "#eff6ff" }} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle}>
            <Statistic
              title="Total Customers"
              value={totalCustomers}
              valueStyle={{ color: "#7c3aed", fontWeight: 600 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>Active Accounts</div>
            <UserOutlined style={{ ...iconStyle, color: "#7c3aed", background: "#f5f3ff" }} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle}>
            <Statistic
              title="Total Vendors"
              value={totalVendors}
              valueStyle={{ color: "#d97706", fontWeight: 600 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
              Pending Approvals: <Text type={pendingVendors > 0 ? "danger" : "secondary"}>{pendingVendors}</Text>
            </div>
            <ShopOutlined style={{ ...iconStyle, color: "#d97706", background: "#fffbeb" }} />
          </Card>
        </Col>
      </Row>

      {/* Secondary Details & Today's Summary */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Today's Performance" bordered={false} style={cardStyle}>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <div style={flexRow}>
                <Text type="secondary">Today's Orders</Text>
                <Tag color="blue" icon={<ArrowUpOutlined />}>
                  {todayOrders} Orders
                </Tag>
              </div>
              <div style={flexRow}>
                <Text type="secondary">Today's Revenue</Text>
                <Text bold style={{ color: "#059669" }}>
                  ₹{todayRevenue}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="Product Catalog" bordered={false} style={cardStyle}>
            <div style={flexRow}>
              <Space>
                <MedicineBoxOutlined style={{ fontSize: 24, color: "#0284c7" }} />
                <div>
                  <Text bold style={{ fontSize: 18, display: "block" }}>
                    {totalProducts}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Active Medical Products
                  </Text>
                </div>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="Action Required" bordered={false} style={cardStyle}>
            <Space direction="vertical" style={{ width: "100%" }} size="small">
              <div style={flexRow}>
                <Space>
                  <ClockCircleOutlined style={{ color: "#d97706" }} />
                  <Text>Pending Orders</Text>
                </Space>
                <Tag color="gold">{pendingOrders}</Tag>
              </div>
              <div style={flexRow}>
                <Space>
                  <AlertOutlined style={{ color: "#dc2626" }} />
                  <Text>Vendor Approvals</Text>
                </Space>
                <Tag color={pendingVendors > 0 ? "red" : "default"}>{pendingVendors}</Tag>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Dashboard;

// Reusable inline styles
const cardStyle = {
  borderRadius: "12px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
  position: "relative",
  overflow: "hidden",
};

const iconStyle = {
  position: "absolute",
  right: 20,
  top: 20,
  fontSize: 20,
  padding: 12,
  borderRadius: "50%",
};

const flexRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};