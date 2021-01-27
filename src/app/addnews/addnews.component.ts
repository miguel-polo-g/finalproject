import { Component, OnInit } from '@angular/core';
import { CovidDataService } from '../covid-data.service';
import { News } from '../news.model';
import { User } from '../user.model';

@Component({
  selector: 'app-addnews',
  templateUrl: './addnews.component.html',
  styleUrls: ['./addnews.component.css']
})
export class AddnewsComponent implements OnInit {

  date: any;
  description: string;
  country: string;
  user:User;
  added: boolean;

  constructor(public covidService :CovidDataService) { }

  ngOnInit(): void {
    this.user = this.covidService.getUser();
    this.added= false;
  }

  addNews(){
    let news: News = {
      date: new Date(this.date),
      description: this.description,
      country: this.country,
      user: this.user
    };
    this.covidService.addNews(news);
    this.date = undefined;
    this.description = undefined;
    this.country = undefined;
    this.added = true;
  }

}
