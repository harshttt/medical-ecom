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
import servicesUser from "../../../services/user";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
// import UploadImage from '../../utils/UploadImage';
import moment from "moment";
import util from "../../../utils/util";
import dayjs from "dayjs";
import UserDetail from ".";
// import UserDetail from ".";

export default function User() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const roles = util.constants()?.ROLES || {};

  const [UserConstants, setUserConstants] = useState({
    role: roles.USER || 4, // fallback
    userStatus: util.constants()?.USER_STATUS || {},
  });

  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    role: roles.USER || 4, // fallback
  });

  const addNewModalRef = useRef();
  const userViewModal = useRef();

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
      title: "Mobile Number",
      dataIndex: "phone",
      render: (phone) => phone || "Not Specified",
    },

    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      render: (v) => (v ? dayjs(v)?.format("DD MMM YYYY") : "-"),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => email || "Not Specified",
    },
    {
      title: "Block",
      dataIndex: "status",
      render: (v, record) => (
        <Switch
          checked={v === UserConstants?.userStatus?.BLOCKED}
          onChange={() => blockHandler(record?._id)}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      ),
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
            icon={<EyeOutlined />}
            onClick={() => userViewModal.current.openForm(row)}
          />
        </Space>
      ),
    },
  ];

  function list() {
    setLoading(true);
    servicesUser
      .listUser(qData)
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
        message.error(e?.message || "Something went wrong");
      })
      .finally(() => setLoading(false));
  }


  const deleteData = (id) => {
    setLoading(true);
    servicesUser
      .delete(id)
      .then((res) => {
        message.success(res?.message || "Deleted successfully");
        list();
        setSelected([]);
      })
      .catch((err) => {
        message.error(err?.message || "Failed to delete user");
      })
      .finally(() => setLoading(false));
  };
  const blockHandler = (id) => {
    setLoading(true);
    servicesUser
      .userBlock(id)
      .then((res) => {
        list();
        message.success(res?.message);

        setSelected([]);
      })
      .catch((err) => {
        message.error(err?.message);
      })
      .finally(() => setLoading(false));
  };

  const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

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
          List of Users
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
      {/* <AddForm ref={addNewModalRef} list={list} /> */}
      <ViewUserModal ref={userViewModal} />
    </Card>
  );
}

function Search({ qData, setQData, list }) {
  return (
    <Form
      onSubmitCapture={() => {
        qData.page = 1; // Reset page on search
        list();
      }}
    >
      <Row gutter={12}>
        <Col span={6}>
          <Input
            placeholder="Search  "
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

const ViewUserModal = forwardRef((props, ref) => {
  const { } = props;
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
      title={data?.name || "User Details"}
      destroyOnClose
      maskClosable={false}
      open={open}
      footer={<Button onClick={() => setOpen(false)}>Close</Button>}
      onCancel={() => setOpen(false)}
      width={1200}
    >
      <UserDetail {...{ data }} />
    </Modal>
  );
});
