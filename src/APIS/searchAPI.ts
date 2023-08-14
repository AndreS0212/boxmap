import axios from "axios";

const searchAPI = axios.create({
  baseURL: "https://api.mapbox.com/geocoding/v5/mapbox.places",
  params: {
    limit: 4,
    language: "es",
    country: "pe",
    access_token: process.env.REACT_APP_MAPBOX_TOKEN || "pk",
  },
});

export default searchAPI;
