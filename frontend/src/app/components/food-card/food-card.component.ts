import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem } from '../../services/food.service';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.css']
})
export class FoodCardComponent {
  @Input() food!: FoodItem;
  @Output() addToCart = new EventEmitter<FoodItem>();

  onAdd() {
    this.addToCart.emit(this.food);
  }
}
