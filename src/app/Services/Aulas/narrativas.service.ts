import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { Narrativa } from 'src/app/Interfaces/Narrativa';

@Injectable({
  providedIn: 'root'
})
export class NarrativasService {
  private apiUrl = "https://brielinaapi.onrender.com/BrielinaRpg";

  constructor(private http:HttpClient) { }

  getAll():Observable<Narrativa[]>{
    return this.http.get<Narrativa[]>(this.apiUrl+"/Todos");
  }

  getAllChild(narrativaPai:Narrativa):Observable<Narrativa[]>{
    return this.http.post<Narrativa[]>(this.apiUrl+"/TodosFilhos",narrativaPai);
  }

  getOneById(Id:number):Observable<Narrativa>{
    return this.http.get<Narrativa>(this.apiUrl+Id);
  }

  Create(narrativa:Narrativa):Observable<string>{
    return this.http.post<string>(this.apiUrl+"/Nova", narrativa);
  }

  Delete(Id:number):Observable<Narrativa>{
    return this.http.delete<Narrativa>(this.apiUrl+Id);
  }
}
