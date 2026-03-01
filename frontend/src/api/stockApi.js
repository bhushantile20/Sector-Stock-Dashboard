import axios from "axios";

const BASE_URL = "/api";

export const fetchSectors = async () => {
  const res = await axios.get(`${BASE_URL}/sectors/`);
  return res.data.sectors;
};

export const fetchCompanies = async (sector) => {
  const res = await axios.get(`${BASE_URL}/companies/?sector=${sector}`);
  return res.data.companies;
};

export const analyzeStock = async (symbol, period) => {
  const res = await axios.post(`${BASE_URL}/analyze/`, { symbol, period });
  return res.data;
};
