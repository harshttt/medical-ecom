import axios from "../utils/axios";

export default class BrandsService {
  static baseURL = "admin/brands";

  // GET: Fetch all brands
  static getAll(params = {}) {
    // GET {{local}}/admin/brands/getAll
    return axios.get(`/vendor/product/brands`, { params });
  }

 
}