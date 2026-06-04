import { Injectable, signal } from '@angular/core';
import { Tournament } from '../../models/tournament.interface';
import { TOURNAMENTS_MOCK } from '../mocks/tournaments.mock';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private tournamentsSignal = signal<Tournament[]>(TOURNAMENTS_MOCK);

  tournaments = this.tournamentsSignal.asReadonly();

  addTournament(tournament: Omit<Tournament, 'id'>): string {
    const id = Date.now().toString();
    const newTournament: Tournament = {
      ...tournament,
      id
    };
    this.tournamentsSignal.update(ts => [...ts, newTournament]);
    return id;
  }

  updateTournament(id: string, updatedTournament: Partial<Tournament>) {
    this.tournamentsSignal.update(ts => 
      ts.map(t => t.id === id ? { ...t, ...updatedTournament } : t)
    );
  }
}
