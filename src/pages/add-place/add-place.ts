import { PlacesService } from './../../services/places';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastController } from 'ionic-angular';

import { Camera, File, FileError, Entry } from "ionic-native";

declare var cordova: any;

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  imageUrl = '';

  constructor(
    private toastCtrl: ToastController,
    private placesService: PlacesService
  ) {}

  onSubmit(form: NgForm) {
    this.placesService.addPlace(form.value.title, form.value.description, this.imageUrl);
    form.reset();
    this.imageUrl = '';
  }

  onTakePhoto() {
    Camera.getPicture({
      quality: 40,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      correctOrientation: true
    }).then(imageData => {
      this.imageUrl = 'data:image/jpeg;base64,' + imageData;
      Camera.cleanup();
    }
  )
  .catch(
    error => {
      console.log(error);
      const toast = this.toastCtrl.create({
        message: error,
        duration: 2500
      });
      toast.present();
    }
  );
  }
}
