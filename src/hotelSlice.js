import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './api';


export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getHotels();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addHotelAsync = createAsyncThunk(
  'hotels/addHotelAsync',
  async (newHotel, { rejectWithValue }) => {
    try {
      return await api.addHotel(newHotel);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateHotelAsync = createAsyncThunk(
  'hotels/updateHotelAsync',
  async ({ identifier, data, oldName }, { rejectWithValue }) => {
    try {
      const updated = await api.updateHotel(identifier || oldName, data);
      return { updated, oldName };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteHotelAsync = createAsyncThunk(
  'hotels/deleteHotelAsync',
  async (identifier, { rejectWithValue }) => {
    try {
      await api.deleteHotel(identifier);
      return identifier;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  hotels: [],
  loading: false,
  error: null,
};

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setHotels: (state, action) => {
      state.hotels = action.payload;
    },
    deleteHotel: (state, action) => {
      const target = action.payload;
      state.hotels = state.hotels.filter(
        (hotel) => hotel.name !== target && hotel.id !== target
      );
    },
    updateHotel: (state, action) => {
      const index = state.hotels.findIndex(
        (hotel) =>
          hotel.name === action.payload.oldName ||
          hotel.id === action.payload.oldId
      );
      if (index !== -1) {
        state.hotels[index] = action.payload.updatedHotel;
      }
    },
    addHotel: (state, action) => {
      state.hotels.push(action.payload);
    },
  },
  extraReducers: (builder) => {
   
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addHotelAsync.fulfilled, (state, action) => {
        state.hotels.push(action.payload);
      })
      .addCase(addHotelAsync.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(updateHotelAsync.fulfilled, (state, action) => {
        const { updated, oldName } = action.payload;
        const index = state.hotels.findIndex(
          (h) => h.id === updated.id || h.name === oldName || h.name === updated.name
        );
        if (index !== -1) {
          state.hotels[index] = updated;
        }
      })
      .addCase(updateHotelAsync.rejected, (state, action) => {
        state.error = action.payload;
      });

    
    builder
      .addCase(deleteHotelAsync.fulfilled, (state, action) => {
        const target = action.payload;
        state.hotels = state.hotels.filter(
          (hotel) => hotel.name !== target && hotel.id !== target
        );
      })
      .addCase(deleteHotelAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setHotels, deleteHotel, updateHotel, addHotel } = hotelSlice.actions;
export default hotelSlice.reducer;