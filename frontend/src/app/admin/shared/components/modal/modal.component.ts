import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  isOpen = input.required<boolean>();
  title = input.required<string>();
  subtitle = input<string>('');
  submitLabel = input<string>('Confirmar');
  size = input<'md' | 'lg'>('md');
  
  close = output<void>();
  submit = output<void>();

  onOutsideClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
