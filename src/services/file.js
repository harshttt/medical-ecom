// import axios from "../utils/axios";

// export default class service{

//     static baseURL = 'upload';

//     static save(data){
//         return axios.post( this.baseURL + "/single", data);
//     }
   
// }
import axios from "../utils/axios";

export default class service{
    static baseURL = 'upload';

    static async save(data){
        const response = await axios.post(this.baseURL + "/single", data);
        return response.data; // Return only the data part
    }
}