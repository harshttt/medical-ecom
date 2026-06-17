import axios from "../utils/axios";

export default class service{

    static baseURL = 'auth';

    static login(data){
        return axios.post( this.baseURL + "/admin/login", data);
    }

     static validateToken(){
        return axios.get( this.baseURL + "/validate-token");
    }
   
}