import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataService } from '../../infrastructure/services/master-data.service';
import { CategoryTemplate } from '../../models/master-data.interface';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent {
  masterData = inject(MasterDataService);
  
  searchText = signal('');
  isEditModalOpen = signal(false);
  selectedTemplate = signal<CategoryTemplate | null>(null);
  tempWeights = signal<string[]>([]);
  
  // Group templates by age group for better display
  categoriesByAge = computed(() => {
    const query = this.searchText().toLowerCase();
    const groups: Record<string, CategoryTemplate[]> = {};
    
    this.masterData.categoryTemplates().forEach(t => {
      if (query && !t.nombre.toLowerCase().includes(query) && !t.edad.toLowerCase().includes(query)) return;
      
      const gName = t.nombre.split(' ')[0]; // Infantil, Cadete, etc.
      if (!groups[gName]) groups[gName] = [];
      groups[gName].push(t);
    });
    return Object.entries(groups).map(([name, templates]) => ({ name, templates }));
  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
  }

  openEditWeights(template: CategoryTemplate) {
    this.selectedTemplate.set(template);
    // Strip ' kg' for easier editing
    this.tempWeights.set(template.pesos.map((w: string) => w.replace(' kg', '')));
    this.isEditModalOpen.set(true);
  }

  addWeight() {
    this.tempWeights.update(prev => [...prev, '']);
  }

  removeWeight(index: number) {
    this.tempWeights.update(prev => prev.filter((_, i) => i !== index));
  }

  updateWeight(index: number, value: string) {
    this.tempWeights.update(prev => prev.map((w, i) => i === index ? value : w));
  }

  saveWeights() {
    const template = this.selectedTemplate();
    if (template) {
      // Re-append ' kg' logic (only if not 'Sin división')
      const processedWeights = this.tempWeights().map(w => {
        const trimmed = w.trim();
        if (trimmed === '' || trimmed.toLowerCase() === 'sin división') return 'Sin división';
        return trimmed.toLowerCase().includes('kg') ? trimmed : `${trimmed} kg`;
      });
      this.masterData.updateWeights(template.nombre, template.genero, processedWeights);
      this.isEditModalOpen.set(false);
    }
  }

  // Helper to get weights for a specific template group (Male/Female pair)
  getWeightPairs(templates: CategoryTemplate[]) {
    const male = templates.find(t => t.genero === 'Masculino');
    const female = templates.find(t => t.genero === 'Femenino');
    
    const maxLen = Math.max(male?.pesos.length || 0, female?.pesos.length || 0);
    const rows = [];
    for (let i = 0; i < maxLen; i++) {
      rows.push({
        male: male?.pesos[i] || '-',
        female: female?.pesos[i] || '-'
      });
    }
    return rows;
  }
}
