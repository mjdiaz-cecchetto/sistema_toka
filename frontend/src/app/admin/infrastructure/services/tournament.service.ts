import { Injectable, signal } from '@angular/core';
import { Tournament } from '../../models/tournament.interface';
import { TOURNAMENTS_MOCK } from '../mocks/tournaments.mock';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private tournamentsSignal = signal<Tournament[]>(TOURNAMENTS_MOCK);

  tournaments = this.tournamentsSignal.asReadonly();

  addTournament(tournament: Omit<Tournament, 'id'>) {
    const newTournament: Tournament = {
      ...tournament,
      id: Date.now().toString()
    };
    this.tournamentsSignal.update(ts => [...ts, newTournament]);
  }
}
