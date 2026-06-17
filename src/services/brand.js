import axios from "../utils/axios";

export default class BrandsService {
  static baseURL = "admin/brands";

  // GET: Fetch all brands
  static getAll(params = {}) {
    // GET {{local}}/admin/brands/getAll
    return axios.get(`${this.baseURL}/getAll`, { params });
  }

  // GET: Fetch a brand by ID
  static getById(id) {
    // GET {{local}}/admin/brands/:id
    return axios.get(`${this.baseURL}/${id}`);
  }

  // POST: Create a new brand
  // data: { name, logo, description, website, sortOrder }
  static create(data) {
    // POST {{local}}/admin/brands/add
    return axios.post(`${this.baseURL}/add`, data);
  }

  // PUT: Update existing brand by ID
  // data: { name, logo, description, website, sortOrder }
  static update(id, data) {
    // PUT {{local}}/admin/brands/:id
    return axios.put(`${this.baseURL}/${id}`, data);
  }

  // PUT: Toggle brand active/inactive status
  static toggle(id) {
    // PUT {{local}}/admin/brands/:id/toggle
    return axios.put(`${this.baseURL}/${id}/toggle`);
  }

  // DELETE: Delete brand by ID
  static delete(id) {
    // DELETE {{local}}/admin/brands/:id
    return axios.delete(`${this.baseURL}/${id}`);
  }
}