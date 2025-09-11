import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Order, GroupedOrder, OrderStatus } from "../../../shared/DTO/orders";
import { User, UserResponseTypes, UserTypes } from "../../../shared/DTO/user";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatTooltip } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { OrderStreamService } from "../../../shared/services/order-stream.service";
import { EmhLoadingComponent } from "../../../shared/components/emh-loading-component/emh-loading-component";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import {
  MatFormField,
  MatInput,
  MatInputModule,
  MatLabel,
} from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { Subject } from "rxjs/internal/Subject";
import { debounceTime } from "rxjs/internal/operators/debounceTime";
import { MatFormFieldModule } from "@angular/material/form-field";
import { OrderService } from "../../../shared/services/order.service";
import { MatDialog } from "@angular/material/dialog";
import { OrderDetailsDialog } from "../../../shared/components/dialog/order-details-dialog/order-details-dialog";

@Component({
  selector: "order-table-component",
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    EmhLoadingComponent,
    MatFormFieldModule,
    MatFormField,
    MatInputModule,

    FormsModule,
  ],
  templateUrl: "./order-table-component.html",
  styleUrl: "./order-table-component.less",
})
export class OrderTableComponent implements OnInit, OnChanges {
  @Input()
  user!: User;

  @Input() orders!: Order[];

  public groupedOrders: GroupedOrder[] = [];

  public searchText = "";
  private searchSubject = new Subject<string>();

  public loading: boolean = false;

  public displayedColumns: string[] = [];

  // Expose enum to template
  UserTypes = UserResponseTypes;
  OrderStatus = OrderStatus;

  constructor(
    private router: Router,
    private orderStreamService: OrderStreamService,
    private orderService: OrderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.groupedOrders = this.groupOrders(this.orders);

    this.searchSubject.pipe(debounceTime(300)).subscribe((text) => {
      this.searchOrdersByPatient(text);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["user"]) {
      this.setDisplayedColumns();
    }
  }

  private setDisplayedColumns(): void {
    const allColumnsInOrder = [
      "appointment_id",
      "order_ids",
      "patient_name",
      "doctor_name",
      "pharma_name",
      "status",
      "total_price",
      "actions",
    ];

    if (this.user.type === UserResponseTypes.PATIENT) {
      this.displayedColumns = allColumnsInOrder.filter(
        (col) => col !== "patient_name",
      );
    } else if (this.user.type === UserResponseTypes.DOCTOR) {
      this.displayedColumns = allColumnsInOrder.filter(
        (col) => col !== "doctor_name",
      );
    } else if (this.user.type === UserResponseTypes.PHARMACY) {
      this.displayedColumns = allColumnsInOrder.filter(
        (col) => col !== "pharma_name",
      );
    }
  }

  private groupOrders(orders: Order[]): GroupedOrder[] {
    const groupedMap = new Map<string, GroupedOrder>();

    for (const order of orders) {
      if (!groupedMap.has(order.appointment_id)) {
        groupedMap.set(order.appointment_id, {
          appointment_id: order.appointment_id,
          order_ids: [],
          doctor_name: order.doctor_name,
          pharma_name: order.pharma_name,
          patient_name: order.patient_name,
          status: order.status,
          total_price: 0,
        });
      }
      const group = groupedMap.get(order.appointment_id);
      if (group) {
        group.order_ids.push(order.id);
        group.total_price += order.price * order.quantity;
      }
    }

    return Array.from(groupedMap.values());
  }

  public viewDetails(order: GroupedOrder) {
    const ordersForAppointment = this.orders.filter(
      (o) => o.appointment_id === order.appointment_id,
    );

    this.dialog.open(OrderDetailsDialog, {
      width: "800px",
      data: ordersForAppointment,
    });
  }

  public async updateStatus(order: GroupedOrder, status: OrderStatus) {
    this.loading = true;

    try {
      await this.orderStreamService.updateOrderStatus(
        this.user.id,
        order.order_ids,
        status,
      );

      const idx = this.groupedOrders.findIndex(
        (o) => o.appointment_id === order.appointment_id,
      );
      if (idx !== -1) {
        this.groupedOrders[idx] = {
          ...this.groupedOrders[idx],
          status,
        };
      }

      this.snackbarService.openSnackbarWithAction("Order status updated");
    } catch (error: any) {
      this.snackbarService.openSnackbarWithAction(
        error.message || "Failed to update order status",
      );
    } finally {
      this.loading = false;
    }
  }

  public onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  public async searchOrdersByPatient(name: string) {
    this.orders = await this.orderService.getOrders(
      this.user.type,
      this.user.id,
      name,
    );
    this.groupedOrders = this.groupOrders(this.orders);
  }
}
