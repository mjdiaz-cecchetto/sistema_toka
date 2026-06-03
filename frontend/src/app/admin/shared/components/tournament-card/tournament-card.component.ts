import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Tournament, TournamentStatus } from '../../../models/tournament.interface';

@Component({
  selector: 'app-tournament-card',
  standalone: true,
  imports: [],
  templateUrl: './tournament-card.component.html',
  styleUrl: './tournament-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentCardComponent {
  router = inject(Router);
  tournament = input.required<Tournament>();

  onManage() {
    this.router.navigate(['/torneo', this.tournament().id]);
  }

  getStatusLabel(status: TournamentStatus): string {
    const labels: Record<TournamentStatus, string> = {
      borrador: '● Borrador',
      inscripcion_abierta: '● Inscripción abierta',
      inscripcion_cerrada: '● Inscripción cerrada',
      en_curso: '● En curso',
      finalizado: '● Finalizado'
    };
    return labels[status];
  }
}
