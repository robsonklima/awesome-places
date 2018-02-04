import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { File } from "ionic-native";

import { Place } from "../models/place";

declare var cordova: any;

@Injectable()
export class PlacesService {
  private places: Place[] = [];

  constructor(
    private storage: Storage
  ) {}

  addPlace(title: string,
           description: string,
           imageUrl: string) {
    const place = new Place(title, description, imageUrl);

    this.places.push(place);

    this.storage.set('places', this.places).then(() => {

    }).catch(
        err => {
          this.places.splice(this.places.indexOf(place), 1);
        }
      );
  }

  loadPlaces() {
    console.log(this.places);
    return this.places.slice();
  }

  fetchPlaces() {
    return this.storage.get('places')
      .then(
        (places: Place[]) => {
          this.places = places != null ? places : [];
          return this.places.slice();
        }
      )
      .catch(
        err => console.log(err)
      );
  }

  deletePlace(index: number) {
    const place = this.places[index];
    this.places.splice(index, 1);
    this.storage.set('places', this.places)
      .then(
        () => {
          this.removeFile(place);
        }
      )
      .catch(
        err => console.log(err)
      );
  }

  private removeFile(place: Place) {
    const currentName = place.imageUrl.replace(/^.*[\\\/]/, '');
    File.removeFile(cordova.file.dataDirectory, currentName)
      .then(
        () => console.log('Removed File')
      )
      .catch(
        () => {
          console.log('Error while removing File');
          this.addPlace(place.title, place.description, place.imageUrl);
        }
      );
  }
}
