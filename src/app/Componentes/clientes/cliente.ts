import { Region } from '../regiones/region';
export class Cliente {

    constructor(
        public nombre?: string,
        public apellido?: string,
        public createAt?: string,
        public email?: string,
        public foto?: string,
        public region?: Region,
        
        public id?: number
    ){
    }
}
