export interface MovieReviewDto {
  id: number;
  movieId: number;
  rating: number;
  review: string;
  recommended: boolean;
  userName?: string;
}

export interface ReviewUpsertResult {
  reviewId: number;
  movieRating: number;
}
