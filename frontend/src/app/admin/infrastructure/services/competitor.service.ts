import { Injectable, signal, computed } from '@angular/core';
import { Competitor, Category } from '../../models/competitor.interface';
import { DEMO_COMPETITORS_MOCK } from '../mocks/competitors.mock';

@Injectable({
  providedIn: 'root'
})
export class CompetitorService {
  private competitorsSignal = signal<Competitor[]>([]);

  competitors = this.competitorsSignal.asReadonly();

  categories = computed(() => {
    const cats: Record<string, Category> = {};
    this.competitorsSignal().forEach(c => {
      if (!cats[c.catKey]) {
        cats[c.catKey] = {
          key: c.catKey,
          nombre: `Categoría ${c.catKey}`,
          edad: c.edad,
          peso: c.peso,
          genero: c.genero,
          maxCompetidores: 16,
          status: 'activa',
          competitors: []
        };
      }
      cats[c.catKey].competitors.push(c);
    });
    return Object.values(cats);
  });

  addCompetitor(competitor: Omit<Competitor, 'id' | 'catKey' | 'ci'>) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const catKey = `${competitor.edad} ${competitor.peso} ${competitor.genero}`;
    const ci = this.competitorsSignal().length % 6;
    
    const newCompetitor: Competitor = {
      ...competitor,
      id,
      catKey,
      ci
    } as Competitor;
    
    this.competitorsSignal.update(cs => [...cs, newCompetitor]);
  }

  removeCompetitor(id: number) {
    this.competitorsSignal.update(cs => cs.filter(c => c.id !== id));
  }

  clear() {
    this.competitorsSignal.set([]);
  }

  loadDemo() {
    DEMO_COMPETITORS_MOCK.forEach(d => this.addCompetitor(d));
  }
}
