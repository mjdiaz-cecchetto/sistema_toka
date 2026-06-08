import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../infrastructure/services/tournament.service';
import { CompetitorService } from '../../infrastructure/services/competitor.service';
import { SchoolService } from '../../infrastructure/services/school.service';
import { TournamentStatus } from '../../models/tournament.interface';

@Component({
  selector: 'app-tournament-inscriptions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tournament-inscriptions.component.html',
  styleUrl: './tournament-inscriptions.component.scss',
})
export class TournamentInscriptionsComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  tournamentService = inject(TournamentService);
  competitorService = inject(CompetitorService);
  schoolService = inject(SchoolService);
  fb = inject(FormBuilder);

  tournamentId = this.route.snapshot.params['id'];

  tournament = computed(() => {
    return this.tournamentService.tournaments().find(t => t.id === this.tournamentId) || null;
  });

  schools = this.schoolService.schools;

  // We can filter competitors registered for THIS tournament if we had a tournamentId on the competitor. 
  // Currently Competitor model doesn't have tournamentId, but since it's a demo, we show the global competitors or local ones.
  // We'll keep a local signal for competitors added in this session for this tournament for display purposes.
  sessionCompetitors = signal<any[]>([]);

  inscriptionForm = this.fb.group({
    nombre: ['', Validators.required],
    dni: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    edad: ['Senior', Validators.required],
    genero: ['Masculino', Validators.required],
    peso: ['-63kg', Validators.required],
    club: ['', Validators.required],
    grado: ['Amarillo', Validators.required],
    telefono: [''],
    email: ['']
  });

  getStatusLabel(status: TournamentStatus): string {
    const labels: Record<TournamentStatus, string> = {
      borrador: '● Borrador',
      inscripcion_abierta: '● Inscripción Abierta',
      inscripcion_cerrada: '● Inscripción Cerrada',
      en_curso: '● En Curso',
      finalizado: '● Finalizado',
      suspendido: '● Suspendido',
      cancelado: '● Cancelado'
    };
    return labels[status];
  }

  goBack() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.inscriptionForm.valid) {
      const val = this.inscriptionForm.value;
      this.competitorService.addCompetitor(val as any);
      
      this.sessionCompetitors.update(curr => [...curr, val]);
      
      this.inscriptionForm.reset({
        edad: 'Senior',
        genero: 'Masculino',
        peso: '-63kg',
        grado: 'Amarillo',
        club: val.club || ''
      });
      alert('¡Competidor inscripto con éxito!');
    }
  }
}
