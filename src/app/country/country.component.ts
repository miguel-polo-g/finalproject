import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CovidDataService } from '../covid-data.service';
import { Summary } from '../summary.model';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  summary : Summary;

  constructor(public covidService: CovidDataService,private router: Router) {     
    if(this.covidService.countryinfo == null){//route was written
      if(covidService.checkCountrySummary(this.router.url.split("/")[2])){
        this.summary = covidService.countryinfo;
      }
      else{
        this.returnToMainPage();
      }
    }
    else{ //coming from worldwide -> click on table
      this.summary = covidService.countryinfo;
    }
    
  }

  returnToMainPage(){
    this.covidService.countryinfo = null;
    this.router.navigate(["worldwide"]);
  }


  ngOnInit(): void {
  }

}
