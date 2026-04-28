import axios from "axios";

const API_URL = "http://localhost:3000/api/gemstones";

// GET all gemstones
export const getGemstones = async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
};

// CREATE gemstone
export const createGemstone = async (gemstone) => {
  const res = await axios.post(API_URL, gemstone);
  return res.data.data;
};

// DELETE gemstone
export const deleteGemstone = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
