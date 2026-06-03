import { Graduation, CategoryTemplate } from '../../models/master-data.interface';

export const GRADUATIONS_MOCK: Graduation[] = [
  { value: '10G', label: '10° Gup - Blanco', type: 'GUP', order: 1 },
  { value: '9G', label: '9° Gup - Blanco Punta Amarilla', type: 'GUP', order: 2 },
  { value: '8G', label: '8° Gup - Amarillo', type: 'GUP', order: 3 },
  { value: '7G', label: '7° Gup - Amarillo Punta Verde', type: 'GUP', order: 4 },
  { value: '6G', label: '6° Gup - Verde', type: 'GUP', order: 5 },
  { value: '5G', label: '5° Gup - Verde Punta Azul', type: 'GUP', order: 6 },
  { value: '4G', label: '4° Gup - Azul', type: 'GUP', order: 7 },
  { value: '3G', label: '3° Gup - Azul Punta Roja', type: 'GUP', order: 8 },
  { value: '2G', label: '2° Gup - Rojo', type: 'GUP', order: 9 },
  { value: '1G', label: '1° Gup - Rojo Punta Negra', type: 'GUP', order: 10 },
  { value: '1D', label: '1° Dan', type: 'DAN', order: 11 },
  { value: '2D', label: '2° Dan', type: 'DAN', order: 12 },
  { value: '3D', label: '3° Dan', type: 'DAN', order: 13 },
  { value: '4D', label: '4° Dan', type: 'DAN', order: 14 },
  { value: '5D', label: '5° Dan', type: 'DAN', order: 15 },
  { value: '6D', label: '6° Dan', type: 'DAN', order: 16 },
  { value: '7D', label: '7° Dan', type: 'DAN', order: 17 },
  { value: '8D', label: '8° Dan', type: 'DAN', order: 18 },
  { value: '9D', label: '9° Dan', type: 'DAN', order: 19 },
];

export const CATEGORY_TEMPLATES_MOCK: CategoryTemplate[] = [
  // MASCULINO GUP
  { nombre: 'Infantil GUP', edad: 'Infantil', genero: 'Masculino', tipo: 'GUP', pesos: ['Sin división'] },
  { nombre: 'Cadete GUP', edad: 'Cadete (12-14)', genero: 'Masculino', tipo: 'GUP', pesos: ['-45 kg', '-50 kg', '-55 kg', '-60 kg', '-65 kg', '+65 kg'] },
  { nombre: 'Juvenil GUP', edad: 'Juvenil (15-17)', genero: 'Masculino', tipo: 'GUP', pesos: ['-51 kg', '-57 kg', '-63 kg', '-69 kg', '-75 kg', '+75 kg'] },
  { nombre: 'Adulto GUP', edad: 'Adulto (18-35)', genero: 'Masculino', tipo: 'GUP', pesos: ['-58 kg', '-63 kg', '-68 kg', '-74 kg', '-80 kg', '-87 kg', '+87 kg'] },
  { nombre: 'Veterano GUP', edad: 'Veterano (36+)', genero: 'Masculino', tipo: 'GUP', pesos: ['-64 kg', '-70 kg', '-76 kg', '-83 kg', '-90 kg', '+90 kg'] },
  // MASCULINO DAN
  { nombre: 'Cadete DAN', edad: 'Cadete (12-14)', genero: 'Masculino', tipo: 'DAN', pesos: ['-45 kg', '-50 kg', '-55 kg', '-60 kg', '-65 kg', '+65 kg'] },
  { nombre: 'Juvenil DAN', edad: 'Juvenil (15-17)', genero: 'Masculino', tipo: 'DAN', pesos: ['-51 kg', '-57 kg', '-63 kg', '-69 kg', '-75 kg', '+75 kg'] },
  { nombre: 'Adulto DAN', edad: 'Adulto (18-35)', genero: 'Masculino', tipo: 'DAN', pesos: ['-58 kg', '-63 kg', '-68 kg', '-74 kg', '-80 kg', '-87 kg', '+87 kg'] },
  { nombre: 'Veterano DAN', edad: 'Veterano (36+)', genero: 'Masculino', tipo: 'DAN', pesos: ['-64 kg', '-70 kg', '-76 kg', '-83 kg', '-90 kg', '+90 kg'] },
  // FEMENINO GUP
  { nombre: 'Infantil GUP', edad: 'Infantil', genero: 'Femenino', tipo: 'GUP', pesos: ['Sin división'] },
  { nombre: 'Cadete GUP', edad: 'Cadete (12-14)', genero: 'Femenino', tipo: 'GUP', pesos: ['-41 kg', '-44 kg', '-47 kg', '-51 kg', '-55 kg', '+55 kg'] },
  { nombre: 'Juvenil GUP', edad: 'Juvenil (15-17)', genero: 'Femenino', tipo: 'GUP', pesos: ['-46 kg', '-49 kg', '-52 kg', '-55 kg', '-59 kg', '-63 kg', '+63 kg'] },
  { nombre: 'Adulto GUP', edad: 'Adulto (18-35)', genero: 'Femenino', tipo: 'GUP', pesos: ['-49 kg', '-53 kg', '-57 kg', '-62 kg', '-67 kg', '-73 kg', '+73 kg'] },
  { nombre: 'Veterano GUP', edad: 'Veterano (36+)', genero: 'Femenino', tipo: 'GUP', pesos: ['-52 kg', '-57 kg', '-62 kg', '-67 kg', '-73 kg', '+73 kg'] },
  // FEMENINO DAN
  { nombre: 'Cadete DAN', edad: 'Cadete (12-14)', genero: 'Femenino', tipo: 'DAN', pesos: ['-41 kg', '-44 kg', '-47 kg', '-51 kg', '-55 kg', '+55 kg'] },
  { nombre: 'Juvenil DAN', edad: 'Juvenil (15-17)', genero: 'Femenino', tipo: 'DAN', pesos: ['-46 kg', '-49 kg', '-52 kg', '-55 kg', '-59 kg', '-63 kg', '+63 kg'] },
  { nombre: 'Adulto DAN', edad: 'Adulto (18-35)', genero: 'Femenino', tipo: 'DAN', pesos: ['-49 kg', '-53 kg', '-57 kg', '-62 kg', '-67 kg', '-73 kg', '+73 kg'] },
  { nombre: 'Veterano DAN', edad: 'Veterano (36+)', genero: 'Femenino', tipo: 'DAN', pesos: ['-52 kg', '-57 kg', '-62 kg', '-67 kg', '-73 kg', '+73 kg'] },
];
