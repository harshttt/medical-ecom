/* eslint-disable react-hooks/exhaustive-deps */
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Popconfirm,
  Modal,
  Spin,
  Typography,
  Select,
  Input,
  Tag,
  Image,
  Switch,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import Pagination from "../components/Pagination";
import service from "../../services/category";
import { AntdMsg } from "../../utils/Antd";
import UploadImage from "../../utils/UploadImage";
import dayjs from "dayjs";
import util from "../../utils/util";

export default function Category({ parentId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [qData, setQData] = useState({ page: 1, limit: 10, parentCategory: parentId });
  const addNewModalRef = useRef();
  const addSubNewModalRef = useRef();

  const columns = [
    {
      title: "#",
      width: 40,
      render: (v, row, i) => <b>{i + 1}</b>,
    },
    {
      title: "Image",
      dataIndex: "image_url",
      width: 100,
      render: (v) =>
        v ? <Image src={v} height={60} style={{ objectFit: "cover" }} /> : "-",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      width: 150,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "-"),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Order",
      dataIndex: "sortOrder",
      width: 80,
    },
    
    {
      title: "Active",
      dataIndex: "isActive",
       width: 80,
      render: (isActive, record) => (
        <Switch
          
          checked={record?.isActive}
          onChange={() => activeHandler(record?._id)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    // {
    //   title: "Sub-Menu",
    //   width: 100,
    //   render: (v, row) => (
    //     <Button
         
    //       size="small"
    //       onClick={() => addSubNewModalRef.current.openForm(row)}
    //     >
    //       SubMenu
    //     </Button>
    //   ),
    // },
    {
      title: "Action",
      dataIndex: "_id",
      width: 80,
      render: (v, row) => (
        <>
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
          &nbsp;
          <Button
           
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => addNewModalRef.current.openForm(row)}
          />
        </>
      ),
    },
  ];

  function list() {
    setLoading(true);
    service
      .listCategory({ ...qData })
      .then((res) => {
        setData(res?.data?.categories?.map((v) => ({ ...v, key: v._id })));
        setQData({
          ...qData,
          limit: res?.data?.pagination?.limit,
          page: res?.data?.pagination?.page,
          total: res?.data?.pagination?.total,
        });
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }

  const deleteData = (ids) => {
    service
      .delete(ids)
      .then((res) => {
        AntdMsg(res.message);
        list();
        setSelected([]);
      })
      .catch((err) => {
        AntdMsg(err.message, "error");
      });
  };

  const activeHandler = (id) => {
    setLoading(true);
    service
      .toggleCategory(id)
      .then((res) => {
        list();
        message.success("successfully updated");
        setSelected([]);
      })
      .catch((err) => {
        message.error(err?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const tableProps = {
    bordered: true,
    loading,
    size: "small",
    title: () => (
      <Search
        {...{ addNewModalRef, selected, deleteData, qData, setQData, list,  }}
      />
    ),
    showHeader: true,
    footer: () => <Pagination {...{ qData, setQData }} />,
    rowSelection: {
      onChange: (selectedRowKeys) => setSelected(selectedRowKeys),
    },
    tableLayout: undefined,
  };

  useEffect(() => {
      list();
  }, [qData.page, qData.limit]);

  return (
    <>
      {!parentId && (
        <Typography.Title level={5} style={{ marginTop: 0 }}>
          List of Categories
        </Typography.Title>
      )}
      <Table
        {...tableProps}
        pagination={false}
        columns={columns}
        dataSource={data.length ? data : []}
        scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
      />
      <AddForm ref={addNewModalRef} {...{ list, parentId }} />
      <NewForm ref={addSubNewModalRef} />
    </>
  );
}

function Search({
  addNewModalRef,
  selected,
  deleteData,
  qData,
  setQData,
  list,
  
}) {
  const onChange = (v, key) => {
    const newQ = { ...qData, [key]: v };
    if (v === undefined || v === "") delete newQ[key];
    setQData(newQ);
  };

  return (
    <Form onSubmitCapture={() => {
      qData.page = 1; // Reset page on search // Reset page on search
      list();
    }} className="search-form">
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item style={{ marginBottom: 0 }}>
            <Input
              placeholder="Search by name"
              defaultValue={qData?.key}
              onChange={(e) => onChange(e.target.value, "search")}
              allowClear
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
          <Select
            placeholder="Filter by Status"
            value={qData?.active ?? undefined} // nullish coalescing
            onChange={(value) => setQData({ ...qData, active: value })}
            style={{ width: "100%" }}
            allowClear
            options={[
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
          />
        </Col>
        <Col xs={24} sm={12} md={4} lg={2}>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={14} style={{ textAlign: "right" }}>
          <Form.Item style={{ marginBottom: 0, float: "right" }}>
            <Button
             
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => addNewModalRef.current.openForm()}
            >
              Add New
            </Button>
          </Form.Item>
          {selected.length > 0 && (
            <Popconfirm
              title="Delete selected?"
              onConfirm={() => deleteData(selected)}
            >
              <Button
               
                type="primary"
                danger
                style={{ float: "right" }}
                icon={<DeleteOutlined />}
              >
                Delete Selected
              </Button>
            </Popconfirm>
          )}
        </Col>
      </Row>
    </Form>
  );
}

const AddForm = forwardRef((props, ref) => {
  const { list, parentId, } = props;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

  const handleChange = (value) => setData((prev) => ({ ...prev, ...value }));

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(
        dt
          ? dt
          : { parentCategory: parentId, isActive: true, }
      );
    },
  }));

  console.log("AddForm data:", data);

  const saveAdd = () => {
    setAjxRequesting(true);
    service
      .addCategory(data)
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
    service
      .updateCategory(data?._id, data)
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

  useEffect(() => {
    if (!data._id && parentId && open) {
      handleChange({ parentCategory: parentId });
    }
  }, [parentId, open]);

  useEffect(() => {
    if (data._id && open) {
      handleChange({ slug: util.removeSpecialChars(data?.name) });
    } 
  }, [data?.name,]);



  return (
    <Modal
      title={`${data._id ? "Edit" : "Add"} Category`}
      style={{ top: 20 }}
      open={open}
      onCancel={() => setOpen(false)}
      destroyOnClose
      maskClosable={false}
      width={800}
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
      <Spin
        spinning={ajxRequesting}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Form layout="vertical">
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Form.Item label="Name" required>
                <Input
                  value={data?.name}
                  onChange={(e) => handleChange({ name: e.target.value })}
                  placeholder="Category Name"
                />
              </Form.Item>
            </Col>
          
            <Col span={12}>
              <Form.Item label="Display Order">
                <Input
                  type="number"
                  value={data?.sortOrder}
                  onChange={(e) =>
                    handleChange({ sortOrder: Number(e.target.value) })
                  }
                  placeholder="1"
                />
              </Form.Item>
            </Col>
           
            <Col span={12}>
              <Form.Item label="Status">
                <Select
                  value={data?.isActive}
                  onChange={(v) => handleChange({ isActive: v })}
                >
                  <Select.Option value={true}>Active</Select.Option>
                  <Select.Option value={false}>Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Description">
                <Input.TextArea
                  rows={3}
                  value={data?.description}
                  onChange={(e) =>
                    handleChange({ description: e.target.value })
                  }
                  placeholder="Description..."
                />
              </Form.Item>
            </Col>
            
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});

const NewForm = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData({ ...dt });
    },
  }));

  return (
    <Modal
      title={
        <span>
          Subcategories of <span style={{ color: "red" }}>{data.name}</span>
        </span>
      }
      style={{ top: 20 }}
      open={open}
      onCancel={() => setOpen(false)}
      destroyOnClose
      maskClosable={false}
      width={1200}
      footer={null}
    >
      <Category parentId={data?._id} />
    </Modal>
  );
});
