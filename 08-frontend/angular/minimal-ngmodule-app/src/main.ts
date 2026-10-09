
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule)]
}).catch(console.error);