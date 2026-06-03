import { Injectable, signal } from '@angular/core';
import { GRADUATIONS_MOCK, CATEGORY_TEMPLATES_MOCK } from '../mocks/master-data.mock';
import { Graduation, CategoryTemplate } from '../../models/master-data.interface';
import { Category } from '../../models/competitor.interface';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  graduations = signal<Graduation[]>(GRADUATIONS_MOCK);
  categoryTemplates = signal<CategoryTemplate[]>(CATEGORY_TEMPLATES_MOCK);

  getGraduations(type?: 'GUP' | 'DAN') {
    return type ? this.graduations().filter(g => g.type === type) : this.graduations();
  }

  generateMockCategories(): Category[] {
    const categories: Category[] = [];
    this.categoryTemplates().slice(0, 10).forEach(template => { 
      template.pesos.forEach(peso => {
        categories.push({
          key: `${template.nombre} ${peso} ${template.genero}`,
          nombre: `${template.nombre} - ${peso}`,
          edad: template.edad,
          genero: template.genero,
          peso: peso,
          maxCompetidores: 16,
          status: 'activa',
          competitors: []
        });
      });
    });
    return categories;
  }

  updateWeights(nombre: string, genero: 'Masculino' | 'Femenino', pesos: string[]) {
    this.categoryTemplates.update(current => 
      current.map(t => (t.nombre === nombre && t.genero === genero) 
        ? { ...t, pesos } 
        : t
      )
    );
  }
}
