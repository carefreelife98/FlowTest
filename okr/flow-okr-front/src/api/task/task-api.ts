import axios, {AxiosError, AxiosResponse} from "axios";

const TASK_API_BASE_URL = "http://localhost:4000/api/task";


export const getTotalTaskTree = () => {
    return new Promise((resolve, reject) => {
        axios
            .get(`${TASK_API_BASE_URL}/total`)
            .then((response: AxiosResponse) => resolve(response.data))
            .catch((err: AxiosError) => reject(err));
    });
};

export const getDirectDescendants = (parentId: number) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`${TASK_API_BASE_URL}/direct-descendant`, {params: {parentId: parentId}})
            .then((response: AxiosResponse) => resolve(response.data))
            .catch((err: AxiosError) => reject(err));
    });
};