import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';


@NgModule({
  declarations: [AuthService],
  imports: [
    CommonModule
  ]
})
export class ServicesModule { }
