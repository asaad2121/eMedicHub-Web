import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmhDashboardComponent } from "./emh-dashboard-component";
import { MockUserStreamService } from "../../../core/mock-services";
import { UserStreamService } from "../../services/user-stream.service";

describe("EmhDashboardComponent", () => {
  let component: EmhDashboardComponent;
  let fixture: ComponentFixture<EmhDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmhDashboardComponent],
      providers: [
        { provide: UserStreamService, useClass: MockUserStreamService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmhDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
