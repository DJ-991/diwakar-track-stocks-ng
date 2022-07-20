import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  FINNHUB_TOKEN,
  QuoteResponse,
  QUOTE_URL,
  SENTIMENT_URL,
  StockInfo,
  StockSentiment,
  SentimentInfo,
  SymbolSearchResponse,
  SYMBOL_SEARCH_URL,
} from '../static_data/stock.constants';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  //1. handling the errors while fetching the data
  errorHandler = (error) => {
    console.log('Error in service', error);
    return throwError(() => error);
  };

  constructor(private readonly httpClient: HttpClient) {}

  //2. Getting the stock information for given stock code
  getStockInfo(code: string): Observable<StockInfo> {
    const quoteRequest = this.httpClient
      .get<QuoteResponse>(QUOTE_URL, {
        params: {
          token: FINNHUB_TOKEN,
          symbol: code,
        },
      })
      .pipe(catchError(this.errorHandler));
    const symbolRequest = this.httpClient
      .get<SymbolSearchResponse>(SYMBOL_SEARCH_URL, {
        params: {
          token: FINNHUB_TOKEN,
          q: code,
        },
      })
      .pipe(catchError(this.errorHandler));
    return forkJoin({ quoteInfo: quoteRequest, symbolInfo: symbolRequest });
  }

  //3. Getting the insider-sentiment data for each stock code
  getStockSentiment(code: string): Observable<StockSentiment> {
    const date = new Date();

    // Setting the from_Date
    const from = new Date(date.getFullYear(), date.getMonth() - 3, 2)
      .toISOString()
      .slice(0, 10); //last 3rd month first date

    // Setting the to_Date
    const to = new Date(date.getFullYear(), date.getMonth())
      .toISOString()
      .slice(0, 10); //last month last date

    // Calling API
    const sentimentRequest = this.httpClient
      .get<SentimentInfo>(SENTIMENT_URL, {
        params: {
          symbol: code,
          from,
          to,
          token: FINNHUB_TOKEN,
        },
      })
      .pipe(catchError(this.errorHandler));
    const symbolRequest = this.httpClient
      .get<SymbolSearchResponse>(SYMBOL_SEARCH_URL, {
        params: {
          token: FINNHUB_TOKEN,
          q: code,
        },
      })
      .pipe(catchError(this.errorHandler));
    return forkJoin({
      symbolInfo: symbolRequest,
      sentimentInfo: sentimentRequest,
    });
  }
}
