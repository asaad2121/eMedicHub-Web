import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewOrder } from "./view-order";
import {
  MockOrderService,
  MockUserStreamService,
} from "../../core/mock-services";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { OrderService } from "../../shared/services/order.service";

describe("ViewOrder", () => {
  let component: ViewOrder;
  let fixture: ComponentFixture<ViewOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: UserStreamService, useClass: MockUserStreamService },
        { provide: OrderService, useClass: MockOrderService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
