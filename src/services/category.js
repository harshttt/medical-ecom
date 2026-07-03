
import axios from "../utils/axios";

export default class AdminCategoryService {
  static baseURL = "admin/categories";

  static listCategory(data) {
    return axios.get(`${this.baseURL}/all`, { params: data });
  }

  static addCategory(data) {
    return axios.post(`${this.baseURL}/add`, data);
  }

  static updateCategory(id, data) {
    return axios.put(`${this.baseURL}/${id}`, data);
  }

  static toggleCategory(id) {
    return axios.put(`${this.baseURL}/${id}/toggle`);
  }

  // static delete(ids) {
  //   return axios.delete(`${this.baseURL}/${ids}`);
  // }

  // For bulk delete (if your backend supports it)


  static delete(ids) {
    const idArray = Array.isArray(ids) ? ids : [ids];
    return axios.delete(`${this.baseURL}`, {
      data: { ids: idArray }, // always send array
    });
    // Fallback if backend doesn't support bulk:
    // return Promise.all(ids.map(id => this.deleteCategory(id)));
  }
}