import axios from "axios";

const searchAPI = axios.create({
  baseURL: "https://api.mapbox.com/geocoding/v5/mapbox.places",
  params: {
    limit: 4,
    language: "es",
    country: "ar",
    access_token:
      "pk.eyJ1IjoiYW5kcmVzMDIxMiIsImEiOiJjbGtzcXh3ZGgwNjVrM2dyMGVwajg5NWZwIn0.2Azv717Np8mP_0KhSewMHw",
  },
});

export default searchAPI;
