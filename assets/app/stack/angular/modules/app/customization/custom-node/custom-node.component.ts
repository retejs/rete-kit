import {
  Component,
  Input,
  HostBinding,
  ChangeDetectorRef,
  OnChanges
} from "@angular/core";
import { type ClassicPreset } from "rete";
/* [angular19]
import { CommonModule } from '@angular/common';
import { RefDirective, ImpureKeyvaluePipe } from 'rete-angular-plugin/19';
[/angular19] */
/* [angular20]
import { CommonModule } from '@angular/common';
import { RefDirective, ImpureKeyvaluePipe } from 'rete-angular-plugin/20';
[/angular20] */

@Component({
  /* [angular19] imports: [CommonModule, RefDirective, ImpureKeyvaluePipe], [/angular19] */
  /* [angular20] imports: [CommonModule, RefDirective, ImpureKeyvaluePipe], [/angular20] */
  templateUrl: "./custom-node.component.html",
  styleUrls: ["./custom-node.component.sass"],
  host: {
    "data-testid": "node"
  }
})
export class CustomNodeComponent implements OnChanges {
  @Input() data!: ClassicPreset.Node;
  @Input() emit!: (data: any) => void;
  @Input() rendered!: () => void;

  seed = 0;

  @HostBinding("class.selected") get selected() {
    return this.data.selected;
  }

  constructor(private cdr: ChangeDetectorRef) {
    this.cdr.detach();
  }

  ngOnChanges(): void {
    this.cdr.detectChanges();
    requestAnimationFrame(() => this.rendered());
    this.seed++; // force render sockets
  }

  sortByIndex(a: any, b: any) {
    const ai = a.value.index || 0;
    const bi = b.value.index || 0;

    return ai - bi;
  }
}
