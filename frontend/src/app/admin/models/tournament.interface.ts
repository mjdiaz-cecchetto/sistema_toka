export type TournamentStatus = 'borrador' | 'inscripcion_abierta' | 'inscripcion_cerrada' | 'en_curso' | 'finalizado' | 'suspendido' | 'cancelado';

export interface Tournament {
  id: string;
  name: string;
  date: string;
  place: string;
  organizer: string;
  description: string;
  status: TournamentStatus;
  competitorsCount: number;
  categoriesCount: number;
  coverEmoji: string;
  coverClass: string;
  logoEmoji: string;
  
  // New management fields
  maxCompetitors?: number;
  maxSpectators?: number;
  numAreas?: number;

  organizerSchoolId?: string;
  logo?: string;
  modalities?: string[];
  excludedSchools?: string[];
  excludedCategories?: string[];
  registrationDeadline?: string;
}
