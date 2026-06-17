/* eslint-disable react-hooks/exhaustive-deps */
import { Button, message, Col, Input, Row, Spin, Form, Divider } from "antd";
import React, { useState } from "react";
import service from "../../services/user"
import { LoadingOutlined } from '@ant-design/icons';

export default function ChangePassword() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    const handleChange = (v, k) => { setData({ ...data, [k]: v }); }

    function save() {
        setLoading(true);
        service.updatePassword(data).then(res => {
            message.success(res.message);
            setData({});
        }).catch(err => {
            message.error(err.message, 'error');
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <>
            <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                <Form layout="vertical" style={{paddingTop:"4rem"}}>
                    <Row gutter={[12, 2]}>
                        <Col span={8}>
                            <Form.Item label="Current Password">
                                <Input.Password placeholder="Current Password" value={data?.currentPassword} onChange={e => { handleChange(e.target.value, 'currentPassword'); }} />
                            </Form.Item>
                        </Col>
                        <Col span={16}></Col>

                        <Col span={8}>
                            <Form.Item label="New Password">
                                <Input.Password placeholder="New Password" value={data?.newPassword} onChange={e => { handleChange(e.target.value, 'newPassword'); }} />
                            </Form.Item>
                        </Col>
                        <Col span={16}></Col>
                        <Col span={8}>
                            <Form.Item label="Confirm New Password">
                                <Input.Password placeholder="Confirm New Password" value={data?.confirmNewPassword} onChange={e => { handleChange(e.target.value, 'confirmNewPassword'); }} />
                            </Form.Item>
                        </Col>
                        <Col span={16}></Col>
                        <Col span={8}>
                            <Form.Item>
                                {
                                    data?.currentPassword && data?.newPassword && data?.confirmNewPassword
                                        ? <Button type="primary" style={{ width: '100%' }} htmlType="submit" onClick={save} >Update Password</Button>
                                        : null
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </>
    );
};