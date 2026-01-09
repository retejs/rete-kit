import { AfterViewInit, Component, ElementRef, Injector, ViewChild } from '@angular/core'

import { createEditor } from './rete'

@Component({
  selector: 'app-root',
  templateUrl:
    /* [angular12] './app.component.html', [/angular12] */
    /* [angular13] './app.component.html', [/angular13] */
    /* [angular14] './app.component.html', [/angular14] */
    /* [angular15] './app.component.html', [/angular15] */
    /* [angular16] './app.component.html', [/angular16] */
    /* [angular17] './app.component.html', [/angular17] */
    /* [angular18] './app.component.html', [/angular18] */
    /* [angular19] './app.component.html', [/angular19] */
    /* [angular20] './app.html', [/angular20] */
    /* [angular21] './app.html', [/angular21] */
  styleUrls: [
    /* [angular12] './app.component.css', [/angular12] */
    /* [angular13] './app.component.css', [/angular13] */
    /* [angular14] './app.component.css', [/angular14] */
    /* [angular15] './app.component.css', [/angular15] */
    /* [angular16] './app.component.css', [/angular16] */
    /* [angular17] './app.component.css', [/angular17] */
    /* [angular18] './app.component.css', [/angular18] */
    /* [angular19] './app.component.css', [/angular19] */
    /* [angular20] './app.css', [/angular20] */
    /* [angular21] './app.css', [/angular21] */
    './common.css'
  ]
})
export class /* [angular12] AppComponent [/angular12] *//* [angular13] AppComponent [/angular13] *//* [angular14] AppComponent [/angular14] *//* [angular15] AppComponent [/angular15] *//* [angular16] AppComponent [/angular16] *//* [angular17] AppComponent [/angular17] *//* [angular18] AppComponent [/angular18] *//* [angular19] AppComponent [/angular19] *//* [angular20] App [/angular20] *//* [angular21] App [/angular21] */ implements AfterViewInit {
  title = 'angular'
  @ViewChild('rete') container!: ElementRef<HTMLElement>

  constructor(private injector: Injector) { }

  async ngAfterViewInit() {
    await createEditor(this.container.nativeElement, this.injector)
  }
}
