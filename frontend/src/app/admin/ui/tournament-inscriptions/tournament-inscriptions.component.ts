import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../infrastructure/services/tournament.service';
import { CompetitorService } from '../../infrastructure/services/competitor.service';
import { SchoolService } from '../../infrastructure/services/school.service';
import { TournamentStatus } from '../../models/tournament.interface';

// Mock competitors for demo purposes
const MOCK_COMPETITORS = [
  {
    nombre: 'Juan',
    apellido: 'Pérez',
    dni: '12345678',
    fechaNacimiento: '1990-02-14',
    sexo: 'Masculino',
    graduacion: '1° Dan',
    instructor: 'Maestro Kim',
    escuela: 'Escuela Central',
    luchaIndividual: true,
    luchaEquipo: false,
    tulIndividual: false,
    tulEquipo: false,
    peso: '',
  },
  {
    nombre: 'Ana',
    apellido: 'García',
    dni: '87654321',
    fechaNacimiento: '1995-07-30',
    sexo: 'Femenino',
    graduacion: '3° Gup',
    instructor: 'Maestro Lee',
    escuela: 'Escuela Norte',
    luchaIndividual: false,
    luchaEquipo: true,
    tulIndividual: true,
    tulEquipo: false,
    peso: '',
  },
];

@Component({
  selector: 'app-tournament-inscriptions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tournament-inscriptions.component.html',
  styleUrl: './tournament-inscriptions.component.scss',
})
export class TournamentInscriptionsComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  tournamentService = inject(TournamentService);
  competitorService = inject(CompetitorService);
  schoolService = inject(SchoolService);
  fb = inject(FormBuilder);

  ngOnInit() {
    // Load mock competitors for demonstration
    this.sessionCompetitors.set([...MOCK_COMPETITORS]);
  }

  tournamentId = this.route.snapshot.params['id'];

  tournament = computed(() => {
    return this.tournamentService.tournaments().find((t) => t.id === this.tournamentId) || null;
  });

  schools = this.schoolService.schools;

  // Escuela seleccionada (por defecto la primera)
  private selectedSchoolId = signal<string>(this.schoolService.schools()[0]?.id ?? '');

  selectedSchool = computed(
    () => this.schools().find((s) => s.id === this.selectedSchoolId()) || null,
  );

  // Instructores de la escuela seleccionada
  instructoresEscuela = computed(() => this.selectedSchool()?.instructores ?? []);

  // Modalidades como signals individuales (checkboxes)
  modalidadLuchaIndividual = signal(false);
  modalidadLuchaEquipo = signal(false);
  modalidadTulIndividual = signal(false);
  modalidadTulEquipo = signal(false);

  noModalidadSeleccionada = computed(
    () =>
      !this.modalidadLuchaIndividual() &&
      !this.modalidadLuchaEquipo() &&
      !this.modalidadTulIndividual() &&
      !this.modalidadTulEquipo(),
  );

  toggleModalidad(mod: 'luchaIndividual' | 'luchaEquipo' | 'tulIndividual' | 'tulEquipo') {
    switch (mod) {
      case 'luchaIndividual':
        this.modalidadLuchaIndividual.update((v) => !v);
        break;
      case 'luchaEquipo':
        this.modalidadLuchaEquipo.update((v) => !v);
        break;
      case 'tulIndividual':
        this.modalidadTulIndividual.update((v) => !v);
        break;
      case 'tulEquipo':
        this.modalidadTulEquipo.update((v) => !v);
        break;
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
      cancelado: '● Cancelado',
    };
    return labels[status];
  }

  // SEARCH
  searchTerm = signal('');

  // FILTERED LIST based on search
  filteredCompetitors = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.sessionCompetitors();
    return this.sessionCompetitors().filter(
      (c) =>
        `${c.nombre} ${c.apellido}`.toLowerCase().includes(term) ||
        c.dni.toLowerCase().includes(term),
    );
  });

  // MODAL STATE
  selectedCompetitor = signal<any | null>(null);
  peso = signal(''); // weight input for modal

  openCompetitor(comp: any) {
    this.selectedCompetitor.set(comp);
    this.peso.set(comp.peso ?? '');
  }

  closeModal() {
    this.selectedCompetitor.set(null);
    this.peso.set('');
  }

  saveWeight() {
    const comp = this.selectedCompetitor();
    if (comp) {
      comp.peso = this.peso();
    }
    this.closeModal();
  }

  onSubmit() {
    if (this.inscriptionForm.valid && !this.noModalidadSeleccionada()) {
      const newCompetitor = {
        ...this.inscriptionForm.value,
        escuela: this.selectedSchool()?.nombre,
        luchaIndividual: this.modalidadLuchaIndividual(),
        luchaEquipo: this.modalidadLuchaEquipo(),
        tulIndividual: this.modalidadTulIndividual(),
        tulEquipo: this.modalidadTulEquipo(),
        peso: '',
      };
      this.sessionCompetitors.update((c) => [...c, newCompetitor]);
      this.inscriptionForm.reset({ sexo: 'Masculino', graduacion: '10° Gup' });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
