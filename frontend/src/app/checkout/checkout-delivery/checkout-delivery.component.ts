import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent {
  @Input() checkoutForm?: FormGroup;
  deliveryMethods: DeliveryMethod[] =[];

  ngOnInit(){
    this.checkoutService.getDeliveryMethods().subscribe({
      next: dm =>{
        this.deliveryMethods = dm;
      }
    })
  }
  constructor(private checkoutService: CheckoutService) {
    
  }

}
