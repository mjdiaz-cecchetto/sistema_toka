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

  // Escuela seleccionada (por defecto la primera)
  private selectedSchoolId = signal<string>(this.schoolService.schools()[0]?.id ?? '');

  selectedSchool = computed(() =>
    this.schools().find(s => s.id === this.selectedSchoolId()) || null
  );

  // Instructores de la escuela seleccionada
  instructoresEscuela = computed(() =>
    this.selectedSchool()?.instructores ?? []
  );

  // Modalidades como signals individuales (checkboxes)
  modalidadLuchaIndividual = signal(false);
  modalidadLuchaEquipo = signal(false);
  modalidadTulIndividual = signal(false);
  modalidadTulEquipo = signal(false);

  noModalidadSeleccionada = computed(() =>
    !this.modalidadLuchaIndividual() &&
    !this.modalidadLuchaEquipo() &&
    !this.modalidadTulIndividual() &&
    !this.modalidadTulEquipo()
  );

  toggleModalidad(mod: 'luchaIndividual' | 'luchaEquipo' | 'tulIndividual' | 'tulEquipo') {
    switch (mod) {
      case 'luchaIndividual': this.modalidadLuchaIndividual.update(v => !v); break;
      case 'luchaEquipo': this.modalidadLuchaEquipo.update(v => !v); break;
      case 'tulIndividual': this.modalidadTulIndividual.update(v => !v); break;
      case 'tulEquipo': this.modalidadTulEquipo.update(v => !v); break;
    }
  }

  onSchoolChange(event: Event) {
    const id = (event.target as HTMLSelectElement).value;
    this.selectedSchoolId.set(id);
    // Reset instructor when school changes
    this.inscriptionForm.patchValue({ instructor: '' });
  }

  // Competitors added in this session
  sessionCompetitors = signal<any[]>([]);

  inscriptionForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    dni: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    sexo: ['Masculino', Validators.required],
    graduacion: ['10° Gup', Validators.required],
    instructor: ['', Validators.required],
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
    if (this.inscriptionForm.valid && !this.noModalidadSeleccionada()) {
      const val = this.inscriptionForm.value;
      const competitor = {
        ...val,
        escuela: this.selectedSchool()?.nombre ?? '',
        luchaIndividual: this.modalidadLuchaIndividual(),
        luchaEquipo: this.modalidadLuchaEquipo(),
        tulIndividual: this.modalidadTulIndividual(),
        tulEquipo: this.modalidadTulEquipo(),
      };

      this.sessionCompetitors.update(curr => [...curr, competitor]);

      this.inscriptionForm.reset({
        sexo: 'Masculino',
        graduacion: '10° Gup',
        instructor: '',
      });

      // Reset modalidades
      this.modalidadLuchaIndividual.set(false);
      this.modalidadLuchaEquipo.set(false);
      this.modalidadTulIndividual.set(false);
      this.modalidadTulEquipo.set(false);
    }
  }
}
