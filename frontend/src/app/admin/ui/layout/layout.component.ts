import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  host: {
    class: 'layout-host'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  themeService = inject(ThemeService); // Ensure ThemeService is instantiated here to apply theme on load
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }
}
