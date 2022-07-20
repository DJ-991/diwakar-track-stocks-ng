import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { StockService } from '../../services/stock.service';
import { MONTH_NAMES } from '../../static_data/stock.constants';

interface MonthData {
  name: string;
  change: number;
  mspr: number;
}

@Component({
  templateUrl: './stock-sentiment.component.html',
  styleUrls: ['./stock-sentiment.component.css'],
})
export class StockSentimentComponent {
  name = '';
  code = '';
  monthsData: MonthData[] = [];
  isLoading = true;

  constructor(activatedRoute: ActivatedRoute, stockService: StockService) {
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
        this.monthsData = data.sentimentInfo.data.map((item) => {
          return {
            name: MONTH_NAMES[item.month - 1],
            change: item.change,
            mspr: item.mspr,
          };
        });
      });
  }
}
