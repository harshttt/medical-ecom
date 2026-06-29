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
  Space,
  Modal,
  Select,
  Switch,
  DatePicker,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import serviceCoupon from "../../services/coupon";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import { AntdMsg } from "../../utils/Antd";
import dayjs from "dayjs";

export default function Coupon() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qData, setQData] = useState({ page: 1, limit: 10, search: "" });

  const addNewModalRef = useRef();
  const viewUsageModalRef = useRef();

  const columns = [
    { title: "S.No", width: 60, render: (_, __, index) => index + 1 },
    { title: "Code", dataIndex: "code", render: (code) => <strong>{code}</strong> },
    { title: "Description", dataIndex: "description", ellipsis: true },
    {
      title: "Discount",
      render: (_, record) => (
        <span>
          {record.discountType === "PERCENTAGE" ? `${record.discountValue}%` : `₹${record.discountValue}`}
        </span>
      ),
    },
    { title: "Min Order", dataIndex: "minOrderAmount", render: (v) => (v ? `₹${v}` : "-") },
    {
      title: "First Order",
      dataIndex: "isFirstOrderOnly",
      render: (v) => <Tag color={v ? "green" : "default"}>{v ? "Yes" : "No"}</Tag>,
    },
    {
      title: "Valid From",
      dataIndex: "validFrom",
      render: (v) => (v ? dayjs(v).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Valid To",
      dataIndex: "validUntil",
      render: (v) => (v ? dayjs(v).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (isActive) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Yes" : "No"}</Tag>,
    },
    { title: "Used", dataIndex: "usedCount" },
    {
      title: "Action",
      width: 160,
      render: (_, row) => (
        <Space>
          <Button
            type="default"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => viewUsageModalRef.current.openModal(row._id)}
          >
            Usage
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => addNewModalRef.current.openForm(row)}
          />
          <Popconfirm
            title="Delete this coupon?"
            onConfirm={() => deleteData(row._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function list() {
    setLoading(true);
    serviceCoupon
      .listCoupon(qData)
      .then((res) => {
        const coupons = res?.data?.coupons || [];
        setData(coupons.map((v) => ({ ...v, key: v._id })));

        setQData((prev) => ({
          ...prev,
          limit: res?.data?.pagination?.limit || 10,
          page: res?.data?.pagination?.page || 1,
          total: res?.data?.pagination?.total || 0,
        }));
      })
      .catch((e) => message.error(e?.message || "Failed to load coupons"))
      .finally(() => setLoading(false));
  }

  const deleteData = (id) => {
    serviceCoupon.delete(id)
      .then(() => {
        message.success("Coupon deleted successfully");
        list();
      })
      .catch((err) => message.error(err?.message || "Delete failed"));
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
          <Button type="dashed" danger icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Back
          </Button>
          Coupon Management
        </Space>
      }
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => addNewModalRef.current.openForm()}>
          Add New Coupon
        </Button>
      }
    >
      <Table
        bordered
        loading={loading}
        title={() => <Search {...{ qData, setQData, list }} />}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
        footer={() => <Pagination {...{ qData, setQData }} />}
      />

      <AddForm ref={addNewModalRef} list={list} />
      <ViewUsageModal ref={viewUsageModalRef} />
    </Card>
  );
}

/* Search */
function Search({ qData, setQData, list }) {
  return (
    <Form
      onSubmitCapture={(e) => {
        e.preventDefault();
        setQData((prev) => ({ ...prev, page: 1 }));
        list();
      }}
    >
      <Row gutter={12}>
        <Col span={8}>
          <Input
            placeholder="Search by code"
            value={qData.search}
            onChange={(e) => setQData({ ...qData, search: e.target.value })}
            allowClear
          />
        </Col>
        <Col>
          <Button type="primary" htmlType="submit">Search</Button>
        </Col>
      </Row>
    </Form>
  );
}

/* Add / Edit Modal */
const AddForm = forwardRef(({ list }, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { ...dt } : { discountType: "FLAT", isActive: true, isFirstOrderOnly: false });
    },
  }));

  const handleChange = (value) => setData((prev) => ({ ...prev, ...value }));

  const save = () => {
    setAjxRequesting(true);
    const apiCall = data._id
      ? serviceCoupon.updateCoupon(data._id, data)
      : serviceCoupon.addCoupon(data);

    apiCall
      .then((res) => {
        AntdMsg(res?.message || "Success");
        list();
        setOpen(false);
      })
      .catch((err) => AntdMsg(err?.message, "error"))
      .finally(() => setAjxRequesting(false));
  };

  return (
    <Modal
      title={data?._id ? "Edit Coupon" : "Add New Coupon"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>Cancel</Button>,
        <Button key="save" type="primary" loading={ajxRequesting} onClick={save}>Save</Button>,
      ]}
      width={1100}
      destroyOnClose
    >
      <Spin spinning={ajxRequesting}>
        <Form layout="vertical">
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item label="Coupon Code" required>
                <Input value={data.code} onChange={(e) => handleChange({ code: e.target.value.toUpperCase() })} placeholder="WELCOME20" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Discount Type" required>
                <Select value={data.discountType} onChange={(v) => handleChange({ discountType: v })} options={[{ label: "Flat", value: "FLAT" }, { label: "Percentage", value: "PERCENTAGE" }]} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Discount Value" required>
                <Input type="number" value={data.discountValue} onChange={(e) => handleChange({ discountValue: Number(e.target.value) })} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Min Order Amount" required>
                <Input type="number" value={data.minOrderAmount} onChange={(e) => handleChange({ minOrderAmount: Number(e.target.value) })} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Usage Limit Per User">
                <Input type="number" value={data.usageLimitPerUser} onChange={(e) => handleChange({ usageLimitPerUser: Number(e.target.value) })} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Description" required>
                <Input.TextArea value={data.description} onChange={(e) => handleChange({ description: e.target.value })} rows={3} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Valid Period" required>
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  value={[data.validFrom ? dayjs(data.validFrom) : null, data.validUntil ? dayjs(data.validUntil) : null]}
                  onChange={(_, strings) => handleChange({ validFrom: strings[0], validUntil: strings[1] })}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="First Order Only">
                <Switch checked={data.isFirstOrderOnly} onChange={(v) => handleChange({ isFirstOrderOnly: v })} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Active">
                <Switch checked={data.isActive} onChange={(v) => handleChange({ isActive: v })} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});

/* ==================== FIXED VIEW USAGE MODAL ==================== */
const ViewUsageModal = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [usages, setUsages] = useState([]);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal(id) {
      fetchUsage(id);
    },
  }));

  const fetchUsage = async (id) => {
    setLoading(true);
    try {
      const res = await serviceCoupon.getUsage(id);
      setCoupon(res?.data?.coupon);
      setUsages(res?.data?.usages || []);
    } catch (err) {
      message.error(err?.message || "Failed to load usage details");
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  return (
    <Modal
      title="Coupon Usage Details"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={1200}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {coupon && (
          <Card title="Coupon Information" size="small" style={{ marginBottom: 20 }}>
            <Row gutter={[16, 12]}>
              <Col span={6}><strong>Code:</strong> <Tag color="blue" style={{ fontSize: 16 }}>{coupon.code}</Tag></Col>
              <Col span={6}><strong>Discount:</strong> {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</Col>
              <Col span={6}><strong>Min Order:</strong> ₹{coupon.minOrderAmount}</Col>
              <Col span={6}><strong>Total Used:</strong> {coupon.usedCount}</Col>

              <Col span={24}><strong>Description:</strong> {coupon.description}</Col>
              <Col span={12}>
                <strong>Valid Period:</strong> {dayjs(coupon.validFrom).format("DD MMM YYYY")} - {dayjs(coupon.validUntil).format("DD MMM YYYY")}
              </Col>
            </Row>
          </Card>
        )}

        <Card title={`Usage Records (${usages.length})`} size="small">
          <Table
            dataSource={usages}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
            columns={[
              {
                title: "User Name",
                dataIndex: "userId",
                render: (user) => (
                  user ? <Tag color="purple">{user.name}</Tag> : "-"
                ),
              },
              {
                title: "Email",
                dataIndex: "userId",
                render: (user) => user?.email || "-",
              },
              {
                title: "Phone",
                dataIndex: "userId",
                render: (user) => user?.phone || "-",
              },
              {
                title: "Order No.",
                dataIndex: "orderId",
                render: (order) => order?.orderNumber || "-",
              },
              {
                title: "Order Amount",
                dataIndex: "orderId",
                render: (order) =>
                  order ? `₹${order.grandTotal.toLocaleString()}` : "-",
              },
              {
                title: "Discount Applied",
                dataIndex: "discountAmount",
                render: (amount) => `₹${amount}`,
              },
              {
                title: "Used At",
                dataIndex: "createdAt",
                render: (date) =>
                  date ? dayjs(date).format("DD MMM YYYY • hh:mm A") : "-",
              },
            ]}
          />
        </Card>
      </Spin>
    </Modal>
  );
});