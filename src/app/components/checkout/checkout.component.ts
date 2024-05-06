import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CheckoutFormService } from '../../services/checkout-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

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

  countries: Country[] = [];
  shippingAddressSates: State[] = [];
  billingAddressSates: State[] = [];

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
    );

    //Populate credit card years

    this.checkoutFormService.getCreditCardYear().subscribe (      
      data => {
        console.log(`Retrieved Credit Card Years: ${JSON.stringify(data)}`);
        this.creditCardYears = data;
      }
    );

    //populate countries
    this.checkoutFormService.getCountries().subscribe(
      data => {
        console.log(`Retrieved Countries: ${JSON.stringify(data)}`);
        this.countries = data;
      }
    )
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      this.billingAddressSates = this.shippingAddressSates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressSates = [];
    }
  }

  onSubmit() {
    console.log("Handlind the Form Submission:  ");
    console.log(this.checkoutFormGroup.get('customer')?.value);

    console.log(`The Shipping Address COuntry: ${this.checkoutFormGroup.get('shippingAddress')?.value.country.name}`);
    console.log(`The Shipping Address State: ${this.checkoutFormGroup.get('shippingAddress')?.value.state.name}`);
    
  }

  handleMonthAndYears()  {
    const creditCardFromGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();

    const selectedYear: number = Number(creditCardFromGroup?.value.expirationYear);

    // if the current year equal the selected currentYear, then start with the current month 

    let startMonth: number;
    startMonth = currentYear === selectedYear ? new Date().getMonth() + 1 : 1;

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(`Retrieved Credit Card Months: ${JSON.stringify(data)}`);
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    console.log(`Country Code ${JSON.stringify(countryCode)}`);
    console.log(`Country Name ${JSON.stringify(countryName)}`);

    this.checkoutFormService.getStates(countryCode).subscribe(
      data => {
        if( formGroupName === 'shippingAddress') {
          this.shippingAddressSates = data;
        } else {
          this.billingAddressSates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    )
    }

}
