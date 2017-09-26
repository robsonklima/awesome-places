import { SetLocationPage } from './../set-location/set-location';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from 'ionic-angular';
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

  constructor(
    private modalCtrl: ModalController
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
}