import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Spin,
  Alert,
  Typography,
  Tag,
  Space,
  Button,
  Input,
  Select,
  Drawer,
  Progress,
  Tooltip,
  Skeleton,
  Empty,
  message,
} from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  AlertOutlined,
  ArrowUpOutlined,
  ReloadOutlined,
  SearchOutlined,
  CopyOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import DashboardService from "../../services/dashboard"; // Adjust path as needed

const { Title, Text } = Typography;
const { Option } = Select;

// Auto-refresh interval choices (ms). "0" = off.
const REFRESH_OPTIONS = [
  { label: "Auto-refresh: Off", value: 0 },
  { label: "Every 30s", value: 30_000 },
  { label: "Every 1 min", value: 60_000 },
  { label: "Every 5 min", value: 300_000 },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true); // first load only
  const [refreshing, setRefreshing] = useState(false); // background refresh
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(0);
  const [search, setSearch] = useState("");
  const [activeCard, setActiveCard] = useState(null); // drawer target
  const [, forceTick] = useState(0); // re-render every second for "x seconds ago"

  const intervalRef = useRef(null);

  const fetchDashboardData = useCallback(async (isBackground = false) => {
    try {
      if (isBackground) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await DashboardService.getDashboard();

      if (response?.success) {
        setData(response?.data?.data || response?.data);
        setError(null);
        setLastUpdated(new Date());
      } else {
        setError(response?.message || "Failed to load dashboard data.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  // Auto-refresh
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => fetchDashboardData(true), refreshInterval);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [refreshInterval, fetchDashboardData]);

  // Tick every second so "Updated Xs ago" stays live
  useEffect(() => {
    const tick = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  const handleManualRefresh = () => {
    fetchDashboardData(true);
    message.success("Dashboard refreshed", 1.2);
  };

  const handleCopySummary = () => {
    if (!data) return;
    navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
    message.success("Summary copied to clipboard", 1.2);
  };

  const secondsAgo = lastUpdated ? Math.max(0, Math.floor((Date.now() - lastUpdated.getTime()) / 1000)) : null;
  const updatedLabel =
    secondsAgo === null
      ? ""
      : secondsAgo < 5
      ? "just now"
      : secondsAgo < 60
      ? `${secondsAgo}s ago`
      : `${Math.floor(secondsAgo / 60)}m ago`;

  if (loading) {
    return (
      <div style={{ padding: 24, background: "#f5f7fa", minHeight: "100vh" }}>
        <Skeleton active paragraph={{ rows: 1 }} style={{ marginBottom: 24 }} />
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card bordered={false} style={cardStyle}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => fetchDashboardData(false)}>
              Retry
            </Button>
          }
        />
      </div>
    );
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

  const completedOrders = Math.max(totalOrders - pendingOrders, 0);
  const approvedVendors = Math.max(totalVendors - pendingVendors, 0);
  const orderFulfillmentPct = totalOrders ? Math.round((completedOrders / totalOrders) * 100) : 0;
  const vendorApprovalPct = totalVendors ? Math.round((approvedVendors / totalVendors) * 100) : 0;

  // KPI card definitions — data-driven so search/filter + drawer drill-down work generically
  const kpiCards = [
    {
      key: "revenue",
      title: "Total Revenue",
      value: totalRevenue,
      prefix: "₹",
      color: "#059669",
      bg: "#ecfdf5",
      icon: <DollarOutlined />,
      sub: (
        <>
          Avg. Order Value: <Text strong>₹{averageOrderValue.toLocaleString()}</Text>
        </>
      ),
      drawer: {
        description: "Revenue collected across all completed and in-progress orders.",
        rows: [
          { label: "Total revenue", value: `₹${Number(totalRevenue).toLocaleString()}` },
          { label: "Average order value", value: `₹${Number(averageOrderValue).toLocaleString()}` },
          { label: "Today's revenue", value: `₹${Number(todayRevenue).toLocaleString()}` },
        ],
      },
    },
    {
      key: "orders",
      title: "Total Orders",
      value: totalOrders,
      color: "#2563eb",
      bg: "#eff6ff",
      icon: <ShoppingOutlined />,
      sub: (
        <>
          Pending Fulfillment: <Text type="warning">{pendingOrders}</Text>
        </>
      ),
      progress: { percent: orderFulfillmentPct, label: "Fulfilled" },
      drawer: {
        description: "Breakdown of order fulfillment status.",
        rows: [
          { label: "Total orders", value: totalOrders },
          { label: "Completed / dispatched", value: completedOrders },
          { label: "Pending fulfillment", value: pendingOrders },
          { label: "Fulfillment rate", value: `${orderFulfillmentPct}%` },
        ],
      },
    },
    {
      key: "customers",
      title: "Total Customers",
      value: totalCustomers,
      color: "#7c3aed",
      bg: "#f5f3ff",
      icon: <UserOutlined />,
      sub: "Active Accounts",
      drawer: {
        description: "All registered customer accounts on the platform.",
        rows: [{ label: "Total customers", value: totalCustomers }],
      },
    },
    {
      key: "vendors",
      title: "Total Vendors",
      value: totalVendors,
      color: "#d97706",
      bg: "#fffbeb",
      icon: <ShopOutlined />,
      sub: (
        <>
          Pending Approvals:{" "}
          <Text type={pendingVendors > 0 ? "danger" : "secondary"}>{pendingVendors}</Text>
        </>
      ),
      progress: { percent: vendorApprovalPct, label: "Approved" },
      drawer: {
        description: "Breakdown of vendor approval status.",
        rows: [
          { label: "Total vendors", value: totalVendors },
          { label: "Approved", value: approvedVendors },
          { label: "Pending approval", value: pendingVendors },
          { label: "Approval rate", value: `${vendorApprovalPct}%` },
        ],
      },
    },
  ];

  const filteredCards = kpiCards.filter((c) =>
    c.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  const activeCardData = kpiCards.find((c) => c.key === activeCard);

  return (
    <div style={{ padding: "24px", background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header Section */}
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, color: "#1f2937" }}>
            Medical E-Commerce Overview
          </Title>
          <Text type="secondary">Real-time statistics for vendors, orders, and sales</Text>
        </div>

        <Space wrap>
          <Input
            allowClear
            placeholder="Filter metrics..."
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 180 }}
          />
          <Select
            value={refreshInterval}
            onChange={setRefreshInterval}
            style={{ width: 160 }}
            options={REFRESH_OPTIONS}
          />
          <Tooltip title="Refresh now">
            <Button
              icon={refreshing ? <SyncOutlined spin /> : <ReloadOutlined />}
              onClick={handleManualRefresh}
              loading={false}
            >
              Refresh
            </Button>
          </Tooltip>
          <Tooltip title="Copy raw summary as JSON">
            <Button icon={<CopyOutlined />} onClick={handleCopySummary} />
          </Tooltip>
          <Tag
            color="blue"
            style={{ padding: "4px 12px", borderRadius: "16px", fontSize: "13px" }}
          >
            {refreshInterval > 0 ? `Live · updated ${updatedLabel}` : `Updated ${updatedLabel}`}
          </Tag>
        </Space>
      </div>

      {/* Primary KPI Metrics */}
      {filteredCards.length === 0 ? (
        <Empty description="No metrics match your filter" style={{ margin: "48px 0" }} />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredCards.map((c) => (
            <Col xs={24} sm={12} lg={6} key={c.key}>
              <Card
                bordered={false}
                hoverable
                onClick={() => setActiveCard(c.key)}
                style={{ ...cardStyle, cursor: "pointer", transition: "transform 0.15s ease" }}
                bodyStyle={{ paddingBottom: c.progress ? 8 : 24 }}
              >
                <Statistic
                  title={c.title}
                  value={c.value}
                  prefix={c.prefix}
                  valueStyle={{ color: c.color, fontWeight: 600 }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>{c.sub}</div>
                {c.progress && (
                  <Progress
                    percent={c.progress.percent}
                    size="small"
                    strokeColor={c.color}
                    style={{ marginTop: 10 }}
                    format={(p) => `${p}% ${c.progress.label}`}
                  />
                )}
                <div style={{ ...iconStyle, color: c.color, background: c.bg }}>{c.icon}</div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

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
                <Text strong style={{ color: "#059669" }}>
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
                  <Text strong style={{ fontSize: 18, display: "block" }}>
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
              <div
                style={{ ...flexRow, cursor: "pointer" }}
                onClick={() => setActiveCard("orders")}
              >
                <Space>
                  <ClockCircleOutlined style={{ color: "#d97706" }} />
                  <Text>Pending Orders</Text>
                </Space>
                <Tag color="gold">{pendingOrders}</Tag>
              </div>
              <div
                style={{ ...flexRow, cursor: "pointer" }}
                onClick={() => setActiveCard("vendors")}
              >
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

      {/* Drill-down drawer */}
      <Drawer
        title={activeCardData?.title}
        open={!!activeCard}
        onClose={() => setActiveCard(null)}
        width={360}
      >
        {activeCardData && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Text type="secondary">{activeCardData.drawer.description}</Text>
            {activeCardData.progress && (
              <Progress
                type="circle"
                percent={activeCardData.progress.percent}
                strokeColor={activeCardData.color}
              />
            )}
            <div>
              {activeCardData.drawer.rows.map((r) => (
                <div
                  key={r.label}
                  style={{
                    ...flexRow,
                    padding: "10px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Text type="secondary">{r.label}</Text>
                  <Text strong>{r.value}</Text>
                </div>
              ))}
            </div>
          </Space>
        )}
      </Drawer>
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