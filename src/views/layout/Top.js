import { Space, Row, Col, Input, Button } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  BellFilled,
  ArrowRightOutlined,
} from "@ant-design/icons";
import commonObj from "../../commonObj";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import routes from "./route";

export default function Top() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const single = () => {
    let singleMenuData = [];
    for (let i = 0; i < routes?.length; i++) {
      if (routes[i].children) {
        for (let y = 0; y < routes[i]?.children?.length; y++) {
          singleMenuData?.push({
            title: routes[i].children[y].title,
            id: i,
            path: `${routes[i].url}/${routes[i].children[y].url}`,
          });
        }
      } else {
        singleMenuData?.push({
          title: routes[i].title,
          id: i,
          path: routes[i].url,
        });
      }
    }
    setData(singleMenuData);
  };

  useEffect(() => {
    single();
  }, [query]);

  return (
    <>
      <Row gutter={[12, 0]} justify="space-between">
        <Col span={12}>
          {/* <Space.Compact size="large" style={{ width: '100%' }}>
                        <Input placeholder="Search here..." />
                        <Button type="primary">Search</Button>
                    </Space.Compact> */}
        </Col>
        <Col>
          <Space>
            {/* <Button
              type="text"
              size="large"
              style={{ marginLeft: "auto" }}
              shape="circle"
            />
            <a href="">
              <Button type="text" size="large" icon={<UserOutlined />}>
                {commonObj?.firstName
                  ? `${commonObj.firstName} ${
                      commonObj.lastName ? commonObj.lastName : ""
                    }`
                  : "Profile"}
              </Button> */}
            {/* </a> */}
            <Button
              icon={<LogoutOutlined />}
              danger
              onClick={() => {
                window.localStorage.clear();
                window.location.reload();
              }}
            >
              Logout
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
}
