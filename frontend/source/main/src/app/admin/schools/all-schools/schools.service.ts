import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Schools } from './schools.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
@Injectable()
export class SchoolsService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/schools.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<Schools[]> = new BehaviorSubject<Schools[]>(
    []
  );
  // Temporarily stores data from dialogs
  dialogData!: Schools;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Schools[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllSchools(): void {
    this.subs.sink = this.httpClient.get<Schools[]>(this.API_URL).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  addSchools(schools: Schools): void {
    this.dialogData = schools;

    // this.httpClient.post(this.API_URL, schools)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = schools;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  updateSchools(schools: Schools): void {
    this.dialogData = schools;

    // this.httpClient.put(this.API_URL + schools.id, schools)
    //     .subscribe({
    //       next: (data) => {
    //         this.dialogData = schools;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
  deleteSchools(id: number): void {
    console.log(id);

    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //         console.log(id);
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
}
