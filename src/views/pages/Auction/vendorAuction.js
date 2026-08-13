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
  Modal,
  Select,
  DatePicker,
  Tag,
  InputNumber,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import serviceAuction from "../../../services/vendorAuction"; 
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { AntdMsg } from "../../../utils/Antd";
import dayjs from "dayjs";

const AUCTION_STATUS_LABELS = {
  1: "DRAFT",
  3: "SCHEDULED",
  4: "COMPLETED",
  5: "CANCELLED",
  6: "CLOSED_UNSOLD",
  7: "PENDING_APPROVAL",
  8: "REJECTED",
};

const AUCTION_EFFECTIVE_STATUS_LABELS = {
  1: "SCHEDULED",
  2: "LIVE",
  3: "ENDED",
};

const AUCTION_STATUS_OPTIONS = Object.entries(AUCTION_STATUS_LABELS).map(
  ([key, value]) => ({
    value,
    label: value
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  })
);

export default function VendorAuction() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qData, setQData] = useState({ page: 1, limit: 10, search: "", status: undefined });
  const [cancelModal, setCancelModal] = useState({ open: false, id: null, reason: "" });

  const addNewModalRef = useRef();
  const viewBidsModalRef = useRef();



  const columns = [
    { title: "S.No", width: 60, render: (_, __, index) => index + 1 },
    {
      title: "Title",
      dataIndex: "title",
      render: (title) => <strong>{title || "-"}</strong>,
    },
    {
      title: "Product",
      dataIndex: "productId",
      render: (product) =>
        product ? (
          <Space direction="vertical" size={0}>
            <span>{product.name}</span>
            <small style={{ color: "#888" }}>₹{product.price?.toLocaleString()}</small>
          </Space>
        ) : (
          "-"
        ),
    },
    {
      title: "Starting Price",
      dataIndex: "startingPrice",
      render: (v) => (v != null ? `₹${Number(v).toLocaleString()}` : "-"),
    },
    {
      title: "Bidders",
      dataIndex: "bidderCount",
      render: (v) => v ?? 0,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY • hh:mm A") : "-"),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY • hh:mm A") : "-"),
    },
    {
      title: "Status",
      dataIndex: "effectiveStatus",
      render: (status) => {
        const colorMap = {
          DRAFT: "default",
          LIVE: "green",
          UPCOMING: "blue",
          ENDED: "orange",
          CANCELLED: "red",
        };
        return <Tag color={colorMap[status] || "default"}>{status || "-"}</Tag>;
      },
    },
    {
      title: "Action",
      width: 280,
      fixed: "right",
      render: (_, row) => (
        <Space wrap>
          <Button
            type="default"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => viewBidsModalRef.current.openModal(row._id)}
          >
            Bids
          </Button>

          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => addNewModalRef.current.openForm(row)}
          />

          {row.effectiveStatus === "DRAFT" && (
            <Popconfirm
              title="Publish this auction?"
              onConfirm={() => publishAuction(row._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                style={{ background: "#52c41a", borderColor: "#52c41a" }}
              >
                Publish
              </Button>
            </Popconfirm>
          )}

          {["DRAFT", "UPCOMING", "LIVE"].includes(row.effectiveStatus) && (
            <Button
              type="primary"
              size="small"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => openCancelModal(row._id)}
            >
              Cancel
            </Button>
          )}

          {/* <Popconfirm
            title="Delete this auction?"
            onConfirm={() => deleteData(row._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

function list() {
  setLoading(true);

  serviceAuction
    .listAuction(qData)
    .then((res) => {
      const auctions = Array.isArray(res?.data?.auctions)
        ? res.data.auctions
        : [];

      setData(
        auctions.map((v) => ({
          ...v,
          key: v._id,
        }))
      );

      const pagination = res?.data?.pagination || {};

      setQData((prev) => ({
        ...prev,
        limit: pagination.limit ?? 10,
        page: pagination.page ?? 1,
        total: pagination.total ?? 0,
        totalPages: pagination.totalPages ?? 1,
      }));
    })
    .catch((e) => {
      message.error(e?.message || "Failed to load auctions");
    })
    .finally(() => {
      setLoading(false);
    });
}

  const deleteData = (id) => {
    serviceAuction
      .delete(id)
      .then(() => {
        message.success("Auction deleted successfully");
        list();
      })
      .catch((err) => message.error(err?.message || "Delete failed"));
  };

  const publishAuction = (id) => {
    serviceAuction
      .updateAuction(id, { status: "PUBLISHED" })
      .then(() => {
        message.success("Auction published successfully");
        list();
      })
      .catch((err) => message.error(err?.message || "Publish failed"));
  };

  const openCancelModal = (id) => {
    setCancelModal({ open: true, id, reason: "" });
  };

  const handleCancelAuction = () => {
    if (!cancelModal.reason.trim()) {
      return message.error("Please enter a cancel reason");
    }

    serviceAuction
      .cancel(cancelModal.id, { reason: cancelModal.reason.trim() })
      .then(() => {
        message.success("Auction cancelled successfully");
        setCancelModal({ open: false, id: null, reason: "" });
        list();
      })
      .catch((err) => message.error(err?.message || "Cancel failed"));
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
          Auction Management
        </Space>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => addNewModalRef.current.openForm()}
        >
          Add New Auction
        </Button>
      }
    >
      <Table
        bordered
        loading={loading}
        title={() => <Search {...{ qData, setQData, list }} />}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
        footer={() => <Pagination {...{ qData, setQData }} />}
      />

      <AddForm ref={addNewModalRef} list={list} />
      <ViewBidsModal ref={viewBidsModalRef} />

      {/* Cancel Auction Modal */}
      <Modal
        title="Cancel Auction"
        open={cancelModal.open}
        onCancel={() => setCancelModal({ open: false, id: null, reason: "" })}
        onOk={handleCancelAuction}
        okText="Cancel Auction"
        okButtonProps={{ danger: true }}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="Reason" required>
            <Input.TextArea
              rows={3}
              placeholder="Enter reason for cancellation"
              value={cancelModal.reason}
              onChange={(e) =>
                setCancelModal((prev) => ({ ...prev, reason: e.target.value }))
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

/* ==================== Search ==================== */
function Search({ qData, setQData, list }) {
  return (
    <Form
      onSubmitCapture={(e) => {
        e.preventDefault();
        setQData((prev) => ({ ...prev, page: 1 }));
        list();
      }}
    >
      <Row gutter={12}>
        <Col span={5}>
          <Input
            placeholder="Search by title / product"
            value={qData.search}
            onChange={(e) => setQData({ ...qData, search: e.target.value })}
            allowClear
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Filter by status"
            value={qData.status}
            options={AUCTION_STATUS_OPTIONS}
            allowClear
            onChange={(value) =>
              setQData((prev) => ({
                ...prev,
                status: value,
                page: 1,
              }))
            }
          />
        </Col>

        <Col>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

/* ==================== Add / Edit Modal ==================== */
const AddForm = forwardRef(({ list }, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const fetchProducts = () => {
    setProductsLoading(true);
    serviceAuction
      .listProduct({ page: 1, limit: 1000 })
      .then((res) => {
        const list = res?.data?.products || res?.data || [];
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch(() => message.error("Failed to load products"))
      .finally(() => setProductsLoading(false));
  };

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      fetchProducts();

      if (dt) {
        setData({
          ...dt,
          productId: typeof dt.productId === "object" ? dt.productId._id : dt.productId,
          startTime: dt.startTime ? dayjs(dt.startTime) : null,
          endTime: dt.endTime ? dayjs(dt.endTime) : null,
        });
      } else {
        setData({
          productId: undefined,
          startingPrice: null,
          reservePrice: null,
          bidIncrement: null,
          startTime: null,
          endTime: null,
        });
      }
    },
  }));

  const handleChange = (value) => setData((prev) => ({ ...prev, ...value }));

  const save = () => {
    if (!data.productId) {
      return message.error("Product is required");
    }
    if (!data.startingPrice && data.startingPrice !== 0) {
      return message.error("Starting price is required");
    }
    // if (!data.reservePrice && data.reservePrice !== 0) {
    //   return message.error("Reserve price is required");
    // }
    // if (!data.bidIncrement && data.bidIncrement !== 0) {
    //   return message.error("Bid increment is required");
    // }
    if (!data.startTime || !data.endTime) {
      return message.error("Start time and End time are required");
    }

    setAjxRequesting(true);
    const payload = {
      productId: data.productId,
      startingPrice: Number(data.startingPrice),
      reservePrice: Number(data.reservePrice),
      bidIncrement: Number(data.bidIncrement),
      startTime: dayjs(data.startTime).toISOString(),
      endTime: dayjs(data.endTime).toISOString(),
    };

    const apiCall = data._id
      ? serviceAuction.updateAuction(data._id, payload)
      : serviceAuction.addAuction(payload);

    apiCall
      .then((res) => {
        AntdMsg(res?.message || "Success");
        list();
        setOpen(false);
      })
      .catch((err) => AntdMsg(err?.message || "Something went wrong", "error"))
      .finally(() => setAjxRequesting(false));
  };

  return (
    <Modal
      title={data?._id ? "Edit Auction" : "Add New Auction"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={ajxRequesting}
          onClick={save}
        >
          Save
        </Button>,
      ]}
      width={900}
      destroyOnClose
    >
      <Spin spinning={ajxRequesting}>
        <Form layout="vertical">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Product" required>
                <Select
                  showSearch
                  placeholder="Select a product"
                  value={data.productId}
                  onChange={(v) => handleChange({ productId: v })}
                  loading={productsLoading}
                  disabled={!!data._id}
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  options={products.map((p) => ({
                    value: p._id,
                    label: `${p.name || "Unnamed"} — ₹${Number(p.price || 0).toLocaleString()}`,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Starting Price (₹)" required>
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  value={data.startingPrice}
                  onChange={(v) => handleChange({ startingPrice: v })}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Start Time" required>
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  value={data.startTime ? dayjs(data.startTime) : null}
                  onChange={(date) => handleChange({ startTime: date })}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="End Time" required>
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  value={data.endTime ? dayjs(data.endTime) : null}
                  onChange={(date) => handleChange({ endTime: date })}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});

/* ==================== View Bids Modal ==================== */

const ViewBidsModal = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const [auctionInfo, setAuctionInfo] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [auctionId, setAuctionId] = useState(null);

  // Same pagination shape as the main Auction table
  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useImperativeHandle(ref, () => ({
    openModal(id) {
      setAuctionId(id);
      setQData({ page: 1, limit: 10, total: 0, totalPages: 1 });
      fetchBids(id, { page: 1, limit: 10 });
    },
  }));

  const fetchBids = async (id, params = {}) => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await serviceAuction.getBids(id, {
        page: params.page || qData.page,
        limit: params.limit || qData.limit,
      });

      const payload = res?.data?.data || res?.data || {};
      const pagination = res?.pagination || res?.data?.pagination || {};

      setAuctionInfo({
        auctionId: payload.auctionId,
        reservePrice: payload.reservePrice,
        totalBids: payload.totalBids ?? pagination.total ?? 0,
      });

      setBids(
        (payload.bids || []).map((b) => ({
          ...b,
          key: b.bidId,
        }))
      );

      setQData((prev) => ({
        ...prev,
        page: pagination.page ?? prev.page,
        limit: pagination.limit ?? prev.limit,
        total: pagination.total ?? 0,
        totalPages: pagination.totalPages ?? 1,
      }));
    } catch (err) {
      message.error(err?.message || "Failed to load bids");
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  // Re-fetch when page / limit changes
  useEffect(() => {
    if (open && auctionId) {
      fetchBids(auctionId, { page: qData.page, limit: qData.limit });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qData.page, qData.limit]);

  const openBidDetail = (bid) => {
    setSelectedBid(bid);
    setDetailOpen(true);
  };

  const bidColumns = [
    {
      title: "Rank",
      dataIndex: "rank",
      width: 70,
      render: (v) => <Tag color="blue">#{v}</Tag>,
    },
    {
      title: "Bidder",
      dataIndex: "bidder",
      render: (bidder) =>
        bidder ? (
          <Space direction="vertical" size={0}>
            <span>{bidder.name || "-"}</span>
            <small style={{ color: "#888" }}>{bidder.email || ""}</small>
          </Space>
        ) : (
          "-"
        ),
    },
    {
      title: "Bid Amount",
      dataIndex: "amount",
      render: (v) => (v != null ? `₹${Number(v).toLocaleString()}` : "-"),
    },
    {
      title: "Mobile No.",
      dataIndex: "phone",
      render: (v, row) => row.bidder?.phone || "-",
    },
    {
      title: "Bid Time",
      dataIndex: "placedAt",
      render: (date) =>
        date ? dayjs(date).format("DD MMM YYYY • hh:mm A") : "-",
    },
    {
      title: "Action",
      width: 100,
      fixed: "right",
      render: (_, row) => (
        <Button
          size="small"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => openBidDetail(row)}
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Auction Bids"
        open={open}
        onCancel={() => {
          setOpen(false);
          setAuctionId(null);
          setBids([]);
          setAuctionInfo(null);
        }}
        footer={null}
        width={1100}
        destroyOnClose
      >
        {auctionInfo && (
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 8]}>
              <Col span={8}>
                <strong>Auction ID:</strong>{" "}
                <Tag color="blue">{auctionInfo.auctionId}</Tag>
              </Col>
              <Col span={8}>
                <strong>Total Bids:</strong> {auctionInfo.totalBids}
              </Col>
            </Row>
          </Card>
        )}

        {/* Same table format + pagination as main Auction table */}
        <Table
          bordered
          loading={loading}
          columns={bidColumns}
          dataSource={bids}
          pagination={false}
          scroll={{ x: "max-content", y: 400 }}
          locale={{ emptyText: "No bids placed yet" }}
          size="small"
          footer={() => (
            <Pagination
              qData={qData}
              setQData={setQData}
            />
          )}
        />
      </Modal>

      {/* Bid Detail Modal */}
      <Modal
        title="Bid Detail"
        open={detailOpen}
        onCancel={() => {
          setDetailOpen(false);
          setSelectedBid(null);
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        {selectedBid ? (
          <Card size="small">
            <Row gutter={[16, 12]}>
              <Col span={12}>
                <strong>Bid ID:</strong> {selectedBid.bidId}
              </Col>
              <Col span={12}>
                <strong>Rank:</strong> #{selectedBid.rank}
              </Col>
              <Col span={12}>
                <strong>Alias:</strong> {selectedBid.alias || "-"}
              </Col>
              <Col span={12}>
                <strong>Amount:</strong> ₹
                {Number(selectedBid.amount || 0).toLocaleString()}
              </Col>
              <Col span={12}>
                <strong>Meets Reserve:</strong>{" "}
                {selectedBid.meetsReserve === true ? (
                  <Tag color="green">Yes</Tag>
                ) : selectedBid.meetsReserve === false ? (
                  <Tag color="red">No</Tag>
                ) : (
                  "-"
                )}
              </Col>
              <Col span={12}>
                <strong>Placed At:</strong>{" "}
                {selectedBid.placedAt
                  ? dayjs(selectedBid.placedAt).format("DD MMM YYYY • hh:mm A")
                  : "-"}
              </Col>

              {selectedBid.bidder && (
                <>
                  <Col span={24}>
                    <strong>Bidder Name:</strong> {selectedBid.bidder.name}
                  </Col>
                  <Col span={12}>
                    <strong>Email:</strong> {selectedBid.bidder.email || "-"}
                  </Col>
                  <Col span={12}>
                    <strong>Phone:</strong> {selectedBid.bidder.phone || "-"}
                  </Col>
                </>
              )}
            </Row>
          </Card>
        ) : (
          <p>No detail available</p>
        )}
      </Modal>
    </>
  );
});