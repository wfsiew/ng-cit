import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule, ModalModule, BsDatepickerModule } from 'ngx-bootstrap';
import {
  NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION,
  PB_DIRECTION, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule
} from 'ngx-ui-loader';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
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
import { UserService } from './services/user.service';

import { MainDashboardComponent } from './components/dashboard/main-dashboard/main-dashboard.component';
import { ListDashboardComponent } from './components/dashboard/list-dashboard/list-dashboard.component';
import { DetailDashboardComponent } from './components/dashboard/detail-dashboard/detail-dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CreateShipmentComponent } from './components/shipment/create-shipment/create-shipment.component';
import { CreateMultipleShipmentComponent } from './components/shipment/create-multiple-shipment/create-multiple-shipment.component';
import { DetailShipmentComponent } from './components/shipment/detail-shipment/detail-shipment.component';
import { ListShipmentComponent } from './components/shipment/list-shipment/list-shipment.component';
import { ListManifestComponent } from './components/manifest/list-manifest/list-manifest.component';
import { DetailManifestComponent } from './components/manifest/detail-manifest/detail-manifest.component';
import { CreateAddressBookComponent } from './components/address-book/create-address-book/create-address-book.component';
import { ListAddressBookComponent } from './components/address-book/list-address-book/list-address-book.component';
import { AddressBookModalComponent } from './shared/components/address-book-modal/address-book-modal.component';
import { CreateCompanyComponent } from './components/company/create-company/create-company.component';
import { ListCompanyComponent } from './components/company/list-company/list-company.component';
import { CreateCompanyProfileComponent } from './components/company-profile/create-company-profile/create-company-profile.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
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
    RegisterComponent,
    FooterComponent,
    HomeComponent,
    MainDashboardComponent,
    ListDashboardComponent,
    DetailDashboardComponent,
    UserProfileComponent,
    CreateShipmentComponent,
    CreateMultipleShipmentComponent,
    DetailShipmentComponent,
    ListShipmentComponent,
    ListManifestComponent,
    DetailManifestComponent,
    CreateAddressBookComponent,
    ListAddressBookComponent,
    AddressBookModalComponent,
    CreateCompanyComponent,
    ListCompanyComponent,
    CreateCompanyProfileComponent,
    MainDashboardComponent,
    ListDashboardComponent,
    ListUserComponent,
    CreateUserModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PaginationModule.forRoot(),
    ModalModule .forRoot(),
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
    UserService,
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
    CreateUserModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
