import axios from "../utils/axios";

export default class service {
    static baseURL = "admin";

    static listApplications() {
        return axios.get(`${this.baseURL}/content/all`);
    }

    static updateApplications(type, jsonContent) {
        if (!type && type !== 0) {
            console.error("Type is missing. Received:", type);
            throw new Error("Type is required for update");
        }
        return axios.put(`${this.baseURL}/content/update/${type}`, { jsonContent });
    }
}