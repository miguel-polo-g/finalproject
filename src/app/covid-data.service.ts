import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './user.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Summary } from './summary.model';
import firebase from 'firebase/app';
import { News } from './news.model';



@Injectable({
  providedIn: 'root'
})
export class CovidDataService {

  private user: User;
  public countryinfo: Summary;
  

  constructor(private afAuth: AngularFireAuth, 
    private router: Router, private firestore : AngularFirestore, 
    private http : HttpClient) { }

    async signInWithGoogle(){
      const credientals = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); 
      this.user = {
         uid: credientals.user.uid,
         displayname: credientals.user.displayName,
         email: credientals.user.email
      };
      this.userIsDeveloper();
     }

    getUser(){
      if(this.user == null && this.userSignedIn()){
        this.user = JSON.parse(localStorage.getItem("user"));
      }
      return this.user;
    }
  
    userIsDeveloper(){
      this.firestore.collection("user").doc(this.user.email)
       .get().subscribe((doc)=>{
        if(doc.exists){
          console.log("USER IS CONTRIBUTOR");
          localStorage.setItem("user", JSON.stringify(this.user));
          this.router.navigate(["addnews"]);
        }
        else{
          console.log("USER NOT IN DATABASE");
          localStorage.removeItem("user");
          this.user = null;
        }
      });

    }

    userSignedIn(): boolean{
      return JSON.parse(localStorage.getItem("user")) != null;
    }
  
    signOut(){
      this.afAuth.signOut();
      localStorage.removeItem("user");
      this.user = null;
      this.countryinfo = null;
      this.router.navigate(["worldwide"]);
    }

    getSummary(){
      return this.http.get('https://api.covid19api.com/summary');
    }

    getLastWeekData(){
      return this.http.get('https://corona.lmao.ninja/v2/historical/all?lastdays=8');
    }

    getDataFromCountry() {      
      return this.http.get('https://api.covid19api.com/total/country/'+this.countryinfo.Slug);
    }

    getHistoricalData(){
      return this.http.get('https://corona.lmao.ninja/v2/historical/all');
    }

    goToCountryPage(country : Summary){
      this.countryinfo = country;
      //localStorage.setItem("country", JSON.stringify(this.countryinfo));
      this.checkCountrySummary(country.Slug);
      this.router.navigate(["country",country.Slug]);
    }

    checkCountrySummary(slugname: string): boolean{
      let result = false;
      this.firestore.collection("country").doc(slugname)
      .get().subscribe((doc)=>{
        if(doc.exists){
          result = true;
          //checks if dates are different or timestamps difference greater than 24h)
          if( (doc.get("lastUpdated").toDate().getDate() != new Date().getDate()) ||
          ( ((new Date().getTime())/1000-doc.get("lastUpdated")["seconds"])/3600 > 24) ){
            console.log("COUNTRY SUMMARY INFO UPDATED IN DATABASE");
            this.addCountrySummary();
          }
          else{
            this.countryinfo = {
              NewConfirmed: doc.get("newcases"),
              NewDeaths: doc.get("newdeaths"),
              NewRecovered: doc.get("newrecovered"),
              TotalConfirmed: doc.get("totcases"),
              TotalDeaths: doc.get("totdeaths"),
              TotalRecovered: doc.get("totrecovered"),    
              Country: doc.get("name"),
              Slug: doc.id,
              sort(){}
            };
          }
        }else{//its not there, I store it
          this.addCountrySummary();

        }        
      });
      return result;
    }

    private addCountrySummary(){
      this.firestore.collection("country").doc(this.countryinfo.Slug).set({
        name: this.countryinfo.Country,
        newcases: this.countryinfo.NewConfirmed,
        newdeaths: this.countryinfo.NewDeaths,
        newrecovered: this.countryinfo.NewRecovered,
        totcases: this.countryinfo.TotalConfirmed,
        totdeaths: this.countryinfo.TotalDeaths,
        totrecovered: this.countryinfo.TotalRecovered,    
        lastUpdated: new Date()
      }, { merge: true});
    }
    
    getNews(){
      return this.firestore.collection("news", ref => ref.orderBy('date', 'desc')).valueChanges();
    }
    
    addNews(news:News){
      this.firestore.collection("news").add(news);
    }

}
