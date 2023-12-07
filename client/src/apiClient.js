import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
});

export const createRoom = async (data) => {
    try {
        const response = await axiosInstance.post('/rooms', {
            hostName: data.hostName,
          });
        return response;
    } catch (error) {
        console.error('Error',error);
    }

  };