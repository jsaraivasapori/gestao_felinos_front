import { Component, OnInit } from '@angular/core';
import { ExpandableTableComponent } from '../../components/expandable-table/expandable-table.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { MatCardModule } from '@angular/material/card';
import { BooleanIconPipe } from '../../pipes/boolean-icon/boolean-icon.pipe';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FelinoService } from '../../services/felinoService/felino.service';
import { Observable } from 'rxjs';
import { Felino } from '../../models/felinoModel/felino-model';
@Component({
  selector: 'app-felinos',
  standalone: true,
  imports: [
    ExpandableTableComponent,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatCardModule,
    BooleanIconPipe,
    RouterOutlet,
  ],
  templateUrl: './felinos.component.html',
  styleUrl: './felinos.component.scss',
})
export class FelinosComponent implements OnInit {
  felinos$!: Observable<Felino[]>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private felinoService: FelinoService
  ) {}
  ngOnInit() {
    this.felinos$ = this.felinoService.felinos$;
    console.log(this.felinos$);
  }
  /**
   * Método getter para saber qual rota está.
   */
  get isFormRoute(): boolean {
    return this.router.url === '/home/felinos/form';
  }

  toEdit(data: Felino): void {
    this.sharedService.setData('currentFeline', data);
    console.log(data);

    this.router.navigate(['form'], { relativeTo: this.route });
  }

  toDelete(id: string) {
    this.felinoService.delete(id).subscribe();
  }

  addNewFeline(): void {
    this.sharedService.clearData('currentFeline');
    this.router.navigate(['form'], { relativeTo: this.route });
  }
}
