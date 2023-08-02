import axios from "axios";

const searchAPI = axios.create({
  baseURL: "https://api.mapbox.com/directions/v5/mapbox/driving",
  params: {
    alternatives: false,
    geometries: "geojson",
    overview: "simplified",
    steps: false,
    limit: 5,
    access_token:
      "pk.eyJ1IjoiYW5kcmVzMDIxMiIsImEiOiJjbGtzcXh3ZGgwNjVrM2dyMGVwajg5NWZwIn0.2Azv717Np8mP_0KhSewMHw",
  },
});

export default searchAPI;
