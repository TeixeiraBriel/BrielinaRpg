import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { MovieItem } from '../../Interfaces/MovieItem';
import { MoviesService } from '../../Services/Movies/movies.service';
import { MoviesComponent } from './movies.component';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let router: jasmine.SpyObj<Router>;
  let moviesService: jasmine.SpyObj<MoviesService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const moviesServiceSpy = jasmine.createSpyObj('MoviesService', ['getAll', 'getMyReviews']);
    const offcanvasSpy = jasmine.createSpyObj('NgbOffcanvas', ['open', 'dismiss']);

    await TestBed.configureTestingModule({
      declarations: [MoviesComponent],
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: NgbOffcanvas, useValue: offcanvasSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    moviesService = TestBed.inject(MoviesService) as jasmine.SpyObj<MoviesService>;

    moviesService.getAll.and.returnValue(of([]));
    moviesService.getMyReviews.and.returnValue(of([]));

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to the movie reviews page when the user opens reviews for a specific movie', () => {
    const movie: MovieItem = {
      id: 7,
      title: 'Interstellar',
      genre: 'Sci-Fi',
      year: 2014,
      rating: 9.2,
      posterUrl: 'https://example.com/poster.jpg',
      directedBy: 'Christopher Nolan',
      sinopse: 'A space odyssey.'
    };

    component.viewMovieReviews(movie);

    expect(router.navigate).toHaveBeenCalledWith(['/Filmes', movie.id, 'reviews']);
  });
});
