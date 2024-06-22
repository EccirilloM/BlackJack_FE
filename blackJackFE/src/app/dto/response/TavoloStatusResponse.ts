import { CartaResponse } from "./CartaResponse";

export interface TavoloStatusResponse {
    cartePlayer: CartaResponse[];
    punteggioPlayer: number;
    carteDealer: CartaResponse[];
    punteggioDealer: number;
    tavoloStatus: string;
    saldo: number;
    winning: number;
}