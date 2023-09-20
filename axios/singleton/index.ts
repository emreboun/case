import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_BASE_URL } from '../constants';

class ApiService {
  private static instance: ApiService;
  private session: AxiosInstance;

  private constructor() {
    this.session = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
        "Authorization": "" /* localStorage.getItem(ACCESS_TOKEN) */,
      },
    });
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async get<T>(...params: Parameters<AxiosInstance["get"]>): Promise<AxiosResponse<T>> {
    return this.session.get<T>(...params);
  }

  public async post<T>(...params: Parameters<AxiosInstance["post"]>): Promise<AxiosResponse<T>> {
    return this.session.post<T>(...params);
  }

  public async put<T>(...params: Parameters<AxiosInstance["put"]>): Promise<AxiosResponse<T>> {
    return this.session.put<T>(...params);
  }

  public async patch<T>(...params: Parameters<AxiosInstance["patch"]>): Promise<AxiosResponse<T>> {
    return this.session.patch<T>(...params);
  }

  public async remove<T>(...params: Parameters<AxiosInstance["delete"]>): Promise<AxiosResponse<T>> {
    return this.session.delete<T>(...params);
  }

  public reloadAuthorizationToken(token: string): void {
    this.session.defaults.headers['Authorization'] = token;
  }
}

export default ApiService.getInstance();
