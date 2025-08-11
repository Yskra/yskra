// noinspection JSValidateTypes
/** @import {BaseBusService, BaseBusServiceMapValue, Logger, Property} from './BaseBus'; */

import { isRef } from 'vue';

export const TYPES = Object.freeze({
  METHOD: 'method',
  SIGNAL: 'signal',
  PROPERTY: 'property',
});

export default class BaseBus {
  /** @type {Record<string, BaseBusServiceMapValue>} */
  services;
  /** @type {Logger} */
  logger;

  /**
   * @param {Logger} logger logger
   */
  constructor(logger = window.console) {
    this.services = {};
    this.logger = logger;
  }

  /**
   * @param {string} serviceName service name
   * @param {BaseBusService} service service
   * @return {(() => void)} unregister service
   */
  addService(serviceName, service) {
    if (serviceName in this.services) {
      // Call an intentional crash instead of logger.error
      // so that the catches in PluginManager/ModuleLoader are triggered and the module cannot be mounted/loaded
      throw new Error(`Service ${serviceName} already added`);
    }

    const entries = Object.entries(service);

    /** @type {Map<string, (...args: unknown[]) => unknown>} */
    const methods = new Map(entries
      .filter(([, value]) => typeof value === 'function' || value.type === TYPES.METHOD)
      .map(([key, value]) => [key, typeof value === 'function' ? value : value.value]),
    );
    const signals = new Map(entries
      .filter(([, value]) => typeof value !== 'function' && value.type === TYPES.SIGNAL)
      .map(([key]) => [key, new Set()]),
    );
    const properties = new Map(entries
      .filter(([, value]) => typeof value !== 'function' && value.type === TYPES.PROPERTY)
      .map(([key, value]) => [key, typeof value !== 'function' ? value.value : value]),
    );


    this.services[serviceName] = { methods, signals, properties };

    return () => {
      delete this.services[serviceName];
    };
  }

  /**
   * Call service's method
   * @param {string} path serviceName:methodName
   * @param {...any} args args
   * @return {any} result of method
   */
  call(path, ...args) {
    const [serviceName, methodName] = path.split(':');
    const service = this.services[serviceName];
    const method = service?.methods.get(methodName);

    if (method) {
      try {
        return method(...args);
      }
      catch (e) {
        this.logger.error(`Error while call method ${path}: `, e);
      }
    }
    else {
      this.logger.error(`Method ${methodName} not found in ${serviceName} service`);
    }
  }

  /**
   * Trigger service's signal subscribers
   * @param {string} path serviceName:signalName
   * @param {...any} args args
   */
  emit(path, ...args) {
    const [serviceName, methodName] = path.split(':');
    const service = this.services[serviceName];
    const signal = service?.signals.get(methodName);

    if (signal) {
      signal.forEach((callback) => {
        try {
          callback(...args);
        }
        catch (e) {
          this.logger.error(`Error while emit signal ${path}: `, e);
        }
      });
    }
    else {
      this.logger.error(`Signal ${methodName} not found in ${serviceName} service`);
    }
  }

  /**
   * Subscribe to service's signal
   * @param {string} path serviceName:signalName
   * @param {(...args: any) => void} callback callback
   * @return {() => void} unsubscribe callback
   */
  on(path, callback) {
    const [serviceName, methodName] = path.split(':');
    const service = this.services[serviceName];
    const signal = service?.signals.get(methodName);

    if (signal) {
      signal.add(callback);

      return () => this.off(path, callback);
    }
    else {
      this.logger.error(`Signal ${methodName} not found in ${serviceName} service`);
      return () => void 0;
    }
  }

  /**
   * Unsubscribe from service's signal
   * @param {string} path serviceName:methodName
   * @param {(...args: any) => void} callback callback
   */
  off(path, callback) {
    const [serviceName, methodName] = path.split(':');
    const service = this.services[serviceName];
    const signal = service?.signals.get(methodName);

    if (signal) {
      return signal.delete(callback);
    }
    else {
      this.logger.error(`Signal ${methodName} not found in ${serviceName} service`);
    }
  }

  /**
   * Set service's property
   * @param {string} path serviceName:propertyName
   * @param {Property['value']} value value
   */
  set(path, value) {
    const [serviceName, propertyName] = path.split(':');
    const service = this.services[serviceName];
    const property = service?.properties.get(propertyName);

    if (property) {
      if (isRef(property)) {
        property.value = value;
      }
      else {
        service.properties.set(propertyName, value);
      }
    }
    else {
      this.logger.error(`Property ${propertyName} not found in ${serviceName} service`);
    }
  }

  /**
   * Get service's property
   * @param {string} path serviceName:propertyName
   * @returns {*} property value
   */
  get(path) {
    const [serviceName, propertyName] = path.split(':');
    const service = this.services[serviceName];
    const property = service?.properties.get(propertyName);

    if (property) {
      return property;
    }
    else {
      this.logger.error(`Property ${propertyName} not found in ${serviceName} service`);
    }
  }
}
