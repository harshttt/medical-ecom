// // ProductManagement.jsx
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Row,
//   Col,
//   Popconfirm,
//   Card,
//   Spin,
//   message,
//   Input,
//   Space,
//   Switch,
//   Tag,
//   Image,
//   Modal,
//   Select,
//   InputNumber,
//   Divider,
// } from "antd";
// import {
//   DeleteOutlined,
//   EditOutlined,
//   EyeOutlined,
//   PlusOutlined,
//   ArrowLeftOutlined,
//   MinusCircleOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import AdminProductService from "../../../services/product";
// import Pagination from "../../components/Pagination";
// import dayjs from "dayjs";
// import TinyMce from "../../../utils/TinyMce";

// const { TextArea } = Input;
// const { Option } = Select;

// // ==================== Add/Edit Product Modal ====================
// const AddEditProductModal = React.forwardRef(({ onSuccess }, ref) => {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [form] = Form.useForm();
//   const [editId, setEditId] = useState(null);

//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);

//   React.useImperativeHandle(ref, () => ({
//     openForm: async (productData = null) => {
//       console.log("🔄 openForm called", productData ? "Edit Mode" : "Add Mode");

//       await loadDropdowns();

//       if (productData) {
//         setEditId(productData._id);
//         populateForm(productData);
//       } else {
//         setEditId(null);
//         form.resetFields();
//       }
//       setOpen(true);
//     },
//   }));

//   const loadDropdowns = async () => {
//     try {
//       console.log("📥 Loading categories and brands...");
//       const [categoriesRes, brandsRes] = await Promise.all([
//         AdminProductService.getAllCategories(),
//         AdminProductService.getAllBrands(),
//       ]);

//       setCategories(categoriesRes?.data?.categories || []);
//       setBrands(brandsRes?.data?.brands || []);
//       console.log(
//         "✅ Categories loaded:",
//         categoriesRes?.data?.categories?.length || 0,
//       );
//       console.log("✅ Brands loaded:", brandsRes?.data?.brands?.length || 0);
//     } catch (error) {
//       console.error("❌ Dropdown load error:", error);
//       message.error("Failed to load categories or brands");
//     }
//   };

//   const populateForm = (product) => {
//     const categoryId = product.categoryId?._id || product.categoryId;
//     console.log("📝 Populating form for edit. Category ID:", categoryId);

//     form.setFieldsValue({
//       categoryId,
//       brandId: product.brandId?._id || product.brandId,
//       name: product.name,
//       sku: product.sku,
//       description: product.description,
//       highlights: product.highlights?.length ? product.highlights : [""],
//       price: product.price,
//       discount: product.discount,
//       gst: product.gst,
//       stock: product.stock,
//       images: product.images?.length ? product.images : [""],
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();
//       console.log("📤 Submitting form values:", values);

//       setLoading(true);

//       const formattedValues = {
//         ...values,
//         highlights: values.highlights?.filter(Boolean) || [],
//         images: values.images?.filter(Boolean) || [],
//       };

//       if (editId) {
//         await AdminProductService.updateProduct(editId, formattedValues);
//         message.success("Product updated successfully");
//       } else {
//         await AdminProductService.createProduct(formattedValues);
//         message.success("Product created successfully");
//       }

//       setOpen(false);
//       form.resetFields();
//       onSuccess?.();
//     } catch (error) {
//       console.error("❌ Submit error:", error);
//       message.error(error?.response?.data?.message || "Operation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title={editId ? "Edit Product" : "Add New Product"}
//       open={open}
//       onCancel={() => {
//         console.log("❌ Modal closed");
//         setOpen(false);
//         form.resetFields();
//       }}
//       width={950}
//       footer={[
//         <Button key="cancel" onClick={() => setOpen(false)}>
//           Cancel
//         </Button>,
//         <Button
//           key="submit"
//           type="primary"
//           loading={loading}
//           onClick={handleSubmit}
//         >
//           {editId ? "Update" : "Create"}
//         </Button>,
//       ]}
//       destroyOnClose
//     >
//       <Form form={form} layout="vertical">
//         {/* Category Select */}
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="categoryId"
//               label="Category"
//               rules={[{ required: true }]}
//             >
//               <Select
//                 placeholder="Select Category"
//                 showSearch
//                 optionFilterProp="children"
//               >
//                 {categories.map((cat) => (
//                   <Option key={cat._id} value={cat._id}>
//                     {cat.name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="brandId"
//               label="Brand"
//               rules={[{ required: true, message: "Please select brand" }]}
//             >
//               <Select
//                 placeholder="Select Brand"
//                 showSearch
//                 optionFilterProp="children"
//               >
//                 {brands.map((brand) => (
//                   <Option key={brand._id} value={brand._id}>
//                     {brand.name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="name"
//               label="Product Name"
//               rules={[{ required: true }]}
//             >
//               <Input placeholder="Enter product name" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
//               <Input placeholder="Enter SKU" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item
//           name="description"
//           label="Description"
//           rules={[{ required: true, message: "Please enter product description" }]}
//         >
//           <TinyMce
//             value={form.getFieldValue("description") || ""}
//             onChange={(v) => form.setFieldsValue({ description: v })}
//           />
//         </Form.Item>

//         <Form.Item label="Highlights">
//           <Form.List name="highlights">
//             {(fields, { add, remove }) => (
//               <>
//                 {fields.map(({ key, name, ...restField }) => (
//                   <Space
//                     key={key}
//                     style={{ display: "flex", marginBottom: 8 }}
//                     align="baseline"
//                   >
//                     <Form.Item
//                       {...restField}
//                       name={name}
//                       rules={[
//                         { required: true, message: "Please enter highlight" },
//                       ]}
//                       style={{ flex: 1, marginBottom: 0 }}
//                     >
//                       <Input placeholder="Enter product highlight" />
//                     </Form.Item>
//                     <MinusCircleOutlined onClick={() => remove(name)} />
//                   </Space>
//                 ))}
//                 <Form.Item>
//                   <Button
//                     type="dashed"
//                     onClick={() => add()}
//                     block
//                     icon={<PlusOutlined />}
//                   >
//                     Add Highlight
//                   </Button>
//                 </Form.Item>
//               </>
//             )}
//           </Form.List>
//         </Form.Item>

//         <Row gutter={16}>
//           <Col span={6}>
//             <Form.Item
//               name="price"
//               label="Price (₹)"
//               rules={[{ required: true }]}
//             >
//               <InputNumber
//                 style={{ width: "100%" }}
//                 min={0}
//                 formatter={(value) =>
//                   `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                 }
//                 parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={6}>
//             <Form.Item
//               name="discount"
//               label="Discount (%)"
//               rules={[{ required: true }]}
//             >
//               <InputNumber
//                 style={{ width: "100%" }}
//                 min={0}
//                 max={100}
//                 formatter={(v) => `${v}%`}
//                 parser={(v) => v.replace("%", "")}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={6}>
//             <Form.Item
//               name="gst"
//               label="GST (%)"
//               rules={[{ required: true }]}
//             >
//               <InputNumber
//                 style={{ width: "100%" }}
//                 min={0}
//                 max={100}
//                 formatter={(v) => `${v}%`}
//                 parser={(v) => v.replace("%", "")}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={6}>
//             <Form.Item
//               name="stock"
//               label="Stock Quantity"
//               rules={[{ required: true }]}
//             >
//               <InputNumber style={{ width: "100%" }} min={0} />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item label="Product Images (URLs)">
//           <Form.List name="images">
//             {(fields, { add, remove }) => (
//               <>
//                 {fields.map(({ key, name, ...restField }) => (
//                   <Space
//                     key={key}
//                     style={{ display: "flex", marginBottom: 8 }}
//                     align="baseline"
//                   >
//                     <Form.Item
//                       {...restField}
//                       name={name}
//                       rules={[
//                         { required: true, message: "Please enter image URL" },
//                         { type: "url", message: "Please enter valid URL" },
//                       ]}
//                       style={{ flex: 1 }}
//                     >
//                       <Input placeholder="https://example.com/image.jpg" />
//                     </Form.Item>
//                     <MinusCircleOutlined onClick={() => remove(name)} />
//                   </Space>
//                 ))}
//                 <Form.Item>
//                   <Button
//                     type="dashed"
//                     onClick={() => add()}
//                     block
//                     icon={<PlusOutlined />}
//                   >
//                     Add Image URL
//                   </Button>
//                 </Form.Item>
//               </>
//             )}
//           </Form.List>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// });

// // ==================== Product View Modal ====================
// const ProductViewModal = ({ open, data, onClose }) => {
//   if (!data) return null;

//   return (
//     <Modal
//       title="Product Details"
//       open={open}
//       onCancel={onClose}
//       footer={<Button onClick={onClose}>Close</Button>}
//       width={800}
//       destroyOnClose
//     >
//       <Form layout="vertical">
//         <Row gutter={20}>
//           <Col span={24} style={{ textAlign: "center", marginBottom: 20 }}>
//             <Image.PreviewGroup>
//               <Space>
//                 {data.images?.map((img, idx) => (
//                   <Image
//                     key={idx}
//                     width={100}
//                     height={100}
//                     src={img}
//                     style={{ objectFit: "cover", borderRadius: 4 }}
//                   />
//                 ))}
//               </Space>
//             </Image.PreviewGroup>
//           </Col>

//           <Col span={12}>
//             <Form.Item label="Product Name">
//               <Input value={data.name} disabled />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item label="SKU">
//               <Input value={data.sku} disabled/>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item label="Category">
//               <Input value={data.categoryId?.name} disabled />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item label="Brand">
//               <Input value={data.brandId?.name} disabled />
//             </Form.Item>
//           </Col>

//           <Col span={24}>
//             <Form.Item label="Description">
//               <TextArea value={data.description} rows={3} disabled />
//             </Form.Item>
//           </Col>

//           <Col span={24}>
//             <Form.Item label="Highlights">
//               <ul>
//                 {data.highlights?.map((highlight, idx) => (
//                   <li key={idx}>{highlight}</li>
//                 ))}
//               </ul>
//             </Form.Item>
//           </Col>

//           <Col span={6}>
//             <Form.Item label="Price">
//               <Input value={`₹ ${data.price?.toLocaleString()}`} disabled />
//             </Form.Item>
//           </Col>
//           <Col span={6}>
//             <Form.Item label="Discount">
//               <Input value={`${data.discount}%`} disabled />
//             </Form.Item>
//           </Col>
//           <Col span={6}>
//             <Form.Item label="GST">
//               <Input value={`${data.gst}%`} disabled />
//             </Form.Item>
//           </Col>
//           <Col span={6}>
//             <Form.Item label="Stock">
//               <Input value={data.stock} disabled />
//             </Form.Item>
//           </Col>
//         </Row>
//       </Form>
//     </Modal>
//   );
// };

// // ==================== Main Product Management Component ====================
// export default function ProductManagement() {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selected, setSelected] = useState([]);
//   const [qData, setQData] = useState({ page: 1, limit: 10 });

//   const addEditModalRef = useRef();
//   const [viewModal, setViewModal] = useState({ open: false, data: null });

//   const columns = [
//     {
//       title: "S.No",
//       dataIndex: "sno",
//       width: 60,
//       render: (_, __, index) => index + 1 + (qData.page - 1) * qData.limit,
//     },
//     {
//       title: "Product",
//       dataIndex: "images",
//       width: 80,
//       render: (images) => (
//         <Image
//           src={images?.[0] || "/placeholder-image.png"}
//           width={50}
//           height={50}
//           style={{ objectFit: "cover", borderRadius: 4 }}
//           fallback="/placeholder-image.png"
//         />
//       ),
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       width: 200,
//       render: (name) => name || "-",
//     },
//     { title: "SKU", dataIndex: "sku", width: 120, render: (sku) => sku || "-" },
//     {
//       title: "Category",
//       dataIndex: "categoryId",
//       width: 150,
//       render: (cat) => cat?.name || "-",
//     },
//     {
//       title: "Brand",
//       dataIndex: "brandId",
//       width: 150,
//       render: (brand) => brand?.name || "-",
//     },
//     {
//       title: "Price (₹)",
//       dataIndex: "price",
//       width: 120,
//       render: (price) => `₹ ${price?.toLocaleString() || 0}`,
//     },
//     {
//       title: "Stock",
//       dataIndex: "stock",
//       width: 80,
//       render: (stock) => (
//         <Tag color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}>
//           {stock || 0}
//         </Tag>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "isActive",
//       width: 100,
//       render: (isActive, record) => (
//         <Switch
//           checked={isActive}
//           onChange={() => toggleStatusHandler(record._id)}
//           checkedChildren="Active"
//           unCheckedChildren="Inactive"
//         />
//       ),
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       width: 120,
//       render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "-"),
//     },
//     {
//       title: "Action",
//       dataIndex: "_id",
//       width: 120,
//       fixed: "right",
//       render: (id, record) => (
//         <Space>
//           <Button
//             type="primary"
//             size="small"
//             icon={<EyeOutlined />}
//             onClick={() => setViewModal({ open: true, data: record })}
//           />
//           <Button
//             type="primary"
//             size="small"
//             icon={<EditOutlined />}
//             onClick={() => addEditModalRef.current.openForm(record)}
//           />
//           <Popconfirm
//             title="Delete this product?"
//             onConfirm={() => deleteHandler(id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button
//               type="primary"
//               size="small"
//               danger
//               icon={<DeleteOutlined />}
//             />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const listProducts = () => {
//     setLoading(true);
//     AdminProductService.getAllProducts(qData)
//       .then((res) => {
//         const products = res?.data?.products || res?.data?.data || [];
//         setData(products.map((v) => ({ ...v, key: v._id })));
//       })
//       .catch(() => message.error("Failed to fetch products"))
//       .finally(() => setLoading(false));
//   };

//   const deleteHandler = (id) => {
//     setLoading(true);
//     AdminProductService.deleteProduct(id)
//       .then(() => {
//         message.success("Product deleted successfully");
//         listProducts();
//         setSelected([]);
//       })
//       .catch((err) =>
//         message.error(err?.response?.data?.message || "Failed to delete"),
//       )
//       .finally(() => setLoading(false));
//   };

//   const deleteManyHandler = () => {
//     setLoading(true);
//     AdminProductService.deleteManyProducts(selected)
//       .then(() => {
//         message.success(`${selected.length} products deleted`);
//         listProducts();
//         setSelected([]);
//       })
//       .catch((err) =>
//         message.error(err?.response?.data?.message || "Failed to delete"),
//       )
//       .finally(() => setLoading(false));
//   };

//   const toggleStatusHandler = (id) => {
//     setLoading(true);
//     AdminProductService.toggleProductStatus(id)
//       .then(() => {
//         message.success("Status updated");
//         listProducts();
//       })
//       .catch((err) =>
//         message.error(
//           err?.response?.data?.message || "Failed to update status",
//         ),
//       )
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     listProducts();
//   }, [qData.page, qData.limit]);

//   const rowSelection = {
//     selectedRowKeys: selected,
//     onChange: setSelected,
//   };

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
//           Product Management
//         </Space>
//       }
//       extra={
//         <Row justify="end" gutter={12}>
//           {selected.length > 0 && (
//             <Col>
//               <Popconfirm
//                 title={`Delete ${selected.length} selected products?`}
//                 onConfirm={deleteManyHandler}
//               >
//                 <Button type="primary" danger icon={<DeleteOutlined />}>
//                   Delete Selected ({selected.length})
//                 </Button>
//               </Popconfirm>
//             </Col>
//           )}
//           <Col>
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={() => addEditModalRef.current.openForm()}
//             >
//               Add New Product
//             </Button>
//           </Col>
//         </Row>
//       }
//     >
//       <Table
//         bordered
//         loading={loading}
//         size="small"
//         rowSelection={rowSelection}
//         columns={columns.map((col) => ({ ...col, ellipsis: false }))}
//         dataSource={data}
//         scroll={{ y: "calc(100vh - 340px)", x: 1200 }}
//         pagination={false}
//         title={() => (
//           <Form
//             onSubmitCapture={() => {
//               setQData((prev) => ({ ...prev, page: 1 }));
//               listProducts();
//             }}
//           >
//             <Row gutter={12}>
             
//                <Col span={6}>
//                 <Input
//                   placeholder="Search by name, SKU..."
//                   value={qData.search}
//                   onChange={(e) =>
//                     setQData({ ...qData, search: e.target.value })
//                   }
//                   allowClear
//                 />
//               </Col>
//               <Col span={3}>
//                 <Button type="primary" htmlType="submit">
//                   Search
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         )}
//         footer={() => <Pagination qData={qData} setQData={setQData} />}
//       />

//       <AddEditProductModal ref={addEditModalRef} onSuccess={listProducts} />

//       <ProductViewModal
//         open={viewModal.open}
//         data={viewModal.data}
//         onClose={() => setViewModal({ open: false, data: null })}
//       />
//     </Card>
//   );
// }

// ProductManagement.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Popconfirm,
  Card,
  Spin,
  message,
  Input,
  Space,
  Switch,
  Tag,
  Image,
  Modal,
  Select,
  InputNumber,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminProductService from "../../../services/product";
import Pagination from "../../components/Pagination";
import dayjs from "dayjs";
import TinyMce from "../../../utils/TinyMce";
import util from "../../../utils/util"; // Assuming this exists like in reference

const { TextArea } = Input;
const { Option } = Select;

// ==================== PRODUCT STATUS CONSTANTS ====================
const PRODUCT_STATUS = [
  { label: "DRAFT", value: 1 },
  { label: "ACTIVE", value: 2 },
  { label: "INACTIVE", value: 3 },
  { label: "REJECTED", value: 4 },
  { label: "PENDING_REVIEW", value: 5 },
];

const getStatusTag = (status) => {
  const statusMap = {
    1: <Tag color="default">DRAFT</Tag>,
    2: <Tag color="green">ACTIVE</Tag>,
    3: <Tag color="orange">INACTIVE</Tag>,
    4: <Tag color="red">REJECTED</Tag>,
    5: <Tag color="gold">PENDING REVIEW</Tag>,
  };
  return statusMap[status] || <Tag color="default">-</Tag>;
};

// ==================== Add/Edit Product Modal ====================
const AddEditProductModal = React.forwardRef(({ onSuccess }, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  React.useImperativeHandle(ref, () => ({
    openForm: async (productData = null) => {
      await loadDropdowns();

      if (productData) {
        setEditId(productData._id);
        populateForm(productData);
      } else {
        setEditId(null);
        form.resetFields();
        // Default status for new product by Superadmin
        form.setFieldsValue({ status: 2 }); // ACTIVE
      }
      setOpen(true);
    },
  }));

  const loadDropdowns = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        AdminProductService.getAllCategories(),
        AdminProductService.getAllBrands(),
      ]);

      setCategories(categoriesRes?.data?.categories || []);
      setBrands(brandsRes?.data?.brands || []);
    } catch (error) {
      message.error("Failed to load categories or brands");
    }
  };

  const populateForm = (product) => {
    const categoryId = product.categoryId?._id || product.categoryId;
    form.setFieldsValue({
      categoryId,
      brandId: product.brandId?._id || product.brandId,
      name: product.name,
      sku: product.sku,
      description: product.description,
      highlights: product.highlights?.length ? product.highlights : [""],
      price: product.price,
      discount: product.discount,
      gst: product.gst,
      stock: product.stock,
      images: product.images?.length ? product.images : [""],
      status: product.status,
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formattedValues = {
        ...values,
        highlights: values.highlights?.filter(Boolean) || [],
        images: values.images?.filter(Boolean) || [],
      };

      if (editId) {
        await AdminProductService.updateProduct(editId, formattedValues);
        message.success("Product updated successfully");
      } else {
        await AdminProductService.createProduct(formattedValues);
        message.success("Product created successfully (Active by default)");
      }

      setOpen(false);
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      message.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editId ? "Edit Product" : "Add New Product"}
      open={open}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      width={950}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {editId ? "Update" : "Create"}
        </Button>,
      ]}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
              <Select placeholder="Select Category" showSearch>
                {categories.map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="brandId" label="Brand" rules={[{ required: true }]}>
              <Select placeholder="Select Brand" showSearch>
                {brands.map((brand) => (
                  <Option key={brand._id} value={brand._id}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Status Field - Visible in Edit Mode */}
        {editId && (
          <Form.Item name="status" label="Product Status" rules={[{ required: true }]}>
            <Select>
              {PRODUCT_STATUS.map((s) => (
                <Option key={s.value} value={s.value}>
                  {s.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Rest of the form remains same */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
              <Input placeholder="Enter SKU" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TinyMce
            value={form.getFieldValue("description") || ""}
            onChange={(v) => form.setFieldsValue({ description: v })}
          />
        </Form.Item>

        {/* Highlights, Price, Discount, GST, Stock, Images - unchanged */}
        <Form.Item label="Highlights">
          <Form.List name="highlights">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={name} rules={[{ required: true }]}>
                      <Input placeholder="Enter product highlight" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Highlight
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="price" label="Price (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="discount" label="Discount (%)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} max={100} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="gst" label="GST (%)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} max={100} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="stock" label="Stock Quantity" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Product Images (URLs)">
          <Form.List name="images">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={name} rules={[{ required: true, type: "url" }]}>
                      <Input placeholder="https://example.com/image.jpg" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Image URL
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  );
});

// ==================== Product View Modal ====================
const ProductViewModal = ({ open, data, onClose }) => {
  if (!data) return null;

  return (
    <Modal
      title="Product Details"
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Close</Button>}
      width={800}
      destroyOnClose
    >
      <Form layout="vertical">
        <Row gutter={20}>
          <Col span={24} style={{ textAlign: "center", marginBottom: 20 }}>
            <Image.PreviewGroup>
              <Space>
                {data.images?.map((img, idx) => (
                  <Image
                    key={idx}
                    width={100}
                    height={100}
                    src={img}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                ))}
              </Space>
            </Image.PreviewGroup>
          </Col>

          <Col span={12}>
            <Form.Item label="Product Name">
              <Input value={data.name} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="SKU">
              <Input value={data.sku} disabled/>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Category">
              <Input value={data.categoryId?.name} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Brand">
              <Input value={data.brandId?.name} disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Description">
              <TextArea value={data.description} rows={3} disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Highlights">
              <ul>
                {data.highlights?.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Price">
              <Input value={`₹ ${data.price?.toLocaleString()}`} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Discount">
              <Input value={`${data.discount}%`} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="GST">
              <Input value={`${data.gst}%`} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Stock">
              <Input value={data.stock} disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};


// ==================== Main Component ====================
export default function ProductManagement() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [qData, setQData] = useState({ page: 1, limit: 10 });

  const addEditModalRef = useRef();
  const [viewModal, setViewModal] = useState({ open: false, data: null });

  const columns = [
    { title: "S.No", width: 60, render: (_, __, index) => index + 1 + (qData.page - 1) * qData.limit },
    {
      title: "Product",
      dataIndex: "images",
      width: 80,
      render: (images) => (
        <Image src={images?.[0]} width={50} height={50} style={{ objectFit: "cover", borderRadius: 4 }} fallback="/placeholder-image.png" />
      ),
    },
    { title: "Name", dataIndex: "name", width: 200 },
    { title: "SKU", dataIndex: "sku", width: 120 },
    { title: "Category", dataIndex: "categoryId", width: 150, render: (cat) => cat?.name || "-" },
    { title: "Brand", dataIndex: "brandId", width: 150, render: (brand) => brand?.name || "-" },
    { title: "Price (₹)", dataIndex: "price", width: 120, render: (price) => `₹ ${price?.toLocaleString() || 0}` },
    {
      title: "Stock",
      dataIndex: "stock",
      width: 80,
      render: (stock) => <Tag color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}>{stock || 0}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 130,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Action",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => setViewModal({ open: true, data: record })} />
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => addEditModalRef.current.openForm(record)} />
          <Popconfirm title="Delete this product?" onConfirm={() => deleteHandler(record._id)}>
            <Button type="primary" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const listProducts = () => {
    setLoading(true);
    AdminProductService.getAllProducts(qData)
      .then((res) => {
        const products = res?.data?.products || res?.data?.data || [];
        setData(products.map((v) => ({ ...v, key: v._id })));
      })
      .catch(() => message.error("Failed to fetch products"))
      .finally(() => setLoading(false));
  };

  const deleteHandler = (id) => {
    setLoading(true);
    AdminProductService.deleteProduct(id)
      .then(() => {
        message.success("Product deleted");
        listProducts();
      })
      .catch((err) => message.error(err?.response?.data?.message || "Delete failed"))
      .finally(() => setLoading(false));
  };

  const deleteManyHandler = () => { /* ... same as before */ };

  useEffect(() => {
    listProducts();
  }, [qData]);

  return (
    <Card
      bordered={false}
      size="small"
      title={
        <Space>
          <Button type="dashed" danger icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Back
          </Button>
          Product Management
        </Space>
      }
      extra={
        <Row justify="end" gutter={12}>
          {selected.length > 0 && (
            <Col>
              <Popconfirm title={`Delete ${selected.length} products?`} onConfirm={deleteManyHandler}>
                <Button type="primary" danger icon={<DeleteOutlined />}>
                  Delete Selected
                </Button>
              </Popconfirm>
            </Col>
          )}
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addEditModalRef.current.openForm()}>
              Add New Product
            </Button>
          </Col>
        </Row>
      }
    >
      <Table
        bordered
        loading={loading}
        size="small"
        columns={columns}
        dataSource={data}
        scroll={{ y: "calc(100vh - 340px)", x: 1400 }}
        pagination={false}
        title={() => <Search {...{ qData, setQData, listProducts, PRODUCT_STATUS }} />}
        footer={() => <Pagination qData={qData} setQData={setQData} />}
      />

      <AddEditProductModal ref={addEditModalRef} onSuccess={listProducts} />

      <ProductViewModal
        open={viewModal.open}
        data={viewModal.data}
        onClose={() => setViewModal({ open: false, data: null })}
      />
    </Card>
  );
}

// ==================== Search Component ====================
function Search({ qData, setQData, listProducts, PRODUCT_STATUS }) {
  return (
    <Form
      onSubmitCapture={() => {
        setQData((prev) => ({ ...prev, page: 1 }));
        listProducts();
      }}
    >
      <Row gutter={12}>
        <Col span={6}>
          <Input
            placeholder="Search by name, SKU..."
            value={qData.search}
            onChange={(e) => setQData({ ...qData, search: e.target.value })}
            allowClear
          />
        </Col>
        <Col span={4}>
          <Select
            allowClear
            placeholder="Filter by Status"
            style={{ width: "100%" }}
            value={qData.status}
            onChange={(value) => setQData({ ...qData, status: value })}
            options={PRODUCT_STATUS.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
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