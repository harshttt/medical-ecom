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
  Tag,
  Modal,
  Select,
  Cascader,
  Tabs,
  Avatar,
  Typography,
  DatePicker,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import servicesProductBooking from "../../../services/order-histrory";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
// import UploadImage from '../../utils/UploadImage';
import util from "../../../utils/util";
import { AntdMsg } from "../../../utils/Antd";

import TabPane from "antd/es/tabs/TabPane";
import dayjs from "dayjs";
import PriceBreakDown from "../common/priceBreakDown";
// import AstrologerCard from "./AstrologerCard";
const { SHOW_CHILD } = Cascader;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

export default function ProductBooking() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [astrologers, setAstrologers] = useState([]);
  const [astrologerConstants, setAstrologerConstants] = useState(
    util.constants()?.USER?.ROLE || {}
  );
  const [bookingConstants, setBookingConstants] = useState(
    util.constants()?.ORDER || {}
  );
  const [paymentConstants, setPaymentConstants] = useState(
    util.constants()?.PAYMENT || {}
  );
  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    order_type: bookingConstants?.TYPE?.PRODUCT,
  });

  const addNewModalRef = useRef();
  const assignedAstrologerModalRef = useRef();

  const BOOKINGH_STATUS = [
    { label: "PLACED", value: bookingConstants?.STATUS?.PLACED },
    { label: "PROCESSING", value: bookingConstants?.STATUS?.PROCESSING },
    { label: "SHIPPED", value: bookingConstants?.STATUS?.SHIPPED },
    { label: "DELIVERED", value: bookingConstants?.STATUS?.DELIVERED },
    { label: "CANCELLED", value: bookingConstants?.STATUS?.CANCELLED },
    { label: "PENDING", value: bookingConstants?.STATUS?.PENDING },
  ];

  const PAYMENT_STATUS = [
    { label: "PENDING", value: paymentConstants?.STATUS?.PENDING },
    { label: "PAID", value: paymentConstants?.STATUS?.PAID },
    { label: "REFUNDED", value: paymentConstants?.STATUS?.REFUNDED },
    { label: "FAILED", value: paymentConstants?.STATUS?.FAILED },
    { label: "CANCELLED", value: paymentConstants?.STATUS?.CANCELLED },
  ];

  const PAYMENT_METHOD = [
    { label: "CREDIT CARD", value: paymentConstants?.METHOD?.CREDIT_CARD },
    { label: "DEBIT CARD", value: paymentConstants?.METHOD?.DEBIT_CARD },
    { label: "UPI", value: paymentConstants?.METHOD?.UPI },
    { label: "WALLET", value: paymentConstants?.METHOD?.WALLET },
    { label: "NET_BANKING", value: paymentConstants?.METHOD?.NET_BANKING },
  ];

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Image",
    },
    {
      title: " Product Name",
      width: 150,
      render: (v, row) => {
        return <span>{row?.reference_id?.name || "-"}</span>;
      },
    },

    {
      title: " User Name",
      render: (v, row) => {
        return <span>{row?.user_id?.name || "-"}</span>;
      },
    },

    {
      title: "Order Date",
      dataIndex: "createdAt",
      render: (v) => (v ? dayjs(v)?.format("DD MMM YYYY") : "-"),
    },

    {
      title: "Total Amount",
      render: (v, row) => {
        return (
          <span>
            ₹{row?.price_snapshot?.final_price?.toLocaleString("en-IN") || 0}
          </span>
        );
      },
    },

    {
      title: "Paid Amount",
      render: (v, row) => {
        return (
          <span>
            ₹{row?.admin_price_helper?.wallet_debit_amount?.toLocaleString("en-IN") || 0}
          </span>
        );
      },
    },


    {
      title: "Booking Status",
      render: (v, row) => {
        let statusLabel = "-";
        for (let key in bookingConstants?.STATUS) {
          if (bookingConstants?.STATUS[key] === row?.tracking_status) {
            statusLabel = key;
            break;
          }
        }
        return <Tag>{statusLabel || "-"}</Tag>;
      },
    },

    {
      title: "Payment Status",
      render: (v, row) => {
        let statusLabel = "-";
        for (let key in paymentConstants?.STATUS) {
          if (paymentConstants?.STATUS[key] === row?.payment_status) {
            statusLabel = key;
            break;
          }
        }
        return <Tag>{statusLabel || "-"}</Tag>;
      },
    },

    {
      title: "Payment Method",
      render: (v, row) => {
        let statusLabel = "-";
        for (let key in paymentConstants?.METHOD) {
          if (paymentConstants?.METHOD[key] === row?.payment_method) {
            statusLabel = key;
            break;
          }
        }
        return <Tag>{statusLabel || "-"}</Tag>;
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
    servicesProductBooking
      .listProductBooking(qData)
      .then((res) => {
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
    servicesProductBooking
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
    servicesProductBooking
      .poojaToggle(id)
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
          BOOKINGH_STATUS,
          PAYMENT_STATUS,
          PAYMENT_METHOD,
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
          List of Product Booking
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
          {/* <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => addNewModalRef.current.openForm()}
            >
              Add New
            </Button>
          </Col> */}
        </Row>
      }
    >
      <Table
        {...tableProps}
        pagination={{ position: ["none"], pageSize: qData.limit }}
        columns={tableColumns}
        dataSource={data.length ? data : []}
        scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
        expandable={{
          expandedRowRender: (record) => (
            <Tabs defaultActiveKey="1" type="card">
              {/* 1. Product Details */}
              <TabPane tab="Product Details" key="1">
                <Card
                  title="Product Information"
                  bordered={false}
                  style={{ marginTop: 1 }}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Card size="small" bordered style={{ borderRadius: 8 }}>
                        <Text strong>Product Name</Text>
                        <br />
                        <Text>{record?.reference_id?.name || "-"}</Text>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" bordered style={{ borderRadius: 8 }}>
                        <Text strong>Order Id</Text>
                        <br />
                        <Text>{record?._id || "-"}</Text>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" bordered style={{ borderRadius: 8 }}>
                        <Text strong>Quantity</Text>
                        <br />
                        <Text>{record?.quantity || 1}</Text>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" bordered style={{ borderRadius: 8 }}>
                        <Text strong>Price</Text>
                        <br />
                        <Text> ₹{record?.price_snapshot?.base_price || 0}</Text>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" bordered style={{ borderRadius: 8 }}>
                        <Text strong>Rating and Review</Text>
                        <br />
                        {record?.review ? (
                          <Tooltip
                            title={`${record?.review}${record?.rating ? ` (${record?.rating})` : ""
                              }`}
                          >
                            <Text>
                              {`${record?.review?.slice(0, 20)}${record?.review.length > 20 ? "..." : ""
                                }`}
                              {record?.rating ? ` (${record?.rating})` : ""}
                            </Text>
                          </Tooltip>
                        ) : (
                          <Text>N/A</Text>
                        )}
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </TabPane>

              {/* 2. Customer Details */}
              <TabPane tab="Customer Details" key="2">
                <Card bordered style={{ borderRadius: 10 }}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col span={4}>
                      <Avatar
                        src={record?.user_id?.profilePicture}
                        size={80}
                        style={{ border: "2px solid #d9d9d9" }}
                      />
                    </Col>
                    <Col span={20}>
                      <Title level={4} style={{ marginBottom: 0 }}>
                        {record?.user_id?.name || "N/A"}
                      </Title>
                      <Text type="secondary">
                        {record?.user_id?.email || "N/A"}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              </TabPane>

              {/* 3. Payment Details */}
              <TabPane tab="Payment Details" key="3">
                <PriceBreakDown {...{ record,paymentConstants }} />
              </TabPane>

              {/* 4. Shipping Details */}
              <TabPane tab="Shipping Address" key="4">
                <Card
                  title="Shipping Address"
                  bordered={false}
                  style={{ marginTop: 1 }}
                >
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <p>
                        <strong>Name:</strong>{" "}
                        {record?.shipping_address?.name || "N/A"}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {record?.shipping_address?.phone || "N/A"}
                      </p>
                    </Col>
                    <Col span={24}>
                      <p>
                        <strong>Address:</strong>
                        {`${record?.shipping_address?.line1 || ""}, ${record?.shipping_address?.line2 || ""
                          }`}
                      </p>
                    </Col>
                    <Col span={24}>
                      <p>
                        <strong>City/State/Pincode:</strong>
                        {`${record?.shipping_address?.city || ""}, ${record?.shipping_address?.state || ""
                          }, ${record?.shipping_address?.pincode || ""}`}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Country:</strong>{" "}
                        {record?.shipping_address?.country || "N/A"}
                      </p>
                    </Col>
                  </Row>
                </Card>
              </TabPane>

              {/* 5. Admin Notes */}
              <TabPane tab="Admin Feedback" key="5">
                <Card
                  title="Additional Info"
                  bordered={false}
                  style={{ marginTop: 1 }}
                >

                  <Row gutter={[16, 8]}>
                    <Col span={24}>
                      <p>
                        <strong>Admin Remarks:</strong>{" "}
                        {record?.admin_remarks || "-"}
                      </p>
                    </Col>
                  </Row>

                </Card>
              </TabPane>
            </Tabs>
          ),

          rowExpandable: (record) => true, // Optional condition if you want to restrict expansion
        }}
      />

      <AddForm
        ref={addNewModalRef}
        {...{ list, bookingConstants, BOOKINGH_STATUS, PAYMENT_STATUS }}
      />
      <AsignAstrologerForm
        ref={assignedAstrologerModalRef}
        {...{ list, astrologers }}
      />
    </Card>
  );
}

function Search({
  qData,
  setQData,
  list,
  BOOKINGH_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
}) {
  return (
    <Form onSubmitCapture={() => {
      qData.page = 1; // Reset page on search // Reset page on search
      list();
    }}>
      <Row gutter={[12, 12]}>
        <Col span={6}>
          <Input
            placeholder="Search by name  "
            value={qData.key}
            onChange={(e) => setQData({ ...qData, search: e.target.value })}
            allowClear
          />
        </Col>

        {/* Payment Status Filter */}
        <Col span={6}>
          <Select
            placeholder="Filter by Booking Status"
            value={qData?.booking_status || undefined}
            onChange={(value) => setQData({ ...qData, booking_status: value })}
            style={{ width: "100%" }}
            allowClear
            options={BOOKINGH_STATUS || []}
          ></Select>
        </Col>

        <Col span={6}>
          <Select
            placeholder="Filter by Payment Status"
            value={qData?.payment_status || undefined}
            onChange={(value) => setQData({ ...qData, payment_status: value })}
            style={{ width: "100%" }}
            allowClear
            options={PAYMENT_STATUS || []}
          ></Select>
        </Col>

        <Col span={6}>
          <Select
            placeholder="Filter by Payment Method"
            value={qData?.payment_method || undefined}
            onChange={(value) => setQData({ ...qData, payment_method: value })}
            style={{ width: "100%" }}
            allowClear
            options={PAYMENT_METHOD || []}
          ></Select>
        </Col>

        {/* 📅 Date Range Filter */}
        <Col span={6}>
          <RangePicker
            style={{ width: "100%" }}
            value={
              qData.start_date && qData.end_date
                ? [dayjs(qData.start_date), dayjs(qData.end_date)]
                : null
            }
            onChange={(dates, dateStrings) =>
              setQData({
                ...qData,
                start_date: dateStrings?.[0] || null,
                end_date: dateStrings?.[1] || null,
              })
            }
            format="YYYY-MM-DD"
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

const AddForm = forwardRef(({ list, BOOKINGH_STATUS, PAYMENT_STATUS }, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(
        dt
          ? {
            _id: dt?._id,
            tracking_status: dt?.tracking_status,
            payment_status: dt?.payment_status,
            remarks: dt?.remarks,
          }
          : {}
      );
    },
  }));

  const handleChange = (value) => setData((prev) => ({ ...prev, ...value }));

  // const saveAdd = () => {
  //   setAjxRequesting(true);
  //   servicesProductBooking
  //     .addPooja(data)
  //     .then((res) => {
  //       AntdMsg(res.message);
  //       list();
  //       setOpen(false);
  //     })
  //     .catch((err) => {
  //       AntdMsg(err.message, "error");
  //     })
  //     .finally(() => setAjxRequesting(false));
  // };

  const saveEdit = () => {
    setAjxRequesting(true);
    servicesProductBooking
      .updateProductBooking(data._id, data)
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
      // saveAdd();
    }
  };

  return (
    <Modal
      title={data._id ? "Edit Product Booking" : "Add Product Booking"}
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
            {/* Existing fields here */}

            <Col span={12}>
              <Form.Item label="Tracking Status">
                <Select
                  value={data?.tracking_status}
                  onChange={(value) => handleChange({ tracking_status: value })}
                  placeholder="Select Status"
                  options={BOOKINGH_STATUS || []}
                ></Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Payment Status">
                <Select
                  value={data?.payment_status}
                  onChange={(value) => handleChange({ payment_status: value })}
                  placeholder="Select Status"
                  options={PAYMENT_STATUS || []}
                ></Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Admin Remarks">
                <Input.TextArea
                  value={data?.remarks}
                  onChange={(e) => handleChange({ remarks: e.target.value })}
                  placeholder="Add your remarks"
                  rows={3}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});

const AsignAstrologerForm = forwardRef(({ list, astrologers }, ref) => {
  const [open, setOpen] = useState(false);
  const [asignData, setAsignData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setAsignData(
        dt
          ? { booking_id: dt?._id, astrologer_user_id: dt?.astrologer?._id }
          : {}
      );
    },
  }));

  const saveAdd = () => {
    setAjxRequesting(true);
    servicesProductBooking
      .asignAstrologer(asignData)
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
    saveAdd();
  };

  return (
    <Modal
      title={"Astrologers"}
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
      {/* <AstrologerCard {...{ asignData, setAsignData }} /> */}
    </Modal>
  );
});
