import React from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Post } from "../models/post";
import { toast } from "react-toastify";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/user";
import { history } from "../..";
import { Comment } from "../models/comment";
import { request } from "http";


const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers!.Authorization = `Bearer ${token}`
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(3000);
    return response;
}, (error: AxiosError) => {
    const { data, status, config} = error.response!;
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                history.push('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            if (status === 401 ) {
                store.userStore.logout();
                toast.error('Session expired - please login again');
            }
            break;
        case 404:
            history.push('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get : <T> (url: string) => axios.get<T>(url).then(responseBody),
    post : <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put : <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del : <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Posts = {
    list: () => requests.get<Post[]>('/posts'),
    details: (id: string) => requests.get<Post>(`/posts/${id}`),
    create: (post: Post) => axios.post<void>('/posts', post),
    update: (post: Post) => axios.put<void>(`/posts/${post.id}`, post),
    delete: (id: string) => axios.delete<void>(`/posts/${id}`)
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const Comments = {
    list: () => requests.get<Comment[]>('/comment'),
    create: (comment: Comment) => axios.post<void>(`/comment`, comment),
    update: (comment: Comment) => axios.put<void>(`/comment/${comment.id}`, comment),
    delete : (id: string) => axios.delete<void>(`/comment/${id}`)
}


const agent = {
    Posts,
    Account,
    Comments,
    
}

export default agent;