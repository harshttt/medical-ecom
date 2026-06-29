import React, { useState } from "react";
import { Row, Col, Layout, theme, Button } from "antd";
import { Routes, Route } from "react-router-dom";
import Menu from "./Menu";
import routes from "./route";
import Breadcrumb from "./Breadcrumb";
import Error404 from "../pages/errors/Error404";
import Top from "./Top";
import { Logo, LogoSmall, MenuFold } from '../components/svgIcons';
import { Link } from 'react-router-dom';

const newRoutes = [];
function convertMultiToSingle(arr, prevBaseUrl = '') {
    arr.forEach(v => {
        if (v.children) {
            convertMultiToSingle(v.children, prevBaseUrl + v.url);
        } else {
            newRoutes.push({ ...v, url: prevBaseUrl + v.url })
        }
    })
}
convertMultiToSingle([...routes]);


export default function MyLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer } } = theme.useToken();

    return (
        <>
            <Layout>
                <Layout.Sider width={250} style={{ overflow: 'auto', padding: 0, background: "#1F3A5F" }} collapsible={false} collapsed={collapsed}>
                    <Layout.Header style={{
                        padding: 0,
                        background: colorBgContainer,
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "64px" // Standard header height
                    }}>
                        <Link to="/" style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%"
                        }}>
                            {collapsed ?
                                <img
                                    style={{
                                        objectFit: "contain",
                                        maxHeight: "48px",
                                        maxWidth: "60px",
                                        width: "auto",
                                        height: "auto"
                                    }}
                                    height={48}
                                    width={60}
                                    src='/logo2.jpeg'
                                    alt="Logo Small"
                                /> :
                                <img
                                    style={{
                                        objectFit: "cover",
                                        maxHeight: "50px",
                                        maxWidth: "180px",
                                        width: "100%",
                                        height: "auto",
                                        display: "block"
                                    }}
                                    src='/logo2.jpeg'
                                    alt="Logo"
                                />
                            }
                        </Link>
                    </Layout.Header>
                    <Menu />
                </Layout.Sider>
                <Layout>
                    <Layout.Header style={{ paddingLeft: "10px", paddingRight: "10px", background: colorBgContainer }}>
                        <Row>
                            <Col span={24}>
                                <Row justify="space-between" align="middle">
                                    <Col span={4}>
                                        <Button size="small" type="text" icon={<MenuFold />} onClick={() => setCollapsed(!collapsed)} />
                                    </Col>
                                    <Col span={20}>
                                        <Top />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Layout.Header>
                    <Layout.Content style={{ padding: 24 }}>
                        <Routes>
                            {newRoutes.map((v) => <Route path={v.url} key={v.url} element={<v.component />} />)}
                            <Route path={'*'} element={<Error404 />} />
                        </Routes>
                    </Layout.Content>
                </Layout>
            </Layout>
        </>
    );
}