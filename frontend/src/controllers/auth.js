import API from './axios.js'

export async function register(formData) {
    try {
        const response = await API.post('/auth/register ', formData);
        return response
    } catch (error) {
        throw error
    }
}

export async function login(formData) {
    try {
        const response = await API.post('/auth/login', formData);
        return response
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await API.post('/auth/logout');
        return response
    } catch (error) {
        throw error;
    }
}

export async function logoutAll() {
    try {
        const response = await API.post('/auth/logout-all');
        return response
    } catch (error) {
        throw error;
    }
}

export async function refresh() {
    try {
        const response = await API.post('/auth/refresh');
        return response
    } catch (error) {
        throw error;
    }
}