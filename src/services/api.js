import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: { 'Content-Type': 'application/json' }
});

export const getPlats = (params) => API.get('plats/', { params });
export const createPlat = (data) => API.post('plats/', data);
export const updatePlat = (id, data) => API.put(`plats/${id}/`, data);
export const deletePlat = (id) => API.delete(`plats/${id}/`);

export const getCategories = () => API.get('categories/');
export const createCategorie = (data) => API.post('categories/', data);

export const getTables = () => API.get('tables/');
export const updateTable = (id, data) => API.patch(`tables/${id}/`, data);

export const getCommandes = () => API.get('commandes/');
export const createCommande = (data) => API.post('commandes/', data);
export const updateCommande = (id, data) => API.patch(`commandes/${id}/`, data);
export const changerStatutCommande = (id, statut) =>
  API.patch(`commandes/${id}/changer_statut/`, { statut });
export const getStatistiques = () => API.get('commandes/statistiques/');

export const getReservations = () => API.get('reservations/');
export const createReservation = (data) => API.post('reservations/', data);
export const updateReservation = (id, data) => API.patch(`reservations/${id}/`, data);
export const deleteReservation = (id) => API.delete(`reservations/${id}/`);

export default API;