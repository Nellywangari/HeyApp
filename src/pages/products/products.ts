import { MyproductsPage } from './../myproducts/myproducts';
import { OrderPage } from './../order/order';
import { ProductProvider } from './../../providers/product/product';
import { Products } from './../../models/product.model';
import { Observable } from 'rxjs';
import { AddProductsPage } from './../add-products/add-products';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as algoliasearch from 'algoliasearch';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  client: any;
  index: any;
  ALGOLIA_APP_ID: string = "KOTXKE80QA";
  ALGOLIA_API_KEY: string = "f1a6b87b763c9327fb286aa8740deeee";
  searchQuery: string ="";
  products = [];
  products$: Observable<Products[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public productService: ProductProvider) {
    this.client = algoliasearch(this.ALGOLIA_APP_ID, this.ALGOLIA_API_KEY,{protocol: 'https:'});

    this.index = this.client.initIndex('products');
  }

  addProductPage(){
    this.navCtrl.push("AddProductsPage");
  }


  ngOnInit() {
    this.products$ =this.productService.getAllProducts(ref => ref);
    console.log(this.products$);
  }

  orderPage(product) {
    this.navCtrl.push('OrderPage',{data: product})
  }

  editProductPage(){
    this.navCtrl.push(MyproductsPage);
  }

  search(event){
    this.index.search({
      query: this.searchQuery
    }).then((data)=>{
      console.log(data.hits);
      this.products$ = null
      this.products = data.hits;
    })
    
  }

}
