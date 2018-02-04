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
      quality: 50,
      targetWidth: 1280,
      targetHeight: 768,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true,
      saveToPhotoAlbum: true
    })
      .then(
        imageData => {
          const currentName = imageData.replace(/^.*[\\\/]/, '');
          const path = imageData.replace(/[^\/]*$/, '');
          const newFileName = new Date().getUTCMilliseconds() + '.jpg';
          File.moveFile(path, currentName, cordova.file.dataDirectory, 
            newFileName)
            .then(
              (data: Entry) => {
                this.imageUrl = data.nativeURL;
                Camera.cleanup();
                // File.removeFile(path, currentName);
              }
            )
            .catch(
              (err: FileError) => {
                this.imageUrl = '';
                const toast = this.toastCtrl.create({
                  message: 'Could not save the image. Please try again',
                  duration: 2500
                });
                toast.present();
                Camera.cleanup();
              }
            );
          this.imageUrl = imageData;
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
