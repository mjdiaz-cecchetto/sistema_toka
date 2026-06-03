import { School } from '../../models/school.interface';

export const SCHOOLS_MOCK: School[] = [
  {
    id: '1',
    nombre: 'Dojang Dragón Rojo',
    sigla: 'DDR',
    status: 'activa',
    instructor: {
      nombre: 'Juan Pérez',
      dni: '12345678',
      graduacion: '4° Dan',
      telefono: '385111222',
      email: 'juan.perez@dragonrojo.com'
    },
    ubicacion: {
      pais: 'Argentina',
      provincia: 'Santiago del Estero',
      ciudad: 'Capital',
      direccion: 'Av. Belgrano 123',
      cp: '4200'
    },
    contacto: {
      telefono: '385444555',
      whatsapp: '385444555',
      email: 'contacto@dragonrojo.com',
      instagram: '@dragonrojo_tkd'
    }
  },
  {
    id: '2',
    nombre: 'Academia Tigre Blanco',
    sigla: 'ATB',
    status: 'activa',
    instructor: {
      nombre: 'Ricardo Sosa',
      dni: '22334455',
      graduacion: '5° Dan',
      telefono: '385999888',
      email: 'rsosa@tigreblanco.com'
    },
    ubicacion: {
      pais: 'Argentina',
      provincia: 'Tucumán',
      ciudad: 'San Miguel',
      direccion: 'Calle 25 de Mayo 456'
    },
    contacto: {
      telefono: '381777888',
      email: 'info@tigreblanco.com'
    }
  }
];
