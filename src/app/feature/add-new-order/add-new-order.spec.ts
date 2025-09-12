import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddNewOrder } from "./add-new-order";
import { UserStreamService } from "../../shared/services/user-stream.service";
import {
  MockMedicineService,
  MockUserStreamService,
} from "../../core/mock-services";
import { MedicineService } from "../../shared/services/medicine.service";
import { RouterTestingModule } from "@angular/router/testing";
import { provideLocationMocks } from "@angular/common/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

describe("AddNewOrder", () => {
  let component: AddNewOrder;
  let fixture: ComponentFixture<AddNewOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewOrder],     
      
      providers: [provideHttpClient(),
        { provide: MedicineService, useClass: MockMedicineService },
        provideRouter([        
        { path: 'add-new-order/:id', component: AddNewOrder },        
      ]),
      provideLocationMocks()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
