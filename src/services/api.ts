import axios from "axios";
import { domain } from "../utils/domain";

export const api = axios.create({
  baseURL: domain,
});
