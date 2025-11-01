import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from "@angular/common";
import { Meteo } from "./meteo/meteo";

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    CommonModule,
    Meteo
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  constructor(private router: Router) {
  }

  openPage(URI: string) {
    this.router.navigate(["/" + URI])
  }
}
