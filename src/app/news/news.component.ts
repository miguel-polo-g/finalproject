import { Component, OnInit } from '@angular/core';
import { CovidDataService } from '../covid-data.service';
import { News } from '../news.model';
import { User } from '../user.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news: News[];
  user: User;
  //public notallowed: boolean;

  constructor(public covidService: CovidDataService) { }

  ngOnInit(): void {
    this.user = this.covidService.getUser();
    if(this.covidService.countryinfo != null){
      this.covidService.getNews()
      .subscribe((news)=>{
        let countrynews = [];
        this.news = news as News[];
        this.news.forEach((article) => {
          if(article["country"] == this.covidService.countryinfo.Country){
            countrynews.push(article);
          }          
        }); 
        this.news = countrynews.slice(0,4);
      });
    }
    else{
      this.covidService.getNews()
      .subscribe((news)=>{
        this.news = news.slice(0,4) as News[];
      });
    }
  }

}
