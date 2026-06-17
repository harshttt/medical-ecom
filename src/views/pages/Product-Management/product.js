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

// // ==================== Dynamic Specifications Component ====================
// const DynamicSpecifications = ({ specifications, form }) => {
//   if (!specifications || specifications.length === 0) {
//     return (
//       <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
//         Please select a category to load specifications
//       </div>
//     );
//   }

//   const renderField = (spec) => {
//     const { key, label, type, options = [], required = false } = spec;

//     const rules = required
//       ? [{ required: true, message: `Please specify ${label}` }]
//       : [];

//     switch (type?.toUpperCase()) {
//       case "BOOLEAN":
//         return (
//           <Form.Item
//             name={["specifications", key]}
//             label={label}
//             valuePropName="checked"
//             rules={rules}
//           >
//             <Switch checkedChildren="Yes" unCheckedChildren="No" />
//           </Form.Item>
//         );

//       case "SELECT":
//         return (
//           <Form.Item name={["specifications", key]} label={label} rules={rules}>
//             <Select
//               placeholder={`Select ${label}`}
//               allowClear
//               showSearch
//               mode={null}
//               options={options.map((opt) => ({ label: opt, value: opt }))}
//             />
//           </Form.Item>
//         );

//       case "MULTISELECT":
//         return (
//           <Form.Item name={["specifications", key]} label={label} rules={rules}>
//             <Select
//               mode="multiple"
//               placeholder={`Select ${label}`}
//               allowClear
//               showSearch
//               options={options.map((opt) => ({ label: opt, value: opt }))}
//             />
//           </Form.Item>
//         );

//       case "NUMBER":
//         return (
//           <Form.Item name={["specifications", key]} label={label} rules={rules}>
//             <InputNumber
//               style={{ width: "100%" }}
//               placeholder={`Enter ${label}`}
//               min={0}
//             />
//           </Form.Item>
//         );

//       case "TEXT":
//       default:
//         return (
//           <Form.Item name={["specifications", key]} label={label} rules={rules}>
//             <TextArea placeholder={`Enter ${label}`} rows={3} />
//           </Form.Item>
//         );
//     }
//   };

//   return (
//     <div style={{ marginTop: 16 }}>
//       <h4 style={{ marginBottom: 16 }}>Product Specifications</h4>
//       <Row gutter={[16, 24]}>
//         {specifications.map((spec) => (
//           <Col span={12} key={spec.key}>
//             {renderField(spec)}
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// };

// // ==================== Add/Edit Product Modal ====================
// // ==================== Add/Edit Product Modal ====================
// const AddEditProductModal = React.forwardRef(({ onSuccess }, ref) => {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [form] = Form.useForm();
//   const [editId, setEditId] = useState(null);

//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [categorySpecs, setCategorySpecs] = useState([]);
//   const [loadingSpecs, setLoadingSpecs] = useState(false);

//   React.useImperativeHandle(ref, () => ({
//     openForm: async (productData = null) => {
//       console.log("🔄 openForm called", productData ? "Edit Mode" : "Add Mode");

//       setCategorySpecs([]);
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
//       specifications: product.specifications || {},
//     });

//     if (categoryId) {
//       console.log("🔄 Loading specifications for edit mode...");
//       loadCategorySpecifications(categoryId, product.specifications);
//     }
//   };

//   const loadCategorySpecifications = async (categoryId, existingSpecs = {}) => {
//     if (!categoryId) {
//       console.warn("⚠️ No categoryId provided");
//       return;
//     }

//     console.log(`📡 Fetching specifications for category: ${categoryId}`);
//     setLoadingSpecs(true);

//     try {
//       const response =
//         await AdminProductService.getCategorySpecifications(categoryId);

//       console.log("📦 Full API Response:", response);
//       console.log("📦 Response.data:", response?.data);
//       console.log("📦 Response.data.data:", response?.data?.data);

//       const specs =
//         response?.data?.data?.specifications ||
//         response?.data?.specifications ||
//         [];

//       console.log(
//         `✅ Successfully loaded ${specs.length} specifications:`,
//         specs,
//       );

//       setCategorySpecs(specs);

//       // Set existing values in edit mode
//       if (existingSpecs && Object.keys(existingSpecs).length > 0) {
//         console.log("🔄 Setting existing specifications:", existingSpecs);
//         form.setFieldsValue({ specifications: existingSpecs });
//       }
//     } catch (error) {
//       console.error("❌ Failed to load category specifications:", error);
//       message.error("Failed to load category specifications");
//       setCategorySpecs([]);
//     } finally {
//       setLoadingSpecs(false);
//     }
//   };

//   const handleCategoryChange = (categoryId) => {
//     console.log("🔄 Category changed to:", categoryId);

//     form.setFieldsValue({ specifications: {} });
//     setCategorySpecs([]); // Force UI refresh

//     if (categoryId) {
//       loadCategorySpecifications(categoryId);
//     }
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
//       setCategorySpecs([]);
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
//         setCategorySpecs([]);
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
//       <Spin spinning={loadingSpecs}>
//         <Form form={form} layout="vertical">
//           {/* Category Select */}
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="categoryId"
//                 label="Category"
//                 rules={[{ required: true }]}
//               >
//                 <Select
//                   placeholder="Select Category"
//                   onChange={handleCategoryChange}
//                   showSearch
//                   optionFilterProp="children"
//                 >
//                   {categories.map((cat) => (
//                     <Option key={cat._id} value={cat._id}>
//                       {cat.name}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item
//                 name="brandId"
//                 label="Brand"
//                 rules={[{ required: true, message: "Please select brand" }]}
//               >
//                 <Select
//                   placeholder="Select Brand"
//                   showSearch
//                   optionFilterProp="children"
//                 >
//                   {brands.map((brand) => (
//                     <Option key={brand._id} value={brand._id}>
//                       {brand.name}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="name"
//                 label="Product Name"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Enter product name" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
//                 <Input placeholder="Enter SKU" />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true , message: "Please enter product description" }]}
//           >
//             <TinyMce
//               value={form.getFieldValue("description") || ""}
//               onChange={(v) => form.setFieldsValue({ description: v })}
//             />
//           </Form.Item>

//           <Form.Item label="Highlights">
//             <Form.List name="highlights">
//               {(fields, { add, remove }) => (
//                 <>
//                   {fields.map(({ key, name, ...restField }) => (
//                     <Space
//                       key={key}
//                       style={{ display: "flex", marginBottom: 8 }}
//                       align="baseline"
//                     >
//                       <Form.Item
//                         {...restField}
//                         name={name}
//                         rules={[
//                           { required: true, message: "Please enter highlight" },
//                         ]}
//                         style={{ flex: 1, marginBottom: 0 }}
//                       >
//                         <Input placeholder="Enter product highlight" />
//                       </Form.Item>
//                       <MinusCircleOutlined onClick={() => remove(name)} />
//                     </Space>
//                   ))}
//                   <Form.Item>
//                     <Button
//                       type="dashed"
//                       onClick={() => add()}
//                       block
//                       icon={<PlusOutlined />}
//                     >
//                       Add Highlight
//                     </Button>
//                   </Form.Item>
//                 </>
//               )}
//             </Form.List>
//           </Form.Item>

//           <Row gutter={16}>
//             <Col span={6}>
//               <Form.Item
//                 name="price"
//                 label="Price (₹)"
//                 rules={[{ required: true }]}
//               >
//                 <InputNumber
//                   style={{ width: "100%" }}
//                   min={0}
//                   formatter={(value) =>
//                     `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item
//                 name="discount"
//                 label="Discount (%)"
//                 rules={[{ required: true }]}
//               >
//                 <InputNumber
//                   style={{ width: "100%" }}
//                   min={0}
//                   max={100}
//                   formatter={(v) => `${v}%`}
//                   parser={(v) => v.replace("%", "")}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item
//                 name="gst"
//                 label="GST (%)"
//                 rules={[{ required: true }]}
//               >
//                 <InputNumber
//                   style={{ width: "100%" }}
//                   min={0}
//                   max={100}
//                   formatter={(v) => `${v}%`}
//                   parser={(v) => v.replace("%", "")}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item
//                 name="stock"
//                 label="Stock Quantity"
//                 rules={[{ required: true }]}
//               >
//                 <InputNumber style={{ width: "100%" }} min={0} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item label="Product Images (URLs)">
//             <Form.List name="images">
//               {(fields, { add, remove }) => (
//                 <>
//                   {fields.map(({ key, name, ...restField }) => (
//                     <Space
//                       key={key}
//                       style={{ display: "flex", marginBottom: 8 }}
//                       align="baseline"
//                     >
//                       <Form.Item
//                         {...restField}
//                         name={name}
//                         rules={[
//                           { required: true, message: "Please enter image URL" },
//                           { type: "url", message: "Please enter valid URL" },
//                         ]}
//                         style={{ flex: 1 }}
//                       >
//                         <Input placeholder="https://example.com/image.jpg" />
//                       </Form.Item>
//                       <MinusCircleOutlined onClick={() => remove(name)} />
//                     </Space>
//                   ))}
//                   <Form.Item>
//                     <Button
//                       type="dashed"
//                       onClick={() => add()}
//                       block
//                       icon={<PlusOutlined />}
//                     >
//                       Add Image URL
//                     </Button>
//                   </Form.Item>
//                 </>
//               )}
//             </Form.List>
//           </Form.Item>

//           <Divider />
//           <DynamicSpecifications specifications={categorySpecs} form={form} />
//         </Form>
//       </Spin>
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
//               <Input value={data.sku} disabled />
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

//           <Col span={24}>
//             <Form.Item label="Specifications">
//               <pre
//                 style={{
//                   background: "#f5f5f5",
//                   padding: 12,
//                   borderRadius: 4,
//                   whiteSpace: "pre-wrap",
//                 }}
//               >
//                 {JSON.stringify(data.specifications, null, 2)}
//               </pre>
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
//               <Col span={6}>
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

const { TextArea } = Input;
const { Option } = Select;

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
      console.log("🔄 openForm called", productData ? "Edit Mode" : "Add Mode");

      await loadDropdowns();

      if (productData) {
        setEditId(productData._id);
        populateForm(productData);
      } else {
        setEditId(null);
        form.resetFields();
      }
      setOpen(true);
    },
  }));

  const loadDropdowns = async () => {
    try {
      console.log("📥 Loading categories and brands...");
      const [categoriesRes, brandsRes] = await Promise.all([
        AdminProductService.getAllCategories(),
        AdminProductService.getAllBrands(),
      ]);

      setCategories(categoriesRes?.data?.categories || []);
      setBrands(brandsRes?.data?.brands || []);
      console.log(
        "✅ Categories loaded:",
        categoriesRes?.data?.categories?.length || 0,
      );
      console.log("✅ Brands loaded:", brandsRes?.data?.brands?.length || 0);
    } catch (error) {
      console.error("❌ Dropdown load error:", error);
      message.error("Failed to load categories or brands");
    }
  };

  const populateForm = (product) => {
    const categoryId = product.categoryId?._id || product.categoryId;
    console.log("📝 Populating form for edit. Category ID:", categoryId);

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
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("📤 Submitting form values:", values);

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
        message.success("Product created successfully");
      }

      setOpen(false);
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      console.error("❌ Submit error:", error);
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
        console.log("❌ Modal closed");
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
        {/* Category Select */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Category"
                showSearch
                optionFilterProp="children"
              >
                {categories.map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="brandId"
              label="Brand"
              rules={[{ required: true, message: "Please select brand" }]}
            >
              <Select
                placeholder="Select Brand"
                showSearch
                optionFilterProp="children"
              >
                {brands.map((brand) => (
                  <Option key={brand._id} value={brand._id}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
              <Input placeholder="Enter SKU" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter product description" }]}
        >
          <TinyMce
            value={form.getFieldValue("description") || ""}
            onChange={(v) => form.setFieldsValue({ description: v })}
          />
        </Form.Item>

        <Form.Item label="Highlights">
          <Form.List name="highlights">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[
                        { required: true, message: "Please enter highlight" },
                      ]}
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <Input placeholder="Enter product highlight" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Highlight
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="price"
              label="Price (₹)"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="discount"
              label="Discount (%)"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                max={100}
                formatter={(v) => `${v}%`}
                parser={(v) => v.replace("%", "")}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="gst"
              label="GST (%)"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                max={100}
                formatter={(v) => `${v}%`}
                parser={(v) => v.replace("%", "")}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="stock"
              label="Stock Quantity"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Product Images (URLs)">
          <Form.List name="images">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[
                        { required: true, message: "Please enter image URL" },
                        { type: "url", message: "Please enter valid URL" },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <Input placeholder="https://example.com/image.jpg" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Image URL
                  </Button>
                </Form.Item>
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

// ==================== Main Product Management Component ====================
export default function ProductManagement() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [qData, setQData] = useState({ page: 1, limit: 10 });

  const addEditModalRef = useRef();
  const [viewModal, setViewModal] = useState({ open: false, data: null });

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      width: 60,
      render: (_, __, index) => index + 1 + (qData.page - 1) * qData.limit,
    },
    {
      title: "Product",
      dataIndex: "images",
      width: 80,
      render: (images) => (
        <Image
          src={images?.[0] || "/placeholder-image.png"}
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: 4 }}
          fallback="/placeholder-image.png"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
      render: (name) => name || "-",
    },
    { title: "SKU", dataIndex: "sku", width: 120, render: (sku) => sku || "-" },
    {
      title: "Category",
      dataIndex: "categoryId",
      width: 150,
      render: (cat) => cat?.name || "-",
    },
    {
      title: "Brand",
      dataIndex: "brandId",
      width: 150,
      render: (brand) => brand?.name || "-",
    },
    {
      title: "Price (₹)",
      dataIndex: "price",
      width: 120,
      render: (price) => `₹ ${price?.toLocaleString() || 0}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      width: 80,
      render: (stock) => (
        <Tag color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}>
          {stock || 0}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 100,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => toggleStatusHandler(record._id)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 120,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "-"),
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: 120,
      fixed: "right",
      render: (id, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setViewModal({ open: true, data: record })}
          />
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => addEditModalRef.current.openForm(record)}
          />
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => deleteHandler(id)}
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
        message.success("Product deleted successfully");
        listProducts();
        setSelected([]);
      })
      .catch((err) =>
        message.error(err?.response?.data?.message || "Failed to delete"),
      )
      .finally(() => setLoading(false));
  };

  const deleteManyHandler = () => {
    setLoading(true);
    AdminProductService.deleteManyProducts(selected)
      .then(() => {
        message.success(`${selected.length} products deleted`);
        listProducts();
        setSelected([]);
      })
      .catch((err) =>
        message.error(err?.response?.data?.message || "Failed to delete"),
      )
      .finally(() => setLoading(false));
  };

  const toggleStatusHandler = (id) => {
    setLoading(true);
    AdminProductService.toggleProductStatus(id)
      .then(() => {
        message.success("Status updated");
        listProducts();
      })
      .catch((err) =>
        message.error(
          err?.response?.data?.message || "Failed to update status",
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    listProducts();
  }, [qData.page, qData.limit]);

  const rowSelection = {
    selectedRowKeys: selected,
    onChange: setSelected,
  };

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
          Product Management
        </Space>
      }
      extra={
        <Row justify="end" gutter={12}>
          {selected.length > 0 && (
            <Col>
              <Popconfirm
                title={`Delete ${selected.length} selected products?`}
                onConfirm={deleteManyHandler}
              >
                <Button type="primary" danger icon={<DeleteOutlined />}>
                  Delete Selected ({selected.length})
                </Button>
              </Popconfirm>
            </Col>
          )}
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => addEditModalRef.current.openForm()}
            >
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
        rowSelection={rowSelection}
        columns={columns.map((col) => ({ ...col, ellipsis: false }))}
        dataSource={data}
        scroll={{ y: "calc(100vh - 340px)", x: 1200 }}
        pagination={false}
        title={() => (
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
                  onChange={(e) =>
                    setQData({ ...qData, search: e.target.value })
                  }
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
        )}
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