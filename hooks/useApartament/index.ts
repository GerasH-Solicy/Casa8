import { axiosInstance } from "./axiosInstance";

export function useApartament() {
  const getAllApartaments = async (filter: any) => {
    const queryString = new URLSearchParams(filter).toString();
    const res = await axiosInstance.get(`apartment?${queryString}`);
    return res.data;
  };

  const getApartamentById = async (id: string, userEmail: string) => {
    const res = await axiosInstance.get(
      `apartment/${id}?userEmail=${userEmail}`
    );
    return res.data;
  };

  const getUserLikedApartments = async (userEmail: string) => {
    const res = await axiosInstance.get(
      `apartment/liked?userEmail=${userEmail}`
    );
    return res.data;
  };

  const getUserApartments = async (email: string) => {
    const res = await axiosInstance.get(`apartment/user/${email}`);
    return res.data;
  };

  const editApartament = async (data: any) => {
    const res = await axiosInstance.post("apartment/edit", data);
    return res.data;
  };

  const createApartament = async (data: any) => {
    const res = await axiosInstance.post("apartment", data);
    return res.data;
  };

  const toogleLikeApartament = async (data: any) => {
    const res = await axiosInstance.post("like", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  };

  return {
    getAllApartaments,
    createApartament,
    toogleLikeApartament,
    getApartamentById,
    getUserLikedApartments,
    getUserApartments,
    editApartament
  };
}
