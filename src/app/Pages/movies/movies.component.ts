import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
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
  expandedSynopsis = new Set<number>();
  isSavingReview = false;
  isAddingMovie = false;
  isLoadingMovies = true;

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

  constructor(private moviesService: MoviesService, private router: Router, private offcanvasService: NgbOffcanvas) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadMyReviews();
  }

  loadMovies(): void {
    this.isLoadingMovies = true;
    this.moviesService.getAll().subscribe({
      next: movies => {
        this.movieItems = movies;
        this.sortMoviesByIdDesc();
        this.isLoadingMovies = false;
      },
      error: err => {
        console.error('Erro ao carregar filmes', err);
        this.isLoadingMovies = false;
      }
    });
  }

  loadMyReviews(): void {
    this.moviesService.getMyReviews().subscribe({
      next: reviews => this.reviews = reviews,
      error: err => console.error('Erro ao carregar minhas reviews', err)
    });
  }

  openReviewOffcanvas(movie: MovieItem, content: TemplateRef<any>): void {
    this.selectedMovieId = movie.id;
    const existing = this.reviews.find(r => r.movieId === movie.id);
    this.reviewForm = existing ? { ...existing } : {
      id: 0,
      movieId: movie.id,
      rating: 8,
      review: '',
      recommended: false
    };

    this.offcanvasService.open(content, { position: 'end' });
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

  onAddMovie(event: Event, offcanvas?: any): void {
    event.preventDefault();
    this.addMovie(offcanvas);
  }

  openNewMovieOffcanvas(content: TemplateRef<any>): void {
    this.isAddingMovie = false;
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
    this.offcanvasService.open(content, { position: 'end' });
  }

  addMovie(offcanvas?: any): void {
    if (!this.newMovie.title.trim() || !this.newMovie.genre.trim() || !this.newMovie.posterUrl.trim()) {
      return;
    }

    this.isAddingMovie = true;
    this.moviesService.create(this.newMovie).subscribe({
      next: movie => {
        this.movieItems.push(movie);
        this.sortMoviesByIdDesc();
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
        this.isAddingMovie = false;
        if (offcanvas) {
          if (typeof offcanvas.close === 'function') {
            offcanvas.close('submitted');
          } else if (typeof offcanvas.dismiss === 'function') {
            offcanvas.dismiss('submitted');
          } else {
            this.offcanvasService.dismiss();
          }
        }
      },
      error: err => {
        console.error('Erro ao criar filme', err);
        this.isAddingMovie = false;
      }
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

  onSubmitReview(event: Event, offcanvas?: any): void {
    event.preventDefault();
    this.upsertReview(offcanvas);
  }

  viewAllReviewsFeed(): void {
    this.router.navigate(['/Filmes', 'reviews']);
  }

  upsertReview(offcanvas?: any): void {
    if (!this.canSubmitReview || this.isSavingReview) {
      return;
    }

    this.isSavingReview = true;
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
        this.isSavingReview = false;

        if (offcanvas) {
          if (typeof offcanvas.close === 'function') {
            offcanvas.close('submitted');
          } else if (typeof offcanvas.dismiss === 'function') {
            offcanvas.dismiss('submitted');
          } else {
            this.offcanvasService.dismiss();
          }
        }
      },
      error: err => {
        console.error('Erro ao salvar review', err);
        this.isSavingReview = false;
      }
    });
  }

  deleteMovie(id: number): void {
    this.moviesService.delete(id).subscribe({
      next: () => this.movieItems = this.movieItems.filter(movie => movie.id !== id),
      error: err => console.error('Erro ao deletar filme', err)
    });
  }

  isSynopsisExpanded(movieId: number): boolean {
    return this.expandedSynopsis.has(movieId);
  }

  toggleSynopsis(movieId: number): void {
    if (this.expandedSynopsis.has(movieId)) {
      this.expandedSynopsis.delete(movieId);
    } else {
      this.expandedSynopsis.add(movieId);
    }
  }

  trackByMovie(index: number, movie: MovieItem): number {
    return movie.id;
  }

  private sortMoviesByIdDesc(): void {
    this.movieItems.sort((a, b) => b.id - a.id);
  }
}
