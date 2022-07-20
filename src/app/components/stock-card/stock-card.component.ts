import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StockService } from '../../services/stock.service';
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
  quoteInfo$ = new BehaviorSubject<QuoteResponse | null>(null);
  loading$ = new BehaviorSubject<Boolean>(true);

  constructor(private readonly stockService: StockService) {}

  ngOnInit() {
    this.stockService.getStockInfo(this.stockCode).subscribe({
      next: (data: StockInfo) => {
        this.nameDisplay = data.symbolInfo.result.find(
          (res) => res.symbol === this.stockCode
        )?.description;
        if (!this.nameDisplay) {
          this.nameDisplay = `Can't find name.`;
        }
        this.quoteInfo$.next(data.quoteInfo);
      },
      error: () => {
        this.errorMessage = `Something went wrong. Please try again. (${this.stockCode})`;
        this.loading$.next(false);
      },
      complete: () => this.loading$.next(false),
    });
  }

  onClose() {
    this.close.emit();
  }
}
