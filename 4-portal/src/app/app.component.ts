import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'portal';
  userCredentials1: string = "null";
  userCredentials2: string = "null";

  users: Array<any> = [
    { username: 'potato', password: 'eyes'},
    { username: 'potato1', password: 'eyes1'},
    { username: 'potato2', password: 'eyes2'},
    { username: 'potato3', password: 'eyes3'},
    { username: 'potato4', password: 'eyes4'},
    { username: 'potato5', password: 'eyes5'},
    { username: 'potato6', password: 'eyes6'},
  ];

  login(email:string, password:string){
    this.userCredentials1 = email;
    this.userCredentials2 = password;
  }
}
