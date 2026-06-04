import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { SchoolService } from '../../infrastructure/services/school.service';
import { School, Instructor } from '../../models/school.interface';
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
  logoPreview = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  searchTerm = signal('');

  filteredSchools = computed(() => {
    const schools = this.schoolService.schools();
    const term = this.searchTerm().toLowerCase();
    
    if (!term) return schools;
    
    return schools.filter(school => 
      school.nombre.toLowerCase().includes(term) ||
      school.sigla?.toLowerCase().includes(term) ||
      school.ubicacion.ciudad.toLowerCase().includes(term) ||
      school.ubicacion.provincia.toLowerCase().includes(term) ||
      school.instructores.some(inst => 
        inst.nombre.toLowerCase().includes(term)
      )
    );
  });
  
  schoolForm: FormGroup;

  constructor() {
    this.schoolForm = this.fb.group({
      nombre: ['', [Validators.required]],
      sigla: [''],
      logo: [''],
      status: ['activa'],
      instructores: this.fb.array([]),
      ubicacion: this.fb.group({
        pais: ['Argentina', [Validators.required]],
        provincia: ['', [Validators.required]],
        ciudad: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        cp: ['']
      }),
      contacto: this.fb.group({
        telefono: [''],
        whatsapp: ['', [Validators.required]],
        email: ['', [Validators.email]],
        web: [''],
        facebook: [''],
        instagram: ['']
      })
    });
  }

  get instructores() {
    return this.schoolForm.get('instructores') as FormArray;
  }

  createInstructorFormGroup(instructor?: Instructor): FormGroup {
    return this.fb.group({
      nombre: [instructor?.nombre || '', [Validators.required]],
      dni: [instructor?.dni || '', [Validators.required]],
      graduacion: [instructor?.graduacion || '1° Dan', [Validators.required]],
      rol: [instructor?.rol || 'Instructor', [Validators.required]],
      telefono: [instructor?.telefono || ''],
      email: [instructor?.email || '', [Validators.email]]
    });
  }

  addInstructor() {
    this.instructores.push(this.createInstructorFormGroup());
  }

  removeInstructor(index: number) {
    this.instructores.removeAt(index);
  }

  onLogoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.logoPreview.set(base64);
        this.schoolForm.get('logo')?.setValue(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  openCreateModal() {
    this.selectedSchool.set(null);
    this.logoPreview.set(null);
    this.errorMessage.set(null);
    this.schoolForm.reset({
      status: 'activa',
      ubicacion: { pais: 'Argentina' }
    });
    this.instructores.clear();
    this.addInstructor();
    this.isModalOpen.set(true);
  }

  openEditModal(school: School) {
    this.selectedSchool.set(school);
    this.logoPreview.set(school.logo || null);
    this.errorMessage.set(null);
    
    // Clear and fill instructores FormArray
    this.instructores.clear();
    if (school.instructores && school.instructores.length > 0) {
      school.instructores.forEach(inst => {
        this.instructores.push(this.createInstructorFormGroup(inst));
      });
    } else {
      this.addInstructor();
    }

    this.schoolForm.patchValue(school);
    this.isModalOpen.set(true);
  }

  toggleStatus(schoolId: string, event: Event) {
    event.stopPropagation();
    this.schoolService.toggleStatus(schoolId);
  }

  saveSchool() {
    this.errorMessage.set(null);

    if (this.schoolForm.invalid) {
      this.schoolForm.markAllAsTouched();
      this.errorMessage.set('Por favor, complete todos los campos requeridos marcados en rojo.');
      return;
    }

    if (this.instructores.length === 0) {
      this.errorMessage.set('Debe agregar al menos un instructor o maestro.');
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
      this.errorMessage.set(e.message);
    }
  }

  isControlInvalid(control: AbstractControl | null | undefined): boolean {
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  private getInvalidFields(form: FormGroup | FormArray): string[] {
    const invalid: string[] = [];
    const controls: any = (form instanceof FormGroup) ? form.controls : (form as FormArray).controls;
    
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control.invalid) {
        if (control instanceof FormGroup || control instanceof FormArray) {
          invalid.push(...this.getInvalidFields(control).map(childKey => `${key} -> ${childKey}`));
        } else {
          invalid.push(key);
        }
      }
    });
    return invalid;
  }
}
