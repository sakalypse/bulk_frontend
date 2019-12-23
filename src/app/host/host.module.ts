import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HostPageRoutingModule } from './host-routing.module';

import { HostPage } from './host.page';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HostPageRoutingModule,
    ChartsModule
  ],
  declarations: [HostPage]
})
export class HostPageModule {}
