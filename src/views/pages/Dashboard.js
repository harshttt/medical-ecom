import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Space,
  Tag,
  List,
  Badge,
  Button,
  Tabs,
  Table,
  Dropdown,
  Menu,
  Avatar,
  Divider,
  Statistic,
} from "antd";
import {
  UserOutlined,
  StarOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ReadOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  MedicineBoxOutlined,
  PercentageOutlined,
  ClockCircleOutlined,
  NotificationOutlined,
  CheckCircleOutlined,
  ShopOutlined,
  HeartOutlined,
  EyeOutlined,
  PlusOutlined,
  WarningOutlined,
  TrophyOutlined,
  GlobalOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SettingOutlined,
  ReloadOutlined,
  FilterOutlined,
  SearchOutlined,
  CalendarOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale
);

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Dashboard = () => {
  // Interactive state for real-time updates
  const [revenue, setRevenue] = useState(12458000);
  const [orders, setOrders] = useState(284);
  const [pendingOrders, setPendingOrders] = useState(18);
  const [inventoryAlert, setInventoryAlert] = useState(3);
  const [conversionRate, setConversionRate] = useState(3.8);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue(prev => prev + Math.floor((Math.random() - 0.3) * 150000));
      setOrders(prev => prev + Math.floor(Math.random() * 3) - 1);
      setPendingOrders(prev => Math.max(5, prev + Math.floor(Math.random() * 4) - 2));
      setInventoryAlert(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
      setConversionRate(prev => Number((prev + (Math.random() - 0.5) * 0.2).toFixed(1)));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Format currency in INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Enhanced chart data for medical equipment
  const salesChartData = useMemo(() => ({
    labels: ['Ventilators', 'Monitors', 'Surgical Kits', 'Diagnostic', 'Mobility', 'Consumables', 'Imaging'],
    datasets: [
      {
        label: 'Units Sold',
        data: [42, 68, 124, 87, 55, 210, 34],
        backgroundColor: ['#1a6b8a', '#2a8bb5', '#3ca0cc', '#5db4d9', '#7ec5e3', '#a0d5ed', '#c2e5f5'],
        borderRadius: 8,
        barThickness: 32,
      },
      {
        label: 'Revenue (₹ Lakhs)',
        data: [38, 52, 91, 44, 28, 63, 22],
        backgroundColor: ['#0d4a63', '#1a6b8a', '#2a8bb5', '#3ca0cc', '#5db4d9', '#7ec5e3', '#a0d5ed'],
        borderRadius: 8,
        barThickness: 32,
      }
    ],
  }), []);

  const pieData = useMemo(() => ({
    labels: ['Ventilators', 'Monitors', 'Surgical', 'Diagnostic', 'Mobility', 'Consumables', 'Imaging'],
    datasets: [{
      data: [19, 26, 31, 18, 12, 24, 8],
      backgroundColor: ['#0d4a63', '#1a6b8a', '#2a8bb5', '#3ca0cc', '#5db4d9', '#7ec5e3', '#a0d5ed'],
      borderWidth: 0,
    }]
  }), []);

  // Line chart for revenue trend
  const trendData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Revenue 2024',
      data: [65, 72, 88, 95, 102, 118, 125, 132, 140, 155, 168, 182],
      borderColor: '#1a6b8a',
      backgroundColor: 'rgba(26, 107, 138, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#1a6b8a',
    }]
  }), []);

  // Radar chart data
  const radarData = useMemo(() => ({
    labels: ['Quality', 'Price', 'Delivery', 'Support', 'Innovation'],
    datasets: [{
      label: 'Product Performance',
      data: [95, 82, 88, 91, 76],
      backgroundColor: 'rgba(26, 107, 138, 0.2)',
      borderColor: '#1a6b8a',
      pointBackgroundColor: '#1a6b8a',
    }]
  }), []);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        backgroundColor: '#0a2740',
        callbacks: {
          label: function(context) {
            return '₹' + context.parsed.y + ' Lakhs';
          }
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          callback: function(value) {
            return '₹' + value + 'L';
          }
        }
      },
      x: { grid: { display: false } }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { boxWidth: 12, font: { weight: '500', size: 12 } }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.label === 'Revenue (₹ Lakhs)') {
              return '₹' + context.parsed.y + ' Lakhs';
            }
            return context.parsed.y + ' units';
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          callback: function(value) {
            if (value >= 1000) return (value/1000) + 'k';
            return value;
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12, font: { size: 11 } } },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    },
    cutout: '65%',
  };

  // Enhanced stat cards for medical ecommerce
  const mainStats = [
    {
      icon: <WalletOutlined />,
      label: 'Revenue',
      value: formatINR(revenue),
      trend: '+12.4%',
      trendUp: true,
      color: '#1a6b8a',
      bg: '#e6f3f8'
    },
    {
      icon: <ShoppingOutlined />,
      label: 'Orders',
      value: orders,
      trend: '+8.1%',
      trendUp: true,
      color: '#2a8bb5',
      bg: '#eaf5f9'
    },
    {
      icon: <UserOutlined />,
      label: 'New Customers',
      value: '47',
      trend: '+21%',
      trendUp: true,
      color: '#3ca0cc',
      bg: '#eef7fa'
    },
    {
      icon: <PercentageOutlined />,
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      trend: '-0.6%',
      trendUp: false,
      color: '#5db4d9',
      bg: '#f2f8fc'
    },
    {
      icon: <ClockCircleOutlined />,
      label: 'Pending Orders',
      value: pendingOrders,
      trend: '-2',
      trendUp: false,
      color: '#e8913a',
      bg: '#fef5ea'
    },
    {
      icon: <WarningOutlined />,
      label: 'Low Stock Items',
      value: inventoryAlert,
      trend: 'urgent',
      trendUp: false,
      color: '#d9534f',
      bg: '#fde8e8'
    },
  ];

  // Recent orders data with INR
  const recentOrders = [
    { id: '#M-3421', customer: 'St. Mary\'s Hospital', items: 4, total: '₹12,84,000', status: 'Shipped', time: '2h ago' },
    { id: '#M-3418', customer: 'MediCore Labs', items: 2, total: '₹6,23,000', status: 'Processing', time: '4h ago' },
    { id: '#M-3412', customer: 'Northside Clinic', items: 7, total: '₹21,45,000', status: 'Delivered', time: '1d ago' },
    { id: '#M-3405', customer: 'HealthFirst Group', items: 1, total: '₹3,75,000', status: 'Processing', time: '1d ago' },
    { id: '#M-3398', customer: 'Sunrise Imaging', items: 3, total: '₹9,12,000', status: 'Shipped', time: '2d ago' },
    { id: '#M-3395', customer: 'City Medical Center', items: 5, total: '₹15,68,000', status: 'Delivered', time: '3d ago' },
  ];

  // Quick actions (removed non-functional buttons)
  const quickActions = [
    { label: 'Restock Ventilators', icon: <MedicineBoxOutlined />, urgent: true, color: '#d9534f' },
    { label: 'Review Bulk Order #M-3421', icon: <NotificationOutlined />, urgent: false, color: '#1a6b8a' },
    { label: 'Update Diagnostic Pricing', icon: <RiseOutlined />, urgent: false, color: '#2a8bb5' },
    { label: 'Inventory Forecast Report', icon: <EyeOutlined />, urgent: false, color: '#3ca0cc' },
    { label: 'Add New Product', icon: <PlusOutlined />, urgent: false, color: '#5db4d9' },
  ];

  // Top selling products with INR
  const topProducts = [
    { name: 'Surgical Kit Deluxe', sales: 124, revenue: '₹91.2 L', growth: '+15%' },
    { name: 'Diagnostic Monitor X8', sales: 87, revenue: '₹44.8 L', growth: '+8%' },
    { name: 'Ventilator Pro', sales: 42, revenue: '₹38.4 L', growth: '+22%' },
    { name: 'Mobility Walker', sales: 55, revenue: '₹28.6 L', growth: '+5%' },
    { name: 'ECG Machine', sales: 34, revenue: '₹22.1 L', growth: '+12%' },
  ];

  // Weekly sales data
  const weeklySales = [
    { day: 'Mon', sales: 28, orders: 42 },
    { day: 'Tue', sales: 35, orders: 51 },
    { day: 'Wed', sales: 42, orders: 63 },
    { day: 'Thu', sales: 38, orders: 58 },
    { day: 'Fri', sales: 45, orders: 67 },
    { day: 'Sat', sales: 52, orders: 78 },
    { day: 'Sun', sales: 48, orders: 72 },
  ];

  // Table columns for products
  const productColumns = [
    { title: 'Product', dataIndex: 'name', key: 'name' },
    { title: 'Units Sold', dataIndex: 'sales', key: 'sales' },
    { title: 'Revenue', dataIndex: 'revenue', key: 'revenue' },
    {
      title: 'Growth',
      dataIndex: 'growth',
      key: 'growth',
      render: (text) => <Tag color="green">{text}</Tag>
    },
  ];

  // Recent activities
  const recentActivities = [
    { user: 'Dr. Smith', action: 'Ordered 3 Ventilator Pro units', time: '5 min ago', icon: <UserOutlined /> },
    { user: 'MediCore Labs', action: 'Requested bulk pricing', time: '12 min ago', icon: <TeamOutlined /> },
    { user: 'System', action: 'Low stock alert: Surgical Kits', time: '25 min ago', icon: <WarningOutlined /> },
    { user: 'Northside Clinic', action: 'Completed payment for #M-3421', time: '1 hour ago', icon: <CheckCircleOutlined /> },
  ];

  // Dropdown menu for period selection
  const periodMenu = (
    <Menu onClick={({ key }) => setSelectedPeriod(key)}>
      <Menu.Item key="7d">Last 7 Days</Menu.Item>
      <Menu.Item key="30d">Last 30 Days</Menu.Item>
      <Menu.Item key="90d">Last 90 Days</Menu.Item>
      <Menu.Item key="1y">Last Year</Menu.Item>
    </Menu>
  );

  // Handle refresh - just update state
  const handleRefresh = () => {
    setRevenue(prev => prev + Math.floor(Math.random() * 100000));
    setOrders(prev => prev + Math.floor(Math.random() * 5) - 2);
    setPendingOrders(prev => Math.max(5, prev + Math.floor(Math.random() * 4) - 2));
    setInventoryAlert(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    setConversionRate(prev => Number((prev + (Math.random() - 0.5) * 0.3).toFixed(1)));
  };

  return (
    <div style={{ padding: 24, background: "#f0f4f9", minHeight: "100vh" }}>
      {/* HEADER with enhanced branding */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 28 }}>
        <Col>
          <Space size={16} align="center">
            <div style={{
              background: '#1a6b8a',
              width: 52,
              height: 52,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 26
            }}>
              <MedicineBoxOutlined />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0a2a44' }}>
                MediEquip Seller Hub
              </Title>
              <Text type="secondary" style={{ fontSize: '0.9rem' }}>
                Medical Equipment E-commerce Dashboard
              </Text>
            </div>
          </Space>
        </Col>
        <Col>
          <Space size={12} wrap>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>
            {/* <Dropdown overlay={periodMenu} trigger={['click']}>
              <Button>
                <CalendarOutlined /> {selectedPeriod === '7d' ? 'Last 7 Days' :
                  selectedPeriod === '30d' ? 'Last 30 Days' :
                    selectedPeriod === '90d' ? 'Last 90 Days' : 'Custom'}
              </Button>
            </Dropdown> */}
            <Card size="small" style={{ borderRadius: 10, background: '#f7fbff', border: '1px solid #d9e7f5' }}>
              <Space>
                <ClockCircleOutlined style={{ color: '#1a6b8a' }} />
                {new Date().toLocaleDateString('en-IN', {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* TABS for different views */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 24 }}>
        <TabPane tab="Overview" key="overview" />
        <TabPane tab="Sales Analytics" key="sales" />
        <TabPane tab="Inventory" key="inventory" />
        <TabPane tab="Customer Insights" key="customers" />
      </Tabs>

      {/* STAT CARDS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {mainStats.map((stat, idx) => (
          <Col xs={24} sm={12} md={8} lg={4} key={idx}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                background: "#fff",
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
              }}
              hoverable
            >
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    fontSize: 22,
                    color: stat.color,
                    background: stat.bg,
                    padding: 10,
                    borderRadius: 12,
                  }}>
                    {stat.icon}
                  </div>
                  {stat.trend && (
                    <span style={{
                      color: stat.trendUp ? '#1e7e34' : '#b13e3e',
                      background: stat.trendUp ? '#e3f5e9' : '#fde8e8',
                      padding: '2px 10px',
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      {stat.trendUp ? <RiseOutlined /> : <FallOutlined />} {stat.trend}
                    </span>
                  )}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {stat.label}
                  </Text>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0a2a44', letterSpacing: '-0.01em' }}>
                    {stat.value}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CHARTS SECTION */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              background: "#fff",
            }}
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="Sales by Category" key="1">
                <div style={{ height: 320 }}>
                  <Bar data={salesChartData} options={barOptions} />
                </div>
              </TabPane>
              <TabPane tab="Revenue Trend" key="2">
                <div style={{ height: 320 }}>
                  <Line data={trendData} options={lineOptions} />
                </div>
              </TabPane>
              <TabPane tab="Weekly Performance" key="3">
                <div style={{ height: 320 }}>
                  <Bar
                    data={{
                      labels: weeklySales.map(d => d.day),
                      datasets: [
                        {
                          label: 'Sales (₹ Lakhs)',
                          data: weeklySales.map(d => d.sales),
                          backgroundColor: '#1a6b8a',
                          borderRadius: 8,
                        },
                        {
                          label: 'Orders',
                          data: weeklySales.map(d => d.orders),
                          backgroundColor: '#5db4d9',
                          borderRadius: 8,
                        }
                      ]
                    }}
                    options={{
                      ...barOptions,
                      plugins: {
                        ...barOptions.plugins,
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              if (context.dataset.label === 'Sales (₹ Lakhs)') {
                                return '₹' + context.parsed.y + ' Lakhs';
                              }
                              return context.parsed.y + ' orders';
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              background: "#fff",
              height: '100%',
            }}
          >
            <Title level={5} style={{ marginBottom: 16, fontWeight: 600, color: '#0a2a44' }}>
              Revenue Distribution
            </Title>
            <div style={{ height: 140 }}>
              <Doughnut data={pieData} options={pieOptions} />
            </div>
            <Divider />
            <Title level={5} style={{ marginBottom: 16, fontWeight: 600, color: '#0a2a44' }}>
              Product Performance
            </Title>
            <div style={{ height: 140 }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* BOTTOM SECTION */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              background: "#fff",
            }}
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#1a6b8a' }} />
                <span style={{ fontWeight: 600 }}>Recent Orders</span>
                <Badge count={pendingOrders} style={{ backgroundColor: '#e8913a' }} />
              </Space>
            }
            extra={<Text type="secondary" style={{ fontSize: '0.8rem' }}>Click to view</Text>}
          >
            <List
              size="small"
              dataSource={recentOrders}
              renderItem={(order) => (
                <List.Item
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid #f0f4f9',
                    cursor: 'pointer',
                  }}
                  onClick={() => alert(`Order ${order.id} details`)}
                >
                  <Row style={{ width: '100%' }} align="middle">
                    <Col span={10}>
                      <Text strong style={{ fontSize: '0.85rem' }}>{order.id}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '0.75rem' }}>{order.customer}</Text>
                    </Col>
                    <Col span={6} style={{ textAlign: 'center' }}>
                      <Text strong style={{ fontSize: '0.85rem' }}>{order.total}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '0.65rem' }}>{order.items} items</Text>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Tag
                        color={order.status === 'Delivered' ? 'green' : order.status === 'Shipped' ? 'blue' : 'orange'}
                        style={{ borderRadius: 12, fontSize: '0.65rem', fontWeight: 500 }}
                      >
                        {order.status}
                      </Tag>
                      <br />
                      <Text type="secondary" style={{ fontSize: '0.6rem' }}>{order.time}</Text>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              background: "#fff",
              height: '100%',
            }}
            title={
              <Space>
                <TrophyOutlined style={{ color: '#e8913a' }} />
                <span style={{ fontWeight: 600 }}>Top Products</span>
              </Space>
            }
            extra={<Text type="secondary" style={{ fontSize: '0.8rem' }}>This month</Text>}
          >
            <Table
              dataSource={topProducts}
              columns={productColumns}
              pagination={false}
              size="small"
              rowKey="name"
              style={{ fontSize: '0.85rem' }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              background: "#fff",
              height: '100%',
            }}
            title={
              <Space>
                <NotificationOutlined style={{ color: '#1a6b8a' }} />
                <span style={{ fontWeight: 600 }}>Quick Actions</span>
              </Space>
            }
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {quickActions.map((action, i) => (
                <Card
                  key={i}
                  size="small"
                  bordered={false}
                  style={{
                    background: action.urgent ? '#fde8e8' : '#f7fbff',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  hoverable
                  onClick={() => alert(`Action: ${action.label}`)}
                >
                  <Space>
                    <span style={{ color: action.color }}>{action.icon}</span>
                    <Text style={{ fontWeight: 500, fontSize: '0.85rem' }}>{action.label}</Text>
                    {action.urgent && <Badge status="error" />}
                  </Space>
                </Card>
              ))}
            </Space>
            <Divider />
            <Title level={5} style={{ fontWeight: 600, color: '#0a2a44' }}>
              Recent Activity
            </Title>
            <List
              size="small"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: '6px 0', borderBottom: 'none' }}>
                  <Space>
                    <Avatar size="small" icon={item.icon} style={{ backgroundColor: '#e6f3f8' }} />
                    <div>
                      <Text strong style={{ fontSize: '0.8rem' }}>{item.user}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '0.7rem' }}>{item.action}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '0.6rem' }}>{item.time}</Text>
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* ADDITIONAL STATS ROW */}
      <Row style={{ marginTop: 24 }} gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, background: '#e6f3f8', boxShadow: 'none' }}>
            <Statistic
              title="Total Products"
              value={1247}
              prefix={<MedicineBoxOutlined style={{ color: '#1a6b8a' }} />}
              valueStyle={{ color: '#0a2a44' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, background: '#f0f7fa', boxShadow: 'none' }}>
            <Statistic
              title="Average Order Value"
              value={43800}
              prefix="₹"
              valueStyle={{ color: '#0a2a44' }}
              formatter={(value) => new Intl.NumberFormat('en-IN').format(value)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, background: '#eaf5f9', boxShadow: 'none' }}>
            <Statistic
              title="Customer Satisfaction"
              value={94.8}
              suffix="%"
              prefix={<HeartOutlined style={{ color: '#d9534f' }} />}
              valueStyle={{ color: '#0a2a44' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, background: '#f7fbff', boxShadow: 'none' }}>
            <Statistic
              title="Return Rate"
              value={2.1}
              suffix="%"
              prefix={<ArrowDownOutlined style={{ color: '#1e7e34' }} />}
              valueStyle={{ color: '#0a2a44' }}
            />
          </Card>
        </Col>
      </Row>

      {/* FOOTER METRICS */}
      <Row style={{ marginTop: 24 }} gutter={[12, 12]}>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, background: '#e6f3f8', boxShadow: 'none' }}>
            <Space>
              <CheckCircleOutlined style={{ color: '#1a6b8a' }} />
              <Text strong style={{ color: '#0a2a44' }}>98.6%</Text>
              <Text type="secondary">On-time Delivery</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, background: '#f0f7fa', boxShadow: 'none' }}>
            <Space>
              <HeartOutlined style={{ color: '#d9534f' }} />
              <Text strong style={{ color: '#0a2a44' }}>4.9★</Text>
              <Text type="secondary">Seller Rating (142 reviews)</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, background: '#eaf5f9', boxShadow: 'none' }}>
            <Space>
              <ShopOutlined style={{ color: '#1a6b8a' }} />
              <Text strong style={{ color: '#0a2a44' }}>16</Text>
              <Text type="secondary">Active Bulk RFQs</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, background: '#f7fbff', boxShadow: 'none' }}>
            <Space>
              <GlobalOutlined style={{ color: '#1a6b8a' }} />
              <Text strong style={{ color: '#0a2a44' }}>24</Text>
              <Text type="secondary">Countries Served</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;