export interface School {
  id: string;
  nombre: string;
  sigla?: string;
  logo?: string;
  status: 'activa' | 'inactiva';
  
  instructor: {
    nombre: string;
    dni: string;
    graduacion: string;
    telefono: string;
    email: string;
  };
  
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
