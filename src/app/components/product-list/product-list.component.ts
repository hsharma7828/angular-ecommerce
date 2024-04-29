import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.listProducts();
    })
  }
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProduct();
    }
  }
  handleSearchProducts() {
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;

    // now search for the products using the keyword
    this.productService.serachProducts(theKeyWord).subscribe(data => {
        this.products = data;
      }
    );
  }

  handleListProduct() {
    /*check if "id" parameter avaialble*/
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    /*get the "id" param string. convert string to number using "+" sysmbol 
    else use "1" as default*/
    this.currentCategoryId = hasCategoryId ? +this.route.snapshot.paramMap.get('id')! : 1;

    this.productService.getProductList(this.currentCategoryId).subscribe(data => {
      this.products = data;
    });
  }

}
