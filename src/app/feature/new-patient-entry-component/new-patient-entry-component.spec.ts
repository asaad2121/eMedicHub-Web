import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewPatientEntryComponent } from "./new-patient-entry-component";
import { UserStreamService } from "../../shared/services/user-stream.service";
import { MockUserStreamService } from "../../core/mock-services";

describe("NewPatientEntryComponent", () => {
  let component: NewPatientEntryComponent;
  let fixture: ComponentFixture<NewPatientEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPatientEntryComponent],
      providers: [
        { provide: UserStreamService, useClass: MockUserStreamService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPatientEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
