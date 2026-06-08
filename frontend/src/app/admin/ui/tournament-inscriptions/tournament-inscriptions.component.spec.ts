import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentInscriptions } from './tournament-inscriptions';

describe('TournamentInscriptions', () => {
  let component: TournamentInscriptions;
  let fixture: ComponentFixture<TournamentInscriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentInscriptions],
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentInscriptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
