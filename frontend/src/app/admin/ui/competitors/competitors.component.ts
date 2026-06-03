import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompetitorService } from '../../infrastructure/services/competitor.service';

@Component({
  selector: 'app-competitors',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './competitors.component.html',
  styleUrl: './competitors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitorsComponent {
  competitorService = inject(CompetitorService);
  fb = inject(FormBuilder);

  compForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    club: ['Dojang Central', Validators.required],
    edad: ['Senior (18+)', Validators.required],
    peso: ['-74 kg', Validators.required],
    genero: ['Masculino', Validators.required],
    grado: ['Amarillo', Validators.required]
  });

  onSubmit() {
    if (this.compForm.valid) {
      const val = this.compForm.getRawValue();
      this.competitorService.addCompetitor({
        ...val,
        ci: 0 // Will be set by service
      } as any);
      this.compForm.reset({
        nombre: '',
        club: 'Dojang Central',
        edad: 'Senior (18+)',
        peso: '-74 kg',
        genero: 'Masculino',
        grado: 'Amarillo'
      });
    }
  }

  loadDemo() {
    const demos = [
      { nombre: 'Juan Pérez', edad: 12, peso: 35, genero: 'M', belt: 'Blanco' },
      { nombre: 'María García', edad: 13, peso: 38, genero: 'F', belt: 'Amarillo' },
      { nombre: 'Carlos Ruiz', edad: 15, peso: 55, genero: 'M', belt: 'Verde' },
      { nombre: 'Lucía Meza', edad: 11, peso: 32, genero: 'F', belt: 'Blanco' },
      { nombre: 'Pedro Gómez', edad: 16, peso: 62, genero: 'M', belt: 'Azul' },
      { nombre: 'Ana López', edad: 14, peso: 45, genero: 'F', belt: 'Amarillo' },
      { nombre: 'Diego Sosa', edad: 15, peso: 58, genero: 'M', belt: 'Rojo' },
      { nombre: 'Sofía Díaz', edad: 12, peso: 34, genero: 'F', belt: 'Blanco' },
    ];
    demos.forEach(d => this.competitorService.addCompetitor(d as any));
  }

  getAvatarColor(name: string): string {
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }
}
