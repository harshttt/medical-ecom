import axios from "../utils/axios";

export default class service {
  static baseURL = "admin";

  static listBlog(data) {
    return axios.get(this.baseURL + "/blog-cms/blog/fetch-all", { params: data });
  }

  static addBlog(data) {
    return axios.post(this.baseURL + "/blog-cms/blog/add", data);
  }

  static updateBlog(id, data) {
    return axios.put(`${this.baseURL}/blog-cms/blog/update`, data, {
      params: { id },
    });
  }

    static delete(id) {
    return axios.delete(`${this.baseURL}/blog-cms/blog/delete`, {
      params: { id },
    });
  }
}
