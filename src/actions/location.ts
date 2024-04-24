import { axiosClient, requestInterceptor, responseInterceptor } from "./api";
import { ApiListModel } from "@/models/global";
import { LocationListModel } from "@/models/location";

const characterApi = axiosClient.create({
    baseURL: axiosClient.defaults.baseURL + "location",
});

characterApi.interceptors.request.use(requestInterceptor);
characterApi.interceptors.response.use(responseInterceptor, () => undefined);

export const getLocations = async (page?: number, name?: string) => {
    const response: ApiListModel<LocationListModel> = await characterApi({
        method: "get",
        url: "/",
        params: { page, name }
    });

    return response;
}