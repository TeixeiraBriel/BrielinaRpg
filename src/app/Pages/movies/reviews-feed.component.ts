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
  currentPage = 1;
  pageSize = 10;
  sortMode: 'newest' | 'rating' = 'newest';

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
    this.currentPage = 1;

    this.moviesService.getAllReviewsFeed().subscribe({
      next: reviews => {
        this.reviewsFeed = reviews;
        this.isLoadingFeed = false;
      },
      error: err => {
        console.error('Erro ao carregar o feed de reviews', err);
        this.errorMessage = 'Não foi possível carregar o feed de reviews.';
        this.isLoadingFeed = false;
      }
    });
  }

  get sortedReviews(): ReviewFeedItem[] {
    return [...this.reviewsFeed].sort((a, b) => {
      if (this.sortMode === 'rating') {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
      }

      return b.id - a.id;
    });
  }

  get pagedReviews(): ReviewFeedItem[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.sortedReviews.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedReviews.length / this.pageSize));
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  setSortMode(mode: 'newest' | 'rating'): void {
    this.sortMode = mode;
    this.currentPage = 1;
  }

  goBack(): void {
    this.router.navigate(['/Filmes']);
  }

  trackByReview(index: number, review: ReviewFeedItem): number {
    return review.movieId * 10000 + review.id;
  }
}
