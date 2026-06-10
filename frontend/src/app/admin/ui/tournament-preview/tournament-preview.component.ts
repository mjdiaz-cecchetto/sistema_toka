import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TournamentService } from '../../infrastructure/services/tournament.service';
import { MasterDataService } from '../../infrastructure/services/master-data.service';
import { TournamentStatus } from '../../models/tournament.interface';

export interface MockCompetitor {
  id: number;
  nombre: string;
  club: string;
  edad: string;
  genero: 'Masculino' | 'Femenino';
  grado: string;
  dni: string;
  categoriaInscripta: string;
  pesoRegistrado: number | null;
  categoriaConfirmada: string | null;
  isWeighedIn: boolean;
}

@Component({
  selector: 'app-tournament-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tournament-preview.component.html',
  styleUrl: './tournament-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentPreviewComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  tournamentService = inject(TournamentService);
  masterData = inject(MasterDataService);

  tournamentId = this.route.snapshot.params['id'];
  searchQuery = signal<string>('');
  selectedCompetitor = signal<MockCompetitor | null>(null);
  weightInput = signal<number | null>(null);

  tournament = computed(() => {
    return this.tournamentService.tournaments().find(t => t.id === this.tournamentId) || null;
  });

  // Mock list matching the user request
  competitors = signal<MockCompetitor[]>([
    {
      id: 1,
      nombre: 'Carlos Méndez',
      club: 'Dojang Norte',
      edad: 'Senior (18+)',
      genero: 'Masculino',
      grado: 'Negro 1er Dan',
      dni: '12345678',
      categoriaInscripta: '-74 kg',
      pesoRegistrado: 73.2,
      categoriaConfirmada: '-74 kg',
      isWeighedIn: true
    },
    {
      id: 2,
      nombre: 'Diego Ramírez',
      club: 'Club Olimpia',
      edad: 'Senior (18+)',
      genero: 'Masculino',
      grado: 'Rojo',
      dni: '87654321',
      categoriaInscripta: '-74 kg',
      pesoRegistrado: null,
      categoriaConfirmada: null,
      isWeighedIn: false
    },
    {
      id: 3,
      nombre: 'Martín López',
      club: 'Dojang Centro',
      edad: 'Senior (18+)',
      genero: 'Masculino',
      grado: 'Negro 2do Dan',
      dni: '11223344',
      categoriaInscripta: '-74 kg',
      pesoRegistrado: null,
      categoriaConfirmada: null,
      isWeighedIn: false
    },
    {
      id: 4,
      nombre: 'Pablo Torres',
      club: 'Academia TKD',
      edad: 'Senior (18+)',
      genero: 'Masculino',
      grado: 'Negro 1er Dan',
      dni: '44332211',
      categoriaInscripta: '-74 kg',
      pesoRegistrado: null,
      categoriaConfirmada: null,
      isWeighedIn: false
    },
    {
      id: 5,
      nombre: 'Ana Gutiérrez',
      club: 'Dojang Norte',
      edad: 'Junior (15-17)',
      genero: 'Femenino',
      grado: 'Negro 1er Dan',
      dni: '55667788',
      categoriaInscripta: '-58 kg',
      pesoRegistrado: 57.4,
      categoriaConfirmada: '-58 kg',
      isWeighedIn: true
    },
    {
      id: 6,
      nombre: 'Lucía Fernández',
      club: 'Club Olimpia',
      edad: 'Junior (15-17)',
      genero: 'Femenino',
      grado: 'Rojo',
      dni: '88776655',
      categoriaInscripta: '-58 kg',
      pesoRegistrado: null,
      categoriaConfirmada: null,
      isWeighedIn: false
    },
    {
      id: 7,
      nombre: 'Valeria Sosa',
      club: 'Dojang Centro',
      edad: 'Junior (15-17)',
      genero: 'Femenino',
      grado: 'Rojo',
      dni: '99887766',
      categoriaInscripta: '-58 kg',
      pesoRegistrado: null,
      categoriaConfirmada: null,
      isWeighedIn: false
    }
  ]);

  filteredCompetitors = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    return this.competitors().filter(c => 
      c.nombre.toLowerCase().includes(query) || 
      c.club.toLowerCase().includes(query) ||
      c.dni.includes(query)
    );
  });

  // Normalize age group naming to match categories templates
  normalizeAgeGroup(compEdad: string): string {
    const clean = compEdad.toLowerCase();
    if (clean.includes('junior') || clean.includes('juvenil') || clean.includes('15-17')) {
      return 'Juvenil (15-17)';
    }
    if (clean.includes('senior') || clean.includes('adulto') || clean.includes('18+')) {
      return 'Adulto (18-35)';
    }
    if (clean.includes('cadete') || clean.includes('12-14')) {
      return 'Cadete (12-14)';
    }
    if (clean.includes('infantil')) {
      return 'Infantil';
    }
    if (clean.includes('veterano') || clean.includes('36+')) {
      return 'Veterano (36+)';
    }
    return compEdad;
  }

  // Lookup weights categories from MasterDataService templates dynamically
  getWeightsForCompetitor(comp: MockCompetitor): { label: string; limit: number }[] {
    const normalizedAge = this.normalizeAgeGroup(comp.edad);
    const templates = this.masterData.categoryTemplates();
    
    // Determine type: DAN or GUP based on competitor's belt/grade
    const isDan = comp.grado.toLowerCase().includes('dan') || comp.grado.toLowerCase().includes('negro');
    const type = isDan ? 'DAN' : 'GUP';
    
    const template = templates.find(t => 
      t.genero === comp.genero && 
      this.normalizeAgeGroup(t.edad) === normalizedAge &&
      t.tipo === type
    );

    if (!template) {
      // Fallback
      return [
        { label: comp.categoriaInscripta, limit: this.getLimitFromLabel(comp.categoriaInscripta) }
      ];
    }

    return template.pesos.map(p => {
      return {
        label: p,
        limit: this.getLimitFromLabel(p)
      };
    });
  }

  confirmedCategoryInfo = computed(() => {
    const comp = this.selectedCompetitor();
    if (!comp) return null;
    
    const weight = this.weightInput();
    if (weight === null || weight === undefined || isNaN(weight) || weight <= 0) {
      return {
        label: comp.categoriaInscripta,
        limit: this.getLimitFromLabel(comp.categoriaInscripta),
        isConfirmed: false,
        isWithinLimit: false,
        originalLabel: comp.categoriaInscripta
      };
    }

    const classes = this.getWeightsForCompetitor(comp);
    
    // Find the first class that is >= weight
    let confirmedClass = classes.find(c => weight <= c.limit);
    if (!confirmedClass && classes.length > 0) {
      confirmedClass = classes[classes.length - 1]; // Fallback to last class
    }

    const label = confirmedClass ? confirmedClass.label : comp.categoriaInscripta;
    let limit = confirmedClass ? confirmedClass.limit : this.getLimitFromLabel(comp.categoriaInscripta);
    
    if (limit === 999) {
      const clean = label.replace(/[^\d.]/g, '');
      const val = parseFloat(clean);
      limit = isNaN(val) ? 100 : val + 15; // show a +15kg padding for + categories on the slider
    }

    // Check if within the ORIGINAL inscribed limit
    const originalLimit = this.getLimitFromLabel(comp.categoriaInscripta);
    const isWithinOriginalLimit = weight <= originalLimit;
    
    return {
      label,
      limit,
      isConfirmed: true,
      isWithinLimit: isWithinOriginalLimit,
      originalLabel: comp.categoriaInscripta
    };
  });

  selectCompetitor(comp: MockCompetitor) {
    this.selectedCompetitor.set(comp);
    this.weightInput.set(comp.pesoRegistrado);
  }

  getLimitFromLabel(label: string): number {
    const clean = label.replace(/[^\d.]/g, '');
    const val = parseFloat(clean);
    if (isNaN(val)) return 999;
    if (label.includes('+')) return 999;
    return val;
  }

  confirmWeighIn() {
    const comp = this.selectedCompetitor();
    const info = this.confirmedCategoryInfo();
    const weight = this.weightInput();
    if (!comp || !info || weight === null || weight === undefined) return;

    this.competitors.update(list => 
      list.map(c => c.id === comp.id ? {
        ...c,
        pesoRegistrado: weight,
        categoriaConfirmada: info.label,
        isWeighedIn: true
      } : c)
    );

    // Update the selected competitor with latest changes
    const updatedComp = this.competitors().find(c => c.id === comp.id) || null;
    this.selectedCompetitor.set(updatedComp);
  }

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
}
