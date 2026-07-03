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
import util from "../../utils/util";
import { AntdMsg } from "../../utils/Antd";
import UploadImage from "../../utils/UploadImage";
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

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      width: 50,
      render: (text, record, index) =>
        index + 1 + (qData.page - 1) * qData.limit,
    },

    {
      title: "Name",
      dataIndex: "name",
      render: (name) => name || "Not Specified",
    },
    {
      title: "Sort Order",
      dataIndex: "sortOrder",
      width: 90,
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
          onChange={() => toggleHandler(record?._id)}
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
          {/* <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => brandViewModal.current.openForm(row)}
          /> */}
        </Space>
      ),
    },
  ];

  function list() {
    setLoading(true);
    BrandsService.getAll(qData)
      .then((res) => {
        setData(res?.data?.brands?.map((v) => ({ ...v, key: v._id })));
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
    setLoading(true);
    BrandsService.delete(id)
      .then((res) => {
        message.success("Deleted successfully");
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
        message.success("Status updated");
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
  }, [qData?.page, qData?.limit]);

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
      <AddForm ref={addNewModalRef} list={list} />

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

const AddForm = forwardRef(({ list }, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { ...dt } : {});
    },
  }));

  const handleChange = (value) => setData((prev) => ({ ...prev, ...value }));

  const saveAdd = () => {
    setAjxRequesting(true);
    BrandsService
      .addBrand(data)
      .then((res) => {
        AntdMsg(res?.message);
        list();
        setOpen(false);
      })
      .catch((err) => {
        AntdMsg(err?.message, "error");
      })
      .finally(() => setAjxRequesting(false));
  };

  const saveEdit = () => {
    setAjxRequesting(true);
    BrandsService
      .updateBrand(data?._id, data)
      .then((res) => {
        AntdMsg(res?.message);
        list();
        setOpen(false);
      })
      .catch((err) => {
        AntdMsg(err?.message, "error");
      })
      .finally(() => setAjxRequesting(false));
  };

  const save = () => {
    if (data?._id) {
      saveEdit();
    } else {
      saveAdd();
    }
  };

  return (
    <Modal
      title={data?._id ? "Edit Brand" : "Add Brand"}
      style={{ top: 20 }}
      open={open}
      onOk={save}
      okButtonProps={{ disabled: ajxRequesting }}
      onCancel={() => setOpen(false)}
      destroyOnClose
      maskClosable={false}
      width={800}
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
          <Row gutter={20} style={{ marginTop: 20 }}>
            <Col span={12}>
              <Form.Item label="Name">
                <Input
                  value={data?.name}
                  onChange={(e) => handleChange({ name: e.target.value })}
                  placeholder="Nike"
                />
              </Form.Item>
            </Col>
             <Col span={12}>
              <Form.Item label="Website Link">
                <Input
                  value={data?.website}
                  onChange={(e) =>
                    handleChange({ website: e.target.value })
                  }
                  placeholder="https://www.nike.com"
                  rows={4}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Description">
                <Input.TextArea
                  value={data?.description}
                  onChange={(e) =>
                    handleChange({ description: e.target.value })
                  }
                  placeholder="Special brand description"
                  rows={4}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Sort Order">
                <Input
                  value={data?.sortOrder}
                  onChange={(e) =>
                    handleChange({ sortOrder: util.handleInteger(e.target.value) })
                  }
                  placeholder=""
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item label="Active">
                <Switch
                  checked={data?.isActive}
                  onChange={(v) => handleChange({ isActive: v })}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Upload Logo"
              // extra={
              //   <span style={{ fontSize: "12px", color: "#888" }}>
              //     Recommended:size 400×242px (max 5 MB) for good design
              //     standards.
              //   </span>
              // }
              >
                <UploadImage
                  value={data?.logo ? [{ url: data?.logo }] : []} // wrap single value in array
                  count={1} // single file only
                  // requiredWidth={400}
                  // requiredHeight={242}
                  onChange={(v) =>
                    handleChange({
                      logo: v?.[0]?.url || "", // store only first file's URL
                    })
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
});

