import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'stockTracker';
  stockData$: Subscription
  stockData:[]; 
  // remove mock data array
  mockData :Istock[] = [{ "id": "694653", "t": "GOOG","e": "NASDAQ", "l": 581.84, "l_cur": 581.84,"s": 0,"ltt": 0,"lt": "Mar 30, 4:00PM EDT", "c": "+0.11", "cp": "0.02","ccol": "chg"   }
  ,{ "id": "694655", "t": "AAPL","e": "NASDAQ", "l": 1481.84, "l_cur": 581.84,"s": 0,"ltt": 0,"lt": "Mar 30, 4:00PM EDT", "c": "+0.11", "cp": "0.02","ccol": "chg"   }];
  public lineItemData = [];
  public lineChartLegend = false;
  public lineChartType = 'line';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor(private _http: HttpClient) { }
  ngOnInit() {
    this.stockData$ = of(this.mockData)
      .pipe(map(data=> this._setDataById(data)))
      .subscribe((data)=> this.stockData = data)
    // api not working
    // this._http.get('http://finance.google.com/finance/info?client=ig&q=NSE:RELIANCE,NSE:HDFC');
  }
  // helper function for render html 
   trackById(index: number, data: any): string {
    return data.id;
  }
  stockChecked(ev, stock:Istock){
    const date = new Date();
    stock['isChecked'] = ev.target.checked;    
    stock['ltt'] = ev.target.checked ? `${date.getHours()}: ${date.getMinutes()}  ` : 0;    
  }
  addMoreStock(){
    this.stockData.filter((el)=>el['isChecked']).forEach((el: Istock)=>{
      el.s = el.s+1;
      el.l_cur  = el.s + el.l;
      const stockPoint= [];
      for(var i = el.l;i <= el.l_cur;i++){
        stockPoint.push(i);
      }
      el.lineItemData  = [{ data: stockPoint, label: '' }];
    });    
    this.chart.update();
  }
  ngOnDestroy(){
    this.stockData$.unsubscribe()
  }
  // private method to set data by id
  private _setDataById(data){
    const newData = []
    for(const el of data){
      el.s = +el.s;
      el.l = +el.l;
      el.l_cur = +el.l_cur;
      el.ltt = 0;
      el.lineItemData  = [{ data: [0], label: '' }];
      newData[el.id] = el;
    }
    return data;
  }
}
// interface for stock
export interface Istock {  
  id: string, 
  t: string, 
  e: string, 
  l: number, 
  l_cur: number  | string, 
  s: number,
  ltt: number  | string, 
  lt: string, 
  c: string, 
  cp: string, 
  lineItemData?:any,
  ccol: string
};