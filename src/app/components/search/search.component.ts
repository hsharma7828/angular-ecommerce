/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit{

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }
  doSearch(value: string) {
    console.log('Value: ',value);
    this.router.navigateByUrl(`/search/${value}`);    
  }

}
