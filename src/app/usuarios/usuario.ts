export class Usuario {

    constructor(
       public username: string,
       public password: string,
       public nombre: string,
       public apellido: string,
       public email: string,
       public roles: string[] = [],
       public id?: number
    ){}
}