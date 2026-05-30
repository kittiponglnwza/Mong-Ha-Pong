import axios from 'axios'

const api = axios.create({
  baseURL: 'https://mong-ha-pong.onrender.com', 
})

export const submitResult = (data) => api.post('/results/', data)
export const getLeaderboard = (limit = 10) => api.get(`/leaderboard/?limit=${limit}`)