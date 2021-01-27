import { Component, OnInit } from '@angular/core';
import { Summary } from '../summary.model';
import {CovidDataService} from '../covid-data.service'
import { faAngleDown,faAngleUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-worldwide',
  templateUrl: './worldwide.component.html',
  styleUrls: ['./worldwide.component.css']
})
export class WorldwideComponent implements OnInit {

  summary : Summary;
  countries : Summary;
  faAngleDown= faAngleDown;
  faAngleUp= faAngleUp;

  constructor(public covidService: CovidDataService) { }

  ngOnInit(): void {
    this.covidService.getSummary()
    .subscribe(worldwide => { 
      this.summary=worldwide["Global"];
      this.countries=worldwide["Countries"];       
      //console.log(worldwide);
      //console.log(this.countries);
    }); 
  }

  orderBy(prop:string,ascending:boolean){
    if(ascending){
        //ascending
        this.countries.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
      }
      else{
        // descending
        this.countries.sort((a, b) => a[prop] < b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1); 
      }
  }
 

}
