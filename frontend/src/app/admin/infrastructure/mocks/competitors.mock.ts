import { Competitor } from '../../models/competitor.interface';

export const DEMO_COMPETITORS_MOCK: Omit<Competitor, 'id' | 'catKey' | 'ci'>[] = [
  {
    nombre:'Carlos Méndez',  club:'Dojang Norte',  edad:'Senior', peso:'-74 kg', grado:'Negro 1er Dan', genero:'Masculino',
    dni: '12345678', fechaNacimiento: '1995-05-10', telefono: '385123456', email: 'carlos@demo.com'
  },
  {
    nombre:'Diego Ramírez',  club:'Club Olimpia',  edad:'Senior', peso:'-74 kg', grado:'Rojo', genero:'Masculino',
    dni: '87654321', fechaNacimiento: '1996-08-20', telefono: '385654321', email: 'diego@demo.com'
  },
  {
    nombre:'Martín López',   club:'Dojang Centro', edad:'Senior', peso:'-74 kg', grado:'Negro 2do Dan', genero:'Masculino',
    dni: '11223344', fechaNacimiento: '1994-03-15', telefono: '385994433', email: 'martin@demo.com'
  },
  {
    nombre:'Pablo Torres',   club:'Academia TKD',  edad:'Senior', peso:'-74 kg', grado:'Negro 1er Dan', genero:'Masculino',
    dni: '44332211', fechaNacimiento: '1997-11-25', telefono: '385773322', email: 'pablo@demo.com'
  },
  {
    nombre:'Ana Gutiérrez',  club:'Dojang Norte',  edad:'Juvenil', peso:'-58 kg', grado:'Negro 1er Dan', genero:'Femenino',
    dni: '55667788', fechaNacimiento: '2008-01-12', telefono: '385556677', email: 'ana@demo.com'
  },
  {
    nombre:'Lucía Fernández',club:'Club Olimpia',  edad:'Juvenil', peso:'-58 kg', grado:'Rojo', genero:'Femenino',
    dni: '88776655', fechaNacimiento: '2009-04-05', telefono: '385887766', email: 'lucia@demo.com'
  },
];
