import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = "https://rickandmortyapi.com/api/";

//Global request interceptor
export const requestInterceptor = async (config: InternalAxiosRequestConfig<any>) => {
    return config;
};

//Global response interceptor
export const responseInterceptor = async (response: AxiosResponse<any, any>) => {
    if (response.status < 200 || response.status >= 300) {
        toast.error("An error occured. Please try again later.");
    }
    
    return response.data;
};

export const axiosClient = axios;