import axios, { AxiosRequestConfig } from "axios";
import { notify } from "@kyvg/vue3-notification";

const pendingForms = new WeakMap();

const ApiService = {
  _401interceptor: 0,
  removeHeader() {
    axios.defaults.headers.common = {};
  },
  setHeader() {
    axios.defaults.headers.common["Authorization"] = `${localStorage.getItem("auth_token")}`;
  },
  get(resource: string) {
    return axios.get(resource);
  },

  post(resource: string, data?: any, config?: AxiosRequestConfig) {
    const previousController = pendingForms.get(data);
    if (previousController) {
      previousController.abort();
    }
    const innerData = !!data ? data : {};

    const controller = new AbortController();
    pendingForms.set(innerData, controller);

    return axios
      .post(resource, innerData, {
        signal: controller.signal,
        ...config
      })
      .then((res) => {
        pendingForms.delete(innerData);
        return res;
      });
  },
  formData(resource: string, data: object) {
    return axios.post(resource, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  token(resource: string, data: object) {
    return axios.post(resource, data, {
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      }
    });
  },
  put(resource: string, data: object) {
    return axios.put(resource, data);
  },

  delete(resource: string) {
    return axios.delete(resource);
  },
  print(resourse: string, config?: AxiosRequestConfig) {
    return axios.get(resourse, {
      responseType: "blob",
      ...config
    });
  },
  printTemp(resourse: string, data?: any, config?: any) {
    return axios.post(resourse, data, {
      responseType: "blob",
      ...config
    });
  },
  postfile(resourse: string, data: object) {
    return axios.post(resourse, data, {
      responseType: "blob"
    });
  },
  blobandjson(resourse: string, data: object) {
    return axios.post(resourse, data, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: "blob"
    });
  },
  customRequest(data: any) {
    return axios(data);
  },

  mount401Interceptor() {
    this._401interceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.request.status == 401) {
          window.location.href = "/login";
        }

        if (error.request.status == 403) {
          window.location.href = "/error/403";
        }

        if (error.request?.status == 500) {
          notify({
            title: `status: ${error.request.status}`,
            text: `${error.request.responseText}`,
            type: "error"
          });
        }
        throw error;
      }
    );
  },

  unmount401Interceptor() {
    axios.interceptors.response.eject(this._401interceptor);
  }
};

export default ApiService;
