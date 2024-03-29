import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map } from 'rxjs';
import { Teachers } from './teachers.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
@Injectable()
export class TeachersService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/teachers.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<Teachers[]> = new BehaviorSubject<Teachers[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Teachers;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Teachers[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllTeacherss(): void {
    this.subs.sink = this.httpClient.get<Teachers[]>("http://localhost:8000/api/teacher/get_teachers/").subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
        console.log("In get teachers", data)
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  addTeachers(teachers: Teachers): void {
    this.dialogData = teachers;
    this.httpClient.post("http://localhost:8000/api/teacher/add_teacher/", teachers)
      .subscribe(
        response => {
          // Handle the response from the backend
          console.log('Form data sent successfully');
        },
        error => {
          // Handle any errors that occurred during the API call
          console.error('Error occurred while sending form data:', error);
        }
      );
    console.log("Sending User Request")
  
  }
  updateTeachers(teachers: Teachers): void {
    this.dialogData = teachers;

    // this.httpClient.put(this.API_URL + teachers.id, teachers)
    //     .subscribe({
    //       next: (data) => {
    //         this.dialogData = teachers;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }

  getUserCredentials(userID: any) {
    return this.httpClient.get("http://localhost:8000/api/teacher/get_teacher_creds/" + userID).pipe(
    map((response: any) => response),
    catchError((error: any) => {
      console.error(error.name + ' ' + error.message);
      // Handle the error appropriately
      throw error; // Rethrow the error to propagate it to the subscriber
    })
  );
  }
  deleteTeachers(teacherID: number): void {
    console.log(teacherID)
    this.httpClient.delete("http://localhost:8000/api/teacher/remove_user/" + teacherID)
      .subscribe(
        () => {
          console.log('Teacher deleted successfully.');
          // Perform any necessary actions after successful deletion
        },
        (error: HttpErrorResponse) => {
          console.error(error.name + ' ' + error.message);
          // Handle the error appropriately
        }
      );
  }
}