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
  CloseOutlined,
} from "@ant-design/icons";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import servicesBlogs from "../../../services/blog";
import servicesCategory from "../../../services/blog-category";

import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
// import UploadImage from '../../utils/UploadImage';
import moment from "moment";
import util from "../../../utils/util";
import TinyMce from "../../../utils/TinyMce";
import { AntdMsg } from "../../../utils/Antd";
import UploadImage from "../../../utils/UploadImage";
import dayjs from "dayjs";

const { SHOW_CHILD } = Cascader;

export default function Blogs() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
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
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Category",
      render: (v, row) => {
        return <span>{row?.category?.name || "-"}</span>;
      },
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "-"),
    },

    {
      title: "Image",
      render: (v, row) => (
        <Image
          width={40}
          // height={60}
          src={row?.coverImage || "/images/no-image.png"}
          alt="Blog Category"
          style={{ objectFit: "contain" }}
        />
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
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
    servicesBlogs
      .listBlog(qData)
      .then((res) => {
        console.log("Blog Category Data:", res);
        setData(res?.data?.map((v) => ({ ...v, key: v._id })));
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
    servicesBlogs
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
    servicesBlogs
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

  useEffect(() => {
    servicesCategory.listCategory().then((res) => {
      setCategoryList(res?.categories);
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
          List of Blogs
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
      <AddForm ref={addNewModalRef} {...{ list, categoryList }} />
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

const AddForm = forwardRef(({ list, categoryList }, ref) => {
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
    servicesBlogs
      .addBlog(data)
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

  const saveEdit = () => {
    setAjxRequesting(true);
    servicesBlogs
      .updateBlog(data._id, data)
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

  console.log("Category List:", categoryList);

  return (
    <Modal
      title={data._id ? "Edit Blog " : "Add Blog "}
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
        <Button key="save" type="primary" onClick={save}>
          Save
        </Button>,
      ]}
    >
      <Spin spinning={ajxRequesting}>
        <Form layout="vertical">
          <Row gutter={20} style={{ marginTop: 20 }}>
            {/* Title */}
            <Col span={12}>
              <Form.Item label="Title" required>
                <Input
                  value={data?.title}
                  onChange={(e) => handleChange({ title: e.target.value })}
                  placeholder="Title of the blog"
                />
              </Form.Item>
            </Col>

            {/* Category */}
            <Col span={12}>
              <Form.Item label="Choose Category" required>
                <Select
                  style={{ width: "100%" }}
                  value={data?.category?._id}
                  onChange={(value) => handleChange({ category: value })}
                  placeholder="Choose category"
                  options={(categoryList || []).map((cat) => ({
                    label: cat.name,
                    value: cat._id||cat.id,
                  }))}
                  notFoundContent="No categories available"
                />
              </Form.Item>
            </Col>
            {/* Status */}
            <Col span={12}>
              <Form.Item label="Status" required>
                <Select
                  value={data?.status}
                  onChange={(value) => handleChange({ status: value })}
                  placeholder="Select status"
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Published", value: "published" },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Featured */}
            <Col span={12}>
              <Form.Item label="Featured" required>
                <Switch
                  checked={data?.featured}
                  onChange={(checked) => handleChange({ featured: checked })}
                />
              </Form.Item>
            </Col>
             <Col span={12}>
              <Form.Item label="Meta Title" >
                <Input
                  value={data?.metaTitle}
                  onChange={(e) => handleChange({ metaTitle: e.target.value })}
                  placeholder="Meta Title of the blog"
                />
              </Form.Item>
            </Col>
             <Col span={12}>
              <Form.Item label="Meta description" required>
                <Input
                  value={data?.metaDescription}
                  onChange={(e) => handleChange({ metaDescription: e.target.value })}
                  placeholder="Meta Description of the blog"
                />
              </Form.Item>
            </Col>

            {/* Cover Image */}
            <Col span={12}>
              <Form.Item
                label="Upload Cover Image url"
                required
                extra={
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    Recommended:size 1200×400px (max 5 MB) for good design
                    standards.
                  </span>
                }
              >
                <UploadImage
                  value={data?.coverImage ? [{ url: data?.coverImage }] : []} // wrap single value in array
                  count={1} // single file only
                  requiredWidth={1200}
                  requiredHeight={400}
                  onChange={(v) =>
                    handleChange({
                      coverImage: v?.[0]?.url || "", // store only first file's URL
                    })
                  }
                  listType="picture-card"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Upload Thumbnail Image url"
                required
                extra={
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    Recommended:size 400×242px (max 5 MB) for good design
                    standards.
                  </span>
                }
              >
                <UploadImage
                  value={
                    data?.thumbnailImage ? [{ url: data?.thumbnailImage }] : []
                  } // wrap single value in array
                  count={1} // single file only
                  requiredWidth={400}
                  requiredHeight={242}
                  onChange={(v) =>
                    handleChange({
                      thumbnailImage: v?.[0]?.url || "", // store only first file's URL
                    })
                  }
                  listType="picture-card"
                />
              </Form.Item>
            </Col>

            {/* Content */}
            <Col span={24}>
              <Form.Item label="Content" required>
                <TinyMce
                  value={data?.content}
                  onChange={(v) => {
                    data.content = v;
                  }}
                />
              </Form.Item>
            </Col>
             <Col span={24}>
            <Form.Item label="Faqs">
                              {!data?.faqs || data?.faqs.length === 0 ? (
                                <Button
                                  type="dashed"
                                  block
                                  icon={<PlusOutlined />}
                                  onClick={() =>
                                    setData({
                                      ...data,
                                      faqs: [
                                        {
                                          question: "",
                                          answer: "",
                                        },
                                      ],
                                    })
                                  }
                                >
                                  Add Faq
                                </Button>
                              ) : (
                                <VariantService
                                 
                                  variantDetails={data?.faqs}
                                  parentKay="faqs"
                                  handleChange={(val) =>
                                    setData({ ...data, faqs: val })
                                  }
                                />
                              )}
                            </Form.Item>

                            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});


function VariantService({
  variantDetails: data,
  parentKay,
  handleChange,
}) {
  
  const handleFieldChange = (value, fieldName, index) => {
    const newData = data.map((item, i) => {
      if (i === index) {
        return { ...item, [fieldName]: value };
      }
      return item;
    });
    handleChange(newData, parentKay);
  };

  const handleAddRow = () => {
    if (data.length < 6) {
      handleChange(
        [...data, { question: "", answer: "", }],
        parentKay
      );
    }
  };

  const handleRemoveRow = (index) => {
    handleChange(
      data.filter((_, idx) => idx !== index),
      parentKay
    );
  };

  

  return (
    <Table
      bordered
      size="small"
      pagination={false}
      columns={[
       
        {
          width: 200,
          title: "Question",
          dataIndex: "question",
          render: (value, record, index) => (
            <Input
              value={value}
              placeholder="Question"
              onChange={(e) =>
                handleFieldChange(
                  e.target.value,
                  "question",
                  index
                )
              }
            />
          ),
        },
       {
          width: 200,
          title: "Answer",
          dataIndex: "answer",
          render: (value, record, index) => (
            <Input
              value={value}
              placeholder="Answer"
              onChange={(e) =>
                handleFieldChange(
                  e.target.value,
                  "answer",
                  index
                )
              }
            />
          ),
        },
        {
          width: 100,
          render: (_, __, index) => (
            <div style={{ display: "flex", gap: 8 }}>
              {index + 1 === data.length && data.length < 6 && (
                <Button
                  icon={<PlusOutlined />}
                  shape="circle"
                  type="dashed"
                  onClick={handleAddRow}
                />
              )}
              <Button
                icon={<CloseOutlined />}
                shape="circle"
                type="dashed"
                danger
                onClick={() => handleRemoveRow(index)}
              />
            </div>
          ),
        },
      ]}
      dataSource={data}
      rowKey={(record, idx) => idx}
    />
  );
}
