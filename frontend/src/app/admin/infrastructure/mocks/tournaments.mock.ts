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
    logoEmoji: '🏆'
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
    logoEmoji: '🥇'
  }
];
