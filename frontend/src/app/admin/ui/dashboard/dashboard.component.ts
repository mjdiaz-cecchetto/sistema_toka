import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TournamentService } from '../../infrastructure/services/tournament.service';
import { TournamentCardComponent } from '../../shared/components/tournament-card/tournament-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TournamentCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  tournamentService = inject(TournamentService);
  router = inject(Router);

  onCreateTournament() {
    this.router.navigate(['/torneo', 'nuevo']);
  }
}
