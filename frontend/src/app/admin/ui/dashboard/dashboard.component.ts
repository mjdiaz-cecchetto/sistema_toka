import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TournamentService } from '../../infrastructure/services/tournament.service';
import { TournamentCardComponent } from '../../shared/components/tournament-card/tournament-card.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { TournamentStatus } from '../../models/tournament.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TournamentCardComponent, ModalComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  tournamentService = inject(TournamentService);
  fb = inject(FormBuilder);

  isModalOpen = signal(false);

  tournamentForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    date: ['', Validators.required],
    place: ['', Validators.required],
    organizer: ['', Validators.required],
    description: ['', Validators.required],
    status: ['borrador' as TournamentStatus, Validators.required]
  });

  onCreateTournament() {
    if (this.tournamentForm.valid) {
      const val = this.tournamentForm.getRawValue();
      const covers = [
        { emoji: '🥋', cls: 'cover-1' },
        { emoji: '🎽', cls: 'cover-2' },
        { emoji: '⚡', cls: 'cover-3' }
      ];
      const selectedCover = covers[Math.floor(Math.random() * covers.length)];
      const logos = ['🏆', '🥇', '🎖️', '🏅'];
      const selectedLogo = logos[Math.floor(Math.random() * logos.length)];

      this.tournamentService.addTournament({
        ...val,
        competitorsCount: 0,
        categoriesCount: 0,
        coverEmoji: selectedCover.emoji,
        coverClass: selectedCover.cls,
        logoEmoji: selectedLogo
      });

      this.isModalOpen.set(false);
      this.tournamentForm.reset({
        name: '',
        date: '',
        place: '',
        organizer: '',
        description: '',
        status: 'borrador'
      });
    }
  }
}
