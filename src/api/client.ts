//Om den förra koden var en brevbärare, så är den här filen som att vi bygger ett eget postkontor 
// med speciella regler för hur brev ska skickas och tas emot.

//vi hämtar brevbäraren igen 
//och vår adressbok (constants). Den innehåller hemliga koder (tokens) och 
// den stora huvudadressen till servern.
import axios, { AxiosError } from "axios";
import { BASE_URL, REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

const AUTH0_ACCESS_TOKEN_KEY = 'auth0_access_token';

//Istället för att skriva hela adressen varje gång, skapar vi ett eget kontor som 
// redan vet vart det ska (BASE_URL). Det är som att ha en förvald destination på GPS:en.
const apiClient = axios.create({
  baseURL: BASE_URL,
});

//en kontrollant som står vi dörren och kollar alla request innan dom skickas iväg 
apiClient.interceptors.request.use(
  //inuti config står allt som brevbäraren behöver veta den skickas til servern 
  (config) => {
    const auth0Token = sessionStorage.getItem(AUTH0_ACCESS_TOKEN_KEY);
    if (auth0Token) {
      config.headers.Authorization = `Bearer ${auth0Token}`;
      return config;
    }

    //letar efter nyckeln som heter access_token i localstorage 
    const token = localStorage.getItem(ACCESS_TOKEN);
    //om token finns
    if (token) {
      //sätter kontrollanten ett klistemärke på den för att vi ska kunna bevisa 
      //att vi har tillåtelse för att komma in 
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//Här står en annan kontrollent som tar emot paketen som komemr tillbaka. 
apiClient.interceptors.response.use(
  //om paketet ser bar ut sickas den direkt till oss 
  (response) => response,
  //Om inste skickad en error 
  (error: AxiosError) => {
    //om det står 401 på paketet betyder det, du får inte komam in
    if (error.response?.status === 401) {
      //skickar reject 
      return Promise.reject(error);
    }

    //kolla efter reservnyckel i localstarage 
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    //om det inte finns rejecta 
    if (!refreshToken) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
