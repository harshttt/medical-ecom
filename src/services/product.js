// AdminProductService.js
import axios from "../utils/axios";

export default class AdminProductService {
  static baseURL = "vendor/product";
  

  /**
   * Get all categories
   * GET vendor/product/category
   */
  static getAllCategories() {
    return axios.get(`${this.baseURL}/category`);
  }

  /**
   * Get all brands
   * GET vendor/product/brands
   */
  static getAllBrands() {
    return axios.get(`${this.baseURL}/brands`);
  }

  /**
   * Get category specifications by category ID
   * GET vendor/product/category/specifications?categoryId={id}
   */
  static getCategorySpecifications(categoryId) {
    return axios.get(`${this.baseURL}/categories/${categoryId}/specifications`, {
      params: { categoryId }
    });
  }

  /**
   * Create a new product
   * POST vendor/product/brands
   */
  static createProduct(data) {
    return axios.post(`${this.baseURL}/add`, data);
  }

  /**
   * Get all products with filters
   * GET vendor/product/getAll
   */
  static getAllProducts(params) {
    return axios.get(`${this.baseURL}/getAll`, { params });
  }

  /**
   * Get product by ID
   * GET vendor/product/getAll (with id parameter)
   */
  static getProductById(id) {
    return axios.get(`${this.baseURL}/getAll`, { params: { id } });
  }

  /**
   * Update product details
   * PUT vendor/product/update
   */
  static updateProduct(id, data) {
    return axios.put(`${this.baseURL}/${id}`, { id, ...data });
  }

  /**
   * Toggle product status (active/inactive)
   * PUT vendor/product/{id}/toggle
   */
  static toggleProductStatus(id) {
    return axios.put(`${this.baseURL}/${id}/toggle`);
  }

  /**
   * Delete a single product
   * DELETE vendor/product/{id}
   */
  static deleteProduct(id) {
    return axios.delete(`${this.baseURL}/${id}`);
  }

  /**
   * Delete multiple products
   */
  static deleteManyProducts(ids) {
    return Promise.all(ids.map((id) => axios.delete(`${this.baseURL}/${id}`)));
  }
}