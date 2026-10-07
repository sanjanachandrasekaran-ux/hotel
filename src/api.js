const API_BASE_URL = 'http://localhost:5000/api/hotels';
const UPLOAD_URL = 'http://localhost:5000/api/upload';

export const api = {
  async getHotels() {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch hotels: ${res.statusText}`);
    }
    return await res.json();
  },

  async getHotel(identifier) {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(identifier)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch hotel: ${res.statusText}`);
    }
    return await res.json();
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to upload image: ${res.statusText}`);
    }
    return await res.json();
  },

  async addHotel(hotelData) {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hotelData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to add hotel: ${res.statusText}`);
    }
    return await res.json();
  },

  async updateHotel(identifier, hotelData) {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(identifier)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hotelData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update hotel: ${res.statusText}`);
    }
    return await res.json();
  },

  async deleteHotel(identifier) {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(identifier)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to delete hotel: ${res.statusText}`);
    }
    return await res.json();
  },
};

export default api;
