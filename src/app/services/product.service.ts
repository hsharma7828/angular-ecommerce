import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = environment.myCartUrl + "/products";
  private categoryUrl = environment.myCartUrl + "/product-category";

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {
    /* need to build URL based on category id ...*/
    const searchUrl = `${this.productsUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
  serachProducts(theKeyWord: string): Observable<Product[]> {
    /* need to build URL based on the keyword ...*/
    const searchUrl = `${this.productsUrl}/search/findByNameContaining?name=${theKeyWord}`;
    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProducdId: number): Observable<Product> {
    /* need to build URL based on product id ...*/
    const productUrl = `${this.productsUrl}/${theProducdId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number,
                        thePageSize: number,
                        theCategoryId: number): Observable<GetResponseProduct> {
    /* need to build URL based on category id , page and size */
    const searchUrl = `${this.productsUrl}/search/findByCategoryId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`;
                      
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }
  searchProductListPaginate(thePage: number,
    thePageSize: number,
    theKeyWord: string): Observable<GetResponseProduct> {
    /* need to build URL based on keyword , page and size */
    const searchUrl = `${this.productsUrl}/search/findByNameContaining?name=${theKeyWord}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }
}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
