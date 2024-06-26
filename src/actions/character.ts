import { CharacterListModel } from "@/models/character";
import { axiosClient, requestInterceptor, responseInterceptor } from "./api";
import { ApiListModel } from "@/models/global";

const characterApi = axiosClient.create({
    baseURL: axiosClient.defaults.baseURL + "character",
});

characterApi.interceptors.request.use(requestInterceptor);
characterApi.interceptors.response.use(responseInterceptor, () => undefined);

export const getCharacters = async (page?: number, name?: string) => {
    const response: ApiListModel<CharacterListModel> = await characterApi({
        method: "get",
        url: "/",
        params: { page, name }
    });

    return response;
}