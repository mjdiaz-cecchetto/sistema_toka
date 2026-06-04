import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-open]': 'isOpen()'
  }
})
export class SidebarComponent {
  isOpen = input(false);
  close = output();
  navClick = output<string>();
}
