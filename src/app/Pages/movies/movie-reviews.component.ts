import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieItem } from '../../Interfaces/MovieItem';
import { MovieReviewDto } from '../../Interfaces/MovieReviewDto';
import { MoviesService } from 'src/app/Services/Movies/movies.service';

@Component({
  selector: 'app-movie-reviews',
  templateUrl: './movie-reviews.component.html',
  styleUrls: ['./movie-reviews.component.scss']
})
export class MovieReviewsComponent implements OnInit {
  movie?: MovieItem;
  reviews: MovieReviewDto[] = [];
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'Filme inválido.';
      return;
    }

    this.loadMovie(id);
    this.loadReviews(id);
  }

  loadMovie(id: number): void {
    this.moviesService.getOne(id).subscribe({
      next: movie => {
        this.movie = movie;
      },
      error: err => {
        console.error('Erro ao carregar filme', err);
        this.errorMessage = 'Não foi possível carregar os dados do filme.';
      }
    });
  }

  loadReviews(id: number): void {
    this.moviesService.getReviewsByMovie(id).subscribe({
      next: reviews => {
        this.reviews = reviews;
      },
      error: err => {
        console.error('Erro ao carregar reviews', err);
        this.errorMessage = 'Não foi possível carregar as reviews.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/Filmes']);
  }

  trackByReview(index: number, review: MovieReviewDto): number {
    return review.id;
  }
}
