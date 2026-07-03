import { Input, Button, Row, Col, Form, message,BorderBeam } from "antd";
import { Logo } from "../components/svgIcons";
import { useState } from "react";
import service from "../../services/auth";
import util from "../../utils/util";

export default function Login() {
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

  const login = () => {
    setAjxRequesting(true);
    service
      .login({ ...data })
      .then((res) => {
        console.log("res", res);
        // message.success(res.message);
        util.setUserData(res);
        window.location.href = "/user";  // redirects to user route after successful login
        // window.location.reload();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setAjxRequesting(false);
      });
  };

  return (
    <>
      <div style={{ background: "#1F3A5F", height: "100vh" }}>
        <div span={24} className="login-form-logo">
          <Row justify="center">
            <Col span={24}>
              <Row justify="center" align="middle">
                <Col>
                  <img
                    src="/logo2.jpeg"
                    alt="Logo"
                    style={{ height: "100px", width: "100%",  marginTop: "10px", objectFit: "contain"  }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <div span={24} className="login-form">
          <Row justify="center" style={{ width: "100%" }}>
            <Col
              span={24}
              style={{ backgroundColor: "white", padding: "50px 50px" }}
            >
              <Form layout="vertical" size="large" onSubmitCapture={login}>
                <Row gutter={[12, 2]} span={20}>
                  <Col span={24}>
                    <Form.Item label="User name">
                      <Input
                        placeholder="User name"
                        value={data.email}
                        onChange={(e) => {
                          setData({ ...data, email: e.target.value });
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Password">
                      <Input.Password
                        placeholder="Password"
                        value={data.password}
                        onChange={(e) => {
                          setData({ ...data, password: e.target.value });
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label=" ">
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={ajxRequesting}
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <div className="login-form-bottom"></div>
        </div>
      </div>
    </>
  );
}
