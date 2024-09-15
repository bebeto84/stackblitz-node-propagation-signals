import {
  Component,
  Signal,
  computed,
  effect,
  signal,
  inject,
  ApplicationRef,
  ChangeDetectionStrategy,
  WritableSignal,
} from "@angular/core";
import {
  bootstrapApplication,
  enableDebugTools,
} from "@angular/platform-browser";
import { NodeComponent } from "./node.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [NodeComponent, CommonModule, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Performance Test (Signals)</h1>
    <p>Total Change Detection Cycles: {{ changeDetectionCycles() }}</p>

    <!-- Input for setting levels dynamically -->
    <label for="levels">Set Levels: </label>
    <input type="number" [(ngModel)]="maxLevel" />

    <!-- Render Nodes -->
    <div class="node-wrapper">
      @for (level of levels(); track level) {
      <app-node [level]="level"> </app-node>

      }
    </div>
  `,
  styles: [
    `
      .node-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }
    `,
  ],
})
export class AppComponent {
  maxLevel = signal<number>(0); // Signal for max levels

  changeDetectionCycles = signal<number>(0); // Signal for counting CD cycles

  // Levels computed based on maxLevel signal
  levels = computed(() =>
    Array(this.maxLevel())
      .fill(0)
      .map((_, i) => i)
  );

  todos = signal<number[]>([]);

  constructor() {}

  // Method to profile and show change detection cycles
}

bootstrapApplication(AppComponent).then((moduleRef) => {
  const appRef = moduleRef.injector.get(ApplicationRef);
  const componentRef = appRef.components[0];

  // Enabling Angular debug tools (CD profiler, etc.)
  enableDebugTools(componentRef);

  // Log to console when Angular debug tools are enabled
  console.log("Angular debug tools enabled");
});
