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
  Drawer,
  Tag,
  Modal,
  Select,
  Switch,
  Cascader,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
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
import servicesExternal from "../../services/externalServices";
import servicesCategory from "../../services/category";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
// import UploadImage from '../../utils/UploadImage';
import moment from "moment";
import util from "../../utils/util";
import { AntdMsg } from "../../utils/Antd";
const { SHOW_CHILD } = Cascader;

export default function Services() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [category, setCategory] = useState([]);
  const [servicesConstants, setServicesConstants] = useState(
    util.constants()?.INTEGRATION || {}
  );
  const [qData, setQData] = useState({ page: 1, limit: 2 });

  const addNewModalRef = useRef();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Active",
      dataIndex: "is_active",
      render: (is_active, record) => (
        <Switch
          checked={record?.is_active}
          onChange={() => activeHandler(record._id)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
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

  function list() {
    setLoading(true);
    servicesExternal
      .listServices(qData)
      .then((res) => {
        setData(res?.data?.map((v) => ({ ...v, key: v._id })));
        setQData({
          ...qData,
          limit: res?.pagination?.pageSize,
          page: res?.pagination?.currentPage,
          total: res?.pagination?.totalItems,
        });
      })
       .catch((e) => {
        message.error(e?.message||"");
      })
      .finally(() => setLoading(false));
  }

  const deleteData = (id) => {
    servicesExternal
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
    setLoading(true);
    servicesExternal
      .toggleServices(id)
      .then((res) => {
        list();
        message.success("Service status updated successfully");

        setSelected([]);
      })
      .catch((err) => {
        message.error(err?.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    list();
  }, [qData.page, qData.limit]);

  const tableProps = {
    bordered: true,
    loading,
    size: "small",
    showHeader: true,
    footer: () => <Pagination {...{ qData, setQData }} />,
  };

  //   function buildCategoryTree(data) {
  //     const map = {};
  //     const roots = [];

  //     data.forEach((item) => {
  //       map[item._id] = {
  //         label: item?.name,
  //         value: item?._id,
  //         children: [],
  //       };
  //     });

  //     data.forEach((item) => {
  //       if (item?.parent_category) {
  //         map[item?.parent_category]?.children.push(map[item._id]);
  //       } else {
  //         roots.push(map[item._id]);
  //       }
  //     });

  //     // Remove empty children arrays
  //     function clean(node) {
  //       if (!node.children?.length) {
  //         delete node.children;
  //       } else {
  //         node.children?.forEach(clean);
  //       }
  //     }

  //     roots.forEach(clean);
  //     return roots;
  //   }

  //   useEffect(() => {

  //     servicesCategory.listCategory().then((res) => {
  //       console.log("Category Data:", res?.data);

  //       const treeData = buildCategoryTree(res?.data);
  //       console.log("Category Tree:", treeData);

  //       setCategory(treeData || []);
  //     });
  //   }, [qData.page, qData.limit]);

  // useEffect(() => {
  //   servicesCategory.listCategory().then((res) => {
  //     console.log("Category Data:", res?.data);
  //     setCategory(res?.data);
  //   });
  // }, [qData.page, qData.limit]);
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
          List of Services
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
        columns={columns}
        dataSource={data.length ? data : []}
        scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
      />
      <AddForm ref={addNewModalRef} {...{ list, servicesConstants }} />
    </Card>
  );
}

const AddForm = forwardRef(({ list, servicesConstants }, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { ...dt } : {});
    },
  }));

  const SERVICE_TYPES = [
    { label: "SMS", value: servicesConstants?.TYPE?.SMS },
    { label: "EMAIL", value: servicesConstants?.TYPE?.EMAIL },
    { label: "PAYMENT", value: servicesConstants?.TYPE?.PAYMENT },
    { label: "ASTROLOGY", value: servicesConstants?.TYPE?.ASTROLOGY },
    { label: "OTHER", value: servicesConstants?.TYPE?.OTHER },
    { label: "OAUTH", value: servicesConstants?.TYPE?.OAUTH },
    { label: "CALL", value: servicesConstants?.TYPE?.CALL },
    { label: "SHIPPING", value: servicesConstants?.TYPE?.SHIPPING },
    { label: "APP_OAUTH", value: servicesConstants?.TYPE?.APP_OAUTH },
  ];
  const SERVICE_PROVIDER = [
    { label: "TWILIO", value: servicesConstants?.PROVIDER?.TWILIO },
    { label: "FAST2SMS", value: servicesConstants?.PROVIDER?.FAST2SMS },
    { label: "SENDGRID", value: servicesConstants?.PROVIDER?.SENDGRID },
    { label: "MAILGUN", value: servicesConstants?.PROVIDER?.MAILGUN },
    { label: "RAZORPAY", value: servicesConstants?.PROVIDER?.RAZORPAY },
    { label: "PAYTM", value: servicesConstants?.PROVIDER?.PAYTM },
    { label: "STRIPE", value: servicesConstants?.PROVIDER?.STRIPE },
    {
      label: "VEDICASTROAPI",
      value: servicesConstants?.PROVIDER?.VEDICASTROAPI,
    },
    {
      label: "ASTRO_API",
      value: servicesConstants?.PROVIDER?.ASTRO_API,
    },

    {
      label: "CUSTOM",
      value: servicesConstants?.PROVIDER?.CUSTOM,
    },
    {
      label: "GOOGLE",
      value: servicesConstants?.PROVIDER?.GOOGLE,
    },
    {
      label: "FACEBOOK",
      value: servicesConstants?.PROVIDER?.FACEBOOK,
    },
    {
      label: "APPLE",
      value: servicesConstants?.PROVIDER?.APPLE,
    },
    {
      label: "AGORA",
      value: servicesConstants?.PROVIDER?.AGORA,
    },
    {
      label: "PHONEPAY",
      value: servicesConstants?.PROVIDER?.PHONEPAY,
    },
    {
      label: "SHIPROCKET",
      value: servicesConstants?.PROVIDER?.SHIPROCKET,
    },
     {
      label: "DELHIVERY",
      value: servicesConstants?.PROVIDER?.DELHIVERY,
    },
     {
      label: "BLUEDART",
      value: servicesConstants?.PROVIDER?.BLUEDART,
    },
  ];
  const handleChange = (value) => setData((prev) => ({ ...prev, ...value }));

  const saveAdd = () => {
    setAjxRequesting(true);
    servicesExternal
      .addServices(data)
      .then((res) => {
        console.log("Add Services Response:", res);
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
    servicesExternal
      .updateServices(data._id, data)
      .then((res) => {
        AntdMsg(res.message);
        list();
        setOpen(false);
      })
      .catch((err) => {
        AntdMsg(err.error, "error");
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

  console.log("Add Form Data:", data);

  return (
    <Modal
      title={data._id ? "Edit Services" : "Add Services"}
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
              <Form.Item label="Name" required>
                <Input
                  value={data?.name}
                  onChange={(e) => handleChange({ name: e.target.value })}
                  placeholder="Enter API Name"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Type" required>
                <Select
                  style={{ width: "100%" }}
                  value={data?.type}
                  onChange={(value) => handleChange({ type: value })}
                  placeholder="Select service type"
                  options={SERVICE_TYPES}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Provider" required>
                <Select
                  style={{ width: "100%" }}
                  value={data?.provider}
                  onChange={(value) => handleChange({ provider: value })}
                  placeholder="Select service type"
                  options={SERVICE_PROVIDER}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="API Key" required>
                <Input
                  value={data?.api_key}
                  onChange={(e) => handleChange({ api_key: e.target.value })}
                  placeholder="API Key"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="API Secret" required>
                <Input
                  value={data?.api_secret}
                  onChange={(e) => handleChange({ api_secret: e.target.value })}
                  placeholder="API Secret"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Base URL" required>
                <Input
                  value={data?.base_url}
                  onChange={(e) => handleChange({ base_url: e.target.value })}
                  placeholder="https://api.vedicastroapi.com"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <ExtraConfigInput data={data} handleChange={handleChange} />
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});

function ExtraConfigInput({ data, handleChange }) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const extraConfig = data?.extra_config || {};

  const onValueChange = (key, value) => {
    const updated = { ...extraConfig, [key]: value };
    handleChange({ extra_config: updated });
  };

  const onRemove = (key) => {
    const updated = { ...extraConfig };
    delete updated[key];
    handleChange({ extra_config: updated });
  };

  const onAdd = () => {
    if (!newKey) return;
    const updated = { ...extraConfig, [newKey]: newValue };
    handleChange({ extra_config: updated });
    setNewKey("");
    setNewValue("");
  };

  return (
    <Form.Item label="Extra Config (Key-Value)">
      {Object.entries(extraConfig).map(([key, value], index) => (
        <Row key={key + index} gutter={8} style={{ marginBottom: 8 }}>
          <Col span={10}>
            <Input value={key} disabled />
          </Col>
          <Col span={10}>
            <Input
              value={value}
              onChange={(e) => onValueChange(key, e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Button danger onClick={() => onRemove(key)} block>
              Remove
            </Button>
          </Col>
        </Row>
      ))}

      <Row gutter={8}>
        <Col span={10}>
          <Input
            placeholder="New key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
        </Col>
        <Col span={10}>
          <Input
            placeholder="New value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
        </Col>
        <Col span={4}>
          <Button type="dashed" onClick={onAdd} block>
            Add
          </Button>
        </Col>
      </Row>
    </Form.Item>
  );
}
