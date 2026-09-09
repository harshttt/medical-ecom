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
  Tabs,
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
import servicesProduct from "../../../services/product";
import servicesCategory from "../../../services/category";
import servicesBrand from "../../../services/brand";

import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
// import UploadImage from '../../utils/UploadImage';
import moment from "moment";
import util from "../../../utils/util";
import UploadImage from "../../../utils/UploadImage";
import UploadVideo from "../../../utils/UploadVideo";
import UploadFile from "../../../utils/UploadCSV";

import { AntdMsg } from "../../../utils/Antd";
const { SHOW_CHILD } = Cascader;

export default function Product() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [qData, setQData] = useState({ page: 1, limit: 10, status: undefined });


  const addNewModalRef = useRef();

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      width: 50,
       render: (text, record, index) =>
        index + 1 + (qData?.page - 1) * qData?.limit,
    },
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Category",
      dataIndex: "categoryName",
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (v) => (
        <Image
          src={v || "https://via.placeholder.com/150"}
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (v) => <span> ₹{v || "-"}</span>
    },
    {
      title: "Discount %",
      dataIndex: "discount",
    },

    {
      title: "Final Price",
      dataIndex: "finalPrice",
      render: (v, row) => (
        <span> ₹{v || "-"}</span>
      ),
    },
    {
      title: "Vendor/Superadmin",
      dataIndex: "vendorName",
      key: "vendorName",
      render: (vendorName) =>
        vendorName || "Superadmin",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, row) => (
        <Switch
          checked={status === 2}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={(checked) => {
            activeHandler(row?._id, checked ? 2 : 5);
          }}
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
    servicesProduct
      .listProduct(qData)
      .then((res) => {
        setData(res?.data?.products?.map((v) => ({ ...v, key: v._id })));
        setQData({
          ...qData,
          limit: res?.data?.pagination?.limit,
          page: res?.data?.pagination?.page,
          total: res?.data?.pagination?.total,
        });
      })
      .catch(() => {
        message.error("Failed to fetch data");
      })
      .finally(() => setLoading(false));
  }

  const deleteData = (ids) => {
    servicesProduct
      .delete(ids)
      .then((res) => {
        message.success(res?.message);
        list();
        setSelected([]);
      })
      .catch((err) => {
        message.error(err?.message);
      });
  };

  const activeHandler = (id, status) => {
    servicesProduct
      .toggle(id, status)
      .then((res) => {
        message.success(res?.message || "Product status updated successfully");
        list();
        setSelected([]);
      })
      .catch((err) => {
        message.error(

          err?.message ||
          "Failed to update product status"
        );
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
    // rowSelection: {
    //   onChange: (selectedRowKeys) => setSelected(selectedRowKeys),
    // },
  };


  useEffect(() => {
    list();
  }, [qData.page, qData.limit]);

  useEffect(() => {
    servicesCategory.listCategory({ limit: 2000 }).then((res) => {
      console.log("Category Data:", res?.data);
      setCategory(res?.data?.categories || []);
    });
    servicesBrand.getAll({ limit: 2000 }).then((res) => {
      setBrand(res?.data?.brands || []);
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
          List of Products
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
      <AddForm ref={addNewModalRef} {...{ list, category, brand }} />
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
        <Col span={6}>
          <Select
             style={{ width: "100%" }}
            placeholder="Status"
            value={qData?.status}
            onChange={(value) => setQData({ ...qData, status: value })}
            allowClear
          >
            <Select.Option value={2}>Active</Select.Option>
            <Select.Option value={5}>Inactive</Select.Option>
          </Select>
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

const AddForm = forwardRef(({ list, category, productConstants, brand }, ref) => {
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

    servicesProduct
      .addProduct(data)
      .then((res) => {
        AntdMsg("Product added successfully");
        list();
        setOpen(false);
      })
      .catch((err) => {
        AntdMsg(
          err?.message ||
          err?.error ||
          err?.response?.data?.message ||
          "Something went wrong",
          "error"
        );

        console.error(err);
      })
      .finally(() => setAjxRequesting(false));
  };

  const saveEdit = () => {
    setAjxRequesting(true);
    servicesProduct
      .updateProduct(data?._id, data)
      .then((res) => {
        AntdMsg("Product updated successfully");
        list();
        setOpen(false);
      })
      .catch((err) => {
        AntdMsg(
          err?.message ||
          err?.error ||
          err?.response?.data?.message ||
          "Something went wrong",
          "error"
        );

        console.error(err);
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
      title={data._id ? "Edit Product" : "Add Product"}
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
          <Tabs defaultActiveKey="0" type="card">
            <Tabs.TabPane tab="Basic Information" key="0">
              <Row gutter={20} style={{ marginTop: 20 }}>
                <Col span={12}>
                  <Form.Item label="Name" required>
                    <Input
                      value={data?.name}
                      onChange={(e) => handleChange({ name: e.target.value })}
                      placeholder="Wireless Mouse"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Choose Category" required>
                    <Select
                      style={{ width: "100%" }}
                      value={data?.categoryId}
                      onChange={(value) => handleChange({ categoryId: value })}
                      placeholder="Choose category"
                      options={(category || [])?.map((cat) => ({
                        label: cat?.name,
                        value: cat?._id,
                      }))}
                      notFoundContent="No categories available"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Choose Brand" required>
                    <Select
                      style={{ width: "100%" }}
                      value={data?.brandId}
                      onChange={(value) => handleChange({ brandId: value })}
                      placeholder="Choose brand"
                      options={(brand || [])?.map((cat) => ({
                        label: cat?.name,
                        value: cat?._id,
                      }))}
                      notFoundContent="No brands available"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Description" required>
                    <Input.TextArea
                      value={data?.description}
                      onChange={(e) =>
                        handleChange({ description: e.target.value })
                      }
                      placeholder="A high-precision wireless mouse with ergonomic design."
                      rows={4}
                    />
                  </Form.Item>
                </Col>



                {/* {useVariants == false ? (
              <> */}
                <Col span={12}>
                  <Form.Item label="SKU" required>
                    <Input
                      value={data?.sku}
                      onChange={(e) => handleChange({ sku: e.target.value })}
                      placeholder="WMOUSE123"
                      disabled={!!data?._id}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label=" Price" required>
                    <Input
                      type="number"
                      value={data?.price}
                      onChange={(e) =>
                        handleChange({
                          price: Number(util.handleInteger(e.target.value)),
                        })
                      }
                      placeholder="800"
                    />
                  </Form.Item>
                </Col>



                <Col span={12}>
                  <Form.Item label="Discount" required>
                    <Input
                      type="number"
                      value={data?.discount}
                      onChange={(e) =>
                        handleChange({
                          discount: Number(util.handleInteger(e.target.value)),
                        })
                      }
                      placeholder="50"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="GST Percentage" required>
                    <Input
                      type="number"
                      value={data?.gst}
                      onChange={(e) =>
                        handleChange({
                          gst: Number(util.handleInteger(e.target.value)),
                        })
                      }
                      placeholder="18%"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label=" Stock">
                    <Input
                      type="number"
                      value={data?.stock}
                      onChange={(e) =>
                        handleChange({
                          stock: Number(util.handleInteger(e.target.value)),
                        })
                      }
                      placeholder="100"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Upload Thumbnail Image url"
                    required
                    extra={
                      <span style={{ fontSize: "12px", color: "#888" }}>
                        Recommended:size (max 1 MB) for good design
                        standards.
                      </span>
                    }
                  >
                    <UploadImage
                      value={
                        data?.thumbnail ? [{ url: data?.thumbnail }] : []
                      } // wrap single value in array
                      count={1} // single file only
                      // requiredWidth={400}
                      // requiredHeight={242}
                      onChange={(v) =>

                        handleChange({
                          thumbnail: v?.[0]?.url || "", // store only first file's URL
                        })
                      }
                      listType="picture-card"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Upload Image "
                    required
                  // extra={
                  //   <span style={{ fontSize: "12px", color: "#888" }}>
                  //     Recommended:size 400×242px (max 5 MB) for good design
                  //     standards.
                  //   </span>
                  // }
                  >

                    <UploadImage
                      value={(data?.images || [])?.map((url) => ({ url }))}
                      count={10}
                      onChange={(files) =>
                        handleChange({
                          images: files?.map((file) => file.url),
                        })
                      }
                      listType="picture-card"
                    />

                  </Form.Item>
                </Col>

              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Highlights" key="2">
              <Row gutter={20} style={{ marginTop: 20 }}>
                <Col span={24}>
                  <Form.Item label="Highlights">
                    {!data?.highlights || data?.highlights.length === 0 ? (
                      <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        onClick={() =>
                          setData({
                            ...data,
                            highlights: [
                              {
                                icon: "",
                                heading: "",
                                description: "",
                              },
                            ],
                          })
                        }
                      >
                        Add Highlights
                      </Button>
                    ) : (
                      <VariantService

                        variantDetails={data?.highlights}
                        parentKay="highlights"
                        handleChange={(val) =>
                          setData({ ...data, highlights: val })
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Key Feature" key="1">
              <Row gutter={20} style={{ marginTop: 20 }}>
                <Col span={24}>
                  <Form.Item label="Key Features">
                    {!data?.keyFeatures || data?.keyFeatures.length === 0 ? (
                      <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        onClick={() =>
                          setData({
                            ...data,
                            keyFeatures: [
                              {
                                icon: "",
                                heading: "",
                                description: "",
                              },
                            ],
                          })
                        }
                      >
                        Add Key Feature
                      </Button>
                    ) : (
                      <VariantService

                        variantDetails={data?.keyFeatures}
                        parentKay="keyFeatures"
                        handleChange={(val) =>
                          setData({ ...data, keyFeatures: val })
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>


          </Tabs>
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
    if (data.length < 3) {
      handleChange(
        [...data, { icon: "", heading: "", description: "" }],
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

  // track selected service types
  const selectedServiceTypes = data
    .map((item) => item.service_type)
    .filter((v) => v !== undefined && v !== null);

  return (
    <Table
      bordered
      size="small"
      pagination={false}
      columns={[

        {
          width: 100,
          title: "Icon",
          dataIndex: "icon",
          render: (value, record, index) => (
            <UploadImage
              value={value ? [{ url: value }] : []}
              count={1}
              onChange={(v) =>
                handleFieldChange(
                  v?.[0]?.url || "",
                  "icon",
                  index
                )
              }
              listType="picture-card"
            />
          ),
        },

        {
          width: 100,
          title: "Heading",
          dataIndex: "heading",
          render: (value, record, index) => (
            <Input
              value={value}
              placeholder="Heading"
              onChange={(e) =>
                handleFieldChange(
                  e.target.value,
                  "heading",
                  index
                )
              }
            />
          ),
        },
        {
          width: 200,
          title: "Description",
          dataIndex: "description",
          render: (value, record, index) => (
            <Input.TextArea
              value={value}
              placeholder="Description"
              onChange={(e) =>
                handleFieldChange(
                  e.target.value,
                  "description",
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
