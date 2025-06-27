import rawSdkImport from 'bondage-club-mod-sdk';

// What the fuck is this?? 
// It seems that ESBuild breaks things, either when building this package or a final mod
const rawSdk = rawSdkImport as any;
const bcModSdkRef = (rawSdk.default ?? rawSdk) as ModSDKGlobalAPI;

export const HookPriority = {
  Observe: 0,
  AddBehavior: 1,
  ModifyBehavior: 5,
  OverrideBehavior: 10,
  Top: 100
}

export type ModuleCategory = number | string;

interface IPatchedFunctionData {
  name: string;
  hooks: {
    hook: PatchHook;
    priority: number;
    module: ModuleCategory | null;
    removeCallback: () => void;
  }[];
}

export class ModSdkManager {
  private static SDK: ModSDKModAPI;
  private static patchedFunctions: Map<string, IPatchedFunctionData> = new Map();

  public static ModInfo: ModSDKModInfo;

  constructor(info: ModSDKModInfo, options?: ModSDKModOptions) {
    ModSdkManager.SDK = bcModSdkRef.registerMod(info, options);
    ModSdkManager.ModInfo = info;
  }

  initPatchableFunction(target: string): IPatchedFunctionData {
    let result = ModSdkManager.patchedFunctions.get(target);
    if (!result) {
      result = {
        name: target,
        hooks: []
      };
      ModSdkManager.patchedFunctions.set(target, result);
    }
    return result;
  }

  hookFunction<TargetName extends string>(
    target: TargetName,
    priority: number,
    hook: PatchHook<GetDotedPathType<typeof globalThis, TargetName>>,
    module: ModuleCategory | null = null
  ): () => void {
    const data = this.initPatchableFunction(target);

    if (data.hooks.some((h) => h.hook === hook)) {
      return () => null;
    }

    const removeCallback = ModSdkManager.SDK?.hookFunction(target, priority, hook);

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
    ModSdkManager.SDK?.patchFunction(target, patches);
  }

  unpatchFunction(target: string): void {
    ModSdkManager.SDK?.removePatches(target);
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
    for (const data of ModSdkManager.patchedFunctions.values()) {
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
