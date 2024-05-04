import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-deatils',
  templateUrl: './cart-deatils.component.html',
  styleUrl: './cart-deatils.component.css'
})
export class CartDeatilsComponent implements OnInit{

  cartItem: CartItem[] = [];

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    //get a handle to the cart Items
    this.cartItem = this.cartService.cartItems;
    //subscriv=be to cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    //subscribe to cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
    //compute cart total price & Quantity
    this.cartService.computeCartTotals();
  }
  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
    }
    incrementQuantity(theCartItem: CartItem) {
      this.cartService.addToCart(theCartItem);
    }
    remove(theCartItem: CartItem) {
      this.cartService.remove(theCartItem);
      }
}
