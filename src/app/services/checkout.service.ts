import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

    private purchaseUrl = environment.myCartUrl + '/checkout/purchase';

  constructor(
    private httpClient: HttpClient
  ) { }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
