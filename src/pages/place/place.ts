import { Component } from '@angular/core';
import { NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Place } from "../../models/place";
import { PlacesService } from "../../services/places";

@Component({
  selector: 'page-place',
  templateUrl: 'place.html'
})
export class PlacePage {
  url: string = 'http://sat.perto.com.br/prjSATWebAPI/api/RatImagemUpload';
  place: Place;
  index: number;

  constructor(
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private transfer: FileTransfer,
    private placesService: PlacesService
  ) {
    this.place = this.navParams.get('place');
    this.index = this.navParams.get('index');
  }

  onLeave() {
    this.viewCtrl.dismiss();
  }

  onDelete(place: Place) {
    this.placesService.deletePlace(this.index);
    this.onLeave();
  }

  onUpload(place: Place) {
    let loader = this.loadingCtrl.create({
      content: "Enviando Foto...",
      enableBackdropDismiss: true,
      showBackdrop: true,
      dismissOnPageChange: true
    });
    loader.present();
  
    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }

    this.placesService.saveImage(place.title, place.imageUrl)
      .subscribe((r) => {
        loader.dismiss().then(() => {
          const toast = this.toastCtrl.create({
            message: "Upload efetuado com sucesso",
            duration: 2500
          });
  
          toast.present();
        }).catch(() => {});
      },
      err => {
        loader.dismiss().then(() => {
          const toast = this.toastCtrl.create({
            message: "Erro ao efetuar o Upload",
            duration: 2500
          });
  
          toast.present();
        }).catch(() => {});
      });
  }
}
