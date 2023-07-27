import { Region } from './region';
export class Cliente {

    constructor(
        public nombre?: string,
        public apellido?: string,
        public createAt?: string,
        public email?: string,
        public foto?: string,
        public region?: string,
        
        public id?: number
    ){
    }
}
