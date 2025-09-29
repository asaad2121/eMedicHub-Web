import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "emh-loading-component",
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: "./emh-loading-component.html",
  styleUrl: "./emh-loading-component.less",
})
export class EmhLoadingComponent {
  /**
   * Controls the visibility of the spinner. Set to `true` to show, `false` to hide.
   * This is the primary input to control the spinner from a parent component.
   */
  @Input() isLoading: boolean = true;

  /**
   * The diameter of the spinner in pixels. Defaults to 50.
   */
  @Input() diameter: number = 50;

  /**
   * The stroke width of the spinner in pixels. Defaults to 5.
   */
  @Input() strokeWidth: number = 5;

  /**
   * The color of the spinner. Can be 'primary', 'accent', 'warn', or a custom color string.
   */
  @Input() color: "primary" | "accent" | "warn" | string = "primary";

  /**
   * Determines if the spinner should cover the full screen or its parent.
   * If `true`, it will take a fixed position covering the viewport.
   * If `false`, it will take an absolute position covering its nearest positioned ancestor.
   */
  @Input() fullscreen: boolean = false;
}
