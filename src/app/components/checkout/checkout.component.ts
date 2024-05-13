/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckoutFormService } from '../../services/checkout-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ECommerceValidators } from '../../validators/ecommerce-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { environment } from '../../../environments/environment.development';
import { PaymentInfo } from '../../common/payment-info';

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

  localStorage: Storage = localStorage;

  sessionStorage: Storage = sessionStorage;

  // initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private checkoutFormService: CheckoutFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) { }

  ngOnInit(): void {

    // setup Stripe payment form
    this.setupStripePaymentForm();

    this.reviewCartDetails();


    //read the user's email address from browser storage
    const theEmail = JSON.parse(this.sessionStorage.getItem('theEmail'));

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
        email: new FormControl(theEmail,
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
        /*
        cardType: new FormControl('',
          [Validators.required]),
        nameOnCard: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ECommerceValidators.notOnlyWhitespace]
        ),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],
        */
      })
    });
    /*
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
    */
    //populate countries
    this.checkoutFormService.getCountries().subscribe(
      data => {
        console.log(`Retrieved Countries: ${JSON.stringify(data)}`);
        this.countries = data;
      }
    )
  }
  setupStripePaymentForm() {

    //get a handle to stripe elemnts
    const elements = this.stripe.elements();
    //Create a card elements ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });
    //Add an instance of card UI components into the 'card-elemnts' div
    this.cardElement.mount("#card-element");
    // ADD event binding for the 'change' events on the card elemnt
    this.cardElement.on('change', (event: any) => {
      //get a handle to the card-error element
      this.displayError = document.getElementById('card-errors');
      if (event.compelete) {
        this.displayError.textContent = "";
      } else {
        //show the validation errors
        this.displayError.textContent = event.error.message;
      }
    })

  }
  reviewCartDetails() {
    //subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
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




  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      return;
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
    
    console.log(`The Shipping Address Country: ${this.checkoutFormGroup.get('shippingAddress')?.value.country.name}`);
    console.log(`The Shipping Address State: ${this.checkoutFormGroup.get('shippingAddress')?.value.state.name}`);
    
    /* set up order */
    const order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    
    /* get cart items */
    const cartItems = this.cartService.cartItems;
    
    /* create orderItems from cartItems */
    const orderItems: OrderItem[] = cartItems.map(tempItem => new OrderItem(tempItem));
    
    /* set up purchase */
    const purchse = new Purchase();
    
    /* populate purchase - customer */
    purchse.customer = this.checkoutFormGroup.controls['customer'].value;
    
    /* populate purchase - shipping adddress */
    purchse.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchse.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchse.shippingAddress.country));
    purchse.shippingAddress.state = shippingState.name;
    purchse.shippingAddress.country = shippingCountry.name;
    
    /* populate purchase - billing adddress */
    purchse.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchse.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchse.billingAddress.country));
    purchse.billingAddress.state = billingState.name;
    purchse.billingAddress.country = billingCountry.name;
    
    /* populate purchase - order & order items */
    purchse.order = order;
    purchse.orderItems = orderItems;
    
    //compute the payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "INR";
    this.paymentInfo.receiptEmail = purchse.customer.email;
    
    console.log(`The Payment Info Price: ${this.paymentInfo.amount}`);
    
    
    /** if valid form then
     * create payment intent
     * confirm card payment
     * place order
    */
   if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
     this.isDisabled = true;
     this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
       (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchse.customer.email,
                  name: `${purchse.customer.firstName} ${purchse.customer.lastName}`,
                  address: {
                    line1: purchse.billingAddress.street,
                    city: purchse.billingAddress.city,
                    state: purchse.billingAddress.state,
                    country: this.billingAddressCountry.value.code,
                    postal_code: purchse.billingAddress.zipCode
                  }
                }
              }
            }, { handleAction: false })
            .then((result: any) => {
              if (result.error) {
                //inform the customer of the error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                //call REST API via the checkout service
                this.checkoutService.placeOrder(purchse).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received \nOrder Tracking number: ${response.orderTrackingNumber}`)

                    //reset the cart
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  }
                })
              }
            });
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }


  }
  resetCart() {
    //reset the cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    //reset the form data
    this.checkoutFormGroup.reset();

    //navigate to main products page
    this.router.navigate(["/products"]);

  }

  handleMonthAndYears() {
    const creditCardFromGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();

    const selectedYear: number = Number(creditCardFromGroup?.value.expirationYear);

    // if the current year equal the selected currentYear, then start with the current month 

    const startMonth: number = currentYear === selectedYear ? new Date().getMonth() + 1 : 1;

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
