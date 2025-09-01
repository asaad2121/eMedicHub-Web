import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddNewOrder } from "./add-new-order";
import { UserStreamService } from "../../shared/services/user-stream.service";
import {
  MockMedicineService,
  MockUserStreamService,
} from "../../core/mock-services";
import { MedicineService } from "../../shared/services/medicine.service";

describe("AddNewOrder", () => {
  let component: AddNewOrder;
  let fixture: ComponentFixture<AddNewOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewOrder],
      providers: [{ provide: MedicineService, useClass: MockMedicineService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
