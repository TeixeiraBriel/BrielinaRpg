import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewFeedItem } from '../../Interfaces/MovieReviewDto';
import { MoviesService } from 'src/app/Services/Movies/movies.service';

@Component({
  selector: 'app-reviews-feed',
  templateUrl: './reviews-feed.component.html',
  styleUrls: ['./reviews-feed.component.scss']
})
export class ReviewsFeedComponent implements OnInit {
  reviewsFeed: ReviewFeedItem[] = [];
  isLoadingFeed = true;
  errorMessage = '';

  constructor(
    private moviesService: MoviesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    this.isLoadingFeed = true;
    this.errorMessage = '';

    this.moviesService.getAllReviewsFeed().subscribe({
      next: reviews => {
        this.reviewsFeed = reviews.sort((a, b) => b.id - a.id);
        this.isLoadingFeed = false;
      },
      error: err => {
        console.error('Erro ao carregar o feed de reviews', err);
        this.errorMessage = 'Não foi possível carregar o feed de reviews.';
        this.isLoadingFeed = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/Filmes']);
  }

  trackByReview(index: number, review: ReviewFeedItem): number {
    return review.movieId * 10000 + review.id;
  }
}
