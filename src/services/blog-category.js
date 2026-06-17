import axios from "../utils/axios";

export default class service {
  static baseURL = "admin";

  static listCategory(data) {
    return axios.get(this.baseURL + "/blog-cms/category/fetch-all", { params: data });
  }

  static addCategory(data) {
    return axios.post(this.baseURL + "/blog-cms/category/add", data);
  }

  static updateCategory(id, data) {
    return axios.put(`${this.baseURL}/blog-cms/category/update`, data, {
      params: { id },
    });
  }

   static delete(id) {
    return axios.delete(`${this.baseURL}/blog-cms/category/delete`, {
      params: { id },
    });
  }
}
