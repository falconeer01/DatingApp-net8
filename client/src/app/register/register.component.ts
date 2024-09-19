import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accountService = inject(AccountService);

  // @Input() usersFromHomeComponent: any *before Angular 17.3
  usersFromHomeComponent = input.required<any>(); // this is an signal extension

  // @Output() cancelRegister = new EventEmitter(); *before Angular 17.3
  cancelRegister = output<boolean>(); // this is an signal extension
  model: any ={};

  register(){
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => console.log(error)
    })
  }

  cancel(){
    this.cancelRegister.emit(false)
  }
}
