export interface LoginResponse {
    userId: number;
    nome: string;
    cognome: string;
    email: string;
    username: string;
    ruolo: string;
    message: string;
    jwtToken: string;
    saldo: number;
    dataNascita: string;
    dataRegistrazione: string;
}