import axios from "axios";
import * as config from "./config.json";

const instance = axios.create({
  baseURL: `${config.serverUrl}/api`,
});

export default instance;
