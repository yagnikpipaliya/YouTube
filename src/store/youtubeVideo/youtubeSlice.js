import axios from "axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const getMenuCategories = createAsyncThunk("youtube/getMenuCategories", async (_,{rejectWithValue}) => {
  try {
    const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=IN&key=AIzaSyB79puPe_UudQLK9LkiToyuGEhf9UZdS8c`);
    return response.data.items;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const youtubeSlice = createSlice({
  name: "youtube",
  initialState: {
    loading: false,
    error: null,
    categoryId: 0,
    categories: [],
    selectedVideo: null,
  },
  reducers: {
    setCategoryId(state, action) {
      state.categoryId = action.payload;
    },
    setSelectedVideo: (state, action) => {
      state.selectedVideo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenuCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenuCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload; // Populate categories
      })
      .addCase(getMenuCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // state.error = action.error.message;
      });
  },
});

// Correct the export of actions
export const { setCategoryId, setSelectedVideo } = youtubeSlice.actions;

export default youtubeSlice.reducer;
