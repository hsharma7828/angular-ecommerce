import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckoutFormService } from '../../services/checkout-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ECommerceValidators } from '../../validators/ecommerce-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

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
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ECommerceValidators.notOnlyWhitespace]
        ),
        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ECommerceValidators.notOnlyWhitespace]
        ),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ECommerceValidators.notOnlyWhitespace]
        ),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ECommerceValidators.notOnlyWhitespace]
        ),
        state: new FormControl('',
          [Validators.required]),
        country: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ECommerceValidators.notOnlyWhitespace]
        ),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ECommerceValidators.notOnlyWhitespace]
        ),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ECommerceValidators.notOnlyWhitespace]
        ),
        state: new FormControl('',
          [Validators.required]),
        country: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ECommerceValidators.notOnlyWhitespace]
        ),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',
        [Validators.required]),
        nameOnCard: new FormControl('',
        [Validators.required,
        Validators.minLength(2),
        ECommerceValidators.notOnlyWhitespace]
      ),
        cardNumber: new FormControl('', [Validators.required ,Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required ,Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],
      })
    });

    //Populate credit card months

    const startMonth: number = new Date().getMonth();
    console.log(`Start Month: ${startMonth}`);

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(`Retrieved Credit Card Months: ${JSON.stringify(data)}`);
        this.creditCardMonths = data;
      }
    );

    //Populate credit card years

    this.checkoutFormService.getCreditCardYear().subscribe(
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
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }


  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }


  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameonCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }




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

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);

    console.log(`The Shipping Address Country: ${this.checkoutFormGroup.get('shippingAddress')?.value.country.name}`);
    console.log(`The Shipping Address State: ${this.checkoutFormGroup.get('shippingAddress')?.value.state.name}`);

  }

  handleMonthAndYears() {
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
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressSates = data;
        } else {
          this.billingAddressSates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    )
  }

}
