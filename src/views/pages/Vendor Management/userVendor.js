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
  Switch,
  Space,
  Modal,
  Select,
  TreeSelect,
  Divider,
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
import servicesCategory from "../../../services/category";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import util from "../../../utils/util";
import { AntdMsg } from "../../../utils/Antd";
import UploadImage from "../../../utils/UploadImage";

export default function UserVendor() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [category, setCategory] = useState([]);
  const [constants, setConstants] = useState({
    role: util.constants()?.ROLES?.VENDOR || null,
    varificationStatus: util.constants()?.VENDOR_STATUS || {},
  });
  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    role: constants?.role,
  });

  const VARIFICATION_STATUS = [
    {
      label: "PENDING",
      value: constants?.varificationStatus?.PENDING,
    },
    {
      label: "APPROVED",
      value: constants?.varificationStatus?.APPROVED,
    },
    {
      label: "REJECTED",
      value: constants?.varificationStatus?.REJECTED,
    },
    {
      label: "UNDER_REVIEW",
      value: constants?.varificationStatus?.UNDER_REVIEW,
    },
  ];

  // Adjust these options according to your backend constants
  const BUSINESS_TYPE_OPTIONS = [
    { label: "Manufacturer", value: 1 },
    { label: "Distributor", value: 2 },
    { label: "Dealer / Retailer", value: 3 },
    { label: "Service Provider", value: 4 },
    { label: "Other", value: 5 },
  ];

  const BUSINESS_ROLE_TYPE_OPTIONS = [
    { label: "Primary", value: 1 },
    { label: "Secondary", value: 2 },
    { label: "Authorized Partner", value: 3 },
  ];

  const addNewModalRef = useRef();

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Business Name",
      render: (_, record) => record?.vendor?.businessName || "-",
    },
    {
      title: "Verification Status",
      render: (text, record) => {
        return (
          Object.entries(constants?.varificationStatus || {}).find(
            ([key, val]) => val === record?.vendor?.verificationStatus
          )?.[0] || "-"
        );
      },
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: 80,
      render: (v, row) => (
        <Space>
          <Popconfirm
            title="Are you sure to delete this?"
            onConfirm={() => deleteData(row?._id)}
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

  function list() {
    setLoading(true);
    servicesAdmin
      .list(qData)
      .then((res) => {
        setData(res?.data?.users?.map((v) => ({ ...v, key: v._id })));
        setQData({
          ...qData,
          limit: res?.data?.pagination?.limit,
          page: res?.data?.pagination?.page,
          total: res?.data?.pagination?.total,
        });
      })
      .catch((e) => {
        message.error(e?.message || "");
      })
      .finally(() => setLoading(false));
  }

  const deleteData = (id) => {
    servicesAdmin
      .delete(id)
      .then((res) => {
        message.success(res?.message);
        list();
        setSelected([]);
      })
      .catch((err) => {
        message.error(err?.message);
      });
  };

  const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));
  tableColumns[0].fixed = true;
  tableColumns[tableColumns.length - 1].fixed = "right";

  const tableProps = {
    bordered: true,
    loading,
    title: () => (
      <Search
        {...{
          qData,
          setQData,
          list,
        }}
      />
    ),
    size: "small",
    showHeader: true,
    footer: () => <Pagination {...{ qData, setQData }} />,
  };

  useEffect(() => {
    list();
  }, [qData?.page, qData?.limit]);

  useEffect(() => {
    servicesCategory.listCategory({ limit: 2000 }).then((res) => {
      setCategory(res?.data?.categories);
    });
  }, []);

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
          List of Vendor
        </Space>
      }
      extra={
        <Row justify="end" gutter={12}>
          <Col>
            {selected.length > 0 && (
              <Popconfirm
                title="Are you sure to delete selected?"
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
      <AddForm
        ref={addNewModalRef}
        {...{
          list,
          constants,
          VARIFICATION_STATUS,
          category,
          BUSINESS_TYPE_OPTIONS,
          BUSINESS_ROLE_TYPE_OPTIONS,
        }}
      />
    </Card>
  );
}

function Search({ qData, setQData, list }) {
  return (
    <Form
      onSubmitCapture={() => {
        setQData((prev) => ({ ...prev, page: 1 }));
        list();
      }}
    >
      <Row gutter={[12, 12]}>
        <Col span={6}>
          <Input
            placeholder="Search"
            value={qData.search}
            onChange={(e) =>
              setQData({ ...qData, search: e.target.value })
            }
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

const AddForm = forwardRef(
  (
    {
      list,
      constants,
      VARIFICATION_STATUS,
      category,
      BUSINESS_TYPE_OPTIONS,
      BUSINESS_ROLE_TYPE_OPTIONS,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});
    const [ajxRequesting, setAjxRequesting] = useState(false);

    useImperativeHandle(ref, () => ({
      openForm(dt) {
        setOpen(true);
        if (dt?.vendor) {
          setData({
            ...dt.vendor,

            // IMPORTANT: keep USER ID for /adminUser/users/:userId
            _id: dt._id,

            address: dt.vendor.address || {},
            documents: dt.vendor.documents || {},
            salesManager: dt.vendor.salesManager || {},
            serviceManager: dt.vendor.serviceManager || {},
            bankDetails: dt.vendor.bankDetails || {},
            serviceAreas: dt.vendor.serviceAreas || [],
            categories: dt.vendor.categories || [],
          });
        } else {
          // Add mode – initialise nested objects
          setData({
            address: {},
            documents: {},
            salesManager: {},
            serviceManager: {},
            bankDetails: {},
            serviceAreas: [],
            categories: [],
          });
        }
      },
    }));

    const updateNested = (parentKey, childKey, value) => {
      setData((prev) => ({
        ...prev,
        [parentKey]: {
          ...(prev[parentKey] || {}),
          [childKey]: value,
        },
      }));
    };

    const saveAdd = () => {
      setAjxRequesting(true);
      servicesAdmin
        .add(data)
        .then((res) => {
          AntdMsg(res.message);
          list();
          setOpen(false);
        })
        .catch((err) => {
          AntdMsg(err.message, "error");
        })
        .finally(() => setAjxRequesting(false));
    };

    const saveEdit = () => {
      setAjxRequesting(true);
      servicesAdmin
        .update(data?._id, data)
        .then((res) => {
          AntdMsg(res.message);
          list();
          setOpen(false);
        })
        .catch((err) => {
          AntdMsg(err.message, "error");
        })
        .finally(() => setAjxRequesting(false));
    };

    const save = () => {
      if (data._id) {
        saveEdit();
      } else {
        saveAdd();
      }
    };

    const convertToTreeData = (categories = []) =>
      categories.map((category) => ({
        title: category?.name,
        value: category?._id,
        key: category?._id,
        children: convertToTreeData(category?.subcategories || []),
      }));

    return (
      <Modal
        title={data._id ? "Edit Vendor" : "Add Vendor"}
        style={{ top: 20 }}
        open={open}
        onOk={save}
        okButtonProps={{ disabled: ajxRequesting }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        maskClosable={false}
        width={1200}
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
            {/* ===================== BASIC INFO ===================== */}
            <Divider orientation="left">Basic Information</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Owner Name" required>
                  <Input
                    value={data?.ownerName}
                    onChange={(e) =>
                      setData({ ...data, ownerName: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Business Name" required>
                  <Input
                    value={data?.businessName}
                    onChange={(e) =>
                      setData({ ...data, businessName: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Can Sell" valuePropName="checked">
                  <Switch
                    checked={data?.canSell === true}
                    onChange={(checked) =>
                      setData({
                        ...data,
                        canSell: checked,
                      })
                    }
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                  />
                </Form.Item>
              </Col>

              {/* <Col span={8}>
                <Form.Item label="Brand Name">
                  <Input
                    value={data?.brandName}
                    onChange={(e) =>
                      setData({ ...data, brandName: e.target.value })
                    }
                  />
                </Form.Item>
              </Col> */}

              <Col span={8}>
                <Form.Item label="Mobile Number" required>
                  <Input
                    value={data?.phone}
                    onChange={(e) =>
                      setData({
                        ...data,
                        phone: util.handleInteger(e.target.value),
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Alternate Phone">
                  <Input
                    value={data?.alternatePhone}
                    onChange={(e) =>
                      setData({
                        ...data,
                        alternatePhone: util.handleInteger(e.target.value),
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Email" required>
                  <Input
                    type="email"
                    autoComplete="off"
                    value={data?.email || ""}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Password"
                  required={!data._id}
                  help={data._id ? "Leave blank to keep existing password" : ""}
                >
                  <Input.Password
                    autoComplete="new-password"
                    value={data?.password || ""}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Website">
                  <Input
                    value={data?.website}
                    onChange={(e) =>
                      setData({ ...data, website: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Logo"
                  extra={
                    <span style={{ fontSize: "12px", color: "#888" }}>
                      Recommended: square image (max 5 MB)
                    </span>
                  }
                >
                  <UploadImage
                    value={data?.logo ? [{ url: data.logo }] : []}
                    count={1}
                    onChange={(v) =>
                      setData({
                        ...data,
                        logo: v?.[0]?.url || "",
                      })
                    }
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Verification Status">
                  <Select
                    style={{ width: "100%" }}
                    value={data?.verificationStatus}
                    onChange={(value) =>
                      setData({ ...data, verificationStatus: value })
                    }
                    options={(VARIFICATION_STATUS || []).map((cat) => ({
                      label: cat.label,
                      value: cat.value,
                    }))}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Business Type">
                  <Select
                    style={{ width: "100%" }}
                    value={data?.businessType}
                    onChange={(value) =>
                      setData({ ...data, businessType: value })
                    }
                    options={BUSINESS_TYPE_OPTIONS}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Business Role Type">
                  <Select
                    style={{ width: "100%" }}
                    value={data?.businessRoleType}
                    onChange={(value) =>
                      setData({ ...data, businessRoleType: value })
                    }
                    options={BUSINESS_ROLE_TYPE_OPTIONS}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== TAX / LEGAL ===================== */}
            <Divider orientation="left">Tax & Legal</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="GST Number">
                  <Input
                    value={data?.gstNumber}
                    onChange={(e) =>
                      setData({ ...data, gstNumber: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="PAN Number">
                  <Input
                    value={data?.panNumber}
                    onChange={(e) =>
                      setData({ ...data, panNumber: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Authorized Dealer Certificate No.">
                  <Input
                    value={data?.authorizedDealerCertificateNumber}
                    onChange={(e) =>
                      setData({
                        ...data,
                        authorizedDealerCertificateNumber: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== ADDRESS ===================== */}
            <Divider orientation="left">Address</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Address Line 1">
                  <Input
                    value={data?.address?.line1}
                    onChange={(e) =>
                      updateNested("address", "line1", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Address Line 2">
                  <Input
                    value={data?.address?.line2}
                    onChange={(e) =>
                      updateNested("address", "line2", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="City">
                  <Input
                    value={data?.address?.city}
                    onChange={(e) =>
                      updateNested("address", "city", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="State">
                  <Input
                    value={data?.address?.state}
                    onChange={(e) =>
                      updateNested("address", "state", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Pincode">
                  <Input
                    value={data?.address?.pincode}
                    onChange={(e) =>
                      updateNested("address", "pincode", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Country">
                  <Input
                    value={data?.address?.country}
                    onChange={(e) =>
                      updateNested("address", "country", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== SERVICE AREAS ===================== */}
            <Divider orientation="left">Service Areas</Divider>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Service Areas">
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    value={data?.serviceAreas || []}
                    onChange={(value) =>
                      setData({ ...data, serviceAreas: value })
                    }
                    placeholder="Type and press Enter"
                    tokenSeparators={[","]}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== CATEGORIES ===================== */}
            <Divider orientation="left">Allowed Categories</Divider>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Categories" required>
                  <TreeSelect
                    style={{ width: "100%" }}
                    treeData={convertToTreeData(category || [])}
                    value={data?.categories}
                    onChange={(value) =>
                      setData({ ...data, categories: value })
                    }
                    treeCheckable
                    showSearch
                    allowClear
                    treeNodeFilterProp="title"
                    maxTagCount="responsive"
                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                    treeExpandAction="click"
                    placeholder="Select Allowed Categories"
                  />
                </Form.Item>
                {data.categories?.length > 0 && (
                  <div style={{ marginTop: -8, marginBottom: 16 }}>
                    <b>Selected:</b> {data.categories.length} categories
                  </div>
                )}
              </Col>
            </Row>

            {/* ===================== MANAGERS ===================== */}
            <Divider orientation="left">Sales Manager</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Name">
                  <Input
                    value={data?.salesManager?.name}
                    onChange={(e) =>
                      updateNested("salesManager", "name", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Phone">
                  <Input
                    value={data?.salesManager?.phone}
                    onChange={(e) =>
                      updateNested(
                        "salesManager",
                        "phone",
                        util.handleInteger(e.target.value)
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Email">
                  <Input
                    value={data?.salesManager?.email}
                    onChange={(e) =>
                      updateNested("salesManager", "email", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Service Manager</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Name">
                  <Input
                    value={data?.serviceManager?.name}
                    onChange={(e) =>
                      updateNested("serviceManager", "name", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Phone">
                  <Input
                    value={data?.serviceManager?.phone}
                    onChange={(e) =>
                      updateNested(
                        "serviceManager",
                        "phone",
                        util.handleInteger(e.target.value)
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Email">
                  <Input
                    value={data?.serviceManager?.email}
                    onChange={(e) =>
                      updateNested("serviceManager", "email", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== BANK DETAILS ===================== */}
            <Divider orientation="left">Bank Details</Divider>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Account Holder">
                  <Input
                    value={data?.bankDetails?.accountHolder}
                    onChange={(e) =>
                      updateNested(
                        "bankDetails",
                        "accountHolder",
                        e.target.value
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Account Number">
                  <Input
                    value={data?.bankDetails?.accountNumber}
                    onChange={(e) =>
                      updateNested(
                        "bankDetails",
                        "accountNumber",
                        e.target.value
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="IFSC Code">
                  <Input
                    value={data?.bankDetails?.ifscCode}
                    onChange={(e) =>
                      updateNested("bankDetails", "ifscCode", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Bank Name">
                  <Input
                    value={data?.bankDetails?.bankName}
                    onChange={(e) =>
                      updateNested("bankDetails", "bankName", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== DOCUMENTS ===================== */}
            {/* ===================== DOCUMENTS ===================== */}
            <Divider orientation="left">Documents</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="GST Certificate">
                  <UploadImage
                    value={
                      data?.documents?.gstCertificate
                        ? [{ url: data.documents.gstCertificate }]
                        : []
                    }
                    count={1}
                    onChange={(v) =>
                      updateNested(
                        "documents",
                        "gstCertificate",
                        v?.[0]?.url || ""
                      )
                    }
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="PAN Card">
                  <UploadImage
                    value={
                      data?.documents?.panCard
                        ? [{ url: data.documents.panCard }]
                        : []
                    }
                    count={1}
                    onChange={(v) =>
                      updateNested("documents", "panCard", v?.[0]?.url || "")
                    }
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Dealer Authorization">
                  <UploadImage
                    value={
                      data?.documents?.dealerAuthorization
                        ? [{ url: data.documents.dealerAuthorization }]
                        : []
                    }
                    count={1}
                    onChange={(v) =>
                      updateNested(
                        "documents",
                        "dealerAuthorization",
                        v?.[0]?.url || ""
                      )
                    }
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Business License">
                  <UploadImage
                    value={
                      data?.documents?.businessLicense
                        ? [{ url: data.documents.businessLicense }]
                        : []
                    }
                    count={1}
                    onChange={(v) =>
                      updateNested(
                        "documents",
                        "businessLicense",
                        v?.[0]?.url || ""
                      )
                    }
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Cancelled Cheque">
                  <UploadImage
                    value={
                      data?.documents?.cancelledCheque
                        ? [{ url: data.documents.cancelledCheque }]
                        : []
                    }
                    count={1}
                    onChange={(v) =>
                      updateNested(
                        "documents",
                        "cancelledCheque",
                        v?.[0]?.url || ""
                      )
                    }
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>

              {/* Multiple images */}
              <Col span={12}>
                <Form.Item label="Office Photos">
                  <UploadImage
                    value={(data?.documents?.officePhotos || []).map((url) => ({
                      url,
                    }))}
                    count={10}          // allow multiple
                    onChange={(v) =>
                      updateNested(
                        "documents",
                        "officePhotos",
                        (v || []).map((item) => item.url).filter(Boolean)
                      )
                    }
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Warehouse Photos">
                  <UploadImage
                    value={(data?.documents?.warehousePhotos || []).map((url) => ({
                      url,
                    }))}
                    count={10}
                    onChange={(v) =>
                      updateNested(
                        "documents",
                        "warehousePhotos",
                        (v || []).map((item) => item.url).filter(Boolean)
                      )
                    }
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
);