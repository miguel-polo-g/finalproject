import { User } from "./user.model";

export class News{
    date: any;
    description: string;
    country: string;
    user:User;

    constructor(date: Date,
        description: string,
        country: string,
        user: User){
            this.date = date;
            this.description = description;
            this.country = country;
            this.user = user;
        }
}