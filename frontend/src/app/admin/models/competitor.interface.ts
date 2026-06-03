export interface Competitor {
  id: number;
  nombre: string;
  dni: string;
  fechaNacimiento: string;
  edad: string;
  genero: string;
  peso: string;
  club: string;
  grado: string;
  telefono: string;
  email: string;
  observacionesMedicas?: string;
  catKey: string;
  ci: number; // For avatar color
}

export interface Category {
  key: string;
  nombre: string;
  edad: string;
  genero: string;
  peso: string;
  minGraduacion?: string;
  maxCompetidores: number;
  status: 'activa' | 'inactiva';
  competitors: Competitor[];
}
