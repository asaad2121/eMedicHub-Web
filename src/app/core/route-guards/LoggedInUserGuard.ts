import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const loggedInUserGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    return true;
  } else {
    // User is not logged in
    router.navigate(["/"]);
    return false;
  }
};
