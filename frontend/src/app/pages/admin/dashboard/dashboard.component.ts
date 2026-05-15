import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { OrderService, Order } from '../../../services/order.service';
import { FoodService, FoodItem } from '../../../services/food.service';

@Component({
  selector: 'app-dashboard',

  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalOrders: 0,
    revenue: 0,
    monthlyRevenue: 0,
    totalFoodItems: 0,
    pendingOrders: 0
  };

  recentOrders: Order[] = [];
  allOrders: Order[] = [];
  loading = true;

  trendingItems: { name: string, quantity: number }[] = [];

  constructor(
    private orderService: OrderService,
    private foodService: FoodService
  ) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.orderService.getAllOrders().subscribe(orders => {
      this.allOrders = orders;
      this.recentOrders = orders.slice(0, 5); // Show top 5 recent orders
      this.stats.totalOrders = orders.length;
      this.stats.pendingOrders = orders.filter(o => o.status === 'Pending').length;
      this.stats.revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      this.stats.monthlyRevenue = orders
        .filter(o => {
          if(!o.createdAt) return false;
          const d = new Date(o.createdAt);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((acc, order) => acc + order.totalPrice, 0);
      
      // Calculate Trending Items
      const itemCounts: { [name: string]: number } = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          if (itemCounts[item.name]) {
            itemCounts[item.name] += item.quantity;
          } else {
            itemCounts[item.name] = item.quantity;
          }
        });
      });
      
      this.trendingItems = Object.keys(itemCounts)
        .map(name => ({ name, quantity: itemCounts[name] }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5); // Top 5 trending

      this.foodService.getAllFood().subscribe(food => {
        this.stats.totalFoodItems = food.length;
        this.loading = false;
      });
    });
  }

  downloadReport() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Customer Name,Role,Status,Payment Method,Total Price,Date\n";

    this.allOrders.forEach(order => {
      const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
      const name = order.userId?.name || 'Unknown';
      const role = order.userId?.role || 'User';
      const row = `${order._id},${name},${role},${order.status},${order.paymentMethod},${order.totalPrice},${date}`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `canteen_revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
