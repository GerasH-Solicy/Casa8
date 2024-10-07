import { axiosInstance } from "../axiosInstance";

export function useApartament() {
  const getAllApartaments = async (filter: any) => {
    try {
      const queryString = new URLSearchParams(filter).toString();
      const res = await axiosInstance.get(`apartment?${queryString}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };

  const getApartamentById = async (id: string, userEmail: string) => {
    try {
      const res = await axiosInstance.get(
        `apartment/${id}?userEmail=${userEmail}`
      );
      return res.data;
    } catch (error) {
      console.error(`Error fetching apartment with ID ${id}:`, error);
    }
  };

  const getUserOrCreateOnDb = async (email: string) => {
    try {
      const res = await axiosInstance.post(
        `user/info`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching or creating user:", error);
    }
  };

  const getUserLikedApartments = async (userEmail: string) => {
    try {
      const res = await axiosInstance.get(
        `apartment/liked?userEmail=${userEmail}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching liked apartments:", error);
    }
  };

  const getUserApartments = async (email: string) => {
    try {
      const res = await axiosInstance.get(`apartment/user/${email}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching user's apartments:", error);
    }
  };

  const editApartament = async (data: any) => {
    try {
      const res = await axiosInstance.post("apartment/edit", data);
      return res.data;
    } catch (error) {
      console.error("Error editing apartment:", error);
    }
  };

  const deleteApartment = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`apartment/delete/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error deleting apartment:", error);
    }
  };

  const createApartament = async (data: any) => {
    try {
      const res = await axiosInstance.post("apartment", data);
      return res.data;
    } catch (error) {
      console.error("Error creating apartment:", error);
    }
  };

  const toogleLikeApartament = async (data: any) => {
    try {
      const res = await axiosInstance.post("like", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error toggling like on apartment:", error);
    }
  };

  return {
    getAllApartaments,
    createApartament,
    toogleLikeApartament,
    getApartamentById,
    getUserLikedApartments,
    getUserApartments,
    deleteApartment,
    getUserOrCreateOnDb,
    editApartament,
  };
}
