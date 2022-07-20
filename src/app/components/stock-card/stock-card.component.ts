import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StockService } from '../../_services/stock.service';
import { QuoteResponse, StockInfo } from '../../static_data/stock.constants';

@Component({
  selector: 'app-stock-card',
  styleUrls: ['./stock-card.component.css'],
  templateUrl: './stock-card.component.html',
})
export class StockCardComponent implements OnInit {
  @Input() stockCode: string;
  @Output() close = new EventEmitter();
  nameDisplay = '';
  errorMessage = '';

  // Quote information of each stock stored as BehaviorSubject for async behaviour
  quoteInfo$ = new BehaviorSubject<QuoteResponse | null>(null);

  //Loader variable for true false async calls
  loading$ = new BehaviorSubject<Boolean>(true);

  constructor(private stockService: StockService) {}

  ngOnInit() {
    // caling the Stock Info API for getting the data by passing stock code
    this.stockService.getStockInfo(this.stockCode).subscribe({
      next: (data: StockInfo) => {
        // Assign the stock name from API as description
        this.nameDisplay = data.symbolInfo.result.find(
          (res) => res.symbol === this.stockCode
        )?.description;
        // checking if passed stock code is not there
        if (!this.nameDisplay) {
          this.nameDisplay = `Can't find name.`;
        }
        // at last assigning the QuoteInfo data with received API Quote data
        this.quoteInfo$.next(data.quoteInfo);
      },
      // Handling the Errors if any issue with API request
      error: () => {
        this.errorMessage = `Something went wrong. Please try again. (${this.stockCode})`;
        this.loading$.next(false);
      },
      // finishing the request and loader would be false.
      complete: () => this.loading$.next(false),
    });
  }
  // Emmitting the value of close once user click in close(X) button as stock data would be removed in Parent compoennt array
  onClose() {
    this.close.emit();
  }
}
