import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule, ModalModule, BsDatepickerModule } from 'ngx-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {
  NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION,
  PB_DIRECTION, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule
} from 'ngx-ui-loader';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';

import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { HttpTimeoutInterceptor } from './shared/interceptors/timeout.interceptor';
import { MessageService } from './services/message.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { LookupService } from './services/lookup.service';
import { CompanyService } from './services/company.service';
import { AddressBookService } from './services/address-book.service';
import { ShipmentService } from './services/shipment.service';
import { ManifestService } from './services/manifest.service';
import { RetailInboundService } from './services/retail-inbound.service';
import { UserService } from './services/user.service';
import { SocketioService } from './services/socketio.service';

import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChangePwdComponent } from './components/user-profile/change-pwd/change-pwd.component';
import { PrintShipmentModalComponent } from './components/shipment/print-shipment-modal/print-shipment-modal.component';
import { AddressBookModalComponent } from './shared/components/address-book-modal/address-book-modal.component';
import { CreateCompanyProfileComponent } from './components/company-profile/create-company-profile/create-company-profile.component';
import { CreateUserModalComponent } from './components/user/create-user-modal/create-user-modal.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'blue',
  // bgsOpacity: 0.5,
  // bgsPosition: POSITION.bottomCenter,
  // bgsSize: 60,
  bgsType: SPINNER.threeStrings,
  fgsColor: 'blue',
  // fgsPosition: POSITION.centerCenter,
  // fgsSize: 60,
  // fgsType: SPINNER.chasingDots,
  // logoUrl: 'assets/angular.png',
  pbColor: 'blue',
  // pbDirection: PB_DIRECTION.leftToRight,
  // pbThickness: 5,
  // text: 'Welcome to ngx-ui-loader',
  // textColor: '#FFFFFF',
  // textPosition: POSITION.centerCenter
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    FooterComponent,
    HomeComponent,
    UserProfileComponent,
    PrintShipmentModalComponent,
    AddressBookModalComponent,
    CreateCompanyProfileComponent,
    CreateUserModalComponent,
    ChangePwdComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    NgSelectModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    ToastrModule.forRoot()
  ],
  providers: [
    MessageService,
    AuthService,
    AuthGuardService,
    LookupService,
    CompanyService,
    AddressBookService,
    ShipmentService,
    ManifestService,
    RetailInboundService,
    UserService,
    SocketioService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTimeoutInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    AddressBookModalComponent,
    CreateUserModalComponent,
    PrintShipmentModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
