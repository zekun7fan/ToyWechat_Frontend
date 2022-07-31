import axios, {AxiosRequestHeaders} from "axios";
import { createBrowserHistory } from "history";
import {user_token_key} from "../utils/user";
import {DTO, ReqQueryParams} from "./interfaces";


axios.defaults.withCredentials = true;


export const baseURL = 'http://138.197.147.136:9800';


axios.defaults.baseURL = baseURL;


const history = createBrowserHistory();




export function toQueryString(param: any = {}): string {
    let paramStr: string = ''
    for (let key in param) {
        paramStr += key + '=' + param[key] + '&'
    }
    if (paramStr) {
        paramStr = '?' + paramStr.substring(0, paramStr.length - 1)
    }
    return paramStr
}


export function get(url: string, param: ReqQueryParams = {}, data: any = {}) {
    return axios.get(url + toQueryString(param), {data})
}

export function post(url: string, param: ReqQueryParams = {}, data: DTO = {}) {
    return axios.post(url + toQueryString(param), data)
}

export function put(url: string, param: ReqQueryParams = {}, data: DTO = {}) {
    return axios.put(url + toQueryString(param), data)
}

export function del(url: string, param: ReqQueryParams = {}, data: DTO = {}) {
    return axios.delete(url + toQueryString(param), {data})
}






