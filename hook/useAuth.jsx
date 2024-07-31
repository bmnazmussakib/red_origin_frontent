export default async function useAuth() {
  const login = async (email, password) => {
    try {
      const { data } = await post("/auth/login", { email, password });
      return data;
    } catch (error) {
      return error;
    }
  };

  const logout = async () => {
    try {
      const { data } = await post("/auth/logout");
      return data;
    } catch (error) {
      return error;
    }
  };

  const register = async (email, password) => {
    try {
      const { data } = await post("/auth/register", {
        email,
        password,
      });
      return data;
    } catch (error) {
      return error;
    }
  };

  const getUser = async () => {
    try {
      const { data } = await get("/auth/user");
      return data;
    } catch (error) {
      return error;
    }
  };

  return { login, logout, register, getUser };
}
