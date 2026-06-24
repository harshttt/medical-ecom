/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Row, Col, Spin, Card, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import service from "../../services/applications";
import TinyMce from "../../utils/TinyMce";
import util from "../../utils/util";

export default function Application() {
    const [data, setData] = useState([]);
    const [dataMap, setDataMap] = useState([]);
    const [ajxRequesting, setAjxRequesting] = useState(false);

    // Initialize dataMap safely
    useEffect(() => {
        const constants = util.constants()?.STATIC_PAGE?.TYPE || {};
        
        const initDataMap = [
            { type: constants.TERMS_CONDITIONS, title: "Terms & Condition", jsonContent: { heading: "Terms & Condition", body: "Please enter data.." } },
            { type: constants.PRIVACY_POLICY, title: "Privacy Policy", jsonContent: { heading: "Privacy Policy", body: "Please enter data.." } },
            { type: constants.SUPPORT, title: "Support", jsonContent: { heading: "Support", body: "Please enter data.." } },
            { type: constants.REFUND_POLICY, title: "Refund Policy", jsonContent: { heading: "Refund Policy", body: "Please enter data.." } },
            { type: constants.ASTROLOGERS_PRIVACY_POLICY, title: "Astrologers Privacy Policy", jsonContent: { heading: "Astrologers Privacy Policy", body: "Please enter data.." } },
            { type: constants.ASTROLOGERS_TERMS_CONDITIONS, title: "Astrologers Terms & Conditions", jsonContent: { heading: "Astrologers Terms & Conditions", body: "Please enter data.." } },
            { type: constants.ASTROLOGERS_REFUND_POLICY, title: "Astrologers Refund Policy", jsonContent: { heading: "Astrologers Refund", body: "Please enter data.." } },
            { type: constants.ABOUT_US, title: "About Us", jsonContent: { heading: "About Us", body: "Please enter data.." } },
        ].map(item => ({ ...item, iseditable: false }));

        setDataMap(initDataMap);
    }, []);

    const list = () => {
        setAjxRequesting(true);
        service
            .listApplications()
            .then((res) => {
                const updatedData = dataMap.map((v) => {
                    if (!v.type && v.type !== 0) return null; // Skip invalid items
                    
                    const matched = res?.data?.find((item) => item.type === v.type);
                    return matched
                        ? {
                            type: matched.type,
                            contentType: matched.contentType,
                            jsonContent: matched.jsonContent,
                        }
                        : {
                            type: v.type,
                            contentType: 6300,
                            jsonContent: { heading: v.title, body: v.jsonContent.body },
                        };
                }).filter(Boolean);

                setData(updatedData);
            })
            .catch(() => message.error("Failed to load data"))
            .finally(() => setAjxRequesting(false));
    };

    useEffect(() => {
        if (dataMap.length > 0) {
            list();
        }
    }, [dataMap]);

    const handleSave = (type) => {
        if (!type && type !== 0) {
            message.error("Invalid page type");
            return;
        }

        const currentItem = data.find((item) => item.type === type);
        if (!currentItem) {
            message.error("Data not found");
            return;
        }

        setAjxRequesting(true);

        const payloadJsonContent = {
            heading: currentItem.jsonContent?.heading || "",
            body: currentItem.jsonContent?.body || "",
        };

        service
            .updateApplications(type, payloadJsonContent)
            .then(() => {
                message.success("Data saved successfully");
                setDataMap((prev) =>
                    prev.map((item) =>
                        item.type === type ? { ...item, iseditable: false } : item
                    )
                );
                list();
            })
            .catch((err) => {
                const errMsg = err?.response?.data?.message || "Failed to save data";
                message.error(errMsg);
            })
            .finally(() => setAjxRequesting(false));
    };

    const toggleEdit = (index) => {
        setDataMap((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, iseditable: !item.iseditable } : item
            )
        );
    };

    return (
        <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
            <Row gutter={[12, 12]} style={{ height: "80vh", overflow: "auto" }}>
                {dataMap.map((val, i) => {
                    if (!val.type && val.type !== 0) return null;

                    const currentContent = data.find((d) => d.type === val.type);

                    return (
                        <Col span={12} key={val.type}>
                            <Card
                                title={val.title}
                                size="small"
                                extra={
                                    !val.iseditable ? (
                                        <Button type="primary" size="small" onClick={() => toggleEdit(i)}>
                                            Edit
                                        </Button>
                                    ) : (
                                        <Row gutter={6}>
                                            <Col>
                                                <Button
                                                    danger
                                                    size="small"
                                                    onClick={() => {
                                                        list();
                                                        toggleEdit(i);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    onClick={() => handleSave(val.type)}
                                                >
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    )
                                }
                            >
                                <TinyMce
                                    disable={!val.iseditable}
                                    value={currentContent?.jsonContent?.body || ""}
                                    onChange={(newBody) => {
                                        setData((prev) =>
                                            prev.map((item) =>
                                                item.type === val.type
                                                    ? {
                                                        ...item,
                                                        jsonContent: {
                                                            ...item.jsonContent,
                                                            body: newBody,
                                                        },
                                                    }
                                                    : item
                                            )
                                        );
                                    }}
                                />
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Spin>
    );
}