import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { BasketService } from 'src/app/basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { Basket } from 'src/app/shared/models/Basket';
import { Address } from 'src/app/shared/models/User';
import { NavigationExtras, Router } from '@angular/router';
import { Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, loadStripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { OrderToCreate } from 'src/app/shared/models/order';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent {
  @Input() checkoutForm?: FormGroup;
  @ViewChild('cardNumber') cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef;
  @ViewChild('cardCvc') cardCvcElement?: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardNumberComplete = false;
  cardExpiryComplete = false;
  cardCvcComplete = false;
  cardErrors: any;
  loading = false;
  

  constructor(private basketService: BasketService, private checkoutService: CheckoutService, private toastr: ToastrService, private router: Router){}

  ngOnInit(){
    loadStripe('pk_test_51O2zJ3EqmQ0fYc43UHEE8KMnGtWfBUt4b9mIKmaV34pQzSmPnUpcTHCTpz1SqKLWmI4A657t38abWH5csQBQc25x00jeOzypMH').then(
      stripe=>{
        this.stripe=stripe;
        const elements = stripe?.elements();
        if(elements){
          this.cardNumber=elements.create('cardNumber');
          this.cardNumber.mount(this.cardNumberElement?.nativeElement);
          this.cardNumber.on('change', event => {
            this.cardNumberComplete = event.complete;
            if(event.error) this.cardErrors = event.error.message;
            else this.cardErrors = null;
          })
          
          this.cardExpiry=elements.create('cardExpiry');
          this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
          this.cardExpiry.on('change', event => {
            this.cardExpiryComplete=event.complete;
            if(event.error) this.cardErrors = event.error.message;
            else this.cardErrors = null;
          })

          this.cardCvc=elements.create('cardCvc');
          this.cardCvc.mount(this.cardCvcElement?.nativeElement);
          this.cardCvc.on('change', event => {
            this.cardCvcComplete=event.complete;
            if(event.error) this.cardErrors = event.error.message;
            else this.cardErrors = null;
          })
        }
      }
    )
  }

  async submitOrder(){
    this.loading = true;
    const basket=this.basketService.getCurrentBasketValue();
    if(!basket) throw new Error('Cant get basket')
    try {
      const createdOrder= await this.createOrder(basket);
      const paymentResult = await this.confiirmPaymentWithStripe(basket);
      if(paymentResult.paymentIntent){
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = {state: createdOrder};
        this.router.navigate(['checkout/success'], navigationExtras )
      }else{
        this.toastr.error(paymentResult.error.message);
      }
    } catch (error: any) {
      this.toastr.error(error.message);
      
    }finally{
      this.loading=false;
    }
  }


  async confiirmPaymentWithStripe(basket: Basket | null) {
    if(!basket) throw new Error('Basket is null');
    const result = this.stripe?.confirmCardPayment(basket.clientSecret!,{
      payment_method:{
        card:this.cardNumber!,
        billing_details:{
          name:this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
        }
      }});
      if(!result) throw new Error('Problem attemptin payment with Stripe');
      return result;
  }


  async createOrder(basket: Basket | null) {
    if(!basket) throw new Error('Basket is null');
    const orderToCreate = this.getOrderToCreate(basket);
    return firstValueFrom( this.checkoutService.createOrder(orderToCreate));

  }
  
  getOrderToCreate(basket: Basket): OrderToCreate {
    const deliveryMethodId=this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress=this.checkoutForm?.get('addressForm')?.value as Address;
    if(!deliveryMethodId || !shipToAddress) throw new Error('Problem with basket');
    return{
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }

  get paymentFormComplete(){
    return this.checkoutForm?.get('paymentForm')?.valid 
    && this.cardNumberComplete 
    && this.cardExpiryComplete 
    && this.cardCvcComplete
  }

}
