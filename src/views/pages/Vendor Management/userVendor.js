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
  Tag,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import servicesAdmin from "../../../services/admin-vendor";
import AdminCategoryService from "../../../services/category"; // ← adjust path if needed
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import util from "../../../utils/util";
import { AntdMsg } from "../../../utils/Antd";

// ── Vendor verification status constants (from VENDOR_STATUS) ──────────────
const VENDOR_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  SUSPENDED: 4,
};

const VERIFICATION_STATUS_OPTIONS = [
  { label: "PENDING", value: VENDOR_STATUS.PENDING },
  { label: "APPROVED", value: VENDOR_STATUS.APPROVED },
  { label: "REJECTED", value: VENDOR_STATUS.REJECTED },
  { label: "SUSPENDED", value: VENDOR_STATUS.SUSPENDED },
];

// Map numeric value → label string
function getStatusLabel(val) {
  return Object.entries(VENDOR_STATUS).find(([, v]) => v === val)?.[0] || "-";
}

// Color tag per status
const STATUS_COLOR = {
  [VENDOR_STATUS.PENDING]: "gold",
  [VENDOR_STATUS.APPROVED]: "green",
  [VENDOR_STATUS.REJECTED]: "red",
  [VENDOR_STATUS.SUSPENDED]: "orange",
};

export default function UserAdmin() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [categories, setCategories] = useState([]); // ← all categories for display
  const [qData, setQData] = useState({ page: 1, limit: 10, role: 3 });

  const addNewModalRef = useRef();

  // ── Fetch vendors ──────────────────────────────────────────────────────────
  function list() {
    setLoading(true);
    servicesAdmin
      .list(qData)
      .then((res) => {
        const users = res?.data?.users || [];
        setData(users.map((v) => ({ ...v, key: v._id })));
        const pg = res?.data?.pagination;
        if (pg) {
          setQData((prev) => ({
            ...prev,
            total: pg.total,
            page: pg.page,
            limit: pg.limit,
          }));
        }
      })
      .catch(() => message.error("Failed to fetch vendors"))
      .finally(() => setLoading(false));
  }

  // ── Fetch all categories (for display labels in table) ────────────────────
  function fetchCategories() {
    AdminCategoryService.listCategory({ page: 1, limit: 1000 })
      .then((res) => {
        const cats = res?.data?.categories || [];
        setCategories(cats);
      })
      .catch(() => {
        /* non-critical */
      });
  }

  useEffect(() => {
    list();
    fetchCategories();
  }, [qData.page, qData.limit]);

  // Helper: resolve category _id → name
  const renderCategoryTags = (categoryList = []) => {
    // Check if categoryList is valid and has items
    if (!categoryList || categoryList.length === 0) return "-";

    return categoryList.map((cat) => (
      <Tag key={cat._id} color="blue" style={{ marginBottom: 2 }}>
        {cat.name}
      </Tag>
    ));
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteData = (id) => {
    servicesAdmin
      .delete(id)
      .then((res) => {
        message.success(res?.message || "Deleted successfully");
        list();
        setSelected([]);
      })
      .catch((err) => message.error(err?.message));
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = [
    {
      title: "S.No",
      width: 55,
      render: (_, __, index) => index + 1 + (qData.page - 1) * qData.limit,
    },
    {
      title: "Owner Name",
      render: (_, r) => r?.vendor?.ownerName || r?.name || "-",
    },
    {
      title: "Business Name",
      render: (_, r) => r?.vendor?.businessName || "-",
    },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Categories",
      // Pass the categories array directly
      render: (_, r) => renderCategoryTags(r?.vendor?.categories),
    },
    {
      title: "Verification Status",
      render: (_, r) => {
        const val = r?.vendor?.verificationStatus;
        if (val === undefined || val === null) return "-";
        return (
          <Tag color={STATUS_COLOR[val] || "default"}>
            {getStatusLabel(val)}
          </Tag>
        );
      },
    },
    {
      title: "Can Sell",
      render: (_, r) =>
        r?.vendor ? (
          <Tag color={r.vendor.canSell ? "green" : "default"}>
            {r.vendor.canSell ? "Yes" : "No"}
          </Tag>
        ) : (
          "-"
        ),
    },
    {
      title: "Action",
      width: 100,
      render: (_, row) => (
        <Space>
          <Popconfirm
            title="Are you sure to delete this?"
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
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => addNewModalRef.current.openForm(row)}
          />
        </Space>
      ),
    },
  ];

  const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));
  tableColumns[0].fixed = true;
  tableColumns[tableColumns.length - 1].fixed = "right";

  const tableProps = {
    bordered: true,
    loading,
    title: () => <Search qData={qData} setQData={setQData} list={list} />,
    size: "small",
    showHeader: true,
    footer: () => <Pagination qData={qData} setQData={setQData} />,
  };

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
          List of Vendors
        </Space>
      }
      extra={
        <Row justify="end" gutter={12}>
          <Col>
            {selected.length > 0 && (
              <Popconfirm
                title="Are you sure to delete selected vendors?"
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
        dataSource={data}
        scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
      />
      <AddForm
        ref={addNewModalRef}
        list={list}
        categories={categories} // ← pass categories to form
        fetchCategories={fetchCategories} // ← allow form to refresh if needed
      />
    </Card>
  );
}

// ── Search bar ───────────────────────────────────────────────────────────────
function Search({ qData, setQData, list }) {
  return (
    <Form
      onSubmitCapture={() => {
        qData.page = 1;
        list();
      }}
    >
      <Row gutter={[12, 12]}>
        <Col span={6}>
          <Input
            placeholder="Search"
            value={qData.search}
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

// ── Add / Edit modal ─────────────────────────────────────────────────────────
const AddForm = forwardRef(({ list, categories, fetchCategories }, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      if (dt) {
        // Flatten vendor fields into form state for edit
        setData({
          ...dt,
          ownerName: dt?.vendor?.ownerName || dt?.name || "",
          businessName: dt?.vendor?.businessName || "",
          verificationStatus: dt?.vendor?.verificationStatus ?? undefined,
          categories: dt?.vendor?.categories || [],
        });
      } else {
        setData({});
      }
    },
  }));

  // ── CREATE ────────────────────────────────────────────────────────────────
  const saveAdd = () => {
    setAjxRequesting(true);
    const payload = {
      ownerName: data.ownerName,
      businessName: data.businessName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      verificationStatus: data.verificationStatus,
      categories: data.categories || [],
    };
    servicesAdmin
      .add(payload)
      .then((res) => {
        AntdMsg(res.message);
        list();
        setOpen(false);
      })
      .catch((err) => AntdMsg(err.message, "error"))
      .finally(() => setAjxRequesting(false));
  };

  // ── UPDATE ────────────────────────────────────────────────────────────────
  const saveEdit = () => {
    setAjxRequesting(true);
    const payload = {
      verificationStatus: data.verificationStatus,
      categories: data.categories || [],
    };
    servicesAdmin
      .update(data._id, payload)
      .then((res) => {
        AntdMsg(res.message);
        list();
        setOpen(false);
      })
      .catch((err) => AntdMsg(err.message, "error"))
      .finally(() => setAjxRequesting(false));
  };

  const save = () => (data._id ? saveEdit() : saveAdd());
  const isEdit = !!data._id;

  // Category options for Select
const categoryOptions = categories.flatMap((category) => {
  const options = [
    {
      label: category.name,
      value: category._id,
    },
  ];

  if (category.subcategories?.length) {
    category.subcategories.forEach((sub) => {
      options.push({
        label: `${category.name} > ${sub.name}`,
        value: sub._id,
      });

      // If nested subcategories exist
      if (sub.subcategories?.length) {
        sub.subcategories.forEach((child) => {
          options.push({
            label: `${category.name} > ${sub.name} > ${child.name}`,
            value: child._id,
          });
        });
      }
    });
  }
  return options;
});

  return (
    <Modal
      title={isEdit ? "Edit Vendor" : "Add Vendor"}
      style={{ top: 20 }}
      open={open}
      onOk={save}
      okButtonProps={{ disabled: ajxRequesting }}
      onCancel={() => setOpen(false)}
      destroyOnClose
      maskClosable={false}
      width={640}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={save}
          loading={ajxRequesting}
        >
          Save
        </Button>,
      ]}
    >
      <Spin spinning={ajxRequesting}>
        <Form layout="vertical">
          <Row gutter={20}>
            {/* ── CREATE-only fields ──────────────────────────────────── */}
            {!isEdit && (
              <>
                <Col span={12}>
                  <Form.Item label="Owner Name" required>
                    <Input
                      value={data?.ownerName}
                      onChange={(e) =>
                        setData({ ...data, ownerName: e.target.value })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Business Name" required>
                    <Input
                      value={data?.businessName}
                      onChange={(e) =>
                        setData({ ...data, businessName: e.target.value })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email" required>
                    <Input
                      type="email"
                      value={data?.email}
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone" required>
                    <Input
                      maxLength={10}
                      value={data?.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        setData({
                          ...data,
                          phone: value,
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Password" required>
                    <Input.Password
                      value={data?.password}
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                    />
                  </Form.Item>
                </Col>
              </>
            )}

            {/* ── EDIT: read-only context fields ──────────────────────── */}
            {isEdit && (
              <>
                <Col span={12}>
                  <Form.Item label="Owner Name">
                    <Input
                      value={data?.ownerName}
                      onChange={(e) =>
                        setData({ ...data, ownerName: e.target.value })
                      }
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Business Name">
                    <Input
                      value={data?.businessName}
                      onChange={(e) =>
                        setData({ ...data, businessName: e.target.value })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email">
                    <Input
                      value={data?.email}
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone">
                    <Input
                      value={data?.phone}
                      onChange={(e) =>
                        setData({ ...data, phone: e.target.value })
                      }
                    />
                  </Form.Item>
                </Col>
              </>
            )}

            {/* ── Verification Status ──────────────────────────────────── */}
            <Col span={12}>
              <Form.Item label="Verification Status">
                <Select
                  style={{ width: "100%" }}
                  value={data?.verificationStatus}
                  onChange={(value) =>
                    setData({ ...data, verificationStatus: value })
                  }
                  placeholder="Select status"
                  options={VERIFICATION_STATUS_OPTIONS}
                />
              </Form.Item>
            </Col>

            {/* ── Categories (multi-select) ────────────────────────────── */}
            <Col span={24}>
              <Form.Item label="Categories">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Select categories"
                  value={data?.categories?.map((cat) => cat._id || cat) || []}
                  onChange={(values) =>
                    setData({ ...data, categories: values })
                  }
                  options={categoryOptions}
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  maxTagCount="responsive"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});
