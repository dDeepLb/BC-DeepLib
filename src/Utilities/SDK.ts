import bcModSdkRef, { ModSDKModAPI, ModSDKModInfo, ModSDKModOptions, PatchHook } from 'bondage-club-mod-sdk';

export enum HookPriority {
  Observe = 0,
  AddBehavior = 1,
  ModifyBehavior = 5,
  OverrideBehavior = 10,
  Top = 100
}

export type ModuleCategory = number;

export class bcSdkMod {
  private static SDK: ModSDKModAPI;
  private static patchedFunctions: Map<string, PatchedFunctionData> = new Map();

  public static ModInfo: ModSDKModInfo;

  constructor(info: ModSDKModInfo, options?: ModSDKModOptions) {
    bcSdkMod.SDK = bcModSdkRef.registerMod(info, options);
    bcSdkMod.ModInfo = info;
  }

  initPatchableFunction(target: string): PatchedFunctionData {
    let result = bcSdkMod.patchedFunctions.get(target);
    if (!result) {
      result = {
        name: target,
        hooks: []
      };
      bcSdkMod.patchedFunctions.set(target, result);
    }
    return result;
  }

  hookFunction(
    target: string,
    priority: number,
    hook: PatchHook,
    module: ModuleCategory | null = null
  ): () => void {
    const data = this.initPatchableFunction(target);

    if (data.hooks.some((h) => h.hook === hook)) {
      return () => null;
    }

    const removeCallback = bcSdkMod.SDK?.hookFunction(target, priority, hook);

    data.hooks.push({
      hook,
      priority,
      module,
      removeCallback
    });
    data.hooks.sort((a, b) => b.priority - a.priority);
    return removeCallback;
  }

  patchFunction(target: string, patches: Record<string, string>): void {
    this.patchFunction(target, patches);
  }

  removeHookByModule(target: string, module: ModuleCategory): boolean {
    const data = this.initPatchableFunction(target);

    for (let i = data.hooks.length - 1; i >= 0; i--) {
      if (data.hooks[i].module === module) {
        data.hooks[i].removeCallback();
        data.hooks.splice(i, 1);
      }
    }

    return true;
  }

  removeAllHooksByModule(module: ModuleCategory): boolean {
    for (const data of bcSdkMod.patchedFunctions.values()) {
      for (let i = data.hooks.length - 1; i >= 0; i--) {
        if (data.hooks[i].module === module) {
          data.hooks[i].removeCallback();
          data.hooks.splice(i, 1);
        }
      }
    }

    return true;
  }
}
