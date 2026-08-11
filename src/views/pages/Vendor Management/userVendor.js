// /* eslint-disable react-hooks/exhaustive-deps */
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
//   Space,
//   Modal,
//   Select,
//   Switch,
//   Cascader,
//   TreeSelect,
// } from "antd";
// import {
//   DeleteOutlined,
//   EditOutlined,
//   PlusOutlined,
//   ArrowLeftOutlined,
// } from "@ant-design/icons";
// import React, {
//   useEffect,
//   useState,
//   forwardRef,
//   useImperativeHandle,
//   useRef,
// } from "react";
// import servicesAdmin from "../../../services/admin-vendor";
// import servicesCategory from "../../../services/category";
// import Pagination from "../../components/Pagination";
// import { useNavigate } from "react-router-dom";
// // import UploadImage from '../../utils/UploadImage';
// import util from "../../../utils/util";
// import { AntdMsg } from "../../../utils/Antd";
// const { SHOW_CHILD } = Cascader;

// export default function UserVendor() {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selected, setSelected] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [constants, setConstants] = useState({
//     role: util.constants()?.ROLES?.VENDOR || null,
//     varificationStatus: util.constants()?.VENDOR_STATUS || {},
//   });
//   const [qData, setQData] = useState({
//     page: 1,
//     limit: 10,
//     role: constants?.role,
//   });

//   const VARIFICATION_STATUS = [
//     {
//       label: "PENDING",
//       value: constants?.varificationStatus?.PENDING,
//     },
//     {
//       label: "APPROVED",
//       value: constants?.varificationStatus?.APPROVED,
//     },
//     {
//       label: "REJECTED",
//       value: constants?.varificationStatus?.REJECTED,
//     },
//     {
//       label: "UNDER_REVIEW",
//       value: constants?.varificationStatus?.UNDER_REVIEW,
//     },
//   ];

//   const addNewModalRef = useRef();
//   console.log(constants);
//   const columns = [
//     {
//       title: "S.No",
//       dataIndex: "sno",
//       width: 50,
//       render: (text, record, index) => index + 1,
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//     },

//     {
//       title: "Verification Status",
//       render: (text, record) => {
//         return (
//           Object.entries(constants?.varificationStatus || {}).find(
//             ([key, val]) => val === record?.vendor?.verificationStatus
//           )?.[0] || "-"
//         );
//       },
//     },

//     {
//       title: "Action",
//       dataIndex: "_id",
//       width: 80,
//       render: (v, row) => (
//         <Space>
//           <Popconfirm
//             title="Are you sure to delete this?"
//             onConfirm={() => deleteData(row?._id)}
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
//           <Button
//             type="primary"
//             size="small"
//             icon={<EditOutlined />}
//             onClick={() => addNewModalRef.current.openForm(row)}
//           />
//         </Space>
//       ),
//     },
//   ];

//   function list() {
//     setLoading(true);
//     servicesAdmin
//       .list(qData)
//       .then((res) => {
//         setData(res?.data?.users?.map((v) => ({ ...v, key: v._id })));
//         setQData({
//           ...qData,
//           limit: res?.data?.pagination?.limit,
//           page: res?.data?.pagination?.page,
//           total: res?.data?.pagination?.total,
//         });
//       })
//       .catch((e) => {
//         message.error(e?.message || "");
//       })
//       .finally(() => setLoading(false));
//   }

//   const deleteData = (id) => {
//     servicesAdmin
//       .delete(id)
//       .then((res) => {
//         message.success(res?.message);
//         list();
//         setSelected([]);
//       })
//       .catch((err) => {
//         message.error(err?.message);
//       });
//   };

//   const activeHandler = (id) => {
//     servicesAdmin
//       .toggle(id)
//       .then((res) => {
//         message.success(res?.message || "Status updated successfully");
//         list();
//         setSelected([]);
//       })
//       .catch((err) => {
//         message.error(err?.message);
//       });
//   };

//   const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

//   tableColumns[0].fixed = true;
//   tableColumns[tableColumns.length - 1].fixed = "right";

//   const tableProps = {
//     bordered: true,
//     loading,
//     title: () => (
//       <Search
//         {...{
//           qData,
//           setQData,
//           list,
//         }}
//       />
//     ),
//     size: "small",
//     showHeader: true,
//     footer: () => <Pagination {...{ qData, setQData }} />,
//   };

//   useEffect(() => {
//     list();
//   }, [qData?.page, qData?.limit]);

//   useEffect(() => {
//     servicesCategory.listCategory().then((res) => {
//       setCategory(res?.data?.categories);
//     });

//   }, []);

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
//           List of Vendor
//         </Space>
//       }
//       extra={
//         <Row justify="end" gutter={12}>
//           <Col>
//             {selected.length > 0 && (
//               <Popconfirm
//                 title="Are you sure to delete selected images?"
//                 onConfirm={() => deleteData(selected)}
//                 okText="Yes"
//                 cancelText="No"
//               >
//                 <Button type="primary" danger icon={<DeleteOutlined />}>
//                   Delete Selected
//                 </Button>
//               </Popconfirm>
//             )}
//           </Col>
//           <Col>
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={() => addNewModalRef.current.openForm()}
//             >
//               Add New
//             </Button>
//           </Col>
//         </Row>
//       }
//     >
//       <Table
//         {...tableProps}
//         pagination={{ position: ["none"], pageSize: qData.limit }}
//         columns={tableColumns}
//         dataSource={data.length ? data : []}
//         scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
//       />
//       <AddForm ref={addNewModalRef} {...{ list, constants, VARIFICATION_STATUS, category }} />
//     </Card>
//   );
// }

// function Search({ qData, setQData, list, }) {
//   return (
//     <Form onSubmitCapture={() => {
//       qData.page = 1; // Reset page on search // Reset page on search
//       list();
//     }}>
//       <Row gutter={[12, 12]}>
//         <Col span={6}>
//           <Input
//             placeholder="Search"
//             value={qData.key}
//             onChange={(e) => setQData({ ...qData, search: e.target.value })}
//             allowClear
//           />
//         </Col>

//         {/* Search Button */}
//         <Col span={3}>
//           <Button type="primary" htmlType="submit">
//             Search
//           </Button>
//         </Col>
//       </Row>
//     </Form>
//   );
// }

// const AddForm = forwardRef(({ list, constants, VARIFICATION_STATUS, category }, ref) => {
//   const [open, setOpen] = useState(false);
//   const [data, setData] = useState({});
//   const [ajxRequesting, setAjxRequesting] = useState(false);

//   useImperativeHandle(ref, () => ({
//     openForm(dt) {
//       setOpen(true);
//       setData(dt ? { ...dt?.vendor } : {});
//     },
//   }));

//   const handleChange = (value) => setData((prev) => ({ ...prev, ...value }));

//   const saveAdd = () => {
//     setAjxRequesting(true);
//     servicesAdmin
//       .add(data)
//       .then((res) => {
//         AntdMsg(res.message);
//         list();
//         setOpen(false);
//       })
//       .catch((err) => {
//         AntdMsg(err.message, "error");
//       })
//       .finally(() => setAjxRequesting(false));
//   };

//   const saveEdit = () => {
//     setAjxRequesting(true);
//     servicesAdmin
//       .update(data?._id, data)
//       .then((res) => {
//         AntdMsg(res.message);
//         list();
//         setOpen(false);
//       })
//       .catch((err) => {
//         AntdMsg(err.message, "error");
//       })
//       .finally(() => setAjxRequesting(false));
//   };

//   const save = () => {
//     if (data._id) {
//       saveEdit();
//     } else {
//       saveAdd();
//     }
//   };

//   const convertToTreeData = (categories = []) =>

//     categories.map((category) => ({
//       title: category?.name,
//       value: category?._id,
//       key: category?._id,
//       children: convertToTreeData(category?.subcategories || []),
//     }));


//   return (
//     <Modal
//       title={data._id ? "Edit Vendor" : "Add Vendor"}
//       style={{ top: 20 }}
//       open={open}
//       onOk={save}
//       okButtonProps={{ disabled: ajxRequesting }}
//       onCancel={() => setOpen(false)}
//       destroyOnClose
//       maskClosable={false}
//       width={1500}
//       footer={[
//         <Button key="cancel" onClick={() => setOpen(false)}>
//           Cancel
//         </Button>,
//         <Button key="save" type="primary" onClick={save}>
//           Save
//         </Button>,
//       ]}
//     >
//       <Spin spinning={ajxRequesting}>
//         <Form layout="vertical">
//           <Row gutter={20}>
//             <Col span={12}>
//               <Form.Item label="Owner Name" required>
//                 <Input

//                   value={data?.ownerName}
//                   onChange={(e) => setData({ ...data, ownerName: e.target.value })}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item label="BusinessName" required>
//                 <Input
//                   //   disabled={id ? true : false}
//                   value={data?.businessName}
//                   onChange={(e) => setData({ ...data, businessName: e.target.value })}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item label="Mobile Number" required>
//                 <Input
//                   //   disabled={id ? true : false}
//                   value={data?.phone}
//                   onChange={(e) =>
//                     setData({
//                       ...data,
//                       phone: util.handleInteger(e.target.value),
//                     })
//                   }
//                 />
//               </Form.Item>
//             </Col>
//             {/* Email */}
//             <Col span={12}>
//               <Form.Item label="Email" required>
//                 <Input
//                   type="email"
//                   autoComplete="off"                 // or "new-email"
//                   name="vendorEmail"                 // optional extra help
//                   value={data?.email || ""}
//                   onChange={(e) => setData({ ...data, email: e.target.value })}
//                 />
//               </Form.Item>
//             </Col>

//             {/* Password */}
//             <Col span={12}>
//               <Form.Item label="Password" required>
//                 <Input
//                   type="password"
//                   autoComplete="new-password"        // most reliable for password fields
//                   name="vendorPassword"
//                   value={data?.password || ""}
//                   onChange={(e) => setData({ ...data, password: e.target.value })}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item label="Verification Status" >
//                 <Select
//                   style={{ width: "100%" }}
//                   value={data?.verificationStatus}
//                   onChange={(value) =>
//                     setData({ ...data, verificationStatus: value })
//                   }
//                   placeholder=""
//                   options={(VARIFICATION_STATUS || []).map((cat) => ({
//                     label: cat.label,
//                     value: cat.value,
//                   }))}
//                 />
//               </Form.Item>
//             </Col>

//             <Col span={24}>
//               <Form.Item label="Allowed Categories" required>
//                 <TreeSelect
//                   style={{ width: "100%" }}
//                   treeData={convertToTreeData(category || [])}
//                   value={data?.categories}
//                   onChange={(value) =>
//                     setData({
//                       ...data,
//                       categories: value,
//                     })
//                   }
//                   treeCheckable
//                   showSearch
//                   allowClear
//                   treeNodeFilterProp="title"
//                   maxTagCount="responsive"
//                   showCheckedStrategy={TreeSelect.SHOW_CHILD}
//                   treeExpandAction="click"
//                   placeholder="Select Allowed Categories"
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={24}>
//               {data.categories?.length > 0 && (
//                 <div style={{ marginTop: 8 }}>
//                   <b>Selected:</b> {data.categories.length} categories
//                 </div>
//               )}
//             </Col>
//           </Row>
//         </Form>
//       </Spin>
//     </Modal>
//   );
// });


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
  TreeSelect,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import servicesAdmin from "../../../services/admin-vendor";
import servicesCategory from "../../../services/category";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import util from "../../../utils/util";
import { AntdMsg } from "../../../utils/Antd";

export default function UserVendor() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [category, setCategory] = useState([]);
  const [constants, setConstants] = useState({
    role: util.constants()?.ROLES?.VENDOR || null,
    varificationStatus: util.constants()?.VENDOR_STATUS || {},
  });
  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    role: constants?.role,
  });

  const VARIFICATION_STATUS = [
    {
      label: "PENDING",
      value: constants?.varificationStatus?.PENDING,
    },
    {
      label: "APPROVED",
      value: constants?.varificationStatus?.APPROVED,
    },
    {
      label: "REJECTED",
      value: constants?.varificationStatus?.REJECTED,
    },
    {
      label: "UNDER_REVIEW",
      value: constants?.varificationStatus?.UNDER_REVIEW,
    },
  ];

  // Adjust these options according to your backend constants
  const BUSINESS_TYPE_OPTIONS = [
    { label: "Manufacturer", value: 1 },
    { label: "Distributor", value: 2 },
    { label: "Dealer / Retailer", value: 3 },
    { label: "Service Provider", value: 4 },
    { label: "Other", value: 5 },
  ];

  const BUSINESS_ROLE_TYPE_OPTIONS = [
    { label: "Primary", value: 1 },
    { label: "Secondary", value: 2 },
    { label: "Authorized Partner", value: 3 },
  ];

  const addNewModalRef = useRef();

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Business Name",
      render: (_, record) => record?.vendor?.businessName || "-",
    },
    {
      title: "Verification Status",
      render: (text, record) => {
        return (
          Object.entries(constants?.varificationStatus || {}).find(
            ([key, val]) => val === record?.vendor?.verificationStatus
          )?.[0] || "-"
        );
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
    servicesAdmin
      .list(qData)
      .then((res) => {
        setData(res?.data?.users?.map((v) => ({ ...v, key: v._id })));
        setQData({
          ...qData,
          limit: res?.data?.pagination?.limit,
          page: res?.data?.pagination?.page,
          total: res?.data?.pagination?.total,
        });
      })
      .catch((e) => {
        message.error(e?.message || "");
      })
      .finally(() => setLoading(false));
  }

  const deleteData = (id) => {
    servicesAdmin
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
        }}
      />
    ),
    size: "small",
    showHeader: true,
    footer: () => <Pagination {...{ qData, setQData }} />,
  };

  useEffect(() => {
    list();
  }, [qData?.page, qData?.limit]);

  useEffect(() => {
    servicesCategory.listCategory().then((res) => {
      setCategory(res?.data?.categories);
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
          List of Vendor
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
      <AddForm
        ref={addNewModalRef}
        {...{
          list,
          constants,
          VARIFICATION_STATUS,
          category,
          BUSINESS_TYPE_OPTIONS,
          BUSINESS_ROLE_TYPE_OPTIONS,
        }}
      />
    </Card>
  );
}

function Search({ qData, setQData, list }) {
  return (
    <Form
      onSubmitCapture={() => {
        setQData((prev) => ({ ...prev, page: 1 }));
        list();
      }}
    >
      <Row gutter={[12, 12]}>
        <Col span={6}>
          <Input
            placeholder="Search"
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
  );
}

const AddForm = forwardRef(
  (
    {
      list,
      constants,
      VARIFICATION_STATUS,
      category,
      BUSINESS_TYPE_OPTIONS,
      BUSINESS_ROLE_TYPE_OPTIONS,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});
    const [ajxRequesting, setAjxRequesting] = useState(false);

    useImperativeHandle(ref, () => ({
      openForm(dt) {
        setOpen(true);
        if (dt?.vendor) {
          // Edit mode – spread vendor data and keep nested objects safe
          setData({
            ...dt.vendor,
            address: dt.vendor.address || {},
            documents: dt.vendor.documents || {},
            salesManager: dt.vendor.salesManager || {},
            serviceManager: dt.vendor.serviceManager || {},
            bankDetails: dt.vendor.bankDetails || {},
            serviceAreas: dt.vendor.serviceAreas || [],
            categories: dt.vendor.categories || [],
          });
        } else {
          // Add mode – initialise nested objects
          setData({
            address: {},
            documents: {},
            salesManager: {},
            serviceManager: {},
            bankDetails: {},
            serviceAreas: [],
            categories: [],
          });
        }
      },
    }));

    const updateNested = (parentKey, childKey, value) => {
      setData((prev) => ({
        ...prev,
        [parentKey]: {
          ...(prev[parentKey] || {}),
          [childKey]: value,
        },
      }));
    };

    const saveAdd = () => {
      setAjxRequesting(true);
      servicesAdmin
        .add(data)
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

    const saveEdit = () => {
      setAjxRequesting(true);
      servicesAdmin
        .update(data?._id, data)
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
        saveAdd();
      }
    };

    const convertToTreeData = (categories = []) =>
      categories.map((category) => ({
        title: category?.name,
        value: category?._id,
        key: category?._id,
        children: convertToTreeData(category?.subcategories || []),
      }));

    return (
      <Modal
        title={data._id ? "Edit Vendor" : "Add Vendor"}
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
        <Spin spinning={ajxRequesting}>
          <Form layout="vertical">
            {/* ===================== BASIC INFO ===================== */}
            <Divider orientation="left">Basic Information</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Owner Name" required>
                  <Input
                    value={data?.ownerName}
                    onChange={(e) =>
                      setData({ ...data, ownerName: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Business Name" required>
                  <Input
                    value={data?.businessName}
                    onChange={(e) =>
                      setData({ ...data, businessName: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Brand Name">
                  <Input
                    value={data?.brandName}
                    onChange={(e) =>
                      setData({ ...data, brandName: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Mobile Number" required>
                  <Input
                    value={data?.phone}
                    onChange={(e) =>
                      setData({
                        ...data,
                        phone: util.handleInteger(e.target.value),
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Alternate Phone">
                  <Input
                    value={data?.alternatePhone}
                    onChange={(e) =>
                      setData({
                        ...data,
                        alternatePhone: util.handleInteger(e.target.value),
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Email" required>
                  <Input
                    type="email"
                    autoComplete="off"
                    value={data?.email || ""}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Password"
                  required={!data._id}
                  help={data._id ? "Leave blank to keep existing password" : ""}
                >
                  <Input.Password
                    autoComplete="new-password"
                    value={data?.password || ""}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Website">
                  <Input
                    value={data?.website}
                    onChange={(e) =>
                      setData({ ...data, website: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Logo URL">
                  <Input
                    value={data?.logo}
                    onChange={(e) =>
                      setData({ ...data, logo: e.target.value })
                    }
                    placeholder="https://cdn.example.com/..."
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Verification Status">
                  <Select
                    style={{ width: "100%" }}
                    value={data?.verificationStatus}
                    onChange={(value) =>
                      setData({ ...data, verificationStatus: value })
                    }
                    options={(VARIFICATION_STATUS || []).map((cat) => ({
                      label: cat.label,
                      value: cat.value,
                    }))}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Business Type">
                  <Select
                    style={{ width: "100%" }}
                    value={data?.businessType}
                    onChange={(value) =>
                      setData({ ...data, businessType: value })
                    }
                    options={BUSINESS_TYPE_OPTIONS}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Business Role Type">
                  <Select
                    style={{ width: "100%" }}
                    value={data?.businessRoleType}
                    onChange={(value) =>
                      setData({ ...data, businessRoleType: value })
                    }
                    options={BUSINESS_ROLE_TYPE_OPTIONS}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== TAX / LEGAL ===================== */}
            <Divider orientation="left">Tax & Legal</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="GST Number">
                  <Input
                    value={data?.gstNumber}
                    onChange={(e) =>
                      setData({ ...data, gstNumber: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="PAN Number">
                  <Input
                    value={data?.panNumber}
                    onChange={(e) =>
                      setData({ ...data, panNumber: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Authorized Dealer Certificate No.">
                  <Input
                    value={data?.authorizedDealerCertificateNumber}
                    onChange={(e) =>
                      setData({
                        ...data,
                        authorizedDealerCertificateNumber: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== ADDRESS ===================== */}
            <Divider orientation="left">Address</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Address Line 1">
                  <Input
                    value={data?.address?.line1}
                    onChange={(e) =>
                      updateNested("address", "line1", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Address Line 2">
                  <Input
                    value={data?.address?.line2}
                    onChange={(e) =>
                      updateNested("address", "line2", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="City">
                  <Input
                    value={data?.address?.city}
                    onChange={(e) =>
                      updateNested("address", "city", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="State">
                  <Input
                    value={data?.address?.state}
                    onChange={(e) =>
                      updateNested("address", "state", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Pincode">
                  <Input
                    value={data?.address?.pincode}
                    onChange={(e) =>
                      updateNested("address", "pincode", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Country">
                  <Input
                    value={data?.address?.country}
                    onChange={(e) =>
                      updateNested("address", "country", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== SERVICE AREAS ===================== */}
            <Divider orientation="left">Service Areas</Divider>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Service Areas">
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    value={data?.serviceAreas || []}
                    onChange={(value) =>
                      setData({ ...data, serviceAreas: value })
                    }
                    placeholder="Type and press Enter"
                    tokenSeparators={[","]}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== CATEGORIES ===================== */}
            <Divider orientation="left">Allowed Categories</Divider>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Categories" required>
                  <TreeSelect
                    style={{ width: "100%" }}
                    treeData={convertToTreeData(category || [])}
                    value={data?.categories}
                    onChange={(value) =>
                      setData({ ...data, categories: value })
                    }
                    treeCheckable
                    showSearch
                    allowClear
                    treeNodeFilterProp="title"
                    maxTagCount="responsive"
                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                    treeExpandAction="click"
                    placeholder="Select Allowed Categories"
                  />
                </Form.Item>
                {data.categories?.length > 0 && (
                  <div style={{ marginTop: -8, marginBottom: 16 }}>
                    <b>Selected:</b> {data.categories.length} categories
                  </div>
                )}
              </Col>
            </Row>

            {/* ===================== MANAGERS ===================== */}
            <Divider orientation="left">Sales Manager</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Name">
                  <Input
                    value={data?.salesManager?.name}
                    onChange={(e) =>
                      updateNested("salesManager", "name", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Phone">
                  <Input
                    value={data?.salesManager?.phone}
                    onChange={(e) =>
                      updateNested(
                        "salesManager",
                        "phone",
                        util.handleInteger(e.target.value)
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Email">
                  <Input
                    value={data?.salesManager?.email}
                    onChange={(e) =>
                      updateNested("salesManager", "email", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Service Manager</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Name">
                  <Input
                    value={data?.serviceManager?.name}
                    onChange={(e) =>
                      updateNested("serviceManager", "name", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Phone">
                  <Input
                    value={data?.serviceManager?.phone}
                    onChange={(e) =>
                      updateNested(
                        "serviceManager",
                        "phone",
                        util.handleInteger(e.target.value)
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Email">
                  <Input
                    value={data?.serviceManager?.email}
                    onChange={(e) =>
                      updateNested("serviceManager", "email", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== BANK DETAILS ===================== */}
            <Divider orientation="left">Bank Details</Divider>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Account Holder">
                  <Input
                    value={data?.bankDetails?.accountHolder}
                    onChange={(e) =>
                      updateNested(
                        "bankDetails",
                        "accountHolder",
                        e.target.value
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Account Number">
                  <Input
                    value={data?.bankDetails?.accountNumber}
                    onChange={(e) =>
                      updateNested(
                        "bankDetails",
                        "accountNumber",
                        e.target.value
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="IFSC Code">
                  <Input
                    value={data?.bankDetails?.ifscCode}
                    onChange={(e) =>
                      updateNested("bankDetails", "ifscCode", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Bank Name">
                  <Input
                    value={data?.bankDetails?.bankName}
                    onChange={(e) =>
                      updateNested("bankDetails", "bankName", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ===================== DOCUMENTS ===================== */}
            <Divider orientation="left">Documents (URLs)</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="GST Certificate">
                  <Input
                    value={data?.documents?.gstCertificate}
                    onChange={(e) =>
                      updateNested(
                        "documents",
                        "gstCertificate",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="PAN Card">
                  <Input
                    value={data?.documents?.panCard}
                    onChange={(e) =>
                      updateNested("documents", "panCard", e.target.value)
                    }
                    placeholder="https://..."
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Dealer Authorization">
                  <Input
                    value={data?.documents?.dealerAuthorization}
                    onChange={(e) =>
                      updateNested(
                        "documents",
                        "dealerAuthorization",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Business License">
                  <Input
                    value={data?.documents?.businessLicense}
                    onChange={(e) =>
                      updateNested(
                        "documents",
                        "businessLicense",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Cancelled Cheque">
                  <Input
                    value={data?.documents?.cancelledCheque}
                    onChange={(e) =>
                      updateNested(
                        "documents",
                        "cancelledCheque",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Office Photos (comma separated URLs)">
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    value={data?.documents?.officePhotos || []}
                    onChange={(value) =>
                      updateNested("documents", "officePhotos", value)
                    }
                    placeholder="Paste URLs and press Enter"
                    tokenSeparators={[","]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Warehouse Photos (comma separated URLs)">
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    value={data?.documents?.warehousePhotos || []}
                    onChange={(value) =>
                      updateNested("documents", "warehousePhotos", value)
                    }
                    placeholder="Paste URLs and press Enter"
                    tokenSeparators={[","]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
);