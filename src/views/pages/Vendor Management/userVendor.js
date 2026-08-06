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
  Cascader,
  TreeSelect,
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
// import UploadImage from '../../utils/UploadImage';
import util from "../../../utils/util";
import { AntdMsg } from "../../../utils/Antd";
const { SHOW_CHILD } = Cascader;

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

  const addNewModalRef = useRef();
  console.log(constants);
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

  const activeHandler = (id) => {
    servicesAdmin
      .toggle(id)
      .then((res) => {
        message.success(res?.message || "Status updated successfully");
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
    servicesCategory.listCategory().then((res) => {
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
                title="Are you sure to delete selected images?"
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
      <AddForm ref={addNewModalRef} {...{ list, constants, VARIFICATION_STATUS, category }} />
    </Card>
  );
}

function Search({ qData, setQData, list, }) {
  return (
    <Form onSubmitCapture={() => {
      qData.page = 1; // Reset page on search // Reset page on search
      list();
    }}>
      <Row gutter={[12, 12]}>
        <Col span={6}>
          <Input
            placeholder="Search"
            value={qData.key}
            onChange={(e) => setQData({ ...qData, search: e.target.value })}
            allowClear
          />
        </Col>

        {/* Search Button */}
        <Col span={3}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

const AddForm = forwardRef(({ list, constants, VARIFICATION_STATUS, category }, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { ...dt?.vendor } : {});
    },
  }));

  const handleChange = (value) => setData((prev) => ({ ...prev, ...value }));

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
      width={1500}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={save}>
          Save
        </Button>,
      ]}
    >
      <Spin spinning={ajxRequesting}>
        <Form layout="vertical">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Owner Name" required>
                <Input

                  value={data?.ownerName}
                  onChange={(e) => setData({ ...data, ownerName: e.target.value })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="BusinessName" required>
                <Input
                  //   disabled={id ? true : false}
                  value={data?.businessName}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mobile Number" required>
                <Input
                  //   disabled={id ? true : false}
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
            {/* Email */}
            <Col span={12}>
              <Form.Item label="Email" required>
                <Input
                  type="email"
                  autoComplete="off"                 // or "new-email"
                  name="vendorEmail"                 // optional extra help
                  value={data?.email || ""}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </Form.Item>
            </Col>

            {/* Password */}
            <Col span={12}>
              <Form.Item label="Password" required>
                <Input
                  type="password"
                  autoComplete="new-password"        // most reliable for password fields
                  name="vendorPassword"
                  value={data?.password || ""}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Verification Status" >
                <Select
                  style={{ width: "100%" }}
                  value={data?.verificationStatus}
                  onChange={(value) =>
                    setData({ ...data, verificationStatus: value })
                  }
                  placeholder=""
                  options={(VARIFICATION_STATUS || []).map((cat) => ({
                    label: cat.label,
                    value: cat.value,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Allowed Categories" required>
                <TreeSelect
                  style={{ width: "100%" }}
                  treeData={convertToTreeData(category || [])}
                  value={data?.categories}
                  onChange={(value) =>
                    setData({
                      ...data,
                      categories: value,
                    })
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
            </Col>
            <Col span={24}>
              {data.categories?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <b>Selected:</b> {data.categories.length} categories
                </div>
              )}
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});
