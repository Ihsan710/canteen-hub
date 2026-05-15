import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FoodService, FoodItem } from '../../../services/food.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuItems: FoodItem[] = [];
  loading = true;
  isModalOpen = false;
  menuForm: FormGroup;
  editingId: string | null = null;

  categories = ['Breakfast', 'Lunch', 'Snacks', 'Beverages'];

  constructor(private foodService: FoodService, private fb: FormBuilder) {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Lunch', Validators.required],
      image: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [10, [Validators.required, Validators.min(0)]],
      availability: [true],
      offer: [0, [Validators.min(0), Validators.max(100)]],
      isSpecial: [false],
      tagVeg: [false],
      tagNonVeg: [false],
      tagGlutenFree: [false],
      tagSpicy: [false],
      tagSpecialCombo: [false]
    });
  }

  ngOnInit() {
    this.fetchMenu();
  }

  fetchMenu() {
    this.loading = true;
    this.foodService.getAllFood().subscribe(items => {
      this.menuItems = items;
      this.loading = false;
    });
  }

  openModal(item?: FoodItem) {
    this.isModalOpen = true;
    if (item) {
      this.editingId = item._id!;
      const formValue = { ...item } as any;
      const tags = item.tags || [];
      formValue.tagVeg = tags.includes('Veg');
      formValue.tagNonVeg = tags.includes('Non-Veg');
      formValue.tagGlutenFree = tags.includes('Gluten-Free');
      formValue.tagSpicy = tags.includes('Spicy');
      formValue.tagSpecialCombo = tags.includes('Combo');
      this.menuForm.patchValue(formValue);
    } else {
      this.editingId = null;
      this.menuForm.reset({ 
        category: 'Lunch', price: 0, stock: 10, availability: true, offer: 0, isSpecial: false,
        tagVeg: false, tagNonVeg: false, tagGlutenFree: false, tagSpicy: false, tagSpecialCombo: false
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    if (this.menuForm.invalid) return;

    const formValue = { ...this.menuForm.value };
    const tags: string[] = [];
    if (formValue.tagVeg) tags.push('Veg');
    if (formValue.tagNonVeg) tags.push('Non-Veg');
    if (formValue.tagGlutenFree) tags.push('Gluten-Free');
    if (formValue.tagSpicy) tags.push('Spicy');
    if (formValue.tagSpecialCombo) tags.push('Combo');

    formValue.tags = tags;
    delete formValue.tagVeg;
    delete formValue.tagNonVeg;
    delete formValue.tagGlutenFree;
    delete formValue.tagSpicy;
    delete formValue.tagSpecialCombo;

    if (this.editingId) {
      this.foodService.updateFood(this.editingId, formValue).subscribe(() => {
        this.fetchMenu();
        this.closeModal();
      });
    } else {
      this.foodService.createFood(formValue).subscribe(() => {
        this.fetchMenu();
        this.closeModal();
      });
    }
  }

  deleteItem(id: string) {
    if (confirm('Are you sure you want to delete this food item?')) {
      this.foodService.deleteFood(id).subscribe(() => {
        this.fetchMenu();
      });
    }
  }
}
