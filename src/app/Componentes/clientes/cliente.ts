export class Cliente {
    id?: number;
    nombre: string;
    apellido: string;
    createAt: string;
    email: string;
    foto: string;

    constructor(nombre: string, apellido: string, createAt: string, email: string, foto: string){
        this.nombre = nombre;
        this.apellido = apellido;
        this.createAt = createAt;
        this.email = email;
        this.foto = foto;
    }
}
