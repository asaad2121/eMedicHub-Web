import { inject } from "@angular/core";
import { CanActivateFn, ActivatedRouteSnapshot, Router } from "@angular/router";

export const userRoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const currentUserString = localStorage.getItem("currentUser");

  if (!currentUserString) {
    // This should ideally be caught by loggedInUserGuard, but we double-check.
    router.navigate(["/login"]);
    return false;
  }

  const currentUser = JSON.parse(currentUserString);
  const routeRole = route.params["role"];

  if (currentUser.type === routeRole) {
    // User's role matches the role in the URL, allow access.
    return true;
  } else {
    // User's role does not match, redirect.
    router.navigate(["/"]);
    return false;
  }
};
