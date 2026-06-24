import axios from "../utils/axios";

export default class service {
  static baseURL = "admin";

  static listServices(data) {
    return axios.get(this.baseURL + "/integration/getAll", { params: data });
  }

  static addServices(data) {
    return axios.post(this.baseURL + "/integration/add", data);
  }

 static updateServices(id, data) {
    return axios.put(`${this.baseURL}/service/integrations`, data, {
      params: { id },
    });
  }

 static toggleServices(id) {
    return axios.patch(this.baseURL + "/service/integrations/toggle", null, {
      params: { id },
    });
  }

   static delete(id) {
    return axios.delete(`${this.baseURL}/service/integrations`, {
      params: { id },
    });
  }

}


