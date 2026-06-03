import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { TournamentService } from '../../infrastructure/services/tournament.service';
import { CompetitorService } from '../../infrastructure/services/competitor.service';
import { Tournament, TournamentStatus } from '../../models/tournament.interface';
import { Category, Competitor } from '../../models/competitor.interface';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { CommonModule, TitleCasePipe } from '@angular/common';

import { MasterDataService } from '../../infrastructure/services/master-data.service';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalComponent, TitleCasePipe],
  templateUrl: './tournament-detail.component.html',
  styleUrl: './tournament-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentDetailComponent {
  route = inject(ActivatedRoute);
  tournamentService = inject(TournamentService);
  competitorService = inject(CompetitorService);
  masterData = inject(MasterDataService);
  fb = inject(FormBuilder);

  tournamentId = this.route.snapshot.params['id'];
  
  tournament = computed(() => 
    this.tournamentService.tournaments().find(t => t.id === this.tournamentId) || null
  );

  // Módulo 1: Configuración General
  generalConfig = {
    maxCompetitors: 300,
    maxSpectators: 1000,
    numAreas: 2
  };

  // Módulo 2: Gestión de Categorías
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

  // Módulo 3: Inscripción
  regForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    dni: ['', Validators.required],
    catKey: ['', Validators.required],
    grado: ['', Validators.required],
    club: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
  });

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

  saveGeneralConfig() {
    // In a real app, this would call tournamentService.updateTournament
    console.log('Saving config:', this.generalConfig);
    alert('¡Parámetros actualizados! Se han guardado los cupos y configuraciones del torneo.');
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

  onRegister() {
    if (this.regForm.valid) {
      const val = this.regForm.getRawValue();
      const categories = this.tournamentCategories();
      const cat = categories.find(c => c.key === val.catKey);
      
      // Check for duplicate DNI
      const isDuplicate = categories.some(c => c.competitors.some(comp => comp.dni === val.dni));
      if (isDuplicate) {
        alert('Error: Ya existe un competidor registrado con ese DNI.');
        return;
      }

      if (cat && cat.competitors.length < cat.maxCompetidores) {
        const newComp: Competitor = {
          id: Date.now(),
          nombre: val.nombre,
          dni: val.dni,
          grado: val.grado,
          club: val.club,
          email: val.email,
          telefono: val.telefono,
          catKey: val.catKey,
          edad: cat.edad,
          peso: cat.peso,
          genero: cat.genero,
          fechaNacimiento: '',
          ci: Math.floor(Math.random() * 6)
        } as Competitor;

        this.tournamentCategories.update(current => 
          current.map(c => c.key === val.catKey 
            ? { ...c, competitors: [...c.competitors, newComp] }
            : c
          )
        );

        this.regForm.reset();
        alert(`¡Inscripción exitosa! ${newComp.nombre} ha sido registrado en la categoría ${cat.nombre}.`);
      } else {
        alert('Error: La categoría ha alcanzado su cupo máximo.');
      }
    }
  }
}
