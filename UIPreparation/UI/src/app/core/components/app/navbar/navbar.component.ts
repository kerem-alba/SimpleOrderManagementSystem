import { Component, OnInit, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../admin/login/services/auth.service";
import { SharedService } from "app/core/services/shared.service";
import { TranslateService } from "@ngx-translate/core";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  claim: string;
}
export const ADMINROUTES: RouteInfo[] = [
  {
    path: "/user",
    title: "Users",
    icon: "how_to_reg",
    class: "",
    claim: "GetUsersQuery",
  },
  {
    path: "/group",
    title: "Groups",
    icon: "groups",
    class: "",
    claim: "GetGroupsQuery",
  },
  {
    path: "/operationclaim",
    title: "OperationClaim",
    icon: "local_police",
    class: "",
    claim: "GetOperationClaimsQuery",
  },
  {
    path: "/language",
    title: "Languages",
    icon: "language",
    class: "",
    claim: "GetLanguagesQuery",
  },
  {
    path: "/translate",
    title: "TranslateWords",
    icon: "translate",
    class: "",
    claim: "GetTranslatesQuery",
  },
  {
    path: "/log",
    title: "Logs",
    icon: "update",
    class: "",
    claim: "GetLogDtoQuery",
  },
];

export const USERROUTES: RouteInfo[] = [
  {
    path: "/product",
    title: "Products",
    icon: "local_offer",
    class: "",
    claim: "GetProductsQuery",
  },
  {
    path: "/customer",
    title: "Customers",
    icon: "group",
    class: "",
    claim: "GetCustomersQuery",
  },
  {
    path: "/order",
    title: "Orders",
    icon: "shopping_cart",
    class: "",
    claim: "GetOrdersQuery",
  },
  {
    path: "/stock",
    title: "Stocks",
    icon: "store_mall_directory",
    class: "",
    claim: "GetStocksQuery",
  },
];

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  adminMenuItems: any[];
  userMenuItems: any[];
  userName: string;
  clickEventSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService,
    public translateService: TranslateService
  ) {
    this.clickEventSubscription = this.sharedService
      .getChangeUserNameClickEvent()
      .subscribe(() => {
        this.setUserName();
      });
  }

  isLoggedIn(): boolean {
    return this.authService.loggedIn();
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl("/login");
  }

  help(): void {
    window.open("https://www.devarchitecture.net/", "_blank");
  }
  ngOnInit() {
    console.log(this.userName);
    this.userName = this.authService.getUserName();

    this.adminMenuItems = ADMINROUTES.filter((menuItem) => menuItem);
    this.userMenuItems = USERROUTES.filter((menuItem) => menuItem);

    var lang = localStorage.getItem("lang") || "tr-TR";
    this.translateService.use(lang);
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  setUserName() {
    this.userName = this.authService.getUserName();
  }
  checkClaim(claim: string): boolean {
    return this.authService.claimGuard(claim);
  }
  ngOnDestroy() {
    if (!this.authService.loggedIn()) {
      this.authService.logOut();
      this.router.navigateByUrl("/login");
    }
  }
}
