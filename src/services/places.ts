import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Storage } from "@ionic/storage";
import { File } from "ionic-native";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

import { Place } from "../models/place";

declare var cordova: any;

@Injectable()
export class PlacesService {
  private places: Place[] = [];

  constructor(
    private storage: Storage,
    private http: Http
  ) { }

  addPlace(title: string, description: string, imageUrl: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const place = new Place(title, description, imageUrl);

      this.places.push(place);

      this.storage.set('places', this.places).then(() => {
        resolve(true);
      }).catch(err => {
        this.places.splice(this.places.indexOf(place), 1);
        reject(true);
      });
    });
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

  deletePlace(index: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const place = this.places[index];
   
      this.places.splice(index, 1);
   
      this.storage.set('places', this.places).then(() => {
        resolve(true);
      }).catch(
        err => {
          reject(false);
        }
      );
    });
  }

  public saveImage(imagemNome: string, imagemStr: string): Observable<any> {
    let imagem = { imagemNome: imagemNome, imagemStr: imagemStr }

    return this.http.post('http://sat.perto.com.br/prjSATWebAPI/api/RatImagemUpload/', imagem)
      .timeout(20000)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
}
