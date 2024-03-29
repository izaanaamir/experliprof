import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CourseService } from '../../course.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { Course } from '../../course.model';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { Schools } from 'app/admin/schools/all-schools/schools.model';

export interface DialogData {
  id: number;
  action: string;
  course: Course;
}

@Component({
  selector: 'app-form-dialog:not(h)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  proForm: UntypedFormGroup;
  course: Course;
  schools: any;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public courseService: CourseService,
    private fb: UntypedFormBuilder,
    private httpClient: HttpClient
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.course.courseName;
      this.course = data.course;
    } else {
      this.dialogTitle = 'New Course';
      const blankObject = {} as Course;
      this.course = new Course(blankObject);
    }
    this.proForm = this.createContactForm();
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
      courseID: [this.course.CourseID],
      courseName: [this.course.courseName],
      schools: [this.getFormattedSchools()],
      courseDetails: [this.course.courseDetails],
    });
  }
  submit() {
    this.confirmAdd();
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.courseService.addCourse(this.proForm.getRawValue());
  }
  // Inside your component class
   getSchools(): Observable<Schools[]> {
  const url = 'http://localhost:8000/api/teacher/get_all_schools/'+localStorage.getItem("user_uuid");
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
