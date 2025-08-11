import type BaseBus from '@/modules/appBus/BaseBus';

export interface AppBusInstance {
  addService: BaseBus<AppBusRegistry>['addService'];
  call: BaseBus<AppBusRegistry>['call'];
  emit: BaseBus<AppBusRegistry>['emit'];
  on: BaseBus<AppBusRegistry>['on'];
  off: BaseBus<AppBusRegistry>['off'];
  set: BaseBus<AppBusRegistry>['set'];
  get: BaseBus<AppBusRegistry>['get'];
}

declare global {
  interface AppBusRegistry {}
}
