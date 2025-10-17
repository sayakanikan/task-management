import api from "@/lib/axios";
import { TaskStatus } from "@/types/task-status";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Payload {
  title: string, 
  description: string,
  status: TaskStatus,
  deadline: string | null,
}

interface Params {
  status?: "all" | TaskStatus,
  sort_order?: "asc" | "desc",
}

export const TaskService = {
  async list(params?: Params) {
    const res = await api.get(`${API_URL}/task?status=${params?.status}&sort=${params?.sort_order}`);
    console.log(params, res);
    return res.data;
  },
  async create(payload: Payload) {
    const res = await api.post(`${API_URL}/task`, payload);
    return res.data;
  },
  async update(id: number, payload: Payload) {
    const res = await api.put(`${API_URL}/task/${id}`, payload);
    return res.data;
  },
  async delete(id: number) {
    const res = await api.delete(`${API_URL}/task/${id}`);
    return res.data;
  },
};
