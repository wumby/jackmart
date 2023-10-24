import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  slides = [
    {image: 'assets/images/h2r.png'},
    {image: 'assets/images/drz400.png'},
    {image: 'assets/images/r1.png'},
    {image: 'assets/images/ktm450smr.png'}
 ];
 noWrapSlides = false;
 showIndicator = false;

}
