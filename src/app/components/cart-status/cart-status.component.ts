import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  
  constructor (
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.upDateCartStatus();
  }
  upDateCartStatus() {
    /*Subscribe to the cart Total Price */
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    /*Subscribe to the cart Total Quantity */
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
  }



}
