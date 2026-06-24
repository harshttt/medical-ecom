/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Table, Button, Form, Row, Col, Popconfirm, Card, message, Input, Space, Typography, Tag, Avatar, Modal, Descriptions
} from "antd";
import { 
  DeleteOutlined, ArrowLeftOutlined, SearchOutlined, 
  MailOutlined, PhoneOutlined, CalendarOutlined, ExportOutlined, EyeOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import AdminContactService from "../../services/contactus";   
import Pagination from "../components/Pagination";

const { Text } = Typography;

export default function ContactPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [qData, setQData] = useState({ page: 1, limit: 20, key: "", total: 0 });
  const [exportModalVisible, setExportModalVisible] = useState(false);
  
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const list = () => {
    setLoading(true);
    AdminContactService.listContact({
      page: qData.page,
      limit: qData.limit,
      search: qData.key,
    })
      .then((res) => {
        if (res.status === "success" && res.data) {
          const items = res.data.items || res.data;
          setData(items);
          setQData((prev) => ({
            ...prev,
            total: res.data.total || items.length,
          }));
          setSelected((prevSelected) =>
            prevSelected.filter((key) => items.some((item) => item._id === key))
          );
        } else {
          setData([]);
          setQData((prev) => ({ ...prev, total: 0 }));
          setSelected([]);
        }
      })
      .catch(() => {
        message.error("Failed to fetch contacts.");
        setData([]);
        setQData((prev) => ({ ...prev, total: 0 }));
      })
      .finally(() => setLoading(false));
  };

  const deleteData = (ids) => {
    setLoading(true);
    const deletePromise = Array.isArray(ids) 
      ? AdminContactService.deleteManyContacts(ids)
      : AdminContactService.deleteContact(ids);

    deletePromise
      .then(() => {
        message.success("Deleted successfully");
        setSelected([]);
        setQData((prev) => ({ ...prev, page: 1 }));
        list();
      })
      .catch(() => message.error("Failed to delete"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    list();
  }, [qData.page, qData.limit, qData.key]);

  const showDetails = (record) => {
    setSelectedContact(record);
    setViewModalVisible(true);
  };

  const exportColumns = [
    {
      title: "Name",
      dataIndex: "name",
      width: 220,
      render: (name) => (
        <Space>
          <Avatar style={{ backgroundColor: "#1890ff" }}>
            {name?.charAt(0).toUpperCase()}
          </Avatar>
          <Text strong>{name || "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 220,
      render: (email) => (
        <Text type="primary">
          <MailOutlined /> {email || "N/A"}
        </Text>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: 160,
      render: (phone) => (
        <Text>
          <PhoneOutlined style={{ color: "#1a42c4" }} /> {phone || "N/A"}
        </Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 350,
      render: (desc) => <Text style={{ whiteSpace: 'pre-wrap' }}>{desc || "N/A"}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (status) => (
        <Tag color={status === 1 ? "green" : "red"}>
          {status === 1 ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Received On",
      dataIndex: "createdAt",
      width: 180,
      render: (value) => (
        <Tag icon={<CalendarOutlined />} color="blue" bordered={false}>
          {value ? moment(value).format("DD MMM YYYY, HH:mm") : "N/A"}
        </Tag>
      ),
    },
  ];

  const columns = [
    ...exportColumns,
    {
      title: "Action",
      dataIndex: "_id",
      width: 110,
      fixed: "right",
      align: 'center',
      render: (_id, row) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            style={{ backgroundColor: '#1ab3c4', borderColor: '#1ab3c4' }}
            icon={<EyeOutlined />}
            onClick={() => showDetails(row)}
          />

          <Popconfirm
            title="Delete this contact?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteData(_id)}
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0px' }}>
      <Card
        bordered={false}
        className="shadow-sm"
        title={
          <Space>
            <Button
              type="dashed"
              danger
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <span style={{ fontWeight: 'bold' }}>List of Contacts</span>
          </Space>
        }
        extra={
          <Space>
            {selected.length > 0 && (
              <Popconfirm
                title="Delete selected contacts?"
                onConfirm={() => deleteData(selected)}
              >
                <Button type="primary" danger icon={<DeleteOutlined />}>
                  Delete Selected
                </Button>
              </Popconfirm>
            )}
            {data.length > 0 && (
              <Button icon={<ExportOutlined />} onClick={() => setExportModalVisible(true)}>
                Export To Excel
              </Button>
            )}
          </Space>
        }
      >
        <div style={{ marginBottom: 16, background: '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
          <Search qData={qData} setQData={setQData} />
        </div>

        <Table
          bordered={true}
          loading={loading}
          size="small"
          rowKey="_id"
          dataSource={data}
          columns={columns}
          pagination={false}
          rowSelection={{
            selectedRowKeys: selected,
            onChange: setSelected,
            fixed: "left",
          }}
          scroll={{ y: "calc(100vh - 400px)", x: "max-content" }}
          footer={() => <Pagination qData={qData} setQData={setQData} />}
        />
      </Card>

      {/* View Modal */}
      <Modal
        title="Contact Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[<Button key="close" onClick={() => setViewModalVisible(false)}>Close</Button>]}
        width={700}
      >
        {selectedContact && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Name">{selectedContact.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedContact.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedContact.phone}</Descriptions.Item>
            <Descriptions.Item label="Description">
              <div style={{ whiteSpace: 'pre-wrap', color: '#333' }}>
                {selectedContact.description}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedContact.status === 1 ? "green" : "red"}>
                {selectedContact.status === 1 ? "Active" : "Inactive"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Received At">
              {moment(selectedContact.createdAt).format("DD MMMM YYYY, HH:mm A")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

// Search Component (unchanged)
function Search({ qData, setQData }) {
  const [localKey, setLocalKey] = React.useState(qData.key);

  React.useEffect(() => {
    setLocalKey(qData.key);
  }, [qData.key]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalKey(value);
    if (value === "") {
      setQData((prev) => ({ ...prev, key: "", page: 1 }));
    }
  };

  const onSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setQData((prev) => ({ ...prev, key: localKey, page: 1 }));
  };

  return (
    <Form onSubmitCapture={onSearchSubmit}>
      <Row gutter={12} align="middle">
        <Col span={8}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name, email, or phone"
            value={localKey}
            onChange={handleInputChange}
            allowClear
            onPressEnter={onSearchSubmit}
          />
        </Col>
        <Col span={3}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}