import { AfterViewInit, Component, ElementRef, Injector, ViewChild } from '@angular/core'

import { createEditor } from './rete'

@Component({
  selector: 'app-root',
  templateUrl:
    /* [!angular20] './app.component.html', [/!angular20] */
    /* [angular20] './app.html', [/angular20] */
  styleUrls: [
    /* [!angular20] './app.component.css', [/!angular20] */
    /* [angular20] './app.css', [/angular20] */
    './common.css'
  ]
})
export class /* [!angular20] AppComponent [/!angular20] *//* [angular20] App [/angular20] */ implements AfterViewInit {
  title = 'angular'
  @ViewChild('rete') container!: ElementRef<HTMLElement>

  constructor(private injector: Injector) { }

  async ngAfterViewInit() {
    await createEditor(this.container.nativeElement, this.injector)
  }
}
