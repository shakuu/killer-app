import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './app.component';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';
import { NavigationComponent } from './navigation/navigation.component';
import { ToastrNotificationOptionsFactoryService } from './services/toastr-notification-options-factory.service';
import { ToastrNotificationService } from './services/toastr-notification.service';
import { ToastrNotificationsHandlerComponent } from './toastr-notifications-handler/toastr-notifications-handler.component';
import { UserService } from './services/user.service';
import { UsersModule } from './users/users.module';
import { UserStorageService } from './services/user-storage.service';

export function toastOptionsFactory() {
  return new ToastOptions({
    positionClass: 'toast-bottom-right',
    animate: 'flyRight'
  });
}

/** MOCK */
// import { MockedModule } from './mocked-module/mocked.module'
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ToastrNotificationsHandlerComponent
  ],
  imports: [
    // MockedModule,
    BrowserModule,
    FormsModule,
    HomeModule,
    HttpModule,
    UsersModule,
    ToastModule.forRoot(toastOptionsFactory()),
    RouterModule.forRoot([
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: '**', redirectTo: '/', pathMatch: 'full' }
    ],
      { useHash: true })
  ],
  providers: [
    CookieService,
    ToastrNotificationOptionsFactoryService,
    ToastrNotificationService,
    UserService,
    UserStorageService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
