import { ChangeDetectionStrategy, Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompetitorService } from '../../infrastructure/services/competitor.service';

interface Matchup {
  a: string;
  b: string;
  mk: string;
  winner: string | null;
  ri: number;
  mi: number;
}

interface Round {
  matchups: Matchup[];
  label: string;
}

@Component({
  selector: 'app-bracket',
  standalone: true,
  imports: [],
  templateUrl: './bracket.component.html',
  styleUrl: './bracket.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BracketComponent {
  competitorService = inject(CompetitorService);
  route = inject(ActivatedRoute);

  activeCatKey = signal<string | null>(null);
  winners = signal<Record<string, Record<string, string>>>({}); // { catKey: { matchKey: winnerName } }

  currentCategory = computed(() => {
    const key = this.activeCatKey();
    return this.competitorService.categories().find(c => c.key === key) || null;
  });

  bracketRounds = computed(() => {
    const cat = this.currentCategory();
    if (!cat || cat.competitors.length < 2) return [];

    const catKey = cat.key;
    const fighters = cat.competitors.map(c => c.nombre);
    const size = Math.pow(2, Math.ceil(Math.log2(fighters.length)));
    const seeds = [...fighters];
    while (seeds.length < size) seeds.push('BYE');

    const catWinners = this.winners()[catKey] || {};
    const rounds: Round[] = [];
    let current = seeds;
    let ri = 0;

    while (current.length > 1) {
      const matchups: Matchup[] = [];
      for (let i = 0; i < current.length; i += 2) {
        const a = current[i], b = current[i + 1];
        const mk = `${catKey}_r${ri}_m${i / 2}`;
        let winner = catWinners[mk] || null;
        
        // Auto-winner for BYEs
        if (b === 'BYE' && !winner) {
          winner = a;
        }
        
        matchups.push({ a, b, mk, winner, ri, mi: i / 2 });
      }
      rounds.push({ matchups, label: this.getRoundLabel(current.length, ri === 0) });
      current = matchups.map(m => m.winner || '?');
      ri++;
    }

    return rounds;
  });

  champion = computed(() => {
    const rounds = this.bracketRounds();
    if (rounds.length === 0) return null;
    const lastRound = rounds[rounds.length - 1];
    const finalMatch = lastRound.matchups[0];
    return finalMatch.winner && finalMatch.winner !== '?' ? finalMatch.winner : null;
  });

  constructor() {
    // Sync active category from query params
    effect(() => {
      this.route.queryParams.subscribe(params => {
        if (params['category']) {
          this.activeCatKey.set(params['category']);
        } else if (!this.activeCatKey() && this.competitorService.categories().length > 0) {
          this.activeCatKey.set(this.competitorService.categories()[0].key);
        }
      });
    }, { allowSignalWrites: true });
  }

  pickWinner(mk: string, fighter: string) {
    if (fighter === '?') return;
    const catKey = this.activeCatKey();
    if (!catKey) return;

    this.winners.update(w => {
      const catW = { ...(w[catKey] || {}) };
      if (catW[mk] === fighter) {
        delete catW[mk];
        this.clearDown(catKey, mk, catW);
      } else {
        catW[mk] = fighter;
        this.clearDown(catKey, mk, catW);
      }
      return { ...w, [catKey]: catW };
    });
  }

  private clearDown(catKey: string, mk: string, catW: Record<string, string>) {
    const parts = mk.split('_');
    const rMatch = parts[parts.length - 2].match(/r(\d+)/);
    const mMatch = parts[parts.length - 1].match(/m(\d+)/);
    if (!rMatch || !mMatch) return;
    
    const r = parseInt(rMatch[1]);
    const m = parseInt(mMatch[1]);
    const nk = `${catKey}_r${r + 1}_m${Math.floor(m / 2)}`;
    
    if (catW[nk]) {
      delete catW[nk];
      this.clearDown(catKey, nk, catW);
    }
  }

  private getRoundLabel(n: number, isFirst: boolean): string {
    if (n === 2) return 'Final';
    if (n === 4) return 'Semifinal';
    if (n === 8) return 'Cuartos';
    return `Ronda de ${n}`;
  }
}
