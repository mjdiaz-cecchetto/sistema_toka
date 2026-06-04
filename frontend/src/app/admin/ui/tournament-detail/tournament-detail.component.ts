import { ChangeDetectionStrategy, Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { TournamentService } from '../../infrastructure/services/tournament.service';
import { SchoolService } from '../../infrastructure/services/school.service';
import { Tournament, TournamentStatus } from '../../models/tournament.interface';
import { Category } from '../../models/competitor.interface';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { CommonModule } from '@angular/common';

import { MasterDataService } from '../../infrastructure/services/master-data.service';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalComponent],
  templateUrl: './tournament-detail.component.html',
  styleUrl: './tournament-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentDetailComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  tournamentService = inject(TournamentService);
  schoolService = inject(SchoolService);
  masterData = inject(MasterDataService);
  fb = inject(FormBuilder);

  tournamentId = this.route.snapshot.params['id'];
  
  isNewTournament = computed(() => this.tournamentId === 'nuevo');

  tournament = computed(() => {
    if (this.isNewTournament()) {
      return {
        id: 'nuevo',
        name: 'Nuevo Torneo',
        date: '',
        place: '',
        organizer: '',
        description: 'Borrador de nuevo torneo.',
        status: 'borrador' as TournamentStatus,
        competitorsCount: 0,
        categoriesCount: 10,
        coverEmoji: '🥋',
        coverClass: 'cover-1',
        logoEmoji: '🏆',
        organizerSchoolId: '',
        modalities: ['lucha_individual', 'tul_individual'],
        excludedSchools: [],
        excludedCategories: [],
        registrationDeadline: '',
        maxCompetitors: 300,
        maxSpectators: 1000,
        numAreas: 2
      } as Tournament;
    }
    return this.tournamentService.tournaments().find(t => t.id === this.tournamentId) || null;
  });

  schools = this.schoolService.schools;

  // Active configuration section / Tab status
  activeTab = signal<'general' | 'modalidades' | 'escuelas' | 'categorias'>('general');

  // General configuration form
  editForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    date: ['', Validators.required],
    place: ['', Validators.required],
    organizer: ['', Validators.required],
    description: ['', Validators.required],
    organizerSchoolId: [''],
    logoEmoji: ['🏆', Validators.required],
    status: ['borrador' as TournamentStatus, Validators.required],
    registrationDeadline: [''],
    maxCompetitors: [300, [Validators.required, Validators.min(1)]],
    maxSpectators: [1000, [Validators.required, Validators.min(0)]],
    numAreas: [2, [Validators.required, Validators.min(1)]]
  });

  // Signals for dynamic configurations
  selectedModalities = signal<string[]>([]);
  excludedSchools = signal<string[]>([]);
  excludedCategories = signal<string[]>([]);

  // Category management
  isCategoryModalOpen = signal(false);
  tournamentCategories = signal<Category[]>(this.masterData.generateMockCategories());

  categoryForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    edad: ['Senior', Validators.required],
    genero: ['Masculino', Validators.required],
    peso: ['-63kg', Validators.required],
    minGraduacion: ['Amarillo'],
    maxCompetidores: [16, [Validators.required, Validators.min(2)]]
  });

  constructor() {
    effect(() => {
      const t = this.tournament();
      if (t) {
        this.editForm.patchValue({
          name: t.name === 'Nuevo Torneo' && this.isNewTournament() ? '' : t.name,
          date: t.date,
          place: t.place,
          organizer: t.organizer,
          description: t.description === 'Borrador de nuevo torneo.' && this.isNewTournament() ? '' : t.description,
          organizerSchoolId: t.organizerSchoolId || '',
          logoEmoji: t.logoEmoji || '🏆',
          status: t.status,
          registrationDeadline: t.registrationDeadline || '',
          maxCompetitors: t.maxCompetitors || 300,
          maxSpectators: t.maxSpectators || 1000,
          numAreas: t.numAreas || 2
        });
        this.selectedModalities.set(t.modalities || ['lucha_individual', 'tul_individual']);
        this.excludedSchools.set(t.excludedSchools || []);
        this.excludedCategories.set(t.excludedCategories || []);
      }
    }, { allowSignalWrites: true });
  }

  // Helper lists
  availableModalities = [
    { key: 'lucha_individual', label: 'Lucha Individual' },
    { key: 'tul_individual', label: 'Tul Individual' },
    { key: 'lucha_equipos', label: 'Lucha por Equipos' },
    { key: 'tul_equipos', label: 'Tul por Equipos' }
  ];

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

  // Toggles and settings modifications
  toggleModality(modalityKey: string) {
    this.selectedModalities.update(current => 
      current.includes(modalityKey)
        ? current.filter(m => m !== modalityKey)
        : [...current, modalityKey]
    );
    if (!this.isNewTournament()) {
      this.saveAllChanges();
    }
  }

  toggleSchoolExclusion(schoolId: string) {
    this.excludedSchools.update(current =>
      current.includes(schoolId)
        ? current.filter(id => id !== schoolId)
        : [...current, schoolId]
    );
    if (!this.isNewTournament()) {
      this.saveAllChanges();
    }
  }

  toggleCategoryExclusion(catKey: string) {
    this.excludedCategories.update(current =>
      current.includes(catKey)
        ? current.filter(key => key !== catKey)
        : [...current, catKey]
    );
    if (!this.isNewTournament()) {
      this.saveAllChanges();
    }
  }

  saveAllChanges() {
    if (this.editForm.valid) {
      const val = this.editForm.getRawValue();
      const updatedData = {
        ...val,
        modalities: this.selectedModalities(),
        excludedSchools: this.excludedSchools(),
        excludedCategories: this.excludedCategories()
      };

      if (this.isNewTournament()) {
        const covers = [
          { emoji: '🥋', cls: 'cover-1' },
          { emoji: '🎽', cls: 'cover-2' },
          { emoji: '⚡', cls: 'cover-3' }
        ];
        const selectedCover = covers[Math.floor(Math.random() * covers.length)];
        
        const newId = this.tournamentService.addTournament({
          ...updatedData,
          competitorsCount: 0,
          categoriesCount: this.tournamentCategories().length,
          coverEmoji: selectedCover.emoji,
          coverClass: selectedCover.cls
        });
        alert('¡Torneo creado con éxito!');
        this.router.navigate(['/torneo', newId]);
      } else if (this.tournamentId) {
        this.tournamentService.updateTournament(this.tournamentId, updatedData);
        alert('¡Cambios guardados con éxito!');
      }
    }
  }

  onCreateCategory() {
    if (this.categoryForm.valid) {
      const val = this.categoryForm.getRawValue();
      const newCat: Category = {
        key: `cat-${Date.now()}`,
        ...val,
        status: 'activa',
        competitors: []
      } as Category;
      
      this.tournamentCategories.update(current => [...current, newCat]);
      this.isCategoryModalOpen.set(false);
      this.categoryForm.reset();
    }
  }
}
