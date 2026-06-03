import { Injectable, signal } from '@angular/core';
import { School } from '../../models/school.interface';
import { SCHOOLS_MOCK } from '../mocks/schools.mock';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private schoolsSignal = signal<School[]>(SCHOOLS_MOCK);
  
  schools = this.schoolsSignal.asReadonly();

  addSchool(school: Omit<School, 'id'>) {
    // Validation: Name must be unique
    const exists = this.schoolsSignal().some(s => s.nombre.toLowerCase() === school.nombre.toLowerCase());
    if (exists) {
      throw new Error('Ya existe una escuela con ese nombre.');
    }

    const newSchool: School = {
      ...school,
      id: Date.now().toString()
    };
    this.schoolsSignal.update(ss => [...ss, newSchool]);
  }

  updateSchool(id: string, updatedSchool: Partial<School>) {
    this.schoolsSignal.update(ss => 
      ss.map(s => s.id === id ? { ...s, ...updatedSchool } : s)
    );
  }

  toggleStatus(id: string) {
    this.schoolsSignal.update(ss => 
      ss.map(s => s.id === id 
        ? { ...s, status: s.status === 'activa' ? 'inactiva' : 'activa' } 
        : s
      )
    );
  }

  deleteSchool(id: string) {
    // In a real app, check for associated competitors here
    this.schoolsSignal.update(ss => ss.filter(s => s.id !== id));
  }
}
