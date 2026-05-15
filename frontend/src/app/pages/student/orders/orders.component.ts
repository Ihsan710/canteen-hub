import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = true;
  pollInterval: any;
  notifiedReadyOrders = new Set<string>();
  toastMessage: string | null = null;
  toastToken: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchMyOrders(true);
    // Poll every 5 seconds for live updates
    this.pollInterval = setInterval(() => {
      this.fetchMyOrders(false);
    }, 5000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  fetchMyOrders(showLoader: boolean = true) {
    if (showLoader) this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        if (showLoader) this.loading = false;

        // Check for newly Ready orders
        data.forEach(order => {
          if (order.status === 'Ready' && !this.notifiedReadyOrders.has(order._id!)) {
            this.notifiedReadyOrders.add(order._id!);
            if (!showLoader) { 
              this.showToast(order.pickupToken || '');
            }
          }
        });
      },
      error: () => {
        if (showLoader) this.loading = false;
      }
    });
  }

  showToast(token: string) {
    this.toastToken = token;
    this.toastMessage = 'Your food is Ready to Pickup!';
    
    // Auto hide after 8 seconds
    setTimeout(() => {
      this.toastMessage = null;
    }, 8000);
  }

  closeToast() {
    this.toastMessage = null;
  }

  getStatusText(status: string): string {
    return status === 'Ready' ? 'Ready to Pickup' : status;
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200';
      case 'Preparing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200';
      case 'Ready': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-pulse';
      case 'Delivered': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }

  markAsPickedUp(orderId: string) {
    this.orderService.markAsPickedUp(orderId).subscribe({
      next: () => {
        this.fetchMyOrders(false);
      },
      error: (err) => console.error('Failed to mark order as picked up:', err)
    });
  }

  reorder(order: Order) {
    const confirmReorder = confirm(`Reorder exactly the same items for ₹${order.totalPrice}?`);
    if (!confirmReorder) return;

    const reorderData = {
      items: order.items,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      paymentStatus: 'Pending'
    };

    this.orderService.createOrder(reorderData).subscribe({
      next: () => {
        this.toastMessage = 'Reorder placed successfully!';
        setTimeout(() => this.toastMessage = null, 3000);
        this.fetchMyOrders(true);
      },
      error: (err) => {
        alert('Failed to place reorder. Items might be unavailable.');
      }
    });
  }
}
