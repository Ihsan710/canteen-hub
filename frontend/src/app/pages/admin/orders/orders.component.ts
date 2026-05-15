import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { OrderService, Order } from '../../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  statusOptions = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateStatus(orderId: string, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        const order = this.orders.find(o => o._id === orderId);
        if (order) order.status = status;
      },
      error: () => {
        alert('Failed to update status');
        this.fetchOrders();
      }
    });
  }

  quickMarkReady(orderId: string) {
    this.orderService.updateOrderStatus(orderId, 'Ready').subscribe({
      next: () => {
        const order = this.orders.find(o => o._id === orderId);
        if (order) order.status = 'Ready';
      },
      error: () => {
        alert('Failed to update status');
        this.fetchOrders();
      }
    });
  }
}
