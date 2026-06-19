import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieItem } from '../../Interfaces/MovieItem';
import { MovieReviewDto } from '../../Interfaces/MovieReviewDto';
import { MoviesService } from 'src/app/Services/Movies/movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  movieItems: MovieItem[] = [];
  reviews: MovieReviewDto[] = [];
  selectedMovieId: number | null = null;

  newMovie: MovieItem = {
    id: 0,
    title: '',
    genre: '',
    year: new Date().getFullYear(),
    rating: 8,
    posterUrl: '',
    directedBy: '',
    sinopse: ''
  };

  reviewForm: MovieReviewDto = {
    id: 0,
    movieId: 0,
    rating: 8,
    review: '',
    recommended: false
  };

  get selectedMovieReview(): MovieReviewDto | undefined {
    return this.selectedMovieId ? this.reviews.find(r => r.movieId === this.selectedMovieId) : undefined;
  }

  get canAddMovie(): boolean {
    return this.newMovie.title.trim().length > 0 && this.newMovie.genre.trim().length > 0 && this.newMovie.posterUrl.trim().length > 0;
  }

  get selectedMovieTitle(): string {
    const selected = this.movieItems.find(m => m.id === this.selectedMovieId ?? -1);
    return selected ? selected.title : '';
  }

  get canSubmitReview(): boolean {
    return !!this.reviewForm.movieId && this.reviewForm.review.trim().length > 0;
  }

  constructor(private moviesService: MoviesService, private router: Router) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadMyReviews();
  }

  loadMovies(): void {
    this.moviesService.getAll().subscribe({
      next: movies => this.movieItems = movies,
      error: err => console.error('Erro ao carregar filmes', err)
    });
  }

  loadMyReviews(): void {
    this.moviesService.getMyReviews().subscribe({
      next: reviews => this.reviews = reviews,
      error: err => console.error('Erro ao carregar minhas reviews', err)
    });
  }

  selectMovieForReview(movie: MovieItem): void {
    this.selectedMovieId = movie.id;
    const existing = this.reviews.find(r => r.movieId === movie.id);
    this.reviewForm = existing ? { ...existing } : {
      id: 0,
      movieId: movie.id,
      rating: 8,
      review: '',
      recommended: false
    };
  }

  getReviewForMovie(movieId: number): MovieReviewDto | undefined {
    return this.reviews.find(r => r.movieId === movieId);
  }

  get averageRating(): number {
    if (!this.movieItems.length) {
      return 0;
    }
    const total = this.movieItems.reduce((sum, movie) => sum + movie.rating, 0);
    return Math.round((total / this.movieItems.length) * 10) / 10;
  }

  onAddMovie(event: Event): void {
    event.preventDefault();
    this.addMovie();
  }

  addMovie(): void {
    if (!this.newMovie.title.trim() || !this.newMovie.genre.trim() || !this.newMovie.posterUrl.trim()) {
      return;
    }

    this.moviesService.create(this.newMovie).subscribe({
      next: movie => {
        this.movieItems.push(movie);
        this.newMovie = {
          id: 0,
          title: '',
          genre: '',
          year: new Date().getFullYear(),
          rating: 8,
          posterUrl: '',
          directedBy: '',
          sinopse: ''
        };
      },
      error: err => console.error('Erro ao criar filme', err)
    });
  }

  updateRating(movie: MovieItem, value: number): void {
    const updated = { ...movie, rating: Math.max(0, Math.min(10, value)) };
    this.moviesService.update(updated.id, updated).subscribe({
      next: saved => {
        movie.rating = saved.rating;
      },
      error: err => console.error('Erro ao atualizar rating', err)
    });
  }

  setNewMovieField(field: keyof Omit<MovieItem, 'id'>, value: string | number): void {
    if (typeof value === 'string') {
      (this.newMovie[field] as string) = value;
    } else {
      (this.newMovie[field] as number) = value;
    }
  }

  setReviewField(field: keyof MovieReviewDto, value: string | number | boolean): void {
    if (field === 'recommended') {
      this.reviewForm.recommended = Boolean(value);
      return;
    }

    if (field === 'rating' || field === 'movieId' || field === 'id') {
      (this.reviewForm[field] as number) = Number(value);
      return;
    }

    const reviewText = String(value);
    (this.reviewForm[field] as string) = field === 'review'
      ? reviewText.slice(0, 300)
      : reviewText;
  }

  get reviewCharsRemaining(): number {
    return 300 - this.reviewForm.review.length;
  }

  onSubmitReview(event: Event): void {
    event.preventDefault();
    this.upsertReview();
  }

  viewMovieReviews(movieId: number): void {
    this.router.navigate(['/Filmes', movieId, 'reviews']);
  }

  upsertReview(): void {
    if (!this.canSubmitReview) {
      return;
    }

    this.moviesService.upsertReview(this.reviewForm).subscribe({
      next: result => {
        this.reviewForm = {
          id: 0,
          movieId: 0,
          rating: 8,
          review: '',
          recommended: false
        };
        this.selectedMovieId = null;
        this.loadMovies();
        this.loadMyReviews();
      },
      error: err => console.error('Erro ao salvar review', err)
    });
  }

  deleteMovie(id: number): void {
    this.moviesService.delete(id).subscribe({
      next: () => this.movieItems = this.movieItems.filter(movie => movie.id !== id),
      error: err => console.error('Erro ao deletar filme', err)
    });
  }

  trackByMovie(index: number, movie: MovieItem): number {
    return movie.id;
  }
}
