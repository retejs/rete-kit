import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CustomSocketComponent } from "./customization/custom-socket/custom-socket.component"
import { CustomNodeComponent } from "./customization/custom-node/custom-node.component"
import { CustomConnectionComponent } from "./customization/custom-connection/custom-connection.component";
/* [angular12] import { ReteModule } from 'rete-angular-plugin/12'; [/angular12] */
/* [angular13] import { ReteModule } from 'rete-angular-plugin/13'; [/angular13] */
/* [angular14] import { ReteModule } from 'rete-angular-plugin/14'; [/angular14] */
/* [angular15] import { ReteModule } from 'rete-angular-plugin/15'; [/angular15] */
/* [angular16] import { ReteModule } from 'rete-angular-plugin/16'; [/angular16] */
/* [angular17] import { ReteModule } from 'rete-angular-plugin/17'; [/angular17] */
/* [angular18] import { ReteModule } from 'rete-angular-plugin/18'; [/angular18] */
/* [angular19] import { ReteModule } from 'rete-angular-plugin/19'; [/angular19] */

@NgModule({
  declarations: [
    AppComponent,
    CustomSocketComponent,
    CustomNodeComponent,
    CustomConnectionComponent
  ],
  imports: [
    BrowserModule,
    /* [angular-render] ReteModule [/angular-render] */
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
