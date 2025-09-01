import { TestBed } from "@angular/core/testing";
import { App } from "./app";
import { UserStreamService } from "./shared/services/user-stream.service";
import { MockUserService, MockUserStreamService } from "./core/mock-services";

describe("App", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: UserStreamService, useClass: MockUserStreamService },
      ],
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
