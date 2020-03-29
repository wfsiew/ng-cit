import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListManifestComponent } from './list-manifest/list-manifest.component';
import { DetailManifestComponent } from './detail-manifest/detail-manifest.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  { path: 'list', component: ListManifestComponent, canActivate: [AuthGuardService] },
  { path: 'detail/:manifest_no/:company_id', component: DetailManifestComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManifestRoutingModule { }
