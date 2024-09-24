import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  maxDate = new Date();
  validationErrors: string[] | undefined;

  // @Input() usersFromHomeComponent: any *before Angular 17.3
  // usersFromHomeComponent = input.required<any>(); this is an signal extension

  // @Output() cancelRegister = new EventEmitter(); *before Angular 17.3
  cancelRegister = output<boolean>(); // this is an signal extension
  registerForm: FormGroup = new FormGroup({});

  initializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ["", Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ["", [Validators.required, this.matchValues("password")]]
    });

    // Inputlar arasında iki taraflı kontrolü sağlamak için aşağıdaki işlem yapılır.
    this.registerForm.controls["password"].valueChanges.subscribe({
      next: () => this.registerForm.controls["confirmPassword"].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching: true}
    }
  }

  register(){
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    const values = this.registerForm.value;
    values.dateOfBirth = dob;
    this.accountService.register(values).subscribe({
      next: _ => this.router.navigateByUrl('/members'),
      error: error => this.validationErrors = error
    });
  }

  cancel(){
    this.cancelRegister.emit(false)
  }

  private getDateOnly(dob: string | undefined){
    if (!dob) return;
    return new Date(dob).toISOString().slice(0, 10);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear()- 18);
  }
}
