import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, NgIterable } from '@angular/core';
import { StudentsService } from '../../students.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { Students } from '../../students.model';
import { formatDate } from '@angular/common';
import { Schools } from 'app/admin/schools/all-schools/schools.model';
import { Observable, catchError, map, mergeMap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


export interface DialogData {
  id: number;
  action: string;
  students: Students;
}

@Component({
  selector: 'app-form-dialog:not(f)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  stdForm: UntypedFormGroup;
  students: Students;
  schools: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public studentsService: StudentsService,
    private fb: UntypedFormBuilder,
    private httpClient: HttpClient

  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.students.lastName;
      this.students = data.students;
    } else {
      this.dialogTitle = 'New Students';
      const blankObject = {} as Students;
      this.students = new Students(blankObject);
    }
    this.stdForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.students.id],
      // img: [this.students.img],
      lastName: [this.students.lastName],
      firstName: [this.students.firstName],
      schoolemail: [
        this.students.schoolemail,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      personalemail: [
        this.students.personalemail,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],

      Title: [this.students.Title],
      registrationnumber: [this.students.registrationnumber],
      groupmajor: [this.students.groupmajor],
      GSM: [this.students.GSM],
      statusofstudent: [this.students.statusofstudent],
      specialrequirements: [this.students.specialrequirements],
      school: [this.getFormattedSchools()],
      user_uuid: [this.students.user_uuid]
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    // const formData = new FormData();
    if (this.action === 'edit') {
      this.students = this.stdForm.getRawValue();
      console.log(this.students)
    this.httpClient.put("http://localhost:8000/api/student/update_student/", this.students)
  .subscribe(
    (response) => {
      console.log('student added successfully', response);
      // Handle the server response here
      // ...
    },
    (error) => {
      console.error('Error adding student', error);
      // Handle any errors that occurred during the request
      // ...
    }
  );
    } else {
    this.students = this.stdForm.getRawValue();
    console.log("teachers info in confirmAdd", this.students)

      var apiDataNew = {
        ...this.students,
        Role: "Student",
        email: this.students.schoolemail,
      };
    this.httpClient.post("http://localhost:8000/api/user/create_user/", apiDataNew)
  .pipe(
    mergeMap(() => {
      // Second API call to add the teacher
      return this.httpClient.post('http://localhost:8000/api/student/add_student/', this.students);
    })
  )
  .subscribe(
    (response) => {
      console.log('Student added successfully', response);
      // Handle the server response here
      // ...
    },
    (error) => {
      console.error('Error adding student', error);
      // Handle any errors that occurred during the request
      // ...
    }
  );
  }
      this.dialogRef.close(1);
    

  }

  // Inside your component class
  // getSchools(){
  //   const url = "http://localhost:8000/api/admn/get_all_schools/";
  //   var data = this.httpClient.get(url);
  //   console.log(data)
  //   var tempD = [
  //     { label: 'ESIEE', value: 'ESIEE' },
  //     { label: 'Bilkent', value: 'Bilkent' }
  //     ];
  //   return tempD
  // }

   getSchools(): Observable<Schools[]> {
  const url = 'http://localhost:8000/api/admn/get_all_schools/';
  return this.httpClient.get<Schools[]>(url);
  }

getFormattedSchools() {
  this.getSchools().subscribe(
    (schools: Schools[]) => {
      this.schools = schools.map((school: Schools) => ({
        label: school.schoolName,
        value: school.id
      }));
    },
    (error: HttpErrorResponse) => {
      console.error(error);
    }
  );
}

}

