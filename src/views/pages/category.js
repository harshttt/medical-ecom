// import React, {
//   useEffect,
//   useState,
//   forwardRef,
//   useImperativeHandle,
//   useRef,
// } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Row,
//   Col,
//   Popconfirm,
//   Spin,
//   Card,
//   message,
//   Input,
//   Image,
//   Space,
//   Switch,
//   Tag,
//   Modal,
//   Select,
// } from "antd";
// import {
//   DeleteOutlined,
//   EditOutlined,
//   PlusOutlined,
//   ArrowLeftOutlined,
//   SearchOutlined,
//   UnorderedListOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// import AdminCategoryService from "../../services/category";
// import Pagination from "../components/Pagination";
// import TinyMce from "../../utils/TinyMce";
// import UploadImage from "../../utils/UploadImage";

// export default function CategoryList() {
//   const navigate = useNavigate();

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selected, setSelected] = useState([]);
//   const [qData, setQData] = useState({ page: 1, limit: 10, search: "" });
//   const [allCategories, setAllCategories] = useState([]);

//   const addNewModalRef = useRef();
//   const subCategoryModalRef = useRef();

//   // Fetch all root-level categories (for parent select dropdown)
//   const fetchAllCategories = () => {
//     AdminCategoryService.listCategory({ page: 1, limit: 1000, search: "" })
//       .then((res) => {
//         const categories = res.data?.categories || [];
//         setAllCategories(categories);
//       })
//       .catch((err) => console.error("Failed to fetch categories", err));
//   };

//   const columns = [
//     // {
//     //   title: "Icon",
//     //   dataIndex: "image",
//     //   width: 80,
//     //   render: (v) => (
//     //     <Image
//     //       width={45}
//     //       height={45}
//     //       src={v}
//     //       style={{ objectFit: "cover", borderRadius: 6 }}
//     //       fallback="https://via.placeholder.com/50?text=No+Img"
//     //     />
//     //   ),
//     // },
//     {
//       title: "Category Name",
//       dataIndex: "name",
//       sorter: true,
//     },
//     {
//       title: "Type",
//       dataIndex: "parentCategory",
//       render: (parent) =>
//         parent ? (
//           <Tag color="purple">Subcategory</Tag>
//         ) : (
//           <Tag color="blue">Category</Tag>
//         ),
//     },
//     {
//       title: "Subcategories",
//       dataIndex: "subcategories",
//       width: 120,
//       render: (subcategories, row) => {
//         const count = subcategories?.length ?? 0;
//         return (
//           <Button
//             size="small"
//             icon={<UnorderedListOutlined />}
//             onClick={() => subCategoryModalRef.current.openModal(row)}
//           >
//             {count > 0 ? `${count} subs` : "Manage"}
//           </Button>
//         );
//       },
//     },
//     {
//       title: "Sort Order",
//       dataIndex: "sortOrder",
//       width: 90,
//       render: (v) => v ?? "—",
//     },
//     {
//       title: "Status",
//       dataIndex: "isActive",
//       width: 90,
//       render: (isActive, row) => (
//         <Switch
//           checked={isActive}
//           loading={loading}
//           onChange={() => handleToggle(row._id)}
//         />
//       ),
//     },
//     {
//       title: "Action",
//       dataIndex: "_id",
//       width: 100,
//       render: (v, row) => (
//         <Space>
//           <Button
//             type="primary"
//             size="small"
//             icon={<EditOutlined />}
//             onClick={() => addNewModalRef.current.openForm(row)}
//           />
//           <Popconfirm
//             title="Delete this category?"
//             onConfirm={() => deleteData(row._id)}
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

//   const fetchList = () => {
//     setLoading(true);
//     AdminCategoryService.listCategory(qData)
//       .then((res) => {
//         // New response format: res.data.categories
//         const categories = res.data?.categories || [];
//         setData(categories.map((v) => ({ ...v, key: v._id })));
//         setQData((prev) => ({
//           ...prev,
//           total: res.data?.pagination?.total || 0,
//         }));
//       })
//       .catch((err) => message.error(err.message || "Failed to fetch"))
//       .finally(() => setLoading(false));
//   };

//   const deleteData = (ids) => {
//     const isArray = Array.isArray(ids);
//     const request = isArray
//       ? AdminCategoryService.deleteManyCategories(ids)
//       : AdminCategoryService.deleteCategory(ids);

//     request
//       .then(() => {
//         message.success("Deleted successfully");
//         fetchList();
//         fetchAllCategories();
//         setSelected([]);
//       })
//       .catch((err) => message.error(err.message));
//   };

//   const handleToggle = (id) => {
//     AdminCategoryService.toggleCategory(id)
//       .then(() => {
//         message.success("Status updated");
//         fetchList();
//       })
//       .catch((err) => message.error(err.message));
//   };

//   useEffect(() => {
//     fetchAllCategories();
//   }, []);

//   useEffect(() => {
//     fetchList();
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
//           List of Categories
//         </Space>
//       }
//       extra={
//         <Space>
//           {selected.length > 0 && (
//             <Popconfirm
//               title={`Delete ${selected.length} items?`}
//               onConfirm={() => deleteData(selected)}
//             >
//               <Button type="primary" danger icon={<DeleteOutlined />}>
//                 Bulk Delete
//               </Button>
//             </Popconfirm>
//           )}
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => addNewModalRef.current.openForm()}
//           >
//             Add Category
//           </Button>
//         </Space>
//       }
//     >
//       <div style={{ marginBottom: 16 }}>
//         <Form layout="inline" onFinish={fetchList}>
//           <Form.Item style={{ width: 250 }}>
//             <Input
//               placeholder="Search categories..."
//               prefix={<SearchOutlined />}
//               allowClear
//               value={qData.search}
//               onChange={(e) =>
//                 setQData((prev) => ({ ...prev, search: e.target.value }))
//               }
//             />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Search
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>

//       <Table
//         bordered
//         loading={loading}
//         size="small"
//         columns={columns}
//         dataSource={data}
//         pagination={false}
//         rowSelection={{
//           onChange: (keys) => setSelected(keys),
//         }}
//         footer={() => <Pagination {...{ qData, setQData }} />}
//         scroll={{ y: "calc(100vh - 350px)" }}
//       />

//       {/* Main add/edit modal for root-level categories */}
//       <AddForm
//         ref={addNewModalRef}
//         list={fetchList}
//         categories={allCategories}
//         refreshCategories={fetchAllCategories}
//       />

//       {/* Subcategory management modal */}
//       <SubCategoryModal
//         ref={subCategoryModalRef}
//         refreshParentList={fetchList}
//         refreshCategories={fetchAllCategories}
//         allCategories={allCategories}
//       />
//     </Card>
//   );
// }

// // ─────────────────────────────────────────────
// // SubCategoryModal — lists & manages subcategories of a parent
// // ─────────────────────────────────────────────

// const SubCategoryModal = forwardRef(
//   ({ refreshParentList, refreshCategories, allCategories }, ref) => {
//     const [open, setOpen] = useState(false);
//     const [parent, setParent] = useState(null);
//     const [subcategories, setSubcategories] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const subAddFormRef = useRef();

//     useImperativeHandle(ref, () => ({
//       openModal(parentRow) {
//         setParent(parentRow);
//         // Subcategories come embedded in the list response
//         const subs = (parentRow.subcategories || []).map((s) => ({
//           ...s,
//           key: s._id,
//         }));
//         setSubcategories(subs);
//         setOpen(true);
//       },
//     }));

//     // Re-fetch subcategories for this parent from the full list
//     const refreshSubs = () => {
//       if (!parent) return;
//       setLoading(true);
//       AdminCategoryService.listCategory({ page: 1, limit: 1000, search: "" })
//         .then((res) => {
//           const all = res.data?.categories || [];
//           const found = all.find((c) => c._id === parent._id);
//           const subs = (found?.subcategories || []).map((s) => ({
//             ...s,
//             key: s._id,
//           }));
//           setSubcategories(subs);
//           // Keep parent reference fresh
//           if (found) setParent(found);
//         })
//         .catch((err) => message.error(err.message || "Failed to refresh"))
//         .finally(() => setLoading(false));
//     };

//     const handleToggle = (id) => {
//       AdminCategoryService.toggleCategory(id)
//         .then(() => {
//           message.success("Status updated");
//           refreshSubs();
//           refreshParentList();
//         })
//         .catch((err) => message.error(err.message));
//     };

//     const handleDelete = (id) => {
//       AdminCategoryService.deleteCategory(id)
//         .then(() => {
//           message.success("Deleted successfully");
//           refreshSubs();
//           refreshParentList();
//           refreshCategories?.();
//         })
//         .catch((err) => message.error(err.message));
//     };

//     const subColumns = [
//       // {
//       //   title: "Icon",
//       //   dataIndex: "image",
//       //   width: 70,
//       //   render: (v) => (
//       //     <Image
//       //       width={40}
//       //       height={40}
//       //       src={v}
//       //       style={{ objectFit: "cover", borderRadius: 6 }}
//       //       fallback="https://via.placeholder.com/50?text=No+Img"
//       //     />
//       //   ),
//       // },
//       {
//         title: "Subcategory Name",
//         dataIndex: "name",
//       },
//       {
//         title: "Sort Order",
//         dataIndex: "sortOrder",
//         width: 90,
//         render: (v) => v ?? "—",
//       },
//       {
//         title: "Status",
//         dataIndex: "isActive",
//         width: 90,
//         render: (isActive, row) => (
//           <Switch checked={isActive} onChange={() => handleToggle(row._id)} />
//         ),
//       },
//       {
//         title: "Action",
//         width: 100,
//         render: (_, row) => (
//           <Space>
//             <Button
//               type="primary"
//               size="small"
//               icon={<EditOutlined />}
//               onClick={() => subAddFormRef.current.openForm(row)}
//             />
//             <Popconfirm
//               title="Delete this subcategory?"
//               onConfirm={() => handleDelete(row._id)}
//               okText="Yes"
//               cancelText="No"
//             >
//               <Button
//                 type="primary"
//                 size="small"
//                 danger
//                 icon={<DeleteOutlined />}
//               />
//             </Popconfirm>
//           </Space>
//         ),
//       },
//     ];

//     return (
//       <Modal
//         title={
//           <Space>
//             <UnorderedListOutlined />
//             Subcategories of{" "}
//             <span style={{ color: "#6b21a8", fontWeight: 600 }}>
//               {parent?.name}
//             </span>
//           </Space>
//         }
//         open={open}
//         onCancel={() => setOpen(false)}
//         footer={null}
//         width={900}
//         destroyOnClose
//         maskClosable={false}
//       >
//         <div
//           style={{
//             marginBottom: 12,
//             display: "flex",
//             justifyContent: "flex-end",
//           }}
//         >
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => subAddFormRef.current.openForm(null, parent)}
//           >
//             Add Subcategory
//           </Button>
//         </div>

//         <Table
//           bordered
//           loading={loading}
//           size="small"
//           columns={subColumns}
//           dataSource={subcategories}
//           pagination={false}
//           scroll={{ y: 400 }}
//           locale={{ emptyText: "No subcategories yet" }}
//         />

//         {/* Reuse AddForm for subcategories, passing forcedParent */}
//         <AddForm
//           ref={subAddFormRef}
//           list={() => {
//             refreshSubs();
//             refreshParentList();
//             refreshCategories?.();
//           }}
//           categories={allCategories}
//           refreshCategories={refreshCategories}
//           forcedParent={parent} // when set, parent is locked
//         />
//       </Modal>
//     );
//   },
// );

// // ─────────────────────────────────────────────
// // AddForm Modal — handles both Category & Subcategory
// // ─────────────────────────────────────────────

// const AddForm = forwardRef(
//   ({ list, categories = [], refreshCategories, forcedParent }, ref) => {
//     const [open, setOpen] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [isSubcategory, setIsSubcategory] = useState(false);
//     const [form] = Form.useForm();
//     const [id, setId] = useState(null);

//     useImperativeHandle(ref, () => ({
//       openForm(dt, parentOverride) {
//         setOpen(true);

//         if (dt) {
//           console.log("Original image from API:", dt.image);
//           // ── Edit mode ──
//           setId(dt._id);
//           const hasParent = !!dt.parentCategory;
//           setIsSubcategory(hasParent || !!forcedParent || !!parentOverride);

//           // ✅ Convert image URL to the format UploadImage expects
//           let imageValue = [];
//           if (
//             dt.image &&
//             typeof dt.image === "string" &&
//             dt.image.trim() !== ""
//           ) {
//             imageValue = [
//               {
//                 url: dt.image,
//                 uid: "-1",
//                 name: "category-image",
//               },
//             ];
//           }

//           form.setFieldsValue({
//             name: dt.name,
//             description: dt.description, // ✅ ADD THIS LINE
//             sortOrder: dt.sortOrder ?? 0,
//             parentCategory:
//               dt.parentCategory?._id ||
//               forcedParent?._id ||
//               parentOverride?._id ||
//               null,
//             image: imageValue,
//           });
//           console.log(
//             "Form image value after set:",
//             form.getFieldValue("image"),
//           );
//           console.log(
//             "Form description value after set:",
//             form.getFieldValue("description"), // ✅ Add this for debugging
//           );
//         } else {
//           // ── Add mode ──
//           setId(null);
//           const parentId = forcedParent?._id || parentOverride?._id || null;
//           setIsSubcategory(!!parentId);
//           form.resetFields();
//           form.setFieldsValue({
//             sortOrder: 0,
//             parentCategory: parentId || null,
//             image: [],
//             description: "", 
//           });
//         }
//       },
//     }));

//     const onFinish = (values) => {
//       setLoading(true);

//       console.log("Form values on finish:", values);

//       // Build image value — support both array-of-objects (UploadImage) or plain string
//       let imageValue = null;

//       if (Array.isArray(values.image) && values.image.length > 0) {
//         // Get the URL from the first image object
//         imageValue = values.image[0]?.url || null;
//         console.log("Image from array:", values.image, "=>", imageValue);
//       } else if (typeof values.image === "string") {
//         imageValue = values.image;
//       } else if (
//         values.image &&
//         typeof values.image === "object" &&
//         values.image.url
//       ) {
//         // Handle case where image is an object directly
//         imageValue = values.image.url;
//       }

//       console.log("Final image URL to save:", imageValue);

//       const effectiveParentId =
//         forcedParent?._id || (isSubcategory ? values.parentCategory : null);

//       const payload = {
//         name: values.name?.trim(),
//         description: values.description || "",
//         sortOrder: values.sortOrder ?? 0,
//         image: imageValue, // Now this will be a string URL or null
//         ...(effectiveParentId ? { parentCategory: effectiveParentId } : {}),
//       };

//       console.log("Final payload:", payload);

//       const request = id
//         ? AdminCategoryService.updateCategory(id, payload)
//         : AdminCategoryService.addCategory(payload);

//       request
//         .then((res) => {
//           message.success(res.message || "Saved successfully");
//           setOpen(false);
//           list();
//           refreshCategories?.();
//         })
//         .catch((err) => {
//           console.error("Save error:", err);
//           message.error(err.message || "Something went wrong");
//         })
//         .finally(() => setLoading(false));
//     };

//     // Only show root-level categories as parent options
//     const parentOptions = categories
//       .filter((cat) => !cat.parentCategory)
//       .map((cat) => ({ label: cat.name, value: cat._id }));

//     const isForcedSub = !!forcedParent;

//     return (
//       <Modal
//         title={`${id ? "Edit" : "Add"} ${isSubcategory ? "Subcategory" : "Category"}`}
//         open={open}
//         onCancel={() => {
//           setOpen(false);
//           setIsSubcategory(!!isForcedSub);
//           form.resetFields();
//         }}
//         onOk={() => form.submit()}
//         confirmLoading={loading}
//         width={800}
//         destroyOnClose
//         okText="Save"
//       >
//         <Spin spinning={loading}>
//           <Form
//             form={form}
//             layout="vertical"
//             onFinish={onFinish}
//             initialValues={{ sortOrder: 0 }}
//           >
//             <Row gutter={16}>
//               {/* Icon Upload */}
//               {/* <Col span={24}>
//                 <Form.Item label="Category Icon" name="image">
//                   <UploadImage
//                     key={id || "new"} // Add this to force re-render when editing different items
//                     count={1}
//                     onChange={(v) => {
//                       console.log("UploadImage onChange called with:", v);
//                       form.setFieldsValue({ image: v || [] });
//                     }}
//                     value={form.getFieldValue("image") || []}
//                   />
//                 </Form.Item>
//               </Col> */}

//               {/* Category Name */}
//               <Col span={16}>
//                 <Form.Item
//                   label="Category Name"
//                   name="name"
//                   rules={[
//                     { required: true, message: "Category name is required" },
//                   ]}
//                 >
//                   <Input placeholder="e.g. Electronics, Gaming..." />
//                 </Form.Item>
//               </Col>

//               {/* Sort Order */}
//               <Col span={8}>
//                 <Form.Item label="Sort Order" name="sortOrder">
//                   <Input
//                     type="number"
//                     min={0}
//                     placeholder="0"
//                     style={{ width: "100%" }}
//                   />
//                 </Form.Item>
//               </Col>

//               {/* Category Type toggle — hidden when forcedParent is set */}
//               {!isForcedSub && (
//                 <Col span={24}>
//                   <Form.Item label="Category Type">
//                     <Space>
//                       <Switch
//                         checked={isSubcategory}
//                         onChange={(checked) => {
//                           setIsSubcategory(checked);
//                           if (!checked) {
//                             form.setFieldsValue({ parentCategory: null });
//                           }
//                         }}
//                       />
//                       <span>
//                         {isSubcategory ? (
//                           <Tag color="purple">Subcategory (has parent)</Tag>
//                         ) : (
//                           <Tag color="blue">Top-level Category</Tag>
//                         )}
//                       </span>
//                     </Space>
//                   </Form.Item>
//                 </Col>
//               )}

//               {/* Parent Category select */}
//               {(isSubcategory || isForcedSub) && (
//                 <Col span={24}>
//                   <Form.Item
//                     label="Parent Category"
//                     name="parentCategory"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please select a parent category",
//                       },
//                     ]}
//                   >
//                     <Select
//                       placeholder="Select parent category"
//                       options={parentOptions}
//                       allowClear={!isForcedSub}
//                       showSearch
//                       disabled={isForcedSub} // lock parent when opened from SubCategoryModal
//                       filterOption={(input, option) =>
//                         option?.label
//                           ?.toLowerCase()
//                           .includes(input.toLowerCase())
//                       }
//                     />
//                   </Form.Item>
//                 </Col>
//               )}

//               {/* Description */}
//               {/* Description */}
//               <Col span={24}>
//                 <Form.Item
//                   label="Description"
//                   name="description"
//                   rules={[
//                     { required: true, message: "Description is required" },
//                   ]}
//                 >
//                   <TinyMce
//                     key={id || "new"} // Force re-render when editing different items
//                     value={form.getFieldValue("description") || ""}
//                     onChange={(v) => {
//                       form.setFieldsValue({ description: v });
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//           </Form>
//         </Spin>
//       </Modal>
//     );
//   },
// );


import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Popconfirm,
  Spin,
  Card,
  Space,
  message,
  Input,
  Switch,
  Tag,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import AdminCategoryService from "../../services/category";
import Pagination from "../components/Pagination";
import TinyMce from "../../utils/TinyMce";
import UploadImage from "../../utils/UploadImage";

export default function CategoryList({ parentId = null }) {
  const navigate = useNavigate();
  const isSubLevel = !!parentId;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    search: "",
    parent: parentId, // Important: send parent id to backend
  });

  const addNewModalRef = useRef();
  const subCategoryModalRef = useRef();

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Type",
      dataIndex: "parentCategory",
      render: (parent) =>
        parent ? (
          <Tag color="purple">Subcategory</Tag>
        ) : (
          <Tag color="blue">Category</Tag>
        ),
    },
    {
      title: "Sort Order",
      dataIndex: "sortOrder",
      width: 90,
      render: (v) => v ?? "—",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 90,
      render: (isActive, row) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggle(row._id)}
        />
      ),
    },
    {
      title: "Subcategories",
      width: 130,
      render: (_, row) => {
        const count = row.subcategories?.length ?? 0;
        return (
          <Button
            size="small"
            icon={<UnorderedListOutlined />}
            onClick={() => subCategoryModalRef.current?.openModal(row)}
          >
            {count > 0 ? `${count} subs` : "Manage"}
          </Button>
        );
      },
    },
    {
      title: "Action",
      width: 100,
      render: (_, row) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => addNewModalRef.current.openForm(row)}
          />
          <Popconfirm
            title="Delete this category?"
            onConfirm={() => deleteData(row._id)}
          >
            <Button type="primary" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchList = () => {
    setLoading(true);
    AdminCategoryService.listCategory(qData)
      .then((res) => {
        const categories = res.data?.categories || [];
        setData(categories.map((v) => ({ ...v, key: v._id })));

        setQData((prev) => ({
          ...prev,
          total: res.data?.pagination?.total || 0,
        }));
      })
      .catch((err) => message.error(err.message || "Failed to fetch"))
      .finally(() => setLoading(false));
  };

  const deleteData = (ids) => {
    const isArray = Array.isArray(ids);
    const request = isArray
      ? AdminCategoryService.deleteManyCategories(ids)
      : AdminCategoryService.deleteCategory(ids);

    request
      .then(() => {
        message.success("Deleted successfully");
        fetchList();
        setSelected([]);
      })
      .catch((err) => message.error(err.message || "Delete failed"));
  };

  const handleToggle = (id) => {
    AdminCategoryService.toggleCategory(id)
      .then(() => {
        message.success("Status updated");
        fetchList();
      })
      .catch((err) => message.error(err.message));
  };

  useEffect(() => {
    fetchList();
  }, [qData.page, qData.limit, qData.search, parentId]);

  return (
    <Card
      bordered={false}
      size="small"
      title={
        <Space>
          {isSubLevel && (
            <Button
              type="dashed"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          )}
          {isSubLevel ? "Subcategories" : "List of Categories"}
        </Space>
      }
      extra={
        <Space>
          {selected.length > 0 && (
            <Popconfirm
              title={`Delete ${selected.length} items?`}
              onConfirm={() => deleteData(selected)}
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Bulk Delete
              </Button>
            </Popconfirm>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => addNewModalRef.current.openForm()}
          >
            Add {isSubLevel ? "Subcategory" : "Category"}
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Form layout="inline" onFinish={(e) => { e.preventDefault(); fetchList(); }}>
          <Form.Item style={{ width: 280 }}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              allowClear
              value={qData.search}
              onChange={(e) =>
                setQData((prev) => ({ ...prev, search: e.target.value, page: 1 }))
              }
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        bordered
        loading={loading}
        size="small"
        columns={columns}
        dataSource={data}
        pagination={false}
        rowSelection={{ onChange: setSelected }}
        footer={() => <Pagination {...{ qData, setQData }} />}
        scroll={{ y: "calc(100vh - 350px)" }}
      />

      <AddForm
        ref={addNewModalRef}
        list={fetchList}
        parentId={parentId}
      />

      <SubCategoryModal
        ref={subCategoryModalRef}
        refreshList={fetchList}
      />
    </Card>
  );
}

// ─────────────────────────────────────────────
// SubCategory Modal (opens nested CategoryList)
// ─────────────────────────────────────────────
const SubCategoryModal = forwardRef(({ refreshList }, ref) => {
  const [open, setOpen] = useState(false);
  const [parent, setParent] = useState(null);

 useImperativeHandle(ref, () => ({
  openModal(parentRow) {
    console.log("Clicked Parent:", parentRow);
    console.log("Parent ID:", parentRow._id);
    console.log("Parent Name:", parentRow.name);

    setParent(parentRow);
    setOpen(true);
  },
}));

  return (
    <Modal
      title={
        <Space>
          <UnorderedListOutlined />
          Subcategories of{" "}
          <span style={{ color: "#6b21a8", fontWeight: 600 }}>
            {parent?.name}
          </span>
        </Space>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={1100}
      destroyOnClose
    >
      <CategoryList parentId={parent?._id} />
    </Modal>
  );
});

// ─────────────────────────────────────────────
// Add/Edit Form
// ─────────────────────────────────────────────
const AddForm = forwardRef(({ list, parentId }, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    openForm(record = null) {
      setOpen(true);
      setEditingId(record?._id || null);

      if (record) {
        const imageValue = record.image
          ? [{ uid: "-1", name: "image", url: record.image }]
          : [];

        form.setFieldsValue({
          name: record.name,
          description: record.description || "",
          sortOrder: record.sortOrder ?? 0,
          image: imageValue,
          parentCategory: record.parentCategory?._id || parentId || null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          sortOrder: 0,
          image: [],
          parentCategory: parentId || null,
          description: "",
        });
      }
    },
  }));

  const onFinish = (values) => {
    setLoading(true);

    const imageUrl = Array.isArray(values.image) && values.image.length
      ? values.image[0].url
      : null;

    const payload = {
      name: values.name?.trim(),
      description: values.description || "",
      sortOrder: values.sortOrder ?? 0,
      image: imageUrl,
      ...(parentId && { parentCategory: parentId }),
    };

    const request = editingId
      ? AdminCategoryService.updateCategory(editingId, payload)
      : AdminCategoryService.addCategory(payload);

    request
      .then(() => {
        message.success(editingId ? "Updated successfully" : "Created successfully");
        setOpen(false);
        list();
      })
      .catch((err) => message.error(err.message || "Operation failed"))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      title={`${editingId ? "Edit" : "Add"} ${parentId ? "Subcategory" : "Category"}`}
      open={open}
      onCancel={() => setOpen(false)}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={800}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Category name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Sort Order" name="sortOrder">
                <Input type="number" min={0} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Image" name="image">
                <UploadImage count={1} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true }]}
              >
                <TinyMce />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});