import { Observable } from 'rxjs';
import { Products } from './../../models/product.model';
import { ProductProvider } from './../../providers/product/product';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

/**
 * Generated class for the MyproductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myproducts',
  templateUrl: 'myproducts.html',
})
export class MyproductsPage {

  myProduct$: Observable<Products[]>;
  userid = firebase.auth().currentUser.uid;

  constructor(public navCtrl: NavController, public navParams: NavParams, public prodProvider: ProductProvider) {
    const userid= firebase.auth().currentUser.uid;
   this.myProduct$ = this.prodProvider.getUserProducts(userid).valueChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyproductsPage');
  }


  deleteProduct(product){
    if(this.userid == product.user_id){
    this.prodProvider.deleteProduct(product.id);
    }else{
      console.log('an error occured')
    }
  }
  
}
