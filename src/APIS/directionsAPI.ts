import axios from "axios";

const searchAPI = axios.create({
  baseURL: "https://api.mapbox.com/directions/v5/mapbox/driving",
  params: {
    alternatives: false,
    geometries: "geojson",
    overview: "simplified",
    steps: false,
    limit: 5,
    access_token: process.env.REACT_APP_MAPBOX_TOKEN || "pk.",
  },
});

export default searchAPI;
