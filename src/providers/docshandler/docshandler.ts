import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
/*
  Generated class for the DocshandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DocshandlerProvider {

  constructor(public filechooser: FileChooser, public file: File) {
    console.log('Hello DocshandlerProvider Provider');
  }

  //upload and comress docs for upload
  choose() {
    this.filechooser.open().then((url)=>{
      alert(url);

      this.file.resolveLocalFilesystemUrl(url).then((newUrl)=>{

        let dirpath = newUrl.nativeURL;

        let dirPathSegments = dirpath.split('/')
        dirPathSegments.pop()
        dirpath = dirPathSegments.join('/')
        alert(dirpath);
        
        this.file.readAsArrayBuffer(dirpath, newUrl.name).then( async (buffer)=>{
          await this.upload(buffer, newUrl.name);
        })

      })
    })
  }

 async upload(buffer, name) {
    // let blob = new Blob([buffer], {type: "image/jpeg"});

    // let storage = firebase.storage();

    // storage.ref('images/'+name).put(blob).then((d)=>{
    //   console.log("Done")
    // }).catch((error)=>{
    //   console.log(error)
    // })
    console.log(name);
  }

}
