import axios from "../utils/axios";

export default class AdminContactService {
  static baseURL = "admin/contact";

  /**
   * Fetch all contacts with pagination and search
   * GET /admin/contact/all
   */
  static listContact(data) {
    return axios.get(`${this.baseURL}/all`, { params: data });
  }

  /**
   * Get single contact by ID
   * GET /admin/contact/{id}
   */
  static getContactById(id) {
    return axios.get(`${this.baseURL}/${id}`);
  }

  /**
   * Update contact
   * PUT /admin/contact/{id}
   */
  static updateContact(id, data) {
    return axios.put(`${this.baseURL}/${id}`, data);
  }

  /**
   * Delete single contact
   * DELETE /admin/contact/{id}
   */
  static deleteContact(id) {
    return axios.delete(`${this.baseURL}/${id}`);
  }

  /**
   * Delete multiple contacts
   * DELETE multiple by calling single delete in parallel
   */
  static deleteManyContacts(ids) {
    return Promise.all(ids.map((id) => axios.delete(`${this.baseURL}/${id}`)));
  }
}