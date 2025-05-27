import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})
export class SectionsComponent implements OnInit {
  test : Date = new Date();
  focus :any;
  focus1 :any;
  focus2 :any;
  constructor() { }

  ngOnInit() {}
}
