import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { StockSentimentComponent } from './components/stock-sentiment/stock-sentiment.component';
import { StockTrackerComponent } from './components/stock-tracker/stock-tracker.component';

// Providing paths for sentiment with stock symbol and stock tracker components
const routes: Route[] = [
  { path: 'sentiment/:symbol', component: StockSentimentComponent },
  { path: '', component: StockTrackerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
