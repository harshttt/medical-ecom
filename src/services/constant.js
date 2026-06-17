import axios from "../utils/axios";

export default class service {
  static baseURL = "/public";

  static getConstant(data) {
    return axios.get(this.baseURL+"/get-constant");
  }


}


