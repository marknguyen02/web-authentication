import API from './axios.js'

export async function fetchUserInfo() {
    try {
        const response = await API.get('/user/info');
        return response
    } catch (error) {
        throw error
    }
}