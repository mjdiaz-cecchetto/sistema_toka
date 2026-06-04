import { Tournament } from '../../models/tournament.interface';

export const TOURNAMENTS_MOCK: Tournament[] = [
  {
    id: '1',
    name: 'Torneo Regional NOA 2026',
    date: '2026-08-15',
    place: 'Polideportivo Municipal, Tucumán',
    organizer: 'Asociación Tucumana de Taekwondo',
    description: 'Competencia regional para todas las categorías G1.',
    status: 'inscripcion_abierta',
    competitorsCount: 125,
    categoriesCount: 18,
    coverEmoji: '🥋',
    coverClass: 'cover-1',
    logoEmoji: '🏆',
    organizerSchoolId: '1',
    modalities: ['lucha_individual', 'tul_individual'],
    maxCompetitors: 300,
    maxSpectators: 1000,
    numAreas: 4,
    registrationDeadline: '2026-08-10',
    excludedSchools: [],
    excludedCategories: []
  },
  {
    id: '2',
    name: 'Copa Santiago del Estero',
    date: '2025-11-20',
    place: 'Gimnasio Municipal, Stgo. del Estero',
    organizer: 'Federación Santiagueña',
    description: 'Torneo anual de fin de año.',
    status: 'borrador',
    competitorsCount: 0,
    categoriesCount: 0,
    coverEmoji: '🎽',
    coverClass: 'cover-2',
    logoEmoji: '🥇',
    organizerSchoolId: '2',
    modalities: ['lucha_individual', 'tul_individual', 'lucha_equipos', 'tul_equipos'],
    maxCompetitors: 150,
    maxSpectators: 500,
    numAreas: 2,
    registrationDeadline: '2025-11-15',
    excludedSchools: [],
    excludedCategories: []
  }
];
