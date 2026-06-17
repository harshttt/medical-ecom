import axios from "axios";
import util from "./util";
import config from "../config";

const axiosShipRocketInstance = axios.create({
    baseURL: config.shipRocketApiUrl
});

axiosShipRocketInstance.interceptors.request.use(
    (config) => {
        config.headers.authorization = 'Bearer ' + util.getShipToken();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosShipRocketInstance.interceptors.response.use(
    (response) => {
        if(typeof response.data == typeof String()){
            return {data: response.data, headers: response.headers};
        } 
        return {...response.data, headers: response.headers};
    },
    (error) => {
        let response = {};
        if (typeof error.response?.data !== 'undefined') {
            response = error.response?.data;
            if (!response?.message) {
                response.message = error.message
            }
            if (response.errors && Array.isArray(response.errors)) {
                response.message = response.errors[0].msg;
            }
        } else {
            response.message = error.message
        }
        return Promise.reject(response);
    }
);

export default axiosShipRocketInstance;