import {
  Component,
  Signal,
  computed,
  effect,
  signal,
  inject,
  ApplicationRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  bootstrapApplication,
  enableDebugTools,
} from '@angular/platform-browser';
import { NodeComponent } from './node.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NodeComponent, CommonModule, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Performance Test (Signals)</h1>
    <p>Total Change Detection Cycles: {{ changeDetectionCycles() }}</p>

    <!-- Input for setting levels dynamically -->
    <label for="levels">Set Levels: </label>
    <input type="number" [value]="maxLevel()" (input)="setMaxLevel(maxLevel())" />

    <button (click)="updateValue()">Update Value</button>

    <!-- Render Nodes -->
    <div class="node-wrapper">
      <app-node 
        *ngFor="let level of levels()" 
        [level]="level" 
        [value]="value"
        [childrenToAdd]="childrenToAdd">
      </app-node>
    </div>
  `,
  styles: [
    `
    .node-wrapper { display: flex; flex-wrap: wrap; justify-content: space-around; }
  `,
  ],
})
export class AppComponent {
  value = signal<number>(1); // Using signal to hold value
  maxLevel = signal<number>(5); // Signal for max levels
  childrenToAdd = signal<number>(0); // Signal for adding subnodes dynamically
  changeDetectionCycles = signal<number>(0); // Signal for counting CD cycles

  // Levels computed based on maxLevel signal
  levels = computed(() =>
    Array.from({ length: this.maxLevel() }, (_, i) => i + 1)
  );

  constructor() {
    const appRef = inject(ApplicationRef);
    const originalTick = appRef.tick;

    appRef.tick = () => {
      const before = performance.now();
      originalTick.apply(appRef);
      const after = performance.now();
      this.changeDetectionCycles.update((v) => v + 1);
      console.log(`Change Detection cycle took: ${after - before} ms`);
    };
  }

  // Method to profile and show change detection cycles

  // Update the value signal with a random number
  updateValue() {
    this.value.set(Math.random() * 100);
  }

  // Update max levels signal
  setMaxLevel(level: number) {
    this.maxLevel.set(Number(level) || 1);
  }
}

bootstrapApplication(AppComponent).then((moduleRef) => {
  const appRef = moduleRef.injector.get(ApplicationRef);
  const componentRef = appRef.components[0];

  // Enabling Angular debug tools (CD profiler, etc.)
  enableDebugTools(componentRef);

  // Log to console when Angular debug tools are enabled
  console.log('Angular debug tools enabled');
});
