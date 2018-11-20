import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyproductsPage } from './myproducts';

@NgModule({
  declarations: [
    MyproductsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyproductsPage),
  ],
})
export class MyproductsPageModule {}
