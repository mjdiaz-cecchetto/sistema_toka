export interface Instructor {
  nombre: string;
  dni: string;
  graduacion: string;
  rol: 'Maestro' | 'Instructor';
  telefono: string;
  email: string;
}

export interface School {
  id: string;
  nombre: string;
  sigla?: string;
  logo?: string;
  status: 'activa' | 'inactiva';
  
  instructores: Instructor[];
  
  ubicacion: {
    pais: string;
    provincia: string;
    ciudad: string;
    direccion: string;
    cp?: string;
  };
  
  contacto: {
    telefono: string;
    whatsapp?: string;
    email: string;
    web?: string;
    facebook?: string;
    instagram?: string;
  };
}
