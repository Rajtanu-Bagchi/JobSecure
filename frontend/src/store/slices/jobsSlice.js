import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

const initialState = {
  jobs: [],
  job: null,
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  filters: {
    category: '',
    paymentType: '',
    verifiedOnly: false,
    escrowEnabled: false,
    search: '',
  },
};

// Get all jobs with pagination and filters
export const getJobs = createAsyncThunk(
  'jobs/getAll',
  async (params, thunkAPI) => {
    try {
      const { page = 1, limit = 10, ...filters } = params || {};
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();
      
      const response = await api.get(`/jobs?${queryParams}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch jobs';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get job by ID
export const getJobById = createAsyncThunk(
  'jobs/getById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch job details';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create a new job
export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData, thunkAPI) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create job';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Apply for a job
export const applyForJob = createAsyncThunk(
  'jobs/apply',
  async ({ jobId, applicationData }, thunkAPI) => {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to apply for job';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Report a job or employer
export const reportJob = createAsyncThunk(
  'jobs/report',
  async ({ jobId, reportData }, thunkAPI) => {
    try {
      const response = await api.post(`/jobs/${jobId}/report`, reportData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to submit report';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.currentPage = 1; // Reset to first page when filters change
    },
    clearJobDetail: (state) => {
      state.job = null;
    },
    resetJobsState: (state) => {
      state.jobs = [];
      state.job = null;
      state.isLoading = false;
      state.error = null;
      state.totalPages = 1;
      state.currentPage = 1;
      state.filters = {
        category: '',
        paymentType: '',
        verifiedOnly: false,
        escrowEnabled: false,
        search: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all jobs cases
      .addCase(getJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get job by ID cases
      .addCase(getJobById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.job = action.payload;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create job cases
      .addCase(createJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs.unshift(action.payload); // Add new job to the beginning of the list
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Apply for job cases
      .addCase(applyForJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyForJob.fulfilled, (state) => {
        state.isLoading = false;
        // Update UI state if needed
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Report job cases
      .addCase(reportJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reportJob.fulfilled, (state) => {
        state.isLoading = false;
        // Update UI state if needed
      })
      .addCase(reportJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearJobDetail, resetJobsState } = jobsSlice.actions;
export default jobsSlice.reducer;
