export interface Graduation {
  value: string;
  label: string;
  type: 'GUP' | 'DAN';
  order: number;
}

export interface CategoryTemplate {
  nombre: string;
  edad: string;
  genero: 'Masculino' | 'Femenino';
  tipo: 'GUP' | 'DAN';
  pesos: string[];
}
