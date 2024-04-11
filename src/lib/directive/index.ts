import type { App } from "vue";
import { lazyImgDirective } from "./lazyImg";

export function setupDirective(app: App) {
  lazyImgDirective(app);
}
