/* eslint-disable react-hooks/exhaustive-deps */
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Popconfirm,
  Spin,
  Card,
  message,
  Input,
  Image,
  Space,
  Tag,
  Modal,
  Switch,
  InputNumber,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  EditOutlined,
} from "@ant-design/icons";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import BrandsService from "../../services/brand"; // adjust path as needed
import Pagination from "../components/Pagination";
import TinyMce from "../../utils/TinyMce";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function Brand() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
  });

  const addNewModalRef = useRef();
  const brandViewModal = useRef();

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      width: 50,
      render: (text, record, index) =>
        index + 1 + (qData.page - 1) * qData.limit,
    },
    // {
    //   title: "Logo",
    //   dataIndex: "logo",
    //   width: 80,
    //   align: "center",
    //   render: (logo) => (
    //     <Image
    //       width={60}
    //       height={60}
    //       src={logo || "/placeholder-brand.png"}
    //       fallback="/placeholder-brand.png"
    //       alt="Logo"
    //       style={{
    //         objectFit: "contain",
    //         borderRadius: "4px",
    //         border: "1px solid #f0f0f0",
    //         padding: "2px",
    //         background: "#fafafa",
    //       }}
    //       preview={false}
    //     />
    //   ),
    // },
    {
      title: "Name",
      dataIndex: "name",
      render: (name) => name || "Not Specified",
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   ellipsis: true,
    //   render: (desc) => desc || "Not Specified",
    // },
    {
      title: "Website",
      dataIndex: "website",
      render: (url) =>
        url ? (
          <a
            href={
              url.startsWith("http://") || url.startsWith("https://")
                ? url
                : `https://${url}`
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1677ff",
              textDecoration: "underline",
            }}
          >
            Visit Website
          </a>
        ) : (
          "Not Specified"
        ),
    },
    {
      title: "Sort Order",
      dataIndex: "sortOrder",
      width: 90,
      align: "center",
      render: (v) => (v !== undefined && v !== null ? v : "-"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (v) => (v ? dayjs(v)?.format("DD MMM YYYY") : "-"),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      width: 90,
      render: (isActive, record) => (
        <Switch
          checked={record?.isActive}
          onChange={() => toggleHandler(record._id)}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: 100,
      render: (v, row) => (
        <Space>
          <Popconfirm
            title="Are you sure to delete this brand?"
            onConfirm={() => deleteData(row._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => addNewModalRef.current.openForm(row)}
          />
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => brandViewModal.current.openForm(row)}
          />
        </Space>
      ),
    },
  ];

  function list() {
    setLoading(true);
    BrandsService.getAll(qData)
      .then((res) => {
        const responseData = res?.data?.brands || res?.data?.data || [];
        const pagination = res?.data?.pagination || {};

        setData(responseData.map((v) => ({ ...v, key: v._id })));

        setQData((prev) => ({
          ...prev,
          limit: pagination?.limit || prev.limit,
          page: pagination?.page || prev.page,
          total: pagination?.total,
        }));
      })
      .catch(() => {
        message.error("Failed to fetch brands");
      })
      .finally(() => setLoading(false));
  }

  const deleteData = (id) => {
    setLoading(true);
    BrandsService.delete(id)
      .then((res) => {
        message.success(res?.data?.message || "Deleted successfully");
        list();
        setSelected([]);
      })
      .catch((err) => {
        message.error(err?.message || "Delete failed");
      })
      .finally(() => setLoading(false));
  };

  const toggleHandler = (id) => {
    setLoading(true);
    BrandsService.toggle(id)
      .then((res) => {
        list();
        message.success(res?.data?.message || "Status updated");
        setSelected([]);
      })
      .catch((err) => {
        message.error(err?.message || "Toggle failed");
      })
      .finally(() => setLoading(false));
  };

  const tableColumns = columns.map((item) => ({ ...item }));
  tableColumns[0].fixed = true;
  tableColumns[tableColumns.length - 1].fixed = "right";

  const tableProps = {
    bordered: true,
    loading,
    size: "small",
    title: () => <Search {...{ qData, setQData, list }} />,
    showHeader: true,
    footer: () => <Pagination {...{ qData, setQData }} />,
  };

  useEffect(() => {
    list();
  }, [qData.page, qData.limit]);

  return (
    <Card
      bordered={false}
      size="small"
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
          List of Brands
        </Space>
      }
      extra={
        <Row justify="end" gutter={12}>
          <Col>
            {selected.length > 0 && (
              <Popconfirm
                title="Are you sure to delete selected brands?"
                onConfirm={() => deleteData(selected)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger icon={<DeleteOutlined />}>
                  Delete Selected
                </Button>
              </Popconfirm>
            )}
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => addNewModalRef.current.openForm()}
            >
              Add New
            </Button>
          </Col>
        </Row>
      }
    >
      <Table
        {...tableProps}
        pagination={{ position: ["none"], pageSize: qData.limit }}
        columns={tableColumns}
        dataSource={data.length ? data : []}
        scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
      />
      <AddEditBrandModal ref={addNewModalRef} list={list} />
      <ViewBrandModal ref={brandViewModal} />
    </Card>
  );
}

// ─── Search Bar ──────────────────────────────────────────────────────────────

function Search({ qData, setQData, list }) {
  return (
    <Form
      onSubmitCapture={() => {
        qData.page = 1;
        list();
      }}
    >
      <Row gutter={12}>
        <Col span={6}>
          <Input
            placeholder="Search brands..."
            value={qData?.search}
            onChange={(e) => setQData({ ...qData, search: e.target.value })}
            allowClear
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

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

const AddEditBrandModal = forwardRef(({ list }, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null); // null = add mode
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    openForm(data = null) {
      setEditData(data);
      if (data) {
        form.setFieldsValue({
          name: data.name,
          logo: data.logo,
          description: data.description,
          website: data.website,
          sortOrder: data.sortOrder,
        });
      } else {
        form.resetFields();
      }
      setOpen(true);
    },
  }));

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        const apiCall = editData
          ? BrandsService.update(editData._id, values)
          : BrandsService.create(values);

        apiCall
          .then((res) => {
            message.success(
              res?.data?.message ||
                (editData
                  ? "Brand updated successfully"
                  : "Brand added successfully"),
            );
            list();
            setOpen(false);
            form.resetFields();
          })
          .catch((err) => {
            message.error(
              err?.response?.data?.message ||
                err?.message ||
                "Operation failed",
            );
          })
          .finally(() => setLoading(false));
      })
      .catch(() => {});
  };

  return (
    <Modal
      style={{ top: 20 }}
      title={editData ? "Edit Brand" : "Add New Brand"}
      destroyOnClose
      maskClosable={false}
      open={open}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      footer={
        <Space>
          <Button
            onClick={() => {
              setOpen(false);
              form.resetFields();
            }}
          >
            Cancel
          </Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            {editData ? "Update" : "Add"}
          </Button>
        </Space>
      }
      width={600}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Brand Name"
                name="name"
                rules={[{ required: true, message: "Please enter brand name" }]}
              >
                <Input placeholder="e.g. Siemens Healthineers" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Sort Order" name="sortOrder">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="e.g. 1"
                  min={0}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Website" name="website">
                <Input placeholder="https://www.example.com" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Description" name="description">
                <TinyMce
                  value={form.getFieldValue("description") || ""}
                  onChange={(v) => {
                    const cleanValue = v.replace(/^<p>(.*?)<\/p>$/s, "$1");

                    form.setFieldsValue({
                      description: cleanValue,
                    });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});

// ─── View Brand Modal ─────────────────────────────────────────────────────────

const ViewBrandModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  useImperativeHandle(ref, () => ({
    openForm(viewData) {
      setData(viewData);
      setOpen(true);
    },
  }));

  return (
    <Modal
      style={{ top: 20 }}
      title="Brand Details"
      destroyOnClose
      maskClosable={false}
      open={open}
      footer={<Button onClick={() => setOpen(false)}>Close</Button>}
      onCancel={() => setOpen(false)}
      width={700}
    >
      <Spin spinning={false}>
        <Form layout="vertical">
          <Row gutter={20} style={{ marginTop: 20 }}>
            {/* Logo */}
            {/* <Col span={24} style={{ textAlign: "center", marginBottom: 20 }}>
              <Image
                width={100}
                height={100}
                src={data?.logo || "/placeholder-brand.png"}
                fallback="/placeholder-brand.png"
                alt="Logo"
                style={{
                  objectFit: "contain",
                  borderRadius: "8px",
                  border: "2px solid #f0f0f0",
                  padding: "4px",
                  background: "#fafafa",
                }}
              />
            </Col> */}

            <Col span={12}>
              <Form.Item label="Brand Name">
                <Input value={data?.name || "Not Specified"} disabled />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Sort Order">
                <Input
                  value={
                    data?.sortOrder !== undefined && data?.sortOrder !== null
                      ? data.sortOrder
                      : "Not Specified"
                  }
                  disabled
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Logo URL">
                <Input value={data?.logo || "Not Specified"} disabled />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Website">
                <Input value={data?.website || "Not Specified"} disabled />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Description">
                <Input.TextArea
                  rows={3}
                  value={data?.description || "Not Specified"}
                  disabled
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Status">
                <Tag color={data?.isActive ? "green" : "red"}>
                  {data?.isActive ? "Active" : "Inactive"}
                </Tag>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Brand ID">
                <Input value={data?._id || "-"} disabled />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Created At">
                <Input
                  value={
                    data?.createdAt
                      ? dayjs(data.createdAt).format("DD MMM YYYY, hh:mm A")
                      : "-"
                  }
                  disabled
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Updated At">
                <Input
                  value={
                    data?.updatedAt
                      ? dayjs(data.updatedAt).format("DD MMM YYYY, hh:mm A")
                      : "-"
                  }
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});
