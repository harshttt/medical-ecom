// /* eslint-disable react-hooks/exhaustive-deps */
// import {
//   Table,
//   Button,
//   Form,
//   Row,
//   Col,
//   Spin,
//   Card,
//   message,
//   Input,
//   Space,
//   Modal,
//   Tag,
//   Descriptions,
//   Divider,
// } from "antd";
// import {
//   EyeOutlined,
//   ArrowLeftOutlined,
// } from "@ant-design/icons";
// import React, {
//   useEffect,
//   useState,
//   forwardRef,
//   useImperativeHandle,
//   useRef,
// } from "react";
// import servicesOrder from "../../../services/order-histrory"; 
// import Pagination from "../../components/Pagination";
// import { useNavigate } from "react-router-dom";
// import moment from "moment";
// import dayjs from "dayjs";

// export default function OrderHistory() {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [qData, setQData] = useState({
//     page: 1,
//     limit: 10,
//     search: "",
//   });

//   const orderViewModalRef = useRef();

//   const getStatusTag = (status) => {
//     const statusMap = {
//       1: { color: "blue", label: "Pending" },
//       2: { color: "green", label: "Confirmed" },
//       3: { color: "orange", label: "Shipped" },
//       4: { color: "purple", label: "Delivered" },
//       5: { color: "red", label: "Cancelled" },
//       // Add more mappings based on your backend logic
//     };
//     const st = statusMap[status] || { color: "default", label: "Unknown" };
//     return <Tag color={st.color}>{st.label}</Tag>;
//   };

//   const getPaymentStatusTag = (isPaid, isCod) => {
//     if (isCod) return <Tag color="gold">Cash on Delivery</Tag>;
//     return isPaid ? 
//       <Tag color="green">Paid</Tag> : 
//       <Tag color="red">Unpaid</Tag>;
//   };

//   const columns = [
//     {
//       title: "S.No",
//       dataIndex: "sno",
//       width: 60,
//       render: (text, record, index) =>
//         index + 1 + (qData.page - 1) * qData.limit,
//     },
//     {
//       title: "Order Number",
//       dataIndex: "orderNumber",
//       render: (orderNumber) => orderNumber || "-",
//     },
//     {
//       title: "Customer",
//       dataIndex: "userId",
//       render: (userId) => userId?.name || "Not Specified",
//     },
//     {
//       title: "Email",
//       dataIndex: "userId",
//       render: (userId) => userId?.email || "-",
//     },
//     {
//       title: "Phone",
//       dataIndex: "userId",
//       render: (userId) => userId?.phone || "-",
//     },
//     {
//       title: "Grand Total",
//       dataIndex: "grandTotal",
//       render: (grandTotal) => `₹${grandTotal || 0}`,
//       align: "right",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status) => getStatusTag(status),
//     },
//     {
//       title: "Payment",
//       dataIndex: "isPaid",
//       render: (isPaid, record) => getPaymentStatusTag(isPaid, record.isCod),
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       render: (v) => (v ? dayjs(v).format("DD MMM YYYY, hh:mm A") : "-"),
//     },
//     {
//       title: "Action",
//       dataIndex: "_id",
//       width: 80,
//       render: (v, row) => (
//         <Space>
//           <Button
//             type="primary"
//             size="small"
//             icon={<EyeOutlined />}
//             onClick={() => orderViewModalRef.current.openForm(row)}
//           >
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   function list() {
//     setLoading(true);
//     servicesOrder
//       .listHistory(qData)
//       .then((res) => {
//         const responseData = res?.data?.orders || [];
//         const pagination = res?.data?.pagination || {};
        
//         setData(responseData.map((v) => ({ ...v, key: v._id })));
        
//         setQData((prev) => ({
//           ...prev,
//           limit: pagination?.limit || prev.limit,
//           page: pagination?.page || prev.page,
//           total: pagination?.total,
//         }));
//       })
//       .catch(() => {
//         message.error("Failed to fetch orders");
//       })
//       .finally(() => setLoading(false));
//   }

//   const tableColumns = columns.map((item) => ({ ...item, ellipsis: true }));
//   tableColumns[0].fixed = true;
//   tableColumns[tableColumns.length - 1].fixed = "right";

//   const tableProps = {
//     bordered: true,
//     loading,
//     size: "small",
//     title: () => <Search {...{ qData, setQData, list }} />,
//     showHeader: true,
//     footer: () => <Pagination {...{ qData, setQData, list }} />,
//   };

//   useEffect(() => {
//     list();
//   }, [qData.page, qData.limit]);

//   return (
//     <Card
//       bordered={false}
//       size="small"
//       title={
//         <Space>
//           <Button
//             type="dashed"
//             danger
//             icon={<ArrowLeftOutlined />}
//             onClick={() => navigate(-1)}
//           >
//             Back
//           </Button>
//           Order History
//         </Space>
//       }
//     >
//       <Table
//         {...tableProps}
//         pagination={{ position: ["none"], pageSize: qData.limit }}
//         columns={tableColumns}
//         dataSource={data}
//         scroll={{ y: "calc(100vh - 340px)", x: "max-content" }}
//       />

//       <ViewOrderModal ref={orderViewModalRef} />
//     </Card>
//   );
// }

// function Search({ qData, setQData, list }) {
//   return (
//     <Form
//       onSubmitCapture={(e) => {
//         e.preventDefault();
//         setQData((prev) => ({ ...prev, page: 1 }));
//         list();
//       }}
//     >
//       <Row gutter={12}>
//         <Col span={8}>
//           <Input
//             placeholder="Search by Order Number or Customer Name"
//             value={qData?.search}
//             onChange={(e) => setQData({ ...qData, search: e.target.value })}
//             allowClear
//           />
//         </Col>
//         <Col span={3}>
//           <Button type="primary" htmlType="submit">
//             Search
//           </Button>
//         </Col>
//       </Row>
//     </Form>
//   );
// }

// const ViewOrderModal = forwardRef((props, ref) => {
//   const [open, setOpen] = useState(false);
//   const [orderData, setOrderData] = useState({});

//   useImperativeHandle(ref, () => ({
//     openForm(data) {
//       setOrderData(data);
//       setOpen(true);
//     },
//   }));

//   const getStatusLabel = (status) => {
//     const map = {
//       1: "Pending",
//       2: "Confirmed",
//       3: "Shipped",
//       4: "Delivered",
//       5: "Cancelled",
//     };
//     return map[status] || "Unknown";
//   };

//   return (
//     <Modal
//       title={`Order Details - ${orderData.orderNumber}`}
//       open={open}
//       onCancel={() => setOpen(false)}
//       footer={null}
//       width={1100}
//       destroyOnClose
//     >
//       <Spin spinning={false}>
//         <Descriptions bordered column={2} size="middle">
//           <Descriptions.Item label="Order Number" span={2}>
//             <strong>{orderData.orderNumber}</strong>
//           </Descriptions.Item>
          
//           <Descriptions.Item label="Customer Name">
//             {orderData.userId?.name}
//           </Descriptions.Item>
//           <Descriptions.Item label="Email">
//             {orderData.userId?.email}
//           </Descriptions.Item>
//           <Descriptions.Item label="Phone">
//             {orderData.userId?.phone}
//           </Descriptions.Item>

//           <Descriptions.Item label="Order Status">
//             <Tag color={
//               orderData.status === 4 ? "green" : 
//               orderData.status === 5 ? "red" : "blue"
//             }>
//               {getStatusLabel(orderData.status)}
//             </Tag>
//           </Descriptions.Item>
//           <Descriptions.Item label="Payment Status">
//             {orderData.isCod ? "Cash on Delivery" : orderData.isPaid ? "Paid" : "Pending"}
//           </Descriptions.Item>

//           <Descriptions.Item label="Created At">
//             {orderData.createdAt ? dayjs(orderData.createdAt).format("DD MMM YYYY, hh:mm A") : "-"}
//           </Descriptions.Item>
//           <Descriptions.Item label="Updated At">
//             {orderData.updatedAt ? dayjs(orderData.updatedAt).format("DD MMM YYYY, hh:mm A") : "-"}
//           </Descriptions.Item>
//         </Descriptions>

//         <Divider orientation="left">Items</Divider>
        
//         <Table
//           dataSource={orderData.items || []}
//           rowKey="_id"
//           pagination={false}
//           columns={[
//             { title: "Product", dataIndex: "name" },
//             { title: "SKU", dataIndex: "sku" },
//             { 
//               title: "Qty", 
//               dataIndex: "quantity",
//               width: 80,
//             },
//             { 
//               title: "Base Price", 
//               dataIndex: "basePrice",
//               render: (v) => `₹${v}`,
//             },
//             { 
//               title: "Discount", 
//               dataIndex: "discountAmount",
//               render: (v) => `₹${v}`,
//             },
//             { 
//               title: "GST", 
//               dataIndex: "gstAmount",
//               render: (v) => `₹${v}`,
//             },
//             { 
//               title: "Final Price", 
//               dataIndex: "finalPrice",
//               render: (v) => <strong>₹{v}</strong>,
//             },
//           ]}
//         />

//         <Divider orientation="left">Summary</Divider>
        
//         <Descriptions bordered column={2}>
//           <Descriptions.Item label="Subtotal">₹{orderData.subtotal}</Descriptions.Item>
//           <Descriptions.Item label="Total Discount">₹{orderData.totalDiscount}</Descriptions.Item>
//           <Descriptions.Item label="Total GST">₹{orderData.totalGst}</Descriptions.Item>
//           <Descriptions.Item label="Shipping Charge">₹{orderData.shippingCharge || 0}</Descriptions.Item>
//           <Descriptions.Item label="Grand Total" span={2}>
//             <strong>₹{orderData.grandTotal}</strong>
//           </Descriptions.Item>
//         </Descriptions>

//         <Divider orientation="left">Shipping Address</Divider>
        
//         {orderData.shippingAddress && (
//           <Descriptions bordered column={1}>
//             <Descriptions.Item label="Full Name">
//               {orderData.shippingAddress.fullName}
//             </Descriptions.Item>
//             <Descriptions.Item label="Phone">
//               {orderData.shippingAddress.phone}
//             </Descriptions.Item>
//             <Descriptions.Item label="Address">
//               {orderData.shippingAddress.line1}, {orderData.shippingAddress.line2 && `${orderData.shippingAddress.line2}, `}
//               {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.pincode}
//               {orderData.shippingAddress.landmark && ` (Near: ${orderData.shippingAddress.landmark})`}
//             </Descriptions.Item>
//           </Descriptions>
//         )}

//         <Divider orientation="left">Additional Info</Divider>
        
//         <Descriptions bordered column={2}>
//           <Descriptions.Item label="Payment Method">
//             {orderData.paymentMethod || "N/A"}
//           </Descriptions.Item>
//           <Descriptions.Item label="Paid At">
//             {orderData.paidAt ? dayjs(orderData.paidAt).format("DD MMM YYYY, hh:mm A") : "Not Paid"}
//           </Descriptions.Item>
//           <Descriptions.Item label="User Note" span={2}>
//             {orderData.userNote || "No note provided"}
//           </Descriptions.Item>
//         </Descriptions>
//       </Spin>
//     </Modal>
//   );
// });

//* eslint-disable react-hooks/exhaustive-deps */
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Spin,
  Card,
  message,
  Input,
  Space,
  Modal,
  Tag,
  Descriptions,
  Divider,
  Select,
} from "antd";
import {
  EyeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import servicesOrder from "../../../services/order-histrory";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function OrderHistory() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: undefined,
    paymentStatus: undefined,
  });

  const orderViewModalRef = useRef();

  const statusOptions = [
    { value: 1, label: "Pending" },
    { value: 2, label: "Confirmed" },
    // { value: 3, label: "Shipped" },
    // { value: 4, label: "Delivered" },
    { value: 5, label: "Cancelled" },
    { value: 7, label: "Other" },
  ];

  const paymentStatusOptions = [
    { value: 1, label: "Unpaid" },
    { value: 2, label: "Paid" },
    // { value: 3, label: "Cash on Delivery" },
  ];

  const getStatusTag = (status) => {
    const map = {
      1: { color: "blue", label: "Pending" },
      2: { color: "green", label: "Confirmed" },
      // { value: 3, label: "Shipped" },
      // { value: 4, label: "Delivered" },
      5: { color: "red", label: "Cancelled" },
      7: { color: "volcano", label: "Other" },
    };
    const st = map[status] || { color: "default", label: "Unknown" };
    return <Tag color={st.color}>{st.label}</Tag>;
  };

  const getPaymentStatusTag = (isPaid, isCod) => {
    if (isCod) return <Tag color="gold">Cash on Delivery</Tag>;
    return isPaid ? <Tag color="green">Paid</Tag> : <Tag color="red">Unpaid</Tag>;
  };

  const columns = [
    {
      title: "S.No",
      width: 60,
      render: (_, __, index) => index + 1 + (qData.page - 1) * qData.limit,
    },
    { title: "Order Number", dataIndex: "orderNumber" },
    {
      title: "Customer",
      render: (record) => record?.user?.name || record?.userId?.name || "Not Specified",
    },
    {
      title: "Email",
      render: (record) => record?.user?.email || "-",
    },
    {
      title: "Phone",
      render: (record) => record?.user?.phone || "-",
    },
    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      render: (amt) => `₹${amt || 0}`,
      align: "right",
    },
    { title: "Status", dataIndex: "status", render: getStatusTag },
    {
      title: "Payment",
      render: (record) => getPaymentStatusTag(record.isPaid, record.isCod),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY, hh:mm A") : "-"),
    },
    {
      title: "Action",
      width: 90,
      render: (_, row) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => orderViewModalRef.current.openForm(row)}
        >
        </Button>
      ),
    },
  ];

  function list() {
    setLoading(true);
    servicesOrder
      .listHistory(qData)
      .then((res) => {
        const orders = res?.data?.orders || [];
        const pagination = res?.data?.pagination || {};

        setData(orders.map((v) => ({ ...v, key: v._id })));

        setQData((prev) => ({
          ...prev,
          page: pagination?.page || prev.page,
          limit: pagination?.limit || prev.limit,
          total: pagination?.total,
        }));
      })
      .catch(() => message.error("Failed to fetch orders"))
      .finally(() => setLoading(false));
  }

  const tableColumns = columns.map((item) => ({ ...item, ellipsis: true }));
  tableColumns[0].fixed = true;
  tableColumns[tableColumns.length - 1].fixed = "right";

  const tableProps = {
    bordered: true,
    loading,
    size: "small",
    title: () => (
      <Search
        qData={qData}
        setQData={setQData}
        list={list}
        statusOptions={statusOptions}
        paymentStatusOptions={paymentStatusOptions}
      />
    ),
    showHeader: true,
    footer: () => <Pagination {...{ qData, setQData, list }} />,
  };

  // Fixed: Only trigger on actual relevant changes
  useEffect(() => {
    list();
  }, [qData.page, qData.limit, qData.status, qData.paymentStatus, qData.search]);

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
          Order History
        </Space>
      }
    >
      <Table
        {...tableProps}
        pagination={{ position: ["none"], pageSize: qData.limit }}
        columns={tableColumns}
        dataSource={data}
        scroll={{ y: "calc(100vh - 380px)", x: "max-content" }}
      />

      <ViewOrderModal ref={orderViewModalRef} />
    </Card>
  );
}

function Search({ qData, setQData, list, statusOptions, paymentStatusOptions }) {
  const handleReset = () => {
    setQData({
      page: 1,
      limit: 10,
      search: "",
      status: undefined,
      paymentStatus: undefined,
    });
  };

  return (
    <Form
      onSubmitCapture={(e) => {
        e.preventDefault();
        setQData((prev) => ({ ...prev, page: 1 }));
        list();
      }}
    >
      <Row gutter={12} align="middle">
        <Col span={6}>
          <Input
            placeholder="Search Order No, Name, Email..."
            value={qData.search}
            onChange={(e) => setQData({ ...qData, search: e.target.value })}
            allowClear
          />
        </Col>

        <Col span={5}>
          <Select
            placeholder="Order Status"
            value={qData.status}
            onChange={(val) => setQData({ ...qData, status: val, page: 1 })}
            allowClear
            style={{ width: "100%" }}
            options={statusOptions}
          />
        </Col>

        <Col span={5}>
          <Select
            placeholder="Payment Status"
            value={qData.paymentStatus}
            onChange={(val) => setQData({ ...qData, paymentStatus: val, page: 1 })}
            allowClear
            style={{ width: "100%" }}
            options={paymentStatusOptions}
          />
        </Col>

        <Col>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Col>

        <Col>
          <Button onClick={handleReset}>Reset</Button>
        </Col>
      </Row>
    </Form>
  );
}

const ViewOrderModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState({});

  useImperativeHandle(ref, () => ({
    openForm(data) {
      setOrderData(data);
      setOpen(true);
    },
  }));

  const getStatusLabel = (status) => {
    const map = { 1: "Pending", 2: "Confirmed", 3: "Shipped", 4: "Delivered", 5: "Cancelled", 7: "Other" };
    return map[status] || "Unknown";
  };

  return (
    <Modal
      title={`Order Details - ${orderData.orderNumber || ""}`}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={1150}
      destroyOnClose
    >
      <Spin spinning={false}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Order Number" span={2}>
            <strong>{orderData.orderNumber}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Customer Name">
            {orderData.user?.name || orderData.userId?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {orderData.user?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {orderData.user?.phone}
          </Descriptions.Item>

          <Descriptions.Item label="Order Status">
            <Tag color={orderData.status === 4 ? "green" : orderData.status === 5 ? "red" : "blue"}>
              {getStatusLabel(orderData.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            {orderData.isCod ? "Cash on Delivery" : orderData.isPaid ? "Paid" : "Unpaid"}
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {orderData.createdAt ? dayjs(orderData.createdAt).format("DD MMM YYYY, hh:mm A") : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {orderData.updatedAt ? dayjs(orderData.updatedAt).format("DD MMM YYYY, hh:mm A") : "-"}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Order Items</Divider>
        <Table
          dataSource={orderData.items || []}
          rowKey="_id"
          pagination={false}
          columns={[
            { title: "Product Name", dataIndex: "name", ellipsis: true },
            { title: "SKU", dataIndex: "sku", width: 120 },
            { title: "Qty", dataIndex: "quantity", width: 80, align: "center" },
            { title: "Base Price", dataIndex: "basePrice", render: (v) => `₹${v}`, align: "right" },
            { title: "Discount", dataIndex: "discountAmount", render: (v) => `₹${v}`, align: "right" },
            { title: "GST", dataIndex: "gstAmount", render: (v) => `₹${v}`, align: "right" },
            { title: "Final Price", dataIndex: "finalPrice", render: (v) => <strong>₹{v}</strong>, align: "right" },
          ]}
        />

        <Divider orientation="left">Order Summary</Divider>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Subtotal">₹{orderData.subtotal}</Descriptions.Item>
          <Descriptions.Item label="Total Discount">₹{orderData.totalDiscount}</Descriptions.Item>
          <Descriptions.Item label="Total GST">₹{orderData.totalGst}</Descriptions.Item>
          <Descriptions.Item label="Shipping Charge">₹{orderData.shippingCharge || 0}</Descriptions.Item>
          <Descriptions.Item label="Grand Total" span={2}>
            <strong>₹{orderData.grandTotal}</strong>
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Shipping Address</Divider>
        {orderData.shippingAddress && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Full Name">{orderData.shippingAddress.fullName}</Descriptions.Item>
            <Descriptions.Item label="Phone">{orderData.shippingAddress.phone}</Descriptions.Item>
            <Descriptions.Item label="Address">
              {orderData.shippingAddress.line1}
              {orderData.shippingAddress.line2 && `, ${orderData.shippingAddress.line2}`}<br />
              {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.pincode}
              {orderData.shippingAddress.landmark && ` (Landmark: ${orderData.shippingAddress.landmark})`}
            </Descriptions.Item>
          </Descriptions>
        )}

        <Divider orientation="left">Additional Information</Divider>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Payment Method">
            {orderData.paymentMethod || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Paid At">
            {orderData.paidAt ? dayjs(orderData.paidAt).format("DD MMM YYYY, hh:mm A") : "Not Paid"}
          </Descriptions.Item>
          <Descriptions.Item label="User Note" span={2}>
            {orderData.userNote || "No note provided"}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
});