import { axiosInstance } from "../axiosInstance";

export function useEmail() {
  const sendEmail = async (data: any) => {
    try {
      const res = await axiosInstance.post(`email`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  return { sendEmail };
}
