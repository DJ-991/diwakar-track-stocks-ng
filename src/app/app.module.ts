import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Reactive-Forms Module
import { ReactiveFormsModule } from '@angular/forms';

// Http-Client Module
import { HttpClientModule } from '@angular/common/http';

// Routing Module
import { AppRoutingModule } from './app-routing.module';

// All Components
import { AppComponent } from './app.component';
import { StockCardComponent } from './components/stock-card/stock-card.component';
import { StockTrackerComponent } from './components/stock-tracker/stock-tracker.component';
import { StockSentimentComponent } from './components/stock-sentiment/stock-sentiment.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    StockCardComponent,
    StockTrackerComponent,
    StockSentimentComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
