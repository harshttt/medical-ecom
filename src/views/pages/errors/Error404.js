import { Result, Typography, Button } from "antd";
import { AppstoreOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Paragraph, Text, Title } = Typography;

export default function Error404() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "flex-start", // 👈 moved upward
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa, #e4ecf7)",
        padding: "60px 20px 20px", // 👈 top spacing for balance
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          width: "100%",
          textAlign: "center",
          background: "#fff",
          borderRadius: "20px",
          padding: "40px 30px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <Result
          icon={
            <img
              src="/hello.jpeg"
              alt="Robot"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "contain",
                marginBottom: "10px",
              }}
            />
          }
          title={
            <Title level={2} style={{ marginBottom: 0 }}>
              Welcome User 👋
            </Title>
          }
          subTitle={
            <div>
              <Paragraph style={{ fontSize: "18px", marginTop: "10px" }}>
                <Text strong style={{ fontSize: "22px", color: "#ff4d4f" }}>
                  Access Denied!
                </Text>
                <br />
                You don’t have permission to view this page.
              </Paragraph>

              <Paragraph
                type="secondary"
                style={{ fontSize: "16px", lineHeight: 1.6 }}
              >
                Use the{" "}
                <Text code>
                  <AppstoreOutlined /> sidebar modules
                </Text>{" "}
                to navigate to a valid section.
              </Paragraph>
            </div>
          }
        />
      </div>
    </div>
  );
}