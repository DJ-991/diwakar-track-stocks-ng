import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LOCAL_STORE_KEY } from '../../static_data/stock.constants';

@Component({
  styleUrls: ['./stock-tracker.component.css'],
  templateUrl: './stock-tracker.component.html',
})
export class StockTrackerComponent implements OnDestroy {
  private readonly formValChange$: Subscription;
  readonly activeStocks: string[] = JSON.parse(
    localStorage.getItem(LOCAL_STORE_KEY) || '[]'
  );
  readonly formGroup = new FormGroup({
    stockCode: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(5),
    ]),
  });

  textToUpperCase: string = '';

  // get fc() {
  //   return this.formGroup.get('stockCode');
  // }

  constructor() {
    // this.formValChange$ = this.fc.valueChanges.subscribe((val) => {
    //   console.log('val', val);
    //   if (!val) return;
    //   const updated = val.trim().toUpperCase();
    //   if (val !== updated) {
    //     this.fc.setValue(updated);
    //     this.fc.updateValueAndValidity();
    //   }
    // });
  }

  changeToUpperCase(e) {
    // const v= e.target.value;
    if (!e) return;
    //  if(v.trim().length()===0) return;
    //   this.textToUpperCase = v.trim().toUpperCase();
    // console.log("input value", e.target.value);
    this.textToUpperCase = e.toUpperCase();
    // if (!e) return;
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    console.log('this.formGroup.value', this.formGroup.value.stockCode);
    if (this.formGroup.invalid) {
      console.log('Invalid', '"' + this.formGroup.value + '"');
      return;
    }
    const stockName = this.formGroup.value.stockCode;
    if (this.activeStocks.indexOf(stockName) > -1) {
      this.formGroup.reset();
      return;
    }
    this.activeStocks.unshift(stockName);
    localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(this.activeStocks));
    this.formGroup.reset();
  }

  ngOnDestroy() {
    // this.formValChange$.unsubscribe();
  }

  removeStock(idx: number) {
    this.activeStocks.splice(idx, 1);
    localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(this.activeStocks));
  }
}
