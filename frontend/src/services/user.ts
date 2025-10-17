import api from "@/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const UserService = {
  async list() {
    const res = await api.get(`${API_URL}/user/list`);
    return res.data;
  },
};
