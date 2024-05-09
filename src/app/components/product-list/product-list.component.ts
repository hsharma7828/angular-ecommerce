/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyWord: string = "";
  
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.listProducts();
    })
  }
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProduct();
    }
  }
  handleSearchProducts() {
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;
    /* if we have a different keyword than previous
    then set the thePageNumber to 1 */
    if (this.previousKeyWord !== theKeyWord) {
      this.thePageNumber = 1;
    }

    this.previousKeyWord = theKeyWord;

    console.log(`keyword=${theKeyWord}, thePageNumber=${this.thePageNumber}`);

    // now search for the products using the keyword
    this.productService.searchProductListPaginate(this.thePageNumber - 1, this.thePageSize, theKeyWord).subscribe(
      this.processResult()
    )
  }

  handleListProduct() {
    /*check if "id" parameter avaialble*/
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    /*get the "id" param string. convert string to number using "+" sysmbol 
    else use "1" as default*/
    this.currentCategoryId = hasCategoryId ? +this.route.snapshot.paramMap.get('id')! : 1;

    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    /*now get the products for the given category id */
    this.productService.getProductListPaginate(this.thePageNumber - 1, //decreased by 1 as in spring sequence start from '0'
      this.thePageSize,
      this.currentCategoryId
    ).subscribe(
      this.processResult()
    );
  }
  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
    }

}
