import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { AuthService } from 'src/app/Services/Auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isCollapsed = true;
  private lastPoppedUrl: string = "";
  private yScrollStack: number[] = [];

  constructor(
    public location: Location,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
      if (event instanceof NavigationStart) {
        if (event.url !== this.lastPoppedUrl) {
          this.yScrollStack.push(window.scrollY);
        }
      } else if (event instanceof NavigationEnd) {
        if (event.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = '';
          window.scrollTo(0, this.yScrollStack.pop()!);
        } else {
          window.scrollTo(0, 0);
        }
      }
    });

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url!;
    });
  }

  isHome() {
    return this.location.prepareExternalUrl(this.location.path()) === '#/home';
  }

  isDocumentation() {
    return this.location.prepareExternalUrl(this.location.path()) === '#/documentation';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  DadosConta() {
    this.router.navigate(['/Testes']);
  }
}
