export interface MovieReviewDto {
  id: number;
  movieId: number;
  rating: number;
  review: string;
  recommended: boolean;
  userName?: string;
}

export interface ReviewFeedItem {
  id: number;
  movieId: number;
  movieTitle: string;
  rating: number;
  review: string;
  recommended: boolean;
  userName?: string;
}

export interface ReviewUpsertResult {
  reviewId: number;
  movieRating: number;
}
