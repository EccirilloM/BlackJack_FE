import { Ruolo } from "src/app/types/ruolo";

export interface GetUserDataResponse {
    userId: number;
    nome: string;
    cognome: string;
    email: string;
    username: string;
    ruolo: Ruolo;
    dataNascita: Date;
    dataRegistrazione: Date;
    saldo: number;
}