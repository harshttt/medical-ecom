
import axios from "../utils/axios";

export default class AdminCategoryService {
  static baseURL = "";

  static listCategory(data) {
    return axios.get(`/vendor/product/category`, { params: data });
  }

}