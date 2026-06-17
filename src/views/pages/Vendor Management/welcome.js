import {
  ShoppingOutlined,
  LogoutOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";
import {
  theme,
  Typography,
  Card,
  Row,
  Col,
  Button,
  Layout,
} from "antd";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const VendorWelcome = ({ vendorName = "Vendor" }) => {
  const {
    token: { colorPrimary, colorBgContainer, colorText, colorBorderSecondary }
  } = theme.useToken();

  const handleLogout = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  const cardStyle = {
    height: '100%',
    textAlign: 'center',
    borderRadius: 15,
    background: `linear-gradient(145deg, ${colorBgContainer} 0%, #f0f0f0 100%)`,
    border: `1px solid ${colorBorderSecondary}`,
    transition: 'all 0.3s ease'
  };

  const iconStyle = {
    fontSize: '48px',
    color: colorPrimary,
    marginBottom: '16px'
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, #f5f5f5 0%, #aaaaaaff 100%)`
      }}
    >
      {/* Header Section */}
      <Content style={{ padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Title 
            level={1} 
            style={{ 
              color: colorPrimary,
              marginBottom: '16px',
              fontSize: '2.5rem'
            }}
          >
            Welcome back, {vendorName}!
          </Title>
          <Paragraph 
            style={{ 
              fontSize: '1.1rem',
              color: colorText,
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Manage your products, profile, and account from your dashboard.
          </Paragraph>
        </div>

        {/* Cards Grid */}
        <Row 
          gutter={[32, 32]} 
          justify="center"
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          {/* Products Card */}
          <Col xs={24} sm={12} md={8}>
            <Card
              style={cardStyle}
              bodyStyle={{ 
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%'
              }}
              hoverable
            >
              <ShoppingOutlined style={iconStyle} />
              <Title level={3} style={{ marginBottom: '12px', color: colorText }}>
                Products
              </Title>
              <Paragraph 
                style={{ 
                  color: colorText,
                  marginBottom: '24px',
                  flex: 1
                }}
              >
                View, edit, and manage your product listings easily.
              </Paragraph>
              <Link to="/category/product">
                <Button 
                  type="primary" 
                  size="large"
                  style={{ 
                    backgroundColor: colorPrimary,
                    borderColor: colorPrimary,
                    borderRadius: '6px'
                  }}
                >
                  Go to Products
                </Button>
              </Link>
            </Card>
          </Col>

          {/* Bookings Card */}
          <Col xs={24} sm={12} md={8}>
            <Card
              style={cardStyle}
              bodyStyle={{ 
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%'
              }}
              hoverable
            >
              <AccountBookOutlined style={iconStyle} />
              <Title level={3} style={{ marginBottom: '12px', color: colorText }}>
                Bookings
              </Title>
              <Paragraph 
                style={{ 
                  color: colorText,
                  marginBottom: '24px',
                  flex: 1
                }}
              >
                View and Manage all the product bookings
              </Paragraph>
              <Link to="/product-booking/">
                <Button 
                  type="primary" 
                  size="large"
                  style={{ 
                    backgroundColor: colorPrimary,
                    borderColor: colorPrimary,
                    borderRadius: '6px'
                  }}
                >
                  Go to Bookings
                </Button>
              </Link>
            </Card>
          </Col>

          {/* Logout Card */}
          <Col xs={24} sm={12} md={8}>
            <Card
              style={{
                ...cardStyle,
                background: `linear-gradient(145deg, #fff5f5, #ffe6e6)`
              }}
              bodyStyle={{ 
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%'
              }}
              hoverable
            >
              <LogoutOutlined style={iconStyle} />
              <Title level={3} style={{ marginBottom: '12px', color: colorText }}>
                Logout
              </Title>
              <Paragraph 
                style={{ 
                  color: colorText,
                  marginBottom: '24px',
                  flex: 1
                }}
              >
                Securely sign out from your vendor dashboard.
              </Paragraph>
              <Button 
                danger
                size="large"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ 
                  borderRadius: '6px',
                  backgroundColor: '#e74c3c',
                  borderColor: '#e74c3c',
                  color: '#fff'
                }}
              >
                Logout
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Footer */}
      <Footer style={{ 
        textAlign: 'center', 
        background: 'transparent',
        borderTop: `1px solid ${colorBorderSecondary}`,
        marginTop: '60px',
        padding: '24px 50px'
      }}>
        <Paragraph style={{ margin: 0, color: colorText }}>
          © {new Date().getFullYear()} Vendor Admin Panel — All Rights Reserved.
        </Paragraph>
      </Footer>
    </Layout>
  );
};

export default VendorWelcome;