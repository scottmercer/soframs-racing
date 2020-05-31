import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api = 'http://localhost:8000/api';
  username: string;

  constructor(private http: HttpClient) { }

  setUsername(name: string): void {
    this.username = name;
  }

  // Returns all members
  getMembers() {
    return this.http
      .get(`${this.api}/members`)
      .pipe(catchError(this.handleError));
  }

  // Return member by ID
  getMember(id) {
    return this.http
      .get(`${this.api}/member/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Add members
  addMember(memberForm) {
    return this.http
      .post(`${this.api}/addMember`, memberForm)
      .pipe(catchError(this.handleError));
  }

  // Delete member by Id
  deleteMember(id: number) {
    return this.http
      .delete(`${this.api}/deleteMember/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Update member by Id
  updateMember(id: number, memberForm) {
    return this.http
      .put(`${this.api}/updateMember/${id}`, memberForm)
      .pipe(catchError(this.handleError));
  }

  getTeams() {
    return this.http
      .get(`${this.api}/teams`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
