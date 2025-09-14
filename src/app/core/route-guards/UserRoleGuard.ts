import { inject } from "@angular/core";
import { CanActivateFn, ActivatedRouteSnapshot, Router } from "@angular/router";
import { mapUserResponseTypeToUserType } from "../../shared/utils";

export const userRoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const currentUserString = localStorage.getItem("currentUser");

  if (!currentUserString) {
    // This should ideally be caught by loggedInUserGuard, but we double-check.
    router.navigate(["/login"]);
    return false;
  }

  const currentUserType = mapUserResponseTypeToUserType(
    JSON.parse(currentUserString).type,
  ).toLowerCase();
  const routeRole = route.params["role"];

  if (currentUserType === routeRole) {
    // User's role matches the role in the URL, allow access.
    return true;
  } else {
    // User's role does not match, redirect to error page.
    router.navigate(["/error"]);
    return false;
  }
};
