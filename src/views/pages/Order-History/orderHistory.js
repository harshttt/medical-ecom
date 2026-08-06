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
  Image,
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
const { SHOW_CHILD } = Cascader;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

export default function ProductBooking() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [astrologers, setAstrologers] = useState([]);

  const [bookingConstants, setBookingConstants] = useState(
    util.constants()?.ORDER_STATUS || {}
  );
  const [paymentConstants, setPaymentConstants] = useState(
    util.constants()?.PAYMENT_METHOD || {}
  );
  const [qData, setQData] = useState({
    page: 1,
    limit: 10,

  });

  const addNewModalRef = useRef();


  const BOOKING_STATUS = [
    { label: "PENDING", value: bookingConstants?.PENDING },
    { label: "CONFIRMED", value: bookingConstants?.CONFIRMED },
    { label: "PROCESSING", value: bookingConstants?.PROCESSING },
    { label: "SHIPPED", value: bookingConstants?.SHIPPED },
    { label: "OUT FOR DELIVERY", value: bookingConstants?.OUT_FOR_DELIVERY },
    { label: "DELIVERED", value: bookingConstants?.DELIVERED },
    { label: "CANCELLED", value: bookingConstants?.CANCELLED },
    { label: "RETURN REQUESTED", value: bookingConstants?.RETURN_REQUESTED },
    { label: "RETURNED", value: bookingConstants?.RETURNED },
    { label: "REFUND INITIATED", value: bookingConstants?.REFUND_INITIATED },
    { label: "REFUNDED", value: bookingConstants?.REFUNDED },
  ];

  const PAYMENT_STATUS = [
    { label: "PENDING", value: paymentConstants?.PENDING },
    { label: "PAID", value: paymentConstants?.PAID },
    { label: "REFUNDED", value: paymentConstants?.REFUNDED },
    { label: "FAILED", value: paymentConstants?.FAILED },
    // { label: "CANCELLED", value: paymentConstants?.PAYMENT_STATUS?.CANCELLED },
  ];

  const PAYMENT_METHOD = [
    { label: "CARD", value: paymentConstants?.CARD },
    { label: "UPI", value: paymentConstants?.UPI },
    { label: "WALLET", value: paymentConstants?.WALLET },
    { label: "NET_BANKING", value: paymentConstants?.NETBANKING },
    { label: "COD", value: paymentConstants?.COD },

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
      dataIndex: "image",
      render: (v, row) => (
        <Image
          src={row?.items?.[0]?.image || "https://via.placeholder.com/150"}
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Product Name",
      width: 150,
      render: (v, row) => <span>{row?.items?.[0]?.name || "-"}</span>,
    },
    {
      title: "User Name",
      render: (v, row) => <span>{row?.user?.name || "-"}</span>,
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "-"),
    },
    {
      title: "Paid Amount",
      render: (v, row) => <span>₹{row?.grandTotal?.toLocaleString("en-IN") || 0}</span>,
    },

    {
      title: "Tracking Status",
      render: (_, row) => {
        // Get status from trackingDetails
        const statusValue = row?.trackingDetails?.[0]?.status;

        if (statusValue == null) {
          return <Tag color="default">-</Tag>;
        }

        const statusObj = BOOKING_STATUS.find(
          (item) => item.value === statusValue
        );

        const label = statusObj?.label || "UNKNOWN";

        const colorMap = {
          [bookingConstants?.OUT_FOR_DELIVERY]: "blue",
          [bookingConstants?.PROCESSING]: "orange",
          [bookingConstants?.SHIPPED]: "cyan",
          [bookingConstants?.DELIVERED]: "green",
          [bookingConstants?.CANCELLED]: "red",
        };

        return (
          <Tag color={colorMap[statusValue] || "default"}>
            {label}
          </Tag>
        );
      },
    },

    {
      title: "Payment Status",
      render: (_, row) => {
        const paymentStatus = row?.payment?.status ?? row?.isPaid ? 2 : 1; // fallback logic
        const statusObj = PAYMENT_STATUS.find(s => s.value === paymentStatus);
        const label = statusObj?.label || (row?.isPaid ? "PAID" : "PENDING");

        const color = row?.isPaid || paymentStatus === 2 ? "green" : "orange";
        return <Tag color={color}>{label}</Tag>;
      },
    },

    {
      title: "Payment Method",
      render: (_, row) => {
        const methodValue = row?.payment?.method || row?.paymentMethod;
        if (!methodValue) return <Tag color="default">COD / Not Set</Tag>;

        const methodObj = PAYMENT_METHOD.find(m => m.value === methodValue);
        console.log("methodValue:", methodValue, typeof methodValue);
        console.log("PAYMENT_METHOD:", PAYMENT_METHOD);
        console.log("paymentConstants Top:", paymentConstants);

        return <Tag>{methodObj?.label || methodValue}</Tag>;
      },
    },

    {
      title: "Action",
      dataIndex: "_id",
      width: 80,
      render: (v, row) => (
        <Space>
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
      .listHistory(qData)
      .then((res) => {
        setData(res?.data?.orders?.map((v) => ({ ...v, key: v._id })));
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
          BOOKING_STATUS,
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
                        <Text>{record?.items?.[0]?.name || "-"}</Text>
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
                        <Text>{record?.items?.[0]?.quantity || ""}</Text>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" bordered style={{ borderRadius: 8 }}>
                        <Text strong>Price</Text>
                        <br />
                        <Text> ₹{record?.items?.[0]?.finalPrice || 0}</Text>
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
                        src={record?.user?.avatar}
                        size={80}
                        style={{ border: "2px solid #d9d9d9" }}
                      />
                    </Col>
                    <Col span={20}>
                      <Title level={4} style={{ marginBottom: 0 }}>
                        {record?.user?.name || "N/A"}
                      </Title>
                      <Text type="secondary">
                        {record?.user?.email || "N/A"}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              </TabPane>

              <TabPane tab="Payment Details" key="3">
                <PriceBreakDown {...{ record, paymentConstants }} />
              </TabPane>

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
                        {record?.shippingAddress?.fullName || "N/A"}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {record?.shippingAddress?.phone || "N/A"}
                      </p>
                    </Col>
                    <Col span={24}>
                      <p>
                        <strong>Address:</strong>
                        {`${record?.shippingAddress?.line1 || ""}, ${record?.shippingAddress?.line2 || ""
                          }`}
                      </p>
                    </Col>
                    <Col span={24}>
                      <p>
                        <strong>City/State/Pincode:</strong>
                        {`${record?.shippingAddress?.city || ""}, ${record?.shippingAddress?.state || ""
                          }, ${record?.shippingAddress?.pincode || ""}`}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <strong>Country:</strong>{" "}
                        {record?.shippingAddress?.country || "N/A"}
                      </p>
                    </Col>
                  </Row>
                </Card>
              </TabPane>

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
        {...{ list, bookingConstants, BOOKING_STATUS, PAYMENT_STATUS }}
      />
      {/* <AsignAstrologerForm
        ref={assignedAstrologerModalRef}
        {...{ list, astrologers }}
      /> */}
    </Card>
  );
}

function Search({
  qData,
  setQData,
  list,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
}) {
  return (
    <Form onSubmitCapture={() => {
      qData.page = 1;
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

        <Col span={6}>
          <Select
            placeholder="Filter by Booking Status"
            value={qData?.booking_status || undefined}
            onChange={(value) => setQData({ ...qData, booking_status: value })}
            style={{ width: "100%" }}
            allowClear
            options={BOOKING_STATUS || []}
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

        {/* <Col span={6}>
          <Select
            placeholder="Filter by Payment Method"
            value={qData?.payment_method || undefined}
            onChange={(value) => setQData({ ...qData, payment_method: value })}
            style={{ width: "100%" }}
            allowClear
            options={PAYMENT_METHOD || []}
          ></Select>
        </Col> */}

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

        <Col span={3}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

const AddForm = forwardRef(({ list, BOOKING_STATUS }, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

 useImperativeHandle(ref, () => ({
  openForm(dt) {
    setOpen(true);
    setData({
      _id: dt?._id,
      status: dt?.trackingDetails?.[0]?.status ?? dt?.overallTrackingStatus ?? dt?.status ?? 1,
    });
  },
}));

  const handleChange = (changed) => setData(prev => ({ ...prev, ...changed }));

  const save = () => {
    setAjxRequesting(true);
    servicesProductBooking
      .updateProductBooking(data._id, { status: data.status })
      .then((res) => {
        AntdMsg(res.message || "Updated successfully");
        list();
        setOpen(false);
      })
      .catch((err) => AntdMsg(err?.message || "Failed", "error"))
      .finally(() => setAjxRequesting(false));
  };

  return (
    <Modal
      title="Edit Product Booking"
      open={open}
      onCancel={() => setOpen(false)}
      onOk={save}
      okButtonProps={{ loading: ajxRequesting }}
      destroyOnClose
      width={480}
    >
      <Spin spinning={ajxRequesting}>
        <Form layout="vertical">
          <Form.Item label="Tracking Status">
            <Select
              value={data?.status}
              onChange={(val) => handleChange({ status: val })}
              options={BOOKING_STATUS}
              placeholder="Select status"
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
});

