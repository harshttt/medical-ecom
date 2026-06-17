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
import servicesCategory from "../../../services/blog-category";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
// import UploadImage from '../../utils/UploadImage';
import moment from "moment";
import util from "../../../utils/util";
import { AntdMsg } from "../../../utils/Antd";
const { SHOW_CHILD } = Cascader;

export default function BlogCategory() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [category, setCategory] = useState([]);
  const [qData, setQData] = useState({ page: 1, limit: 10 });

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
      title: "Action",
      dataIndex: "_id",
      width: 80,
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
    servicesCategory
      .listCategory(qData)
      .then((res) => {
        console.log("Blog Category Data:", res);
        setData(res?.categories?.map((v) => ({ ...v, key: v._id })));
        setQData({
          ...qData,
          limit: res?.pagination?.pageSize,
          page: res?.pagination?.currentPage,
          total: res?.pagination?.totalItems,
        });
      })
      .catch(() => {
        message.error("Failed to fetch data");
      })
      .finally(() => setLoading(false));
  }

  const deleteData = (id) => {
    servicesCategory
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
    servicesCategory
      .userToggle(id)
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
          List of Blog Category
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
        dataSource={data?.length ? data : []}
        scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
      />
      <AddForm ref={addNewModalRef} {...{ list }} />
    </Card>
  );
}

function Search({
  qData,
  setQData,
  list,
  
}) {
  return (
    <Form onSubmitCapture={() => {
      qData.page=1 // Reset page on search
      list();
    }} >
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
    servicesCategory
      .addCategory(data)
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
    servicesCategory
      .updateCategory(data._id, data)
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

  return (
    <Modal
      title={data._id ? "Edit Blog Category" : "Add Blog Category"}
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
                  placeholder="Name of the blog category"
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
                  placeholder="Description of the blog category"
                  rows={4}
                />
              </Form.Item>
            </Col>

            

            {/* <Col span={24}>
              <Form.Item label="Upload Cover Image" >
                <UploadImage
                  value={data?.image_url ? [data.image_url] : []}
                  count={1}
                  onChange={(v) => handleChange({ image_url: v?.[0] })}
                  listType="picture-card"
                />
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});
