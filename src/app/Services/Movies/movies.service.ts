import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MovieItem } from 'src/app/Interfaces/MovieItem';
import { MovieReviewDto, ReviewFeedItem, ReviewUpsertResult } from 'src/app/Interfaces/MovieReviewDto';

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

  getAllReviewsFeed(): Observable<ReviewFeedItem[]> {
    return this.getAll().pipe(
      switchMap(movies => {
        if (!movies.length) {
          return of([]);
        }

        return forkJoin(
          movies.map(movie =>
            this.getReviewsByMovie(movie.id).pipe(
              map(reviews =>
                reviews.map(review => ({
                  id: review.id,
                  movieId: movie.id,
                  movieTitle: movie.title,
                  rating: review.rating,
                  review: review.review,
                  recommended: review.recommended,
                  userName: review.userName
                }))
              )
            )
          )
        ).pipe(map(reviewGroups => reviewGroups.flat()));
      })
    );
  }

  getReviewsByMovie(movieId: number): Observable<MovieReviewDto[]> {
    return this.http.get<MovieReviewDto[]>(`${this.baseUrl}/${movieId}/reviews`);
  }
}
