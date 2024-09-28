import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});