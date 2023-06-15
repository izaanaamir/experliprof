import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SchoolsService } from '../../schools.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { Schools } from '../../schools.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';

export interface DialogData {
  id: number;
  action: string;
  schools: Schools;
}

@Component({
  selector: 'app-form-dialog:not(a)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  schoolsForm: UntypedFormGroup;
  schools: Schools;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public schoolsService: SchoolsService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.schools.dName;
      this.schools = data.schools;
    } else {
      this.dialogTitle = 'New Schools';
      const blankObject = {} as Schools;
      this.schools = new Schools(blankObject);
    }
    this.schoolsForm = this.createContactForm();
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
      id: [this.schools.id],
      dName: [this.schools.dName, [Validators.required]],
      hod: [this.schools.hod, [Validators.required]],
      phone: [this.schools.phone, [Validators.required]],
      email: [
        this.schools.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      sYear: [this.schools.sYear, [Validators.required]],
      sCapacity: [this.schools.sCapacity, [Validators.required]],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.schoolsService.addSchools(this.schoolsForm.getRawValue());
  }
}