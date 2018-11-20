import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProductsPage } from './add-products';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    AddProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddProductsPage),
    RoundProgressModule,
  ],
})
export class AddProductsPageModule {}
