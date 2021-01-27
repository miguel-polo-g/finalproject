import { Component } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { CovidDataService } from '../covid-data.service';
import { Summary } from '../summary.model';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})

export class PieChartComponent {

  summary : Summary;

  public pieChartOptions: ChartOptions = {  responsive: true, };
  public pieChartLabels: Label[] = ['Dead', 'Recovered', 'Active'];
  public pieChartData: SingleDataSet = [0,0,1];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  constructor(private covidService: CovidDataService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void { 
    if(this.covidService.countryinfo != null){
      this.summary = this.covidService.countryinfo;
      this.pieChartData= [this.summary.TotalDeaths,this.summary.TotalRecovered,
        (this.summary.TotalConfirmed - this.summary.TotalDeaths - this.summary.TotalRecovered)];
    }
    else{
      this.covidService.getSummary()
      .subscribe(worldwide => { 
      this.summary=worldwide["Global"];
      this.pieChartData= [this.summary.TotalDeaths,this.summary.TotalRecovered,
        (this.summary.TotalConfirmed - this.summary.TotalDeaths - this.summary.TotalRecovered)];
    }); 
    }
  }

}