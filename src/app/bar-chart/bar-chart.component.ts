import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Country } from '../country.model';
import { CovidDataService } from '../covid-data.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})

export class BarChartComponent implements OnInit{

  cases : number[];
  dailycases : number[];
  deaths : number[];
  dailydeaths : number[];
  recovered : number[];
  dailyrecovered : number[];
  country: Country;

  barChartOptions: ChartOptions = { responsive: true, };
  barChartLabels: Label[] = ["data not loaded correctly (API error)"];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0], label: 'Daily Deaths' },
    { data: [0, 0, 0, 0, 0, 0], label: 'Daily Recovered' },
    { data: [0, 0, 0, 0, 0, 0], label: 'Daily New Cases' }
  ];

  constructor(private covidService: CovidDataService) {
    if(this.covidService.countryinfo != null){
      this.covidService.getDataFromCountry()
      .subscribe(data => { 
        this.country=data as Country;
        let conf = [];
        let dead = [];
        let rec = [];
        let labels = [];
        this.country.forEach((date,index) => {
          if((this.country.length - index)<= 8){
            conf.push(date["Confirmed"])
            dead.push(date["Deaths"])
            rec.push(date["Recovered"])
            labels.push(date["Date"].substring(2,10))
          }          
        });        
        this.cases=conf;
        this.deaths=dead;
        this.recovered=rec;
        this.barChartLabels=labels.slice(1,8);

        this.dailycases = this.cases.reduce((acc,item, index) => { 
          if (index === this.cases.length) { }
          else {
            acc.push(this.cases[index+1] - item);
          }
          return acc;
        } ,[]);      
        this.dailyrecovered = this.recovered.reduce((acc,item, index) => { 
          if (index === this.recovered.length) { }
          else {
            acc.push(this.recovered[index+1] - item);
          }
          return acc;
        } ,[]);
        this.dailydeaths = this.deaths.reduce((acc,item, index) => { 
          if (index === this.deaths.length) { }
          else {
            acc.push(this.deaths[index+1] - item);
          }
          return acc;
        } ,[]);

        this.barChartData = [
          { data: this.dailydeaths, label: 'Daily Deaths' },
          { data: this.dailyrecovered, label: 'Daily Recovered' },
          { data: this.dailycases, label: 'Daily New Cases' }
        ];
              
      });
    }
    else{
      this.covidService.getLastWeekData()
      .subscribe(data => { 
        this.cases=Object.values(data["cases"]);
        this.deaths=Object.values(data["deaths"]);
        this.recovered=Object.values(data["recovered"]);
        this.barChartLabels = Object.keys(data["cases"]).slice(1,8);

        this.dailycases = this.cases.reduce((acc,item, index) => { 
          if (index === this.cases.length) { }
          else {
            acc.push(this.cases[index+1] - item);
          }
          return acc;
        } ,[]);      
        this.dailyrecovered = this.recovered.reduce((acc,item, index) => { 
          if (index === this.recovered.length) { }
          else {
            acc.push(this.recovered[index+1] - item);
          }
          return acc;
        } ,[]);
        this.dailydeaths = this.deaths.reduce((acc,item, index) => { 
          if (index === this.deaths.length) { }
          else {
            acc.push(this.deaths[index+1] - item);
          }
          return acc;
        } ,[]);

        this.barChartData = [
          { data: this.dailydeaths, label: 'Daily Deaths' },
          { data: this.dailyrecovered, label: 'Daily Recovered' },
          { data: this.dailycases, label: 'Daily New Cases' }
        ];
        
      });
    } 
    
  }

  ngOnInit(): void {  }

}
