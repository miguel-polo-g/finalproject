import { Component, } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Country } from '../country.model';
import { CovidDataService } from '../covid-data.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent {

  lineChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0], label: 'Total Deaths' },
    { data: [0, 0, 0, 0, 0, 0], label: 'Total Recovered' },
    { data: [0, 0, 0, 0, 0, 0], label: 'Total Cases' }
  ];

  lineChartLabels: Label[] = ["data not loaded correctly (API error)"];
  lineChartOptions = {  responsive: true, };
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  
  cases : number[];
  deaths : number[];
  recovered : number[];
  country: Country;

  constructor(private covidService: CovidDataService) {
    if(covidService.countryinfo != null){
      covidService.getDataFromCountry()
      .subscribe(data => { 
          this.country=data as Country;
          let conf = [];
          let dead = [];
          let rec = [];
          let labels = [];
          this.country.forEach(date => {
              conf.push(date["Confirmed"])
              dead.push(date["Deaths"])
              rec.push(date["Recovered"])
              labels.push(date["Date"].substring(2,10))
          });
          this.cases=conf;
          this.deaths=dead;
          this.recovered=rec;
          this.lineChartLabels =labels;

          this.lineChartData = [
            { data: this.deaths, label: 'Total Deaths' },
            { data: this.recovered, label: 'Total Recovered' },
            { data: this.cases, label: 'Total Cases' }
          ];
        }); 

    }
    else{
      this.covidService.getHistoricalData()
      .subscribe(data => { 
        this.cases=Object.values(data["cases"]);
        this.deaths=Object.values(data["deaths"]);
        this.recovered=Object.values(data["recovered"]);
        this.lineChartLabels = Object.keys(data["cases"]);

        this.lineChartData = [
          { data: this.deaths, label: 'Total Deaths' },
          { data: this.recovered, label: 'Total Recovered' },
          { data: this.cases, label: 'Total New Cases' }
        ];
      
      });
    } 
    
  }
  
}