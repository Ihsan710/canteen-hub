import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FoodCardComponent } from '../../../components/food-card/food-card.component';
import { FoodService, FoodItem } from '../../../services/food.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, FoodCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  menuItems: FoodItem[] = [];
  categories: string[] = ['All', 'Kerala', 'Indian', 'Snacks', 'Beverages'];
  activeCategory = 'All';
  
  dietaryTags: string[] = ['All', 'Veg', 'Non-Veg', 'Spicy', 'Gluten-Free', 'Combo'];
  activeDietaryTag = 'All';
  
  loading = true;

  get filteredMenu() {
    if (this.activeDietaryTag === 'All') return this.menuItems;
    return this.menuItems.filter(item => item.tags && item.tags.includes(this.activeDietaryTag));
  }

  setDietaryTag(tag: string) {
    this.activeDietaryTag = tag;
  }

  cart: { item: FoodItem, quantity: number }[] = [];
  isCartOpen = false;
  pollInterval: any;
  notifiedReadyOrders = new Set<string>();
  toastMessage: string | null = null;
  toastToken: string | null = null;

  constructor(
    private foodService: FoodService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.fetchMenu();
    // Poll for order status updates in background
    this.pollInterval = setInterval(() => {
      this.orderService.getMyOrders().subscribe(data => {
        data.forEach(order => {
          if (order.status === 'Ready' && !this.notifiedReadyOrders.has(order._id!)) {
            this.notifiedReadyOrders.add(order._id!);
            this.showToast(order.pickupToken || '');
          }
        });
      });
    }, 5000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  showToast(token: string) {
    this.toastToken = token;
    this.toastMessage = 'Your food is Ready to Pickup!';
    setTimeout(() => {
      this.toastMessage = null;
    }, 8000);
  }

  closeToast() {
    this.toastMessage = null;
  }

  fetchMenu(category?: string) {
    this.loading = true;
    const catQuery = category !== 'All' ? category : undefined;
    this.foodService.getAllFood(catQuery).subscribe({
      next: (data) => {
        this.menuItems = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
    this.fetchMenu(cat);
  }

  addToCart(food: FoodItem) {
    const existing = this.cart.find(c => c.item._id === food._id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ item: food, quantity: 1 });
    }
    this.isCartOpen = true;
  }

  removeFromCart(foodId: string) {
    this.cart = this.cart.filter(c => c.item._id !== foodId);
  }

  get cartTotal() {
    return this.cart.reduce((total, c) => total + (c.item.price * c.quantity), 0);
  }

  placeOrder(method: string) {
    if (this.cart.length === 0) return;

    const orderData = {
      items: this.cart.map(c => ({
        foodId: c.item._id!,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity
      })),
      totalPrice: this.cartTotal,
      paymentMethod: method === 'UPI' ? 'UPI' : 'Cash on Pickup',
      paymentStatus: method === 'UPI' ? 'Paid' : 'Pending'
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (res) => {
        alert(`Order placed! Your pickup token is: ${res.pickupToken}`);
        this.cart = [];
        this.isCartOpen = false;
      },
      error: (err) => {
        alert('Failed to place order');
      }
    });
  }
}
