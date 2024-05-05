import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    //build an array for "Month" drop down list
    // -start at current month & loop until 12 months

    for (let theMonth = startMonth; theMonth<= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }
  getCreditCardYear(): Observable<number[]> {
    let data: number[] = [];

    //build an array for "Year" drop down list
    // -start at current Year & loop until next 10 year
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear<= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}
