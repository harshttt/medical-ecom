import {
  CalendarOutlined,
  InsertRowRightOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import User from "../pages/user-management/User";
import BrandManagement from "../pages/brand";
import Category from "../pages/category";
import util from "../../utils/util";
import UserVendor from "../pages/Vendor Management/userVendor";
import ProductManagement from "../pages/Product-Management/product";
import OrderHistory from "../pages/Order-History/orderHistory";

const roles = util.constants()?.ROLES || {};
// console.log("console1", util.constants());
// console.log("Available roles from constants:", roles);

const routes = [
  {
    title: "User Management",
    icon: CalendarOutlined,
    url: "/user",
    roles: [roles.SUPER_ADMIN], // ✅ who can see module
    children: [
      {
        title: "User",
        icon: InsertRowRightOutlined,
        url: "/",
        roles: [roles.SUPER_ADMIN], // ✅ who can access page
        component: User,
      },
    ],
  },

  {
    title: "Category",
    icon: InsertRowRightOutlined,
    url: "/category",
    component: Category,
    roles: [roles.SUPER_ADMIN],
  },

  {
    title: "Brand Management",
    icon: HomeOutlined,
    url: "/brand",
    component: BrandManagement,
    roles: [roles.SUPER_ADMIN],
  },

  {
    title: "Vendor Management",
    icon: CalendarOutlined,
    url: "/user-vendor",
    roles: [roles.SUPER_ADMIN],

    children: [
      {
        title: "Vendor",
        icon: InsertRowRightOutlined,
        url: "/",
        roles: [roles.SUPER_ADMIN],
        component: UserVendor,
      },
    ],
  },

   {
    title: "Product Management",
    icon: CalendarOutlined,
    url: "/product-management",
    roles: [roles.VENDOR],
    children: [
      {
        title: "Product Management",
        icon: InsertRowRightOutlined,
        url: "/",
        component: ProductManagement,
         roles: [roles.VENDOR],
      },
    ],
  },
    {
    title: "Order History",
    icon: CalendarOutlined,
    url: "/order-history",
    roles: [roles.VENDOR],
    children: [
      {
        title: "Order History",
        icon: InsertRowRightOutlined,
        url: "/",
        component: OrderHistory,
         roles: [roles.SUPER_ADMIN],
      },
    ],
  },

];

const filteredRoutes = routes
  .map((r) => ({
    ...r,
    children: r.children?.filter((c) => util.hasAccess(c.roles)) || undefined,
  }))
  .filter(
    (r) => util.hasAccess(r.roles) || (r.children && r.children.length > 0),
  );

export default filteredRoutes;
