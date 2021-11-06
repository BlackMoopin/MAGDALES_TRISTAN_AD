import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  oneResult:any;
  payload:any;
  oneUser: boolean = false;
  allUsers: boolean = true;
  showEdit: boolean = false;
  showDelete: boolean = false;
  showSearchBar:boolean = false;
  showEditBar:boolean = false;
  error: string = '';

  searchForm: FormGroup = new FormGroup({
    fcSearch: new FormControl('', Validators.required)
  });

  editForm: FormGroup = new FormGroup({
    fcName: new FormControl('', Validators.required),
    fcAge: new FormControl('', Validators.min(1)),
    fcEmail: new FormControl('', Validators.required),
    fcPassword: new FormControl('', Validators.required),
    fcPassword2: new FormControl('', Validators.required),
  });

  requestResult:any;


  constructor(private router: Router, private api: HttpClient) { }

  ngOnInit(): void {
    this.displayAll();
  }
  
  async displayAll(){
    this.showEditBar = false;
    this.allUsers = true;
    this.showSearchBar = false;
    this.oneUser = false;
    this.showDelete = false;
    this.showEdit = false;
    var result:any = await this.api.get(environment.API_URL + '/user/all').toPromise();
    this.requestResult = result.data;
    this.allUsers = true;
  }

  async displayDelete(){
    this.showEditBar = false;
    this.showSearchBar = false;
    this.showDelete = false;
    this.showEdit = false;
    this.oneUser = false;
    this.allUsers = true;
    this.showDelete = true;
  }

  async deleteUser(){
    var result:any = await this.api.delete(environment.API_URL + '/user/' + this.searchForm.value.fcSearch).toPromise();
    if (result.success) {
      this.requestResult = result.data;
      alert("User is succesfully deleted!");
      this.displayAll();
    } else {
      alert("User does not exist in the database");
    }
  }


  async displaySearch(){
    this.showEditBar = false;
    this.oneUser = false;
    this.showSearchBar = false;
    this.showDelete = false;
    this.allUsers = false;
    this.showEdit = false;
    this.oneUser = true;
    this.showSearchBar = true;
  }

  async searchUserAndTerm(){
    if (this.searchForm.value.fcSearch.length > 26){
      var result:any = await this.api.get(environment.API_URL + '/user/' + this.searchForm.value.fcSearch).toPromise();
      if (result.success) {
        this.allUsers = false;
        this.oneUser = true;
        this.requestResult.id = this.searchForm.value.fcSearch;
        this.requestResult.name = result.data.name;
        this.requestResult.age = result.data.age;
        this.requestResult.email = result.data.email;
      } else {
        alert("User does not exist in the database");
      }
    } else {
      var result:any = await this.api.get(environment.API_URL + '/user/search/' + this.searchForm.value.fcSearch).toPromise();
      if (result.success) {
        this.requestResult = result.data;
        this.oneUser = false;
        this.allUsers = true;
      } else {
        alert("User does not exist in the database");
      }
    }
  }

  async showEditUser(){
    this.oneUser = false;
    this.showDelete = false;
    this.allUsers = false;
    this.showSearchBar = false;
    this.showEdit = false;
    this.showEditBar = true;
  }

  async editUser(){
    var result:any = await this.api.get(environment.API_URL + '/user/' + this.searchForm.value.fcSearch).toPromise();
    if (result.success) {
      this.allUsers = false;
      this.oneUser = true;
      this.showEdit = true;
      this.requestResult.id = this.searchForm.value.fcSearch;
      this.requestResult.name = result.data.name;
      this.requestResult.age = result.data.age;
      this.requestResult.email = result.data.email;
    } else {
      alert("User does not exist in the database");
    }
  }

  async onSubmit() {
    if (!this.editForm.valid) {
      {
        alert('Please fill out all data.');
        return;
      }
    }
    if (this.editForm.valid) {
      var payload: {
        name: string;
        email: string;
        age: number;
      };

      payload = {
        name: this.editForm.value.fcName,
        age: this.editForm.value.fcAge,
        email: this.editForm.value.fcEmail,
      };

      console.log(payload);

    }
  }

  async confirmEdit(){
    if (this.editForm.value.fcName!= "" && this.editForm.value.fcName!=null){
      var result: any = await this.api
      .patch(environment.API_URL + '/user/' + this.requestResult.id, {
        name: this.editForm.value.fcName,
        age: this.requestResult.age,
        email: this.requestResult.email,
      })
      .toPromise();
    }

    if (this.editForm.value.fcAge!= "" && this.editForm.value.fcAge!=null){
      if (this.editForm.value.fcAge!= 0){
        var result: any = await this.api
        .patch(environment.API_URL + '/user/' + this.requestResult.id, {
          name: this.requestResult.name,
          age: this.editForm.value.fcAge,
          email: this.requestResult.email,
        })
        .toPromise();
      } else {
        alert("Age cannot be Zero(0)!");
      }
      
    } else {
      alert("Age cannot be Zero(0)!");
    }

    if (this.editForm.value.fcEmail!= "" && this.editForm.value.fcEmail!=null){
      var result: any = await this.api
      .patch(environment.API_URL + '/user/' + this.requestResult.id, {
        name: this.requestResult.name,
        age: this.requestResult.age,
        email: this.editForm.value.fcEmail,
      })
      .toPromise();
    } 

      if (result.success){
        alert("User "+this.requestResult.name+" with ID " + this.requestResult.id + " is now updated.");
        this.editUser();
      } else {
        alert("Email already exists!");
      }
  }

  nav(destination: string) {
    this.router.navigate([destination]);
  }

}
