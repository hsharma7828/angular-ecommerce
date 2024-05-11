/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);


  // storage: Storage = sessionStorage;
  storage: Storage = localStorage;

  constructor() { 
    //read the data from the storage
    const data = JSON.parse(this.storage.getItem('cartItems'));

    if(data != null) {
      this.cartItems = data;

      // compute total based on data read from storage

      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    /* check if we already have item in the cart*/

    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem;

    if(this.cartItems.length > 0) {
      /*find the item in the cart based on item id  */
     existingCartItem = this.cartItems.find((item) => 
        item.id === theCartItem.id
      )!;
      /*check if we found it*/
      alreadyExistInCart = (existingCartItem != undefined);
    }
    if(alreadyExistInCart) {
      existingCartItem!.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }
    
    /*compute total price & total quantity */
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    this.cartItems.forEach(item => {
      totalPriceValue += item.quantity * item.unitPrice;
      totalQuantityValue += item.quantity;
    });

    //publish the new values .... all subscriber will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data 
    this.logCartData(totalPriceValue, totalQuantityValue);

    //persist the cart data
    this.persistCartItems();
  }
  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    this.cartItems.forEach(item => {
      const subTotal = item.quantity * item.unitPrice;
      console.log(`Name: ${item.name}, Quantity: ${item.quantity}, Unit Price: ${item.unitPrice}, Quantity: ${item.quantity}`);
    })
    console.log(`Total Quantity: ${totalQuantityValue}, Total Price: ${totalPriceValue.toFixed(2)}`);
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    /*get the index from the array  */
    const itemIndex = this.cartItems.findIndex(item => item.id === theCartItem.id);

    /*if found the item, then remove from the array */

    if(itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}
