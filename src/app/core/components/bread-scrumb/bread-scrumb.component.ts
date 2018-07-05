import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: 'app-bread-scrumb',
  templateUrl: './bread-scrumb.component.html',
  styleUrls: ['./bread-scrumb.component.scss']
})
export class BreadScrumbComponent implements OnInit {

  @Input() breadcrumbs: Object[];

  constructor(
  ) {
  }

  ngOnInit() {
    if(!this.breadcrumbs) {
      this.breadcrumbs = [];
    }
  }
}