import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard
{
  constructor(private router: Router) {
  }

  openPage(URI:string) {
    this.router.navigate(["/"+URI])
  }
}
