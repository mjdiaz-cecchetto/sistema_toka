import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolService } from '../../infrastructure/services/school.service';
import { School } from '../../models/school.interface';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { MasterDataService } from '../../infrastructure/services/master-data.service';

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './schools.component.html',
  styleUrl: './schools.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolsComponent {
  schoolService = inject(SchoolService);
  masterData = inject(MasterDataService);
  fb = inject(FormBuilder);

  isModalOpen = signal(false);
  selectedSchool = signal<School | null>(null);
  schoolForm: FormGroup;

  constructor() {
    this.schoolForm = this.fb.group({
      nombre: ['', [Validators.required]],
      sigla: [''],
      status: ['activa'],
      instructor: this.fb.group({
        nombre: ['', [Validators.required]],
        dni: ['', [Validators.required]],
        graduacion: ['1° Dan', [Validators.required]],
        telefono: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]]
      }),
      ubicacion: this.fb.group({
        pais: ['Argentina', [Validators.required]],
        provincia: ['', [Validators.required]],
        ciudad: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        cp: ['']
      }),
      contacto: this.fb.group({
        telefono: ['', [Validators.required]],
        whatsapp: [''],
        email: ['', [Validators.required, Validators.email]],
        web: [''],
        facebook: [''],
        instagram: ['']
      })
    });
  }

  openCreateModal() {
    this.selectedSchool.set(null);
    this.schoolForm.reset({
      status: 'activa',
      ubicacion: { pais: 'Argentina' },
      instructor: { graduacion: '1° Dan' }
    });
    this.isModalOpen.set(true);
  }

  openEditModal(school: School) {
    this.selectedSchool.set(school);
    this.schoolForm.patchValue(school);
    this.isModalOpen.set(true);
  }

  toggleStatus(schoolId: string, event: Event) {
    event.stopPropagation();
    this.schoolService.toggleStatus(schoolId);
  }

  saveSchool() {
    if (this.schoolForm.invalid) {
      this.schoolForm.markAllAsTouched();
      return;
    }

    try {
      const schoolData = this.schoolForm.value;
      if (this.selectedSchool()) {
        this.schoolService.updateSchool(this.selectedSchool()!.id, schoolData);
      } else {
        this.schoolService.addSchool(schoolData);
      }
      this.isModalOpen.set(false);
    } catch (e: any) {
      alert(e.message);
    }
  }
}
