import React from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import {
  UserOutlined,
  StarOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const { Title, Text } = Typography;

const chartData = {
  labels: [
    "Users",
    "Astrologers",
    "Calls & Video",
    "Chat Sessions",
    "Puja Bookings",
    "Products",
    "Blogs",
  ],
  datasets: [
    {
      label: 'Platform Stats',
      data: [154, 200, 5000, 5000, 10, 300, 2000],
      backgroundColor: [
        '#3f51b5',
        '#4caf50',
        '#ff9800',
        '#673ab7',
        '#e91e63',
        '#9c27b0',
        '#2196f3'
      ],
      borderRadius: 5,
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  indexAxis: 'y',
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
  },
};

// For stat cards
const stats = [
  { icon: <UserOutlined />, label: 'Users', value: 154 },
  { icon: <StarOutlined />, label: 'Astrologers', value: 200 },
  { icon: <VideoCameraOutlined />, label: 'Calls & Video', value: 5000 },
  { icon: <MessageOutlined />, label: 'Chat Sessions', value: 5000 },
  { icon: <ShoppingOutlined />, label: 'Puja Bookings', value: 10 },
  { icon: <TeamOutlined />, label: 'Products', value: 300 },
  { icon: <ReadOutlined />, label: 'Blogs', value: 2000 },
];

const App = () => {
  return (
    <div style={{ padding: 24, background: "#f5f6fa", minHeight: "100vh" }}>
      {/* HEADER */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Dashboard Overview</Title>
          <Text type="secondary">Your platform's performance at a glance</Text>
        </Col>
        <Col>
          <Card size="small" style={{ borderRadius: 6 }}>
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Card>
        </Col>
      </Row>

      {/* STAT CARDS */}
      {/* <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((item, idx) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={6} key={idx}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                background: "#fff",
              }}
            >
              <Space direction="horizontal" size="large">
                <div style={{
                  fontSize: 28,
                  color: "#3f51b5",
                  background: "#e8eaf6",
                  padding: 12,
                  borderRadius: "50%",
                }}>
                  {item.icon}
                </div>
                <div>
                  <Text type="secondary">{item.label}</Text>
                  <Title level={4} style={{ margin: 0 }}>{item.value}</Title>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row> */}

      {/* CHARTS */}
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          background: "#fff",
        }}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Title level={5}>Usage Distribution (Pie)</Title>
            <Pie data={chartData} options={pieOptions} />
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}> Detailed Stats (Bar)</Title>
            <Bar data={chartData} options={barOptions} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default App;
