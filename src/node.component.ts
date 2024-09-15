import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Signal,
  computed,
  effect,
  signal,
  DoCheck,
  input,
  Injector,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-node",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div
      [ngStyle]="{
        'background-color': getColorByLevel(level()),
        border: '1px solid black',
        padding: '10px'
      }"
      style="margin-bottom: 10px;"
    >
      {{ logCd() }}
      <p>Level: {{ level() }}</p>
      <p>Change Detection Runs: {{ localChangeDetectionRuns }}</p>
      <p>Counter: {{ counter() }}</p>

      Counter Button

      <button (click)="incrementCounter()">Increment Counter</button>

      <!-- Timer Controls -->
      <div>
        <button *ngIf="!isTimerRunning()" (click)="startTimer()">
          Start Timer
        </button>
        <button *ngIf="isTimerRunning()" (click)="stopTimer()">
          Stop Timer
        </button>
      </div>

      <!-- Add Subnodes -->
      <label for="subnodes">Add Subnodes: </label>
      <input type="number" [(ngModel)]="childrenToAdd" />

      <button (click)="addChildren()">Add Children</button>

      <!-- Display Subnodes -->

      @for (level of subNodes; track level) {
      <app-node [level]="newLevel()"></app-node>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent {
  level = input<number>(0);
  childrenToAdd = signal<number>(0);
  newLevel = computed(() => this.level() + 1);

  subNodes: number[] = [];
  counter = signal(0);
  isTimerRunning = signal(false);
  localChangeDetectionRuns = 0;

  private timer?: any;

  logCd(): void {
    this.localChangeDetectionRuns++;
  }

  incrementCounter(): void {
    this.counter.update((v) => v + 1);
  }

  addChildren(): void {
    const numChildren = this.childrenToAdd();
    this.subNodes = Array.from({ length: numChildren }, (_, i) => i);
  }

  startTimer(): void {
    this.isTimerRunning.set(true);
    this.timer = setInterval(() => this.incrementCounter(), 1000);
  }

  stopTimer(): void {
    clearInterval(this.timer);
    this.isTimerRunning.set(false);
  }

  getColorByLevel(level: number): string {
    const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#FF677D", "#D4A5A5"];
    return colors[level % colors.length];
  }
}
