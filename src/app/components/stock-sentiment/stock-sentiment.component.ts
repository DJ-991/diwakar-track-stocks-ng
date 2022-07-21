import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { StockService } from '../../_services/stock.service';
import { MONTH_NAMES } from '../../static_data/stock.constants';

interface MonthData {
  name: string;
  change: number;
  mspr: number;
  isDataAvail: boolean;
}

const curr_month = new Date().getMonth();

@Component({
  templateUrl: './stock-sentiment.component.html',
  styleUrls: ['./stock-sentiment.component.css'],
})
export class StockSentimentComponent {
  name = '';
  code = '';
  monthsData: MonthData[] = [
    {
      name: MONTH_NAMES[curr_month - 3],
      change: 0,
      mspr: 0,
      isDataAvail: false,
    },
    {
      name: MONTH_NAMES[curr_month - 2],
      change: 0,
      mspr: 0,
      isDataAvail: false,
    },
    {
      name: MONTH_NAMES[curr_month - 1],
      change: 0,
      mspr: 0,
      isDataAvail: false,
    },
  ];

  isLoading = true;

  constructor(activatedRoute: ActivatedRoute, stockService: StockService) {
    // getting the stock-symbol from routed URL
    activatedRoute.params
      .pipe(
        mergeMap((params) => {
          this.code = params.symbol;
          return stockService.getStockSentiment(this.code);
        })
      )
      .subscribe((data) => {
        this.isLoading = false;
        console.log('data', data);
        this.name = data.symbolInfo.result.find(
          (res) => res.symbol === this.code
        )?.description;
        // months data for each months
        this.monthsData.forEach((val, index) => {
          data.sentimentInfo.data.map((item) => {
            if (MONTH_NAMES[item.month - 1] == val.name) {
              this.monthsData[index] = {
                name: MONTH_NAMES[item.month - 1],
                change: item.change,
                mspr: item.mspr,
                isDataAvail: true,
              };
            }
          });
        });
      });
  }
}
