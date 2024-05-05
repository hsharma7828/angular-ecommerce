import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CheckoutFormService } from '../../services/checkout-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] =[];
  creditCardMonths: number[] =[];

  constructor(
    private formBuilder: FormBuilder,
    private checkoutFormService: CheckoutFormService
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      })
    });

    //Populate credit card months

    const startMonth:number = new Date().getMonth();
    console.log(`Start Month: ${startMonth}`);
    
    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe (      
      data => {
        console.log(`Retrieved Credit Card Months: ${JSON.stringify(data)}`);
        this.creditCardMonths = data;
      }
    )

    //Populate credit card years

    this.checkoutFormService.getCreditCardYear().subscribe (      
      data => {
        console.log(`Retrieved Credit Card Years: ${JSON.stringify(data)}`);
        this.creditCardYears = data;
      }
    )
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  onSubmit() {
    console.log("Handlind the Form Submission:  ");
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

}
