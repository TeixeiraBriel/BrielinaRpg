import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieItem } from 'src/app/Interfaces/MovieItem';
import { MovieReviewDto, ReviewUpsertResult } from 'src/app/Interfaces/MovieReviewDto';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private baseUrl = 'https://brielinaapi.onrender.com/Movies/movies';
  //private baseUrl = 'https://localhost:7036/Movies/movies';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MovieItem[]> {
    return this.http.get<MovieItem[]>(this.baseUrl);
  }

  getOne(id: number): Observable<MovieItem> {
    return this.http.get<MovieItem>(`${this.baseUrl}/${id}`);
  }

  create(movie: MovieItem): Observable<MovieItem> {
    return this.http.post<MovieItem>(`${this.baseUrl}/novo`, movie);
  }

  update(id: number, movie: MovieItem): Observable<MovieItem> {
    return this.http.put<MovieItem>(`${this.baseUrl}/${id}`, movie);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  upsertReview(review: MovieReviewDto): Observable<ReviewUpsertResult> {
    return this.http.post<ReviewUpsertResult>(`${this.baseUrl}/reviews`, review);
  }

  getMyReviews(): Observable<MovieReviewDto[]> {
    return this.http.get<MovieReviewDto[]>(`${this.baseUrl}/reviews/me`);
  }

  getReviewsByUser(usuarioId: number): Observable<MovieReviewDto[]> {
    return this.http.get<MovieReviewDto[]>(`${this.baseUrl}/reviews/usuario/${usuarioId}`);
  }

  getReviewsByMovie(movieId: number): Observable<MovieReviewDto[]> {
    return this.http.get<MovieReviewDto[]>(`${this.baseUrl}/${movieId}/reviews`);
  }
}
