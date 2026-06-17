import axios from "../utils/axios";

export default class service {
  static baseURL = "admin";

  static listdashboard(data) {
    return axios.get(this.baseURL + "/dashboard/all", { params: data });
  }


}
