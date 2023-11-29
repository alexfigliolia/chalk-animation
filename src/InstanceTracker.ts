import { AutoIncrementingID } from "@figliolia/event-emitter";
import type { Animation } from "./Animation";

export class InstanceTracker {
  ID: string;
  static readonly LOG = console.log;
  static IDs = new AutoIncrementingID();
  static bucket = new Map<string, Animation>();
  constructor() {
    InstanceTracker.clearAll();
    this.ID = InstanceTracker.IDs.get();
    InstanceTracker.bucket.set(this.ID, this.instance);
  }

  static {
    const methods = ["log", "warn", "info", "error"] as const;
    methods.forEach((method) => {
      const original = console[method];
      console[method] = function (...args: Parameters<typeof console.log>) {
        InstanceTracker.clearAll();
        return original.apply(console, args);
      };
    });
  }

  public get instance() {
    return this as unknown as Animation;
  }

  public static clearAll() {
    for (const [, animation] of InstanceTracker.bucket) {
      animation.stop();
    }
    InstanceTracker.bucket.clear();
  }
}
