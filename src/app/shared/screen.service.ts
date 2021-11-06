import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  constructor(private readonly http: HttpClient) { }

  getList() {
    return this.http.get('/assets/mock/data.json');
  }
}
