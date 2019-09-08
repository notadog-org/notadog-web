import { requestService } from "./request";

export const getUsers = async () => {
  try {
    return await requestService.get("/users");
  } catch (e) {
    throw new Error(e);
  }
};

export const login = async ({ email, password }) => {
  try {
    return await requestService.post("/Users/login", { email, password });
  } catch (e) {
    throw new Error(e);
  }
};

export const signup = async ({ name, email, password }) => {
  try {
    return await requestService.post("/Users/signup", {
      name,
      email,
      password,
    });
  } catch (e) {
    throw new Error(e);
  }
};

export const createGame = async ({ forceAdding }) => {
  try {
    return await requestService.post("/Game", forceAdding);
  } catch (e) {
    throw new Error(e);
  }
};

export const connectToGame = async ({ forceAdding }) => {
  try {
    return await requestService.put("/Game", forceAdding);
  } catch (e) {
    throw new Error(e);
  }
};