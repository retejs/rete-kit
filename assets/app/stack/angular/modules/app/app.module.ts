import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* [!angular20] import { AppComponent } from './app.component'; [/!angular20] */
/* [angular20] import { App } from './app'; [/angular20] */
/* [!angular20]
import { CustomSocketComponent } from "./customization/custom-socket/custom-socket.component"
import { CustomNodeComponent } from "./customization/custom-node/custom-node.component"
import { CustomConnectionComponent } from "./customization/custom-connection/custom-connection.component";
[/!angular20] */
/* [angular12] import { ReteModule } from 'rete-angular-plugin/12'; [/angular12] */
/* [angular13] import { ReteModule } from 'rete-angular-plugin/13'; [/angular13] */
/* [angular14] import { ReteModule } from 'rete-angular-plugin/14'; [/angular14] */
/* [angular15] import { ReteModule } from 'rete-angular-plugin/15'; [/angular15] */
/* [angular16] import { ReteModule } from 'rete-angular-plugin/16'; [/angular16] */
/* [angular17] import { ReteModule } from 'rete-angular-plugin/17'; [/angular17] */
/* [angular18] import { ReteModule } from 'rete-angular-plugin/18'; [/angular18] */
/* [angular19] import { ReteModule } from 'rete-angular-plugin/19'; [/angular19] */
/* [angular20] import { ReteModule } from 'rete-angular-plugin/20'; [/angular20] */

@NgModule({
  declarations: [
    /* [!angular20]
    AppComponent,
    CustomSocketComponent,
    CustomNodeComponent,
    CustomConnectionComponent
    [/!angular20] */
  ],
  imports: [
    BrowserModule,
    /* [angular-render] ReteModule [/angular-render] */
  ],
  providers: [],
  bootstrap: [
    /* [!angular20] AppComponent [/!angular20] */
    /* [angular20] App [/angular20] */
  ]
})
export class AppModule { }
