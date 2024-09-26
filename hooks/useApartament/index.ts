import { axiosInstance } from "./axiosInstance"

export function useApartament() {
    const getAllApartaments = async () => {
        const res = await axiosInstance.get('post')
        return res.data
    }

    const createApartament = async (data: any) => {
        const res = await axiosInstance.post('post', data)
        return res.data
    }

    return { getAllApartaments, createApartament }
}