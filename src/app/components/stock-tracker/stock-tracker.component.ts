import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LOCAL_STORE_KEY } from '../../static_data/stock.constants';

@Component({
  styleUrls: ['./stock-tracker.component.css'],
  templateUrl: './stock-tracker.component.html',
})
export class StockTrackerComponent {
  textToUpperCase: string = '';

  //readonly - member accessed outside the class but value can't be changed
 activeStocks: string[] = JSON.parse(
    localStorage.getItem(LOCAL_STORE_KEY) || '[]'
  );
 formGroup = new FormGroup({
    // initialize stock code with FormControl and
    stockCode: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(5),
    ]),
  });

  constructor() {}

  //Entered Stock code in UpperCase
  changeToUpperCase(e) {
    if (!e) return;
    this.textToUpperCase = e.toUpperCase();
  }

  //onSubmit the Stock code
  onSubmit() {
    // this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      console.log('Invalid', '"' + this.formGroup.value + '"');
      return;
    }
    // check stock code already exist by indexOf
    const stockName = this.formGroup.value.stockCode;
    if (this.activeStocks.indexOf(stockName) > -1) {
      this.formGroup.reset();
      return;
    }
    // if not then adding in activeStocks array
    this.activeStocks.unshift(stockName);
    localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(this.activeStocks));

    // After storing in localstorage, reset the form
    this.formGroup.reset();
  }

  //Removing the stock from active stocks after close(X) button click passing through child component
  removeStock(idx: number) {
    this.activeStocks.splice(idx, 1);
    localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(this.activeStocks));
  }
}
