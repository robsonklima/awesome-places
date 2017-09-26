import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, LoadingController, ToastController } from 'ionic-angular';

import { Geolocation, Camera, CameraOptions } from 'ionic-native';

import { SetLocationPage } from './../set-location/set-location';
import { Location } from "../../models/location";

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  }
  locationIsSet = false;
  imageUrl = '';

  constructor(
    private modalCtrl: ModalController, 
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private camera: Camera
  ) {}

  onSubmit(form: NgForm) {
    console.log(form.value);
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, 
      { location: this.location, locationIsSet: this.locationIsSet });
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    )
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content: 'Getting your location...'
    });
    loader.present();

    Geolocation.getCurrentPosition()
      .then(
        location => {
          loader.dismiss();

          this.location.lat = location.coords.latitude;
          this.location.lng = location.coords.longitude;
          this.locationIsSet = true;
        })
      .catch(error => {
          loader.dismiss();
          const toast = this.toastCtrl.create({
            message: 'Could get location, please pick it manually!',
            duration: 2500
          });
          toast.present();
       });
  }

  onTakePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE
    }

    Camera.getPicture(options)
      .then(
        ImageData => {
          this.imageUrl = ImageData;
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
