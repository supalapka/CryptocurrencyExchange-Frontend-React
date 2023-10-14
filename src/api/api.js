import axios from "axios";

const jwt = localStorage.getItem('jwt');


const instance = axios.create({
    baseURL: 'https://localhost:44363/',
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });
  

  export const auth = {
    async login(email, password) {
        await instance.post(`login`, {
        "email": email,
        "password": password,
      }).then((response) => {
         if(response && response.data) {
         localStorage.setItem('jwt', JSON.stringify(response.data));
        instance.defaults.headers = {Authorization: `${response.data}`};
       }
      })
    },

    async register(email, password){
        const registerResponse = await instance.post(`register`, {
            email: email,
            password: password,
        });
        return registerResponse;
    }
  }