// import axios from "../utils/axios";

// export default class AdminCategoryService {
//   static baseURL = "admin/categories";

//   /**
//    * Fetch categories with filters (search, level, etc.)
//    * GET admin/ecom/category
//    */
//   static listCategory(data) {
//     return axios.get(`${this.baseURL}/all`, { params: data });
//   }

//   /**
//    * Create a new category with specifications
//    * POST admin/ecom/category/create
//    */
//   static addCategory(data) {
//     return axios.post(`${this.baseURL}/add`, data);
//   }

//   /**
//    * Update category details
//    * PUT admin/ecom/category/update?id={id}
//    */
//   static updateCategory(id, data) {
//     return axios.put(`${this.baseURL}/${id}`, data);
//   }

  
//    static toggleCategory(id) {
//     return axios.put(`${this.baseURL}/${id}/toggle`);
//   }
  

//   /**
//    * Delete one or multiple categories
//    * DELETE admin/ecom/category/delete
//    * Body: { ids: [] }
//    */
//  static deleteCategory(id) {
//   return axios.delete(`${this.baseURL}/${id}`);
// }

// static deleteManyCategories(ids) {
//   return Promise.all(ids.map((id) => axios.delete(`${this.baseURL}/${id}`)));
// }
// }

// services/category.js (or AdminCategoryService)
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

  static deleteCategory(id) {
    return axios.delete(`${this.baseURL}/${id}`);
  }

  // For bulk delete (if your backend supports it)
  static deleteManyCategories(ids) {
    return axios.delete(`${this.baseURL}/bulk-delete`, {
      data: { ids },
    });
    // Fallback if backend doesn't support bulk:
    // return Promise.all(ids.map(id => this.deleteCategory(id)));
  }
}