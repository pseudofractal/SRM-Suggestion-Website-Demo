// node_modules/@firebase/util/dist/index.esm2017.js
var getGlobal = function() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("Unable to locate global object.");
};
var createMockUserToken = function(token, projectId) {
  if (token.uid) {
    throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
  }
  const header = {
    alg: "none",
    type: "JWT"
  };
  const project = projectId || "demo-project";
  const iat = token.iat || 0;
  const sub = token.sub || token.user_id;
  if (!sub) {
    throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
  }
  const payload = Object.assign({
    iss: `https://securetoken.google.com/${project}`,
    aud: project,
    iat,
    exp: iat + 3600,
    auth_time: iat,
    sub,
    user_id: sub,
    firebase: {
      sign_in_provider: "custom",
      identities: {}
    }
  }, token);
  const signature = "";
  return [
    base64urlEncodeWithoutPadding(JSON.stringify(header)),
    base64urlEncodeWithoutPadding(JSON.stringify(payload)),
    signature
  ].join(".");
};
var getUA = function() {
  if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
    return navigator["userAgent"];
  } else {
    return "";
  }
};
var isMobileCordova = function() {
  return typeof window !== "undefined" && !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
};
var isNode = function() {
  var _a;
  const forceEnvironment = (_a = getDefaults()) === null || _a === undefined ? undefined : _a.forceEnvironment;
  if (forceEnvironment === "node") {
    return true;
  } else if (forceEnvironment === "browser") {
    return false;
  }
  try {
    return Object.prototype.toString.call(global.process) === "[object process]";
  } catch (e) {
    return false;
  }
};
var isBrowserExtension = function() {
  const runtime = typeof chrome === "object" ? chrome.runtime : typeof browser === "object" ? browser.runtime : undefined;
  return typeof runtime === "object" && runtime.id !== undefined;
};
var isReactNative = function() {
  return typeof navigator === "object" && navigator["product"] === "ReactNative";
};
var isIE = function() {
  const ua = getUA();
  return ua.indexOf("MSIE ") >= 0 || ua.indexOf("Trident/") >= 0;
};
var isSafari = function() {
  return !isNode() && !!navigator.userAgent && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
};
var isIndexedDBAvailable = function() {
  try {
    return typeof indexedDB === "object";
  } catch (e) {
    return false;
  }
};
var validateIndexedDBOpenable = function() {
  return new Promise((resolve, reject) => {
    try {
      let preExist = true;
      const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
      const request = self.indexedDB.open(DB_CHECK_NAME);
      request.onsuccess = () => {
        request.result.close();
        if (!preExist) {
          self.indexedDB.deleteDatabase(DB_CHECK_NAME);
        }
        resolve(true);
      };
      request.onupgradeneeded = () => {
        preExist = false;
      };
      request.onerror = () => {
        var _a;
        reject(((_a = request.error) === null || _a === undefined ? undefined : _a.message) || "");
      };
    } catch (error) {
      reject(error);
    }
  });
};
var replaceTemplate = function(template, data) {
  return template.replace(PATTERN, (_, key) => {
    const value = data[key];
    return value != null ? String(value) : `<${key}?>`;
  });
};
var isEmpty = function(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
};
var deepEqual = function(a, b) {
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  for (const k of aKeys) {
    if (!bKeys.includes(k)) {
      return false;
    }
    const aProp = a[k];
    const bProp = b[k];
    if (isObject(aProp) && isObject(bProp)) {
      if (!deepEqual(aProp, bProp)) {
        return false;
      }
    } else if (aProp !== bProp) {
      return false;
    }
  }
  for (const k of bKeys) {
    if (!aKeys.includes(k)) {
      return false;
    }
  }
  return true;
};
var isObject = function(thing) {
  return thing !== null && typeof thing === "object";
};
var querystring = function(querystringParams) {
  const params = [];
  for (const [key, value] of Object.entries(querystringParams)) {
    if (Array.isArray(value)) {
      value.forEach((arrayVal) => {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal));
      });
    } else {
      params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
  }
  return params.length ? "&" + params.join("&") : "";
};
var querystringDecode = function(querystring2) {
  const obj = {};
  const tokens = querystring2.replace(/^\?/, "").split("&");
  tokens.forEach((token) => {
    if (token) {
      const [key, value] = token.split("=");
      obj[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });
  return obj;
};
var extractQuerystring = function(url) {
  const queryStart = url.indexOf("?");
  if (!queryStart) {
    return "";
  }
  const fragmentStart = url.indexOf("#", queryStart);
  return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : undefined);
};
var createSubscribe = function(executor, onNoObservers) {
  const proxy = new ObserverProxy(executor, onNoObservers);
  return proxy.subscribe.bind(proxy);
};
var implementsAnyMethods = function(obj, methods) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  for (const method of methods) {
    if (method in obj && typeof obj[method] === "function") {
      return true;
    }
  }
  return false;
};
var noop = function() {
};
var getModularInstance = function(service) {
  if (service && service._delegate) {
    return service._delegate;
  } else {
    return service;
  }
};
var stringToByteArray$1 = function(str) {
  const out = [];
  let p = 0;
  for (let i = 0;i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }
  return out;
};
var byteArrayToString = function(bytes) {
  const out = [];
  let pos = 0, c = 0;
  while (pos < bytes.length) {
    const c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      const c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      const c4 = bytes[pos++];
      const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
      out[c++] = String.fromCharCode(55296 + (u >> 10));
      out[c++] = String.fromCharCode(56320 + (u & 1023));
    } else {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join("");
};
var base64 = {
  byteToCharMap_: null,
  charToByteMap_: null,
  byteToCharMapWebSafe_: null,
  charToByteMapWebSafe_: null,
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  HAS_NATIVE_SUPPORT: typeof atob === "function",
  encodeByteArray(input, webSafe) {
    if (!Array.isArray(input)) {
      throw Error("encodeByteArray takes an array as a parameter");
    }
    this.init_();
    const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
    const output = [];
    for (let i = 0;i < input.length; i += 3) {
      const byte1 = input[i];
      const haveByte2 = i + 1 < input.length;
      const byte2 = haveByte2 ? input[i + 1] : 0;
      const haveByte3 = i + 2 < input.length;
      const byte3 = haveByte3 ? input[i + 2] : 0;
      const outByte1 = byte1 >> 2;
      const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
      let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
      let outByte4 = byte3 & 63;
      if (!haveByte3) {
        outByte4 = 64;
        if (!haveByte2) {
          outByte3 = 64;
        }
      }
      output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
    }
    return output.join("");
  },
  encodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return btoa(input);
    }
    return this.encodeByteArray(stringToByteArray$1(input), webSafe);
  },
  decodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return atob(input);
    }
    return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
  },
  decodeStringToByteArray(input, webSafe) {
    this.init_();
    const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
    const output = [];
    for (let i = 0;i < input.length; ) {
      const byte1 = charToByteMap[input.charAt(i++)];
      const haveByte2 = i < input.length;
      const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
      ++i;
      const haveByte3 = i < input.length;
      const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      const haveByte4 = i < input.length;
      const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
        throw new DecodeBase64StringError;
      }
      const outByte1 = byte1 << 2 | byte2 >> 4;
      output.push(outByte1);
      if (byte3 !== 64) {
        const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
        output.push(outByte2);
        if (byte4 !== 64) {
          const outByte3 = byte3 << 6 & 192 | byte4;
          output.push(outByte3);
        }
      }
    }
    return output;
  },
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {};
      this.charToByteMap_ = {};
      this.byteToCharMapWebSafe_ = {};
      this.charToByteMapWebSafe_ = {};
      for (let i = 0;i < this.ENCODED_VALS.length; i++) {
        this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
        this.charToByteMap_[this.byteToCharMap_[i]] = i;
        this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
        this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
        if (i >= this.ENCODED_VALS_BASE.length) {
          this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
          this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
        }
      }
    }
  }
};

class DecodeBase64StringError extends Error {
  constructor() {
    super(...arguments);
    this.name = "DecodeBase64StringError";
  }
}
var base64Encode = function(str) {
  const utf8Bytes = stringToByteArray$1(str);
  return base64.encodeByteArray(utf8Bytes, true);
};
var base64urlEncodeWithoutPadding = function(str) {
  return base64Encode(str).replace(/\./g, "");
};
var base64Decode = function(str) {
  try {
    return base64.decodeString(str, true);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
};
var getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
var getDefaultsFromEnvVariable = () => {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return;
  }
  const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
  if (defaultsJsonString) {
    return JSON.parse(defaultsJsonString);
  }
};
var getDefaultsFromCookie = () => {
  if (typeof document === "undefined") {
    return;
  }
  let match;
  try {
    match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch (e) {
    return;
  }
  const decoded = match && base64Decode(match[1]);
  return decoded && JSON.parse(decoded);
};
var getDefaults = () => {
  try {
    return getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
  } catch (e) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
    return;
  }
};
var getDefaultEmulatorHost = (productName) => {
  var _a, _b;
  return (_b = (_a = getDefaults()) === null || _a === undefined ? undefined : _a.emulatorHosts) === null || _b === undefined ? undefined : _b[productName];
};
var getDefaultEmulatorHostnameAndPort = (productName) => {
  const host = getDefaultEmulatorHost(productName);
  if (!host) {
    return;
  }
  const separatorIndex = host.lastIndexOf(":");
  if (separatorIndex <= 0 || separatorIndex + 1 === host.length) {
    throw new Error(`Invalid host ${host} with no separate hostname and port!`);
  }
  const port = parseInt(host.substring(separatorIndex + 1), 10);
  if (host[0] === "[") {
    return [host.substring(1, separatorIndex - 1), port];
  } else {
    return [host.substring(0, separatorIndex), port];
  }
};
var getDefaultAppConfig = () => {
  var _a;
  return (_a = getDefaults()) === null || _a === undefined ? undefined : _a.config;
};
var getExperimentalSetting = (name) => {
  var _a;
  return (_a = getDefaults()) === null || _a === undefined ? undefined : _a[`_${name}`];
};

class Deferred {
  constructor() {
    this.reject = () => {
    };
    this.resolve = () => {
    };
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  wrapCallback(callback) {
    return (error, value) => {
      if (error) {
        this.reject(error);
      } else {
        this.resolve(value);
      }
      if (typeof callback === "function") {
        this.promise.catch(() => {
        });
        if (callback.length === 1) {
          callback(error);
        } else {
          callback(error, value);
        }
      }
    };
  }
}
var ERROR_NAME = "FirebaseError";

class FirebaseError extends Error {
  constructor(code, message, customData) {
    super(message);
    this.code = code;
    this.customData = customData;
    this.name = ERROR_NAME;
    Object.setPrototypeOf(this, FirebaseError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorFactory.prototype.create);
    }
  }
}

class ErrorFactory {
  constructor(service, serviceName, errors) {
    this.service = service;
    this.serviceName = serviceName;
    this.errors = errors;
  }
  create(code, ...data) {
    const customData = data[0] || {};
    const fullCode = `${this.service}/${code}`;
    const template = this.errors[code];
    const message = template ? replaceTemplate(template, customData) : "Error";
    const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
    const error = new FirebaseError(fullCode, fullMessage, customData);
    return error;
  }
}
var PATTERN = /\{\$([^}]+)}/g;
class ObserverProxy {
  constructor(executor, onNoObservers) {
    this.observers = [];
    this.unsubscribes = [];
    this.observerCount = 0;
    this.task = Promise.resolve();
    this.finalized = false;
    this.onNoObservers = onNoObservers;
    this.task.then(() => {
      executor(this);
    }).catch((e) => {
      this.error(e);
    });
  }
  next(value) {
    this.forEachObserver((observer) => {
      observer.next(value);
    });
  }
  error(error) {
    this.forEachObserver((observer) => {
      observer.error(error);
    });
    this.close(error);
  }
  complete() {
    this.forEachObserver((observer) => {
      observer.complete();
    });
    this.close();
  }
  subscribe(nextOrObserver, error, complete) {
    let observer;
    if (nextOrObserver === undefined && error === undefined && complete === undefined) {
      throw new Error("Missing Observer.");
    }
    if (implementsAnyMethods(nextOrObserver, [
      "next",
      "error",
      "complete"
    ])) {
      observer = nextOrObserver;
    } else {
      observer = {
        next: nextOrObserver,
        error,
        complete
      };
    }
    if (observer.next === undefined) {
      observer.next = noop;
    }
    if (observer.error === undefined) {
      observer.error = noop;
    }
    if (observer.complete === undefined) {
      observer.complete = noop;
    }
    const unsub = this.unsubscribeOne.bind(this, this.observers.length);
    if (this.finalized) {
      this.task.then(() => {
        try {
          if (this.finalError) {
            observer.error(this.finalError);
          } else {
            observer.complete();
          }
        } catch (e) {
        }
        return;
      });
    }
    this.observers.push(observer);
    return unsub;
  }
  unsubscribeOne(i) {
    if (this.observers === undefined || this.observers[i] === undefined) {
      return;
    }
    delete this.observers[i];
    this.observerCount -= 1;
    if (this.observerCount === 0 && this.onNoObservers !== undefined) {
      this.onNoObservers(this);
    }
  }
  forEachObserver(fn) {
    if (this.finalized) {
      return;
    }
    for (let i = 0;i < this.observers.length; i++) {
      this.sendOne(i, fn);
    }
  }
  sendOne(i, fn) {
    this.task.then(() => {
      if (this.observers !== undefined && this.observers[i] !== undefined) {
        try {
          fn(this.observers[i]);
        } catch (e) {
          if (typeof console !== "undefined" && console.error) {
            console.error(e);
          }
        }
      }
    });
  }
  close(err) {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    if (err !== undefined) {
      this.finalError = err;
    }
    this.task.then(() => {
      this.observers = undefined;
      this.onNoObservers = undefined;
    });
  }
}
var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1000;

// node_modules/@firebase/component/dist/esm/index.esm2017.js
var normalizeIdentifierForFactory = function(identifier) {
  return identifier === DEFAULT_ENTRY_NAME ? undefined : identifier;
};
var isComponentEager = function(component) {
  return component.instantiationMode === "EAGER";
};

class Component {
  constructor(name, instanceFactory, type) {
    this.name = name;
    this.instanceFactory = instanceFactory;
    this.type = type;
    this.multipleInstances = false;
    this.serviceProps = {};
    this.instantiationMode = "LAZY";
    this.onInstanceCreated = null;
  }
  setInstantiationMode(mode) {
    this.instantiationMode = mode;
    return this;
  }
  setMultipleInstances(multipleInstances) {
    this.multipleInstances = multipleInstances;
    return this;
  }
  setServiceProps(props) {
    this.serviceProps = props;
    return this;
  }
  setInstanceCreatedCallback(callback) {
    this.onInstanceCreated = callback;
    return this;
  }
}
var DEFAULT_ENTRY_NAME = "[DEFAULT]";

class Provider {
  constructor(name, container) {
    this.name = name;
    this.container = container;
    this.component = null;
    this.instances = new Map;
    this.instancesDeferred = new Map;
    this.instancesOptions = new Map;
    this.onInitCallbacks = new Map;
  }
  get(identifier) {
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    if (!this.instancesDeferred.has(normalizedIdentifier)) {
      const deferred = new Deferred;
      this.instancesDeferred.set(normalizedIdentifier, deferred);
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          if (instance) {
            deferred.resolve(instance);
          }
        } catch (e) {
        }
      }
    }
    return this.instancesDeferred.get(normalizedIdentifier).promise;
  }
  getImmediate(options) {
    var _a;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === undefined ? undefined : options.identifier);
    const optional = (_a = options === null || options === undefined ? undefined : options.optional) !== null && _a !== undefined ? _a : false;
    if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
      try {
        return this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
      } catch (e) {
        if (optional) {
          return null;
        } else {
          throw e;
        }
      }
    } else {
      if (optional) {
        return null;
      } else {
        throw Error(`Service ${this.name} is not available`);
      }
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(component) {
    if (component.name !== this.name) {
      throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
    }
    if (this.component) {
      throw Error(`Component for ${this.name} has already been provided`);
    }
    this.component = component;
    if (!this.shouldAutoInitialize()) {
      return;
    }
    if (isComponentEager(component)) {
      try {
        this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
      } catch (e) {
      }
    }
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      try {
        const instance = this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
        instanceDeferred.resolve(instance);
      } catch (e) {
      }
    }
  }
  clearInstance(identifier = DEFAULT_ENTRY_NAME) {
    this.instancesDeferred.delete(identifier);
    this.instancesOptions.delete(identifier);
    this.instances.delete(identifier);
  }
  async delete() {
    const services = Array.from(this.instances.values());
    await Promise.all([
      ...services.filter((service) => ("INTERNAL" in service)).map((service) => service.INTERNAL.delete()),
      ...services.filter((service) => ("_delete" in service)).map((service) => service._delete())
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(identifier = DEFAULT_ENTRY_NAME) {
    return this.instances.has(identifier);
  }
  getOptions(identifier = DEFAULT_ENTRY_NAME) {
    return this.instancesOptions.get(identifier) || {};
  }
  initialize(opts = {}) {
    const { options = {} } = opts;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
    if (this.isInitialized(normalizedIdentifier)) {
      throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
    }
    if (!this.isComponentSet()) {
      throw Error(`Component ${this.name} has not been registered yet`);
    }
    const instance = this.getOrInitializeService({
      instanceIdentifier: normalizedIdentifier,
      options
    });
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      if (normalizedIdentifier === normalizedDeferredIdentifier) {
        instanceDeferred.resolve(instance);
      }
    }
    return instance;
  }
  onInit(callback, identifier) {
    var _a;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== undefined ? _a : new Set;
    existingCallbacks.add(callback);
    this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
    const existingInstance = this.instances.get(normalizedIdentifier);
    if (existingInstance) {
      callback(existingInstance, normalizedIdentifier);
    }
    return () => {
      existingCallbacks.delete(callback);
    };
  }
  invokeOnInitCallbacks(instance, identifier) {
    const callbacks = this.onInitCallbacks.get(identifier);
    if (!callbacks) {
      return;
    }
    for (const callback of callbacks) {
      try {
        callback(instance, identifier);
      } catch (_a) {
      }
    }
  }
  getOrInitializeService({ instanceIdentifier, options = {} }) {
    let instance = this.instances.get(instanceIdentifier);
    if (!instance && this.component) {
      instance = this.component.instanceFactory(this.container, {
        instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
        options
      });
      this.instances.set(instanceIdentifier, instance);
      this.instancesOptions.set(instanceIdentifier, options);
      this.invokeOnInitCallbacks(instance, instanceIdentifier);
      if (this.component.onInstanceCreated) {
        try {
          this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
        } catch (_a) {
        }
      }
    }
    return instance || null;
  }
  normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
    if (this.component) {
      return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
    } else {
      return identifier;
    }
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}

class ComponentContainer {
  constructor(name) {
    this.name = name;
    this.providers = new Map;
  }
  addComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
    }
    provider.setComponent(component);
  }
  addOrOverwriteComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      this.providers.delete(component.name);
    }
    this.addComponent(component);
  }
  getProvider(name) {
    if (this.providers.has(name)) {
      return this.providers.get(name);
    }
    const provider = new Provider(name, this);
    this.providers.set(name, provider);
    return provider;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}

// node_modules/@firebase/logger/dist/esm/index.esm2017.js
var instances = [];
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
  LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
  LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
  LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
  LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
  LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
var levelStringToEnum = {
  debug: LogLevel.DEBUG,
  verbose: LogLevel.VERBOSE,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  silent: LogLevel.SILENT
};
var defaultLogLevel = LogLevel.INFO;
var ConsoleMethod = {
  [LogLevel.DEBUG]: "log",
  [LogLevel.VERBOSE]: "log",
  [LogLevel.INFO]: "info",
  [LogLevel.WARN]: "warn",
  [LogLevel.ERROR]: "error"
};
var defaultLogHandler = (instance, logType, ...args) => {
  if (logType < instance.logLevel) {
    return;
  }
  const now = new Date().toISOString();
  const method = ConsoleMethod[logType];
  if (method) {
    console[method](`[${now}]  ${instance.name}:`, ...args);
  } else {
    throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
  }
};

class Logger {
  constructor(name) {
    this.name = name;
    this._logLevel = defaultLogLevel;
    this._logHandler = defaultLogHandler;
    this._userLogHandler = null;
    instances.push(this);
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(val) {
    if (!(val in LogLevel)) {
      throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
    }
    this._logLevel = val;
  }
  setLogLevel(val) {
    this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(val) {
    if (typeof val !== "function") {
      throw new TypeError("Value assigned to `logHandler` must be a function");
    }
    this._logHandler = val;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(val) {
    this._userLogHandler = val;
  }
  debug(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
    this._logHandler(this, LogLevel.DEBUG, ...args);
  }
  log(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
    this._logHandler(this, LogLevel.VERBOSE, ...args);
  }
  info(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
    this._logHandler(this, LogLevel.INFO, ...args);
  }
  warn(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
    this._logHandler(this, LogLevel.WARN, ...args);
  }
  error(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
    this._logHandler(this, LogLevel.ERROR, ...args);
  }
}
// node_modules/idb/build/wrap-idb-value.js
var getIdbProxyableTypes = function() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
};
var getCursorAdvanceMethods = function() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
};
var promisifyRequest = function(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
};
var cacheDonePromiseForTransaction = function(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
};
var replaceTraps = function(callback) {
  idbProxyTraps = callback(idbProxyTraps);
};
var wrapFunction = function(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
};
var transformCachableValue = function(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
};
var wrap = function(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
};
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
var cursorRequestMap = new WeakMap;
var transactionDoneMap = new WeakMap;
var transactionStoreNamesMap = new WeakMap;
var transformCache = new WeakMap;
var reverseTransformCache = new WeakMap;
var idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
var unwrap = (value) => reverseTransformCache.get(value);

// node_modules/idb/build/index.js
var openDB = function(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
};
var getMethod = function(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
};
var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
var writeMethods = ["put", "add", "delete", "clear"];
var cachedMethods = new Map;
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));

// node_modules/@firebase/app/dist/esm/index.esm2017.js
var isVersionServiceProvider = function(provider) {
  const component2 = provider.getComponent();
  return (component2 === null || component2 === undefined ? undefined : component2.type) === "VERSION";
};
var _addComponent = function(app, component2) {
  try {
    app.container.addComponent(component2);
  } catch (e) {
    logger2.debug(`Component ${component2.name} failed to register with FirebaseApp ${app.name}`, e);
  }
};
var _registerComponent = function(component2) {
  const componentName = component2.name;
  if (_components.has(componentName)) {
    logger2.debug(`There were multiple attempts to register component ${componentName}.`);
    return false;
  }
  _components.set(componentName, component2);
  for (const app of _apps.values()) {
    _addComponent(app, component2);
  }
  for (const serverApp of _serverApps.values()) {
    _addComponent(serverApp, component2);
  }
  return true;
};
var _getProvider = function(app, name) {
  const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
  if (heartbeatController) {
    heartbeatController.triggerHeartbeat();
  }
  return app.container.getProvider(name);
};
var _isFirebaseServerApp = function(obj) {
  return obj.settings !== undefined;
};
var initializeApp = function(_options, rawConfig = {}) {
  let options = _options;
  if (typeof rawConfig !== "object") {
    const name2 = rawConfig;
    rawConfig = { name: name2 };
  }
  const config = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: false }, rawConfig);
  const name = config.name;
  if (typeof name !== "string" || !name) {
    throw ERROR_FACTORY.create("bad-app-name", {
      appName: String(name)
    });
  }
  options || (options = getDefaultAppConfig());
  if (!options) {
    throw ERROR_FACTORY.create("no-options");
  }
  const existingApp = _apps.get(name);
  if (existingApp) {
    if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
      return existingApp;
    } else {
      throw ERROR_FACTORY.create("duplicate-app", { appName: name });
    }
  }
  const container = new ComponentContainer(name);
  for (const component2 of _components.values()) {
    container.addComponent(component2);
  }
  const newApp = new FirebaseAppImpl(options, config, container);
  _apps.set(name, newApp);
  return newApp;
};
var getApp = function(name = DEFAULT_ENTRY_NAME2) {
  const app = _apps.get(name);
  if (!app && name === DEFAULT_ENTRY_NAME2 && getDefaultAppConfig()) {
    return initializeApp();
  }
  if (!app) {
    throw ERROR_FACTORY.create("no-app", { appName: name });
  }
  return app;
};
var registerVersion = function(libraryKeyOrName, version, variant) {
  var _a;
  let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== undefined ? _a : libraryKeyOrName;
  if (variant) {
    library += `-${variant}`;
  }
  const libraryMismatch = library.match(/\s|\//);
  const versionMismatch = version.match(/\s|\//);
  if (libraryMismatch || versionMismatch) {
    const warning = [
      `Unable to register library "${library}" with version "${version}":`
    ];
    if (libraryMismatch) {
      warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
    }
    if (libraryMismatch && versionMismatch) {
      warning.push("and");
    }
    if (versionMismatch) {
      warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
    }
    logger2.warn(warning.join(" "));
    return;
  }
  _registerComponent(new Component(`${library}-version`, () => ({ library, version }), "VERSION"));
};
var getDbPromise = function() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade: (db, oldVersion) => {
        switch (oldVersion) {
          case 0:
            try {
              db.createObjectStore(STORE_NAME);
            } catch (e) {
              console.warn(e);
            }
        }
      }
    }).catch((e) => {
      throw ERROR_FACTORY.create("idb-open", {
        originalErrorMessage: e.message
      });
    });
  }
  return dbPromise;
};
async function readHeartbeatsFromIndexedDB(app) {
  try {
    const db = await getDbPromise();
    const tx = db.transaction(STORE_NAME);
    const result = await tx.objectStore(STORE_NAME).get(computeKey(app));
    await tx.done;
    return result;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger2.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-get", {
        originalErrorMessage: e === null || e === undefined ? undefined : e.message
      });
      logger2.warn(idbGetError.message);
    }
  }
}
async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
  try {
    const db = await getDbPromise();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const objectStore = tx.objectStore(STORE_NAME);
    await objectStore.put(heartbeatObject, computeKey(app));
    await tx.done;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger2.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-set", {
        originalErrorMessage: e === null || e === undefined ? undefined : e.message
      });
      logger2.warn(idbGetError.message);
    }
  }
}
var computeKey = function(app) {
  return `${app.name}!${app.options.appId}`;
};
var getUTCDateString = function() {
  const today = new Date;
  return today.toISOString().substring(0, 10);
};
var extractHeartbeatsForHeader = function(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
  const heartbeatsToSend = [];
  let unsentEntries = heartbeatsCache.slice();
  for (const singleDateHeartbeat of heartbeatsCache) {
    const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
    if (!heartbeatEntry) {
      heartbeatsToSend.push({
        agent: singleDateHeartbeat.agent,
        dates: [singleDateHeartbeat.date]
      });
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatsToSend.pop();
        break;
      }
    } else {
      heartbeatEntry.dates.push(singleDateHeartbeat.date);
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatEntry.dates.pop();
        break;
      }
    }
    unsentEntries = unsentEntries.slice(1);
  }
  return {
    heartbeatsToSend,
    unsentEntries
  };
};
var countBytes = function(heartbeatsCache) {
  return base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsCache })).length;
};
var registerCoreComponents = function(variant) {
  _registerComponent(new Component("platform-logger", (container) => new PlatformLoggerServiceImpl(container), "PRIVATE"));
  _registerComponent(new Component("heartbeat", (container) => new HeartbeatServiceImpl(container), "PRIVATE"));
  registerVersion(name$p, version$1, variant);
  registerVersion(name$p, version$1, "esm2017");
  registerVersion("fire-js", "");
};

class PlatformLoggerServiceImpl {
  constructor(container) {
    this.container = container;
  }
  getPlatformInfoString() {
    const providers = this.container.getProviders();
    return providers.map((provider) => {
      if (isVersionServiceProvider(provider)) {
        const service = provider.getImmediate();
        return `${service.library}/${service.version}`;
      } else {
        return null;
      }
    }).filter((logString) => logString).join(" ");
  }
}
var name$p = "@firebase/app";
var version$1 = "0.10.5";
var logger2 = new Logger("@firebase/app");
var name$o = "@firebase/app-compat";
var name$n = "@firebase/analytics-compat";
var name$m = "@firebase/analytics";
var name$l = "@firebase/app-check-compat";
var name$k = "@firebase/app-check";
var name$j = "@firebase/auth";
var name$i = "@firebase/auth-compat";
var name$h = "@firebase/database";
var name$g = "@firebase/database-compat";
var name$f = "@firebase/functions";
var name$e = "@firebase/functions-compat";
var name$d = "@firebase/installations";
var name$c = "@firebase/installations-compat";
var name$b = "@firebase/messaging";
var name$a = "@firebase/messaging-compat";
var name$9 = "@firebase/performance";
var name$8 = "@firebase/performance-compat";
var name$7 = "@firebase/remote-config";
var name$6 = "@firebase/remote-config-compat";
var name$5 = "@firebase/storage";
var name$4 = "@firebase/storage-compat";
var name$3 = "@firebase/firestore";
var name$2 = "@firebase/vertexai-preview";
var name$1 = "@firebase/firestore-compat";
var name = "firebase";
var version = "10.12.2";
var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
var PLATFORM_LOG_STRING = {
  [name$p]: "fire-core",
  [name$o]: "fire-core-compat",
  [name$m]: "fire-analytics",
  [name$n]: "fire-analytics-compat",
  [name$k]: "fire-app-check",
  [name$l]: "fire-app-check-compat",
  [name$j]: "fire-auth",
  [name$i]: "fire-auth-compat",
  [name$h]: "fire-rtdb",
  [name$g]: "fire-rtdb-compat",
  [name$f]: "fire-fn",
  [name$e]: "fire-fn-compat",
  [name$d]: "fire-iid",
  [name$c]: "fire-iid-compat",
  [name$b]: "fire-fcm",
  [name$a]: "fire-fcm-compat",
  [name$9]: "fire-perf",
  [name$8]: "fire-perf-compat",
  [name$7]: "fire-rc",
  [name$6]: "fire-rc-compat",
  [name$5]: "fire-gcs",
  [name$4]: "fire-gcs-compat",
  [name$3]: "fire-fst",
  [name$1]: "fire-fst-compat",
  [name$2]: "fire-vertex",
  "fire-js": "fire-js",
  [name]: "fire-js-all"
};
var _apps = new Map;
var _serverApps = new Map;
var _components = new Map;
var ERRORS = {
  ["no-app"]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
  ["bad-app-name"]: "Illegal App name: '{$appName}'",
  ["duplicate-app"]: "Firebase App named '{$appName}' already exists with different options or config",
  ["app-deleted"]: "Firebase App named '{$appName}' already deleted",
  ["server-app-deleted"]: "Firebase Server App has been deleted",
  ["no-options"]: "Need to provide options, when not being deployed to hosting via source.",
  ["invalid-app-argument"]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
  ["invalid-log-argument"]: "First argument to `onLog` must be null or a function.",
  ["idb-open"]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-get"]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-set"]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-delete"]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  ["finalization-registry-not-supported"]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
  ["invalid-server-app-environment"]: "FirebaseServerApp is not for use in browser environments."
};
var ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);

class FirebaseAppImpl {
  constructor(options, config, container) {
    this._isDeleted = false;
    this._options = Object.assign({}, options);
    this._config = Object.assign({}, config);
    this._name = config.name;
    this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
    this._container = container;
    this.container.addComponent(new Component("app", () => this, "PUBLIC"));
  }
  get automaticDataCollectionEnabled() {
    this.checkDestroyed();
    return this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(val) {
    this.checkDestroyed();
    this._automaticDataCollectionEnabled = val;
  }
  get name() {
    this.checkDestroyed();
    return this._name;
  }
  get options() {
    this.checkDestroyed();
    return this._options;
  }
  get config() {
    this.checkDestroyed();
    return this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(val) {
    this._isDeleted = val;
  }
  checkDestroyed() {
    if (this.isDeleted) {
      throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
    }
  }
}
var SDK_VERSION = version;
var DB_NAME = "firebase-heartbeat-database";
var DB_VERSION = 1;
var STORE_NAME = "firebase-heartbeat-store";
var dbPromise = null;
var MAX_HEADER_BYTES = 1024;
var STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1000;

class HeartbeatServiceImpl {
  constructor(container) {
    this.container = container;
    this._heartbeatsCache = null;
    const app = this.container.getProvider("app").getImmediate();
    this._storage = new HeartbeatStorageImpl(app);
    this._heartbeatsCachePromise = this._storage.read().then((result) => {
      this._heartbeatsCache = result;
      return result;
    });
  }
  async triggerHeartbeat() {
    var _a, _b;
    const platformLogger = this.container.getProvider("platform-logger").getImmediate();
    const agent = platformLogger.getPlatformInfoString();
    const date = getUTCDateString();
    if (((_a = this._heartbeatsCache) === null || _a === undefined ? undefined : _a.heartbeats) == null) {
      this._heartbeatsCache = await this._heartbeatsCachePromise;
      if (((_b = this._heartbeatsCache) === null || _b === undefined ? undefined : _b.heartbeats) == null) {
        return;
      }
    }
    if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
      return;
    } else {
      this._heartbeatsCache.heartbeats.push({ date, agent });
    }
    this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat) => {
      const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
      const now = Date.now();
      return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
    });
    return this._storage.overwrite(this._heartbeatsCache);
  }
  async getHeartbeatsHeader() {
    var _a;
    if (this._heartbeatsCache === null) {
      await this._heartbeatsCachePromise;
    }
    if (((_a = this._heartbeatsCache) === null || _a === undefined ? undefined : _a.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0) {
      return "";
    }
    const date = getUTCDateString();
    const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
    const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
    this._heartbeatsCache.lastSentHeartbeatDate = date;
    if (unsentEntries.length > 0) {
      this._heartbeatsCache.heartbeats = unsentEntries;
      await this._storage.overwrite(this._heartbeatsCache);
    } else {
      this._heartbeatsCache.heartbeats = [];
      this._storage.overwrite(this._heartbeatsCache);
    }
    return headerString;
  }
}

class HeartbeatStorageImpl {
  constructor(app) {
    this.app = app;
    this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    if (!isIndexedDBAvailable()) {
      return false;
    } else {
      return validateIndexedDBOpenable().then(() => true).catch(() => false);
    }
  }
  async read() {
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return { heartbeats: [] };
    } else {
      const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
      if (idbHeartbeatObject === null || idbHeartbeatObject === undefined ? undefined : idbHeartbeatObject.heartbeats) {
        return idbHeartbeatObject;
      } else {
        return { heartbeats: [] };
      }
    }
  }
  async overwrite(heartbeatsObject) {
    var _a;
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== undefined ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: heartbeatsObject.heartbeats
      });
    }
  }
  async add(heartbeatsObject) {
    var _a;
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== undefined ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: [
          ...existingHeartbeatsObject.heartbeats,
          ...heartbeatsObject.heartbeats
        ]
      });
    }
  }
}
registerCoreComponents("");

// node_modules/firebase/app/dist/esm/index.esm.js
var name2 = "firebase";
var version2 = "10.12.2";
registerVersion(name2, version2, "app");

// node_modules/tslib/tslib.es6.mjs
function __rest(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s);i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}

// node_modules/@firebase/auth/dist/esm2017/index-454a0f5f.js
var _prodErrorMap = function() {
  return {
    ["dependent-sdk-initialized-before-auth"]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
  };
};
var _logWarn = function(msg, ...args) {
  if (logClient.logLevel <= LogLevel.WARN) {
    logClient.warn(`Auth (${SDK_VERSION}): ${msg}`, ...args);
  }
};
var _logError = function(msg, ...args) {
  if (logClient.logLevel <= LogLevel.ERROR) {
    logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
  }
};
var _fail = function(authOrCode, ...rest) {
  throw createErrorInternal(authOrCode, ...rest);
};
var _createError = function(authOrCode, ...rest) {
  return createErrorInternal(authOrCode, ...rest);
};
var _errorWithCustomMessage = function(auth, code, message) {
  const errorMap = Object.assign(Object.assign({}, prodErrorMap()), { [code]: message });
  const factory = new ErrorFactory("auth", "Firebase", errorMap);
  return factory.create(code, {
    appName: auth.name
  });
};
var _serverAppCurrentUserOperationNotSupportedError = function(auth) {
  return _errorWithCustomMessage(auth, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
};
var _assertInstanceOf = function(auth, object, instance) {
  const constructorInstance = instance;
  if (!(object instanceof constructorInstance)) {
    if (constructorInstance.name !== object.constructor.name) {
      _fail(auth, "argument-error");
    }
    throw _errorWithCustomMessage(auth, "argument-error", `Type of ${object.constructor.name} does not match expected instance.` + `Did you pass a reference from a different Auth SDK?`);
  }
};
var createErrorInternal = function(authOrCode, ...rest) {
  if (typeof authOrCode !== "string") {
    const code = rest[0];
    const fullParams = [...rest.slice(1)];
    if (fullParams[0]) {
      fullParams[0].appName = authOrCode.name;
    }
    return authOrCode._errorFactory.create(code, ...fullParams);
  }
  return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
};
var _assert = function(assertion, authOrCode, ...rest) {
  if (!assertion) {
    throw createErrorInternal(authOrCode, ...rest);
  }
};
var debugFail = function(failure) {
  const message = `INTERNAL ASSERTION FAILED: ` + failure;
  _logError(message);
  throw new Error(message);
};
var debugAssert = function(assertion, message) {
  if (!assertion) {
    debugFail(message);
  }
};
var _getCurrentUrl = function() {
  var _a;
  return typeof self !== "undefined" && ((_a = self.location) === null || _a === undefined ? undefined : _a.href) || "";
};
var _isHttpOrHttps = function() {
  return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
};
var _getCurrentScheme = function() {
  var _a;
  return typeof self !== "undefined" && ((_a = self.location) === null || _a === undefined ? undefined : _a.protocol) || null;
};
var _isOnline = function() {
  if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && (_isHttpOrHttps() || isBrowserExtension() || ("connection" in navigator))) {
    return navigator.onLine;
  }
  return true;
};
var _getUserLanguage = function() {
  if (typeof navigator === "undefined") {
    return null;
  }
  const navigatorLanguage = navigator;
  return navigatorLanguage.languages && navigatorLanguage.languages[0] || navigatorLanguage.language || null;
};
var _emulatorUrl = function(config, path) {
  debugAssert(config.emulator, "Emulator should always be set here");
  const { url } = config.emulator;
  if (!path) {
    return url;
  }
  return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
};
var _addTidIfNecessary = function(auth, request) {
  if (auth.tenantId && !request.tenantId) {
    return Object.assign(Object.assign({}, request), { tenantId: auth.tenantId });
  }
  return request;
};
async function _performApiRequest(auth, method, path, request, customErrorMap = {}) {
  return _performFetchWithErrorHandling(auth, customErrorMap, async () => {
    let body = {};
    let params = {};
    if (request) {
      if (method === "GET") {
        params = request;
      } else {
        body = {
          body: JSON.stringify(request)
        };
      }
    }
    const query = querystring(Object.assign({ key: auth.config.apiKey }, params)).slice(1);
    const headers = await auth._getAdditionalHeaders();
    headers["Content-Type"] = "application/json";
    if (auth.languageCode) {
      headers["X-Firebase-Locale"] = auth.languageCode;
    }
    return FetchProvider.fetch()(_getFinalTarget(auth, auth.config.apiHost, path, query), Object.assign({
      method,
      headers,
      referrerPolicy: "no-referrer"
    }, body));
  });
}
async function _performFetchWithErrorHandling(auth, customErrorMap, fetchFn) {
  auth._canInitEmulator = false;
  const errorMap = Object.assign(Object.assign({}, SERVER_ERROR_MAP), customErrorMap);
  try {
    const networkTimeout = new NetworkTimeout(auth);
    const response = await Promise.race([
      fetchFn(),
      networkTimeout.promise
    ]);
    networkTimeout.clearNetworkTimeout();
    const json = await response.json();
    if ("needConfirmation" in json) {
      throw _makeTaggedError(auth, "account-exists-with-different-credential", json);
    }
    if (response.ok && !("errorMessage" in json)) {
      return json;
    } else {
      const errorMessage = response.ok ? json.errorMessage : json.error.message;
      const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
      if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") {
        throw _makeTaggedError(auth, "credential-already-in-use", json);
      } else if (serverErrorCode === "EMAIL_EXISTS") {
        throw _makeTaggedError(auth, "email-already-in-use", json);
      } else if (serverErrorCode === "USER_DISABLED") {
        throw _makeTaggedError(auth, "user-disabled", json);
      }
      const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
      if (serverErrorMessage) {
        throw _errorWithCustomMessage(auth, authError, serverErrorMessage);
      } else {
        _fail(auth, authError);
      }
    }
  } catch (e) {
    if (e instanceof FirebaseError) {
      throw e;
    }
    _fail(auth, "network-request-failed", { message: String(e) });
  }
}
async function _performSignInRequest(auth, method, path, request, customErrorMap = {}) {
  const serverResponse = await _performApiRequest(auth, method, path, request, customErrorMap);
  if ("mfaPendingCredential" in serverResponse) {
    _fail(auth, "multi-factor-auth-required", {
      _serverResponse: serverResponse
    });
  }
  return serverResponse;
}
var _getFinalTarget = function(auth, host, path, query) {
  const base = `${host}${path}?${query}`;
  if (!auth.config.emulator) {
    return `${auth.config.apiScheme}://${base}`;
  }
  return _emulatorUrl(auth.config, base);
};
var _parseEnforcementState = function(enforcementStateStr) {
  switch (enforcementStateStr) {
    case "ENFORCE":
      return "ENFORCE";
    case "AUDIT":
      return "AUDIT";
    case "OFF":
      return "OFF";
    default:
      return "ENFORCEMENT_STATE_UNSPECIFIED";
  }
};
var _makeTaggedError = function(auth, code, response) {
  const errorParams = {
    appName: auth.name
  };
  if (response.email) {
    errorParams.email = response.email;
  }
  if (response.phoneNumber) {
    errorParams.phoneNumber = response.phoneNumber;
  }
  const error = _createError(auth, code, errorParams);
  error.customData._tokenResponse = response;
  return error;
};
var isEnterprise = function(grecaptcha) {
  return grecaptcha !== undefined && grecaptcha.enterprise !== undefined;
};
async function getRecaptchaConfig(auth, request) {
  return _performApiRequest(auth, "GET", "/v2/recaptchaConfig", _addTidIfNecessary(auth, request));
}
async function deleteAccount(auth, request) {
  return _performApiRequest(auth, "POST", "/v1/accounts:delete", request);
}
async function getAccountInfo(auth, request) {
  return _performApiRequest(auth, "POST", "/v1/accounts:lookup", request);
}
var utcTimestampToDateString = function(utcTimestamp) {
  if (!utcTimestamp) {
    return;
  }
  try {
    const date = new Date(Number(utcTimestamp));
    if (!isNaN(date.getTime())) {
      return date.toUTCString();
    }
  } catch (e) {
  }
  return;
};
async function getIdTokenResult(user, forceRefresh = false) {
  const userInternal = getModularInstance(user);
  const token = await userInternal.getIdToken(forceRefresh);
  const claims = _parseToken(token);
  _assert(claims && claims.exp && claims.auth_time && claims.iat, userInternal.auth, "internal-error");
  const firebase = typeof claims.firebase === "object" ? claims.firebase : undefined;
  const signInProvider = firebase === null || firebase === undefined ? undefined : firebase["sign_in_provider"];
  return {
    claims,
    token,
    authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
    issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
    expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
    signInProvider: signInProvider || null,
    signInSecondFactor: (firebase === null || firebase === undefined ? undefined : firebase["sign_in_second_factor"]) || null
  };
}
var secondsStringToMilliseconds = function(seconds) {
  return Number(seconds) * 1000;
};
var _parseToken = function(token) {
  const [algorithm, payload, signature] = token.split(".");
  if (algorithm === undefined || payload === undefined || signature === undefined) {
    _logError("JWT malformed, contained fewer than 3 sections");
    return null;
  }
  try {
    const decoded = base64Decode(payload);
    if (!decoded) {
      _logError("Failed to decode base64 JWT payload");
      return null;
    }
    return JSON.parse(decoded);
  } catch (e) {
    _logError("Caught error parsing JWT payload as JSON", e === null || e === undefined ? undefined : e.toString());
    return null;
  }
};
var _tokenExpiresIn = function(token) {
  const parsedToken = _parseToken(token);
  _assert(parsedToken, "internal-error");
  _assert(typeof parsedToken.exp !== "undefined", "internal-error");
  _assert(typeof parsedToken.iat !== "undefined", "internal-error");
  return Number(parsedToken.exp) - Number(parsedToken.iat);
};
async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
  if (bypassAuthState) {
    return promise;
  }
  try {
    return await promise;
  } catch (e) {
    if (e instanceof FirebaseError && isUserInvalidated(e)) {
      if (user.auth.currentUser === user) {
        await user.auth.signOut();
      }
    }
    throw e;
  }
}
var isUserInvalidated = function({ code }) {
  return code === `auth/${"user-disabled"}` || code === `auth/${"user-token-expired"}`;
};
async function _reloadWithoutSaving(user) {
  var _a;
  const auth = user.auth;
  const idToken = await user.getIdToken();
  const response = await _logoutIfInvalidated(user, getAccountInfo(auth, { idToken }));
  _assert(response === null || response === undefined ? undefined : response.users.length, auth, "internal-error");
  const coreAccount = response.users[0];
  user._notifyReloadListener(coreAccount);
  const newProviderData = ((_a = coreAccount.providerUserInfo) === null || _a === undefined ? undefined : _a.length) ? extractProviderData(coreAccount.providerUserInfo) : [];
  const providerData = mergeProviderData(user.providerData, newProviderData);
  const oldIsAnonymous = user.isAnonymous;
  const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !(providerData === null || providerData === undefined ? undefined : providerData.length);
  const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
  const updates = {
    uid: coreAccount.localId,
    displayName: coreAccount.displayName || null,
    photoURL: coreAccount.photoUrl || null,
    email: coreAccount.email || null,
    emailVerified: coreAccount.emailVerified || false,
    phoneNumber: coreAccount.phoneNumber || null,
    tenantId: coreAccount.tenantId || null,
    providerData,
    metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
    isAnonymous
  };
  Object.assign(user, updates);
}
async function reload(user) {
  const userInternal = getModularInstance(user);
  await _reloadWithoutSaving(userInternal);
  await userInternal.auth._persistUserIfCurrent(userInternal);
  userInternal.auth._notifyListenersIfCurrent(userInternal);
}
var mergeProviderData = function(original, newData) {
  const deduped = original.filter((o) => !newData.some((n) => n.providerId === o.providerId));
  return [...deduped, ...newData];
};
var extractProviderData = function(providers) {
  return providers.map((_a) => {
    var { providerId } = _a, provider = __rest(_a, ["providerId"]);
    return {
      providerId,
      uid: provider.rawId || "",
      displayName: provider.displayName || null,
      email: provider.email || null,
      phoneNumber: provider.phoneNumber || null,
      photoURL: provider.photoUrl || null
    };
  });
};
async function requestStsToken(auth, refreshToken) {
  const response = await _performFetchWithErrorHandling(auth, {}, async () => {
    const body = querystring({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }).slice(1);
    const { tokenApiHost, apiKey } = auth.config;
    const url = _getFinalTarget(auth, tokenApiHost, "/v1/token", `key=${apiKey}`);
    const headers = await auth._getAdditionalHeaders();
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    return FetchProvider.fetch()(url, {
      method: "POST",
      headers,
      body
    });
  });
  return {
    accessToken: response.access_token,
    expiresIn: response.expires_in,
    refreshToken: response.refresh_token
  };
}
async function revokeToken(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts:revokeToken", _addTidIfNecessary(auth, request));
}
var assertStringOrUndefined = function(assertion, appName) {
  _assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", { appName });
};
var _getInstance = function(cls) {
  debugAssert(cls instanceof Function, "Expected a class definition");
  let instance = instanceCache.get(cls);
  if (instance) {
    debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
    return instance;
  }
  instance = new cls;
  instanceCache.set(cls, instance);
  return instance;
};
var _persistenceKeyName = function(key, apiKey, appName) {
  return `${"firebase"}:${key}:${apiKey}:${appName}`;
};
var _getBrowserName = function(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes("opera/") || ua.includes("opr/") || ua.includes("opios/")) {
    return "Opera";
  } else if (_isIEMobile(ua)) {
    return "IEMobile";
  } else if (ua.includes("msie") || ua.includes("trident/")) {
    return "IE";
  } else if (ua.includes("edge/")) {
    return "Edge";
  } else if (_isFirefox(ua)) {
    return "Firefox";
  } else if (ua.includes("silk/")) {
    return "Silk";
  } else if (_isBlackBerry(ua)) {
    return "Blackberry";
  } else if (_isWebOS(ua)) {
    return "Webos";
  } else if (_isSafari(ua)) {
    return "Safari";
  } else if ((ua.includes("chrome/") || _isChromeIOS(ua)) && !ua.includes("edge/")) {
    return "Chrome";
  } else if (_isAndroid(ua)) {
    return "Android";
  } else {
    const re = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
    const matches = userAgent.match(re);
    if ((matches === null || matches === undefined ? undefined : matches.length) === 2) {
      return matches[1];
    }
  }
  return "Other";
};
var _isFirefox = function(ua = getUA()) {
  return /firefox\//i.test(ua);
};
var _isSafari = function(userAgent = getUA()) {
  const ua = userAgent.toLowerCase();
  return ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("crios/") && !ua.includes("android");
};
var _isChromeIOS = function(ua = getUA()) {
  return /crios\//i.test(ua);
};
var _isIEMobile = function(ua = getUA()) {
  return /iemobile/i.test(ua);
};
var _isAndroid = function(ua = getUA()) {
  return /android/i.test(ua);
};
var _isBlackBerry = function(ua = getUA()) {
  return /blackberry/i.test(ua);
};
var _isWebOS = function(ua = getUA()) {
  return /webos/i.test(ua);
};
var _isIOS = function(ua = getUA()) {
  return /iphone|ipad|ipod/i.test(ua) || /macintosh/i.test(ua) && /mobile/i.test(ua);
};
var _isIOSStandalone = function(ua = getUA()) {
  var _a;
  return _isIOS(ua) && !!((_a = window.navigator) === null || _a === undefined ? undefined : _a.standalone);
};
var _isIE10 = function() {
  return isIE() && document.documentMode === 10;
};
var _isMobileBrowser = function(ua = getUA()) {
  return _isIOS(ua) || _isAndroid(ua) || _isWebOS(ua) || _isBlackBerry(ua) || /windows phone/i.test(ua) || _isIEMobile(ua);
};
var _isIframe = function() {
  try {
    return !!(window && window !== window.top);
  } catch (e) {
    return false;
  }
};
var _getClientVersion = function(clientPlatform, frameworks = []) {
  let reportedPlatform;
  switch (clientPlatform) {
    case "Browser":
      reportedPlatform = _getBrowserName(getUA());
      break;
    case "Worker":
      reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
      break;
    default:
      reportedPlatform = clientPlatform;
  }
  const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
  return `${reportedPlatform}/${"JsCore"}/${SDK_VERSION}/${reportedFrameworks}`;
};
async function _getPasswordPolicy(auth, request = {}) {
  return _performApiRequest(auth, "GET", "/v2/passwordPolicy", _addTidIfNecessary(auth, request));
}
var _castAuth = function(auth) {
  return getModularInstance(auth);
};
var _setExternalJSProvider = function(p) {
  externalJSProvider = p;
};
var _loadJS = function(url) {
  return externalJSProvider.loadJS(url);
};
var _recaptchaEnterpriseScriptUrl = function() {
  return externalJSProvider.recaptchaEnterpriseScript;
};
var _gapiScriptUrl = function() {
  return externalJSProvider.gapiScript;
};
var _generateCallbackName = function(prefix) {
  return `__${prefix}${Math.floor(Math.random() * 1e6)}`;
};
async function injectRecaptchaFields(auth, request, action, captchaResp = false) {
  const verifier = new RecaptchaEnterpriseVerifier(auth);
  let captchaResponse;
  try {
    captchaResponse = await verifier.verify(action);
  } catch (error) {
    captchaResponse = await verifier.verify(action, true);
  }
  const newRequest = Object.assign({}, request);
  if (!captchaResp) {
    Object.assign(newRequest, { captchaResponse });
  } else {
    Object.assign(newRequest, { captchaResp: captchaResponse });
  }
  Object.assign(newRequest, { clientType: "CLIENT_TYPE_WEB" });
  Object.assign(newRequest, {
    recaptchaVersion: "RECAPTCHA_ENTERPRISE"
  });
  return newRequest;
}
async function handleRecaptchaFlow(authInstance, request, actionName, actionMethod) {
  var _a;
  if ((_a = authInstance._getRecaptchaConfig()) === null || _a === undefined ? undefined : _a.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")) {
    const requestWithRecaptcha = await injectRecaptchaFields(authInstance, request, actionName, actionName === "getOobCode");
    return actionMethod(authInstance, requestWithRecaptcha);
  } else {
    return actionMethod(authInstance, request).catch(async (error) => {
      if (error.code === `auth/${"missing-recaptcha-token"}`) {
        console.log(`${actionName} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
        const requestWithRecaptcha = await injectRecaptchaFields(authInstance, request, actionName, actionName === "getOobCode");
        return actionMethod(authInstance, requestWithRecaptcha);
      } else {
        return Promise.reject(error);
      }
    });
  }
}
var initializeAuth = function(app4, deps) {
  const provider = _getProvider(app4, "auth");
  if (provider.isInitialized()) {
    const auth2 = provider.getImmediate();
    const initialOptions = provider.getOptions();
    if (deepEqual(initialOptions, deps !== null && deps !== undefined ? deps : {})) {
      return auth2;
    } else {
      _fail(auth2, "already-initialized");
    }
  }
  const auth = provider.initialize({ options: deps });
  return auth;
};
var _initializeAuthInstance = function(auth, deps) {
  const persistence = (deps === null || deps === undefined ? undefined : deps.persistence) || [];
  const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
  if (deps === null || deps === undefined ? undefined : deps.errorMap) {
    auth._updateErrorMap(deps.errorMap);
  }
  auth._initializeWithPersistence(hierarchy, deps === null || deps === undefined ? undefined : deps.popupRedirectResolver);
};
var connectAuthEmulator = function(auth, url, options) {
  const authInternal = _castAuth(auth);
  _assert(authInternal._canInitEmulator, authInternal, "emulator-config-failed");
  _assert(/^https?:\/\//.test(url), authInternal, "invalid-emulator-scheme");
  const disableWarnings = !!(options === null || options === undefined ? undefined : options.disableWarnings);
  const protocol = extractProtocol(url);
  const { host, port } = extractHostAndPort(url);
  const portStr = port === null ? "" : `:${port}`;
  authInternal.config.emulator = { url: `${protocol}//${host}${portStr}/` };
  authInternal.settings.appVerificationDisabledForTesting = true;
  authInternal.emulatorConfig = Object.freeze({
    host,
    port,
    protocol: protocol.replace(":", ""),
    options: Object.freeze({ disableWarnings })
  });
  if (!disableWarnings) {
    emitEmulatorWarning();
  }
};
var extractProtocol = function(url) {
  const protocolEnd = url.indexOf(":");
  return protocolEnd < 0 ? "" : url.substr(0, protocolEnd + 1);
};
var extractHostAndPort = function(url) {
  const protocol = extractProtocol(url);
  const authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length));
  if (!authority) {
    return { host: "", port: null };
  }
  const hostAndPort = authority[2].split("@").pop() || "";
  const bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
  if (bracketedIPv6) {
    const host = bracketedIPv6[1];
    return { host, port: parsePort(hostAndPort.substr(host.length + 1)) };
  } else {
    const [host, port] = hostAndPort.split(":");
    return { host, port: parsePort(port) };
  }
};
var parsePort = function(portStr) {
  if (!portStr) {
    return null;
  }
  const port = Number(portStr);
  if (isNaN(port)) {
    return null;
  }
  return port;
};
var emitEmulatorWarning = function() {
  function attachBanner() {
    const el = document.createElement("p");
    const sty = el.style;
    el.innerText = "Running in emulator mode. Do not use with production credentials.";
    sty.position = "fixed";
    sty.width = "100%";
    sty.backgroundColor = "#ffffff";
    sty.border = ".1em solid #000000";
    sty.color = "#b50000";
    sty.bottom = "0px";
    sty.left = "0px";
    sty.margin = "0px";
    sty.zIndex = "10000";
    sty.textAlign = "center";
    el.classList.add("firebase-emulator-warning");
    document.body.appendChild(el);
  }
  if (typeof console !== "undefined" && typeof console.info === "function") {
    console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");
  }
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", attachBanner);
    } else {
      attachBanner();
    }
  }
};
async function linkEmailPassword(auth, request) {
  return _performApiRequest(auth, "POST", "/v1/accounts:signUp", request);
}
async function signInWithPassword(auth, request) {
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth, request));
}
async function signInWithEmailLink$1(auth, request) {
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
}
async function signInWithEmailLinkForLinking(auth, request) {
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
}
async function signInWithIdp(auth, request) {
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth, request));
}
async function sendPhoneVerificationCode(auth, request) {
  return _performApiRequest(auth, "POST", "/v1/accounts:sendVerificationCode", _addTidIfNecessary(auth, request));
}
async function signInWithPhoneNumber$1(auth, request) {
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, request));
}
async function linkWithPhoneNumber$1(auth, request) {
  const response = await _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, request));
  if (response.temporaryProof) {
    throw _makeTaggedError(auth, "account-exists-with-different-credential", response);
  }
  return response;
}
async function verifyPhoneNumberForExisting(auth, request) {
  const apiRequest = Object.assign(Object.assign({}, request), { operation: "REAUTH" });
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, apiRequest), VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_);
}
var parseMode = function(mode) {
  switch (mode) {
    case "recoverEmail":
      return "RECOVER_EMAIL";
    case "resetPassword":
      return "PASSWORD_RESET";
    case "signIn":
      return "EMAIL_SIGNIN";
    case "verifyEmail":
      return "VERIFY_EMAIL";
    case "verifyAndChangeEmail":
      return "VERIFY_AND_CHANGE_EMAIL";
    case "revertSecondFactorAddition":
      return "REVERT_SECOND_FACTOR_ADDITION";
    default:
      return null;
  }
};
var parseDeepLink = function(url) {
  const link = querystringDecode(extractQuerystring(url))["link"];
  const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
  const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
  const iOSDoubleDeepLink = iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null;
  return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
};
var providerIdForResponse = function(response) {
  if (response.providerId) {
    return response.providerId;
  }
  if ("phoneNumber" in response) {
    return "phone";
  }
  return null;
};
var _processCredentialSavingMfaContextIfNecessary = function(auth, operationType, credential, user) {
  const idTokenProvider = operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth) : credential._getIdTokenResponse(auth);
  return idTokenProvider.catch((error) => {
    if (error.code === `auth/${"multi-factor-auth-required"}`) {
      throw MultiFactorError._fromErrorAndOperation(auth, error, operationType, user);
    }
    throw error;
  });
};
async function _link$1(user, credential, bypassAuthState = false) {
  const response = await _logoutIfInvalidated(user, credential._linkToIdToken(user.auth, await user.getIdToken()), bypassAuthState);
  return UserCredentialImpl._forOperation(user, "link", response);
}
async function _reauthenticate(user, credential, bypassAuthState = false) {
  const { auth } = user;
  if (_isFirebaseServerApp(auth.app)) {
    return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
  }
  const operationType = "reauthenticate";
  try {
    const response = await _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user), bypassAuthState);
    _assert(response.idToken, auth, "internal-error");
    const parsed = _parseToken(response.idToken);
    _assert(parsed, auth, "internal-error");
    const { sub: localId } = parsed;
    _assert(user.uid === localId, auth, "user-mismatch");
    return UserCredentialImpl._forOperation(user, operationType, response);
  } catch (e) {
    if ((e === null || e === undefined ? undefined : e.code) === `auth/${"user-not-found"}`) {
      _fail(auth, "user-mismatch");
    }
    throw e;
  }
}
async function _signInWithCredential(auth, credential, bypassAuthState = false) {
  if (_isFirebaseServerApp(auth.app)) {
    return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
  }
  const operationType = "signIn";
  const response = await _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential);
  const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth, operationType, response);
  if (!bypassAuthState) {
    await auth._updateCurrentUser(userCredential.user);
  }
  return userCredential;
}
var onIdTokenChanged = function(auth, nextOrObserver, error, completed) {
  return getModularInstance(auth).onIdTokenChanged(nextOrObserver, error, completed);
};
var beforeAuthStateChanged = function(auth, callback, onAbort) {
  return getModularInstance(auth).beforeAuthStateChanged(callback, onAbort);
};
var signOut = function(auth) {
  return getModularInstance(auth).signOut();
};
var startEnrollPhoneMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth, request));
};
var finalizeEnrollPhoneMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth, request));
};
var startEnrollTotpMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth, request));
};
var finalizeEnrollTotpMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth, request));
};
var _iframeCannotSyncWebStorage = function() {
  const ua = getUA();
  return _isSafari(ua) || _isIOS(ua);
};
var _allSettled = function(promises) {
  return Promise.all(promises.map(async (promise) => {
    try {
      const value = await promise;
      return {
        fulfilled: true,
        value
      };
    } catch (reason) {
      return {
        fulfilled: false,
        reason
      };
    }
  }));
};
var _generateEventId = function(prefix = "", digits = 10) {
  let random = "";
  for (let i = 0;i < digits; i++) {
    random += Math.floor(Math.random() * 10);
  }
  return prefix + random;
};
var _window = function() {
  return window;
};
var _setWindowLocation = function(url) {
  _window().location.href = url;
};
var _isWorker = function() {
  return typeof _window()["WorkerGlobalScope"] !== "undefined" && typeof _window()["importScripts"] === "function";
};
async function _getActiveServiceWorker() {
  if (!(navigator === null || navigator === undefined ? undefined : navigator.serviceWorker)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.ready;
    return registration.active;
  } catch (_a) {
    return null;
  }
}
var _getServiceWorkerController = function() {
  var _a;
  return ((_a = navigator === null || navigator === undefined ? undefined : navigator.serviceWorker) === null || _a === undefined ? undefined : _a.controller) || null;
};
var _getWorkerGlobalScope = function() {
  return _isWorker() ? self : null;
};
var getObjectStore = function(db, isReadWrite) {
  return db.transaction([DB_OBJECTSTORE_NAME], isReadWrite ? "readwrite" : "readonly").objectStore(DB_OBJECTSTORE_NAME);
};
var _deleteDatabase = function() {
  const request = indexedDB.deleteDatabase(DB_NAME2);
  return new DBPromise(request).toPromise();
};
var _openDatabase = function() {
  const request = indexedDB.open(DB_NAME2, DB_VERSION2);
  return new Promise((resolve, reject) => {
    request.addEventListener("error", () => {
      reject(request.error);
    });
    request.addEventListener("upgradeneeded", () => {
      const db = request.result;
      try {
        db.createObjectStore(DB_OBJECTSTORE_NAME, { keyPath: DB_DATA_KEYPATH });
      } catch (e) {
        reject(e);
      }
    });
    request.addEventListener("success", async () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
        db.close();
        await _deleteDatabase();
        resolve(await _openDatabase());
      } else {
        resolve(db);
      }
    });
  });
};
async function _putObject(db, key, value) {
  const request = getObjectStore(db, true).put({
    [DB_DATA_KEYPATH]: key,
    value
  });
  return new DBPromise(request).toPromise();
}
async function getObject(db, key) {
  const request = getObjectStore(db, false).get(key);
  const data = await new DBPromise(request).toPromise();
  return data === undefined ? null : data.value;
}
var _deleteObject = function(db, key) {
  const request = getObjectStore(db, true).delete(key);
  return new DBPromise(request).toPromise();
};
var startSignInPhoneMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:start", _addTidIfNecessary(auth, request));
};
var finalizeSignInPhoneMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth, request));
};
var finalizeSignInTotpMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth, request));
};
async function _verifyPhoneNumber(auth, options, verifier) {
  var _a;
  const recaptchaToken = await verifier.verify();
  try {
    _assert(typeof recaptchaToken === "string", auth, "argument-error");
    _assert(verifier.type === RECAPTCHA_VERIFIER_TYPE, auth, "argument-error");
    let phoneInfoOptions;
    if (typeof options === "string") {
      phoneInfoOptions = {
        phoneNumber: options
      };
    } else {
      phoneInfoOptions = options;
    }
    if ("session" in phoneInfoOptions) {
      const session = phoneInfoOptions.session;
      if ("phoneNumber" in phoneInfoOptions) {
        _assert(session.type === "enroll", auth, "internal-error");
        const response = await startEnrollPhoneMfa(auth, {
          idToken: session.credential,
          phoneEnrollmentInfo: {
            phoneNumber: phoneInfoOptions.phoneNumber,
            recaptchaToken
          }
        });
        return response.phoneSessionInfo.sessionInfo;
      } else {
        _assert(session.type === "signin", auth, "internal-error");
        const mfaEnrollmentId = ((_a = phoneInfoOptions.multiFactorHint) === null || _a === undefined ? undefined : _a.uid) || phoneInfoOptions.multiFactorUid;
        _assert(mfaEnrollmentId, auth, "missing-multi-factor-info");
        const response = await startSignInPhoneMfa(auth, {
          mfaPendingCredential: session.credential,
          mfaEnrollmentId,
          phoneSignInInfo: {
            recaptchaToken
          }
        });
        return response.phoneResponseInfo.sessionInfo;
      }
    } else {
      const { sessionInfo } = await sendPhoneVerificationCode(auth, {
        phoneNumber: phoneInfoOptions.phoneNumber,
        recaptchaToken
      });
      return sessionInfo;
    }
  } finally {
    verifier._reset();
  }
}
var _withDefaultResolver = function(auth, resolverOverride) {
  if (resolverOverride) {
    return _getInstance(resolverOverride);
  }
  _assert(auth._popupRedirectResolver, auth, "argument-error");
  return auth._popupRedirectResolver;
};
var _signIn = function(params) {
  return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
};
var _reauth = function(params) {
  const { auth, user } = params;
  _assert(user, auth, "internal-error");
  return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
};
async function _link(params) {
  const { auth, user } = params;
  _assert(user, auth, "internal-error");
  return _link$1(user, new IdpCredential(params), params.bypassAuthState);
}
async function signInWithPopup(auth, provider, resolver) {
  if (_isFirebaseServerApp(auth.app)) {
    return Promise.reject(_createError(auth, "operation-not-supported-in-this-environment"));
  }
  const authInternal = _castAuth(auth);
  _assertInstanceOf(auth, provider, FederatedAuthProvider);
  const resolverInternal = _withDefaultResolver(authInternal, resolver);
  const action = new PopupOperation(authInternal, "signInViaPopup", provider, resolverInternal);
  return action.executeNotNull();
}
async function _getAndClearPendingRedirectStatus(resolver, auth) {
  const key = pendingRedirectKey(auth);
  const persistence = resolverPersistence(resolver);
  if (!await persistence._isAvailable()) {
    return false;
  }
  const hasPendingRedirect = await persistence._get(key) === "true";
  await persistence._remove(key);
  return hasPendingRedirect;
}
var _overrideRedirectResult = function(auth, result) {
  redirectOutcomeMap.set(auth._key(), result);
};
var resolverPersistence = function(resolver) {
  return _getInstance(resolver._redirectPersistence);
};
var pendingRedirectKey = function(auth) {
  return _persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
};
async function _getRedirectResult(auth, resolverExtern, bypassAuthState = false) {
  if (_isFirebaseServerApp(auth.app)) {
    return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
  }
  const authInternal = _castAuth(auth);
  const resolver = _withDefaultResolver(authInternal, resolverExtern);
  const action = new RedirectAction(authInternal, resolver, bypassAuthState);
  const result = await action.execute();
  if (result && !bypassAuthState) {
    delete result.user._redirectEventId;
    await authInternal._persistUserIfCurrent(result.user);
    await authInternal._setRedirectUser(null, resolverExtern);
  }
  return result;
}
var eventUid = function(e) {
  return [e.type, e.eventId, e.sessionId, e.tenantId].filter((v) => v).join("-");
};
var isNullRedirectEvent = function({ type, error }) {
  return type === "unknown" && (error === null || error === undefined ? undefined : error.code) === `auth/${"no-auth-event"}`;
};
var isRedirectEvent = function(event) {
  switch (event.type) {
    case "signInViaRedirect":
    case "linkViaRedirect":
    case "reauthViaRedirect":
      return true;
    case "unknown":
      return isNullRedirectEvent(event);
    default:
      return false;
  }
};
async function _getProjectConfig(auth, request = {}) {
  return _performApiRequest(auth, "GET", "/v1/projects", request);
}
async function _validateOrigin(auth) {
  if (auth.config.emulator) {
    return;
  }
  const { authorizedDomains } = await _getProjectConfig(auth);
  for (const domain of authorizedDomains) {
    try {
      if (matchDomain(domain)) {
        return;
      }
    } catch (_a) {
    }
  }
  _fail(auth, "unauthorized-domain");
}
var matchDomain = function(expected) {
  const currentUrl = _getCurrentUrl();
  const { protocol, hostname } = new URL(currentUrl);
  if (expected.startsWith("chrome-extension://")) {
    const ceUrl = new URL(expected);
    if (ceUrl.hostname === "" && hostname === "") {
      return protocol === "chrome-extension:" && expected.replace("chrome-extension://", "") === currentUrl.replace("chrome-extension://", "");
    }
    return protocol === "chrome-extension:" && ceUrl.hostname === hostname;
  }
  if (!HTTP_REGEX.test(protocol)) {
    return false;
  }
  if (IP_ADDRESS_REGEX.test(expected)) {
    return hostname === expected;
  }
  const escapedDomainPattern = expected.replace(/\./g, "\\.");
  const re = new RegExp("^(.+\\." + escapedDomainPattern + "|" + escapedDomainPattern + ")$", "i");
  return re.test(hostname);
};
var resetUnloadedGapiModules = function() {
  const beacon = _window().___jsl;
  if (beacon === null || beacon === undefined ? undefined : beacon.H) {
    for (const hint of Object.keys(beacon.H)) {
      beacon.H[hint].r = beacon.H[hint].r || [];
      beacon.H[hint].L = beacon.H[hint].L || [];
      beacon.H[hint].r = [...beacon.H[hint].L];
      if (beacon.CP) {
        for (let i = 0;i < beacon.CP.length; i++) {
          beacon.CP[i] = null;
        }
      }
    }
  }
};
var loadGapi = function(auth) {
  return new Promise((resolve, reject) => {
    var _a, _b, _c;
    function loadGapiIframe() {
      resetUnloadedGapiModules();
      gapi.load("gapi.iframes", {
        callback: () => {
          resolve(gapi.iframes.getContext());
        },
        ontimeout: () => {
          resetUnloadedGapiModules();
          reject(_createError(auth, "network-request-failed"));
        },
        timeout: NETWORK_TIMEOUT.get()
      });
    }
    if ((_b = (_a = _window().gapi) === null || _a === undefined ? undefined : _a.iframes) === null || _b === undefined ? undefined : _b.Iframe) {
      resolve(gapi.iframes.getContext());
    } else if (!!((_c = _window().gapi) === null || _c === undefined ? undefined : _c.load)) {
      loadGapiIframe();
    } else {
      const cbName = _generateCallbackName("iframefcb");
      _window()[cbName] = () => {
        if (!!gapi.load) {
          loadGapiIframe();
        } else {
          reject(_createError(auth, "network-request-failed"));
        }
      };
      return _loadJS(`${_gapiScriptUrl()}?onload=${cbName}`).catch((e) => reject(e));
    }
  }).catch((error) => {
    cachedGApiLoader = null;
    throw error;
  });
};
var _loadGapi = function(auth) {
  cachedGApiLoader = cachedGApiLoader || loadGapi(auth);
  return cachedGApiLoader;
};
var getIframeUrl = function(auth) {
  const config = auth.config;
  _assert(config.authDomain, auth, "auth-domain-config-required");
  const url = config.emulator ? _emulatorUrl(config, EMULATED_IFRAME_PATH) : `https://${auth.config.authDomain}/${IFRAME_PATH}`;
  const params = {
    apiKey: config.apiKey,
    appName: auth.name,
    v: SDK_VERSION
  };
  const eid = EID_FROM_APIHOST.get(auth.config.apiHost);
  if (eid) {
    params.eid = eid;
  }
  const frameworks = auth._getFrameworks();
  if (frameworks.length) {
    params.fw = frameworks.join(",");
  }
  return `${url}?${querystring(params).slice(1)}`;
};
async function _openIframe(auth) {
  const context = await _loadGapi(auth);
  const gapi2 = _window().gapi;
  _assert(gapi2, auth, "internal-error");
  return context.open({
    where: document.body,
    url: getIframeUrl(auth),
    messageHandlersFilter: gapi2.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
    attributes: IFRAME_ATTRIBUTES,
    dontclear: true
  }, (iframe) => new Promise(async (resolve, reject) => {
    await iframe.restyle({
      setHideOnLeave: false
    });
    const networkError = _createError(auth, "network-request-failed");
    const networkErrorTimer = _window().setTimeout(() => {
      reject(networkError);
    }, PING_TIMEOUT.get());
    function clearTimerAndResolve() {
      _window().clearTimeout(networkErrorTimer);
      resolve(iframe);
    }
    iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, () => {
      reject(networkError);
    });
  }));
}
var _open = function(auth, url, name3, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
  const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
  const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
  let target = "";
  const options = Object.assign(Object.assign({}, BASE_POPUP_OPTIONS), {
    width: width.toString(),
    height: height.toString(),
    top,
    left
  });
  const ua = getUA().toLowerCase();
  if (name3) {
    target = _isChromeIOS(ua) ? TARGET_BLANK : name3;
  }
  if (_isFirefox(ua)) {
    url = url || FIREFOX_EMPTY_URL;
    options.scrollbars = "yes";
  }
  const optionsString = Object.entries(options).reduce((accum, [key, value]) => `${accum}${key}=${value},`, "");
  if (_isIOSStandalone(ua) && target !== "_self") {
    openAsNewWindowIOS(url || "", target);
    return new AuthPopup(null);
  }
  const newWin = window.open(url || "", target, optionsString);
  _assert(newWin, auth, "popup-blocked");
  try {
    newWin.focus();
  } catch (e) {
  }
  return new AuthPopup(newWin);
};
var openAsNewWindowIOS = function(url, target) {
  const el = document.createElement("a");
  el.href = url;
  el.target = target;
  const click = document.createEvent("MouseEvent");
  click.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
  el.dispatchEvent(click);
};
async function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
  _assert(auth.config.authDomain, auth, "auth-domain-config-required");
  _assert(auth.config.apiKey, auth, "invalid-api-key");
  const params = {
    apiKey: auth.config.apiKey,
    appName: auth.name,
    authType,
    redirectUrl,
    v: SDK_VERSION,
    eventId
  };
  if (provider instanceof FederatedAuthProvider) {
    provider.setDefaultLanguage(auth.languageCode);
    params.providerId = provider.providerId || "";
    if (!isEmpty(provider.getCustomParameters())) {
      params.customParameters = JSON.stringify(provider.getCustomParameters());
    }
    for (const [key, value] of Object.entries(additionalParams || {})) {
      params[key] = value;
    }
  }
  if (provider instanceof BaseOAuthProvider) {
    const scopes = provider.getScopes().filter((scope) => scope !== "");
    if (scopes.length > 0) {
      params.scopes = scopes.join(",");
    }
  }
  if (auth.tenantId) {
    params.tid = auth.tenantId;
  }
  const paramsDict = params;
  for (const key of Object.keys(paramsDict)) {
    if (paramsDict[key] === undefined) {
      delete paramsDict[key];
    }
  }
  const appCheckToken = await auth._getAppCheckToken();
  const appCheckTokenFragment = appCheckToken ? `#${FIREBASE_APP_CHECK_FRAGMENT_ID}=${encodeURIComponent(appCheckToken)}` : "";
  return `${getHandlerBase(auth)}?${querystring(paramsDict).slice(1)}${appCheckTokenFragment}`;
}
var getHandlerBase = function({ config }) {
  if (!config.emulator) {
    return `https://${config.authDomain}/${WIDGET_PATH}`;
  }
  return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
};
var _isEmptyString = function(input) {
  return typeof input === "undefined" || (input === null || input === undefined ? undefined : input.length) === 0;
};
var getVersionForPlatform = function(clientPlatform) {
  switch (clientPlatform) {
    case "Node":
      return "node";
    case "ReactNative":
      return "rn";
    case "Worker":
      return "webworker";
    case "Cordova":
      return "cordova";
    case "WebExtension":
      return "web-extension";
    default:
      return;
  }
};
var registerAuth = function(clientPlatform) {
  _registerComponent(new Component("auth", (container, { options: deps }) => {
    const app4 = container.getProvider("app").getImmediate();
    const heartbeatServiceProvider = container.getProvider("heartbeat");
    const appCheckServiceProvider = container.getProvider("app-check-internal");
    const { apiKey, authDomain } = app4.options;
    _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", { appName: app4.name });
    const config = {
      apiKey,
      authDomain,
      clientPlatform,
      apiHost: "identitytoolkit.googleapis.com",
      tokenApiHost: "securetoken.googleapis.com",
      apiScheme: "https",
      sdkClientVersion: _getClientVersion(clientPlatform)
    };
    const authInstance = new AuthImpl(app4, heartbeatServiceProvider, appCheckServiceProvider, config);
    _initializeAuthInstance(authInstance, deps);
    return authInstance;
  }, "PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
    const authInternalProvider = container.getProvider("auth-internal");
    authInternalProvider.initialize();
  }));
  _registerComponent(new Component("auth-internal", (container) => {
    const auth = _castAuth(container.getProvider("auth").getImmediate());
    return ((auth2) => new AuthInterop(auth2))(auth);
  }, "PRIVATE").setInstantiationMode("EXPLICIT"));
  registerVersion(name3, version3, getVersionForPlatform(clientPlatform));
  registerVersion(name3, version3, "esm2017");
};
var getAuth = function(app4 = getApp()) {
  const provider = _getProvider(app4, "auth");
  if (provider.isInitialized()) {
    return provider.getImmediate();
  }
  const auth = initializeAuth(app4, {
    popupRedirectResolver: browserPopupRedirectResolver,
    persistence: [
      indexedDBLocalPersistence,
      browserLocalPersistence,
      browserSessionPersistence
    ]
  });
  const authTokenSyncPath = getExperimentalSetting("authTokenSyncURL");
  if (authTokenSyncPath && typeof isSecureContext === "boolean" && isSecureContext) {
    const authTokenSyncUrl = new URL(authTokenSyncPath, location.origin);
    if (location.origin === authTokenSyncUrl.origin) {
      const mintCookie = mintCookieFactory(authTokenSyncUrl.toString());
      beforeAuthStateChanged(auth, mintCookie, () => mintCookie(auth.currentUser));
      onIdTokenChanged(auth, (user) => mintCookie(user));
    }
  }
  const authEmulatorHost = getDefaultEmulatorHost("auth");
  if (authEmulatorHost) {
    connectAuthEmulator(auth, `http://${authEmulatorHost}`);
  }
  return auth;
};
var getScriptParentElement = function() {
  var _a, _b;
  return (_b = (_a = document.getElementsByTagName("head")) === null || _a === undefined ? undefined : _a[0]) !== null && _b !== undefined ? _b : document;
};
var prodErrorMap = _prodErrorMap;
var _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory("auth", "Firebase", _prodErrorMap());
var logClient = new Logger("@firebase/auth");

class Delay {
  constructor(shortDelay, longDelay) {
    this.shortDelay = shortDelay;
    this.longDelay = longDelay;
    debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
    this.isMobile = isMobileCordova() || isReactNative();
  }
  get() {
    if (!_isOnline()) {
      return Math.min(5000, this.shortDelay);
    }
    return this.isMobile ? this.longDelay : this.shortDelay;
  }
}

class FetchProvider {
  static initialize(fetchImpl, headersImpl, responseImpl) {
    this.fetchImpl = fetchImpl;
    if (headersImpl) {
      this.headersImpl = headersImpl;
    }
    if (responseImpl) {
      this.responseImpl = responseImpl;
    }
  }
  static fetch() {
    if (this.fetchImpl) {
      return this.fetchImpl;
    }
    if (typeof self !== "undefined" && "fetch" in self) {
      return self.fetch;
    }
    if (typeof globalThis !== "undefined" && globalThis.fetch) {
      return globalThis.fetch;
    }
    if (typeof fetch !== "undefined") {
      return fetch;
    }
    debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static headers() {
    if (this.headersImpl) {
      return this.headersImpl;
    }
    if (typeof self !== "undefined" && "Headers" in self) {
      return self.Headers;
    }
    if (typeof globalThis !== "undefined" && globalThis.Headers) {
      return globalThis.Headers;
    }
    if (typeof Headers !== "undefined") {
      return Headers;
    }
    debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static response() {
    if (this.responseImpl) {
      return this.responseImpl;
    }
    if (typeof self !== "undefined" && "Response" in self) {
      return self.Response;
    }
    if (typeof globalThis !== "undefined" && globalThis.Response) {
      return globalThis.Response;
    }
    if (typeof Response !== "undefined") {
      return Response;
    }
    debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
}
var SERVER_ERROR_MAP = {
  ["CREDENTIAL_MISMATCH"]: "custom-token-mismatch",
  ["MISSING_CUSTOM_TOKEN"]: "internal-error",
  ["INVALID_IDENTIFIER"]: "invalid-email",
  ["MISSING_CONTINUE_URI"]: "internal-error",
  ["INVALID_PASSWORD"]: "wrong-password",
  ["MISSING_PASSWORD"]: "missing-password",
  ["INVALID_LOGIN_CREDENTIALS"]: "invalid-credential",
  ["EMAIL_EXISTS"]: "email-already-in-use",
  ["PASSWORD_LOGIN_DISABLED"]: "operation-not-allowed",
  ["INVALID_IDP_RESPONSE"]: "invalid-credential",
  ["INVALID_PENDING_TOKEN"]: "invalid-credential",
  ["FEDERATED_USER_ID_ALREADY_LINKED"]: "credential-already-in-use",
  ["MISSING_REQ_TYPE"]: "internal-error",
  ["EMAIL_NOT_FOUND"]: "user-not-found",
  ["RESET_PASSWORD_EXCEED_LIMIT"]: "too-many-requests",
  ["EXPIRED_OOB_CODE"]: "expired-action-code",
  ["INVALID_OOB_CODE"]: "invalid-action-code",
  ["MISSING_OOB_CODE"]: "internal-error",
  ["CREDENTIAL_TOO_OLD_LOGIN_AGAIN"]: "requires-recent-login",
  ["INVALID_ID_TOKEN"]: "invalid-user-token",
  ["TOKEN_EXPIRED"]: "user-token-expired",
  ["USER_NOT_FOUND"]: "user-token-expired",
  ["TOO_MANY_ATTEMPTS_TRY_LATER"]: "too-many-requests",
  ["PASSWORD_DOES_NOT_MEET_REQUIREMENTS"]: "password-does-not-meet-requirements",
  ["INVALID_CODE"]: "invalid-verification-code",
  ["INVALID_SESSION_INFO"]: "invalid-verification-id",
  ["INVALID_TEMPORARY_PROOF"]: "invalid-credential",
  ["MISSING_SESSION_INFO"]: "missing-verification-id",
  ["SESSION_EXPIRED"]: "code-expired",
  ["MISSING_ANDROID_PACKAGE_NAME"]: "missing-android-pkg-name",
  ["UNAUTHORIZED_DOMAIN"]: "unauthorized-continue-uri",
  ["INVALID_OAUTH_CLIENT_ID"]: "invalid-oauth-client-id",
  ["ADMIN_ONLY_OPERATION"]: "admin-restricted-operation",
  ["INVALID_MFA_PENDING_CREDENTIAL"]: "invalid-multi-factor-session",
  ["MFA_ENROLLMENT_NOT_FOUND"]: "multi-factor-info-not-found",
  ["MISSING_MFA_ENROLLMENT_ID"]: "missing-multi-factor-info",
  ["MISSING_MFA_PENDING_CREDENTIAL"]: "missing-multi-factor-session",
  ["SECOND_FACTOR_EXISTS"]: "second-factor-already-in-use",
  ["SECOND_FACTOR_LIMIT_EXCEEDED"]: "maximum-second-factor-count-exceeded",
  ["BLOCKING_FUNCTION_ERROR_RESPONSE"]: "internal-error",
  ["RECAPTCHA_NOT_ENABLED"]: "recaptcha-not-enabled",
  ["MISSING_RECAPTCHA_TOKEN"]: "missing-recaptcha-token",
  ["INVALID_RECAPTCHA_TOKEN"]: "invalid-recaptcha-token",
  ["INVALID_RECAPTCHA_ACTION"]: "invalid-recaptcha-action",
  ["MISSING_CLIENT_TYPE"]: "missing-client-type",
  ["MISSING_RECAPTCHA_VERSION"]: "missing-recaptcha-version",
  ["INVALID_RECAPTCHA_VERSION"]: "invalid-recaptcha-version",
  ["INVALID_REQ_TYPE"]: "invalid-req-type"
};
var DEFAULT_API_TIMEOUT_MS = new Delay(30000, 60000);

class NetworkTimeout {
  constructor(auth) {
    this.auth = auth;
    this.timer = null;
    this.promise = new Promise((_, reject) => {
      this.timer = setTimeout(() => {
        return reject(_createError(this.auth, "network-request-failed"));
      }, DEFAULT_API_TIMEOUT_MS.get());
    });
  }
  clearNetworkTimeout() {
    clearTimeout(this.timer);
  }
}

class RecaptchaConfig {
  constructor(response) {
    this.siteKey = "";
    this.recaptchaEnforcementState = [];
    if (response.recaptchaKey === undefined) {
      throw new Error("recaptchaKey undefined");
    }
    this.siteKey = response.recaptchaKey.split("/")[3];
    this.recaptchaEnforcementState = response.recaptchaEnforcementState;
  }
  getProviderEnforcementState(providerStr) {
    if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) {
      return null;
    }
    for (const recaptchaEnforcementState of this.recaptchaEnforcementState) {
      if (recaptchaEnforcementState.provider && recaptchaEnforcementState.provider === providerStr) {
        return _parseEnforcementState(recaptchaEnforcementState.enforcementState);
      }
    }
    return null;
  }
  isProviderEnabled(providerStr) {
    return this.getProviderEnforcementState(providerStr) === "ENFORCE" || this.getProviderEnforcementState(providerStr) === "AUDIT";
  }
}

class ProactiveRefresh {
  constructor(user) {
    this.user = user;
    this.isRunning = false;
    this.timerId = null;
    this.errorBackoff = 30000;
  }
  _start() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.schedule();
  }
  _stop() {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
    }
  }
  getInterval(wasError) {
    var _a;
    if (wasError) {
      const interval = this.errorBackoff;
      this.errorBackoff = Math.min(this.errorBackoff * 2, 960000);
      return interval;
    } else {
      this.errorBackoff = 30000;
      const expTime = (_a = this.user.stsTokenManager.expirationTime) !== null && _a !== undefined ? _a : 0;
      const interval = expTime - Date.now() - 300000;
      return Math.max(0, interval);
    }
  }
  schedule(wasError = false) {
    if (!this.isRunning) {
      return;
    }
    const interval = this.getInterval(wasError);
    this.timerId = setTimeout(async () => {
      await this.iteration();
    }, interval);
  }
  async iteration() {
    try {
      await this.user.getIdToken(true);
    } catch (e) {
      if ((e === null || e === undefined ? undefined : e.code) === `auth/${"network-request-failed"}`) {
        this.schedule(true);
      }
      return;
    }
    this.schedule();
  }
}

class UserMetadata {
  constructor(createdAt, lastLoginAt) {
    this.createdAt = createdAt;
    this.lastLoginAt = lastLoginAt;
    this._initializeTime();
  }
  _initializeTime() {
    this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
    this.creationTime = utcTimestampToDateString(this.createdAt);
  }
  _copy(metadata) {
    this.createdAt = metadata.createdAt;
    this.lastLoginAt = metadata.lastLoginAt;
    this._initializeTime();
  }
  toJSON() {
    return {
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt
    };
  }
}

class StsTokenManager {
  constructor() {
    this.refreshToken = null;
    this.accessToken = null;
    this.expirationTime = null;
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 30000;
  }
  updateFromServerResponse(response) {
    _assert(response.idToken, "internal-error");
    _assert(typeof response.idToken !== "undefined", "internal-error");
    _assert(typeof response.refreshToken !== "undefined", "internal-error");
    const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
    this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
  }
  updateFromIdToken(idToken) {
    _assert(idToken.length !== 0, "internal-error");
    const expiresIn = _tokenExpiresIn(idToken);
    this.updateTokensAndExpiration(idToken, null, expiresIn);
  }
  async getToken(auth, forceRefresh = false) {
    if (!forceRefresh && this.accessToken && !this.isExpired) {
      return this.accessToken;
    }
    _assert(this.refreshToken, auth, "user-token-expired");
    if (this.refreshToken) {
      await this.refresh(auth, this.refreshToken);
      return this.accessToken;
    }
    return null;
  }
  clearRefreshToken() {
    this.refreshToken = null;
  }
  async refresh(auth, oldToken) {
    const { accessToken, refreshToken, expiresIn } = await requestStsToken(auth, oldToken);
    this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
  }
  updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
    this.refreshToken = refreshToken || null;
    this.accessToken = accessToken || null;
    this.expirationTime = Date.now() + expiresInSec * 1000;
  }
  static fromJSON(appName, object) {
    const { refreshToken, accessToken, expirationTime } = object;
    const manager = new StsTokenManager;
    if (refreshToken) {
      _assert(typeof refreshToken === "string", "internal-error", {
        appName
      });
      manager.refreshToken = refreshToken;
    }
    if (accessToken) {
      _assert(typeof accessToken === "string", "internal-error", {
        appName
      });
      manager.accessToken = accessToken;
    }
    if (expirationTime) {
      _assert(typeof expirationTime === "number", "internal-error", {
        appName
      });
      manager.expirationTime = expirationTime;
    }
    return manager;
  }
  toJSON() {
    return {
      refreshToken: this.refreshToken,
      accessToken: this.accessToken,
      expirationTime: this.expirationTime
    };
  }
  _assign(stsTokenManager) {
    this.accessToken = stsTokenManager.accessToken;
    this.refreshToken = stsTokenManager.refreshToken;
    this.expirationTime = stsTokenManager.expirationTime;
  }
  _clone() {
    return Object.assign(new StsTokenManager, this.toJSON());
  }
  _performRefresh() {
    return debugFail("not implemented");
  }
}

class UserImpl {
  constructor(_a) {
    var { uid, auth, stsTokenManager } = _a, opt = __rest(_a, ["uid", "auth", "stsTokenManager"]);
    this.providerId = "firebase";
    this.proactiveRefresh = new ProactiveRefresh(this);
    this.reloadUserInfo = null;
    this.reloadListener = null;
    this.uid = uid;
    this.auth = auth;
    this.stsTokenManager = stsTokenManager;
    this.accessToken = stsTokenManager.accessToken;
    this.displayName = opt.displayName || null;
    this.email = opt.email || null;
    this.emailVerified = opt.emailVerified || false;
    this.phoneNumber = opt.phoneNumber || null;
    this.photoURL = opt.photoURL || null;
    this.isAnonymous = opt.isAnonymous || false;
    this.tenantId = opt.tenantId || null;
    this.providerData = opt.providerData ? [...opt.providerData] : [];
    this.metadata = new UserMetadata(opt.createdAt || undefined, opt.lastLoginAt || undefined);
  }
  async getIdToken(forceRefresh) {
    const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
    _assert(accessToken, this.auth, "internal-error");
    if (this.accessToken !== accessToken) {
      this.accessToken = accessToken;
      await this.auth._persistUserIfCurrent(this);
      this.auth._notifyListenersIfCurrent(this);
    }
    return accessToken;
  }
  getIdTokenResult(forceRefresh) {
    return getIdTokenResult(this, forceRefresh);
  }
  reload() {
    return reload(this);
  }
  _assign(user) {
    if (this === user) {
      return;
    }
    _assert(this.uid === user.uid, this.auth, "internal-error");
    this.displayName = user.displayName;
    this.photoURL = user.photoURL;
    this.email = user.email;
    this.emailVerified = user.emailVerified;
    this.phoneNumber = user.phoneNumber;
    this.isAnonymous = user.isAnonymous;
    this.tenantId = user.tenantId;
    this.providerData = user.providerData.map((userInfo) => Object.assign({}, userInfo));
    this.metadata._copy(user.metadata);
    this.stsTokenManager._assign(user.stsTokenManager);
  }
  _clone(auth) {
    const newUser = new UserImpl(Object.assign(Object.assign({}, this), { auth, stsTokenManager: this.stsTokenManager._clone() }));
    newUser.metadata._copy(this.metadata);
    return newUser;
  }
  _onReload(callback) {
    _assert(!this.reloadListener, this.auth, "internal-error");
    this.reloadListener = callback;
    if (this.reloadUserInfo) {
      this._notifyReloadListener(this.reloadUserInfo);
      this.reloadUserInfo = null;
    }
  }
  _notifyReloadListener(userInfo) {
    if (this.reloadListener) {
      this.reloadListener(userInfo);
    } else {
      this.reloadUserInfo = userInfo;
    }
  }
  _startProactiveRefresh() {
    this.proactiveRefresh._start();
  }
  _stopProactiveRefresh() {
    this.proactiveRefresh._stop();
  }
  async _updateTokensIfNecessary(response, reload2 = false) {
    let tokensRefreshed = false;
    if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
      this.stsTokenManager.updateFromServerResponse(response);
      tokensRefreshed = true;
    }
    if (reload2) {
      await _reloadWithoutSaving(this);
    }
    await this.auth._persistUserIfCurrent(this);
    if (tokensRefreshed) {
      this.auth._notifyListenersIfCurrent(this);
    }
  }
  async delete() {
    if (_isFirebaseServerApp(this.auth.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this.auth));
    }
    const idToken = await this.getIdToken();
    await _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken }));
    this.stsTokenManager.clearRefreshToken();
    return this.auth.signOut();
  }
  toJSON() {
    return Object.assign(Object.assign({
      uid: this.uid,
      email: this.email || undefined,
      emailVerified: this.emailVerified,
      displayName: this.displayName || undefined,
      isAnonymous: this.isAnonymous,
      photoURL: this.photoURL || undefined,
      phoneNumber: this.phoneNumber || undefined,
      tenantId: this.tenantId || undefined,
      providerData: this.providerData.map((userInfo) => Object.assign({}, userInfo)),
      stsTokenManager: this.stsTokenManager.toJSON(),
      _redirectEventId: this._redirectEventId
    }, this.metadata.toJSON()), {
      apiKey: this.auth.config.apiKey,
      appName: this.auth.name
    });
  }
  get refreshToken() {
    return this.stsTokenManager.refreshToken || "";
  }
  static _fromJSON(auth, object) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const displayName = (_a = object.displayName) !== null && _a !== undefined ? _a : undefined;
    const email = (_b = object.email) !== null && _b !== undefined ? _b : undefined;
    const phoneNumber = (_c = object.phoneNumber) !== null && _c !== undefined ? _c : undefined;
    const photoURL = (_d = object.photoURL) !== null && _d !== undefined ? _d : undefined;
    const tenantId = (_e = object.tenantId) !== null && _e !== undefined ? _e : undefined;
    const _redirectEventId = (_f = object._redirectEventId) !== null && _f !== undefined ? _f : undefined;
    const createdAt = (_g = object.createdAt) !== null && _g !== undefined ? _g : undefined;
    const lastLoginAt = (_h = object.lastLoginAt) !== null && _h !== undefined ? _h : undefined;
    const { uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager } = object;
    _assert(uid && plainObjectTokenManager, auth, "internal-error");
    const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
    _assert(typeof uid === "string", auth, "internal-error");
    assertStringOrUndefined(displayName, auth.name);
    assertStringOrUndefined(email, auth.name);
    _assert(typeof emailVerified === "boolean", auth, "internal-error");
    _assert(typeof isAnonymous === "boolean", auth, "internal-error");
    assertStringOrUndefined(phoneNumber, auth.name);
    assertStringOrUndefined(photoURL, auth.name);
    assertStringOrUndefined(tenantId, auth.name);
    assertStringOrUndefined(_redirectEventId, auth.name);
    assertStringOrUndefined(createdAt, auth.name);
    assertStringOrUndefined(lastLoginAt, auth.name);
    const user = new UserImpl({
      uid,
      auth,
      email,
      emailVerified,
      displayName,
      isAnonymous,
      photoURL,
      phoneNumber,
      tenantId,
      stsTokenManager,
      createdAt,
      lastLoginAt
    });
    if (providerData && Array.isArray(providerData)) {
      user.providerData = providerData.map((userInfo) => Object.assign({}, userInfo));
    }
    if (_redirectEventId) {
      user._redirectEventId = _redirectEventId;
    }
    return user;
  }
  static async _fromIdTokenResponse(auth, idTokenResponse, isAnonymous = false) {
    const stsTokenManager = new StsTokenManager;
    stsTokenManager.updateFromServerResponse(idTokenResponse);
    const user = new UserImpl({
      uid: idTokenResponse.localId,
      auth,
      stsTokenManager,
      isAnonymous
    });
    await _reloadWithoutSaving(user);
    return user;
  }
  static async _fromGetAccountInfoResponse(auth, response, idToken) {
    const coreAccount = response.users[0];
    _assert(coreAccount.localId !== undefined, "internal-error");
    const providerData = coreAccount.providerUserInfo !== undefined ? extractProviderData(coreAccount.providerUserInfo) : [];
    const isAnonymous = !(coreAccount.email && coreAccount.passwordHash) && !(providerData === null || providerData === undefined ? undefined : providerData.length);
    const stsTokenManager = new StsTokenManager;
    stsTokenManager.updateFromIdToken(idToken);
    const user = new UserImpl({
      uid: coreAccount.localId,
      auth,
      stsTokenManager,
      isAnonymous
    });
    const updates = {
      uid: coreAccount.localId,
      displayName: coreAccount.displayName || null,
      photoURL: coreAccount.photoUrl || null,
      email: coreAccount.email || null,
      emailVerified: coreAccount.emailVerified || false,
      phoneNumber: coreAccount.phoneNumber || null,
      tenantId: coreAccount.tenantId || null,
      providerData,
      metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
      isAnonymous: !(coreAccount.email && coreAccount.passwordHash) && !(providerData === null || providerData === undefined ? undefined : providerData.length)
    };
    Object.assign(user, updates);
    return user;
  }
}
var instanceCache = new Map;

class InMemoryPersistence {
  constructor() {
    this.type = "NONE";
    this.storage = {};
  }
  async _isAvailable() {
    return true;
  }
  async _set(key, value) {
    this.storage[key] = value;
  }
  async _get(key) {
    const value = this.storage[key];
    return value === undefined ? null : value;
  }
  async _remove(key) {
    delete this.storage[key];
  }
  _addListener(_key, _listener) {
    return;
  }
  _removeListener(_key, _listener) {
    return;
  }
}
InMemoryPersistence.type = "NONE";
var inMemoryPersistence = InMemoryPersistence;

class PersistenceUserManager {
  constructor(persistence, auth, userKey) {
    this.persistence = persistence;
    this.auth = auth;
    this.userKey = userKey;
    const { config, name: name3 } = this.auth;
    this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name3);
    this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name3);
    this.boundEventHandler = auth._onStorageEvent.bind(auth);
    this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
  }
  setCurrentUser(user) {
    return this.persistence._set(this.fullUserKey, user.toJSON());
  }
  async getCurrentUser() {
    const blob = await this.persistence._get(this.fullUserKey);
    return blob ? UserImpl._fromJSON(this.auth, blob) : null;
  }
  removeCurrentUser() {
    return this.persistence._remove(this.fullUserKey);
  }
  savePersistenceForRedirect() {
    return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
  }
  async setPersistence(newPersistence) {
    if (this.persistence === newPersistence) {
      return;
    }
    const currentUser = await this.getCurrentUser();
    await this.removeCurrentUser();
    this.persistence = newPersistence;
    if (currentUser) {
      return this.setCurrentUser(currentUser);
    }
  }
  delete() {
    this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
  }
  static async create(auth, persistenceHierarchy, userKey = "authUser") {
    if (!persistenceHierarchy.length) {
      return new PersistenceUserManager(_getInstance(inMemoryPersistence), auth, userKey);
    }
    const availablePersistences = (await Promise.all(persistenceHierarchy.map(async (persistence) => {
      if (await persistence._isAvailable()) {
        return persistence;
      }
      return;
    }))).filter((persistence) => persistence);
    let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
    const key = _persistenceKeyName(userKey, auth.config.apiKey, auth.name);
    let userToMigrate = null;
    for (const persistence of persistenceHierarchy) {
      try {
        const blob = await persistence._get(key);
        if (blob) {
          const user = UserImpl._fromJSON(auth, blob);
          if (persistence !== selectedPersistence) {
            userToMigrate = user;
          }
          selectedPersistence = persistence;
          break;
        }
      } catch (_a) {
      }
    }
    const migrationHierarchy = availablePersistences.filter((p) => p._shouldAllowMigration);
    if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) {
      return new PersistenceUserManager(selectedPersistence, auth, userKey);
    }
    selectedPersistence = migrationHierarchy[0];
    if (userToMigrate) {
      await selectedPersistence._set(key, userToMigrate.toJSON());
    }
    await Promise.all(persistenceHierarchy.map(async (persistence) => {
      if (persistence !== selectedPersistence) {
        try {
          await persistence._remove(key);
        } catch (_a) {
        }
      }
    }));
    return new PersistenceUserManager(selectedPersistence, auth, userKey);
  }
}

class AuthMiddlewareQueue {
  constructor(auth) {
    this.auth = auth;
    this.queue = [];
  }
  pushCallback(callback, onAbort) {
    const wrappedCallback = (user) => new Promise((resolve, reject) => {
      try {
        const result = callback(user);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
    wrappedCallback.onAbort = onAbort;
    this.queue.push(wrappedCallback);
    const index = this.queue.length - 1;
    return () => {
      this.queue[index] = () => Promise.resolve();
    };
  }
  async runMiddleware(nextUser) {
    if (this.auth.currentUser === nextUser) {
      return;
    }
    const onAbortStack = [];
    try {
      for (const beforeStateCallback of this.queue) {
        await beforeStateCallback(nextUser);
        if (beforeStateCallback.onAbort) {
          onAbortStack.push(beforeStateCallback.onAbort);
        }
      }
    } catch (e) {
      onAbortStack.reverse();
      for (const onAbort of onAbortStack) {
        try {
          onAbort();
        } catch (_) {
        }
      }
      throw this.auth._errorFactory.create("login-blocked", {
        originalMessage: e === null || e === undefined ? undefined : e.message
      });
    }
  }
}
var MINIMUM_MIN_PASSWORD_LENGTH = 6;

class PasswordPolicyImpl {
  constructor(response) {
    var _a, _b, _c, _d;
    const responseOptions = response.customStrengthOptions;
    this.customStrengthOptions = {};
    this.customStrengthOptions.minPasswordLength = (_a = responseOptions.minPasswordLength) !== null && _a !== undefined ? _a : MINIMUM_MIN_PASSWORD_LENGTH;
    if (responseOptions.maxPasswordLength) {
      this.customStrengthOptions.maxPasswordLength = responseOptions.maxPasswordLength;
    }
    if (responseOptions.containsLowercaseCharacter !== undefined) {
      this.customStrengthOptions.containsLowercaseLetter = responseOptions.containsLowercaseCharacter;
    }
    if (responseOptions.containsUppercaseCharacter !== undefined) {
      this.customStrengthOptions.containsUppercaseLetter = responseOptions.containsUppercaseCharacter;
    }
    if (responseOptions.containsNumericCharacter !== undefined) {
      this.customStrengthOptions.containsNumericCharacter = responseOptions.containsNumericCharacter;
    }
    if (responseOptions.containsNonAlphanumericCharacter !== undefined) {
      this.customStrengthOptions.containsNonAlphanumericCharacter = responseOptions.containsNonAlphanumericCharacter;
    }
    this.enforcementState = response.enforcementState;
    if (this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED") {
      this.enforcementState = "OFF";
    }
    this.allowedNonAlphanumericCharacters = (_c = (_b = response.allowedNonAlphanumericCharacters) === null || _b === undefined ? undefined : _b.join("")) !== null && _c !== undefined ? _c : "";
    this.forceUpgradeOnSignin = (_d = response.forceUpgradeOnSignin) !== null && _d !== undefined ? _d : false;
    this.schemaVersion = response.schemaVersion;
  }
  validatePassword(password) {
    var _a, _b, _c, _d, _e, _f;
    const status = {
      isValid: true,
      passwordPolicy: this
    };
    this.validatePasswordLengthOptions(password, status);
    this.validatePasswordCharacterOptions(password, status);
    status.isValid && (status.isValid = (_a = status.meetsMinPasswordLength) !== null && _a !== undefined ? _a : true);
    status.isValid && (status.isValid = (_b = status.meetsMaxPasswordLength) !== null && _b !== undefined ? _b : true);
    status.isValid && (status.isValid = (_c = status.containsLowercaseLetter) !== null && _c !== undefined ? _c : true);
    status.isValid && (status.isValid = (_d = status.containsUppercaseLetter) !== null && _d !== undefined ? _d : true);
    status.isValid && (status.isValid = (_e = status.containsNumericCharacter) !== null && _e !== undefined ? _e : true);
    status.isValid && (status.isValid = (_f = status.containsNonAlphanumericCharacter) !== null && _f !== undefined ? _f : true);
    return status;
  }
  validatePasswordLengthOptions(password, status) {
    const minPasswordLength = this.customStrengthOptions.minPasswordLength;
    const maxPasswordLength = this.customStrengthOptions.maxPasswordLength;
    if (minPasswordLength) {
      status.meetsMinPasswordLength = password.length >= minPasswordLength;
    }
    if (maxPasswordLength) {
      status.meetsMaxPasswordLength = password.length <= maxPasswordLength;
    }
  }
  validatePasswordCharacterOptions(password, status) {
    this.updatePasswordCharacterOptionsStatuses(status, false, false, false, false);
    let passwordChar;
    for (let i = 0;i < password.length; i++) {
      passwordChar = password.charAt(i);
      this.updatePasswordCharacterOptionsStatuses(status, passwordChar >= "a" && passwordChar <= "z", passwordChar >= "A" && passwordChar <= "Z", passwordChar >= "0" && passwordChar <= "9", this.allowedNonAlphanumericCharacters.includes(passwordChar));
    }
  }
  updatePasswordCharacterOptionsStatuses(status, containsLowercaseCharacter, containsUppercaseCharacter, containsNumericCharacter, containsNonAlphanumericCharacter) {
    if (this.customStrengthOptions.containsLowercaseLetter) {
      status.containsLowercaseLetter || (status.containsLowercaseLetter = containsLowercaseCharacter);
    }
    if (this.customStrengthOptions.containsUppercaseLetter) {
      status.containsUppercaseLetter || (status.containsUppercaseLetter = containsUppercaseCharacter);
    }
    if (this.customStrengthOptions.containsNumericCharacter) {
      status.containsNumericCharacter || (status.containsNumericCharacter = containsNumericCharacter);
    }
    if (this.customStrengthOptions.containsNonAlphanumericCharacter) {
      status.containsNonAlphanumericCharacter || (status.containsNonAlphanumericCharacter = containsNonAlphanumericCharacter);
    }
  }
}

class AuthImpl {
  constructor(app4, heartbeatServiceProvider, appCheckServiceProvider, config) {
    this.app = app4;
    this.heartbeatServiceProvider = heartbeatServiceProvider;
    this.appCheckServiceProvider = appCheckServiceProvider;
    this.config = config;
    this.currentUser = null;
    this.emulatorConfig = null;
    this.operations = Promise.resolve();
    this.authStateSubscription = new Subscription(this);
    this.idTokenSubscription = new Subscription(this);
    this.beforeStateQueue = new AuthMiddlewareQueue(this);
    this.redirectUser = null;
    this.isProactiveRefreshEnabled = false;
    this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1;
    this._canInitEmulator = true;
    this._isInitialized = false;
    this._deleted = false;
    this._initializationPromise = null;
    this._popupRedirectResolver = null;
    this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
    this._agentRecaptchaConfig = null;
    this._tenantRecaptchaConfigs = {};
    this._projectPasswordPolicy = null;
    this._tenantPasswordPolicies = {};
    this.lastNotifiedUid = undefined;
    this.languageCode = null;
    this.tenantId = null;
    this.settings = { appVerificationDisabledForTesting: false };
    this.frameworks = [];
    this.name = app4.name;
    this.clientVersion = config.sdkClientVersion;
  }
  _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
    if (popupRedirectResolver) {
      this._popupRedirectResolver = _getInstance(popupRedirectResolver);
    }
    this._initializationPromise = this.queue(async () => {
      var _a, _b;
      if (this._deleted) {
        return;
      }
      this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
      if (this._deleted) {
        return;
      }
      if ((_a = this._popupRedirectResolver) === null || _a === undefined ? undefined : _a._shouldInitProactively) {
        try {
          await this._popupRedirectResolver._initialize(this);
        } catch (e) {
        }
      }
      await this.initializeCurrentUser(popupRedirectResolver);
      this.lastNotifiedUid = ((_b = this.currentUser) === null || _b === undefined ? undefined : _b.uid) || null;
      if (this._deleted) {
        return;
      }
      this._isInitialized = true;
    });
    return this._initializationPromise;
  }
  async _onStorageEvent() {
    if (this._deleted) {
      return;
    }
    const user = await this.assertedPersistence.getCurrentUser();
    if (!this.currentUser && !user) {
      return;
    }
    if (this.currentUser && user && this.currentUser.uid === user.uid) {
      this._currentUser._assign(user);
      await this.currentUser.getIdToken();
      return;
    }
    await this._updateCurrentUser(user, true);
  }
  async initializeCurrentUserFromIdToken(idToken) {
    try {
      const response = await getAccountInfo(this, { idToken });
      const user = await UserImpl._fromGetAccountInfoResponse(this, response, idToken);
      await this.directlySetCurrentUser(user);
    } catch (err) {
      console.warn("FirebaseServerApp could not login user with provided authIdToken: ", err);
      await this.directlySetCurrentUser(null);
    }
  }
  async initializeCurrentUser(popupRedirectResolver) {
    var _a;
    if (_isFirebaseServerApp(this.app)) {
      const idToken = this.app.settings.authIdToken;
      if (idToken) {
        return new Promise((resolve) => {
          setTimeout(() => this.initializeCurrentUserFromIdToken(idToken).then(resolve, resolve));
        });
      } else {
        return this.directlySetCurrentUser(null);
      }
    }
    const previouslyStoredUser = await this.assertedPersistence.getCurrentUser();
    let futureCurrentUser = previouslyStoredUser;
    let needsTocheckMiddleware = false;
    if (popupRedirectResolver && this.config.authDomain) {
      await this.getOrInitRedirectPersistenceManager();
      const redirectUserEventId = (_a = this.redirectUser) === null || _a === undefined ? undefined : _a._redirectEventId;
      const storedUserEventId = futureCurrentUser === null || futureCurrentUser === undefined ? undefined : futureCurrentUser._redirectEventId;
      const result = await this.tryRedirectSignIn(popupRedirectResolver);
      if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && (result === null || result === undefined ? undefined : result.user)) {
        futureCurrentUser = result.user;
        needsTocheckMiddleware = true;
      }
    }
    if (!futureCurrentUser) {
      return this.directlySetCurrentUser(null);
    }
    if (!futureCurrentUser._redirectEventId) {
      if (needsTocheckMiddleware) {
        try {
          await this.beforeStateQueue.runMiddleware(futureCurrentUser);
        } catch (e) {
          futureCurrentUser = previouslyStoredUser;
          this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
        }
      }
      if (futureCurrentUser) {
        return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
      } else {
        return this.directlySetCurrentUser(null);
      }
    }
    _assert(this._popupRedirectResolver, this, "argument-error");
    await this.getOrInitRedirectPersistenceManager();
    if (this.redirectUser && this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) {
      return this.directlySetCurrentUser(futureCurrentUser);
    }
    return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
  }
  async tryRedirectSignIn(redirectResolver) {
    let result = null;
    try {
      result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
    } catch (e) {
      await this._setRedirectUser(null);
    }
    return result;
  }
  async reloadAndSetCurrentUserOrClear(user) {
    try {
      await _reloadWithoutSaving(user);
    } catch (e) {
      if ((e === null || e === undefined ? undefined : e.code) !== `auth/${"network-request-failed"}`) {
        return this.directlySetCurrentUser(null);
      }
    }
    return this.directlySetCurrentUser(user);
  }
  useDeviceLanguage() {
    this.languageCode = _getUserLanguage();
  }
  async _delete() {
    this._deleted = true;
  }
  async updateCurrentUser(userExtern) {
    if (_isFirebaseServerApp(this.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
    }
    const user = userExtern ? getModularInstance(userExtern) : null;
    if (user) {
      _assert(user.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token");
    }
    return this._updateCurrentUser(user && user._clone(this));
  }
  async _updateCurrentUser(user, skipBeforeStateCallbacks = false) {
    if (this._deleted) {
      return;
    }
    if (user) {
      _assert(this.tenantId === user.tenantId, this, "tenant-id-mismatch");
    }
    if (!skipBeforeStateCallbacks) {
      await this.beforeStateQueue.runMiddleware(user);
    }
    return this.queue(async () => {
      await this.directlySetCurrentUser(user);
      this.notifyAuthListeners();
    });
  }
  async signOut() {
    if (_isFirebaseServerApp(this.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
    }
    await this.beforeStateQueue.runMiddleware(null);
    if (this.redirectPersistenceManager || this._popupRedirectResolver) {
      await this._setRedirectUser(null);
    }
    return this._updateCurrentUser(null, true);
  }
  setPersistence(persistence) {
    if (_isFirebaseServerApp(this.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
    }
    return this.queue(async () => {
      await this.assertedPersistence.setPersistence(_getInstance(persistence));
    });
  }
  _getRecaptchaConfig() {
    if (this.tenantId == null) {
      return this._agentRecaptchaConfig;
    } else {
      return this._tenantRecaptchaConfigs[this.tenantId];
    }
  }
  async validatePassword(password) {
    if (!this._getPasswordPolicyInternal()) {
      await this._updatePasswordPolicy();
    }
    const passwordPolicy = this._getPasswordPolicyInternal();
    if (passwordPolicy.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION) {
      return Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {}));
    }
    return passwordPolicy.validatePassword(password);
  }
  _getPasswordPolicyInternal() {
    if (this.tenantId === null) {
      return this._projectPasswordPolicy;
    } else {
      return this._tenantPasswordPolicies[this.tenantId];
    }
  }
  async _updatePasswordPolicy() {
    const response = await _getPasswordPolicy(this);
    const passwordPolicy = new PasswordPolicyImpl(response);
    if (this.tenantId === null) {
      this._projectPasswordPolicy = passwordPolicy;
    } else {
      this._tenantPasswordPolicies[this.tenantId] = passwordPolicy;
    }
  }
  _getPersistence() {
    return this.assertedPersistence.persistence.type;
  }
  _updateErrorMap(errorMap) {
    this._errorFactory = new ErrorFactory("auth", "Firebase", errorMap());
  }
  onAuthStateChanged(nextOrObserver, error, completed) {
    return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
  }
  beforeAuthStateChanged(callback, onAbort) {
    return this.beforeStateQueue.pushCallback(callback, onAbort);
  }
  onIdTokenChanged(nextOrObserver, error, completed) {
    return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
  }
  authStateReady() {
    return new Promise((resolve, reject) => {
      if (this.currentUser) {
        resolve();
      } else {
        const unsubscribe = this.onAuthStateChanged(() => {
          unsubscribe();
          resolve();
        }, reject);
      }
    });
  }
  async revokeAccessToken(token) {
    if (this.currentUser) {
      const idToken = await this.currentUser.getIdToken();
      const request = {
        providerId: "apple.com",
        tokenType: "ACCESS_TOKEN",
        token,
        idToken
      };
      if (this.tenantId != null) {
        request.tenantId = this.tenantId;
      }
      await revokeToken(this, request);
    }
  }
  toJSON() {
    var _a;
    return {
      apiKey: this.config.apiKey,
      authDomain: this.config.authDomain,
      appName: this.name,
      currentUser: (_a = this._currentUser) === null || _a === undefined ? undefined : _a.toJSON()
    };
  }
  async _setRedirectUser(user, popupRedirectResolver) {
    const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
    return user === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
  }
  async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
    if (!this.redirectPersistenceManager) {
      const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
      _assert(resolver, this, "argument-error");
      this.redirectPersistenceManager = await PersistenceUserManager.create(this, [_getInstance(resolver._redirectPersistence)], "redirectUser");
      this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
    }
    return this.redirectPersistenceManager;
  }
  async _redirectUserForId(id) {
    var _a, _b;
    if (this._isInitialized) {
      await this.queue(async () => {
      });
    }
    if (((_a = this._currentUser) === null || _a === undefined ? undefined : _a._redirectEventId) === id) {
      return this._currentUser;
    }
    if (((_b = this.redirectUser) === null || _b === undefined ? undefined : _b._redirectEventId) === id) {
      return this.redirectUser;
    }
    return null;
  }
  async _persistUserIfCurrent(user) {
    if (user === this.currentUser) {
      return this.queue(async () => this.directlySetCurrentUser(user));
    }
  }
  _notifyListenersIfCurrent(user) {
    if (user === this.currentUser) {
      this.notifyAuthListeners();
    }
  }
  _key() {
    return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
  }
  _startProactiveRefresh() {
    this.isProactiveRefreshEnabled = true;
    if (this.currentUser) {
      this._currentUser._startProactiveRefresh();
    }
  }
  _stopProactiveRefresh() {
    this.isProactiveRefreshEnabled = false;
    if (this.currentUser) {
      this._currentUser._stopProactiveRefresh();
    }
  }
  get _currentUser() {
    return this.currentUser;
  }
  notifyAuthListeners() {
    var _a, _b;
    if (!this._isInitialized) {
      return;
    }
    this.idTokenSubscription.next(this.currentUser);
    const currentUid = (_b = (_a = this.currentUser) === null || _a === undefined ? undefined : _a.uid) !== null && _b !== undefined ? _b : null;
    if (this.lastNotifiedUid !== currentUid) {
      this.lastNotifiedUid = currentUid;
      this.authStateSubscription.next(this.currentUser);
    }
  }
  registerStateListener(subscription, nextOrObserver, error, completed) {
    if (this._deleted) {
      return () => {
      };
    }
    const cb = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
    let isUnsubscribed = false;
    const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
    _assert(promise, this, "internal-error");
    promise.then(() => {
      if (isUnsubscribed) {
        return;
      }
      cb(this.currentUser);
    });
    if (typeof nextOrObserver === "function") {
      const unsubscribe = subscription.addObserver(nextOrObserver, error, completed);
      return () => {
        isUnsubscribed = true;
        unsubscribe();
      };
    } else {
      const unsubscribe = subscription.addObserver(nextOrObserver);
      return () => {
        isUnsubscribed = true;
        unsubscribe();
      };
    }
  }
  async directlySetCurrentUser(user) {
    if (this.currentUser && this.currentUser !== user) {
      this._currentUser._stopProactiveRefresh();
    }
    if (user && this.isProactiveRefreshEnabled) {
      user._startProactiveRefresh();
    }
    this.currentUser = user;
    if (user) {
      await this.assertedPersistence.setCurrentUser(user);
    } else {
      await this.assertedPersistence.removeCurrentUser();
    }
  }
  queue(action) {
    this.operations = this.operations.then(action, action);
    return this.operations;
  }
  get assertedPersistence() {
    _assert(this.persistenceManager, this, "internal-error");
    return this.persistenceManager;
  }
  _logFramework(framework) {
    if (!framework || this.frameworks.includes(framework)) {
      return;
    }
    this.frameworks.push(framework);
    this.frameworks.sort();
    this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
  }
  _getFrameworks() {
    return this.frameworks;
  }
  async _getAdditionalHeaders() {
    var _a;
    const headers = {
      ["X-Client-Version"]: this.clientVersion
    };
    if (this.app.options.appId) {
      headers["X-Firebase-gmpid"] = this.app.options.appId;
    }
    const heartbeatsHeader = await ((_a = this.heartbeatServiceProvider.getImmediate({
      optional: true
    })) === null || _a === undefined ? undefined : _a.getHeartbeatsHeader());
    if (heartbeatsHeader) {
      headers["X-Firebase-Client"] = heartbeatsHeader;
    }
    const appCheckToken = await this._getAppCheckToken();
    if (appCheckToken) {
      headers["X-Firebase-AppCheck"] = appCheckToken;
    }
    return headers;
  }
  async _getAppCheckToken() {
    var _a;
    const appCheckTokenResult = await ((_a = this.appCheckServiceProvider.getImmediate({ optional: true })) === null || _a === undefined ? undefined : _a.getToken());
    if (appCheckTokenResult === null || appCheckTokenResult === undefined ? undefined : appCheckTokenResult.error) {
      _logWarn(`Error while retrieving App Check token: ${appCheckTokenResult.error}`);
    }
    return appCheckTokenResult === null || appCheckTokenResult === undefined ? undefined : appCheckTokenResult.token;
  }
}

class Subscription {
  constructor(auth) {
    this.auth = auth;
    this.observer = null;
    this.addObserver = createSubscribe((observer) => this.observer = observer);
  }
  get next() {
    _assert(this.observer, this.auth, "internal-error");
    return this.observer.next.bind(this.observer);
  }
}
var externalJSProvider = {
  async loadJS() {
    throw new Error("Unable to load external scripts");
  },
  recaptchaV2Script: "",
  recaptchaEnterpriseScript: "",
  gapiScript: ""
};
var RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
var FAKE_TOKEN = "NO_RECAPTCHA";

class RecaptchaEnterpriseVerifier {
  constructor(authExtern) {
    this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
    this.auth = _castAuth(authExtern);
  }
  async verify(action = "verify", forceRefresh = false) {
    async function retrieveSiteKey(auth) {
      if (!forceRefresh) {
        if (auth.tenantId == null && auth._agentRecaptchaConfig != null) {
          return auth._agentRecaptchaConfig.siteKey;
        }
        if (auth.tenantId != null && auth._tenantRecaptchaConfigs[auth.tenantId] !== undefined) {
          return auth._tenantRecaptchaConfigs[auth.tenantId].siteKey;
        }
      }
      return new Promise(async (resolve, reject) => {
        getRecaptchaConfig(auth, {
          clientType: "CLIENT_TYPE_WEB",
          version: "RECAPTCHA_ENTERPRISE"
        }).then((response) => {
          if (response.recaptchaKey === undefined) {
            reject(new Error("recaptcha Enterprise site key undefined"));
          } else {
            const config = new RecaptchaConfig(response);
            if (auth.tenantId == null) {
              auth._agentRecaptchaConfig = config;
            } else {
              auth._tenantRecaptchaConfigs[auth.tenantId] = config;
            }
            return resolve(config.siteKey);
          }
        }).catch((error) => {
          reject(error);
        });
      });
    }
    function retrieveRecaptchaToken(siteKey, resolve, reject) {
      const grecaptcha = window.grecaptcha;
      if (isEnterprise(grecaptcha)) {
        grecaptcha.enterprise.ready(() => {
          grecaptcha.enterprise.execute(siteKey, { action }).then((token) => {
            resolve(token);
          }).catch(() => {
            resolve(FAKE_TOKEN);
          });
        });
      } else {
        reject(Error("No reCAPTCHA enterprise script loaded."));
      }
    }
    return new Promise((resolve, reject) => {
      retrieveSiteKey(this.auth).then((siteKey) => {
        if (!forceRefresh && isEnterprise(window.grecaptcha)) {
          retrieveRecaptchaToken(siteKey, resolve, reject);
        } else {
          if (typeof window === "undefined") {
            reject(new Error("RecaptchaVerifier is only supported in browser"));
            return;
          }
          let url = _recaptchaEnterpriseScriptUrl();
          if (url.length !== 0) {
            url += siteKey;
          }
          _loadJS(url).then(() => {
            retrieveRecaptchaToken(siteKey, resolve, reject);
          }).catch((error) => {
            reject(error);
          });
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
}

class AuthCredential {
  constructor(providerId, signInMethod) {
    this.providerId = providerId;
    this.signInMethod = signInMethod;
  }
  toJSON() {
    return debugFail("not implemented");
  }
  _getIdTokenResponse(_auth) {
    return debugFail("not implemented");
  }
  _linkToIdToken(_auth, _idToken) {
    return debugFail("not implemented");
  }
  _getReauthenticationResolver(_auth) {
    return debugFail("not implemented");
  }
}

class EmailAuthCredential extends AuthCredential {
  constructor(_email, _password, signInMethod, _tenantId = null) {
    super("password", signInMethod);
    this._email = _email;
    this._password = _password;
    this._tenantId = _tenantId;
  }
  static _fromEmailAndPassword(email, password) {
    return new EmailAuthCredential(email, password, "password");
  }
  static _fromEmailAndCode(email, oobCode, tenantId = null) {
    return new EmailAuthCredential(email, oobCode, "emailLink", tenantId);
  }
  toJSON() {
    return {
      email: this._email,
      password: this._password,
      signInMethod: this.signInMethod,
      tenantId: this._tenantId
    };
  }
  static fromJSON(json) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    if ((obj === null || obj === undefined ? undefined : obj.email) && (obj === null || obj === undefined ? undefined : obj.password)) {
      if (obj.signInMethod === "password") {
        return this._fromEmailAndPassword(obj.email, obj.password);
      } else if (obj.signInMethod === "emailLink") {
        return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
      }
    }
    return null;
  }
  async _getIdTokenResponse(auth) {
    switch (this.signInMethod) {
      case "password":
        const request = {
          returnSecureToken: true,
          email: this._email,
          password: this._password,
          clientType: "CLIENT_TYPE_WEB"
        };
        return handleRecaptchaFlow(auth, request, "signInWithPassword", signInWithPassword);
      case "emailLink":
        return signInWithEmailLink$1(auth, {
          email: this._email,
          oobCode: this._password
        });
      default:
        _fail(auth, "internal-error");
    }
  }
  async _linkToIdToken(auth, idToken) {
    switch (this.signInMethod) {
      case "password":
        const request = {
          idToken,
          returnSecureToken: true,
          email: this._email,
          password: this._password,
          clientType: "CLIENT_TYPE_WEB"
        };
        return handleRecaptchaFlow(auth, request, "signUpPassword", linkEmailPassword);
      case "emailLink":
        return signInWithEmailLinkForLinking(auth, {
          idToken,
          email: this._email,
          oobCode: this._password
        });
      default:
        _fail(auth, "internal-error");
    }
  }
  _getReauthenticationResolver(auth) {
    return this._getIdTokenResponse(auth);
  }
}
var IDP_REQUEST_URI$1 = "http://localhost";

class OAuthCredential extends AuthCredential {
  constructor() {
    super(...arguments);
    this.pendingToken = null;
  }
  static _fromParams(params) {
    const cred = new OAuthCredential(params.providerId, params.signInMethod);
    if (params.idToken || params.accessToken) {
      if (params.idToken) {
        cred.idToken = params.idToken;
      }
      if (params.accessToken) {
        cred.accessToken = params.accessToken;
      }
      if (params.nonce && !params.pendingToken) {
        cred.nonce = params.nonce;
      }
      if (params.pendingToken) {
        cred.pendingToken = params.pendingToken;
      }
    } else if (params.oauthToken && params.oauthTokenSecret) {
      cred.accessToken = params.oauthToken;
      cred.secret = params.oauthTokenSecret;
    } else {
      _fail("argument-error");
    }
    return cred;
  }
  toJSON() {
    return {
      idToken: this.idToken,
      accessToken: this.accessToken,
      secret: this.secret,
      nonce: this.nonce,
      pendingToken: this.pendingToken,
      providerId: this.providerId,
      signInMethod: this.signInMethod
    };
  }
  static fromJSON(json) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    const { providerId, signInMethod } = obj, rest = __rest(obj, ["providerId", "signInMethod"]);
    if (!providerId || !signInMethod) {
      return null;
    }
    const cred = new OAuthCredential(providerId, signInMethod);
    cred.idToken = rest.idToken || undefined;
    cred.accessToken = rest.accessToken || undefined;
    cred.secret = rest.secret;
    cred.nonce = rest.nonce;
    cred.pendingToken = rest.pendingToken || null;
    return cred;
  }
  _getIdTokenResponse(auth) {
    const request = this.buildRequest();
    return signInWithIdp(auth, request);
  }
  _linkToIdToken(auth, idToken) {
    const request = this.buildRequest();
    request.idToken = idToken;
    return signInWithIdp(auth, request);
  }
  _getReauthenticationResolver(auth) {
    const request = this.buildRequest();
    request.autoCreate = false;
    return signInWithIdp(auth, request);
  }
  buildRequest() {
    const request = {
      requestUri: IDP_REQUEST_URI$1,
      returnSecureToken: true
    };
    if (this.pendingToken) {
      request.pendingToken = this.pendingToken;
    } else {
      const postBody = {};
      if (this.idToken) {
        postBody["id_token"] = this.idToken;
      }
      if (this.accessToken) {
        postBody["access_token"] = this.accessToken;
      }
      if (this.secret) {
        postBody["oauth_token_secret"] = this.secret;
      }
      postBody["providerId"] = this.providerId;
      if (this.nonce && !this.pendingToken) {
        postBody["nonce"] = this.nonce;
      }
      request.postBody = querystring(postBody);
    }
    return request;
  }
}
var VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_ = {
  ["USER_NOT_FOUND"]: "user-not-found"
};

class PhoneAuthCredential extends AuthCredential {
  constructor(params) {
    super("phone", "phone");
    this.params = params;
  }
  static _fromVerification(verificationId, verificationCode) {
    return new PhoneAuthCredential({ verificationId, verificationCode });
  }
  static _fromTokenResponse(phoneNumber, temporaryProof) {
    return new PhoneAuthCredential({ phoneNumber, temporaryProof });
  }
  _getIdTokenResponse(auth) {
    return signInWithPhoneNumber$1(auth, this._makeVerificationRequest());
  }
  _linkToIdToken(auth, idToken) {
    return linkWithPhoneNumber$1(auth, Object.assign({ idToken }, this._makeVerificationRequest()));
  }
  _getReauthenticationResolver(auth) {
    return verifyPhoneNumberForExisting(auth, this._makeVerificationRequest());
  }
  _makeVerificationRequest() {
    const { temporaryProof, phoneNumber, verificationId, verificationCode } = this.params;
    if (temporaryProof && phoneNumber) {
      return { temporaryProof, phoneNumber };
    }
    return {
      sessionInfo: verificationId,
      code: verificationCode
    };
  }
  toJSON() {
    const obj = {
      providerId: this.providerId
    };
    if (this.params.phoneNumber) {
      obj.phoneNumber = this.params.phoneNumber;
    }
    if (this.params.temporaryProof) {
      obj.temporaryProof = this.params.temporaryProof;
    }
    if (this.params.verificationCode) {
      obj.verificationCode = this.params.verificationCode;
    }
    if (this.params.verificationId) {
      obj.verificationId = this.params.verificationId;
    }
    return obj;
  }
  static fromJSON(json) {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    const { verificationId, verificationCode, phoneNumber, temporaryProof } = json;
    if (!verificationCode && !verificationId && !phoneNumber && !temporaryProof) {
      return null;
    }
    return new PhoneAuthCredential({
      verificationId,
      verificationCode,
      phoneNumber,
      temporaryProof
    });
  }
}

class ActionCodeURL {
  constructor(actionLink) {
    var _a, _b, _c, _d, _e, _f;
    const searchParams = querystringDecode(extractQuerystring(actionLink));
    const apiKey = (_a = searchParams["apiKey"]) !== null && _a !== undefined ? _a : null;
    const code = (_b = searchParams["oobCode"]) !== null && _b !== undefined ? _b : null;
    const operation = parseMode((_c = searchParams["mode"]) !== null && _c !== undefined ? _c : null);
    _assert(apiKey && code && operation, "argument-error");
    this.apiKey = apiKey;
    this.operation = operation;
    this.code = code;
    this.continueUrl = (_d = searchParams["continueUrl"]) !== null && _d !== undefined ? _d : null;
    this.languageCode = (_e = searchParams["languageCode"]) !== null && _e !== undefined ? _e : null;
    this.tenantId = (_f = searchParams["tenantId"]) !== null && _f !== undefined ? _f : null;
  }
  static parseLink(link) {
    const actionLink = parseDeepLink(link);
    try {
      return new ActionCodeURL(actionLink);
    } catch (_a) {
      return null;
    }
  }
}

class EmailAuthProvider {
  constructor() {
    this.providerId = EmailAuthProvider.PROVIDER_ID;
  }
  static credential(email, password) {
    return EmailAuthCredential._fromEmailAndPassword(email, password);
  }
  static credentialWithLink(email, emailLink) {
    const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
    _assert(actionCodeUrl, "argument-error");
    return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
  }
}
EmailAuthProvider.PROVIDER_ID = "password";
EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";

class FederatedAuthProvider {
  constructor(providerId) {
    this.providerId = providerId;
    this.defaultLanguageCode = null;
    this.customParameters = {};
  }
  setDefaultLanguage(languageCode) {
    this.defaultLanguageCode = languageCode;
  }
  setCustomParameters(customOAuthParameters) {
    this.customParameters = customOAuthParameters;
    return this;
  }
  getCustomParameters() {
    return this.customParameters;
  }
}

class BaseOAuthProvider extends FederatedAuthProvider {
  constructor() {
    super(...arguments);
    this.scopes = [];
  }
  addScope(scope) {
    if (!this.scopes.includes(scope)) {
      this.scopes.push(scope);
    }
    return this;
  }
  getScopes() {
    return [...this.scopes];
  }
}
class FacebookAuthProvider extends BaseOAuthProvider {
  constructor() {
    super("facebook.com");
  }
  static credential(accessToken) {
    return OAuthCredential._fromParams({
      providerId: FacebookAuthProvider.PROVIDER_ID,
      signInMethod: FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
      accessToken
    });
  }
  static credentialFromResult(userCredential) {
    return FacebookAuthProvider.credentialFromTaggedObject(userCredential);
  }
  static credentialFromError(error) {
    return FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
      return null;
    }
    if (!tokenResponse.oauthAccessToken) {
      return null;
    }
    try {
      return FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
}
FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
FacebookAuthProvider.PROVIDER_ID = "facebook.com";

class GoogleAuthProvider extends BaseOAuthProvider {
  constructor() {
    super("google.com");
    this.addScope("profile");
  }
  static credential(idToken, accessToken) {
    return OAuthCredential._fromParams({
      providerId: GoogleAuthProvider.PROVIDER_ID,
      signInMethod: GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
      idToken,
      accessToken
    });
  }
  static credentialFromResult(userCredential) {
    return GoogleAuthProvider.credentialFromTaggedObject(userCredential);
  }
  static credentialFromError(error) {
    return GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse) {
      return null;
    }
    const { oauthIdToken, oauthAccessToken } = tokenResponse;
    if (!oauthIdToken && !oauthAccessToken) {
      return null;
    }
    try {
      return GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
}
GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
GoogleAuthProvider.PROVIDER_ID = "google.com";

class GithubAuthProvider extends BaseOAuthProvider {
  constructor() {
    super("github.com");
  }
  static credential(accessToken) {
    return OAuthCredential._fromParams({
      providerId: GithubAuthProvider.PROVIDER_ID,
      signInMethod: GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
      accessToken
    });
  }
  static credentialFromResult(userCredential) {
    return GithubAuthProvider.credentialFromTaggedObject(userCredential);
  }
  static credentialFromError(error) {
    return GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
      return null;
    }
    if (!tokenResponse.oauthAccessToken) {
      return null;
    }
    try {
      return GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
}
GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
GithubAuthProvider.PROVIDER_ID = "github.com";
class TwitterAuthProvider extends BaseOAuthProvider {
  constructor() {
    super("twitter.com");
  }
  static credential(token, secret) {
    return OAuthCredential._fromParams({
      providerId: TwitterAuthProvider.PROVIDER_ID,
      signInMethod: TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
      oauthToken: token,
      oauthTokenSecret: secret
    });
  }
  static credentialFromResult(userCredential) {
    return TwitterAuthProvider.credentialFromTaggedObject(userCredential);
  }
  static credentialFromError(error) {
    return TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse) {
      return null;
    }
    const { oauthAccessToken, oauthTokenSecret } = tokenResponse;
    if (!oauthAccessToken || !oauthTokenSecret) {
      return null;
    }
    try {
      return TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
    } catch (_a) {
      return null;
    }
  }
}
TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
TwitterAuthProvider.PROVIDER_ID = "twitter.com";

class UserCredentialImpl {
  constructor(params) {
    this.user = params.user;
    this.providerId = params.providerId;
    this._tokenResponse = params._tokenResponse;
    this.operationType = params.operationType;
  }
  static async _fromIdTokenResponse(auth, operationType, idTokenResponse, isAnonymous = false) {
    const user = await UserImpl._fromIdTokenResponse(auth, idTokenResponse, isAnonymous);
    const providerId = providerIdForResponse(idTokenResponse);
    const userCred = new UserCredentialImpl({
      user,
      providerId,
      _tokenResponse: idTokenResponse,
      operationType
    });
    return userCred;
  }
  static async _forOperation(user, operationType, response) {
    await user._updateTokensIfNecessary(response, true);
    const providerId = providerIdForResponse(response);
    return new UserCredentialImpl({
      user,
      providerId,
      _tokenResponse: response,
      operationType
    });
  }
}

class MultiFactorError extends FirebaseError {
  constructor(auth, error, operationType, user) {
    var _a;
    super(error.code, error.message);
    this.operationType = operationType;
    this.user = user;
    Object.setPrototypeOf(this, MultiFactorError.prototype);
    this.customData = {
      appName: auth.name,
      tenantId: (_a = auth.tenantId) !== null && _a !== undefined ? _a : undefined,
      _serverResponse: error.customData._serverResponse,
      operationType
    };
  }
  static _fromErrorAndOperation(auth, error, operationType, user) {
    return new MultiFactorError(auth, error, operationType, user);
  }
}
var multiFactorUserCache = new WeakMap;
var STORAGE_AVAILABLE_KEY = "__sak";

class BrowserPersistenceClass {
  constructor(storageRetriever, type) {
    this.storageRetriever = storageRetriever;
    this.type = type;
  }
  _isAvailable() {
    try {
      if (!this.storage) {
        return Promise.resolve(false);
      }
      this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
      this.storage.removeItem(STORAGE_AVAILABLE_KEY);
      return Promise.resolve(true);
    } catch (_a) {
      return Promise.resolve(false);
    }
  }
  _set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }
  _get(key) {
    const json = this.storage.getItem(key);
    return Promise.resolve(json ? JSON.parse(json) : null);
  }
  _remove(key) {
    this.storage.removeItem(key);
    return Promise.resolve();
  }
  get storage() {
    return this.storageRetriever();
  }
}
var _POLLING_INTERVAL_MS$1 = 1000;
var IE10_LOCAL_STORAGE_SYNC_DELAY = 10;

class BrowserLocalPersistence extends BrowserPersistenceClass {
  constructor() {
    super(() => window.localStorage, "LOCAL");
    this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
    this.listeners = {};
    this.localCache = {};
    this.pollTimer = null;
    this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && _isIframe();
    this.fallbackToPolling = _isMobileBrowser();
    this._shouldAllowMigration = true;
  }
  forAllChangedKeys(cb) {
    for (const key of Object.keys(this.listeners)) {
      const newValue = this.storage.getItem(key);
      const oldValue = this.localCache[key];
      if (newValue !== oldValue) {
        cb(key, oldValue, newValue);
      }
    }
  }
  onStorageEvent(event, poll = false) {
    if (!event.key) {
      this.forAllChangedKeys((key2, _oldValue, newValue) => {
        this.notifyListeners(key2, newValue);
      });
      return;
    }
    const key = event.key;
    if (poll) {
      this.detachListener();
    } else {
      this.stopPolling();
    }
    if (this.safariLocalStorageNotSynced) {
      const storedValue2 = this.storage.getItem(key);
      if (event.newValue !== storedValue2) {
        if (event.newValue !== null) {
          this.storage.setItem(key, event.newValue);
        } else {
          this.storage.removeItem(key);
        }
      } else if (this.localCache[key] === event.newValue && !poll) {
        return;
      }
    }
    const triggerListeners = () => {
      const storedValue2 = this.storage.getItem(key);
      if (!poll && this.localCache[key] === storedValue2) {
        return;
      }
      this.notifyListeners(key, storedValue2);
    };
    const storedValue = this.storage.getItem(key);
    if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) {
      setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
    } else {
      triggerListeners();
    }
  }
  notifyListeners(key, value) {
    this.localCache[key] = value;
    const listeners = this.listeners[key];
    if (listeners) {
      for (const listener of Array.from(listeners)) {
        listener(value ? JSON.parse(value) : value);
      }
    }
  }
  startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(() => {
      this.forAllChangedKeys((key, oldValue, newValue) => {
        this.onStorageEvent(new StorageEvent("storage", {
          key,
          oldValue,
          newValue
        }), true);
      });
    }, _POLLING_INTERVAL_MS$1);
  }
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
  attachListener() {
    window.addEventListener("storage", this.boundEventHandler);
  }
  detachListener() {
    window.removeEventListener("storage", this.boundEventHandler);
  }
  _addListener(key, listener) {
    if (Object.keys(this.listeners).length === 0) {
      if (this.fallbackToPolling) {
        this.startPolling();
      } else {
        this.attachListener();
      }
    }
    if (!this.listeners[key]) {
      this.listeners[key] = new Set;
      this.localCache[key] = this.storage.getItem(key);
    }
    this.listeners[key].add(listener);
  }
  _removeListener(key, listener) {
    if (this.listeners[key]) {
      this.listeners[key].delete(listener);
      if (this.listeners[key].size === 0) {
        delete this.listeners[key];
      }
    }
    if (Object.keys(this.listeners).length === 0) {
      this.detachListener();
      this.stopPolling();
    }
  }
  async _set(key, value) {
    await super._set(key, value);
    this.localCache[key] = JSON.stringify(value);
  }
  async _get(key) {
    const value = await super._get(key);
    this.localCache[key] = JSON.stringify(value);
    return value;
  }
  async _remove(key) {
    await super._remove(key);
    delete this.localCache[key];
  }
}
BrowserLocalPersistence.type = "LOCAL";
var browserLocalPersistence = BrowserLocalPersistence;

class BrowserSessionPersistence extends BrowserPersistenceClass {
  constructor() {
    super(() => window.sessionStorage, "SESSION");
  }
  _addListener(_key, _listener) {
    return;
  }
  _removeListener(_key, _listener) {
    return;
  }
}
BrowserSessionPersistence.type = "SESSION";
var browserSessionPersistence = BrowserSessionPersistence;

class Receiver {
  constructor(eventTarget) {
    this.eventTarget = eventTarget;
    this.handlersMap = {};
    this.boundEventHandler = this.handleEvent.bind(this);
  }
  static _getInstance(eventTarget) {
    const existingInstance = this.receivers.find((receiver) => receiver.isListeningto(eventTarget));
    if (existingInstance) {
      return existingInstance;
    }
    const newInstance = new Receiver(eventTarget);
    this.receivers.push(newInstance);
    return newInstance;
  }
  isListeningto(eventTarget) {
    return this.eventTarget === eventTarget;
  }
  async handleEvent(event) {
    const messageEvent = event;
    const { eventId, eventType, data } = messageEvent.data;
    const handlers = this.handlersMap[eventType];
    if (!(handlers === null || handlers === undefined ? undefined : handlers.size)) {
      return;
    }
    messageEvent.ports[0].postMessage({
      status: "ack",
      eventId,
      eventType
    });
    const promises = Array.from(handlers).map(async (handler) => handler(messageEvent.origin, data));
    const response = await _allSettled(promises);
    messageEvent.ports[0].postMessage({
      status: "done",
      eventId,
      eventType,
      response
    });
  }
  _subscribe(eventType, eventHandler) {
    if (Object.keys(this.handlersMap).length === 0) {
      this.eventTarget.addEventListener("message", this.boundEventHandler);
    }
    if (!this.handlersMap[eventType]) {
      this.handlersMap[eventType] = new Set;
    }
    this.handlersMap[eventType].add(eventHandler);
  }
  _unsubscribe(eventType, eventHandler) {
    if (this.handlersMap[eventType] && eventHandler) {
      this.handlersMap[eventType].delete(eventHandler);
    }
    if (!eventHandler || this.handlersMap[eventType].size === 0) {
      delete this.handlersMap[eventType];
    }
    if (Object.keys(this.handlersMap).length === 0) {
      this.eventTarget.removeEventListener("message", this.boundEventHandler);
    }
  }
}
Receiver.receivers = [];

class Sender {
  constructor(target) {
    this.target = target;
    this.handlers = new Set;
  }
  removeMessageHandler(handler) {
    if (handler.messageChannel) {
      handler.messageChannel.port1.removeEventListener("message", handler.onMessage);
      handler.messageChannel.port1.close();
    }
    this.handlers.delete(handler);
  }
  async _send(eventType, data, timeout = 50) {
    const messageChannel = typeof MessageChannel !== "undefined" ? new MessageChannel : null;
    if (!messageChannel) {
      throw new Error("connection_unavailable");
    }
    let completionTimer;
    let handler;
    return new Promise((resolve, reject) => {
      const eventId = _generateEventId("", 20);
      messageChannel.port1.start();
      const ackTimer = setTimeout(() => {
        reject(new Error("unsupported_event"));
      }, timeout);
      handler = {
        messageChannel,
        onMessage(event) {
          const messageEvent = event;
          if (messageEvent.data.eventId !== eventId) {
            return;
          }
          switch (messageEvent.data.status) {
            case "ack":
              clearTimeout(ackTimer);
              completionTimer = setTimeout(() => {
                reject(new Error("timeout"));
              }, 3000);
              break;
            case "done":
              clearTimeout(completionTimer);
              resolve(messageEvent.data.response);
              break;
            default:
              clearTimeout(ackTimer);
              clearTimeout(completionTimer);
              reject(new Error("invalid_response"));
              break;
          }
        }
      };
      this.handlers.add(handler);
      messageChannel.port1.addEventListener("message", handler.onMessage);
      this.target.postMessage({
        eventType,
        eventId,
        data
      }, [messageChannel.port2]);
    }).finally(() => {
      if (handler) {
        this.removeMessageHandler(handler);
      }
    });
  }
}
var DB_NAME2 = "firebaseLocalStorageDb";
var DB_VERSION2 = 1;
var DB_OBJECTSTORE_NAME = "firebaseLocalStorage";
var DB_DATA_KEYPATH = "fbase_key";

class DBPromise {
  constructor(request) {
    this.request = request;
  }
  toPromise() {
    return new Promise((resolve, reject) => {
      this.request.addEventListener("success", () => {
        resolve(this.request.result);
      });
      this.request.addEventListener("error", () => {
        reject(this.request.error);
      });
    });
  }
}
var _POLLING_INTERVAL_MS = 800;
var _TRANSACTION_RETRY_COUNT = 3;

class IndexedDBLocalPersistence {
  constructor() {
    this.type = "LOCAL";
    this._shouldAllowMigration = true;
    this.listeners = {};
    this.localCache = {};
    this.pollTimer = null;
    this.pendingWrites = 0;
    this.receiver = null;
    this.sender = null;
    this.serviceWorkerReceiverAvailable = false;
    this.activeServiceWorker = null;
    this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {
    }, () => {
    });
  }
  async _openDb() {
    if (this.db) {
      return this.db;
    }
    this.db = await _openDatabase();
    return this.db;
  }
  async _withRetries(op) {
    let numAttempts = 0;
    while (true) {
      try {
        const db = await this._openDb();
        return await op(db);
      } catch (e) {
        if (numAttempts++ > _TRANSACTION_RETRY_COUNT) {
          throw e;
        }
        if (this.db) {
          this.db.close();
          this.db = undefined;
        }
      }
    }
  }
  async initializeServiceWorkerMessaging() {
    return _isWorker() ? this.initializeReceiver() : this.initializeSender();
  }
  async initializeReceiver() {
    this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
    this.receiver._subscribe("keyChanged", async (_origin, data) => {
      const keys = await this._poll();
      return {
        keyProcessed: keys.includes(data.key)
      };
    });
    this.receiver._subscribe("ping", async (_origin, _data) => {
      return ["keyChanged"];
    });
  }
  async initializeSender() {
    var _a, _b;
    this.activeServiceWorker = await _getActiveServiceWorker();
    if (!this.activeServiceWorker) {
      return;
    }
    this.sender = new Sender(this.activeServiceWorker);
    const results = await this.sender._send("ping", {}, 800);
    if (!results) {
      return;
    }
    if (((_a = results[0]) === null || _a === undefined ? undefined : _a.fulfilled) && ((_b = results[0]) === null || _b === undefined ? undefined : _b.value.includes("keyChanged"))) {
      this.serviceWorkerReceiverAvailable = true;
    }
  }
  async notifyServiceWorker(key) {
    if (!this.sender || !this.activeServiceWorker || _getServiceWorkerController() !== this.activeServiceWorker) {
      return;
    }
    try {
      await this.sender._send("keyChanged", { key }, this.serviceWorkerReceiverAvailable ? 800 : 50);
    } catch (_a) {
    }
  }
  async _isAvailable() {
    try {
      if (!indexedDB) {
        return false;
      }
      const db = await _openDatabase();
      await _putObject(db, STORAGE_AVAILABLE_KEY, "1");
      await _deleteObject(db, STORAGE_AVAILABLE_KEY);
      return true;
    } catch (_a) {
    }
    return false;
  }
  async _withPendingWrite(write) {
    this.pendingWrites++;
    try {
      await write();
    } finally {
      this.pendingWrites--;
    }
  }
  async _set(key, value) {
    return this._withPendingWrite(async () => {
      await this._withRetries((db) => _putObject(db, key, value));
      this.localCache[key] = value;
      return this.notifyServiceWorker(key);
    });
  }
  async _get(key) {
    const obj = await this._withRetries((db) => getObject(db, key));
    this.localCache[key] = obj;
    return obj;
  }
  async _remove(key) {
    return this._withPendingWrite(async () => {
      await this._withRetries((db) => _deleteObject(db, key));
      delete this.localCache[key];
      return this.notifyServiceWorker(key);
    });
  }
  async _poll() {
    const result = await this._withRetries((db) => {
      const getAllRequest = getObjectStore(db, false).getAll();
      return new DBPromise(getAllRequest).toPromise();
    });
    if (!result) {
      return [];
    }
    if (this.pendingWrites !== 0) {
      return [];
    }
    const keys = [];
    const keysInResult = new Set;
    if (result.length !== 0) {
      for (const { fbase_key: key, value } of result) {
        keysInResult.add(key);
        if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
          this.notifyListeners(key, value);
          keys.push(key);
        }
      }
    }
    for (const localKey of Object.keys(this.localCache)) {
      if (this.localCache[localKey] && !keysInResult.has(localKey)) {
        this.notifyListeners(localKey, null);
        keys.push(localKey);
      }
    }
    return keys;
  }
  notifyListeners(key, newValue) {
    this.localCache[key] = newValue;
    const listeners = this.listeners[key];
    if (listeners) {
      for (const listener of Array.from(listeners)) {
        listener(newValue);
      }
    }
  }
  startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(async () => this._poll(), _POLLING_INTERVAL_MS);
  }
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
  _addListener(key, listener) {
    if (Object.keys(this.listeners).length === 0) {
      this.startPolling();
    }
    if (!this.listeners[key]) {
      this.listeners[key] = new Set;
      this._get(key);
    }
    this.listeners[key].add(listener);
  }
  _removeListener(key, listener) {
    if (this.listeners[key]) {
      this.listeners[key].delete(listener);
      if (this.listeners[key].size === 0) {
        delete this.listeners[key];
      }
    }
    if (Object.keys(this.listeners).length === 0) {
      this.stopPolling();
    }
  }
}
IndexedDBLocalPersistence.type = "LOCAL";
var indexedDBLocalPersistence = IndexedDBLocalPersistence;
var _JSLOAD_CALLBACK = _generateCallbackName("rcb");
var NETWORK_TIMEOUT_DELAY = new Delay(30000, 60000);
var RECAPTCHA_VERIFIER_TYPE = "recaptcha";
class PhoneAuthProvider {
  constructor(auth) {
    this.providerId = PhoneAuthProvider.PROVIDER_ID;
    this.auth = _castAuth(auth);
  }
  verifyPhoneNumber(phoneOptions, applicationVerifier) {
    return _verifyPhoneNumber(this.auth, phoneOptions, getModularInstance(applicationVerifier));
  }
  static credential(verificationId, verificationCode) {
    return PhoneAuthCredential._fromVerification(verificationId, verificationCode);
  }
  static credentialFromResult(userCredential) {
    const credential = userCredential;
    return PhoneAuthProvider.credentialFromTaggedObject(credential);
  }
  static credentialFromError(error) {
    return PhoneAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse) {
      return null;
    }
    const { phoneNumber, temporaryProof } = tokenResponse;
    if (phoneNumber && temporaryProof) {
      return PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
    }
    return null;
  }
}
PhoneAuthProvider.PROVIDER_ID = "phone";
PhoneAuthProvider.PHONE_SIGN_IN_METHOD = "phone";

class IdpCredential extends AuthCredential {
  constructor(params) {
    super("custom", "custom");
    this.params = params;
  }
  _getIdTokenResponse(auth) {
    return signInWithIdp(auth, this._buildIdpRequest());
  }
  _linkToIdToken(auth, idToken) {
    return signInWithIdp(auth, this._buildIdpRequest(idToken));
  }
  _getReauthenticationResolver(auth) {
    return signInWithIdp(auth, this._buildIdpRequest());
  }
  _buildIdpRequest(idToken) {
    const request = {
      requestUri: this.params.requestUri,
      sessionId: this.params.sessionId,
      postBody: this.params.postBody,
      tenantId: this.params.tenantId,
      pendingToken: this.params.pendingToken,
      returnSecureToken: true,
      returnIdpCredential: true
    };
    if (idToken) {
      request.idToken = idToken;
    }
    return request;
  }
}

class AbstractPopupRedirectOperation {
  constructor(auth, filter, resolver, user, bypassAuthState = false) {
    this.auth = auth;
    this.resolver = resolver;
    this.user = user;
    this.bypassAuthState = bypassAuthState;
    this.pendingPromise = null;
    this.eventManager = null;
    this.filter = Array.isArray(filter) ? filter : [filter];
  }
  execute() {
    return new Promise(async (resolve, reject) => {
      this.pendingPromise = { resolve, reject };
      try {
        this.eventManager = await this.resolver._initialize(this.auth);
        await this.onExecution();
        this.eventManager.registerConsumer(this);
      } catch (e) {
        this.reject(e);
      }
    });
  }
  async onAuthEvent(event) {
    const { urlResponse, sessionId, postBody, tenantId, error, type } = event;
    if (error) {
      this.reject(error);
      return;
    }
    const params = {
      auth: this.auth,
      requestUri: urlResponse,
      sessionId,
      tenantId: tenantId || undefined,
      postBody: postBody || undefined,
      user: this.user,
      bypassAuthState: this.bypassAuthState
    };
    try {
      this.resolve(await this.getIdpTask(type)(params));
    } catch (e) {
      this.reject(e);
    }
  }
  onError(error) {
    this.reject(error);
  }
  getIdpTask(type) {
    switch (type) {
      case "signInViaPopup":
      case "signInViaRedirect":
        return _signIn;
      case "linkViaPopup":
      case "linkViaRedirect":
        return _link;
      case "reauthViaPopup":
      case "reauthViaRedirect":
        return _reauth;
      default:
        _fail(this.auth, "internal-error");
    }
  }
  resolve(cred) {
    debugAssert(this.pendingPromise, "Pending promise was never set");
    this.pendingPromise.resolve(cred);
    this.unregisterAndCleanUp();
  }
  reject(error) {
    debugAssert(this.pendingPromise, "Pending promise was never set");
    this.pendingPromise.reject(error);
    this.unregisterAndCleanUp();
  }
  unregisterAndCleanUp() {
    if (this.eventManager) {
      this.eventManager.unregisterConsumer(this);
    }
    this.pendingPromise = null;
    this.cleanUp();
  }
}
var _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2000, 1e4);

class PopupOperation extends AbstractPopupRedirectOperation {
  constructor(auth, filter, provider, resolver, user) {
    super(auth, filter, resolver, user);
    this.provider = provider;
    this.authWindow = null;
    this.pollId = null;
    if (PopupOperation.currentPopupAction) {
      PopupOperation.currentPopupAction.cancel();
    }
    PopupOperation.currentPopupAction = this;
  }
  async executeNotNull() {
    const result = await this.execute();
    _assert(result, this.auth, "internal-error");
    return result;
  }
  async onExecution() {
    debugAssert(this.filter.length === 1, "Popup operations only handle one event");
    const eventId = _generateEventId();
    this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], eventId);
    this.authWindow.associatedEvent = eventId;
    this.resolver._originValidation(this.auth).catch((e) => {
      this.reject(e);
    });
    this.resolver._isIframeWebStorageSupported(this.auth, (isSupported) => {
      if (!isSupported) {
        this.reject(_createError(this.auth, "web-storage-unsupported"));
      }
    });
    this.pollUserCancellation();
  }
  get eventId() {
    var _a;
    return ((_a = this.authWindow) === null || _a === undefined ? undefined : _a.associatedEvent) || null;
  }
  cancel() {
    this.reject(_createError(this.auth, "cancelled-popup-request"));
  }
  cleanUp() {
    if (this.authWindow) {
      this.authWindow.close();
    }
    if (this.pollId) {
      window.clearTimeout(this.pollId);
    }
    this.authWindow = null;
    this.pollId = null;
    PopupOperation.currentPopupAction = null;
  }
  pollUserCancellation() {
    const poll = () => {
      var _a, _b;
      if ((_b = (_a = this.authWindow) === null || _a === undefined ? undefined : _a.window) === null || _b === undefined ? undefined : _b.closed) {
        this.pollId = window.setTimeout(() => {
          this.pollId = null;
          this.reject(_createError(this.auth, "popup-closed-by-user"));
        }, 8000);
        return;
      }
      this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
    };
    poll();
  }
}
PopupOperation.currentPopupAction = null;
var PENDING_REDIRECT_KEY = "pendingRedirect";
var redirectOutcomeMap = new Map;

class RedirectAction extends AbstractPopupRedirectOperation {
  constructor(auth, resolver, bypassAuthState = false) {
    super(auth, [
      "signInViaRedirect",
      "linkViaRedirect",
      "reauthViaRedirect",
      "unknown"
    ], resolver, undefined, bypassAuthState);
    this.eventId = null;
  }
  async execute() {
    let readyOutcome = redirectOutcomeMap.get(this.auth._key());
    if (!readyOutcome) {
      try {
        const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
        const result = hasPendingRedirect ? await super.execute() : null;
        readyOutcome = () => Promise.resolve(result);
      } catch (e) {
        readyOutcome = () => Promise.reject(e);
      }
      redirectOutcomeMap.set(this.auth._key(), readyOutcome);
    }
    if (!this.bypassAuthState) {
      redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
    }
    return readyOutcome();
  }
  async onAuthEvent(event) {
    if (event.type === "signInViaRedirect") {
      return super.onAuthEvent(event);
    } else if (event.type === "unknown") {
      this.resolve(null);
      return;
    }
    if (event.eventId) {
      const user = await this.auth._redirectUserForId(event.eventId);
      if (user) {
        this.user = user;
        return super.onAuthEvent(event);
      } else {
        this.resolve(null);
      }
    }
  }
  async onExecution() {
  }
  cleanUp() {
  }
}
var EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1000;

class AuthEventManager {
  constructor(auth) {
    this.auth = auth;
    this.cachedEventUids = new Set;
    this.consumers = new Set;
    this.queuedRedirectEvent = null;
    this.hasHandledPotentialRedirect = false;
    this.lastProcessedEventTime = Date.now();
  }
  registerConsumer(authEventConsumer) {
    this.consumers.add(authEventConsumer);
    if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
      this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
      this.saveEventToCache(this.queuedRedirectEvent);
      this.queuedRedirectEvent = null;
    }
  }
  unregisterConsumer(authEventConsumer) {
    this.consumers.delete(authEventConsumer);
  }
  onEvent(event) {
    if (this.hasEventBeenHandled(event)) {
      return false;
    }
    let handled = false;
    this.consumers.forEach((consumer) => {
      if (this.isEventForConsumer(event, consumer)) {
        handled = true;
        this.sendToConsumer(event, consumer);
        this.saveEventToCache(event);
      }
    });
    if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
      return handled;
    }
    this.hasHandledPotentialRedirect = true;
    if (!handled) {
      this.queuedRedirectEvent = event;
      handled = true;
    }
    return handled;
  }
  sendToConsumer(event, consumer) {
    var _a;
    if (event.error && !isNullRedirectEvent(event)) {
      const code = ((_a = event.error.code) === null || _a === undefined ? undefined : _a.split("auth/")[1]) || "internal-error";
      consumer.onError(_createError(this.auth, code));
    } else {
      consumer.onAuthEvent(event);
    }
  }
  isEventForConsumer(event, consumer) {
    const eventIdMatches = consumer.eventId === null || !!event.eventId && event.eventId === consumer.eventId;
    return consumer.filter.includes(event.type) && eventIdMatches;
  }
  hasEventBeenHandled(event) {
    if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) {
      this.cachedEventUids.clear();
    }
    return this.cachedEventUids.has(eventUid(event));
  }
  saveEventToCache(event) {
    this.cachedEventUids.add(eventUid(event));
    this.lastProcessedEventTime = Date.now();
  }
}
var IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
var HTTP_REGEX = /^https?/;
var NETWORK_TIMEOUT = new Delay(30000, 60000);
var cachedGApiLoader = null;
var PING_TIMEOUT = new Delay(5000, 15000);
var IFRAME_PATH = "__/auth/iframe";
var EMULATED_IFRAME_PATH = "emulator/auth/iframe";
var IFRAME_ATTRIBUTES = {
  style: {
    position: "absolute",
    top: "-100px",
    width: "1px",
    height: "1px"
  },
  "aria-hidden": "true",
  tabindex: "-1"
};
var EID_FROM_APIHOST = new Map([
  ["identitytoolkit.googleapis.com", "p"],
  ["staging-identitytoolkit.sandbox.googleapis.com", "s"],
  ["test-identitytoolkit.sandbox.googleapis.com", "t"]
]);
var BASE_POPUP_OPTIONS = {
  location: "yes",
  resizable: "yes",
  statusbar: "yes",
  toolbar: "no"
};
var DEFAULT_WIDTH = 500;
var DEFAULT_HEIGHT = 600;
var TARGET_BLANK = "_blank";
var FIREFOX_EMPTY_URL = "http://localhost";

class AuthPopup {
  constructor(window2) {
    this.window = window2;
    this.associatedEvent = null;
  }
  close() {
    if (this.window) {
      try {
        this.window.close();
      } catch (e) {
      }
    }
  }
}
var WIDGET_PATH = "__/auth/handler";
var EMULATOR_WIDGET_PATH = "emulator/auth/handler";
var FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent("fac");
var WEB_STORAGE_SUPPORT_KEY = "webStorageSupport";

class BrowserPopupRedirectResolver {
  constructor() {
    this.eventManagers = {};
    this.iframes = {};
    this.originValidationPromises = {};
    this._redirectPersistence = browserSessionPersistence;
    this._completeRedirectFn = _getRedirectResult;
    this._overrideRedirectResult = _overrideRedirectResult;
  }
  async _openPopup(auth, provider, authType, eventId) {
    var _a;
    debugAssert((_a = this.eventManagers[auth._key()]) === null || _a === undefined ? undefined : _a.manager, "_initialize() not called before _openPopup()");
    const url = await _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId);
    return _open(auth, url, _generateEventId());
  }
  async _openRedirect(auth, provider, authType, eventId) {
    await this._originValidation(auth);
    const url = await _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId);
    _setWindowLocation(url);
    return new Promise(() => {
    });
  }
  _initialize(auth) {
    const key = auth._key();
    if (this.eventManagers[key]) {
      const { manager, promise: promise2 } = this.eventManagers[key];
      if (manager) {
        return Promise.resolve(manager);
      } else {
        debugAssert(promise2, "If manager is not set, promise should be");
        return promise2;
      }
    }
    const promise = this.initAndGetManager(auth);
    this.eventManagers[key] = { promise };
    promise.catch(() => {
      delete this.eventManagers[key];
    });
    return promise;
  }
  async initAndGetManager(auth) {
    const iframe = await _openIframe(auth);
    const manager = new AuthEventManager(auth);
    iframe.register("authEvent", (iframeEvent) => {
      _assert(iframeEvent === null || iframeEvent === undefined ? undefined : iframeEvent.authEvent, auth, "invalid-auth-event");
      const handled = manager.onEvent(iframeEvent.authEvent);
      return { status: handled ? "ACK" : "ERROR" };
    }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
    this.eventManagers[auth._key()] = { manager };
    this.iframes[auth._key()] = iframe;
    return manager;
  }
  _isIframeWebStorageSupported(auth, cb) {
    const iframe = this.iframes[auth._key()];
    iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, (result) => {
      var _a;
      const isSupported = (_a = result === null || result === undefined ? undefined : result[0]) === null || _a === undefined ? undefined : _a[WEB_STORAGE_SUPPORT_KEY];
      if (isSupported !== undefined) {
        cb(!!isSupported);
      }
      _fail(auth, "internal-error");
    }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
  }
  _originValidation(auth) {
    const key = auth._key();
    if (!this.originValidationPromises[key]) {
      this.originValidationPromises[key] = _validateOrigin(auth);
    }
    return this.originValidationPromises[key];
  }
  get _shouldInitProactively() {
    return _isMobileBrowser() || _isSafari() || _isIOS();
  }
}
var browserPopupRedirectResolver = BrowserPopupRedirectResolver;

class MultiFactorAssertionImpl {
  constructor(factorId) {
    this.factorId = factorId;
  }
  _process(auth, session, displayName) {
    switch (session.type) {
      case "enroll":
        return this._finalizeEnroll(auth, session.credential, displayName);
      case "signin":
        return this._finalizeSignIn(auth, session.credential);
      default:
        return debugFail("unexpected MultiFactorSessionType");
    }
  }
}

class PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
  constructor(credential) {
    super("phone");
    this.credential = credential;
  }
  static _fromCredential(credential) {
    return new PhoneMultiFactorAssertionImpl(credential);
  }
  _finalizeEnroll(auth, idToken, displayName) {
    return finalizeEnrollPhoneMfa(auth, {
      idToken,
      displayName,
      phoneVerificationInfo: this.credential._makeVerificationRequest()
    });
  }
  _finalizeSignIn(auth, mfaPendingCredential) {
    return finalizeSignInPhoneMfa(auth, {
      mfaPendingCredential,
      phoneVerificationInfo: this.credential._makeVerificationRequest()
    });
  }
}

class PhoneMultiFactorGenerator {
  constructor() {
  }
  static assertion(credential) {
    return PhoneMultiFactorAssertionImpl._fromCredential(credential);
  }
}
PhoneMultiFactorGenerator.FACTOR_ID = "phone";

class TotpMultiFactorGenerator {
  static assertionForEnrollment(secret, oneTimePassword) {
    return TotpMultiFactorAssertionImpl._fromSecret(secret, oneTimePassword);
  }
  static assertionForSignIn(enrollmentId, oneTimePassword) {
    return TotpMultiFactorAssertionImpl._fromEnrollmentId(enrollmentId, oneTimePassword);
  }
  static async generateSecret(session) {
    var _a;
    const mfaSession = session;
    _assert(typeof ((_a = mfaSession.user) === null || _a === undefined ? undefined : _a.auth) !== "undefined", "internal-error");
    const response = await startEnrollTotpMfa(mfaSession.user.auth, {
      idToken: mfaSession.credential,
      totpEnrollmentInfo: {}
    });
    return TotpSecret._fromStartTotpMfaEnrollmentResponse(response, mfaSession.user.auth);
  }
}
TotpMultiFactorGenerator.FACTOR_ID = "totp";

class TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
  constructor(otp, enrollmentId, secret) {
    super("totp");
    this.otp = otp;
    this.enrollmentId = enrollmentId;
    this.secret = secret;
  }
  static _fromSecret(secret, otp) {
    return new TotpMultiFactorAssertionImpl(otp, undefined, secret);
  }
  static _fromEnrollmentId(enrollmentId, otp) {
    return new TotpMultiFactorAssertionImpl(otp, enrollmentId);
  }
  async _finalizeEnroll(auth, idToken, displayName) {
    _assert(typeof this.secret !== "undefined", auth, "argument-error");
    return finalizeEnrollTotpMfa(auth, {
      idToken,
      displayName,
      totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
    });
  }
  async _finalizeSignIn(auth, mfaPendingCredential) {
    _assert(this.enrollmentId !== undefined && this.otp !== undefined, auth, "argument-error");
    const totpVerificationInfo = { verificationCode: this.otp };
    return finalizeSignInTotpMfa(auth, {
      mfaPendingCredential,
      mfaEnrollmentId: this.enrollmentId,
      totpVerificationInfo
    });
  }
}

class TotpSecret {
  constructor(secretKey, hashingAlgorithm, codeLength, codeIntervalSeconds, enrollmentCompletionDeadline, sessionInfo, auth) {
    this.sessionInfo = sessionInfo;
    this.auth = auth;
    this.secretKey = secretKey;
    this.hashingAlgorithm = hashingAlgorithm;
    this.codeLength = codeLength;
    this.codeIntervalSeconds = codeIntervalSeconds;
    this.enrollmentCompletionDeadline = enrollmentCompletionDeadline;
  }
  static _fromStartTotpMfaEnrollmentResponse(response, auth) {
    return new TotpSecret(response.totpSessionInfo.sharedSecretKey, response.totpSessionInfo.hashingAlgorithm, response.totpSessionInfo.verificationCodeLength, response.totpSessionInfo.periodSec, new Date(response.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), response.totpSessionInfo.sessionInfo, auth);
  }
  _makeTotpVerificationInfo(otp) {
    return { sessionInfo: this.sessionInfo, verificationCode: otp };
  }
  generateQrCodeUrl(accountName, issuer) {
    var _a;
    let useDefaults = false;
    if (_isEmptyString(accountName) || _isEmptyString(issuer)) {
      useDefaults = true;
    }
    if (useDefaults) {
      if (_isEmptyString(accountName)) {
        accountName = ((_a = this.auth.currentUser) === null || _a === undefined ? undefined : _a.email) || "unknownuser";
      }
      if (_isEmptyString(issuer)) {
        issuer = this.auth.name;
      }
    }
    return `otpauth://totp/${issuer}:${accountName}?secret=${this.secretKey}&issuer=${issuer}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`;
  }
}
var name3 = "@firebase/auth";
var version3 = "1.7.4";

class AuthInterop {
  constructor(auth) {
    this.auth = auth;
    this.internalListeners = new Map;
  }
  getUid() {
    var _a;
    this.assertAuthConfigured();
    return ((_a = this.auth.currentUser) === null || _a === undefined ? undefined : _a.uid) || null;
  }
  async getToken(forceRefresh) {
    this.assertAuthConfigured();
    await this.auth._initializationPromise;
    if (!this.auth.currentUser) {
      return null;
    }
    const accessToken = await this.auth.currentUser.getIdToken(forceRefresh);
    return { accessToken };
  }
  addAuthTokenListener(listener) {
    this.assertAuthConfigured();
    if (this.internalListeners.has(listener)) {
      return;
    }
    const unsubscribe = this.auth.onIdTokenChanged((user) => {
      listener((user === null || user === undefined ? undefined : user.stsTokenManager.accessToken) || null);
    });
    this.internalListeners.set(listener, unsubscribe);
    this.updateProactiveRefresh();
  }
  removeAuthTokenListener(listener) {
    this.assertAuthConfigured();
    const unsubscribe = this.internalListeners.get(listener);
    if (!unsubscribe) {
      return;
    }
    this.internalListeners.delete(listener);
    unsubscribe();
    this.updateProactiveRefresh();
  }
  assertAuthConfigured() {
    _assert(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth");
  }
  updateProactiveRefresh() {
    if (this.internalListeners.size > 0) {
      this.auth._startProactiveRefresh();
    } else {
      this.auth._stopProactiveRefresh();
    }
  }
}
var DEFAULT_ID_TOKEN_MAX_AGE = 5 * 60;
var authIdTokenMaxAge = getExperimentalSetting("authIdTokenMaxAge") || DEFAULT_ID_TOKEN_MAX_AGE;
var lastPostedIdToken = null;
var mintCookieFactory = (url) => async (user) => {
  const idTokenResult = user && await user.getIdTokenResult();
  const idTokenAge = idTokenResult && (new Date().getTime() - Date.parse(idTokenResult.issuedAtTime)) / 1000;
  if (idTokenAge && idTokenAge > authIdTokenMaxAge) {
    return;
  }
  const idToken = idTokenResult === null || idTokenResult === undefined ? undefined : idTokenResult.token;
  if (lastPostedIdToken === idToken) {
    return;
  }
  lastPostedIdToken = idToken;
  await fetch(url, {
    method: idToken ? "POST" : "DELETE",
    headers: idToken ? {
      Authorization: `Bearer ${idToken}`
    } : {}
  });
};
_setExternalJSProvider({
  loadJS(url) {
    return new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.setAttribute("src", url);
      el.onload = resolve;
      el.onerror = (e) => {
        const error = _createError("internal-error");
        error.customData = e;
        reject(error);
      };
      el.type = "text/javascript";
      el.charset = "UTF-8";
      getScriptParentElement().appendChild(el);
    });
  },
  gapiScript: "https://apis.google.com/js/api.js",
  recaptchaV2Script: "https://www.google.com/recaptcha/api.js",
  recaptchaEnterpriseScript: "https://www.google.com/recaptcha/enterprise.js?render="
});
registerAuth("Browser");
// js/auth.js
async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth3, googleProvider);
    console.log("User signed in");
    const user = result.user;
    updateUIOnSignIn(user);
  } catch (error) {
    console.error("Sign in failed:", error);
    alert("Sign in failed: " + error.message);
  }
}
async function signOutUser() {
  try {
    await signOut(auth3);
    console.log("User signed out");
    updateUIOnSignOut();
  } catch (error) {
    console.error("Sign out failed:", error);
    alert("Sign out failed: " + error.message);
  }
}
var updateUIOnSignIn = function(user) {
  document.getElementById("signin-btn").classList.add("hidden");
  document.getElementById("signout-btn").classList.remove("hidden");
  console.log("User Details:", user);
};
var updateUIOnSignOut = function() {
  document.getElementById("signin-btn").classList.remove("hidden");
  document.getElementById("signout-btn").classList.add("hidden");
  console.log("UI updated for sign out.");
};
var firebaseConfig = {
  apiKey: "AIzaSyDllOEaNJTcldiOZR6DwNL-VnbbCmDtXB4",
  authDomain: "srm-web-app.firebaseapp.com",
  projectId: "srm-web-app",
  storageBucket: "srm-web-app.appspot.com",
  messagingSenderId: "854722873993",
  appId: "1:854722873993:web:2d5ba66678f63b81fbd458",
  measurementId: "G-GR0RCESHZZ"
};
var app6 = initializeApp(firebaseConfig);
var auth3 = getAuth(app6);
var googleProvider = new GoogleAuthProvider;
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
window.updateUIOnSignIn = updateUIOnSignIn;
window.updateUIOnSignOut = updateUIOnSignOut;

// node_modules/@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var bloom_blob_es2018 = {};
var Integer;
var Md5;
(function() {
  var h;
  function k(f, a) {
    function c() {
    }
    c.prototype = a.prototype;
    f.D = a.prototype;
    f.prototype = new c;
    f.prototype.constructor = f;
    f.C = function(d, e, g) {
      for (var b = Array(arguments.length - 2), r = 2;r < arguments.length; r++)
        b[r - 2] = arguments[r];
      return a.prototype[e].apply(d, b);
    };
  }
  function l() {
    this.blockSize = -1;
  }
  function m() {
    this.blockSize = -1;
    this.blockSize = 64;
    this.g = Array(4);
    this.B = Array(this.blockSize);
    this.o = this.h = 0;
    this.s();
  }
  k(m, l);
  m.prototype.s = function() {
    this.g[0] = 1732584193;
    this.g[1] = 4023233417;
    this.g[2] = 2562383102;
    this.g[3] = 271733878;
    this.o = this.h = 0;
  };
  function n(f, a, c) {
    c || (c = 0);
    var d = Array(16);
    if (typeof a === "string")
      for (var e = 0;16 > e; ++e)
        d[e] = a.charCodeAt(c++) | a.charCodeAt(c++) << 8 | a.charCodeAt(c++) << 16 | a.charCodeAt(c++) << 24;
    else
      for (e = 0;16 > e; ++e)
        d[e] = a[c++] | a[c++] << 8 | a[c++] << 16 | a[c++] << 24;
    a = f.g[0];
    c = f.g[1];
    e = f.g[2];
    var g = f.g[3];
    var b = a + (g ^ c & (e ^ g)) + d[0] + 3614090360 & 4294967295;
    a = c + (b << 7 & 4294967295 | b >>> 25);
    b = g + (e ^ a & (c ^ e)) + d[1] + 3905402710 & 4294967295;
    g = a + (b << 12 & 4294967295 | b >>> 20);
    b = e + (c ^ g & (a ^ c)) + d[2] + 606105819 & 4294967295;
    e = g + (b << 17 & 4294967295 | b >>> 15);
    b = c + (a ^ e & (g ^ a)) + d[3] + 3250441966 & 4294967295;
    c = e + (b << 22 & 4294967295 | b >>> 10);
    b = a + (g ^ c & (e ^ g)) + d[4] + 4118548399 & 4294967295;
    a = c + (b << 7 & 4294967295 | b >>> 25);
    b = g + (e ^ a & (c ^ e)) + d[5] + 1200080426 & 4294967295;
    g = a + (b << 12 & 4294967295 | b >>> 20);
    b = e + (c ^ g & (a ^ c)) + d[6] + 2821735955 & 4294967295;
    e = g + (b << 17 & 4294967295 | b >>> 15);
    b = c + (a ^ e & (g ^ a)) + d[7] + 4249261313 & 4294967295;
    c = e + (b << 22 & 4294967295 | b >>> 10);
    b = a + (g ^ c & (e ^ g)) + d[8] + 1770035416 & 4294967295;
    a = c + (b << 7 & 4294967295 | b >>> 25);
    b = g + (e ^ a & (c ^ e)) + d[9] + 2336552879 & 4294967295;
    g = a + (b << 12 & 4294967295 | b >>> 20);
    b = e + (c ^ g & (a ^ c)) + d[10] + 4294925233 & 4294967295;
    e = g + (b << 17 & 4294967295 | b >>> 15);
    b = c + (a ^ e & (g ^ a)) + d[11] + 2304563134 & 4294967295;
    c = e + (b << 22 & 4294967295 | b >>> 10);
    b = a + (g ^ c & (e ^ g)) + d[12] + 1804603682 & 4294967295;
    a = c + (b << 7 & 4294967295 | b >>> 25);
    b = g + (e ^ a & (c ^ e)) + d[13] + 4254626195 & 4294967295;
    g = a + (b << 12 & 4294967295 | b >>> 20);
    b = e + (c ^ g & (a ^ c)) + d[14] + 2792965006 & 4294967295;
    e = g + (b << 17 & 4294967295 | b >>> 15);
    b = c + (a ^ e & (g ^ a)) + d[15] + 1236535329 & 4294967295;
    c = e + (b << 22 & 4294967295 | b >>> 10);
    b = a + (e ^ g & (c ^ e)) + d[1] + 4129170786 & 4294967295;
    a = c + (b << 5 & 4294967295 | b >>> 27);
    b = g + (c ^ e & (a ^ c)) + d[6] + 3225465664 & 4294967295;
    g = a + (b << 9 & 4294967295 | b >>> 23);
    b = e + (a ^ c & (g ^ a)) + d[11] + 643717713 & 4294967295;
    e = g + (b << 14 & 4294967295 | b >>> 18);
    b = c + (g ^ a & (e ^ g)) + d[0] + 3921069994 & 4294967295;
    c = e + (b << 20 & 4294967295 | b >>> 12);
    b = a + (e ^ g & (c ^ e)) + d[5] + 3593408605 & 4294967295;
    a = c + (b << 5 & 4294967295 | b >>> 27);
    b = g + (c ^ e & (a ^ c)) + d[10] + 38016083 & 4294967295;
    g = a + (b << 9 & 4294967295 | b >>> 23);
    b = e + (a ^ c & (g ^ a)) + d[15] + 3634488961 & 4294967295;
    e = g + (b << 14 & 4294967295 | b >>> 18);
    b = c + (g ^ a & (e ^ g)) + d[4] + 3889429448 & 4294967295;
    c = e + (b << 20 & 4294967295 | b >>> 12);
    b = a + (e ^ g & (c ^ e)) + d[9] + 568446438 & 4294967295;
    a = c + (b << 5 & 4294967295 | b >>> 27);
    b = g + (c ^ e & (a ^ c)) + d[14] + 3275163606 & 4294967295;
    g = a + (b << 9 & 4294967295 | b >>> 23);
    b = e + (a ^ c & (g ^ a)) + d[3] + 4107603335 & 4294967295;
    e = g + (b << 14 & 4294967295 | b >>> 18);
    b = c + (g ^ a & (e ^ g)) + d[8] + 1163531501 & 4294967295;
    c = e + (b << 20 & 4294967295 | b >>> 12);
    b = a + (e ^ g & (c ^ e)) + d[13] + 2850285829 & 4294967295;
    a = c + (b << 5 & 4294967295 | b >>> 27);
    b = g + (c ^ e & (a ^ c)) + d[2] + 4243563512 & 4294967295;
    g = a + (b << 9 & 4294967295 | b >>> 23);
    b = e + (a ^ c & (g ^ a)) + d[7] + 1735328473 & 4294967295;
    e = g + (b << 14 & 4294967295 | b >>> 18);
    b = c + (g ^ a & (e ^ g)) + d[12] + 2368359562 & 4294967295;
    c = e + (b << 20 & 4294967295 | b >>> 12);
    b = a + (c ^ e ^ g) + d[5] + 4294588738 & 4294967295;
    a = c + (b << 4 & 4294967295 | b >>> 28);
    b = g + (a ^ c ^ e) + d[8] + 2272392833 & 4294967295;
    g = a + (b << 11 & 4294967295 | b >>> 21);
    b = e + (g ^ a ^ c) + d[11] + 1839030562 & 4294967295;
    e = g + (b << 16 & 4294967295 | b >>> 16);
    b = c + (e ^ g ^ a) + d[14] + 4259657740 & 4294967295;
    c = e + (b << 23 & 4294967295 | b >>> 9);
    b = a + (c ^ e ^ g) + d[1] + 2763975236 & 4294967295;
    a = c + (b << 4 & 4294967295 | b >>> 28);
    b = g + (a ^ c ^ e) + d[4] + 1272893353 & 4294967295;
    g = a + (b << 11 & 4294967295 | b >>> 21);
    b = e + (g ^ a ^ c) + d[7] + 4139469664 & 4294967295;
    e = g + (b << 16 & 4294967295 | b >>> 16);
    b = c + (e ^ g ^ a) + d[10] + 3200236656 & 4294967295;
    c = e + (b << 23 & 4294967295 | b >>> 9);
    b = a + (c ^ e ^ g) + d[13] + 681279174 & 4294967295;
    a = c + (b << 4 & 4294967295 | b >>> 28);
    b = g + (a ^ c ^ e) + d[0] + 3936430074 & 4294967295;
    g = a + (b << 11 & 4294967295 | b >>> 21);
    b = e + (g ^ a ^ c) + d[3] + 3572445317 & 4294967295;
    e = g + (b << 16 & 4294967295 | b >>> 16);
    b = c + (e ^ g ^ a) + d[6] + 76029189 & 4294967295;
    c = e + (b << 23 & 4294967295 | b >>> 9);
    b = a + (c ^ e ^ g) + d[9] + 3654602809 & 4294967295;
    a = c + (b << 4 & 4294967295 | b >>> 28);
    b = g + (a ^ c ^ e) + d[12] + 3873151461 & 4294967295;
    g = a + (b << 11 & 4294967295 | b >>> 21);
    b = e + (g ^ a ^ c) + d[15] + 530742520 & 4294967295;
    e = g + (b << 16 & 4294967295 | b >>> 16);
    b = c + (e ^ g ^ a) + d[2] + 3299628645 & 4294967295;
    c = e + (b << 23 & 4294967295 | b >>> 9);
    b = a + (e ^ (c | ~g)) + d[0] + 4096336452 & 4294967295;
    a = c + (b << 6 & 4294967295 | b >>> 26);
    b = g + (c ^ (a | ~e)) + d[7] + 1126891415 & 4294967295;
    g = a + (b << 10 & 4294967295 | b >>> 22);
    b = e + (a ^ (g | ~c)) + d[14] + 2878612391 & 4294967295;
    e = g + (b << 15 & 4294967295 | b >>> 17);
    b = c + (g ^ (e | ~a)) + d[5] + 4237533241 & 4294967295;
    c = e + (b << 21 & 4294967295 | b >>> 11);
    b = a + (e ^ (c | ~g)) + d[12] + 1700485571 & 4294967295;
    a = c + (b << 6 & 4294967295 | b >>> 26);
    b = g + (c ^ (a | ~e)) + d[3] + 2399980690 & 4294967295;
    g = a + (b << 10 & 4294967295 | b >>> 22);
    b = e + (a ^ (g | ~c)) + d[10] + 4293915773 & 4294967295;
    e = g + (b << 15 & 4294967295 | b >>> 17);
    b = c + (g ^ (e | ~a)) + d[1] + 2240044497 & 4294967295;
    c = e + (b << 21 & 4294967295 | b >>> 11);
    b = a + (e ^ (c | ~g)) + d[8] + 1873313359 & 4294967295;
    a = c + (b << 6 & 4294967295 | b >>> 26);
    b = g + (c ^ (a | ~e)) + d[15] + 4264355552 & 4294967295;
    g = a + (b << 10 & 4294967295 | b >>> 22);
    b = e + (a ^ (g | ~c)) + d[6] + 2734768916 & 4294967295;
    e = g + (b << 15 & 4294967295 | b >>> 17);
    b = c + (g ^ (e | ~a)) + d[13] + 1309151649 & 4294967295;
    c = e + (b << 21 & 4294967295 | b >>> 11);
    b = a + (e ^ (c | ~g)) + d[4] + 4149444226 & 4294967295;
    a = c + (b << 6 & 4294967295 | b >>> 26);
    b = g + (c ^ (a | ~e)) + d[11] + 3174756917 & 4294967295;
    g = a + (b << 10 & 4294967295 | b >>> 22);
    b = e + (a ^ (g | ~c)) + d[2] + 718787259 & 4294967295;
    e = g + (b << 15 & 4294967295 | b >>> 17);
    b = c + (g ^ (e | ~a)) + d[9] + 3951481745 & 4294967295;
    f.g[0] = f.g[0] + a & 4294967295;
    f.g[1] = f.g[1] + (e + (b << 21 & 4294967295 | b >>> 11)) & 4294967295;
    f.g[2] = f.g[2] + e & 4294967295;
    f.g[3] = f.g[3] + g & 4294967295;
  }
  m.prototype.u = function(f, a) {
    a === undefined && (a = f.length);
    for (var c = a - this.blockSize, d = this.B, e = this.h, g = 0;g < a; ) {
      if (e == 0)
        for (;g <= c; )
          n(this, f, g), g += this.blockSize;
      if (typeof f === "string")
        for (;g < a; ) {
          if (d[e++] = f.charCodeAt(g++), e == this.blockSize) {
            n(this, d);
            e = 0;
            break;
          }
        }
      else
        for (;g < a; )
          if (d[e++] = f[g++], e == this.blockSize) {
            n(this, d);
            e = 0;
            break;
          }
    }
    this.h = e;
    this.o += a;
  };
  m.prototype.v = function() {
    var f = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h);
    f[0] = 128;
    for (var a = 1;a < f.length - 8; ++a)
      f[a] = 0;
    var c = 8 * this.o;
    for (a = f.length - 8;a < f.length; ++a)
      f[a] = c & 255, c /= 256;
    this.u(f);
    f = Array(16);
    for (a = c = 0;4 > a; ++a)
      for (var d = 0;32 > d; d += 8)
        f[c++] = this.g[a] >>> d & 255;
    return f;
  };
  function p(f, a) {
    var c = q;
    return Object.prototype.hasOwnProperty.call(c, f) ? c[f] : c[f] = a(f);
  }
  function t(f, a) {
    this.h = a;
    for (var c = [], d = true, e = f.length - 1;0 <= e; e--) {
      var g = f[e] | 0;
      d && g == a || (c[e] = g, d = false);
    }
    this.g = c;
  }
  var q = {};
  function u(f) {
    return -128 <= f && 128 > f ? p(f, function(a) {
      return new t([a | 0], 0 > a ? -1 : 0);
    }) : new t([f | 0], 0 > f ? -1 : 0);
  }
  function v(f) {
    if (isNaN(f) || !isFinite(f))
      return w;
    if (0 > f)
      return x(v(-f));
    for (var a = [], c = 1, d = 0;f >= c; d++)
      a[d] = f / c | 0, c *= 4294967296;
    return new t(a, 0);
  }
  function y(f, a) {
    if (f.length == 0)
      throw Error("number format error: empty string");
    a = a || 10;
    if (2 > a || 36 < a)
      throw Error("radix out of range: " + a);
    if (f.charAt(0) == "-")
      return x(y(f.substring(1), a));
    if (0 <= f.indexOf("-"))
      throw Error('number format error: interior "-" character');
    for (var c = v(Math.pow(a, 8)), d = w, e = 0;e < f.length; e += 8) {
      var g = Math.min(8, f.length - e), b = parseInt(f.substring(e, e + g), a);
      8 > g ? (g = v(Math.pow(a, g)), d = d.j(g).add(v(b))) : (d = d.j(c), d = d.add(v(b)));
    }
    return d;
  }
  var w = u(0), z = u(1), A = u(16777216);
  h = t.prototype;
  h.m = function() {
    if (B(this))
      return -x(this).m();
    for (var f = 0, a = 1, c = 0;c < this.g.length; c++) {
      var d = this.i(c);
      f += (0 <= d ? d : 4294967296 + d) * a;
      a *= 4294967296;
    }
    return f;
  };
  h.toString = function(f) {
    f = f || 10;
    if (2 > f || 36 < f)
      throw Error("radix out of range: " + f);
    if (C(this))
      return "0";
    if (B(this))
      return "-" + x(this).toString(f);
    for (var a = v(Math.pow(f, 6)), c = this, d = "";; ) {
      var e = D(c, a).g;
      c = F(c, e.j(a));
      var g = ((0 < c.g.length ? c.g[0] : c.h) >>> 0).toString(f);
      c = e;
      if (C(c))
        return g + d;
      for (;6 > g.length; )
        g = "0" + g;
      d = g + d;
    }
  };
  h.i = function(f) {
    return 0 > f ? 0 : f < this.g.length ? this.g[f] : this.h;
  };
  function C(f) {
    if (f.h != 0)
      return false;
    for (var a = 0;a < f.g.length; a++)
      if (f.g[a] != 0)
        return false;
    return true;
  }
  function B(f) {
    return f.h == -1;
  }
  h.l = function(f) {
    f = F(this, f);
    return B(f) ? -1 : C(f) ? 0 : 1;
  };
  function x(f) {
    for (var a = f.g.length, c = [], d = 0;d < a; d++)
      c[d] = ~f.g[d];
    return new t(c, ~f.h).add(z);
  }
  h.abs = function() {
    return B(this) ? x(this) : this;
  };
  h.add = function(f) {
    for (var a = Math.max(this.g.length, f.g.length), c = [], d = 0, e = 0;e <= a; e++) {
      var g = d + (this.i(e) & 65535) + (f.i(e) & 65535), b = (g >>> 16) + (this.i(e) >>> 16) + (f.i(e) >>> 16);
      d = b >>> 16;
      g &= 65535;
      b &= 65535;
      c[e] = b << 16 | g;
    }
    return new t(c, c[c.length - 1] & -2147483648 ? -1 : 0);
  };
  function F(f, a) {
    return f.add(x(a));
  }
  h.j = function(f) {
    if (C(this) || C(f))
      return w;
    if (B(this))
      return B(f) ? x(this).j(x(f)) : x(x(this).j(f));
    if (B(f))
      return x(this.j(x(f)));
    if (0 > this.l(A) && 0 > f.l(A))
      return v(this.m() * f.m());
    for (var a = this.g.length + f.g.length, c = [], d = 0;d < 2 * a; d++)
      c[d] = 0;
    for (d = 0;d < this.g.length; d++)
      for (var e = 0;e < f.g.length; e++) {
        var g = this.i(d) >>> 16, b = this.i(d) & 65535, r = f.i(e) >>> 16, E = f.i(e) & 65535;
        c[2 * d + 2 * e] += b * E;
        G(c, 2 * d + 2 * e);
        c[2 * d + 2 * e + 1] += g * E;
        G(c, 2 * d + 2 * e + 1);
        c[2 * d + 2 * e + 1] += b * r;
        G(c, 2 * d + 2 * e + 1);
        c[2 * d + 2 * e + 2] += g * r;
        G(c, 2 * d + 2 * e + 2);
      }
    for (d = 0;d < a; d++)
      c[d] = c[2 * d + 1] << 16 | c[2 * d];
    for (d = a;d < 2 * a; d++)
      c[d] = 0;
    return new t(c, 0);
  };
  function G(f, a) {
    for (;(f[a] & 65535) != f[a]; )
      f[a + 1] += f[a] >>> 16, f[a] &= 65535, a++;
  }
  function H(f, a) {
    this.g = f;
    this.h = a;
  }
  function D(f, a) {
    if (C(a))
      throw Error("division by zero");
    if (C(f))
      return new H(w, w);
    if (B(f))
      return a = D(x(f), a), new H(x(a.g), x(a.h));
    if (B(a))
      return a = D(f, x(a)), new H(x(a.g), a.h);
    if (30 < f.g.length) {
      if (B(f) || B(a))
        throw Error("slowDivide_ only works with positive integers.");
      for (var c = z, d = a;0 >= d.l(f); )
        c = I(c), d = I(d);
      var e = J(c, 1), g = J(d, 1);
      d = J(d, 2);
      for (c = J(c, 2);!C(d); ) {
        var b = g.add(d);
        0 >= b.l(f) && (e = e.add(c), g = b);
        d = J(d, 1);
        c = J(c, 1);
      }
      a = F(f, e.j(a));
      return new H(e, a);
    }
    for (e = w;0 <= f.l(a); ) {
      c = Math.max(1, Math.floor(f.m() / a.m()));
      d = Math.ceil(Math.log(c) / Math.LN2);
      d = 48 >= d ? 1 : Math.pow(2, d - 48);
      g = v(c);
      for (b = g.j(a);B(b) || 0 < b.l(f); )
        c -= d, g = v(c), b = g.j(a);
      C(g) && (g = z);
      e = e.add(g);
      f = F(f, b);
    }
    return new H(e, f);
  }
  h.A = function(f) {
    return D(this, f).h;
  };
  h.and = function(f) {
    for (var a = Math.max(this.g.length, f.g.length), c = [], d = 0;d < a; d++)
      c[d] = this.i(d) & f.i(d);
    return new t(c, this.h & f.h);
  };
  h.or = function(f) {
    for (var a = Math.max(this.g.length, f.g.length), c = [], d = 0;d < a; d++)
      c[d] = this.i(d) | f.i(d);
    return new t(c, this.h | f.h);
  };
  h.xor = function(f) {
    for (var a = Math.max(this.g.length, f.g.length), c = [], d = 0;d < a; d++)
      c[d] = this.i(d) ^ f.i(d);
    return new t(c, this.h ^ f.h);
  };
  function I(f) {
    for (var a = f.g.length + 1, c = [], d = 0;d < a; d++)
      c[d] = f.i(d) << 1 | f.i(d - 1) >>> 31;
    return new t(c, f.h);
  }
  function J(f, a) {
    var c = a >> 5;
    a %= 32;
    for (var d = f.g.length - c, e = [], g = 0;g < d; g++)
      e[g] = 0 < a ? f.i(g + c) >>> a | f.i(g + c + 1) << 32 - a : f.i(g + c);
    return new t(e, f.h);
  }
  m.prototype.digest = m.prototype.v;
  m.prototype.reset = m.prototype.s;
  m.prototype.update = m.prototype.u;
  Md5 = bloom_blob_es2018.Md5 = m;
  t.prototype.add = t.prototype.add;
  t.prototype.multiply = t.prototype.j;
  t.prototype.modulo = t.prototype.A;
  t.prototype.compare = t.prototype.l;
  t.prototype.toNumber = t.prototype.m;
  t.prototype.toString = t.prototype.toString;
  t.prototype.getBits = t.prototype.i;
  t.fromNumber = v;
  t.fromString = y;
  Integer = bloom_blob_es2018.Integer = t;
}).apply(typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

// node_modules/@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js
var commonjsGlobal2 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var webchannel_blob_es2018 = {};
var XhrIo;
var FetchXmlHttpFactory;
var WebChannel;
var EventType;
var ErrorCode;
var Stat;
var Event;
var getStatEventTarget;
var createWebChannelTransport;
(function() {
  var h, aa = typeof Object.defineProperties == "function" ? Object.defineProperty : function(a, b, c) {
    if (a == Array.prototype || a == Object.prototype)
      return a;
    a[b] = c.value;
    return a;
  };
  function ba(a) {
    a = [typeof globalThis == "object" && globalThis, a, typeof window == "object" && window, typeof self == "object" && self, typeof commonjsGlobal2 == "object" && commonjsGlobal2];
    for (var b = 0;b < a.length; ++b) {
      var c = a[b];
      if (c && c.Math == Math)
        return c;
    }
    throw Error("Cannot find global object");
  }
  var ca = ba(this);
  function da(a, b) {
    if (b)
      a: {
        var c = ca;
        a = a.split(".");
        for (var d = 0;d < a.length - 1; d++) {
          var e = a[d];
          if (!(e in c))
            break a;
          c = c[e];
        }
        a = a[a.length - 1];
        d = c[a];
        b = b(d);
        b != d && b != null && aa(c, a, { configurable: true, writable: true, value: b });
      }
  }
  function ea(a, b) {
    a instanceof String && (a += "");
    var c = 0, d = false, e = { next: function() {
      if (!d && c < a.length) {
        var f = c++;
        return { value: b(f, a[f]), done: false };
      }
      d = true;
      return { done: true, value: undefined };
    } };
    e[Symbol.iterator] = function() {
      return e;
    };
    return e;
  }
  da("Array.prototype.values", function(a) {
    return a ? a : function() {
      return ea(this, function(b, c) {
        return c;
      });
    };
  });
  var fa = fa || {}, k = this || self;
  function ha(a) {
    var b = typeof a;
    b = b != "object" ? b : a ? Array.isArray(a) ? "array" : b : "null";
    return b == "array" || b == "object" && typeof a.length == "number";
  }
  function n(a) {
    var b = typeof a;
    return b == "object" && a != null || b == "function";
  }
  function ia(a, b, c) {
    return a.call.apply(a.bind, arguments);
  }
  function ja(a, b, c) {
    if (!a)
      throw Error();
    if (2 < arguments.length) {
      var d = Array.prototype.slice.call(arguments, 2);
      return function() {
        var e = Array.prototype.slice.call(arguments);
        Array.prototype.unshift.apply(e, d);
        return a.apply(b, e);
      };
    }
    return function() {
      return a.apply(b, arguments);
    };
  }
  function p(a, b, c) {
    p = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? ia : ja;
    return p.apply(null, arguments);
  }
  function ka(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function() {
      var d = c.slice();
      d.push.apply(d, arguments);
      return a.apply(this, d);
    };
  }
  function r(a, b) {
    function c() {
    }
    c.prototype = b.prototype;
    a.aa = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a;
    a.Qb = function(d, e, f) {
      for (var g = Array(arguments.length - 2), m = 2;m < arguments.length; m++)
        g[m - 2] = arguments[m];
      return b.prototype[e].apply(d, g);
    };
  }
  function la(a) {
    const b = a.length;
    if (0 < b) {
      const c = Array(b);
      for (let d = 0;d < b; d++)
        c[d] = a[d];
      return c;
    }
    return [];
  }
  function ma(a, b) {
    for (let c = 1;c < arguments.length; c++) {
      const d = arguments[c];
      if (ha(d)) {
        const e = a.length || 0, f = d.length || 0;
        a.length = e + f;
        for (let g = 0;g < f; g++)
          a[e + g] = d[g];
      } else
        a.push(d);
    }
  }

  class na {
    constructor(a, b) {
      this.i = a;
      this.j = b;
      this.h = 0;
      this.g = null;
    }
    get() {
      let a;
      0 < this.h ? (this.h--, a = this.g, this.g = a.next, a.next = null) : a = this.i();
      return a;
    }
  }
  function t(a) {
    return /^[\s\xa0]*$/.test(a);
  }
  function u() {
    var a = k.navigator;
    return a && (a = a.userAgent) ? a : "";
  }
  function oa(a) {
    oa[" "](a);
    return a;
  }
  oa[" "] = function() {
  };
  var pa = u().indexOf("Gecko") != -1 && !(u().toLowerCase().indexOf("webkit") != -1 && u().indexOf("Edge") == -1) && !(u().indexOf("Trident") != -1 || u().indexOf("MSIE") != -1) && u().indexOf("Edge") == -1;
  function qa(a, b, c) {
    for (const d in a)
      b.call(c, a[d], d, a);
  }
  function ra(a, b) {
    for (const c in a)
      b.call(undefined, a[c], c, a);
  }
  function sa(a) {
    const b = {};
    for (const c in a)
      b[c] = a[c];
    return b;
  }
  const ta = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
  function ua(a, b) {
    let c, d;
    for (let e = 1;e < arguments.length; e++) {
      d = arguments[e];
      for (c in d)
        a[c] = d[c];
      for (let f = 0;f < ta.length; f++)
        c = ta[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
  function va(a) {
    var b = 1;
    a = a.split(":");
    const c = [];
    for (;0 < b && a.length; )
      c.push(a.shift()), b--;
    a.length && c.push(a.join(":"));
    return c;
  }
  function wa(a) {
    k.setTimeout(() => {
      throw a;
    }, 0);
  }
  function xa() {
    var a = za;
    let b = null;
    a.g && (b = a.g, a.g = a.g.next, a.g || (a.h = null), b.next = null);
    return b;
  }

  class Aa {
    constructor() {
      this.h = this.g = null;
    }
    add(a, b) {
      const c = Ba.get();
      c.set(a, b);
      this.h ? this.h.next = c : this.g = c;
      this.h = c;
    }
  }
  var Ba = new na(() => new Ca, (a) => a.reset());

  class Ca {
    constructor() {
      this.next = this.g = this.h = null;
    }
    set(a, b) {
      this.h = a;
      this.g = b;
      this.next = null;
    }
    reset() {
      this.next = this.g = this.h = null;
    }
  }
  let x, y = false, za = new Aa, Ea = () => {
    const a = k.Promise.resolve(undefined);
    x = () => {
      a.then(Da);
    };
  };
  var Da = () => {
    for (var a;a = xa(); ) {
      try {
        a.h.call(a.g);
      } catch (c) {
        wa(c);
      }
      var b = Ba;
      b.j(a);
      100 > b.h && (b.h++, a.next = b.g, b.g = a);
    }
    y = false;
  };
  function z() {
    this.s = this.s;
    this.C = this.C;
  }
  z.prototype.s = false;
  z.prototype.ma = function() {
    this.s || (this.s = true, this.N());
  };
  z.prototype.N = function() {
    if (this.C)
      for (;this.C.length; )
        this.C.shift()();
  };
  function A(a, b) {
    this.type = a;
    this.g = this.target = b;
    this.defaultPrevented = false;
  }
  A.prototype.h = function() {
    this.defaultPrevented = true;
  };
  var Fa = function() {
    if (!k.addEventListener || !Object.defineProperty)
      return false;
    var a = false, b = Object.defineProperty({}, "passive", { get: function() {
      a = true;
    } });
    try {
      const c = () => {
      };
      k.addEventListener("test", c, b);
      k.removeEventListener("test", c, b);
    } catch (c) {
    }
    return a;
  }();
  function C(a, b) {
    A.call(this, a ? a.type : "");
    this.relatedTarget = this.g = this.target = null;
    this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
    this.key = "";
    this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
    this.state = null;
    this.pointerId = 0;
    this.pointerType = "";
    this.i = null;
    if (a) {
      var c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
      this.target = a.target || a.srcElement;
      this.g = b;
      if (b = a.relatedTarget) {
        if (pa) {
          a: {
            try {
              oa(b.nodeName);
              var e = true;
              break a;
            } catch (f) {
            }
            e = false;
          }
          e || (b = null);
        }
      } else
        c == "mouseover" ? b = a.fromElement : c == "mouseout" && (b = a.toElement);
      this.relatedTarget = b;
      d ? (this.clientX = d.clientX !== undefined ? d.clientX : d.pageX, this.clientY = d.clientY !== undefined ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== undefined ? a.clientX : a.pageX, this.clientY = a.clientY !== undefined ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
      this.button = a.button;
      this.key = a.key || "";
      this.ctrlKey = a.ctrlKey;
      this.altKey = a.altKey;
      this.shiftKey = a.shiftKey;
      this.metaKey = a.metaKey;
      this.pointerId = a.pointerId || 0;
      this.pointerType = typeof a.pointerType === "string" ? a.pointerType : Ga[a.pointerType] || "";
      this.state = a.state;
      this.i = a;
      a.defaultPrevented && C.aa.h.call(this);
    }
  }
  r(C, A);
  var Ga = { 2: "touch", 3: "pen", 4: "mouse" };
  C.prototype.h = function() {
    C.aa.h.call(this);
    var a = this.i;
    a.preventDefault ? a.preventDefault() : a.returnValue = false;
  };
  var D = "closure_listenable_" + (1e6 * Math.random() | 0);
  var Ha = 0;
  function Ia(a, b, c, d, e) {
    this.listener = a;
    this.proxy = null;
    this.src = b;
    this.type = c;
    this.capture = !!d;
    this.ha = e;
    this.key = ++Ha;
    this.da = this.fa = false;
  }
  function Ja(a) {
    a.da = true;
    a.listener = null;
    a.proxy = null;
    a.src = null;
    a.ha = null;
  }
  function Ka(a) {
    this.src = a;
    this.g = {};
    this.h = 0;
  }
  Ka.prototype.add = function(a, b, c, d, e) {
    var f = a.toString();
    a = this.g[f];
    a || (a = this.g[f] = [], this.h++);
    var g = La(a, b, d, e);
    -1 < g ? (b = a[g], c || (b.fa = false)) : (b = new Ia(b, this.src, f, !!d, e), b.fa = c, a.push(b));
    return b;
  };
  function Ma(a, b) {
    var c = b.type;
    if (c in a.g) {
      var d = a.g[c], e = Array.prototype.indexOf.call(d, b, undefined), f;
      (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
      f && (Ja(b), a.g[c].length == 0 && (delete a.g[c], a.h--));
    }
  }
  function La(a, b, c, d) {
    for (var e = 0;e < a.length; ++e) {
      var f = a[e];
      if (!f.da && f.listener == b && f.capture == !!c && f.ha == d)
        return e;
    }
    return -1;
  }
  var Na = "closure_lm_" + (1e6 * Math.random() | 0), Oa = {};
  function Qa(a, b, c, d, e) {
    if (d && d.once)
      return Ra(a, b, c, d, e);
    if (Array.isArray(b)) {
      for (var f = 0;f < b.length; f++)
        Qa(a, b[f], c, d, e);
      return null;
    }
    c = Sa(c);
    return a && a[D] ? a.K(b, c, n(d) ? !!d.capture : !!d, e) : Ta(a, b, c, false, d, e);
  }
  function Ta(a, b, c, d, e, f) {
    if (!b)
      throw Error("Invalid event type");
    var g = n(e) ? !!e.capture : !!e, m = Ua(a);
    m || (a[Na] = m = new Ka(a));
    c = m.add(b, c, d, g, f);
    if (c.proxy)
      return c;
    d = Va();
    c.proxy = d;
    d.src = a;
    d.listener = c;
    if (a.addEventListener)
      Fa || (e = g), e === undefined && (e = false), a.addEventListener(b.toString(), d, e);
    else if (a.attachEvent)
      a.attachEvent(Wa(b.toString()), d);
    else if (a.addListener && a.removeListener)
      a.addListener(d);
    else
      throw Error("addEventListener and attachEvent are unavailable.");
    return c;
  }
  function Va() {
    function a(c) {
      return b.call(a.src, a.listener, c);
    }
    const b = Xa;
    return a;
  }
  function Ra(a, b, c, d, e) {
    if (Array.isArray(b)) {
      for (var f = 0;f < b.length; f++)
        Ra(a, b[f], c, d, e);
      return null;
    }
    c = Sa(c);
    return a && a[D] ? a.L(b, c, n(d) ? !!d.capture : !!d, e) : Ta(a, b, c, true, d, e);
  }
  function Ya(a, b, c, d, e) {
    if (Array.isArray(b))
      for (var f = 0;f < b.length; f++)
        Ya(a, b[f], c, d, e);
    else
      (d = n(d) ? !!d.capture : !!d, c = Sa(c), a && a[D]) ? (a = a.i, b = String(b).toString(), (b in a.g) && (f = a.g[b], c = La(f, c, d, e), -1 < c && (Ja(f[c]), Array.prototype.splice.call(f, c, 1), f.length == 0 && (delete a.g[b], a.h--)))) : a && (a = Ua(a)) && (b = a.g[b.toString()], a = -1, b && (a = La(b, c, d, e)), (c = -1 < a ? b[a] : null) && Za(c));
  }
  function Za(a) {
    if (typeof a !== "number" && a && !a.da) {
      var b = a.src;
      if (b && b[D])
        Ma(b.i, a);
      else {
        var { type: c, proxy: d } = a;
        b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(Wa(c), d) : b.addListener && b.removeListener && b.removeListener(d);
        (c = Ua(b)) ? (Ma(c, a), c.h == 0 && (c.src = null, b[Na] = null)) : Ja(a);
      }
    }
  }
  function Wa(a) {
    return a in Oa ? Oa[a] : Oa[a] = "on" + a;
  }
  function Xa(a, b) {
    if (a.da)
      a = true;
    else {
      b = new C(b, this);
      var c = a.listener, d = a.ha || a.src;
      a.fa && Za(a);
      a = c.call(d, b);
    }
    return a;
  }
  function Ua(a) {
    a = a[Na];
    return a instanceof Ka ? a : null;
  }
  var $a = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
  function Sa(a) {
    if (typeof a === "function")
      return a;
    a[$a] || (a[$a] = function(b) {
      return a.handleEvent(b);
    });
    return a[$a];
  }
  function E() {
    z.call(this);
    this.i = new Ka(this);
    this.M = this;
    this.F = null;
  }
  r(E, z);
  E.prototype[D] = true;
  E.prototype.removeEventListener = function(a, b, c, d) {
    Ya(this, a, b, c, d);
  };
  function F(a, b) {
    var c, d = a.F;
    if (d)
      for (c = [];d; d = d.F)
        c.push(d);
    a = a.M;
    d = b.type || b;
    if (typeof b === "string")
      b = new A(b, a);
    else if (b instanceof A)
      b.target = b.target || a;
    else {
      var e = b;
      b = new A(d, a);
      ua(b, e);
    }
    e = true;
    if (c)
      for (var f = c.length - 1;0 <= f; f--) {
        var g = b.g = c[f];
        e = ab(g, d, true, b) && e;
      }
    g = b.g = a;
    e = ab(g, d, true, b) && e;
    e = ab(g, d, false, b) && e;
    if (c)
      for (f = 0;f < c.length; f++)
        g = b.g = c[f], e = ab(g, d, false, b) && e;
  }
  E.prototype.N = function() {
    E.aa.N.call(this);
    if (this.i) {
      var a = this.i, c;
      for (c in a.g) {
        for (var d = a.g[c], e = 0;e < d.length; e++)
          Ja(d[e]);
        delete a.g[c];
        a.h--;
      }
    }
    this.F = null;
  };
  E.prototype.K = function(a, b, c, d) {
    return this.i.add(String(a), b, false, c, d);
  };
  E.prototype.L = function(a, b, c, d) {
    return this.i.add(String(a), b, true, c, d);
  };
  function ab(a, b, c, d) {
    b = a.i.g[String(b)];
    if (!b)
      return true;
    b = b.concat();
    for (var e = true, f = 0;f < b.length; ++f) {
      var g = b[f];
      if (g && !g.da && g.capture == c) {
        var m = g.listener, q = g.ha || g.src;
        g.fa && Ma(a.i, g);
        e = m.call(q, d) !== false && e;
      }
    }
    return e && !d.defaultPrevented;
  }
  function bb(a, b, c) {
    if (typeof a === "function")
      c && (a = p(a, c));
    else if (a && typeof a.handleEvent == "function")
      a = p(a.handleEvent, a);
    else
      throw Error("Invalid listener argument");
    return 2147483647 < Number(b) ? -1 : k.setTimeout(a, b || 0);
  }
  function cb(a) {
    a.g = bb(() => {
      a.g = null;
      a.i && (a.i = false, cb(a));
    }, a.l);
    const b = a.h;
    a.h = null;
    a.m.apply(null, b);
  }

  class eb extends z {
    constructor(a, b) {
      super();
      this.m = a;
      this.l = b;
      this.h = null;
      this.i = false;
      this.g = null;
    }
    j(a) {
      this.h = arguments;
      this.g ? this.i = true : cb(this);
    }
    N() {
      super.N();
      this.g && (k.clearTimeout(this.g), this.g = null, this.i = false, this.h = null);
    }
  }
  function G(a) {
    z.call(this);
    this.h = a;
    this.g = {};
  }
  r(G, z);
  var fb = [];
  function gb(a) {
    qa(a.g, function(b, c) {
      this.g.hasOwnProperty(c) && Za(b);
    }, a);
    a.g = {};
  }
  G.prototype.N = function() {
    G.aa.N.call(this);
    gb(this);
  };
  G.prototype.handleEvent = function() {
    throw Error("EventHandler.handleEvent not implemented");
  };
  var hb = k.JSON.stringify;
  var ib = k.JSON.parse;
  var jb = class {
    stringify(a) {
      return k.JSON.stringify(a, undefined);
    }
    parse(a) {
      return k.JSON.parse(a, undefined);
    }
  };
  function kb() {
  }
  kb.prototype.h = null;
  function lb(a) {
    return a.h || (a.h = a.i());
  }
  function mb() {
  }
  var H = { OPEN: "a", kb: "b", Ja: "c", wb: "d" };
  function nb() {
    A.call(this, "d");
  }
  r(nb, A);
  function ob() {
    A.call(this, "c");
  }
  r(ob, A);
  var I = {}, pb = null;
  function qb() {
    return pb = pb || new E;
  }
  I.La = "serverreachability";
  function rb(a) {
    A.call(this, I.La, a);
  }
  r(rb, A);
  function J(a) {
    const b = qb();
    F(b, new rb(b));
  }
  I.STAT_EVENT = "statevent";
  function sb(a, b) {
    A.call(this, I.STAT_EVENT, a);
    this.stat = b;
  }
  r(sb, A);
  function K(a) {
    const b = qb();
    F(b, new sb(b, a));
  }
  I.Ma = "timingevent";
  function tb(a, b) {
    A.call(this, I.Ma, a);
    this.size = b;
  }
  r(tb, A);
  function ub(a, b) {
    if (typeof a !== "function")
      throw Error("Fn must not be null and must be a function");
    return k.setTimeout(function() {
      a();
    }, b);
  }
  function vb() {
    this.g = true;
  }
  vb.prototype.xa = function() {
    this.g = false;
  };
  function wb(a, b, c, d, e, f) {
    a.info(function() {
      if (a.g)
        if (f) {
          var g = "";
          for (var m = f.split("&"), q = 0;q < m.length; q++) {
            var l = m[q].split("=");
            if (1 < l.length) {
              var v = l[0];
              l = l[1];
              var w = v.split("_");
              g = 2 <= w.length && w[1] == "type" ? g + (v + "=" + l + "&") : g + (v + "=redacted&");
            }
          }
        } else
          g = null;
      else
        g = f;
      return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b + "\n" + c + "\n" + g;
    });
  }
  function xb(a, b, c, d, e, f, g) {
    a.info(function() {
      return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b + "\n" + c + "\n" + f + " " + g;
    });
  }
  function L(a, b, c, d) {
    a.info(function() {
      return "XMLHTTP TEXT (" + b + "): " + yb(a, c) + (d ? " " + d : "");
    });
  }
  function zb(a, b) {
    a.info(function() {
      return "TIMEOUT: " + b;
    });
  }
  vb.prototype.info = function() {
  };
  function yb(a, b) {
    if (!a.g)
      return b;
    if (!b)
      return null;
    try {
      var c = JSON.parse(b);
      if (c) {
        for (a = 0;a < c.length; a++)
          if (Array.isArray(c[a])) {
            var d = c[a];
            if (!(2 > d.length)) {
              var e = d[1];
              if (Array.isArray(e) && !(1 > e.length)) {
                var f = e[0];
                if (f != "noop" && f != "stop" && f != "close")
                  for (var g = 1;g < e.length; g++)
                    e[g] = "";
              }
            }
          }
      }
      return hb(c);
    } catch (m) {
      return b;
    }
  }
  var Ab = { NO_ERROR: 0, gb: 1, tb: 2, sb: 3, nb: 4, rb: 5, ub: 6, Ia: 7, TIMEOUT: 8, xb: 9 };
  var Bb = { lb: "complete", Hb: "success", Ja: "error", Ia: "abort", zb: "ready", Ab: "readystatechange", TIMEOUT: "timeout", vb: "incrementaldata", yb: "progress", ob: "downloadprogress", Pb: "uploadprogress" };
  var Cb;
  function Db() {
  }
  r(Db, kb);
  Db.prototype.g = function() {
    return new XMLHttpRequest;
  };
  Db.prototype.i = function() {
    return {};
  };
  Cb = new Db;
  function M(a, b, c, d) {
    this.j = a;
    this.i = b;
    this.l = c;
    this.R = d || 1;
    this.U = new G(this);
    this.I = 45000;
    this.H = null;
    this.o = false;
    this.m = this.A = this.v = this.L = this.F = this.S = this.B = null;
    this.D = [];
    this.g = null;
    this.C = 0;
    this.s = this.u = null;
    this.X = -1;
    this.J = false;
    this.O = 0;
    this.M = null;
    this.W = this.K = this.T = this.P = false;
    this.h = new Eb;
  }
  function Eb() {
    this.i = null;
    this.g = "";
    this.h = false;
  }
  var Fb = {}, Gb = {};
  function Hb(a, b, c) {
    a.L = 1;
    a.v = Ib(N(b));
    a.m = c;
    a.P = true;
    Jb(a, null);
  }
  function Jb(a, b) {
    a.F = Date.now();
    Kb(a);
    a.A = N(a.v);
    var { A: c, R: d } = a;
    Array.isArray(d) || (d = [String(d)]);
    Lb(c.i, "t", d);
    a.C = 0;
    c = a.j.J;
    a.h = new Eb;
    a.g = Mb(a.j, c ? b : null, !a.m);
    0 < a.O && (a.M = new eb(p(a.Y, a, a.g), a.O));
    b = a.U;
    c = a.g;
    d = a.ca;
    var e = "readystatechange";
    Array.isArray(e) || (e && (fb[0] = e.toString()), e = fb);
    for (var f = 0;f < e.length; f++) {
      var g = Qa(c, e[f], d || b.handleEvent, false, b.h || b);
      if (!g)
        break;
      b.g[g.key] = g;
    }
    b = a.H ? sa(a.H) : {};
    a.m ? (a.u || (a.u = "POST"), b["Content-Type"] = "application/x-www-form-urlencoded", a.g.ea(a.A, a.u, a.m, b)) : (a.u = "GET", a.g.ea(a.A, a.u, null, b));
    J();
    wb(a.i, a.u, a.A, a.l, a.R, a.m);
  }
  M.prototype.ca = function(a) {
    a = a.target;
    const b = this.M;
    b && P(a) == 3 ? b.j() : this.Y(a);
  };
  M.prototype.Y = function(a) {
    try {
      if (a == this.g)
        a: {
          const w = P(this.g);
          var b = this.g.Ba();
          const O = this.g.Z();
          if (!(3 > w) && (w != 3 || this.g && (this.h.h || this.g.oa() || Nb(this.g)))) {
            this.J || w != 4 || b == 7 || (b == 8 || 0 >= O ? J(3) : J(2));
            Ob(this);
            var c = this.g.Z();
            this.X = c;
            b:
              if (Pb(this)) {
                var d = Nb(this.g);
                a = "";
                var e = d.length, f = P(this.g) == 4;
                if (!this.h.i) {
                  if (typeof TextDecoder === "undefined") {
                    Q(this);
                    Qb(this);
                    var g = "";
                    break b;
                  }
                  this.h.i = new k.TextDecoder;
                }
                for (b = 0;b < e; b++)
                  this.h.h = true, a += this.h.i.decode(d[b], { stream: !(f && b == e - 1) });
                d.length = 0;
                this.h.g += a;
                this.C = 0;
                g = this.h.g;
              } else
                g = this.g.oa();
            this.o = c == 200;
            xb(this.i, this.u, this.A, this.l, this.R, w, c);
            if (this.o) {
              if (this.T && !this.K) {
                b: {
                  if (this.g) {
                    var m, q = this.g;
                    if ((m = q.g ? q.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !t(m)) {
                      var l = m;
                      break b;
                    }
                  }
                  l = null;
                }
                if (c = l)
                  L(this.i, this.l, c, "Initial handshake response via X-HTTP-Initial-Response"), this.K = true, Rb(this, c);
                else {
                  this.o = false;
                  this.s = 3;
                  K(12);
                  Q(this);
                  Qb(this);
                  break a;
                }
              }
              if (this.P) {
                c = true;
                let B;
                for (;!this.J && this.C < g.length; )
                  if (B = Sb(this, g), B == Gb) {
                    w == 4 && (this.s = 4, K(14), c = false);
                    L(this.i, this.l, null, "[Incomplete Response]");
                    break;
                  } else if (B == Fb) {
                    this.s = 4;
                    K(15);
                    L(this.i, this.l, g, "[Invalid Chunk]");
                    c = false;
                    break;
                  } else
                    L(this.i, this.l, B, null), Rb(this, B);
                Pb(this) && this.C != 0 && (this.h.g = this.h.g.slice(this.C), this.C = 0);
                w != 4 || g.length != 0 || this.h.h || (this.s = 1, K(16), c = false);
                this.o = this.o && c;
                if (!c)
                  L(this.i, this.l, g, "[Invalid Chunked Response]"), Q(this), Qb(this);
                else if (0 < g.length && !this.W) {
                  this.W = true;
                  var v = this.j;
                  v.g == this && v.ba && !v.M && (v.j.info("Great, no buffering proxy detected. Bytes received: " + g.length), Tb(v), v.M = true, K(11));
                }
              } else
                L(this.i, this.l, g, null), Rb(this, g);
              w == 4 && Q(this);
              this.o && !this.J && (w == 4 ? Ub(this.j, this) : (this.o = false, Kb(this)));
            } else
              Vb(this.g), c == 400 && 0 < g.indexOf("Unknown SID") ? (this.s = 3, K(12)) : (this.s = 0, K(13)), Q(this), Qb(this);
          }
        }
    } catch (w) {
    } finally {
    }
  };
  function Pb(a) {
    return a.g ? a.u == "GET" && a.L != 2 && a.j.Ca : false;
  }
  function Sb(a, b) {
    var c = a.C, d = b.indexOf("\n", c);
    if (d == -1)
      return Gb;
    c = Number(b.substring(c, d));
    if (isNaN(c))
      return Fb;
    d += 1;
    if (d + c > b.length)
      return Gb;
    b = b.slice(d, d + c);
    a.C = d + c;
    return b;
  }
  M.prototype.cancel = function() {
    this.J = true;
    Q(this);
  };
  function Kb(a) {
    a.S = Date.now() + a.I;
    Wb(a, a.I);
  }
  function Wb(a, b) {
    if (a.B != null)
      throw Error("WatchDog timer not null");
    a.B = ub(p(a.ba, a), b);
  }
  function Ob(a) {
    a.B && (k.clearTimeout(a.B), a.B = null);
  }
  M.prototype.ba = function() {
    this.B = null;
    const a = Date.now();
    0 <= a - this.S ? (zb(this.i, this.A), this.L != 2 && (J(), K(17)), Q(this), this.s = 2, Qb(this)) : Wb(this, this.S - a);
  };
  function Qb(a) {
    a.j.G == 0 || a.J || Ub(a.j, a);
  }
  function Q(a) {
    Ob(a);
    var b = a.M;
    b && typeof b.ma == "function" && b.ma();
    a.M = null;
    gb(a.U);
    a.g && (b = a.g, a.g = null, b.abort(), b.ma());
  }
  function Rb(a, b) {
    try {
      var c = a.j;
      if (c.G != 0 && (c.g == a || Xb(c.h, a))) {
        if (!a.K && Xb(c.h, a) && c.G == 3) {
          try {
            var d = c.Da.g.parse(b);
          } catch (l) {
            d = null;
          }
          if (Array.isArray(d) && d.length == 3) {
            var e = d;
            if (e[0] == 0)
              a: {
                if (!c.u) {
                  if (c.g)
                    if (c.g.F + 3000 < a.F)
                      Yb(c), Zb(c);
                    else
                      break a;
                  $b(c);
                  K(18);
                }
              }
            else
              c.za = e[1], 0 < c.za - c.T && 37500 > e[2] && c.F && c.v == 0 && !c.C && (c.C = ub(p(c.Za, c), 6000));
            if (1 >= ac(c.h) && c.ca) {
              try {
                c.ca();
              } catch (l) {
              }
              c.ca = undefined;
            }
          } else
            R(c, 11);
        } else if ((a.K || c.g == a) && Yb(c), !t(b))
          for (e = c.Da.g.parse(b), b = 0;b < e.length; b++) {
            let l = e[b];
            c.T = l[0];
            l = l[1];
            if (c.G == 2)
              if (l[0] == "c") {
                c.K = l[1];
                c.ia = l[2];
                const v = l[3];
                v != null && (c.la = v, c.j.info("VER=" + c.la));
                const w = l[4];
                w != null && (c.Aa = w, c.j.info("SVER=" + c.Aa));
                const O = l[5];
                O != null && typeof O === "number" && 0 < O && (d = 1.5 * O, c.L = d, c.j.info("backChannelRequestTimeoutMs_=" + d));
                d = c;
                const B = a.g;
                if (B) {
                  const ya = B.g ? B.g.getResponseHeader("X-Client-Wire-Protocol") : null;
                  if (ya) {
                    var f = d.h;
                    f.g || ya.indexOf("spdy") == -1 && ya.indexOf("quic") == -1 && ya.indexOf("h2") == -1 || (f.j = f.l, f.g = new Set, f.h && (bc(f, f.h), f.h = null));
                  }
                  if (d.D) {
                    const db = B.g ? B.g.getResponseHeader("X-HTTP-Session-Id") : null;
                    db && (d.ya = db, S(d.I, d.D, db));
                  }
                }
                c.G = 3;
                c.l && c.l.ua();
                c.ba && (c.R = Date.now() - a.F, c.j.info("Handshake RTT: " + c.R + "ms"));
                d = c;
                var g = a;
                d.qa = cc(d, d.J ? d.ia : null, d.W);
                if (g.K) {
                  dc(d.h, g);
                  var m = g, q = d.L;
                  q && (m.I = q);
                  m.B && (Ob(m), Kb(m));
                  d.g = g;
                } else
                  ec(d);
                0 < c.i.length && fc(c);
              } else
                l[0] != "stop" && l[0] != "close" || R(c, 7);
            else
              c.G == 3 && (l[0] == "stop" || l[0] == "close" ? l[0] == "stop" ? R(c, 7) : gc(c) : l[0] != "noop" && c.l && c.l.ta(l), c.v = 0);
          }
      }
      J(4);
    } catch (l) {
    }
  }
  var hc = class {
    constructor(a, b) {
      this.g = a;
      this.map = b;
    }
  };
  function ic(a) {
    this.l = a || 10;
    k.PerformanceNavigationTiming ? (a = k.performance.getEntriesByType("navigation"), a = 0 < a.length && (a[0].nextHopProtocol == "hq" || a[0].nextHopProtocol == "h2")) : a = !!(k.chrome && k.chrome.loadTimes && k.chrome.loadTimes() && k.chrome.loadTimes().wasFetchedViaSpdy);
    this.j = a ? this.l : 1;
    this.g = null;
    1 < this.j && (this.g = new Set);
    this.h = null;
    this.i = [];
  }
  function jc(a) {
    return a.h ? true : a.g ? a.g.size >= a.j : false;
  }
  function ac(a) {
    return a.h ? 1 : a.g ? a.g.size : 0;
  }
  function Xb(a, b) {
    return a.h ? a.h == b : a.g ? a.g.has(b) : false;
  }
  function bc(a, b) {
    a.g ? a.g.add(b) : a.h = b;
  }
  function dc(a, b) {
    a.h && a.h == b ? a.h = null : a.g && a.g.has(b) && a.g.delete(b);
  }
  ic.prototype.cancel = function() {
    this.i = kc(this);
    if (this.h)
      this.h.cancel(), this.h = null;
    else if (this.g && this.g.size !== 0) {
      for (const a of this.g.values())
        a.cancel();
      this.g.clear();
    }
  };
  function kc(a) {
    if (a.h != null)
      return a.i.concat(a.h.D);
    if (a.g != null && a.g.size !== 0) {
      let b = a.i;
      for (const c of a.g.values())
        b = b.concat(c.D);
      return b;
    }
    return la(a.i);
  }
  function lc(a) {
    if (a.V && typeof a.V == "function")
      return a.V();
    if (typeof Map !== "undefined" && a instanceof Map || typeof Set !== "undefined" && a instanceof Set)
      return Array.from(a.values());
    if (typeof a === "string")
      return a.split("");
    if (ha(a)) {
      for (var b = [], c = a.length, d = 0;d < c; d++)
        b.push(a[d]);
      return b;
    }
    b = [];
    c = 0;
    for (d in a)
      b[c++] = a[d];
    return b;
  }
  function mc(a) {
    if (a.na && typeof a.na == "function")
      return a.na();
    if (!a.V || typeof a.V != "function") {
      if (typeof Map !== "undefined" && a instanceof Map)
        return Array.from(a.keys());
      if (!(typeof Set !== "undefined" && a instanceof Set)) {
        if (ha(a) || typeof a === "string") {
          var b = [];
          a = a.length;
          for (var c = 0;c < a; c++)
            b.push(c);
          return b;
        }
        b = [];
        c = 0;
        for (const d in a)
          b[c++] = d;
        return b;
      }
    }
  }
  function nc(a, b) {
    if (a.forEach && typeof a.forEach == "function")
      a.forEach(b, undefined);
    else if (ha(a) || typeof a === "string")
      Array.prototype.forEach.call(a, b, undefined);
    else
      for (var c = mc(a), d = lc(a), e = d.length, f = 0;f < e; f++)
        b.call(undefined, d[f], c && c[f], a);
  }
  var oc = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
  function pc(a, b) {
    if (a) {
      a = a.split("&");
      for (var c = 0;c < a.length; c++) {
        var d = a[c].indexOf("="), e = null;
        if (0 <= d) {
          var f = a[c].substring(0, d);
          e = a[c].substring(d + 1);
        } else
          f = a[c];
        b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
      }
    }
  }
  function T(a) {
    this.g = this.o = this.j = "";
    this.s = null;
    this.m = this.l = "";
    this.h = false;
    if (a instanceof T) {
      this.h = a.h;
      qc(this, a.j);
      this.o = a.o;
      this.g = a.g;
      rc(this, a.s);
      this.l = a.l;
      var b = a.i;
      var c = new sc;
      c.i = b.i;
      b.g && (c.g = new Map(b.g), c.h = b.h);
      tc(this, c);
      this.m = a.m;
    } else
      a && (b = String(a).match(oc)) ? (this.h = false, qc(this, b[1] || "", true), this.o = uc(b[2] || ""), this.g = uc(b[3] || "", true), rc(this, b[4]), this.l = uc(b[5] || "", true), tc(this, b[6] || "", true), this.m = uc(b[7] || "")) : (this.h = false, this.i = new sc(null, this.h));
  }
  T.prototype.toString = function() {
    var a = [], b = this.j;
    b && a.push(vc(b, wc, true), ":");
    var c = this.g;
    if (c || b == "file")
      a.push("//"), (b = this.o) && a.push(vc(b, wc, true), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.s, c != null && a.push(":", String(c));
    if (c = this.l)
      this.g && c.charAt(0) != "/" && a.push("/"), a.push(vc(c, c.charAt(0) == "/" ? xc : yc, true));
    (c = this.i.toString()) && a.push("?", c);
    (c = this.m) && a.push("#", vc(c, zc));
    return a.join("");
  };
  function N(a) {
    return new T(a);
  }
  function qc(a, b, c) {
    a.j = c ? uc(b, true) : b;
    a.j && (a.j = a.j.replace(/:$/, ""));
  }
  function rc(a, b) {
    if (b) {
      b = Number(b);
      if (isNaN(b) || 0 > b)
        throw Error("Bad port number " + b);
      a.s = b;
    } else
      a.s = null;
  }
  function tc(a, b, c) {
    b instanceof sc ? (a.i = b, Ac(a.i, a.h)) : (c || (b = vc(b, Bc)), a.i = new sc(b, a.h));
  }
  function S(a, b, c) {
    a.i.set(b, c);
  }
  function Ib(a) {
    S(a, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36));
    return a;
  }
  function uc(a, b) {
    return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
  }
  function vc(a, b, c) {
    return typeof a === "string" ? (a = encodeURI(a).replace(b, Cc), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
  }
  function Cc(a) {
    a = a.charCodeAt(0);
    return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
  }
  var wc = /[#\/\?@]/g, yc = /[#\?:]/g, xc = /[#\?]/g, Bc = /[#\?@]/g, zc = /#/g;
  function sc(a, b) {
    this.h = this.g = null;
    this.i = a || null;
    this.j = !!b;
  }
  function U(a) {
    a.g || (a.g = new Map, a.h = 0, a.i && pc(a.i, function(b, c) {
      a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
    }));
  }
  h = sc.prototype;
  h.add = function(a, b) {
    U(this);
    this.i = null;
    a = V(this, a);
    var c = this.g.get(a);
    c || this.g.set(a, c = []);
    c.push(b);
    this.h += 1;
    return this;
  };
  function Dc(a, b) {
    U(a);
    b = V(a, b);
    a.g.has(b) && (a.i = null, a.h -= a.g.get(b).length, a.g.delete(b));
  }
  function Ec(a, b) {
    U(a);
    b = V(a, b);
    return a.g.has(b);
  }
  h.forEach = function(a, b) {
    U(this);
    this.g.forEach(function(c, d) {
      c.forEach(function(e) {
        a.call(b, e, d, this);
      }, this);
    }, this);
  };
  h.na = function() {
    U(this);
    const a = Array.from(this.g.values()), b = Array.from(this.g.keys()), c = [];
    for (let d = 0;d < b.length; d++) {
      const e = a[d];
      for (let f = 0;f < e.length; f++)
        c.push(b[d]);
    }
    return c;
  };
  h.V = function(a) {
    U(this);
    let b = [];
    if (typeof a === "string")
      Ec(this, a) && (b = b.concat(this.g.get(V(this, a))));
    else {
      a = Array.from(this.g.values());
      for (let c = 0;c < a.length; c++)
        b = b.concat(a[c]);
    }
    return b;
  };
  h.set = function(a, b) {
    U(this);
    this.i = null;
    a = V(this, a);
    Ec(this, a) && (this.h -= this.g.get(a).length);
    this.g.set(a, [b]);
    this.h += 1;
    return this;
  };
  h.get = function(a, b) {
    if (!a)
      return b;
    a = this.V(a);
    return 0 < a.length ? String(a[0]) : b;
  };
  function Lb(a, b, c) {
    Dc(a, b);
    0 < c.length && (a.i = null, a.g.set(V(a, b), la(c)), a.h += c.length);
  }
  h.toString = function() {
    if (this.i)
      return this.i;
    if (!this.g)
      return "";
    const a = [], b = Array.from(this.g.keys());
    for (var c = 0;c < b.length; c++) {
      var d = b[c];
      const f = encodeURIComponent(String(d)), g = this.V(d);
      for (d = 0;d < g.length; d++) {
        var e = f;
        g[d] !== "" && (e += "=" + encodeURIComponent(String(g[d])));
        a.push(e);
      }
    }
    return this.i = a.join("&");
  };
  function V(a, b) {
    b = String(b);
    a.j && (b = b.toLowerCase());
    return b;
  }
  function Ac(a, b) {
    b && !a.j && (U(a), a.i = null, a.g.forEach(function(c, d) {
      var e = d.toLowerCase();
      d != e && (Dc(this, d), Lb(this, e, c));
    }, a));
    a.j = b;
  }
  function Fc(a, b) {
    const c = new vb;
    if (k.Image) {
      const d = new Image;
      d.onload = ka(W, c, "TestLoadImage: loaded", true, b, d);
      d.onerror = ka(W, c, "TestLoadImage: error", false, b, d);
      d.onabort = ka(W, c, "TestLoadImage: abort", false, b, d);
      d.ontimeout = ka(W, c, "TestLoadImage: timeout", false, b, d);
      k.setTimeout(function() {
        if (d.ontimeout)
          d.ontimeout();
      }, 1e4);
      d.src = a;
    } else
      b(false);
  }
  function Gc(a, b) {
    const c = new vb, d = new AbortController, e = setTimeout(() => {
      d.abort();
      W(c, "TestPingServer: timeout", false, b);
    }, 1e4);
    fetch(a, { signal: d.signal }).then((f) => {
      clearTimeout(e);
      f.ok ? W(c, "TestPingServer: ok", true, b) : W(c, "TestPingServer: server error", false, b);
    }).catch(() => {
      clearTimeout(e);
      W(c, "TestPingServer: error", false, b);
    });
  }
  function W(a, b, c, d, e) {
    try {
      e && (e.onload = null, e.onerror = null, e.onabort = null, e.ontimeout = null), d(c);
    } catch (f) {
    }
  }
  function Hc() {
    this.g = new jb;
  }
  function Ic(a, b, c) {
    const d = c || "";
    try {
      nc(a, function(e, f) {
        let g = e;
        n(e) && (g = hb(e));
        b.push(d + f + "=" + encodeURIComponent(g));
      });
    } catch (e) {
      throw b.push(d + "type=" + encodeURIComponent("_badmap")), e;
    }
  }
  function Jc(a) {
    this.l = a.Ub || null;
    this.j = a.eb || false;
  }
  r(Jc, kb);
  Jc.prototype.g = function() {
    return new Kc(this.l, this.j);
  };
  Jc.prototype.i = function(a) {
    return function() {
      return a;
    };
  }({});
  function Kc(a, b) {
    E.call(this);
    this.D = a;
    this.o = b;
    this.m = undefined;
    this.status = this.readyState = 0;
    this.responseType = this.responseText = this.response = this.statusText = "";
    this.onreadystatechange = null;
    this.u = new Headers;
    this.h = null;
    this.B = "GET";
    this.A = "";
    this.g = false;
    this.v = this.j = this.l = null;
  }
  r(Kc, E);
  h = Kc.prototype;
  h.open = function(a, b) {
    if (this.readyState != 0)
      throw this.abort(), Error("Error reopening a connection");
    this.B = a;
    this.A = b;
    this.readyState = 1;
    Lc(this);
  };
  h.send = function(a) {
    if (this.readyState != 1)
      throw this.abort(), Error("need to call open() first. ");
    this.g = true;
    const b = { headers: this.u, method: this.B, credentials: this.m, cache: undefined };
    a && (b.body = a);
    (this.D || k).fetch(new Request(this.A, b)).then(this.Sa.bind(this), this.ga.bind(this));
  };
  h.abort = function() {
    this.response = this.responseText = "";
    this.u = new Headers;
    this.status = 0;
    this.j && this.j.cancel("Request was aborted.").catch(() => {
    });
    1 <= this.readyState && this.g && this.readyState != 4 && (this.g = false, Mc(this));
    this.readyState = 0;
  };
  h.Sa = function(a) {
    if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, Lc(this)), this.g && (this.readyState = 3, Lc(this), this.g)))
      if (this.responseType === "arraybuffer")
        a.arrayBuffer().then(this.Qa.bind(this), this.ga.bind(this));
      else if (typeof k.ReadableStream !== "undefined" && "body" in a) {
        this.j = a.body.getReader();
        if (this.o) {
          if (this.responseType)
            throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
          this.response = [];
        } else
          this.response = this.responseText = "", this.v = new TextDecoder;
        Nc(this);
      } else
        a.text().then(this.Ra.bind(this), this.ga.bind(this));
  };
  function Nc(a) {
    a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a));
  }
  h.Pa = function(a) {
    if (this.g) {
      if (this.o && a.value)
        this.response.push(a.value);
      else if (!this.o) {
        var b = a.value ? a.value : new Uint8Array(0);
        if (b = this.v.decode(b, { stream: !a.done }))
          this.response = this.responseText += b;
      }
      a.done ? Mc(this) : Lc(this);
      this.readyState == 3 && Nc(this);
    }
  };
  h.Ra = function(a) {
    this.g && (this.response = this.responseText = a, Mc(this));
  };
  h.Qa = function(a) {
    this.g && (this.response = a, Mc(this));
  };
  h.ga = function() {
    this.g && Mc(this);
  };
  function Mc(a) {
    a.readyState = 4;
    a.l = null;
    a.j = null;
    a.v = null;
    Lc(a);
  }
  h.setRequestHeader = function(a, b) {
    this.u.append(a, b);
  };
  h.getResponseHeader = function(a) {
    return this.h ? this.h.get(a.toLowerCase()) || "" : "";
  };
  h.getAllResponseHeaders = function() {
    if (!this.h)
      return "";
    const a = [], b = this.h.entries();
    for (var c = b.next();!c.done; )
      c = c.value, a.push(c[0] + ": " + c[1]), c = b.next();
    return a.join("\r\n");
  };
  function Lc(a) {
    a.onreadystatechange && a.onreadystatechange.call(a);
  }
  Object.defineProperty(Kc.prototype, "withCredentials", { get: function() {
    return this.m === "include";
  }, set: function(a) {
    this.m = a ? "include" : "same-origin";
  } });
  function Oc(a) {
    let b = "";
    qa(a, function(c, d) {
      b += d;
      b += ":";
      b += c;
      b += "\r\n";
    });
    return b;
  }
  function Pc(a, b, c) {
    a: {
      for (d in c) {
        var d = false;
        break a;
      }
      d = true;
    }
    d || (c = Oc(c), typeof a === "string" ? c != null && encodeURIComponent(String(c)) : S(a, b, c));
  }
  function X(a) {
    E.call(this);
    this.headers = new Map;
    this.o = a || null;
    this.h = false;
    this.v = this.g = null;
    this.D = "";
    this.m = 0;
    this.l = "";
    this.j = this.B = this.u = this.A = false;
    this.I = null;
    this.H = "";
    this.J = false;
  }
  r(X, E);
  var Qc = /^https?$/i, Rc = ["POST", "PUT"];
  h = X.prototype;
  h.Ha = function(a) {
    this.J = a;
  };
  h.ea = function(a, b, c, d) {
    if (this.g)
      throw Error("[goog.net.XhrIo] Object is active with another request=" + this.D + "; newUri=" + a);
    b = b ? b.toUpperCase() : "GET";
    this.D = a;
    this.l = "";
    this.m = 0;
    this.A = false;
    this.h = true;
    this.g = this.o ? this.o.g() : Cb.g();
    this.v = this.o ? lb(this.o) : lb(Cb);
    this.g.onreadystatechange = p(this.Ea, this);
    try {
      this.B = true, this.g.open(b, String(a), true), this.B = false;
    } catch (f) {
      Sc(this, f);
      return;
    }
    a = c || "";
    c = new Map(this.headers);
    if (d)
      if (Object.getPrototypeOf(d) === Object.prototype)
        for (var e in d)
          c.set(e, d[e]);
      else if (typeof d.keys === "function" && typeof d.get === "function")
        for (const f of d.keys())
          c.set(f, d.get(f));
      else
        throw Error("Unknown input type for opt_headers: " + String(d));
    d = Array.from(c.keys()).find((f) => f.toLowerCase() == "content-type");
    e = k.FormData && a instanceof k.FormData;
    !(0 <= Array.prototype.indexOf.call(Rc, b, undefined)) || d || e || c.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    for (const [f, g] of c)
      this.g.setRequestHeader(f, g);
    this.H && (this.g.responseType = this.H);
    "withCredentials" in this.g && this.g.withCredentials !== this.J && (this.g.withCredentials = this.J);
    try {
      Tc(this), this.u = true, this.g.send(a), this.u = false;
    } catch (f) {
      Sc(this, f);
    }
  };
  function Sc(a, b) {
    a.h = false;
    a.g && (a.j = true, a.g.abort(), a.j = false);
    a.l = b;
    a.m = 5;
    Uc(a);
    Vc(a);
  }
  function Uc(a) {
    a.A || (a.A = true, F(a, "complete"), F(a, "error"));
  }
  h.abort = function(a) {
    this.g && this.h && (this.h = false, this.j = true, this.g.abort(), this.j = false, this.m = a || 7, F(this, "complete"), F(this, "abort"), Vc(this));
  };
  h.N = function() {
    this.g && (this.h && (this.h = false, this.j = true, this.g.abort(), this.j = false), Vc(this, true));
    X.aa.N.call(this);
  };
  h.Ea = function() {
    this.s || (this.B || this.u || this.j ? Wc(this) : this.bb());
  };
  h.bb = function() {
    Wc(this);
  };
  function Wc(a) {
    if (a.h && typeof fa != "undefined" && (!a.v[1] || P(a) != 4 || a.Z() != 2)) {
      if (a.u && P(a) == 4)
        bb(a.Ea, 0, a);
      else if (F(a, "readystatechange"), P(a) == 4) {
        a.h = false;
        try {
          const g = a.Z();
          a:
            switch (g) {
              case 200:
              case 201:
              case 202:
              case 204:
              case 206:
              case 304:
              case 1223:
                var b = true;
                break a;
              default:
                b = false;
            }
          var c;
          if (!(c = b)) {
            var d;
            if (d = g === 0) {
              var e = String(a.D).match(oc)[1] || null;
              !e && k.self && k.self.location && (e = k.self.location.protocol.slice(0, -1));
              d = !Qc.test(e ? e.toLowerCase() : "");
            }
            c = d;
          }
          if (c)
            F(a, "complete"), F(a, "success");
          else {
            a.m = 6;
            try {
              var f = 2 < P(a) ? a.g.statusText : "";
            } catch (m) {
              f = "";
            }
            a.l = f + " [" + a.Z() + "]";
            Uc(a);
          }
        } finally {
          Vc(a);
        }
      }
    }
  }
  function Vc(a, b) {
    if (a.g) {
      Tc(a);
      const c = a.g, d = a.v[0] ? () => {
      } : null;
      a.g = null;
      a.v = null;
      b || F(a, "ready");
      try {
        c.onreadystatechange = d;
      } catch (e) {
      }
    }
  }
  function Tc(a) {
    a.I && (k.clearTimeout(a.I), a.I = null);
  }
  h.isActive = function() {
    return !!this.g;
  };
  function P(a) {
    return a.g ? a.g.readyState : 0;
  }
  h.Z = function() {
    try {
      return 2 < P(this) ? this.g.status : -1;
    } catch (a) {
      return -1;
    }
  };
  h.oa = function() {
    try {
      return this.g ? this.g.responseText : "";
    } catch (a) {
      return "";
    }
  };
  h.Oa = function(a) {
    if (this.g) {
      var b = this.g.responseText;
      a && b.indexOf(a) == 0 && (b = b.substring(a.length));
      return ib(b);
    }
  };
  function Nb(a) {
    try {
      if (!a.g)
        return null;
      if ("response" in a.g)
        return a.g.response;
      switch (a.H) {
        case "":
        case "text":
          return a.g.responseText;
        case "arraybuffer":
          if ("mozResponseArrayBuffer" in a.g)
            return a.g.mozResponseArrayBuffer;
      }
      return null;
    } catch (b) {
      return null;
    }
  }
  function Vb(a) {
    const b = {};
    a = (a.g && 2 <= P(a) ? a.g.getAllResponseHeaders() || "" : "").split("\r\n");
    for (let d = 0;d < a.length; d++) {
      if (t(a[d]))
        continue;
      var c = va(a[d]);
      const e = c[0];
      c = c[1];
      if (typeof c !== "string")
        continue;
      c = c.trim();
      const f = b[e] || [];
      b[e] = f;
      f.push(c);
    }
    ra(b, function(d) {
      return d.join(", ");
    });
  }
  h.Ba = function() {
    return this.m;
  };
  h.Ka = function() {
    return typeof this.l === "string" ? this.l : String(this.l);
  };
  function Xc(a, b, c) {
    return c && c.internalChannelParams ? c.internalChannelParams[a] || b : b;
  }
  function Yc(a) {
    this.Aa = 0;
    this.i = [];
    this.j = new vb;
    this.ia = this.qa = this.I = this.W = this.g = this.ya = this.D = this.H = this.m = this.S = this.o = null;
    this.Ya = this.U = 0;
    this.Va = Xc("failFast", false, a);
    this.F = this.C = this.u = this.s = this.l = null;
    this.X = true;
    this.za = this.T = -1;
    this.Y = this.v = this.B = 0;
    this.Ta = Xc("baseRetryDelayMs", 5000, a);
    this.cb = Xc("retryDelaySeedMs", 1e4, a);
    this.Wa = Xc("forwardChannelMaxRetries", 2, a);
    this.wa = Xc("forwardChannelRequestTimeoutMs", 20000, a);
    this.pa = a && a.xmlHttpFactory || undefined;
    this.Xa = a && a.Tb || undefined;
    this.Ca = a && a.useFetchStreams || false;
    this.L = undefined;
    this.J = a && a.supportsCrossDomainXhr || false;
    this.K = "";
    this.h = new ic(a && a.concurrentRequestLimit);
    this.Da = new Hc;
    this.P = a && a.fastHandshake || false;
    this.O = a && a.encodeInitMessageHeaders || false;
    this.P && this.O && (this.O = false);
    this.Ua = a && a.Rb || false;
    a && a.xa && this.j.xa();
    a && a.forceLongPolling && (this.X = false);
    this.ba = !this.P && this.X && a && a.detectBufferingProxy || false;
    this.ja = undefined;
    a && a.longPollingTimeout && 0 < a.longPollingTimeout && (this.ja = a.longPollingTimeout);
    this.ca = undefined;
    this.R = 0;
    this.M = false;
    this.ka = this.A = null;
  }
  h = Yc.prototype;
  h.la = 8;
  h.G = 1;
  h.connect = function(a, b, c, d) {
    K(0);
    this.W = a;
    this.H = b || {};
    c && d !== undefined && (this.H.OSID = c, this.H.OAID = d);
    this.F = this.X;
    this.I = cc(this, null, this.W);
    fc(this);
  };
  function gc(a) {
    Zc(a);
    if (a.G == 3) {
      var b = a.U++, c = N(a.I);
      S(c, "SID", a.K);
      S(c, "RID", b);
      S(c, "TYPE", "terminate");
      $c(a, c);
      b = new M(a, a.j, b);
      b.L = 2;
      b.v = Ib(N(c));
      c = false;
      if (k.navigator && k.navigator.sendBeacon)
        try {
          c = k.navigator.sendBeacon(b.v.toString(), "");
        } catch (d) {
        }
      !c && k.Image && (new Image().src = b.v, c = true);
      c || (b.g = Mb(b.j, null), b.g.ea(b.v));
      b.F = Date.now();
      Kb(b);
    }
    ad(a);
  }
  function Zb(a) {
    a.g && (Tb(a), a.g.cancel(), a.g = null);
  }
  function Zc(a) {
    Zb(a);
    a.u && (k.clearTimeout(a.u), a.u = null);
    Yb(a);
    a.h.cancel();
    a.s && (typeof a.s === "number" && k.clearTimeout(a.s), a.s = null);
  }
  function fc(a) {
    if (!jc(a.h) && !a.s) {
      a.s = true;
      var b = a.Ga;
      x || Ea();
      y || (x(), y = true);
      za.add(b, a);
      a.B = 0;
    }
  }
  function bd(a, b) {
    if (ac(a.h) >= a.h.j - (a.s ? 1 : 0))
      return false;
    if (a.s)
      return a.i = b.D.concat(a.i), true;
    if (a.G == 1 || a.G == 2 || a.B >= (a.Va ? 0 : a.Wa))
      return false;
    a.s = ub(p(a.Ga, a, b), cd(a, a.B));
    a.B++;
    return true;
  }
  h.Ga = function(a) {
    if (this.s)
      if (this.s = null, this.G == 1) {
        if (!a) {
          this.U = Math.floor(1e5 * Math.random());
          a = this.U++;
          const e = new M(this, this.j, a);
          let f = this.o;
          this.S && (f ? (f = sa(f), ua(f, this.S)) : f = this.S);
          this.m !== null || this.O || (e.H = f, f = null);
          if (this.P)
            a: {
              var b = 0;
              for (var c = 0;c < this.i.length; c++) {
                b: {
                  var d = this.i[c];
                  if ("__data__" in d.map && (d = d.map.__data__, typeof d === "string")) {
                    d = d.length;
                    break b;
                  }
                  d = undefined;
                }
                if (d === undefined)
                  break;
                b += d;
                if (4096 < b) {
                  b = c;
                  break a;
                }
                if (b === 4096 || c === this.i.length - 1) {
                  b = c + 1;
                  break a;
                }
              }
              b = 1000;
            }
          else
            b = 1000;
          b = dd(this, e, b);
          c = N(this.I);
          S(c, "RID", a);
          S(c, "CVER", 22);
          this.D && S(c, "X-HTTP-Session-Id", this.D);
          $c(this, c);
          f && (this.O ? b = "headers=" + encodeURIComponent(String(Oc(f))) + "&" + b : this.m && Pc(c, this.m, f));
          bc(this.h, e);
          this.Ua && S(c, "TYPE", "init");
          this.P ? (S(c, "$req", b), S(c, "SID", "null"), e.T = true, Hb(e, c, null)) : Hb(e, c, b);
          this.G = 2;
        }
      } else
        this.G == 3 && (a ? ed(this, a) : this.i.length == 0 || jc(this.h) || ed(this));
  };
  function ed(a, b) {
    var c;
    b ? c = b.l : c = a.U++;
    const d = N(a.I);
    S(d, "SID", a.K);
    S(d, "RID", c);
    S(d, "AID", a.T);
    $c(a, d);
    a.m && a.o && Pc(d, a.m, a.o);
    c = new M(a, a.j, c, a.B + 1);
    a.m === null && (c.H = a.o);
    b && (a.i = b.D.concat(a.i));
    b = dd(a, c, 1000);
    c.I = Math.round(0.5 * a.wa) + Math.round(0.5 * a.wa * Math.random());
    bc(a.h, c);
    Hb(c, d, b);
  }
  function $c(a, b) {
    a.H && qa(a.H, function(c, d) {
      S(b, d, c);
    });
    a.l && nc({}, function(c, d) {
      S(b, d, c);
    });
  }
  function dd(a, b, c) {
    c = Math.min(a.i.length, c);
    var d = a.l ? p(a.l.Na, a.l, a) : null;
    a: {
      var e = a.i;
      let f = -1;
      for (;; ) {
        const g = ["count=" + c];
        f == -1 ? 0 < c ? (f = e[0].g, g.push("ofs=" + f)) : f = 0 : g.push("ofs=" + f);
        let m = true;
        for (let q = 0;q < c; q++) {
          let l = e[q].g;
          const v = e[q].map;
          l -= f;
          if (0 > l)
            f = Math.max(0, e[q].g - 100), m = false;
          else
            try {
              Ic(v, g, "req" + l + "_");
            } catch (w) {
              d && d(v);
            }
        }
        if (m) {
          d = g.join("&");
          break a;
        }
      }
    }
    a = a.i.splice(0, c);
    b.D = a;
    return d;
  }
  function ec(a) {
    if (!a.g && !a.u) {
      a.Y = 1;
      var b = a.Fa;
      x || Ea();
      y || (x(), y = true);
      za.add(b, a);
      a.v = 0;
    }
  }
  function $b(a) {
    if (a.g || a.u || 3 <= a.v)
      return false;
    a.Y++;
    a.u = ub(p(a.Fa, a), cd(a, a.v));
    a.v++;
    return true;
  }
  h.Fa = function() {
    this.u = null;
    fd(this);
    if (this.ba && !(this.M || this.g == null || 0 >= this.R)) {
      var a = 2 * this.R;
      this.j.info("BP detection timer enabled: " + a);
      this.A = ub(p(this.ab, this), a);
    }
  };
  h.ab = function() {
    this.A && (this.A = null, this.j.info("BP detection timeout reached."), this.j.info("Buffering proxy detected and switch to long-polling!"), this.F = false, this.M = true, K(10), Zb(this), fd(this));
  };
  function Tb(a) {
    a.A != null && (k.clearTimeout(a.A), a.A = null);
  }
  function fd(a) {
    a.g = new M(a, a.j, "rpc", a.Y);
    a.m === null && (a.g.H = a.o);
    a.g.O = 0;
    var b = N(a.qa);
    S(b, "RID", "rpc");
    S(b, "SID", a.K);
    S(b, "AID", a.T);
    S(b, "CI", a.F ? "0" : "1");
    !a.F && a.ja && S(b, "TO", a.ja);
    S(b, "TYPE", "xmlhttp");
    $c(a, b);
    a.m && a.o && Pc(b, a.m, a.o);
    a.L && (a.g.I = a.L);
    var c = a.g;
    a = a.ia;
    c.L = 1;
    c.v = Ib(N(b));
    c.m = null;
    c.P = true;
    Jb(c, a);
  }
  h.Za = function() {
    this.C != null && (this.C = null, Zb(this), $b(this), K(19));
  };
  function Yb(a) {
    a.C != null && (k.clearTimeout(a.C), a.C = null);
  }
  function Ub(a, b) {
    var c = null;
    if (a.g == b) {
      Yb(a);
      Tb(a);
      a.g = null;
      var d = 2;
    } else if (Xb(a.h, b))
      c = b.D, dc(a.h, b), d = 1;
    else
      return;
    if (a.G != 0) {
      if (b.o)
        if (d == 1) {
          c = b.m ? b.m.length : 0;
          b = Date.now() - b.F;
          var e = a.B;
          d = qb();
          F(d, new tb(d, c));
          fc(a);
        } else
          ec(a);
      else if (e = b.s, e == 3 || e == 0 && 0 < b.X || !(d == 1 && bd(a, b) || d == 2 && $b(a)))
        switch (c && 0 < c.length && (b = a.h, b.i = b.i.concat(c)), e) {
          case 1:
            R(a, 5);
            break;
          case 4:
            R(a, 10);
            break;
          case 3:
            R(a, 6);
            break;
          default:
            R(a, 2);
        }
    }
  }
  function cd(a, b) {
    let c = a.Ta + Math.floor(Math.random() * a.cb);
    a.isActive() || (c *= 2);
    return c * b;
  }
  function R(a, b) {
    a.j.info("Error code " + b);
    if (b == 2) {
      var c = p(a.fb, a), d = a.Xa;
      const e = !d;
      d = new T(d || "//www.google.com/images/cleardot.gif");
      k.location && k.location.protocol == "http" || qc(d, "https");
      Ib(d);
      e ? Fc(d.toString(), c) : Gc(d.toString(), c);
    } else
      K(2);
    a.G = 0;
    a.l && a.l.sa(b);
    ad(a);
    Zc(a);
  }
  h.fb = function(a) {
    a ? (this.j.info("Successfully pinged google.com"), K(2)) : (this.j.info("Failed to ping google.com"), K(1));
  };
  function ad(a) {
    a.G = 0;
    a.ka = [];
    if (a.l) {
      const b = kc(a.h);
      if (b.length != 0 || a.i.length != 0)
        ma(a.ka, b), ma(a.ka, a.i), a.h.i.length = 0, la(a.i), a.i.length = 0;
      a.l.ra();
    }
  }
  function cc(a, b, c) {
    var d = c instanceof T ? N(c) : new T(c);
    if (d.g != "")
      b && (d.g = b + "." + d.g), rc(d, d.s);
    else {
      var e = k.location;
      d = e.protocol;
      b = b ? b + "." + e.hostname : e.hostname;
      e = +e.port;
      var f = new T(null);
      d && qc(f, d);
      b && (f.g = b);
      e && rc(f, e);
      c && (f.l = c);
      d = f;
    }
    c = a.D;
    b = a.ya;
    c && b && S(d, c, b);
    S(d, "VER", a.la);
    $c(a, d);
    return d;
  }
  function Mb(a, b, c) {
    if (b && !a.J)
      throw Error("Can't create secondary domain capable XhrIo object.");
    b = a.Ca && !a.pa ? new X(new Jc({ eb: c })) : new X(a.pa);
    b.Ha(a.J);
    return b;
  }
  h.isActive = function() {
    return !!this.l && this.l.isActive(this);
  };
  function gd() {
  }
  h = gd.prototype;
  h.ua = function() {
  };
  h.ta = function() {
  };
  h.sa = function() {
  };
  h.ra = function() {
  };
  h.isActive = function() {
    return true;
  };
  h.Na = function() {
  };
  function hd() {
  }
  hd.prototype.g = function(a, b) {
    return new Y(a, b);
  };
  function Y(a, b) {
    E.call(this);
    this.g = new Yc(b);
    this.l = a;
    this.h = b && b.messageUrlParams || null;
    a = b && b.messageHeaders || null;
    b && b.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = { "X-Client-Protocol": "webchannel" });
    this.g.o = a;
    a = b && b.initMessageHeaders || null;
    b && b.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b.messageContentType : a = { "X-WebChannel-Content-Type": b.messageContentType });
    b && b.va && (a ? a["X-WebChannel-Client-Profile"] = b.va : a = { "X-WebChannel-Client-Profile": b.va });
    this.g.S = a;
    (a = b && b.Sb) && !t(a) && (this.g.m = a);
    this.v = b && b.supportsCrossDomainXhr || false;
    this.u = b && b.sendRawJson || false;
    (b = b && b.httpSessionIdParam) && !t(b) && (this.g.D = b, a = this.h, a !== null && (b in a) && (a = this.h, (b in a) && delete a[b]));
    this.j = new Z(this);
  }
  r(Y, E);
  Y.prototype.m = function() {
    this.g.l = this.j;
    this.v && (this.g.J = true);
    this.g.connect(this.l, this.h || undefined);
  };
  Y.prototype.close = function() {
    gc(this.g);
  };
  Y.prototype.o = function(a) {
    var b = this.g;
    if (typeof a === "string") {
      var c = {};
      c.__data__ = a;
      a = c;
    } else
      this.u && (c = {}, c.__data__ = hb(a), a = c);
    b.i.push(new hc(b.Ya++, a));
    b.G == 3 && fc(b);
  };
  Y.prototype.N = function() {
    this.g.l = null;
    delete this.j;
    gc(this.g);
    delete this.g;
    Y.aa.N.call(this);
  };
  function id(a) {
    nb.call(this);
    a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
    var b = a.__sm__;
    if (b) {
      a: {
        for (const c in b) {
          a = c;
          break a;
        }
        a = undefined;
      }
      if (this.i = a)
        a = this.i, b = b !== null && a in b ? b[a] : undefined;
      this.data = b;
    } else
      this.data = a;
  }
  r(id, nb);
  function jd() {
    ob.call(this);
    this.status = 1;
  }
  r(jd, ob);
  function Z(a) {
    this.g = a;
  }
  r(Z, gd);
  Z.prototype.ua = function() {
    F(this.g, "a");
  };
  Z.prototype.ta = function(a) {
    F(this.g, new id(a));
  };
  Z.prototype.sa = function(a) {
    F(this.g, new jd);
  };
  Z.prototype.ra = function() {
    F(this.g, "b");
  };
  hd.prototype.createWebChannel = hd.prototype.g;
  Y.prototype.send = Y.prototype.o;
  Y.prototype.open = Y.prototype.m;
  Y.prototype.close = Y.prototype.close;
  createWebChannelTransport = webchannel_blob_es2018.createWebChannelTransport = function() {
    return new hd;
  };
  getStatEventTarget = webchannel_blob_es2018.getStatEventTarget = function() {
    return qb();
  };
  Event = webchannel_blob_es2018.Event = I;
  Stat = webchannel_blob_es2018.Stat = { mb: 0, pb: 1, qb: 2, Jb: 3, Ob: 4, Lb: 5, Mb: 6, Kb: 7, Ib: 8, Nb: 9, PROXY: 10, NOPROXY: 11, Gb: 12, Cb: 13, Db: 14, Bb: 15, Eb: 16, Fb: 17, ib: 18, hb: 19, jb: 20 };
  Ab.NO_ERROR = 0;
  Ab.TIMEOUT = 8;
  Ab.HTTP_ERROR = 6;
  ErrorCode = webchannel_blob_es2018.ErrorCode = Ab;
  Bb.COMPLETE = "complete";
  EventType = webchannel_blob_es2018.EventType = Bb;
  mb.EventType = H;
  H.OPEN = "a";
  H.CLOSE = "b";
  H.ERROR = "c";
  H.MESSAGE = "d";
  E.prototype.listen = E.prototype.K;
  WebChannel = webchannel_blob_es2018.WebChannel = mb;
  FetchXmlHttpFactory = webchannel_blob_es2018.FetchXmlHttpFactory = Jc;
  X.prototype.listenOnce = X.prototype.L;
  X.prototype.getLastError = X.prototype.Ka;
  X.prototype.getLastErrorCode = X.prototype.Ba;
  X.prototype.getStatus = X.prototype.Z;
  X.prototype.getResponseJson = X.prototype.Oa;
  X.prototype.getResponseText = X.prototype.oa;
  X.prototype.send = X.prototype.ea;
  X.prototype.setWithCredentials = X.prototype.Ha;
  XhrIo = webchannel_blob_es2018.XhrIo = X;
}).apply(typeof commonjsGlobal2 !== "undefined" ? commonjsGlobal2 : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

// node_modules/@firebase/firestore/dist/index.esm2017.js
var __PRIVATE_getLogLevel = function() {
  return D.logLevel;
};
var __PRIVATE_logDebug = function(e, ...t) {
  if (D.logLevel <= LogLevel.DEBUG) {
    const n = t.map(__PRIVATE_argToString);
    D.debug(`Firestore (${b}): ${e}`, ...n);
  }
};
var __PRIVATE_logError = function(e, ...t) {
  if (D.logLevel <= LogLevel.ERROR) {
    const n = t.map(__PRIVATE_argToString);
    D.error(`Firestore (${b}): ${e}`, ...n);
  }
};
var __PRIVATE_logWarn = function(e, ...t) {
  if (D.logLevel <= LogLevel.WARN) {
    const n = t.map(__PRIVATE_argToString);
    D.warn(`Firestore (${b}): ${e}`, ...n);
  }
};
var __PRIVATE_argToString = function(e) {
  if (typeof e == "string")
    return e;
  try {
    return function __PRIVATE_formatJSON(e2) {
      return JSON.stringify(e2);
    }(e);
  } catch (t) {
    return e;
  }
};
var fail = function(e = "Unexpected state") {
  const t = `FIRESTORE (${b}) INTERNAL ASSERTION FAILED: ` + e;
  throw __PRIVATE_logError(t), new Error(t);
};
var __PRIVATE_hardAssert = function(e, t) {
  e || fail();
};
var __PRIVATE_debugCast = function(e, t) {
  return e;
};
var __PRIVATE_randomBytes = function(e) {
  const t = typeof self != "undefined" && (self.crypto || self.msCrypto), n = new Uint8Array(e);
  if (t && typeof t.getRandomValues == "function")
    t.getRandomValues(n);
  else
    for (let t2 = 0;t2 < e; t2++)
      n[t2] = Math.floor(256 * Math.random());
  return n;
};
var __PRIVATE_primitiveComparator = function(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
};
var __PRIVATE_arrayEquals = function(e, t, n) {
  return e.length === t.length && e.every((e2, r) => n(e2, t[r]));
};
var __PRIVATE_newIndexOffsetSuccessorFromReadTime = function(e, t) {
  const n = e.toTimestamp().seconds, r = e.toTimestamp().nanoseconds + 1, i = SnapshotVersion.fromTimestamp(r === 1e9 ? new Timestamp(n + 1, 0) : new Timestamp(n, r));
  return new IndexOffset(i, DocumentKey.empty(), t);
};
var __PRIVATE_newIndexOffsetFromDocument = function(e) {
  return new IndexOffset(e.readTime, e.key, -1);
};
var __PRIVATE_indexOffsetComparator = function(e, t) {
  let n = e.readTime.compareTo(t.readTime);
  return n !== 0 ? n : (n = DocumentKey.comparator(e.documentKey, t.documentKey), n !== 0 ? n : __PRIVATE_primitiveComparator(e.largestBatchId, t.largestBatchId));
};
async function __PRIVATE_ignoreIfPrimaryLeaseLoss(e) {
  if (e.code !== C.FAILED_PRECONDITION || e.message !== F)
    throw e;
  __PRIVATE_logDebug("LocalStore", "Unexpectedly lost primary lease");
}
var __PRIVATE_getAndroidVersion = function(e) {
  const t = e.match(/Android ([\d.]+)/i), n = t ? t[1].split(".").slice(0, 2).join(".") : "-1";
  return Number(n);
};
var __PRIVATE_isIndexedDbTransactionError = function(e) {
  return e.name === "IndexedDbTransactionError";
};
var __PRIVATE_isNullOrUndefined = function(e) {
  return e == null;
};
var __PRIVATE_isNegativeZero = function(e) {
  return e === 0 && 1 / e == -1 / 0;
};
var __PRIVATE_objectSize = function(e) {
  let t = 0;
  for (const n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t++;
  return t;
};
var forEach = function(e, t) {
  for (const n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
};
var isEmpty2 = function(e) {
  for (const t in e)
    if (Object.prototype.hasOwnProperty.call(e, t))
      return false;
  return true;
};
var __PRIVATE_normalizeTimestamp = function(e) {
  if (__PRIVATE_hardAssert(!!e), typeof e == "string") {
    let t = 0;
    const n = ne.exec(e);
    if (__PRIVATE_hardAssert(!!n), n[1]) {
      let e2 = n[1];
      e2 = (e2 + "000000000").substr(0, 9), t = Number(e2);
    }
    const r = new Date(e);
    return {
      seconds: Math.floor(r.getTime() / 1000),
      nanos: t
    };
  }
  return {
    seconds: __PRIVATE_normalizeNumber(e.seconds),
    nanos: __PRIVATE_normalizeNumber(e.nanos)
  };
};
var __PRIVATE_normalizeNumber = function(e) {
  return typeof e == "number" ? e : typeof e == "string" ? Number(e) : 0;
};
var __PRIVATE_normalizeByteString = function(e) {
  return typeof e == "string" ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
};
var __PRIVATE_isServerTimestamp = function(e) {
  var t, n;
  return ((n = (((t = e == null ? undefined : e.mapValue) === null || t === undefined ? undefined : t.fields) || {}).__type__) === null || n === undefined ? undefined : n.stringValue) === "server_timestamp";
};
var __PRIVATE_getPreviousValue = function(e) {
  const t = e.mapValue.fields.__previous_value__;
  return __PRIVATE_isServerTimestamp(t) ? __PRIVATE_getPreviousValue(t) : t;
};
var __PRIVATE_getLocalWriteTime = function(e) {
  const t = __PRIVATE_normalizeTimestamp(e.mapValue.fields.__local_write_time__.timestampValue);
  return new Timestamp(t.seconds, t.nanos);
};
var __PRIVATE_typeOrder = function(e) {
  return "nullValue" in e ? 0 : ("booleanValue" in e) ? 1 : ("integerValue" in e) || ("doubleValue" in e) ? 2 : ("timestampValue" in e) ? 3 : ("stringValue" in e) ? 5 : ("bytesValue" in e) ? 6 : ("referenceValue" in e) ? 7 : ("geoPointValue" in e) ? 8 : ("arrayValue" in e) ? 9 : ("mapValue" in e) ? __PRIVATE_isServerTimestamp(e) ? 4 : __PRIVATE_isMaxValue(e) ? 9007199254740991 : 10 : fail();
};
var __PRIVATE_valueEquals = function(e, t) {
  if (e === t)
    return true;
  const n = __PRIVATE_typeOrder(e);
  if (n !== __PRIVATE_typeOrder(t))
    return false;
  switch (n) {
    case 0:
    case 9007199254740991:
      return true;
    case 1:
      return e.booleanValue === t.booleanValue;
    case 4:
      return __PRIVATE_getLocalWriteTime(e).isEqual(__PRIVATE_getLocalWriteTime(t));
    case 3:
      return function __PRIVATE_timestampEquals(e2, t2) {
        if (typeof e2.timestampValue == "string" && typeof t2.timestampValue == "string" && e2.timestampValue.length === t2.timestampValue.length)
          return e2.timestampValue === t2.timestampValue;
        const n2 = __PRIVATE_normalizeTimestamp(e2.timestampValue), r = __PRIVATE_normalizeTimestamp(t2.timestampValue);
        return n2.seconds === r.seconds && n2.nanos === r.nanos;
      }(e, t);
    case 5:
      return e.stringValue === t.stringValue;
    case 6:
      return function __PRIVATE_blobEquals(e2, t2) {
        return __PRIVATE_normalizeByteString(e2.bytesValue).isEqual(__PRIVATE_normalizeByteString(t2.bytesValue));
      }(e, t);
    case 7:
      return e.referenceValue === t.referenceValue;
    case 8:
      return function __PRIVATE_geoPointEquals(e2, t2) {
        return __PRIVATE_normalizeNumber(e2.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e2.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.longitude);
      }(e, t);
    case 2:
      return function __PRIVATE_numberEquals(e2, t2) {
        if ("integerValue" in e2 && "integerValue" in t2)
          return __PRIVATE_normalizeNumber(e2.integerValue) === __PRIVATE_normalizeNumber(t2.integerValue);
        if ("doubleValue" in e2 && "doubleValue" in t2) {
          const n2 = __PRIVATE_normalizeNumber(e2.doubleValue), r = __PRIVATE_normalizeNumber(t2.doubleValue);
          return n2 === r ? __PRIVATE_isNegativeZero(n2) === __PRIVATE_isNegativeZero(r) : isNaN(n2) && isNaN(r);
        }
        return false;
      }(e, t);
    case 9:
      return __PRIVATE_arrayEquals(e.arrayValue.values || [], t.arrayValue.values || [], __PRIVATE_valueEquals);
    case 10:
      return function __PRIVATE_objectEquals(e2, t2) {
        const n2 = e2.mapValue.fields || {}, r = t2.mapValue.fields || {};
        if (__PRIVATE_objectSize(n2) !== __PRIVATE_objectSize(r))
          return false;
        for (const e3 in n2)
          if (n2.hasOwnProperty(e3) && (r[e3] === undefined || !__PRIVATE_valueEquals(n2[e3], r[e3])))
            return false;
        return true;
      }(e, t);
    default:
      return fail();
  }
};
var __PRIVATE_arrayValueContains = function(e, t) {
  return (e.values || []).find((e2) => __PRIVATE_valueEquals(e2, t)) !== undefined;
};
var __PRIVATE_valueCompare = function(e, t) {
  if (e === t)
    return 0;
  const n = __PRIVATE_typeOrder(e), r = __PRIVATE_typeOrder(t);
  if (n !== r)
    return __PRIVATE_primitiveComparator(n, r);
  switch (n) {
    case 0:
    case 9007199254740991:
      return 0;
    case 1:
      return __PRIVATE_primitiveComparator(e.booleanValue, t.booleanValue);
    case 2:
      return function __PRIVATE_compareNumbers(e2, t2) {
        const n2 = __PRIVATE_normalizeNumber(e2.integerValue || e2.doubleValue), r2 = __PRIVATE_normalizeNumber(t2.integerValue || t2.doubleValue);
        return n2 < r2 ? -1 : n2 > r2 ? 1 : n2 === r2 ? 0 : isNaN(n2) ? isNaN(r2) ? 0 : -1 : 1;
      }(e, t);
    case 3:
      return __PRIVATE_compareTimestamps(e.timestampValue, t.timestampValue);
    case 4:
      return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e), __PRIVATE_getLocalWriteTime(t));
    case 5:
      return __PRIVATE_primitiveComparator(e.stringValue, t.stringValue);
    case 6:
      return function __PRIVATE_compareBlobs(e2, t2) {
        const n2 = __PRIVATE_normalizeByteString(e2), r2 = __PRIVATE_normalizeByteString(t2);
        return n2.compareTo(r2);
      }(e.bytesValue, t.bytesValue);
    case 7:
      return function __PRIVATE_compareReferences(e2, t2) {
        const n2 = e2.split("/"), r2 = t2.split("/");
        for (let e3 = 0;e3 < n2.length && e3 < r2.length; e3++) {
          const t3 = __PRIVATE_primitiveComparator(n2[e3], r2[e3]);
          if (t3 !== 0)
            return t3;
        }
        return __PRIVATE_primitiveComparator(n2.length, r2.length);
      }(e.referenceValue, t.referenceValue);
    case 8:
      return function __PRIVATE_compareGeoPoints(e2, t2) {
        const n2 = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.latitude), __PRIVATE_normalizeNumber(t2.latitude));
        if (n2 !== 0)
          return n2;
        return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.longitude), __PRIVATE_normalizeNumber(t2.longitude));
      }(e.geoPointValue, t.geoPointValue);
    case 9:
      return function __PRIVATE_compareArrays(e2, t2) {
        const n2 = e2.values || [], r2 = t2.values || [];
        for (let e3 = 0;e3 < n2.length && e3 < r2.length; ++e3) {
          const t3 = __PRIVATE_valueCompare(n2[e3], r2[e3]);
          if (t3)
            return t3;
        }
        return __PRIVATE_primitiveComparator(n2.length, r2.length);
      }(e.arrayValue, t.arrayValue);
    case 10:
      return function __PRIVATE_compareMaps(e2, t2) {
        if (e2 === re.mapValue && t2 === re.mapValue)
          return 0;
        if (e2 === re.mapValue)
          return 1;
        if (t2 === re.mapValue)
          return -1;
        const n2 = e2.fields || {}, r2 = Object.keys(n2), i = t2.fields || {}, s = Object.keys(i);
        r2.sort(), s.sort();
        for (let e3 = 0;e3 < r2.length && e3 < s.length; ++e3) {
          const t3 = __PRIVATE_primitiveComparator(r2[e3], s[e3]);
          if (t3 !== 0)
            return t3;
          const o = __PRIVATE_valueCompare(n2[r2[e3]], i[s[e3]]);
          if (o !== 0)
            return o;
        }
        return __PRIVATE_primitiveComparator(r2.length, s.length);
      }(e.mapValue, t.mapValue);
    default:
      throw fail();
  }
};
var __PRIVATE_compareTimestamps = function(e, t) {
  if (typeof e == "string" && typeof t == "string" && e.length === t.length)
    return __PRIVATE_primitiveComparator(e, t);
  const n = __PRIVATE_normalizeTimestamp(e), r = __PRIVATE_normalizeTimestamp(t), i = __PRIVATE_primitiveComparator(n.seconds, r.seconds);
  return i !== 0 ? i : __PRIVATE_primitiveComparator(n.nanos, r.nanos);
};
var canonicalId = function(e) {
  return __PRIVATE_canonifyValue(e);
};
var __PRIVATE_canonifyValue = function(e) {
  return "nullValue" in e ? "null" : ("booleanValue" in e) ? "" + e.booleanValue : ("integerValue" in e) ? "" + e.integerValue : ("doubleValue" in e) ? "" + e.doubleValue : ("timestampValue" in e) ? function __PRIVATE_canonifyTimestamp(e2) {
    const t = __PRIVATE_normalizeTimestamp(e2);
    return `time(${t.seconds},${t.nanos})`;
  }(e.timestampValue) : ("stringValue" in e) ? e.stringValue : ("bytesValue" in e) ? function __PRIVATE_canonifyByteString(e2) {
    return __PRIVATE_normalizeByteString(e2).toBase64();
  }(e.bytesValue) : ("referenceValue" in e) ? function __PRIVATE_canonifyReference(e2) {
    return DocumentKey.fromName(e2).toString();
  }(e.referenceValue) : ("geoPointValue" in e) ? function __PRIVATE_canonifyGeoPoint(e2) {
    return `geo(${e2.latitude},${e2.longitude})`;
  }(e.geoPointValue) : ("arrayValue" in e) ? function __PRIVATE_canonifyArray(e2) {
    let t = "[", n = true;
    for (const r of e2.values || [])
      n ? n = false : t += ",", t += __PRIVATE_canonifyValue(r);
    return t + "]";
  }(e.arrayValue) : ("mapValue" in e) ? function __PRIVATE_canonifyMap(e2) {
    const t = Object.keys(e2.fields || {}).sort();
    let n = "{", r = true;
    for (const i of t)
      r ? r = false : n += ",", n += `${i}:${__PRIVATE_canonifyValue(e2.fields[i])}`;
    return n + "}";
  }(e.mapValue) : fail();
};
var isInteger = function(e) {
  return !!e && "integerValue" in e;
};
var isArray = function(e) {
  return !!e && "arrayValue" in e;
};
var __PRIVATE_isNullValue = function(e) {
  return !!e && "nullValue" in e;
};
var __PRIVATE_isNanValue = function(e) {
  return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
};
var __PRIVATE_isMapValue = function(e) {
  return !!e && "mapValue" in e;
};
var __PRIVATE_deepClone = function(e) {
  if (e.geoPointValue)
    return {
      geoPointValue: Object.assign({}, e.geoPointValue)
    };
  if (e.timestampValue && typeof e.timestampValue == "object")
    return {
      timestampValue: Object.assign({}, e.timestampValue)
    };
  if (e.mapValue) {
    const t = {
      mapValue: {
        fields: {}
      }
    };
    return forEach(e.mapValue.fields, (e2, n) => t.mapValue.fields[e2] = __PRIVATE_deepClone(n)), t;
  }
  if (e.arrayValue) {
    const t = {
      arrayValue: {
        values: []
      }
    };
    for (let n = 0;n < (e.arrayValue.values || []).length; ++n)
      t.arrayValue.values[n] = __PRIVATE_deepClone(e.arrayValue.values[n]);
    return t;
  }
  return Object.assign({}, e);
};
var __PRIVATE_isMaxValue = function(e) {
  return (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue === "__max__";
};
var __PRIVATE_boundCompareToDocument = function(e, t, n) {
  let r = 0;
  for (let i = 0;i < e.position.length; i++) {
    const s = t[i], o = e.position[i];
    if (s.field.isKeyField())
      r = DocumentKey.comparator(DocumentKey.fromName(o.referenceValue), n.key);
    else {
      r = __PRIVATE_valueCompare(o, n.data.field(s.field));
    }
    if (s.dir === "desc" && (r *= -1), r !== 0)
      break;
  }
  return r;
};
var __PRIVATE_boundEquals = function(e, t) {
  if (e === null)
    return t === null;
  if (t === null)
    return false;
  if (e.inclusive !== t.inclusive || e.position.length !== t.position.length)
    return false;
  for (let n = 0;n < e.position.length; n++) {
    if (!__PRIVATE_valueEquals(e.position[n], t.position[n]))
      return false;
  }
  return true;
};
var __PRIVATE_orderByEquals = function(e, t) {
  return e.dir === t.dir && e.field.isEqual(t.field);
};
var __PRIVATE_compositeFilterIsConjunction = function(e) {
  return e.op === "and";
};
var __PRIVATE_compositeFilterIsFlatConjunction = function(e) {
  return __PRIVATE_compositeFilterIsFlat(e) && __PRIVATE_compositeFilterIsConjunction(e);
};
var __PRIVATE_compositeFilterIsFlat = function(e) {
  for (const t of e.filters)
    if (t instanceof CompositeFilter)
      return false;
  return true;
};
var __PRIVATE_canonifyFilter = function(e) {
  if (e instanceof FieldFilter)
    return e.field.canonicalString() + e.op.toString() + canonicalId(e.value);
  if (__PRIVATE_compositeFilterIsFlatConjunction(e))
    return e.filters.map((e2) => __PRIVATE_canonifyFilter(e2)).join(",");
  {
    const t = e.filters.map((e2) => __PRIVATE_canonifyFilter(e2)).join(",");
    return `${e.op}(${t})`;
  }
};
var __PRIVATE_filterEquals = function(e, t) {
  return e instanceof FieldFilter ? function __PRIVATE_fieldFilterEquals(e2, t2) {
    return t2 instanceof FieldFilter && e2.op === t2.op && e2.field.isEqual(t2.field) && __PRIVATE_valueEquals(e2.value, t2.value);
  }(e, t) : e instanceof CompositeFilter ? function __PRIVATE_compositeFilterEquals(e2, t2) {
    if (t2 instanceof CompositeFilter && e2.op === t2.op && e2.filters.length === t2.filters.length) {
      return e2.filters.reduce((e3, n, r) => e3 && __PRIVATE_filterEquals(n, t2.filters[r]), true);
    }
    return false;
  }(e, t) : void fail();
};
var __PRIVATE_stringifyFilter = function(e) {
  return e instanceof FieldFilter ? function __PRIVATE_stringifyFieldFilter(e2) {
    return `${e2.field.canonicalString()} ${e2.op} ${canonicalId(e2.value)}`;
  }(e) : e instanceof CompositeFilter ? function __PRIVATE_stringifyCompositeFilter(e2) {
    return e2.op.toString() + " {" + e2.getFilters().map(__PRIVATE_stringifyFilter).join(" ,") + "}";
  }(e) : "Filter";
};
var __PRIVATE_extractDocumentKeysFromArrayValue = function(e, t) {
  var n;
  return (((n = t.arrayValue) === null || n === undefined ? undefined : n.values) || []).map((e2) => DocumentKey.fromName(e2.referenceValue));
};
var __PRIVATE_newTarget = function(e, t = null, n = [], r = [], i = null, s = null, o = null) {
  return new __PRIVATE_TargetImpl(e, t, n, r, i, s, o);
};
var __PRIVATE_canonifyTarget = function(e) {
  const t = __PRIVATE_debugCast(e);
  if (t.ue === null) {
    let e2 = t.path.canonicalString();
    t.collectionGroup !== null && (e2 += "|cg:" + t.collectionGroup), e2 += "|f:", e2 += t.filters.map((e3) => __PRIVATE_canonifyFilter(e3)).join(","), e2 += "|ob:", e2 += t.orderBy.map((e3) => function __PRIVATE_canonifyOrderBy(e4) {
      return e4.field.canonicalString() + e4.dir;
    }(e3)).join(","), __PRIVATE_isNullOrUndefined(t.limit) || (e2 += "|l:", e2 += t.limit), t.startAt && (e2 += "|lb:", e2 += t.startAt.inclusive ? "b:" : "a:", e2 += t.startAt.position.map((e3) => canonicalId(e3)).join(",")), t.endAt && (e2 += "|ub:", e2 += t.endAt.inclusive ? "a:" : "b:", e2 += t.endAt.position.map((e3) => canonicalId(e3)).join(",")), t.ue = e2;
  }
  return t.ue;
};
var __PRIVATE_targetEquals = function(e, t) {
  if (e.limit !== t.limit)
    return false;
  if (e.orderBy.length !== t.orderBy.length)
    return false;
  for (let n = 0;n < e.orderBy.length; n++)
    if (!__PRIVATE_orderByEquals(e.orderBy[n], t.orderBy[n]))
      return false;
  if (e.filters.length !== t.filters.length)
    return false;
  for (let n = 0;n < e.filters.length; n++)
    if (!__PRIVATE_filterEquals(e.filters[n], t.filters[n]))
      return false;
  return e.collectionGroup === t.collectionGroup && (!!e.path.isEqual(t.path) && (!!__PRIVATE_boundEquals(e.startAt, t.startAt) && __PRIVATE_boundEquals(e.endAt, t.endAt)));
};
var __PRIVATE_targetIsDocumentTarget = function(e) {
  return DocumentKey.isDocumentKey(e.path) && e.collectionGroup === null && e.filters.length === 0;
};
var __PRIVATE_newQuery = function(e, t, n, r, i, s, o, _) {
  return new __PRIVATE_QueryImpl(e, t, n, r, i, s, o, _);
};
var __PRIVATE_newQueryForPath = function(e) {
  return new __PRIVATE_QueryImpl(e);
};
var __PRIVATE_queryMatchesAllDocuments = function(e) {
  return e.filters.length === 0 && e.limit === null && e.startAt == null && e.endAt == null && (e.explicitOrderBy.length === 0 || e.explicitOrderBy.length === 1 && e.explicitOrderBy[0].field.isKeyField());
};
var __PRIVATE_isCollectionGroupQuery = function(e) {
  return e.collectionGroup !== null;
};
var __PRIVATE_queryNormalizedOrderBy = function(e) {
  const t = __PRIVATE_debugCast(e);
  if (t.ce === null) {
    t.ce = [];
    const e2 = new Set;
    for (const n2 of t.explicitOrderBy)
      t.ce.push(n2), e2.add(n2.field.canonicalString());
    const n = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc", r = function __PRIVATE_getInequalityFilterFields(e3) {
      let t2 = new SortedSet(FieldPath$1.comparator);
      return e3.filters.forEach((e4) => {
        e4.getFlattenedFilters().forEach((e5) => {
          e5.isInequality() && (t2 = t2.add(e5.field));
        });
      }), t2;
    }(t);
    r.forEach((r2) => {
      e2.has(r2.canonicalString()) || r2.isKeyField() || t.ce.push(new OrderBy(r2, n));
    }), e2.has(FieldPath$1.keyField().canonicalString()) || t.ce.push(new OrderBy(FieldPath$1.keyField(), n));
  }
  return t.ce;
};
var __PRIVATE_queryToTarget = function(e) {
  const t = __PRIVATE_debugCast(e);
  return t.le || (t.le = __PRIVATE__queryToTarget(t, __PRIVATE_queryNormalizedOrderBy(e))), t.le;
};
var __PRIVATE__queryToTarget = function(e, t) {
  if (e.limitType === "F")
    return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
  {
    t = t.map((e2) => {
      const t2 = e2.dir === "desc" ? "asc" : "desc";
      return new OrderBy(e2.field, t2);
    });
    const n = e.endAt ? new Bound(e.endAt.position, e.endAt.inclusive) : null, r = e.startAt ? new Bound(e.startAt.position, e.startAt.inclusive) : null;
    return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, n, r);
  }
};
var __PRIVATE_queryWithLimit = function(e, t, n) {
  return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t, n, e.startAt, e.endAt);
};
var __PRIVATE_queryEquals = function(e, t) {
  return __PRIVATE_targetEquals(__PRIVATE_queryToTarget(e), __PRIVATE_queryToTarget(t)) && e.limitType === t.limitType;
};
var __PRIVATE_canonifyQuery = function(e) {
  return `${__PRIVATE_canonifyTarget(__PRIVATE_queryToTarget(e))}|lt:${e.limitType}`;
};
var __PRIVATE_stringifyQuery = function(e) {
  return `Query(target=${function __PRIVATE_stringifyTarget(e2) {
    let t = e2.path.canonicalString();
    return e2.collectionGroup !== null && (t += " collectionGroup=" + e2.collectionGroup), e2.filters.length > 0 && (t += `, filters: [${e2.filters.map((e3) => __PRIVATE_stringifyFilter(e3)).join(", ")}]`), __PRIVATE_isNullOrUndefined(e2.limit) || (t += ", limit: " + e2.limit), e2.orderBy.length > 0 && (t += `, orderBy: [${e2.orderBy.map((e3) => function __PRIVATE_stringifyOrderBy(e4) {
      return `${e4.field.canonicalString()} (${e4.dir})`;
    }(e3)).join(", ")}]`), e2.startAt && (t += ", startAt: ", t += e2.startAt.inclusive ? "b:" : "a:", t += e2.startAt.position.map((e3) => canonicalId(e3)).join(",")), e2.endAt && (t += ", endAt: ", t += e2.endAt.inclusive ? "a:" : "b:", t += e2.endAt.position.map((e3) => canonicalId(e3)).join(",")), `Target(${t})`;
  }(__PRIVATE_queryToTarget(e))}; limitType=${e.limitType})`;
};
var __PRIVATE_queryMatches = function(e, t) {
  return t.isFoundDocument() && function __PRIVATE_queryMatchesPathAndCollectionGroup(e2, t2) {
    const n = t2.key.path;
    return e2.collectionGroup !== null ? t2.key.hasCollectionId(e2.collectionGroup) && e2.path.isPrefixOf(n) : DocumentKey.isDocumentKey(e2.path) ? e2.path.isEqual(n) : e2.path.isImmediateParentOf(n);
  }(e, t) && function __PRIVATE_queryMatchesOrderBy(e2, t2) {
    for (const n of __PRIVATE_queryNormalizedOrderBy(e2))
      if (!n.field.isKeyField() && t2.data.field(n.field) === null)
        return false;
    return true;
  }(e, t) && function __PRIVATE_queryMatchesFilters(e2, t2) {
    for (const n of e2.filters)
      if (!n.matches(t2))
        return false;
    return true;
  }(e, t) && function __PRIVATE_queryMatchesBounds(e2, t2) {
    if (e2.startAt && !function __PRIVATE_boundSortsBeforeDocument(e3, t3, n) {
      const r = __PRIVATE_boundCompareToDocument(e3, t3, n);
      return e3.inclusive ? r <= 0 : r < 0;
    }(e2.startAt, __PRIVATE_queryNormalizedOrderBy(e2), t2))
      return false;
    if (e2.endAt && !function __PRIVATE_boundSortsAfterDocument(e3, t3, n) {
      const r = __PRIVATE_boundCompareToDocument(e3, t3, n);
      return e3.inclusive ? r >= 0 : r > 0;
    }(e2.endAt, __PRIVATE_queryNormalizedOrderBy(e2), t2))
      return false;
    return true;
  }(e, t);
};
var __PRIVATE_queryCollectionGroup = function(e) {
  return e.collectionGroup || (e.path.length % 2 == 1 ? e.path.lastSegment() : e.path.get(e.path.length - 2));
};
var __PRIVATE_newQueryComparator = function(e) {
  return (t, n) => {
    let r = false;
    for (const i of __PRIVATE_queryNormalizedOrderBy(e)) {
      const e2 = __PRIVATE_compareDocs(i, t, n);
      if (e2 !== 0)
        return e2;
      r = r || i.field.isKeyField();
    }
    return 0;
  };
};
var __PRIVATE_compareDocs = function(e, t, n) {
  const r = e.field.isKeyField() ? DocumentKey.comparator(t.key, n.key) : function __PRIVATE_compareDocumentsByField(e2, t2, n2) {
    const r2 = t2.data.field(e2), i = n2.data.field(e2);
    return r2 !== null && i !== null ? __PRIVATE_valueCompare(r2, i) : fail();
  }(e.field, t, n);
  switch (e.dir) {
    case "asc":
      return r;
    case "desc":
      return -1 * r;
    default:
      return fail();
  }
};
var __PRIVATE_mutableDocumentMap = function() {
  return se;
};
var documentMap = function(...e) {
  let t = oe;
  for (const n of e)
    t = t.insert(n.key, n);
  return t;
};
var __PRIVATE_convertOverlayedDocumentMapToDocumentMap = function(e) {
  let t = oe;
  return e.forEach((e2, n) => t = t.insert(e2, n.overlayedDocument)), t;
};
var __PRIVATE_newOverlayMap = function() {
  return __PRIVATE_newDocumentKeyMap();
};
var __PRIVATE_newMutationMap = function() {
  return __PRIVATE_newDocumentKeyMap();
};
var __PRIVATE_newDocumentKeyMap = function() {
  return new ObjectMap((e) => e.toString(), (e, t) => e.isEqual(t));
};
var __PRIVATE_documentKeySet = function(...e) {
  let t = ae;
  for (const n of e)
    t = t.add(n);
  return t;
};
var __PRIVATE_targetIdSet = function() {
  return ue;
};
var __PRIVATE_toDouble = function(e, t) {
  if (e.useProto3Json) {
    if (isNaN(t))
      return {
        doubleValue: "NaN"
      };
    if (t === 1 / 0)
      return {
        doubleValue: "Infinity"
      };
    if (t === -1 / 0)
      return {
        doubleValue: "-Infinity"
      };
  }
  return {
    doubleValue: __PRIVATE_isNegativeZero(t) ? "-0" : t
  };
};
var __PRIVATE_toInteger = function(e) {
  return {
    integerValue: "" + e
  };
};
var __PRIVATE_applyTransformOperationToLocalView = function(e, t, n) {
  return e instanceof __PRIVATE_ServerTimestampTransform ? function serverTimestamp$1(e2, t2) {
    const n2 = {
      fields: {
        __type__: {
          stringValue: "server_timestamp"
        },
        __local_write_time__: {
          timestampValue: {
            seconds: e2.seconds,
            nanos: e2.nanoseconds
          }
        }
      }
    };
    return t2 && __PRIVATE_isServerTimestamp(t2) && (t2 = __PRIVATE_getPreviousValue(t2)), t2 && (n2.fields.__previous_value__ = t2), {
      mapValue: n2
    };
  }(n, t) : e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : function __PRIVATE_applyNumericIncrementTransformOperationToLocalView(e2, t2) {
    const n2 = __PRIVATE_computeTransformOperationBaseValue(e2, t2), r = asNumber(n2) + asNumber(e2.Pe);
    return isInteger(n2) && isInteger(e2.Pe) ? __PRIVATE_toInteger(r) : __PRIVATE_toDouble(e2.serializer, r);
  }(e, t);
};
var __PRIVATE_applyTransformOperationToRemoteDocument = function(e, t, n) {
  return e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : n;
};
var __PRIVATE_computeTransformOperationBaseValue = function(e, t) {
  return e instanceof __PRIVATE_NumericIncrementTransformOperation ? function __PRIVATE_isNumber(e2) {
    return isInteger(e2) || function __PRIVATE_isDouble(e3) {
      return !!e3 && "doubleValue" in e3;
    }(e2);
  }(t) ? t : {
    integerValue: 0
  } : null;
};
var __PRIVATE_applyArrayUnionTransformOperation = function(e, t) {
  const n = __PRIVATE_coercedFieldValuesArray(t);
  for (const t2 of e.elements)
    n.some((e2) => __PRIVATE_valueEquals(e2, t2)) || n.push(t2);
  return {
    arrayValue: {
      values: n
    }
  };
};
var __PRIVATE_applyArrayRemoveTransformOperation = function(e, t) {
  let n = __PRIVATE_coercedFieldValuesArray(t);
  for (const t2 of e.elements)
    n = n.filter((e2) => !__PRIVATE_valueEquals(e2, t2));
  return {
    arrayValue: {
      values: n
    }
  };
};
var asNumber = function(e) {
  return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
};
var __PRIVATE_coercedFieldValuesArray = function(e) {
  return isArray(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
};
var __PRIVATE_fieldTransformEquals = function(e, t) {
  return e.field.isEqual(t.field) && function __PRIVATE_transformOperationEquals(e2, t2) {
    return e2 instanceof __PRIVATE_ArrayUnionTransformOperation && t2 instanceof __PRIVATE_ArrayUnionTransformOperation || e2 instanceof __PRIVATE_ArrayRemoveTransformOperation && t2 instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_arrayEquals(e2.elements, t2.elements, __PRIVATE_valueEquals) : e2 instanceof __PRIVATE_NumericIncrementTransformOperation && t2 instanceof __PRIVATE_NumericIncrementTransformOperation ? __PRIVATE_valueEquals(e2.Pe, t2.Pe) : e2 instanceof __PRIVATE_ServerTimestampTransform && t2 instanceof __PRIVATE_ServerTimestampTransform;
  }(e.transform, t.transform);
};
var __PRIVATE_preconditionIsValidForDocument = function(e, t) {
  return e.updateTime !== undefined ? t.isFoundDocument() && t.version.isEqual(e.updateTime) : e.exists === undefined || e.exists === t.isFoundDocument();
};
var __PRIVATE_calculateOverlayMutation = function(e, t) {
  if (!e.hasLocalMutations || t && t.fields.length === 0)
    return null;
  if (t === null)
    return e.isNoDocument() ? new __PRIVATE_DeleteMutation(e.key, Precondition.none()) : new __PRIVATE_SetMutation(e.key, e.data, Precondition.none());
  {
    const n = e.data, r = ObjectValue.empty();
    let i = new SortedSet(FieldPath$1.comparator);
    for (let e2 of t.fields)
      if (!i.has(e2)) {
        let t2 = n.field(e2);
        t2 === null && e2.length > 1 && (e2 = e2.popLast(), t2 = n.field(e2)), t2 === null ? r.delete(e2) : r.set(e2, t2), i = i.add(e2);
      }
    return new __PRIVATE_PatchMutation(e.key, r, new FieldMask(i.toArray()), Precondition.none());
  }
};
var __PRIVATE_mutationApplyToRemoteDocument = function(e, t, n) {
  e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToRemoteDocument(e2, t2, n2) {
    const r = e2.value.clone(), i = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults);
    r.setAll(i), t2.convertToFoundDocument(n2.version, r).setHasCommittedMutations();
  }(e, t, n) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToRemoteDocument(e2, t2, n2) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return void t2.convertToUnknownDocument(n2.version);
    const r = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults), i = t2.data;
    i.setAll(__PRIVATE_getPatch(e2)), i.setAll(r), t2.convertToFoundDocument(n2.version, i).setHasCommittedMutations();
  }(e, t, n) : function __PRIVATE_deleteMutationApplyToRemoteDocument(e2, t2, n2) {
    t2.convertToNoDocument(n2.version).setHasCommittedMutations();
  }(0, t, n);
};
var __PRIVATE_mutationApplyToLocalView = function(e, t, n, r) {
  return e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToLocalView(e2, t2, n2, r2) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return n2;
    const i = e2.value.clone(), s = __PRIVATE_localTransformResults(e2.fieldTransforms, r2, t2);
    return i.setAll(s), t2.convertToFoundDocument(t2.version, i).setHasLocalMutations(), null;
  }(e, t, n, r) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToLocalView(e2, t2, n2, r2) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return n2;
    const i = __PRIVATE_localTransformResults(e2.fieldTransforms, r2, t2), s = t2.data;
    if (s.setAll(__PRIVATE_getPatch(e2)), s.setAll(i), t2.convertToFoundDocument(t2.version, s).setHasLocalMutations(), n2 === null)
      return null;
    return n2.unionWith(e2.fieldMask.fields).unionWith(e2.fieldTransforms.map((e3) => e3.field));
  }(e, t, n, r) : function __PRIVATE_deleteMutationApplyToLocalView(e2, t2, n2) {
    if (__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return t2.convertToNoDocument(t2.version).setHasLocalMutations(), null;
    return n2;
  }(e, t, n);
};
var __PRIVATE_mutationEquals = function(e, t) {
  return e.type === t.type && (!!e.key.isEqual(t.key) && (!!e.precondition.isEqual(t.precondition) && (!!function __PRIVATE_fieldTransformsAreEqual(e2, t2) {
    return e2 === undefined && t2 === undefined || !(!e2 || !t2) && __PRIVATE_arrayEquals(e2, t2, (e3, t3) => __PRIVATE_fieldTransformEquals(e3, t3));
  }(e.fieldTransforms, t.fieldTransforms) && (e.type === 0 ? e.value.isEqual(t.value) : e.type !== 1 || e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask)))));
};
var __PRIVATE_getPatch = function(e) {
  const t = new Map;
  return e.fieldMask.fields.forEach((n) => {
    if (!n.isEmpty()) {
      const r = e.data.field(n);
      t.set(n, r);
    }
  }), t;
};
var __PRIVATE_serverTransformResults = function(e, t, n) {
  const r = new Map;
  __PRIVATE_hardAssert(e.length === n.length);
  for (let i = 0;i < n.length; i++) {
    const s = e[i], o = s.transform, _ = t.data.field(s.field);
    r.set(s.field, __PRIVATE_applyTransformOperationToRemoteDocument(o, _, n[i]));
  }
  return r;
};
var __PRIVATE_localTransformResults = function(e, t, n) {
  const r = new Map;
  for (const i of e) {
    const e2 = i.transform, s = n.data.field(i.field);
    r.set(i.field, __PRIVATE_applyTransformOperationToLocalView(e2, s, t));
  }
  return r;
};
var __PRIVATE_mapCodeFromRpcCode = function(e) {
  if (e === undefined)
    return __PRIVATE_logError("GRPC error has no .code"), C.UNKNOWN;
  switch (e) {
    case ce.OK:
      return C.OK;
    case ce.CANCELLED:
      return C.CANCELLED;
    case ce.UNKNOWN:
      return C.UNKNOWN;
    case ce.DEADLINE_EXCEEDED:
      return C.DEADLINE_EXCEEDED;
    case ce.RESOURCE_EXHAUSTED:
      return C.RESOURCE_EXHAUSTED;
    case ce.INTERNAL:
      return C.INTERNAL;
    case ce.UNAVAILABLE:
      return C.UNAVAILABLE;
    case ce.UNAUTHENTICATED:
      return C.UNAUTHENTICATED;
    case ce.INVALID_ARGUMENT:
      return C.INVALID_ARGUMENT;
    case ce.NOT_FOUND:
      return C.NOT_FOUND;
    case ce.ALREADY_EXISTS:
      return C.ALREADY_EXISTS;
    case ce.PERMISSION_DENIED:
      return C.PERMISSION_DENIED;
    case ce.FAILED_PRECONDITION:
      return C.FAILED_PRECONDITION;
    case ce.ABORTED:
      return C.ABORTED;
    case ce.OUT_OF_RANGE:
      return C.OUT_OF_RANGE;
    case ce.UNIMPLEMENTED:
      return C.UNIMPLEMENTED;
    case ce.DATA_LOSS:
      return C.DATA_LOSS;
    default:
      return fail();
  }
};
var __PRIVATE_newTextEncoder = function() {
  return new TextEncoder;
};
var __PRIVATE_getMd5HashValue = function(e) {
  const t = __PRIVATE_newTextEncoder().encode(e), n = new Md5;
  return n.update(t), new Uint8Array(n.digest());
};
var __PRIVATE_get64BitUints = function(e) {
  const t = new DataView(e.buffer), n = t.getUint32(0, true), r = t.getUint32(4, true), i = t.getUint32(8, true), s = t.getUint32(12, true);
  return [new Integer([n, r], 0), new Integer([i, s], 0)];
};
var __PRIVATE_documentTargetMap = function() {
  return new SortedMap(DocumentKey.comparator);
};
var __PRIVATE_snapshotChangesMap = function() {
  return new SortedMap(DocumentKey.comparator);
};
var __PRIVATE_toInt32Proto = function(e, t) {
  return e.useProto3Json || __PRIVATE_isNullOrUndefined(t) ? t : {
    value: t
  };
};
var toTimestamp = function(e, t) {
  if (e.useProto3Json) {
    return `${new Date(1000 * t.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`;
  }
  return {
    seconds: "" + t.seconds,
    nanos: t.nanoseconds
  };
};
var __PRIVATE_toBytes = function(e, t) {
  return e.useProto3Json ? t.toBase64() : t.toUint8Array();
};
var __PRIVATE_fromVersion = function(e) {
  return __PRIVATE_hardAssert(!!e), SnapshotVersion.fromTimestamp(function fromTimestamp(e2) {
    const t = __PRIVATE_normalizeTimestamp(e2);
    return new Timestamp(t.seconds, t.nanos);
  }(e));
};
var __PRIVATE_toResourceName = function(e, t) {
  return __PRIVATE_toResourcePath(e, t).canonicalString();
};
var __PRIVATE_toResourcePath = function(e, t) {
  const n = function __PRIVATE_fullyQualifiedPrefixPath(e2) {
    return new ResourcePath(["projects", e2.projectId, "databases", e2.database]);
  }(e).child("documents");
  return t === undefined ? n : n.child(t);
};
var __PRIVATE_fromResourceName = function(e) {
  const t = ResourcePath.fromString(e);
  return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t)), t;
};
var fromName = function(e, t) {
  const n = __PRIVATE_fromResourceName(t);
  if (n.get(1) !== e.databaseId.projectId)
    throw new FirestoreError(C.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + e.databaseId.projectId);
  if (n.get(3) !== e.databaseId.database)
    throw new FirestoreError(C.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + e.databaseId.database);
  return new DocumentKey(__PRIVATE_extractLocalPathFromResourceName(n));
};
var __PRIVATE_toQueryPath = function(e, t) {
  return __PRIVATE_toResourceName(e.databaseId, t);
};
var __PRIVATE_fromQueryPath = function(e) {
  const t = __PRIVATE_fromResourceName(e);
  return t.length === 4 ? ResourcePath.emptyPath() : __PRIVATE_extractLocalPathFromResourceName(t);
};
var __PRIVATE_getEncodedDatabaseId = function(e) {
  return new ResourcePath(["projects", e.databaseId.projectId, "databases", e.databaseId.database]).canonicalString();
};
var __PRIVATE_extractLocalPathFromResourceName = function(e) {
  return __PRIVATE_hardAssert(e.length > 4 && e.get(4) === "documents"), e.popFirst(5);
};
var __PRIVATE_fromWatchChange = function(e, t) {
  let n;
  if ("targetChange" in t) {
    t.targetChange;
    const r = function __PRIVATE_fromWatchTargetChangeState(e2) {
      return e2 === "NO_CHANGE" ? 0 : e2 === "ADD" ? 1 : e2 === "REMOVE" ? 2 : e2 === "CURRENT" ? 3 : e2 === "RESET" ? 4 : fail();
    }(t.targetChange.targetChangeType || "NO_CHANGE"), i = t.targetChange.targetIds || [], s = function __PRIVATE_fromBytes(e2, t2) {
      return e2.useProto3Json ? (__PRIVATE_hardAssert(t2 === undefined || typeof t2 == "string"), ByteString.fromBase64String(t2 || "")) : (__PRIVATE_hardAssert(t2 === undefined || t2 instanceof Buffer || t2 instanceof Uint8Array), ByteString.fromUint8Array(t2 || new Uint8Array));
    }(e, t.targetChange.resumeToken), o = t.targetChange.cause, _ = o && function __PRIVATE_fromRpcStatus(e2) {
      const t2 = e2.code === undefined ? C.UNKNOWN : __PRIVATE_mapCodeFromRpcCode(e2.code);
      return new FirestoreError(t2, e2.message || "");
    }(o);
    n = new __PRIVATE_WatchTargetChange(r, i, s, _ || null);
  } else if ("documentChange" in t) {
    t.documentChange;
    const r = t.documentChange;
    r.document, r.document.name, r.document.updateTime;
    const i = fromName(e, r.document.name), s = __PRIVATE_fromVersion(r.document.updateTime), o = r.document.createTime ? __PRIVATE_fromVersion(r.document.createTime) : SnapshotVersion.min(), _ = new ObjectValue({
      mapValue: {
        fields: r.document.fields
      }
    }), a = MutableDocument.newFoundDocument(i, s, o, _), u = r.targetIds || [], c = r.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange(u, c, a.key, a);
  } else if ("documentDelete" in t) {
    t.documentDelete;
    const r = t.documentDelete;
    r.document;
    const i = fromName(e, r.document), s = r.readTime ? __PRIVATE_fromVersion(r.readTime) : SnapshotVersion.min(), o = MutableDocument.newNoDocument(i, s), _ = r.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange([], _, o.key, o);
  } else if ("documentRemove" in t) {
    t.documentRemove;
    const r = t.documentRemove;
    r.document;
    const i = fromName(e, r.document), s = r.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange([], s, i, null);
  } else {
    if (!("filter" in t))
      return fail();
    {
      t.filter;
      const e2 = t.filter;
      e2.targetId;
      const { count: r = 0, unchangedNames: i } = e2, s = new ExistenceFilter(r, i), o = e2.targetId;
      n = new __PRIVATE_ExistenceFilterChange(o, s);
    }
  }
  return n;
};
var __PRIVATE_toDocumentsTarget = function(e, t) {
  return {
    documents: [__PRIVATE_toQueryPath(e, t.path)]
  };
};
var __PRIVATE_toQueryTarget = function(e, t) {
  const n = {
    structuredQuery: {}
  }, r = t.path;
  let i;
  t.collectionGroup !== null ? (i = r, n.structuredQuery.from = [{
    collectionId: t.collectionGroup,
    allDescendants: true
  }]) : (i = r.popLast(), n.structuredQuery.from = [{
    collectionId: r.lastSegment()
  }]), n.parent = __PRIVATE_toQueryPath(e, i);
  const s = function __PRIVATE_toFilters(e2) {
    if (e2.length === 0)
      return;
    return __PRIVATE_toFilter(CompositeFilter.create(e2, "and"));
  }(t.filters);
  s && (n.structuredQuery.where = s);
  const o = function __PRIVATE_toOrder(e2) {
    if (e2.length === 0)
      return;
    return e2.map((e3) => function __PRIVATE_toPropertyOrder(e4) {
      return {
        field: __PRIVATE_toFieldPathReference(e4.field),
        direction: __PRIVATE_toDirection(e4.dir)
      };
    }(e3));
  }(t.orderBy);
  o && (n.structuredQuery.orderBy = o);
  const _ = __PRIVATE_toInt32Proto(e, t.limit);
  return _ !== null && (n.structuredQuery.limit = _), t.startAt && (n.structuredQuery.startAt = function __PRIVATE_toStartAtCursor(e2) {
    return {
      before: e2.inclusive,
      values: e2.position
    };
  }(t.startAt)), t.endAt && (n.structuredQuery.endAt = function __PRIVATE_toEndAtCursor(e2) {
    return {
      before: !e2.inclusive,
      values: e2.position
    };
  }(t.endAt)), {
    _t: n,
    parent: i
  };
};
var __PRIVATE_convertQueryTargetToQuery = function(e) {
  let t = __PRIVATE_fromQueryPath(e.parent);
  const n = e.structuredQuery, r = n.from ? n.from.length : 0;
  let i = null;
  if (r > 0) {
    __PRIVATE_hardAssert(r === 1);
    const e2 = n.from[0];
    e2.allDescendants ? i = e2.collectionId : t = t.child(e2.collectionId);
  }
  let s = [];
  n.where && (s = function __PRIVATE_fromFilters(e2) {
    const t2 = __PRIVATE_fromFilter(e2);
    if (t2 instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(t2))
      return t2.getFilters();
    return [t2];
  }(n.where));
  let o = [];
  n.orderBy && (o = function __PRIVATE_fromOrder(e2) {
    return e2.map((e3) => function __PRIVATE_fromPropertyOrder(e4) {
      return new OrderBy(__PRIVATE_fromFieldPathReference(e4.field), function __PRIVATE_fromDirection(e5) {
        switch (e5) {
          case "ASCENDING":
            return "asc";
          case "DESCENDING":
            return "desc";
          default:
            return;
        }
      }(e4.direction));
    }(e3));
  }(n.orderBy));
  let _ = null;
  n.limit && (_ = function __PRIVATE_fromInt32Proto(e2) {
    let t2;
    return t2 = typeof e2 == "object" ? e2.value : e2, __PRIVATE_isNullOrUndefined(t2) ? null : t2;
  }(n.limit));
  let a = null;
  n.startAt && (a = function __PRIVATE_fromStartAtCursor(e2) {
    const t2 = !!e2.before, n2 = e2.values || [];
    return new Bound(n2, t2);
  }(n.startAt));
  let u = null;
  return n.endAt && (u = function __PRIVATE_fromEndAtCursor(e2) {
    const t2 = !e2.before, n2 = e2.values || [];
    return new Bound(n2, t2);
  }(n.endAt)), __PRIVATE_newQuery(t, i, o, s, _, "F", a, u);
};
var __PRIVATE_toListenRequestLabels = function(e, t) {
  const n = function __PRIVATE_toLabel(e2) {
    switch (e2) {
      case "TargetPurposeListen":
        return null;
      case "TargetPurposeExistenceFilterMismatch":
        return "existence-filter-mismatch";
      case "TargetPurposeExistenceFilterMismatchBloom":
        return "existence-filter-mismatch-bloom";
      case "TargetPurposeLimboResolution":
        return "limbo-document";
      default:
        return fail();
    }
  }(t.purpose);
  return n == null ? null : {
    "goog-listen-tags": n
  };
};
var __PRIVATE_fromFilter = function(e) {
  return e.unaryFilter !== undefined ? function __PRIVATE_fromUnaryFilter(e2) {
    switch (e2.unaryFilter.op) {
      case "IS_NAN":
        const t = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(t, "==", {
          doubleValue: NaN
        });
      case "IS_NULL":
        const n = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(n, "==", {
          nullValue: "NULL_VALUE"
        });
      case "IS_NOT_NAN":
        const r = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(r, "!=", {
          doubleValue: NaN
        });
      case "IS_NOT_NULL":
        const i = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(i, "!=", {
          nullValue: "NULL_VALUE"
        });
      default:
        return fail();
    }
  }(e) : e.fieldFilter !== undefined ? function __PRIVATE_fromFieldFilter(e2) {
    return FieldFilter.create(__PRIVATE_fromFieldPathReference(e2.fieldFilter.field), function __PRIVATE_fromOperatorName(e3) {
      switch (e3) {
        case "EQUAL":
          return "==";
        case "NOT_EQUAL":
          return "!=";
        case "GREATER_THAN":
          return ">";
        case "GREATER_THAN_OR_EQUAL":
          return ">=";
        case "LESS_THAN":
          return "<";
        case "LESS_THAN_OR_EQUAL":
          return "<=";
        case "ARRAY_CONTAINS":
          return "array-contains";
        case "IN":
          return "in";
        case "NOT_IN":
          return "not-in";
        case "ARRAY_CONTAINS_ANY":
          return "array-contains-any";
        default:
          return fail();
      }
    }(e2.fieldFilter.op), e2.fieldFilter.value);
  }(e) : e.compositeFilter !== undefined ? function __PRIVATE_fromCompositeFilter(e2) {
    return CompositeFilter.create(e2.compositeFilter.filters.map((e3) => __PRIVATE_fromFilter(e3)), function __PRIVATE_fromCompositeOperatorName(e3) {
      switch (e3) {
        case "AND":
          return "and";
        case "OR":
          return "or";
        default:
          return fail();
      }
    }(e2.compositeFilter.op));
  }(e) : fail();
};
var __PRIVATE_toDirection = function(e) {
  return Ie[e];
};
var __PRIVATE_toOperatorName = function(e) {
  return Te[e];
};
var __PRIVATE_toCompositeOperatorName = function(e) {
  return Ee[e];
};
var __PRIVATE_toFieldPathReference = function(e) {
  return {
    fieldPath: e.canonicalString()
  };
};
var __PRIVATE_fromFieldPathReference = function(e) {
  return FieldPath$1.fromServerFormat(e.fieldPath);
};
var __PRIVATE_toFilter = function(e) {
  return e instanceof FieldFilter ? function __PRIVATE_toUnaryOrFieldFilter(e2) {
    if (e2.op === "==") {
      if (__PRIVATE_isNanValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NAN"
          }
        };
      if (__PRIVATE_isNullValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NULL"
          }
        };
    } else if (e2.op === "!=") {
      if (__PRIVATE_isNanValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NOT_NAN"
          }
        };
      if (__PRIVATE_isNullValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NOT_NULL"
          }
        };
    }
    return {
      fieldFilter: {
        field: __PRIVATE_toFieldPathReference(e2.field),
        op: __PRIVATE_toOperatorName(e2.op),
        value: e2.value
      }
    };
  }(e) : e instanceof CompositeFilter ? function __PRIVATE_toCompositeFilter(e2) {
    const t = e2.getFilters().map((e3) => __PRIVATE_toFilter(e3));
    if (t.length === 1)
      return t[0];
    return {
      compositeFilter: {
        op: __PRIVATE_toCompositeOperatorName(e2.op),
        filters: t
      }
    };
  }(e) : fail();
};
var __PRIVATE_isValidResourceName = function(e) {
  return e.length >= 4 && e.get(0) === "projects" && e.get(2) === "databases";
};
var __PRIVATE_fromBundledQuery = function(e) {
  const t = __PRIVATE_convertQueryTargetToQuery({
    parent: e.parent,
    structuredQuery: e.structuredQuery
  });
  return e.limitType === "LAST" ? __PRIVATE_queryWithLimit(t, t.limit, "L") : t;
};
var __PRIVATE_newLocalStore = function(e, t, n, r) {
  return new __PRIVATE_LocalStoreImpl(e, t, n, r);
};
async function __PRIVATE_localStoreHandleUserChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  return await n.persistence.runTransaction("Handle user change", "readonly", (e2) => {
    let r;
    return n.mutationQueue.getAllMutationBatches(e2).next((i) => (r = i, n._s(t), n.mutationQueue.getAllMutationBatches(e2))).next((t2) => {
      const i = [], s = [];
      let o = __PRIVATE_documentKeySet();
      for (const e3 of r) {
        i.push(e3.batchId);
        for (const t3 of e3.mutations)
          o = o.add(t3.key);
      }
      for (const e3 of t2) {
        s.push(e3.batchId);
        for (const t3 of e3.mutations)
          o = o.add(t3.key);
      }
      return n.localDocuments.getDocuments(e2, o).next((e3) => ({
        us: e3,
        removedBatchIds: i,
        addedBatchIds: s
      }));
    });
  });
}
var __PRIVATE_localStoreGetLastRemoteSnapshotVersion = function(e) {
  const t = __PRIVATE_debugCast(e);
  return t.persistence.runTransaction("Get last remote snapshot version", "readonly", (e2) => t.Qr.getLastRemoteSnapshotVersion(e2));
};
var __PRIVATE_localStoreApplyRemoteEventToLocalCache = function(e, t) {
  const n = __PRIVATE_debugCast(e), r = t.snapshotVersion;
  let i = n.ns;
  return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (e2) => {
    const s = n.os.newChangeBuffer({
      trackRemovals: true
    });
    i = n.ns;
    const o = [];
    t.targetChanges.forEach((s2, _2) => {
      const a2 = i.get(_2);
      if (!a2)
        return;
      o.push(n.Qr.removeMatchingKeys(e2, s2.removedDocuments, _2).next(() => n.Qr.addMatchingKeys(e2, s2.addedDocuments, _2)));
      let u = a2.withSequenceNumber(e2.currentSequenceNumber);
      t.targetMismatches.get(_2) !== null ? u = u.withResumeToken(ByteString.EMPTY_BYTE_STRING, SnapshotVersion.min()).withLastLimboFreeSnapshotVersion(SnapshotVersion.min()) : s2.resumeToken.approximateByteSize() > 0 && (u = u.withResumeToken(s2.resumeToken, r)), i = i.insert(_2, u), function __PRIVATE_shouldPersistTargetData(e3, t2, n2) {
        if (e3.resumeToken.approximateByteSize() === 0)
          return true;
        if (t2.snapshotVersion.toMicroseconds() - e3.snapshotVersion.toMicroseconds() >= 300000000)
          return true;
        return n2.addedDocuments.size + n2.modifiedDocuments.size + n2.removedDocuments.size > 0;
      }(a2, u, s2) && o.push(n.Qr.updateTargetData(e2, u));
    });
    let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
    if (t.documentUpdates.forEach((r2) => {
      t.resolvedLimboDocuments.has(r2) && o.push(n.persistence.referenceDelegate.updateLimboDocument(e2, r2));
    }), o.push(__PRIVATE_populateDocumentChangeBuffer(e2, s, t.documentUpdates).next((e3) => {
      _ = e3.cs, a = e3.ls;
    })), !r.isEqual(SnapshotVersion.min())) {
      const t2 = n.Qr.getLastRemoteSnapshotVersion(e2).next((t3) => n.Qr.setTargetsMetadata(e2, e2.currentSequenceNumber, r));
      o.push(t2);
    }
    return PersistencePromise.waitFor(o).next(() => s.apply(e2)).next(() => n.localDocuments.getLocalViewOfDocuments(e2, _, a)).next(() => _);
  }).then((e2) => (n.ns = i, e2));
};
var __PRIVATE_populateDocumentChangeBuffer = function(e, t, n) {
  let r = __PRIVATE_documentKeySet(), i = __PRIVATE_documentKeySet();
  return n.forEach((e2) => r = r.add(e2)), t.getEntries(e, r).next((e2) => {
    let r2 = __PRIVATE_mutableDocumentMap();
    return n.forEach((n2, s) => {
      const o = e2.get(n2);
      s.isFoundDocument() !== o.isFoundDocument() && (i = i.add(n2)), s.isNoDocument() && s.version.isEqual(SnapshotVersion.min()) ? (t.removeEntry(n2, s.readTime), r2 = r2.insert(n2, s)) : !o.isValidDocument() || s.version.compareTo(o.version) > 0 || s.version.compareTo(o.version) === 0 && o.hasPendingWrites ? (t.addEntry(s), r2 = r2.insert(n2, s)) : __PRIVATE_logDebug("LocalStore", "Ignoring outdated watch update for ", n2, ". Current version:", o.version, " Watch version:", s.version);
    }), {
      cs: r2,
      ls: i
    };
  });
};
var __PRIVATE_localStoreAllocateTarget = function(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Allocate target", "readwrite", (e2) => {
    let r;
    return n.Qr.getTargetData(e2, t).next((i) => i ? (r = i, PersistencePromise.resolve(r)) : n.Qr.allocateTargetId(e2).next((i2) => (r = new TargetData(t, i2, "TargetPurposeListen", e2.currentSequenceNumber), n.Qr.addTargetData(e2, r).next(() => r))));
  }).then((e2) => {
    const r = n.ns.get(e2.targetId);
    return (r === null || e2.snapshotVersion.compareTo(r.snapshotVersion) > 0) && (n.ns = n.ns.insert(e2.targetId, e2), n.rs.set(t, e2.targetId)), e2;
  });
};
async function __PRIVATE_localStoreReleaseTarget(e, t, n) {
  const r = __PRIVATE_debugCast(e), i = r.ns.get(t), s = n ? "readwrite" : "readwrite-primary";
  try {
    n || await r.persistence.runTransaction("Release target", s, (e2) => r.persistence.referenceDelegate.removeTarget(e2, i));
  } catch (e2) {
    if (!__PRIVATE_isIndexedDbTransactionError(e2))
      throw e2;
    __PRIVATE_logDebug("LocalStore", `Failed to update sequence numbers for target ${t}: ${e2}`);
  }
  r.ns = r.ns.remove(t), r.rs.delete(i.target);
}
var __PRIVATE_localStoreExecuteQuery = function(e, t, n) {
  const r = __PRIVATE_debugCast(e);
  let i = SnapshotVersion.min(), s = __PRIVATE_documentKeySet();
  return r.persistence.runTransaction("Execute query", "readwrite", (e2) => function __PRIVATE_localStoreGetTargetData(e3, t2, n2) {
    const r2 = __PRIVATE_debugCast(e3), i2 = r2.rs.get(n2);
    return i2 !== undefined ? PersistencePromise.resolve(r2.ns.get(i2)) : r2.Qr.getTargetData(t2, n2);
  }(r, e2, __PRIVATE_queryToTarget(t)).next((t2) => {
    if (t2)
      return i = t2.lastLimboFreeSnapshotVersion, r.Qr.getMatchingKeysForTargetId(e2, t2.targetId).next((e3) => {
        s = e3;
      });
  }).next(() => r.ts.getDocumentsMatchingQuery(e2, t, n ? i : SnapshotVersion.min(), n ? s : __PRIVATE_documentKeySet())).next((e3) => (__PRIVATE_setMaxReadTime(r, __PRIVATE_queryCollectionGroup(t), e3), {
    documents: e3,
    hs: s
  })));
};
var __PRIVATE_setMaxReadTime = function(e, t, n) {
  let r = e.ss.get(t) || SnapshotVersion.min();
  n.forEach((e2, t2) => {
    t2.readTime.compareTo(r) > 0 && (r = t2.readTime);
  }), e.ss.set(t, r);
};
var __PRIVATE_generateUniqueDebugId = function() {
  return Ve === null ? Ve = function __PRIVATE_generateInitialUniqueDebugId() {
    return 268435456 + Math.round(2147483648 * Math.random());
  }() : Ve++, "0x" + Ve.toString(16);
};
var getDocument = function() {
  return typeof document != "undefined" ? document : null;
};
var __PRIVATE_newSerializer = function(e) {
  return new JsonProtoSerializer(e, true);
};
async function __PRIVATE_enableNetworkInternal(e) {
  if (__PRIVATE_canUseNetwork(e))
    for (const t of e.x_)
      await t(true);
}
async function __PRIVATE_disableNetworkInternal(e) {
  for (const t of e.x_)
    await t(false);
}
var __PRIVATE_remoteStoreListen = function(e, t) {
  const n = __PRIVATE_debugCast(e);
  n.F_.has(t.targetId) || (n.F_.set(t.targetId, t), __PRIVATE_shouldStartWatchStream(n) ? __PRIVATE_startWatchStream(n) : __PRIVATE_ensureWatchStream(n).Xo() && __PRIVATE_sendWatchRequest(n, t));
};
var __PRIVATE_remoteStoreUnlisten = function(e, t) {
  const n = __PRIVATE_debugCast(e), r = __PRIVATE_ensureWatchStream(n);
  n.F_.delete(t), r.Xo() && __PRIVATE_sendUnwatchRequest(n, t), n.F_.size === 0 && (r.Xo() ? r.n_() : __PRIVATE_canUseNetwork(n) && n.N_.set("Unknown"));
};
var __PRIVATE_sendWatchRequest = function(e, t) {
  if (e.L_.xe(t.targetId), t.resumeToken.approximateByteSize() > 0 || t.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
    const n = e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;
    t = t.withExpectedCount(n);
  }
  __PRIVATE_ensureWatchStream(e).P_(t);
};
var __PRIVATE_sendUnwatchRequest = function(e, t) {
  e.L_.xe(t), __PRIVATE_ensureWatchStream(e).I_(t);
};
var __PRIVATE_startWatchStream = function(e) {
  e.L_ = new __PRIVATE_WatchChangeAggregator({
    getRemoteKeysForTarget: (t) => e.remoteSyncer.getRemoteKeysForTarget(t),
    ot: (t) => e.F_.get(t) || null,
    tt: () => e.datastore.serializer.databaseId
  }), __PRIVATE_ensureWatchStream(e).start(), e.N_.w_();
};
var __PRIVATE_shouldStartWatchStream = function(e) {
  return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWatchStream(e).Zo() && e.F_.size > 0;
};
var __PRIVATE_canUseNetwork = function(e) {
  return __PRIVATE_debugCast(e).M_.size === 0;
};
var __PRIVATE_cleanUpWatchStreamState = function(e) {
  e.L_ = undefined;
};
async function __PRIVATE_onWatchStreamConnected(e) {
  e.N_.set("Online");
}
async function __PRIVATE_onWatchStreamOpen(e) {
  e.F_.forEach((t, n) => {
    __PRIVATE_sendWatchRequest(e, t);
  });
}
async function __PRIVATE_onWatchStreamClose(e, t) {
  __PRIVATE_cleanUpWatchStreamState(e), __PRIVATE_shouldStartWatchStream(e) ? (e.N_.D_(t), __PRIVATE_startWatchStream(e)) : e.N_.set("Unknown");
}
async function __PRIVATE_onWatchStreamChange(e, t, n) {
  if (e.N_.set("Online"), t instanceof __PRIVATE_WatchTargetChange && t.state === 2 && t.cause)
    try {
      await async function __PRIVATE_handleTargetError(e2, t2) {
        const n2 = t2.cause;
        for (const r of t2.targetIds)
          e2.F_.has(r) && (await e2.remoteSyncer.rejectListen(r, n2), e2.F_.delete(r), e2.L_.removeTarget(r));
      }(e, t);
    } catch (n2) {
      __PRIVATE_logDebug("RemoteStore", "Failed to remove targets %s: %s ", t.targetIds.join(","), n2), await __PRIVATE_disableNetworkUntilRecovery(e, n2);
    }
  else if (t instanceof __PRIVATE_DocumentWatchChange ? e.L_.Ke(t) : t instanceof __PRIVATE_ExistenceFilterChange ? e.L_.He(t) : e.L_.We(t), !n.isEqual(SnapshotVersion.min()))
    try {
      const t2 = await __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore);
      n.compareTo(t2) >= 0 && await function __PRIVATE_raiseWatchSnapshot(e2, t3) {
        const n2 = e2.L_.rt(t3);
        return n2.targetChanges.forEach((n3, r) => {
          if (n3.resumeToken.approximateByteSize() > 0) {
            const i = e2.F_.get(r);
            i && e2.F_.set(r, i.withResumeToken(n3.resumeToken, t3));
          }
        }), n2.targetMismatches.forEach((t4, n3) => {
          const r = e2.F_.get(t4);
          if (!r)
            return;
          e2.F_.set(t4, r.withResumeToken(ByteString.EMPTY_BYTE_STRING, r.snapshotVersion)), __PRIVATE_sendUnwatchRequest(e2, t4);
          const i = new TargetData(r.target, t4, n3, r.sequenceNumber);
          __PRIVATE_sendWatchRequest(e2, i);
        }), e2.remoteSyncer.applyRemoteEvent(n2);
      }(e, n);
    } catch (t2) {
      __PRIVATE_logDebug("RemoteStore", "Failed to raise snapshot:", t2), await __PRIVATE_disableNetworkUntilRecovery(e, t2);
    }
}
async function __PRIVATE_disableNetworkUntilRecovery(e, t, n) {
  if (!__PRIVATE_isIndexedDbTransactionError(t))
    throw t;
  e.M_.add(1), await __PRIVATE_disableNetworkInternal(e), e.N_.set("Offline"), n || (n = () => __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore)), e.asyncQueue.enqueueRetryable(async () => {
    __PRIVATE_logDebug("RemoteStore", "Retrying IndexedDB access"), await n(), e.M_.delete(1), await __PRIVATE_enableNetworkInternal(e);
  });
}
async function __PRIVATE_remoteStoreHandleCredentialChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  n.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug("RemoteStore", "RemoteStore received new credentials");
  const r = __PRIVATE_canUseNetwork(n);
  n.M_.add(3), await __PRIVATE_disableNetworkInternal(n), r && n.N_.set("Unknown"), await n.remoteSyncer.handleCredentialChange(t), n.M_.delete(3), await __PRIVATE_enableNetworkInternal(n);
}
async function __PRIVATE_remoteStoreApplyPrimaryState(e, t) {
  const n = __PRIVATE_debugCast(e);
  t ? (n.M_.delete(2), await __PRIVATE_enableNetworkInternal(n)) : t || (n.M_.add(2), await __PRIVATE_disableNetworkInternal(n), n.N_.set("Unknown"));
}
var __PRIVATE_ensureWatchStream = function(e) {
  return e.B_ || (e.B_ = function __PRIVATE_newPersistentWatchStream(e2, t, n) {
    const r = __PRIVATE_debugCast(e2);
    return r.f_(), new __PRIVATE_PersistentListenStream(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n);
  }(e.datastore, e.asyncQueue, {
    Po: __PRIVATE_onWatchStreamConnected.bind(null, e),
    To: __PRIVATE_onWatchStreamOpen.bind(null, e),
    Ao: __PRIVATE_onWatchStreamClose.bind(null, e),
    h_: __PRIVATE_onWatchStreamChange.bind(null, e)
  }), e.x_.push(async (t) => {
    t ? (e.B_.t_(), __PRIVATE_shouldStartWatchStream(e) ? __PRIVATE_startWatchStream(e) : e.N_.set("Unknown")) : (await e.B_.stop(), __PRIVATE_cleanUpWatchStreamState(e));
  })), e.B_;
};
var __PRIVATE_wrapInUserErrorIfRecoverable = function(e, t) {
  if (__PRIVATE_logError("AsyncQueue", `${t}: ${e}`), __PRIVATE_isIndexedDbTransactionError(e))
    return new FirestoreError(C.UNAVAILABLE, `${t}: ${e}`);
  throw e;
};
async function __PRIVATE_eventManagerListen(e, t) {
  const n = __PRIVATE_debugCast(e);
  let r = 3;
  const i = t.query;
  let s = n.queries.get(i);
  s ? !s.W_() && t.G_() && (r = 2) : (s = new __PRIVATE_QueryListenersInfo, r = t.G_() ? 0 : 1);
  try {
    switch (r) {
      case 0:
        s.K_ = await n.onListen(i, true);
        break;
      case 1:
        s.K_ = await n.onListen(i, false);
        break;
      case 2:
        await n.onFirstRemoteStoreListen(i);
    }
  } catch (e2) {
    const n2 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, `Initialization of query '${__PRIVATE_stringifyQuery(t.query)}' failed`);
    return void t.onError(n2);
  }
  if (n.queries.set(i, s), s.U_.push(t), t.j_(n.onlineState), s.K_) {
    t.H_(s.K_) && __PRIVATE_raiseSnapshotsInSyncEvent(n);
  }
}
async function __PRIVATE_eventManagerUnlisten(e, t) {
  const n = __PRIVATE_debugCast(e), r = t.query;
  let i = 3;
  const s = n.queries.get(r);
  if (s) {
    const e2 = s.U_.indexOf(t);
    e2 >= 0 && (s.U_.splice(e2, 1), s.U_.length === 0 ? i = t.G_() ? 0 : 1 : !s.W_() && t.G_() && (i = 2));
  }
  switch (i) {
    case 0:
      return n.queries.delete(r), n.onUnlisten(r, true);
    case 1:
      return n.queries.delete(r), n.onUnlisten(r, false);
    case 2:
      return n.onLastRemoteStoreUnlisten(r);
    default:
      return;
  }
}
var __PRIVATE_eventManagerOnWatchChange = function(e, t) {
  const n = __PRIVATE_debugCast(e);
  let r = false;
  for (const e2 of t) {
    const t2 = e2.query, i = n.queries.get(t2);
    if (i) {
      for (const t3 of i.U_)
        t3.H_(e2) && (r = true);
      i.K_ = e2;
    }
  }
  r && __PRIVATE_raiseSnapshotsInSyncEvent(n);
};
var __PRIVATE_eventManagerOnWatchError = function(e, t, n) {
  const r = __PRIVATE_debugCast(e), i = r.queries.get(t);
  if (i)
    for (const e2 of i.U_)
      e2.onError(n);
  r.queries.delete(t);
};
var __PRIVATE_raiseSnapshotsInSyncEvent = function(e) {
  e.z_.forEach((e2) => {
    e2.next();
  });
};
async function __PRIVATE_syncEngineListen(e, t, n = true) {
  const r = __PRIVATE_ensureWatchCallbacks(e);
  let i;
  const s = r.ba.get(t);
  return s ? (r.sharedClientState.addLocalQueryTarget(s.targetId), i = s.view.ya()) : i = await __PRIVATE_allocateTargetAndMaybeListen(r, t, n, true), i;
}
async function __PRIVATE_triggerRemoteStoreListen(e, t) {
  const n = __PRIVATE_ensureWatchCallbacks(e);
  await __PRIVATE_allocateTargetAndMaybeListen(n, t, true, false);
}
async function __PRIVATE_allocateTargetAndMaybeListen(e, t, n, r) {
  const i = await __PRIVATE_localStoreAllocateTarget(e.localStore, __PRIVATE_queryToTarget(t)), s = i.targetId, o = n ? e.sharedClientState.addLocalQueryTarget(s) : "not-current";
  let _;
  return r && (_ = await __PRIVATE_initializeViewAndComputeSnapshot(e, t, s, o === "current", i.resumeToken)), e.isPrimaryClient && n && __PRIVATE_remoteStoreListen(e.remoteStore, i), _;
}
async function __PRIVATE_initializeViewAndComputeSnapshot(e, t, n, r, i) {
  e.Ba = (t2, n2, r2) => async function __PRIVATE_applyDocChanges(e2, t3, n3, r3) {
    let i2 = t3.view.da(n3);
    i2.Xi && (i2 = await __PRIVATE_localStoreExecuteQuery(e2.localStore, t3.query, false).then(({ documents: e3 }) => t3.view.da(e3, i2)));
    const s2 = r3 && r3.targetChanges.get(t3.targetId), o2 = r3 && r3.targetMismatches.get(t3.targetId) != null, _2 = t3.view.applyChanges(i2, e2.isPrimaryClient, s2, o2);
    return __PRIVATE_updateTrackedLimbos(e2, t3.targetId, _2.fa), _2.snapshot;
  }(e, t2, n2, r2);
  const s = await __PRIVATE_localStoreExecuteQuery(e.localStore, t, true), o = new __PRIVATE_View(t, s.hs), _ = o.da(s.documents), a = TargetChange.createSynthesizedTargetChangeForCurrentChange(n, r && e.onlineState !== "Offline", i), u = o.applyChanges(_, e.isPrimaryClient, a);
  __PRIVATE_updateTrackedLimbos(e, n, u.fa);
  const c = new __PRIVATE_QueryView(t, n, o);
  return e.ba.set(t, c), e.Da.has(n) ? e.Da.get(n).push(t) : e.Da.set(n, [t]), u.snapshot;
}
async function __PRIVATE_syncEngineUnlisten(e, t, n) {
  const r = __PRIVATE_debugCast(e), i = r.ba.get(t), s = r.Da.get(i.targetId);
  if (s.length > 1)
    return r.Da.set(i.targetId, s.filter((e2) => !__PRIVATE_queryEquals(e2, t))), void r.ba.delete(t);
  if (r.isPrimaryClient) {
    r.sharedClientState.removeLocalQueryTarget(i.targetId);
    r.sharedClientState.isActiveQueryTarget(i.targetId) || await __PRIVATE_localStoreReleaseTarget(r.localStore, i.targetId, false).then(() => {
      r.sharedClientState.clearQueryState(i.targetId), n && __PRIVATE_remoteStoreUnlisten(r.remoteStore, i.targetId), __PRIVATE_removeAndCleanupTarget(r, i.targetId);
    }).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
  } else
    __PRIVATE_removeAndCleanupTarget(r, i.targetId), await __PRIVATE_localStoreReleaseTarget(r.localStore, i.targetId, true);
}
async function __PRIVATE_triggerRemoteStoreUnlisten(e, t) {
  const n = __PRIVATE_debugCast(e), r = n.ba.get(t), i = n.Da.get(r.targetId);
  n.isPrimaryClient && i.length === 1 && (n.sharedClientState.removeLocalQueryTarget(r.targetId), __PRIVATE_remoteStoreUnlisten(n.remoteStore, r.targetId));
}
async function __PRIVATE_syncEngineApplyRemoteEvent(e, t) {
  const n = __PRIVATE_debugCast(e);
  try {
    const e2 = await __PRIVATE_localStoreApplyRemoteEventToLocalCache(n.localStore, t);
    t.targetChanges.forEach((e3, t2) => {
      const r = n.Fa.get(t2);
      r && (__PRIVATE_hardAssert(e3.addedDocuments.size + e3.modifiedDocuments.size + e3.removedDocuments.size <= 1), e3.addedDocuments.size > 0 ? r.wa = true : e3.modifiedDocuments.size > 0 ? __PRIVATE_hardAssert(r.wa) : e3.removedDocuments.size > 0 && (__PRIVATE_hardAssert(r.wa), r.wa = false));
    }), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2, t);
  } catch (e2) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
  }
}
var __PRIVATE_syncEngineApplyOnlineStateChange = function(e, t, n) {
  const r = __PRIVATE_debugCast(e);
  if (r.isPrimaryClient && n === 0 || !r.isPrimaryClient && n === 1) {
    const e2 = [];
    r.ba.forEach((n2, r2) => {
      const i = r2.view.j_(t);
      i.snapshot && e2.push(i.snapshot);
    }), function __PRIVATE_eventManagerOnOnlineStateChange(e3, t2) {
      const n2 = __PRIVATE_debugCast(e3);
      n2.onlineState = t2;
      let r2 = false;
      n2.queries.forEach((e4, n3) => {
        for (const e5 of n3.U_)
          e5.j_(t2) && (r2 = true);
      }), r2 && __PRIVATE_raiseSnapshotsInSyncEvent(n2);
    }(r.eventManager, t), e2.length && r.Sa.h_(e2), r.onlineState = t, r.isPrimaryClient && r.sharedClientState.setOnlineState(t);
  }
};
async function __PRIVATE_syncEngineRejectListen(e, t, n) {
  const r = __PRIVATE_debugCast(e);
  r.sharedClientState.updateQueryState(t, "rejected", n);
  const i = r.Fa.get(t), s = i && i.key;
  if (s) {
    let e2 = new SortedMap(DocumentKey.comparator);
    e2 = e2.insert(s, MutableDocument.newNoDocument(s, SnapshotVersion.min()));
    const n2 = __PRIVATE_documentKeySet().add(s), i2 = new RemoteEvent(SnapshotVersion.min(), new Map, new SortedMap(__PRIVATE_primitiveComparator), e2, n2);
    await __PRIVATE_syncEngineApplyRemoteEvent(r, i2), r.va = r.va.remove(s), r.Fa.delete(t), __PRIVATE_pumpEnqueuedLimboResolutions(r);
  } else
    await __PRIVATE_localStoreReleaseTarget(r.localStore, t, false).then(() => __PRIVATE_removeAndCleanupTarget(r, t, n)).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
}
var __PRIVATE_removeAndCleanupTarget = function(e, t, n = null) {
  e.sharedClientState.removeLocalQueryTarget(t);
  for (const r of e.Da.get(t))
    e.ba.delete(r), n && e.Sa.ka(r, n);
  if (e.Da.delete(t), e.isPrimaryClient) {
    e.Ma.Vr(t).forEach((t2) => {
      e.Ma.containsKey(t2) || __PRIVATE_removeLimboTarget(e, t2);
    });
  }
};
var __PRIVATE_removeLimboTarget = function(e, t) {
  e.Ca.delete(t.path.canonicalString());
  const n = e.va.get(t);
  n !== null && (__PRIVATE_remoteStoreUnlisten(e.remoteStore, n), e.va = e.va.remove(t), e.Fa.delete(n), __PRIVATE_pumpEnqueuedLimboResolutions(e));
};
var __PRIVATE_updateTrackedLimbos = function(e, t, n) {
  for (const r of n)
    if (r instanceof __PRIVATE_AddedLimboDocument)
      e.Ma.addReference(r.key, t), __PRIVATE_trackLimboChange(e, r);
    else if (r instanceof __PRIVATE_RemovedLimboDocument) {
      __PRIVATE_logDebug("SyncEngine", "Document no longer in limbo: " + r.key), e.Ma.removeReference(r.key, t);
      e.Ma.containsKey(r.key) || __PRIVATE_removeLimboTarget(e, r.key);
    } else
      fail();
};
var __PRIVATE_trackLimboChange = function(e, t) {
  const n = t.key, r = n.path.canonicalString();
  e.va.get(n) || e.Ca.has(r) || (__PRIVATE_logDebug("SyncEngine", "New document in limbo: " + n), e.Ca.add(r), __PRIVATE_pumpEnqueuedLimboResolutions(e));
};
var __PRIVATE_pumpEnqueuedLimboResolutions = function(e) {
  for (;e.Ca.size > 0 && e.va.size < e.maxConcurrentLimboResolutions; ) {
    const t = e.Ca.values().next().value;
    e.Ca.delete(t);
    const n = new DocumentKey(ResourcePath.fromString(t)), r = e.Na.next();
    e.Fa.set(r, new LimboResolution(n)), e.va = e.va.insert(n, r), __PRIVATE_remoteStoreListen(e.remoteStore, new TargetData(__PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(n.path)), r, "TargetPurposeLimboResolution", __PRIVATE_ListenSequence.oe));
  }
};
async function __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(e, t, n) {
  const r = __PRIVATE_debugCast(e), i = [], s = [], o = [];
  r.ba.isEmpty() || (r.ba.forEach((e2, _) => {
    o.push(r.Ba(_, t, n).then((e3) => {
      if ((e3 || n) && r.isPrimaryClient) {
        const t2 = e3 && !e3.fromCache;
        r.sharedClientState.updateQueryState(_.targetId, t2 ? "current" : "not-current");
      }
      if (e3) {
        i.push(e3);
        const t2 = __PRIVATE_LocalViewChanges.Ki(_.targetId, e3);
        s.push(t2);
      }
    }));
  }), await Promise.all(o), r.Sa.h_(i), await async function __PRIVATE_localStoreNotifyLocalViewChanges(e2, t2) {
    const n2 = __PRIVATE_debugCast(e2);
    try {
      await n2.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (e3) => PersistencePromise.forEach(t2, (t3) => PersistencePromise.forEach(t3.qi, (r2) => n2.persistence.referenceDelegate.addReference(e3, t3.targetId, r2)).next(() => PersistencePromise.forEach(t3.Qi, (r2) => n2.persistence.referenceDelegate.removeReference(e3, t3.targetId, r2)))));
    } catch (e3) {
      if (!__PRIVATE_isIndexedDbTransactionError(e3))
        throw e3;
      __PRIVATE_logDebug("LocalStore", "Failed to update sequence numbers: " + e3);
    }
    for (const e3 of t2) {
      const t3 = e3.targetId;
      if (!e3.fromCache) {
        const e4 = n2.ns.get(t3), r2 = e4.snapshotVersion, i2 = e4.withLastLimboFreeSnapshotVersion(r2);
        n2.ns = n2.ns.insert(t3, i2);
      }
    }
  }(r.localStore, s));
}
async function __PRIVATE_syncEngineHandleCredentialChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  if (!n.currentUser.isEqual(t)) {
    __PRIVATE_logDebug("SyncEngine", "User change. New user:", t.toKey());
    const e2 = await __PRIVATE_localStoreHandleUserChange(n.localStore, t);
    n.currentUser = t, function __PRIVATE_rejectOutstandingPendingWritesCallbacks(e3, t2) {
      e3.Oa.forEach((e4) => {
        e4.forEach((e5) => {
          e5.reject(new FirestoreError(C.CANCELLED, t2));
        });
      }), e3.Oa.clear();
    }(n, "'waitForPendingWrites' promise is rejected due to a user change."), n.sharedClientState.handleUserChange(t, e2.removedBatchIds, e2.addedBatchIds), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2.us);
  }
}
var __PRIVATE_syncEngineGetRemoteKeysForTarget = function(e, t) {
  const n = __PRIVATE_debugCast(e), r = n.Fa.get(t);
  if (r && r.wa)
    return __PRIVATE_documentKeySet().add(r.key);
  {
    let e2 = __PRIVATE_documentKeySet();
    const r2 = n.Da.get(t);
    if (!r2)
      return e2;
    for (const t2 of r2) {
      const r3 = n.ba.get(t2);
      e2 = e2.unionWith(r3.view.Ea);
    }
    return e2;
  }
};
var __PRIVATE_ensureWatchCallbacks = function(e) {
  const t = __PRIVATE_debugCast(e);
  return t.remoteStore.remoteSyncer.applyRemoteEvent = __PRIVATE_syncEngineApplyRemoteEvent.bind(null, t), t.remoteStore.remoteSyncer.getRemoteKeysForTarget = __PRIVATE_syncEngineGetRemoteKeysForTarget.bind(null, t), t.remoteStore.remoteSyncer.rejectListen = __PRIVATE_syncEngineRejectListen.bind(null, t), t.Sa.h_ = __PRIVATE_eventManagerOnWatchChange.bind(null, t.eventManager), t.Sa.ka = __PRIVATE_eventManagerOnWatchError.bind(null, t.eventManager), t;
};
async function __PRIVATE_setOfflineComponentProvider(e, t) {
  e.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug("FirestoreClient", "Initializing OfflineComponentProvider");
  const n = e.configuration;
  await t.initialize(n);
  let r = n.initialUser;
  e.setCredentialChangeListener(async (e2) => {
    r.isEqual(e2) || (await __PRIVATE_localStoreHandleUserChange(t.localStore, e2), r = e2);
  }), t.persistence.setDatabaseDeletedListener(() => e.terminate()), e._offlineComponents = t;
}
async function __PRIVATE_setOnlineComponentProvider(e, t) {
  e.asyncQueue.verifyOperationInProgress();
  const n = await __PRIVATE_ensureOfflineComponents(e);
  __PRIVATE_logDebug("FirestoreClient", "Initializing OnlineComponentProvider"), await t.initialize(n, e.configuration), e.setCredentialChangeListener((e2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, e2)), e.setAppCheckTokenChangeListener((e2, n2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, n2)), e._onlineComponents = t;
}
var __PRIVATE_canFallbackFromIndexedDbError = function(e) {
  return e.name === "FirebaseError" ? e.code === C.FAILED_PRECONDITION || e.code === C.UNIMPLEMENTED : !(typeof DOMException != "undefined" && e instanceof DOMException) || (e.code === 22 || e.code === 20 || e.code === 11);
};
async function __PRIVATE_ensureOfflineComponents(e) {
  if (!e._offlineComponents)
    if (e._uninitializedComponentsProvider) {
      __PRIVATE_logDebug("FirestoreClient", "Using user provided OfflineComponentProvider");
      try {
        await __PRIVATE_setOfflineComponentProvider(e, e._uninitializedComponentsProvider._offline);
      } catch (t) {
        const n = t;
        if (!__PRIVATE_canFallbackFromIndexedDbError(n))
          throw n;
        __PRIVATE_logWarn("Error using user provided cache. Falling back to memory cache: " + n), await __PRIVATE_setOfflineComponentProvider(e, new MemoryOfflineComponentProvider);
      }
    } else
      __PRIVATE_logDebug("FirestoreClient", "Using default OfflineComponentProvider"), await __PRIVATE_setOfflineComponentProvider(e, new MemoryOfflineComponentProvider);
  return e._offlineComponents;
}
async function __PRIVATE_ensureOnlineComponents(e) {
  return e._onlineComponents || (e._uninitializedComponentsProvider ? (__PRIVATE_logDebug("FirestoreClient", "Using user provided OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, e._uninitializedComponentsProvider._online)) : (__PRIVATE_logDebug("FirestoreClient", "Using default OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, new OnlineComponentProvider))), e._onlineComponents;
}
async function __PRIVATE_getEventManager(e) {
  const t = await __PRIVATE_ensureOnlineComponents(e), n = t.eventManager;
  return n.onListen = __PRIVATE_syncEngineListen.bind(null, t.syncEngine), n.onUnlisten = __PRIVATE_syncEngineUnlisten.bind(null, t.syncEngine), n.onFirstRemoteStoreListen = __PRIVATE_triggerRemoteStoreListen.bind(null, t.syncEngine), n.onLastRemoteStoreUnlisten = __PRIVATE_triggerRemoteStoreUnlisten.bind(null, t.syncEngine), n;
}
var __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener = function(e, t, n = {}) {
  const r = new __PRIVATE_Deferred;
  return e.asyncQueue.enqueueAndForget(async () => function __PRIVATE_executeQueryViaSnapshotListener(e2, t2, n2, r2, i) {
    const s = new __PRIVATE_AsyncObserver({
      next: (n3) => {
        t2.enqueueAndForget(() => __PRIVATE_eventManagerUnlisten(e2, o)), n3.fromCache && r2.source === "server" ? i.reject(new FirestoreError(C.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n3);
      },
      error: (e3) => i.reject(e3)
    }), o = new __PRIVATE_QueryListener(n2, s, {
      includeMetadataChanges: true,
      ra: true
    });
    return __PRIVATE_eventManagerListen(e2, o);
  }(await __PRIVATE_getEventManager(e), e.asyncQueue, t, n, r)), r.promise;
};
var __PRIVATE_cloneLongPollingOptions = function(e) {
  const t = {};
  return e.timeoutSeconds !== undefined && (t.timeoutSeconds = e.timeoutSeconds), t;
};
var __PRIVATE_validateNonEmptyArgument = function(e, t, n) {
  if (!n)
    throw new FirestoreError(C.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
};
var __PRIVATE_validateIsNotUsedTogether = function(e, t, n, r) {
  if (t === true && r === true)
    throw new FirestoreError(C.INVALID_ARGUMENT, `${e} and ${n} cannot be used together.`);
};
var __PRIVATE_validateCollectionPath = function(e) {
  if (DocumentKey.isDocumentKey(e))
    throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
};
var __PRIVATE_valueDescription = function(e) {
  if (e === undefined)
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "string")
    return e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e);
  if (typeof e == "number" || typeof e == "boolean")
    return "" + e;
  if (typeof e == "object") {
    if (e instanceof Array)
      return "an array";
    {
      const t = function __PRIVATE_tryGetCustomObjectType(e2) {
        if (e2.constructor)
          return e2.constructor.name;
        return null;
      }(e);
      return t ? `a custom ${t} object` : "an object";
    }
  }
  return typeof e == "function" ? "a function" : fail();
};
var __PRIVATE_cast = function(e, t) {
  if ("_delegate" in e && (e = e._delegate), !(e instanceof t)) {
    if (t.name === e.constructor.name)
      throw new FirestoreError(C.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
    {
      const n = __PRIVATE_valueDescription(e);
      throw new FirestoreError(C.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
    }
  }
  return e;
};
var connectFirestoreEmulator = function(e, t, n, r = {}) {
  var i;
  const s = (e = __PRIVATE_cast(e, Firestore$1))._getSettings(), o = `${t}:${n}`;
  if (s.host !== "firestore.googleapis.com" && s.host !== o && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."), e._setSettings(Object.assign(Object.assign({}, s), {
    host: o,
    ssl: false
  })), r.mockUserToken) {
    let t2, n2;
    if (typeof r.mockUserToken == "string")
      t2 = r.mockUserToken, n2 = User.MOCK_USER;
    else {
      t2 = createMockUserToken(r.mockUserToken, (i = e._app) === null || i === undefined ? undefined : i.options.projectId);
      const s2 = r.mockUserToken.sub || r.mockUserToken.user_id;
      if (!s2)
        throw new FirestoreError(C.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
      n2 = new User(s2);
    }
    e._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t2, n2));
  }
};
var collection = function(e, t, ...n) {
  if (e = getModularInstance(e), __PRIVATE_validateNonEmptyArgument("collection", "path", t), e instanceof Firestore$1) {
    const r = ResourcePath.fromString(t, ...n);
    return __PRIVATE_validateCollectionPath(r), new CollectionReference(e, null, r);
  }
  {
    if (!(e instanceof DocumentReference || e instanceof CollectionReference))
      throw new FirestoreError(C.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r = e._path.child(ResourcePath.fromString(t, ...n));
    return __PRIVATE_validateCollectionPath(r), new CollectionReference(e.firestore, null, r);
  }
};
var getFirestore = function(t, n) {
  const r = typeof t == "object" ? t : getApp(), i = typeof t == "string" ? t : n || "(default)", s = _getProvider(r, "firestore").getImmediate({
    identifier: i
  });
  if (!s._initialized) {
    const e = getDefaultEmulatorHostnameAndPort("firestore");
    e && connectFirestoreEmulator(s, ...e);
  }
  return s;
};
var ensureFirestoreConfigured = function(e) {
  return e._firestoreClient || __PRIVATE_configureFirestore(e), e._firestoreClient.verifyNotTerminated(), e._firestoreClient;
};
var __PRIVATE_configureFirestore = function(e) {
  var t, n, r;
  const i = e._freezeSettings(), s = function __PRIVATE_makeDatabaseInfo(e2, t2, n2, r2) {
    return new DatabaseInfo(e2, t2, n2, r2.host, r2.ssl, r2.experimentalForceLongPolling, r2.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(r2.experimentalLongPollingOptions), r2.useFetchStreams);
  }(e._databaseId, ((t = e._app) === null || t === undefined ? undefined : t.options.appId) || "", e._persistenceKey, i);
  e._firestoreClient = new FirestoreClient(e._authCredentials, e._appCheckCredentials, e._queue, s), ((n = i.localCache) === null || n === undefined ? undefined : n._offlineComponentProvider) && ((r = i.localCache) === null || r === undefined ? undefined : r._onlineComponentProvider) && (e._firestoreClient._uninitializedComponentsProvider = {
    _offlineKind: i.localCache.kind,
    _offline: i.localCache._offlineComponentProvider,
    _online: i.localCache._onlineComponentProvider
  });
};
var __PRIVATE_fieldPathFromDotSeparatedString = function(e, t, n) {
  if (t.search(be) >= 0)
    throw __PRIVATE_createError(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`, e, false, undefined, n);
  try {
    return new FieldPath(...t.split("."))._internalPath;
  } catch (r) {
    throw __PRIVATE_createError(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, e, false, undefined, n);
  }
};
var __PRIVATE_createError = function(e, t, n, r, i) {
  const s = r && !r.isEmpty(), o = i !== undefined;
  let _ = `Function ${t}() called with invalid data`;
  n && (_ += " (via `toFirestore()`)"), _ += ". ";
  let a = "";
  return (s || o) && (a += " (found", s && (a += ` in field ${r}`), o && (a += ` in document ${i}`), a += ")"), new FirestoreError(C.INVALID_ARGUMENT, _ + e + a);
};
var __PRIVATE_fieldPathFromArgument = function(e, t) {
  return typeof t == "string" ? __PRIVATE_fieldPathFromDotSeparatedString(e, t) : t instanceof FieldPath ? t._internalPath : t._delegate._internalPath;
};
var __PRIVATE_validateHasExplicitOrderByForLimitToLast = function(e) {
  if (e.limitType === "L" && e.explicitOrderBy.length === 0)
    throw new FirestoreError(C.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
};
var __PRIVATE_resultChangeType = function(e) {
  switch (e) {
    case 0:
      return "added";
    case 2:
    case 3:
      return "modified";
    case 1:
      return "removed";
    default:
      return fail();
  }
};
var getDocs = function(e) {
  e = __PRIVATE_cast(e, Query);
  const t = __PRIVATE_cast(e.firestore, Firestore), n = ensureFirestoreConfigured(t), r = new __PRIVATE_ExpUserDataWriter(t);
  return __PRIVATE_validateHasExplicitOrderByForLimitToLast(e._query), __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(n, e._query).then((n2) => new QuerySnapshot(t, r, e, n2));
};
var S = "@firebase/firestore";

class User {
  constructor(e) {
    this.uid = e;
  }
  isAuthenticated() {
    return this.uid != null;
  }
  toKey() {
    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
  }
  isEqual(e) {
    return e.uid === this.uid;
  }
}
User.UNAUTHENTICATED = new User(null), User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), User.MOCK_USER = new User("mock-user");
var b = "10.12.1";
var D = new Logger("@firebase/firestore");
var C = {
  OK: "ok",
  CANCELLED: "cancelled",
  UNKNOWN: "unknown",
  INVALID_ARGUMENT: "invalid-argument",
  DEADLINE_EXCEEDED: "deadline-exceeded",
  NOT_FOUND: "not-found",
  ALREADY_EXISTS: "already-exists",
  PERMISSION_DENIED: "permission-denied",
  UNAUTHENTICATED: "unauthenticated",
  RESOURCE_EXHAUSTED: "resource-exhausted",
  FAILED_PRECONDITION: "failed-precondition",
  ABORTED: "aborted",
  OUT_OF_RANGE: "out-of-range",
  UNIMPLEMENTED: "unimplemented",
  INTERNAL: "internal",
  UNAVAILABLE: "unavailable",
  DATA_LOSS: "data-loss"
};

class FirestoreError extends FirebaseError {
  constructor(e, t) {
    super(e, t), this.code = e, this.message = t, this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
  }
}

class __PRIVATE_Deferred {
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}

class __PRIVATE_OAuthToken {
  constructor(e, t) {
    this.user = t, this.type = "OAuth", this.headers = new Map, this.headers.set("Authorization", `Bearer ${e}`);
  }
}

class __PRIVATE_EmptyAuthCredentialsProvider {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {
  }
  start(e, t) {
    e.enqueueRetryable(() => t(User.UNAUTHENTICATED));
  }
  shutdown() {
  }
}

class __PRIVATE_EmulatorAuthCredentialsProvider {
  constructor(e) {
    this.token = e, this.changeListener = null;
  }
  getToken() {
    return Promise.resolve(this.token);
  }
  invalidateToken() {
  }
  start(e, t) {
    this.changeListener = t, e.enqueueRetryable(() => t(this.token.user));
  }
  shutdown() {
    this.changeListener = null;
  }
}

class __PRIVATE_FirebaseAuthCredentialsProvider {
  constructor(e) {
    this.t = e, this.currentUser = User.UNAUTHENTICATED, this.i = 0, this.forceRefresh = false, this.auth = null;
  }
  start(e, t) {
    let n = this.i;
    const __PRIVATE_guardedChangeListener = (e2) => this.i !== n ? (n = this.i, t(e2)) : Promise.resolve();
    let r = new __PRIVATE_Deferred;
    this.o = () => {
      this.i++, this.currentUser = this.u(), r.resolve(), r = new __PRIVATE_Deferred, e.enqueueRetryable(() => __PRIVATE_guardedChangeListener(this.currentUser));
    };
    const __PRIVATE_awaitNextToken = () => {
      const t2 = r;
      e.enqueueRetryable(async () => {
        await t2.promise, await __PRIVATE_guardedChangeListener(this.currentUser);
      });
    }, __PRIVATE_registerAuth = (e2) => {
      __PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e2, this.auth.addAuthTokenListener(this.o), __PRIVATE_awaitNextToken();
    };
    this.t.onInit((e2) => __PRIVATE_registerAuth(e2)), setTimeout(() => {
      if (!this.auth) {
        const e2 = this.t.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAuth(e2) : (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth not yet detected"), r.resolve(), r = new __PRIVATE_Deferred);
      }
    }, 0), __PRIVATE_awaitNextToken();
  }
  getToken() {
    const e = this.i, t = this.forceRefresh;
    return this.forceRefresh = false, this.auth ? this.auth.getToken(t).then((t2) => this.i !== e ? (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : t2 ? (__PRIVATE_hardAssert(typeof t2.accessToken == "string"), new __PRIVATE_OAuthToken(t2.accessToken, this.currentUser)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.auth && this.auth.removeAuthTokenListener(this.o);
  }
  u() {
    const e = this.auth && this.auth.getUid();
    return __PRIVATE_hardAssert(e === null || typeof e == "string"), new User(e);
  }
}

class __PRIVATE_FirstPartyToken {
  constructor(e, t, n) {
    this.l = e, this.h = t, this.P = n, this.type = "FirstParty", this.user = User.FIRST_PARTY, this.I = new Map;
  }
  T() {
    return this.P ? this.P() : null;
  }
  get headers() {
    this.I.set("X-Goog-AuthUser", this.l);
    const e = this.T();
    return e && this.I.set("Authorization", e), this.h && this.I.set("X-Goog-Iam-Authorization-Token", this.h), this.I;
  }
}

class __PRIVATE_FirstPartyAuthCredentialsProvider {
  constructor(e, t, n) {
    this.l = e, this.h = t, this.P = n;
  }
  getToken() {
    return Promise.resolve(new __PRIVATE_FirstPartyToken(this.l, this.h, this.P));
  }
  start(e, t) {
    e.enqueueRetryable(() => t(User.FIRST_PARTY));
  }
  shutdown() {
  }
  invalidateToken() {
  }
}

class AppCheckToken {
  constructor(e) {
    this.value = e, this.type = "AppCheck", this.headers = new Map, e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
  }
}

class __PRIVATE_FirebaseAppCheckTokenProvider {
  constructor(e) {
    this.A = e, this.forceRefresh = false, this.appCheck = null, this.R = null;
  }
  start(e, t) {
    const onTokenChanged = (e2) => {
      e2.error != null && __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e2.error.message}`);
      const n = e2.token !== this.R;
      return this.R = e2.token, __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Received ${n ? "new" : "existing"} token.`), n ? t(e2.token) : Promise.resolve();
    };
    this.o = (t2) => {
      e.enqueueRetryable(() => onTokenChanged(t2));
    };
    const __PRIVATE_registerAppCheck = (e2) => {
      __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e2, this.appCheck.addTokenListener(this.o);
    };
    this.A.onInit((e2) => __PRIVATE_registerAppCheck(e2)), setTimeout(() => {
      if (!this.appCheck) {
        const e2 = this.A.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAppCheck(e2) : __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck not yet detected");
      }
    }, 0);
  }
  getToken() {
    const e = this.forceRefresh;
    return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(e).then((e2) => e2 ? (__PRIVATE_hardAssert(typeof e2.token == "string"), this.R = e2.token, new AppCheckToken(e2.token)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.appCheck && this.appCheck.removeTokenListener(this.o);
  }
}
class __PRIVATE_AutoId {
  static newId() {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = Math.floor(256 / e.length) * e.length;
    let n = "";
    for (;n.length < 20; ) {
      const r = __PRIVATE_randomBytes(40);
      for (let i = 0;i < r.length; ++i)
        n.length < 20 && r[i] < t && (n += e.charAt(r[i] % e.length));
    }
    return n;
  }
}

class Timestamp {
  constructor(e, t) {
    if (this.seconds = e, this.nanoseconds = t, t < 0)
      throw new FirestoreError(C.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (t >= 1e9)
      throw new FirestoreError(C.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (e < -62135596800)
      throw new FirestoreError(C.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
    if (e >= 253402300800)
      throw new FirestoreError(C.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
  }
  static now() {
    return Timestamp.fromMillis(Date.now());
  }
  static fromDate(e) {
    return Timestamp.fromMillis(e.getTime());
  }
  static fromMillis(e) {
    const t = Math.floor(e / 1000), n = Math.floor(1e6 * (e - 1000 * t));
    return new Timestamp(t, n);
  }
  toDate() {
    return new Date(this.toMillis());
  }
  toMillis() {
    return 1000 * this.seconds + this.nanoseconds / 1e6;
  }
  _compareTo(e) {
    return this.seconds === e.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e.seconds);
  }
  isEqual(e) {
    return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
  }
  toString() {
    return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
  }
  toJSON() {
    return {
      seconds: this.seconds,
      nanoseconds: this.nanoseconds
    };
  }
  valueOf() {
    const e = this.seconds - -62135596800;
    return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
  }
}

class SnapshotVersion {
  constructor(e) {
    this.timestamp = e;
  }
  static fromTimestamp(e) {
    return new SnapshotVersion(e);
  }
  static min() {
    return new SnapshotVersion(new Timestamp(0, 0));
  }
  static max() {
    return new SnapshotVersion(new Timestamp(253402300799, 999999999));
  }
  compareTo(e) {
    return this.timestamp._compareTo(e.timestamp);
  }
  isEqual(e) {
    return this.timestamp.isEqual(e.timestamp);
  }
  toMicroseconds() {
    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1000;
  }
  toString() {
    return "SnapshotVersion(" + this.timestamp.toString() + ")";
  }
  toTimestamp() {
    return this.timestamp;
  }
}

class BasePath {
  constructor(e, t, n) {
    t === undefined ? t = 0 : t > e.length && fail(), n === undefined ? n = e.length - t : n > e.length - t && fail(), this.segments = e, this.offset = t, this.len = n;
  }
  get length() {
    return this.len;
  }
  isEqual(e) {
    return BasePath.comparator(this, e) === 0;
  }
  child(e) {
    const t = this.segments.slice(this.offset, this.limit());
    return e instanceof BasePath ? e.forEach((e2) => {
      t.push(e2);
    }) : t.push(e), this.construct(t);
  }
  limit() {
    return this.offset + this.length;
  }
  popFirst(e) {
    return e = e === undefined ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
  }
  popLast() {
    return this.construct(this.segments, this.offset, this.length - 1);
  }
  firstSegment() {
    return this.segments[this.offset];
  }
  lastSegment() {
    return this.get(this.length - 1);
  }
  get(e) {
    return this.segments[this.offset + e];
  }
  isEmpty() {
    return this.length === 0;
  }
  isPrefixOf(e) {
    if (e.length < this.length)
      return false;
    for (let t = 0;t < this.length; t++)
      if (this.get(t) !== e.get(t))
        return false;
    return true;
  }
  isImmediateParentOf(e) {
    if (this.length + 1 !== e.length)
      return false;
    for (let t = 0;t < this.length; t++)
      if (this.get(t) !== e.get(t))
        return false;
    return true;
  }
  forEach(e) {
    for (let t = this.offset, n = this.limit();t < n; t++)
      e(this.segments[t]);
  }
  toArray() {
    return this.segments.slice(this.offset, this.limit());
  }
  static comparator(e, t) {
    const n = Math.min(e.length, t.length);
    for (let r = 0;r < n; r++) {
      const n2 = e.get(r), i = t.get(r);
      if (n2 < i)
        return -1;
      if (n2 > i)
        return 1;
    }
    return e.length < t.length ? -1 : e.length > t.length ? 1 : 0;
  }
}

class ResourcePath extends BasePath {
  construct(e, t, n) {
    return new ResourcePath(e, t, n);
  }
  canonicalString() {
    return this.toArray().join("/");
  }
  toString() {
    return this.canonicalString();
  }
  toUriEncodedString() {
    return this.toArray().map(encodeURIComponent).join("/");
  }
  static fromString(...e) {
    const t = [];
    for (const n of e) {
      if (n.indexOf("//") >= 0)
        throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
      t.push(...n.split("/").filter((e2) => e2.length > 0));
    }
    return new ResourcePath(t);
  }
  static emptyPath() {
    return new ResourcePath([]);
  }
}
var v = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

class FieldPath$1 extends BasePath {
  construct(e, t, n) {
    return new FieldPath$1(e, t, n);
  }
  static isValidIdentifier(e) {
    return v.test(e);
  }
  canonicalString() {
    return this.toArray().map((e) => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), FieldPath$1.isValidIdentifier(e) || (e = "`" + e + "`"), e)).join(".");
  }
  toString() {
    return this.canonicalString();
  }
  isKeyField() {
    return this.length === 1 && this.get(0) === "__name__";
  }
  static keyField() {
    return new FieldPath$1(["__name__"]);
  }
  static fromServerFormat(e) {
    const t = [];
    let n = "", r = 0;
    const __PRIVATE_addCurrentSegment = () => {
      if (n.length === 0)
        throw new FirestoreError(C.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
      t.push(n), n = "";
    };
    let i = false;
    for (;r < e.length; ) {
      const t2 = e[r];
      if (t2 === "\\") {
        if (r + 1 === e.length)
          throw new FirestoreError(C.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
        const t3 = e[r + 1];
        if (t3 !== "\\" && t3 !== "." && t3 !== "`")
          throw new FirestoreError(C.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
        n += t3, r += 2;
      } else
        t2 === "`" ? (i = !i, r++) : t2 !== "." || i ? (n += t2, r++) : (__PRIVATE_addCurrentSegment(), r++);
    }
    if (__PRIVATE_addCurrentSegment(), i)
      throw new FirestoreError(C.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
    return new FieldPath$1(t);
  }
  static emptyPath() {
    return new FieldPath$1([]);
  }
}

class DocumentKey {
  constructor(e) {
    this.path = e;
  }
  static fromPath(e) {
    return new DocumentKey(ResourcePath.fromString(e));
  }
  static fromName(e) {
    return new DocumentKey(ResourcePath.fromString(e).popFirst(5));
  }
  static empty() {
    return new DocumentKey(ResourcePath.emptyPath());
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment();
  }
  hasCollectionId(e) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
  }
  getCollectionGroup() {
    return this.path.get(this.path.length - 2);
  }
  getCollectionPath() {
    return this.path.popLast();
  }
  isEqual(e) {
    return e !== null && ResourcePath.comparator(this.path, e.path) === 0;
  }
  toString() {
    return this.path.toString();
  }
  static comparator(e, t) {
    return ResourcePath.comparator(e.path, t.path);
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0;
  }
  static fromSegments(e) {
    return new DocumentKey(new ResourcePath(e.slice()));
  }
}

class FieldIndex {
  constructor(e, t, n, r) {
    this.indexId = e, this.collectionGroup = t, this.fields = n, this.indexState = r;
  }
}
FieldIndex.UNKNOWN_ID = -1;
class IndexOffset {
  constructor(e, t, n) {
    this.readTime = e, this.documentKey = t, this.largestBatchId = n;
  }
  static min() {
    return new IndexOffset(SnapshotVersion.min(), DocumentKey.empty(), -1);
  }
  static max() {
    return new IndexOffset(SnapshotVersion.max(), DocumentKey.empty(), -1);
  }
}
var F = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";

class PersistenceTransaction {
  constructor() {
    this.onCommittedListeners = [];
  }
  addOnCommittedListener(e) {
    this.onCommittedListeners.push(e);
  }
  raiseOnCommittedEvent() {
    this.onCommittedListeners.forEach((e) => e());
  }
}

class PersistencePromise {
  constructor(e) {
    this.nextCallback = null, this.catchCallback = null, this.result = undefined, this.error = undefined, this.isDone = false, this.callbackAttached = false, e((e2) => {
      this.isDone = true, this.result = e2, this.nextCallback && this.nextCallback(e2);
    }, (e2) => {
      this.isDone = true, this.error = e2, this.catchCallback && this.catchCallback(e2);
    });
  }
  catch(e) {
    return this.next(undefined, e);
  }
  next(e, t) {
    return this.callbackAttached && fail(), this.callbackAttached = true, this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new PersistencePromise((n, r) => {
      this.nextCallback = (t2) => {
        this.wrapSuccess(e, t2).next(n, r);
      }, this.catchCallback = (e2) => {
        this.wrapFailure(t, e2).next(n, r);
      };
    });
  }
  toPromise() {
    return new Promise((e, t) => {
      this.next(e, t);
    });
  }
  wrapUserFunction(e) {
    try {
      const t = e();
      return t instanceof PersistencePromise ? t : PersistencePromise.resolve(t);
    } catch (e2) {
      return PersistencePromise.reject(e2);
    }
  }
  wrapSuccess(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : PersistencePromise.resolve(t);
  }
  wrapFailure(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : PersistencePromise.reject(t);
  }
  static resolve(e) {
    return new PersistencePromise((t, n) => {
      t(e);
    });
  }
  static reject(e) {
    return new PersistencePromise((t, n) => {
      n(e);
    });
  }
  static waitFor(e) {
    return new PersistencePromise((t, n) => {
      let r = 0, i = 0, s = false;
      e.forEach((e2) => {
        ++r, e2.next(() => {
          ++i, s && i === r && t();
        }, (e3) => n(e3));
      }), s = true, i === r && t();
    });
  }
  static or(e) {
    let t = PersistencePromise.resolve(false);
    for (const n of e)
      t = t.next((e2) => e2 ? PersistencePromise.resolve(e2) : n());
    return t;
  }
  static forEach(e, t) {
    const n = [];
    return e.forEach((e2, r) => {
      n.push(t.call(this, e2, r));
    }), this.waitFor(n);
  }
  static mapArray(e, t) {
    return new PersistencePromise((n, r) => {
      const i = e.length, s = new Array(i);
      let o = 0;
      for (let _ = 0;_ < i; _++) {
        const a = _;
        t(e[a]).next((e2) => {
          s[a] = e2, ++o, o === i && n(s);
        }, (e2) => r(e2));
      }
    });
  }
  static doWhile(e, t) {
    return new PersistencePromise((n, r) => {
      const process2 = () => {
        e() === true ? t().next(() => {
          process2();
        }, r) : n();
      };
      process2();
    });
  }
}
class __PRIVATE_ListenSequence {
  constructor(e, t) {
    this.previousValue = e, t && (t.sequenceNumberHandler = (e2) => this.ie(e2), this.se = (e2) => t.writeSequenceNumber(e2));
  }
  ie(e) {
    return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
  }
  next() {
    const e = ++this.previousValue;
    return this.se && this.se(e), e;
  }
}
__PRIVATE_ListenSequence.oe = -1;
var J = [...[...[...[...["mutationQueues", "mutations", "documentMutations", "remoteDocuments", "targets", "owner", "targetGlobal", "targetDocuments"], "clientMetadata"], "remoteDocumentGlobal"], "collectionParents"], "bundles", "namedQueries"];
var Y = [...J, "documentOverlays"];
var Z = ["mutationQueues", "mutations", "documentMutations", "remoteDocumentsV14", "targets", "owner", "targetGlobal", "targetDocuments", "clientMetadata", "remoteDocumentGlobal", "collectionParents", "bundles", "namedQueries", "documentOverlays"];
var X = Z;
var ee = [...X, "indexConfiguration", "indexState", "indexEntries"];
class SortedMap {
  constructor(e, t) {
    this.comparator = e, this.root = t || LLRBNode.EMPTY;
  }
  insert(e, t) {
    return new SortedMap(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  remove(e) {
    return new SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  get(e) {
    let t = this.root;
    for (;!t.isEmpty(); ) {
      const n = this.comparator(e, t.key);
      if (n === 0)
        return t.value;
      n < 0 ? t = t.left : n > 0 && (t = t.right);
    }
    return null;
  }
  indexOf(e) {
    let t = 0, n = this.root;
    for (;!n.isEmpty(); ) {
      const r = this.comparator(e, n.key);
      if (r === 0)
        return t + n.left.size;
      r < 0 ? n = n.left : (t += n.left.size + 1, n = n.right);
    }
    return -1;
  }
  isEmpty() {
    return this.root.isEmpty();
  }
  get size() {
    return this.root.size;
  }
  minKey() {
    return this.root.minKey();
  }
  maxKey() {
    return this.root.maxKey();
  }
  inorderTraversal(e) {
    return this.root.inorderTraversal(e);
  }
  forEach(e) {
    this.inorderTraversal((t, n) => (e(t, n), false));
  }
  toString() {
    const e = [];
    return this.inorderTraversal((t, n) => (e.push(`${t}:${n}`), false)), `{${e.join(", ")}}`;
  }
  reverseTraversal(e) {
    return this.root.reverseTraversal(e);
  }
  getIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, false);
  }
  getIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, false);
  }
  getReverseIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, true);
  }
  getReverseIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, true);
  }
}

class SortedMapIterator {
  constructor(e, t, n, r) {
    this.isReverse = r, this.nodeStack = [];
    let i = 1;
    for (;!e.isEmpty(); )
      if (i = t ? n(e.key, t) : 1, t && r && (i *= -1), i < 0)
        e = this.isReverse ? e.left : e.right;
      else {
        if (i === 0) {
          this.nodeStack.push(e);
          break;
        }
        this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
      }
  }
  getNext() {
    let e = this.nodeStack.pop();
    const t = {
      key: e.key,
      value: e.value
    };
    if (this.isReverse)
      for (e = e.left;!e.isEmpty(); )
        this.nodeStack.push(e), e = e.right;
    else
      for (e = e.right;!e.isEmpty(); )
        this.nodeStack.push(e), e = e.left;
    return t;
  }
  hasNext() {
    return this.nodeStack.length > 0;
  }
  peek() {
    if (this.nodeStack.length === 0)
      return null;
    const e = this.nodeStack[this.nodeStack.length - 1];
    return {
      key: e.key,
      value: e.value
    };
  }
}

class LLRBNode {
  constructor(e, t, n, r, i) {
    this.key = e, this.value = t, this.color = n != null ? n : LLRBNode.RED, this.left = r != null ? r : LLRBNode.EMPTY, this.right = i != null ? i : LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
  }
  copy(e, t, n, r, i) {
    return new LLRBNode(e != null ? e : this.key, t != null ? t : this.value, n != null ? n : this.color, r != null ? r : this.left, i != null ? i : this.right);
  }
  isEmpty() {
    return false;
  }
  inorderTraversal(e) {
    return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
  }
  reverseTraversal(e) {
    return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
  }
  min() {
    return this.left.isEmpty() ? this : this.left.min();
  }
  minKey() {
    return this.min().key;
  }
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  insert(e, t, n) {
    let r = this;
    const i = n(e, r.key);
    return r = i < 0 ? r.copy(null, null, null, r.left.insert(e, t, n), null) : i === 0 ? r.copy(null, t, null, null, null) : r.copy(null, null, null, null, r.right.insert(e, t, n)), r.fixUp();
  }
  removeMin() {
    if (this.left.isEmpty())
      return LLRBNode.EMPTY;
    let e = this;
    return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
  }
  remove(e, t) {
    let n, r = this;
    if (t(e, r.key) < 0)
      r.left.isEmpty() || r.left.isRed() || r.left.left.isRed() || (r = r.moveRedLeft()), r = r.copy(null, null, null, r.left.remove(e, t), null);
    else {
      if (r.left.isRed() && (r = r.rotateRight()), r.right.isEmpty() || r.right.isRed() || r.right.left.isRed() || (r = r.moveRedRight()), t(e, r.key) === 0) {
        if (r.right.isEmpty())
          return LLRBNode.EMPTY;
        n = r.right.min(), r = r.copy(n.key, n.value, null, null, r.right.removeMin());
      }
      r = r.copy(null, null, null, null, r.right.remove(e, t));
    }
    return r.fixUp();
  }
  isRed() {
    return this.color;
  }
  fixUp() {
    let e = this;
    return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
  }
  moveRedLeft() {
    let e = this.colorFlip();
    return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
  }
  moveRedRight() {
    let e = this.colorFlip();
    return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
  }
  rotateLeft() {
    const e = this.copy(null, null, LLRBNode.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, e, null);
  }
  rotateRight() {
    const e = this.copy(null, null, LLRBNode.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, e);
  }
  colorFlip() {
    const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, e, t);
  }
  checkMaxDepth() {
    const e = this.check();
    return Math.pow(2, e) <= this.size + 1;
  }
  check() {
    if (this.isRed() && this.left.isRed())
      throw fail();
    if (this.right.isRed())
      throw fail();
    const e = this.left.check();
    if (e !== this.right.check())
      throw fail();
    return e + (this.isRed() ? 0 : 1);
  }
}
LLRBNode.EMPTY = null, LLRBNode.RED = true, LLRBNode.BLACK = false;
LLRBNode.EMPTY = new class LLRBEmptyNode {
  constructor() {
    this.size = 0;
  }
  get key() {
    throw fail();
  }
  get value() {
    throw fail();
  }
  get color() {
    throw fail();
  }
  get left() {
    throw fail();
  }
  get right() {
    throw fail();
  }
  copy(e, t, n, r, i) {
    return this;
  }
  insert(e, t, n) {
    return new LLRBNode(e, t);
  }
  remove(e, t) {
    return this;
  }
  isEmpty() {
    return true;
  }
  inorderTraversal(e) {
    return false;
  }
  reverseTraversal(e) {
    return false;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  isRed() {
    return false;
  }
  checkMaxDepth() {
    return true;
  }
  check() {
    return 0;
  }
};

class SortedSet {
  constructor(e) {
    this.comparator = e, this.data = new SortedMap(this.comparator);
  }
  has(e) {
    return this.data.get(e) !== null;
  }
  first() {
    return this.data.minKey();
  }
  last() {
    return this.data.maxKey();
  }
  get size() {
    return this.data.size;
  }
  indexOf(e) {
    return this.data.indexOf(e);
  }
  forEach(e) {
    this.data.inorderTraversal((t, n) => (e(t), false));
  }
  forEachInRange(e, t) {
    const n = this.data.getIteratorFrom(e[0]);
    for (;n.hasNext(); ) {
      const r = n.getNext();
      if (this.comparator(r.key, e[1]) >= 0)
        return;
      t(r.key);
    }
  }
  forEachWhile(e, t) {
    let n;
    for (n = t !== undefined ? this.data.getIteratorFrom(t) : this.data.getIterator();n.hasNext(); ) {
      if (!e(n.getNext().key))
        return;
    }
  }
  firstAfterOrEqual(e) {
    const t = this.data.getIteratorFrom(e);
    return t.hasNext() ? t.getNext().key : null;
  }
  getIterator() {
    return new SortedSetIterator(this.data.getIterator());
  }
  getIteratorFrom(e) {
    return new SortedSetIterator(this.data.getIteratorFrom(e));
  }
  add(e) {
    return this.copy(this.data.remove(e).insert(e, true));
  }
  delete(e) {
    return this.has(e) ? this.copy(this.data.remove(e)) : this;
  }
  isEmpty() {
    return this.data.isEmpty();
  }
  unionWith(e) {
    let t = this;
    return t.size < e.size && (t = e, e = this), e.forEach((e2) => {
      t = t.add(e2);
    }), t;
  }
  isEqual(e) {
    if (!(e instanceof SortedSet))
      return false;
    if (this.size !== e.size)
      return false;
    const t = this.data.getIterator(), n = e.data.getIterator();
    for (;t.hasNext(); ) {
      const e2 = t.getNext().key, r = n.getNext().key;
      if (this.comparator(e2, r) !== 0)
        return false;
    }
    return true;
  }
  toArray() {
    const e = [];
    return this.forEach((t) => {
      e.push(t);
    }), e;
  }
  toString() {
    const e = [];
    return this.forEach((t) => e.push(t)), "SortedSet(" + e.toString() + ")";
  }
  copy(e) {
    const t = new SortedSet(this.comparator);
    return t.data = e, t;
  }
}

class SortedSetIterator {
  constructor(e) {
    this.iter = e;
  }
  getNext() {
    return this.iter.getNext().key;
  }
  hasNext() {
    return this.iter.hasNext();
  }
}

class FieldMask {
  constructor(e) {
    this.fields = e, e.sort(FieldPath$1.comparator);
  }
  static empty() {
    return new FieldMask([]);
  }
  unionWith(e) {
    let t = new SortedSet(FieldPath$1.comparator);
    for (const e2 of this.fields)
      t = t.add(e2);
    for (const n of e)
      t = t.add(n);
    return new FieldMask(t.toArray());
  }
  covers(e) {
    for (const t of this.fields)
      if (t.isPrefixOf(e))
        return true;
    return false;
  }
  isEqual(e) {
    return __PRIVATE_arrayEquals(this.fields, e.fields, (e2, t) => e2.isEqual(t));
  }
}

class __PRIVATE_Base64DecodeError extends Error {
  constructor() {
    super(...arguments), this.name = "Base64DecodeError";
  }
}

class ByteString {
  constructor(e) {
    this.binaryString = e;
  }
  static fromBase64String(e) {
    const t = function __PRIVATE_decodeBase64(e2) {
      try {
        return atob(e2);
      } catch (e3) {
        throw typeof DOMException != "undefined" && e3 instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e3) : e3;
      }
    }(e);
    return new ByteString(t);
  }
  static fromUint8Array(e) {
    const t = function __PRIVATE_binaryStringFromUint8Array(e2) {
      let t2 = "";
      for (let n = 0;n < e2.length; ++n)
        t2 += String.fromCharCode(e2[n]);
      return t2;
    }(e);
    return new ByteString(t);
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () => e < this.binaryString.length ? {
        value: this.binaryString.charCodeAt(e++),
        done: false
      } : {
        value: undefined,
        done: true
      }
    };
  }
  toBase64() {
    return function __PRIVATE_encodeBase64(e) {
      return btoa(e);
    }(this.binaryString);
  }
  toUint8Array() {
    return function __PRIVATE_uint8ArrayFromBinaryString(e) {
      const t = new Uint8Array(e.length);
      for (let n = 0;n < e.length; n++)
        t[n] = e.charCodeAt(n);
      return t;
    }(this.binaryString);
  }
  approximateByteSize() {
    return 2 * this.binaryString.length;
  }
  compareTo(e) {
    return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
  }
  isEqual(e) {
    return this.binaryString === e.binaryString;
  }
}
ByteString.EMPTY_BYTE_STRING = new ByteString("");
var ne = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);

class DatabaseInfo {
  constructor(e, t, n, r, i, s, o, _, a) {
    this.databaseId = e, this.appId = t, this.persistenceKey = n, this.host = r, this.ssl = i, this.forceLongPolling = s, this.autoDetectLongPolling = o, this.longPollingOptions = _, this.useFetchStreams = a;
  }
}

class DatabaseId {
  constructor(e, t) {
    this.projectId = e, this.database = t || "(default)";
  }
  static empty() {
    return new DatabaseId("", "");
  }
  get isDefaultDatabase() {
    return this.database === "(default)";
  }
  isEqual(e) {
    return e instanceof DatabaseId && e.projectId === this.projectId && e.database === this.database;
  }
}
var re = {
  mapValue: {
    fields: {
      __type__: {
        stringValue: "__max__"
      }
    }
  }
};
class ObjectValue {
  constructor(e) {
    this.value = e;
  }
  static empty() {
    return new ObjectValue({
      mapValue: {}
    });
  }
  field(e) {
    if (e.isEmpty())
      return this.value;
    {
      let t = this.value;
      for (let n = 0;n < e.length - 1; ++n)
        if (t = (t.mapValue.fields || {})[e.get(n)], !__PRIVATE_isMapValue(t))
          return null;
      return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
    }
  }
  set(e, t) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = __PRIVATE_deepClone(t);
  }
  setAll(e) {
    let t = FieldPath$1.emptyPath(), n = {}, r = [];
    e.forEach((e2, i2) => {
      if (!t.isImmediateParentOf(i2)) {
        const e3 = this.getFieldsMap(t);
        this.applyChanges(e3, n, r), n = {}, r = [], t = i2.popLast();
      }
      e2 ? n[i2.lastSegment()] = __PRIVATE_deepClone(e2) : r.push(i2.lastSegment());
    });
    const i = this.getFieldsMap(t);
    this.applyChanges(i, n, r);
  }
  delete(e) {
    const t = this.field(e.popLast());
    __PRIVATE_isMapValue(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
  }
  isEqual(e) {
    return __PRIVATE_valueEquals(this.value, e.value);
  }
  getFieldsMap(e) {
    let t = this.value;
    t.mapValue.fields || (t.mapValue = {
      fields: {}
    });
    for (let n = 0;n < e.length; ++n) {
      let r = t.mapValue.fields[e.get(n)];
      __PRIVATE_isMapValue(r) && r.mapValue.fields || (r = {
        mapValue: {
          fields: {}
        }
      }, t.mapValue.fields[e.get(n)] = r), t = r;
    }
    return t.mapValue.fields;
  }
  applyChanges(e, t, n) {
    forEach(t, (t2, n2) => e[t2] = n2);
    for (const t2 of n)
      delete e[t2];
  }
  clone() {
    return new ObjectValue(__PRIVATE_deepClone(this.value));
  }
}

class MutableDocument {
  constructor(e, t, n, r, i, s, o) {
    this.key = e, this.documentType = t, this.version = n, this.readTime = r, this.createTime = i, this.data = s, this.documentState = o;
  }
  static newInvalidDocument(e) {
    return new MutableDocument(e, 0, SnapshotVersion.min(), SnapshotVersion.min(), SnapshotVersion.min(), ObjectValue.empty(), 0);
  }
  static newFoundDocument(e, t, n, r) {
    return new MutableDocument(e, 1, t, SnapshotVersion.min(), n, r, 0);
  }
  static newNoDocument(e, t) {
    return new MutableDocument(e, 2, t, SnapshotVersion.min(), SnapshotVersion.min(), ObjectValue.empty(), 0);
  }
  static newUnknownDocument(e, t) {
    return new MutableDocument(e, 3, t, SnapshotVersion.min(), SnapshotVersion.min(), ObjectValue.empty(), 2);
  }
  convertToFoundDocument(e, t) {
    return !this.createTime.isEqual(SnapshotVersion.min()) || this.documentType !== 2 && this.documentType !== 0 || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t, this.documentState = 0, this;
  }
  convertToNoDocument(e) {
    return this.version = e, this.documentType = 2, this.data = ObjectValue.empty(), this.documentState = 0, this;
  }
  convertToUnknownDocument(e) {
    return this.version = e, this.documentType = 3, this.data = ObjectValue.empty(), this.documentState = 2, this;
  }
  setHasCommittedMutations() {
    return this.documentState = 2, this;
  }
  setHasLocalMutations() {
    return this.documentState = 1, this.version = SnapshotVersion.min(), this;
  }
  setReadTime(e) {
    return this.readTime = e, this;
  }
  get hasLocalMutations() {
    return this.documentState === 1;
  }
  get hasCommittedMutations() {
    return this.documentState === 2;
  }
  get hasPendingWrites() {
    return this.hasLocalMutations || this.hasCommittedMutations;
  }
  isValidDocument() {
    return this.documentType !== 0;
  }
  isFoundDocument() {
    return this.documentType === 1;
  }
  isNoDocument() {
    return this.documentType === 2;
  }
  isUnknownDocument() {
    return this.documentType === 3;
  }
  isEqual(e) {
    return e instanceof MutableDocument && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
  }
  mutableCopy() {
    return new MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
  }
  toString() {
    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
  }
}

class Bound {
  constructor(e, t) {
    this.position = e, this.inclusive = t;
  }
}

class OrderBy {
  constructor(e, t = "asc") {
    this.field = e, this.dir = t;
  }
}

class Filter {
}

class FieldFilter extends Filter {
  constructor(e, t, n) {
    super(), this.field = e, this.op = t, this.value = n;
  }
  static create(e, t, n) {
    return e.isKeyField() ? t === "in" || t === "not-in" ? this.createKeyFieldInFilter(e, t, n) : new __PRIVATE_KeyFieldFilter(e, t, n) : t === "array-contains" ? new __PRIVATE_ArrayContainsFilter(e, n) : t === "in" ? new __PRIVATE_InFilter(e, n) : t === "not-in" ? new __PRIVATE_NotInFilter(e, n) : t === "array-contains-any" ? new __PRIVATE_ArrayContainsAnyFilter(e, n) : new FieldFilter(e, t, n);
  }
  static createKeyFieldInFilter(e, t, n) {
    return t === "in" ? new __PRIVATE_KeyFieldInFilter(e, n) : new __PRIVATE_KeyFieldNotInFilter(e, n);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return this.op === "!=" ? t !== null && this.matchesComparison(__PRIVATE_valueCompare(t, this.value)) : t !== null && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t) && this.matchesComparison(__PRIVATE_valueCompare(t, this.value));
  }
  matchesComparison(e) {
    switch (this.op) {
      case "<":
        return e < 0;
      case "<=":
        return e <= 0;
      case "==":
        return e === 0;
      case "!=":
        return e !== 0;
      case ">":
        return e > 0;
      case ">=":
        return e >= 0;
      default:
        return fail();
    }
  }
  isInequality() {
    return ["<", "<=", ">", ">=", "!=", "not-in"].indexOf(this.op) >= 0;
  }
  getFlattenedFilters() {
    return [this];
  }
  getFilters() {
    return [this];
  }
}

class CompositeFilter extends Filter {
  constructor(e, t) {
    super(), this.filters = e, this.op = t, this.ae = null;
  }
  static create(e, t) {
    return new CompositeFilter(e, t);
  }
  matches(e) {
    return __PRIVATE_compositeFilterIsConjunction(this) ? this.filters.find((t) => !t.matches(e)) === undefined : this.filters.find((t) => t.matches(e)) !== undefined;
  }
  getFlattenedFilters() {
    return this.ae !== null || (this.ae = this.filters.reduce((e, t) => e.concat(t.getFlattenedFilters()), [])), this.ae;
  }
  getFilters() {
    return Object.assign([], this.filters);
  }
}

class __PRIVATE_KeyFieldFilter extends FieldFilter {
  constructor(e, t, n) {
    super(e, t, n), this.key = DocumentKey.fromName(n.referenceValue);
  }
  matches(e) {
    const t = DocumentKey.comparator(e.key, this.key);
    return this.matchesComparison(t);
  }
}

class __PRIVATE_KeyFieldInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in", t);
  }
  matches(e) {
    return this.keys.some((t) => t.isEqual(e.key));
  }
}

class __PRIVATE_KeyFieldNotInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "not-in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in", t);
  }
  matches(e) {
    return !this.keys.some((t) => t.isEqual(e.key));
  }
}

class __PRIVATE_ArrayContainsFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "array-contains", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return isArray(t) && __PRIVATE_arrayValueContains(t.arrayValue, this.value);
  }
}

class __PRIVATE_InFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "in", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return t !== null && __PRIVATE_arrayValueContains(this.value.arrayValue, t);
  }
}

class __PRIVATE_NotInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "not-in", t);
  }
  matches(e) {
    if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
      nullValue: "NULL_VALUE"
    }))
      return false;
    const t = e.data.field(this.field);
    return t !== null && !__PRIVATE_arrayValueContains(this.value.arrayValue, t);
  }
}

class __PRIVATE_ArrayContainsAnyFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "array-contains-any", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return !(!isArray(t) || !t.arrayValue.values) && t.arrayValue.values.some((e2) => __PRIVATE_arrayValueContains(this.value.arrayValue, e2));
  }
}

class __PRIVATE_TargetImpl {
  constructor(e, t = null, n = [], r = [], i = null, s = null, o = null) {
    this.path = e, this.collectionGroup = t, this.orderBy = n, this.filters = r, this.limit = i, this.startAt = s, this.endAt = o, this.ue = null;
  }
}

class __PRIVATE_QueryImpl {
  constructor(e, t = null, n = [], r = [], i = null, s = "F", o = null, _ = null) {
    this.path = e, this.collectionGroup = t, this.explicitOrderBy = n, this.filters = r, this.limit = i, this.limitType = s, this.startAt = o, this.endAt = _, this.ce = null, this.le = null, this.he = null, this.startAt, this.endAt;
  }
}

class ObjectMap {
  constructor(e, t) {
    this.mapKeyFn = e, this.equalsFn = t, this.inner = {}, this.innerSize = 0;
  }
  get(e) {
    const t = this.mapKeyFn(e), n = this.inner[t];
    if (n !== undefined) {
      for (const [t2, r] of n)
        if (this.equalsFn(t2, e))
          return r;
    }
  }
  has(e) {
    return this.get(e) !== undefined;
  }
  set(e, t) {
    const n = this.mapKeyFn(e), r = this.inner[n];
    if (r === undefined)
      return this.inner[n] = [[e, t]], void this.innerSize++;
    for (let n2 = 0;n2 < r.length; n2++)
      if (this.equalsFn(r[n2][0], e))
        return void (r[n2] = [e, t]);
    r.push([e, t]), this.innerSize++;
  }
  delete(e) {
    const t = this.mapKeyFn(e), n = this.inner[t];
    if (n === undefined)
      return false;
    for (let r = 0;r < n.length; r++)
      if (this.equalsFn(n[r][0], e))
        return n.length === 1 ? delete this.inner[t] : n.splice(r, 1), this.innerSize--, true;
    return false;
  }
  forEach(e) {
    forEach(this.inner, (t, n) => {
      for (const [t2, r] of n)
        e(t2, r);
    });
  }
  isEmpty() {
    return isEmpty2(this.inner);
  }
  size() {
    return this.innerSize;
  }
}
var se = new SortedMap(DocumentKey.comparator);
var oe = new SortedMap(DocumentKey.comparator);
var _e = new SortedMap(DocumentKey.comparator);
var ae = new SortedSet(DocumentKey.comparator);
var ue = new SortedSet(__PRIVATE_primitiveComparator);

class TransformOperation {
  constructor() {
    this._ = undefined;
  }
}

class __PRIVATE_ServerTimestampTransform extends TransformOperation {
}

class __PRIVATE_ArrayUnionTransformOperation extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
}

class __PRIVATE_ArrayRemoveTransformOperation extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
}

class __PRIVATE_NumericIncrementTransformOperation extends TransformOperation {
  constructor(e, t) {
    super(), this.serializer = e, this.Pe = t;
  }
}
class Precondition {
  constructor(e, t) {
    this.updateTime = e, this.exists = t;
  }
  static none() {
    return new Precondition;
  }
  static exists(e) {
    return new Precondition(undefined, e);
  }
  static updateTime(e) {
    return new Precondition(e);
  }
  get isNone() {
    return this.updateTime === undefined && this.exists === undefined;
  }
  isEqual(e) {
    return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
  }
}

class Mutation {
}

class __PRIVATE_SetMutation extends Mutation {
  constructor(e, t, n, r = []) {
    super(), this.key = e, this.value = t, this.precondition = n, this.fieldTransforms = r, this.type = 0;
  }
  getFieldMask() {
    return null;
  }
}

class __PRIVATE_PatchMutation extends Mutation {
  constructor(e, t, n, r, i = []) {
    super(), this.key = e, this.data = t, this.fieldMask = n, this.precondition = r, this.fieldTransforms = i, this.type = 1;
  }
  getFieldMask() {
    return this.fieldMask;
  }
}

class __PRIVATE_DeleteMutation extends Mutation {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 2, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}
class MutationBatch {
  constructor(e, t, n, r) {
    this.batchId = e, this.localWriteTime = t, this.baseMutations = n, this.mutations = r;
  }
  applyToRemoteDocument(e, t) {
    const n = t.mutationResults;
    for (let t2 = 0;t2 < this.mutations.length; t2++) {
      const r = this.mutations[t2];
      if (r.key.isEqual(e.key)) {
        __PRIVATE_mutationApplyToRemoteDocument(r, e, n[t2]);
      }
    }
  }
  applyToLocalView(e, t) {
    for (const n of this.baseMutations)
      n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
    for (const n of this.mutations)
      n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
    return t;
  }
  applyToLocalDocumentSet(e, t) {
    const n = __PRIVATE_newMutationMap();
    return this.mutations.forEach((r) => {
      const i = e.get(r.key), s = i.overlayedDocument;
      let o = this.applyToLocalView(s, i.mutatedFields);
      o = t.has(r.key) ? null : o;
      const _ = __PRIVATE_calculateOverlayMutation(s, o);
      _ !== null && n.set(r.key, _), s.isValidDocument() || s.convertToNoDocument(SnapshotVersion.min());
    }), n;
  }
  keys() {
    return this.mutations.reduce((e, t) => e.add(t.key), __PRIVATE_documentKeySet());
  }
  isEqual(e) {
    return this.batchId === e.batchId && __PRIVATE_arrayEquals(this.mutations, e.mutations, (e2, t) => __PRIVATE_mutationEquals(e2, t)) && __PRIVATE_arrayEquals(this.baseMutations, e.baseMutations, (e2, t) => __PRIVATE_mutationEquals(e2, t));
  }
}
class Overlay {
  constructor(e, t) {
    this.largestBatchId = e, this.mutation = t;
  }
  getKey() {
    return this.mutation.key;
  }
  isEqual(e) {
    return e !== null && this.mutation === e.mutation;
  }
  toString() {
    return `Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`;
  }
}
class ExistenceFilter {
  constructor(e, t) {
    this.count = e, this.unchangedNames = t;
  }
}
var ce;
var le;
(le = ce || (ce = {}))[le.OK = 0] = "OK", le[le.CANCELLED = 1] = "CANCELLED", le[le.UNKNOWN = 2] = "UNKNOWN", le[le.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", le[le.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", le[le.NOT_FOUND = 5] = "NOT_FOUND", le[le.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", le[le.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", le[le.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", le[le.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", le[le.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", le[le.ABORTED = 10] = "ABORTED", le[le.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", le[le.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", le[le.INTERNAL = 13] = "INTERNAL", le[le.UNAVAILABLE = 14] = "UNAVAILABLE", le[le.DATA_LOSS = 15] = "DATA_LOSS";
var he = null;
var Pe = new Integer([4294967295, 4294967295], 0);

class BloomFilter {
  constructor(e, t, n) {
    if (this.bitmap = e, this.padding = t, this.hashCount = n, t < 0 || t >= 8)
      throw new __PRIVATE_BloomFilterError(`Invalid padding: ${t}`);
    if (n < 0)
      throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
    if (e.length > 0 && this.hashCount === 0)
      throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
    if (e.length === 0 && t !== 0)
      throw new __PRIVATE_BloomFilterError(`Invalid padding when bitmap length is 0: ${t}`);
    this.Ie = 8 * e.length - t, this.Te = Integer.fromNumber(this.Ie);
  }
  Ee(e, t, n) {
    let r = e.add(t.multiply(Integer.fromNumber(n)));
    return r.compare(Pe) === 1 && (r = new Integer([r.getBits(0), r.getBits(1)], 0)), r.modulo(this.Te).toNumber();
  }
  de(e) {
    return (this.bitmap[Math.floor(e / 8)] & 1 << e % 8) != 0;
  }
  mightContain(e) {
    if (this.Ie === 0)
      return false;
    const t = __PRIVATE_getMd5HashValue(e), [n, r] = __PRIVATE_get64BitUints(t);
    for (let e2 = 0;e2 < this.hashCount; e2++) {
      const t2 = this.Ee(n, r, e2);
      if (!this.de(t2))
        return false;
    }
    return true;
  }
  static create(e, t, n) {
    const r = e % 8 == 0 ? 0 : 8 - e % 8, i = new Uint8Array(Math.ceil(e / 8)), s = new BloomFilter(i, r, t);
    return n.forEach((e2) => s.insert(e2)), s;
  }
  insert(e) {
    if (this.Ie === 0)
      return;
    const t = __PRIVATE_getMd5HashValue(e), [n, r] = __PRIVATE_get64BitUints(t);
    for (let e2 = 0;e2 < this.hashCount; e2++) {
      const t2 = this.Ee(n, r, e2);
      this.Ae(t2);
    }
  }
  Ae(e) {
    const t = Math.floor(e / 8), n = e % 8;
    this.bitmap[t] |= 1 << n;
  }
}

class __PRIVATE_BloomFilterError extends Error {
  constructor() {
    super(...arguments), this.name = "BloomFilterError";
  }
}

class RemoteEvent {
  constructor(e, t, n, r, i) {
    this.snapshotVersion = e, this.targetChanges = t, this.targetMismatches = n, this.documentUpdates = r, this.resolvedLimboDocuments = i;
  }
  static createSynthesizedRemoteEventForCurrentChange(e, t, n) {
    const r = new Map;
    return r.set(e, TargetChange.createSynthesizedTargetChangeForCurrentChange(e, t, n)), new RemoteEvent(SnapshotVersion.min(), r, new SortedMap(__PRIVATE_primitiveComparator), __PRIVATE_mutableDocumentMap(), __PRIVATE_documentKeySet());
  }
}

class TargetChange {
  constructor(e, t, n, r, i) {
    this.resumeToken = e, this.current = t, this.addedDocuments = n, this.modifiedDocuments = r, this.removedDocuments = i;
  }
  static createSynthesizedTargetChangeForCurrentChange(e, t, n) {
    return new TargetChange(n, t, __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet());
  }
}

class __PRIVATE_DocumentWatchChange {
  constructor(e, t, n, r) {
    this.Re = e, this.removedTargetIds = t, this.key = n, this.Ve = r;
  }
}

class __PRIVATE_ExistenceFilterChange {
  constructor(e, t) {
    this.targetId = e, this.me = t;
  }
}

class __PRIVATE_WatchTargetChange {
  constructor(e, t, n = ByteString.EMPTY_BYTE_STRING, r = null) {
    this.state = e, this.targetIds = t, this.resumeToken = n, this.cause = r;
  }
}

class __PRIVATE_TargetState {
  constructor() {
    this.fe = 0, this.ge = __PRIVATE_snapshotChangesMap(), this.pe = ByteString.EMPTY_BYTE_STRING, this.ye = false, this.we = true;
  }
  get current() {
    return this.ye;
  }
  get resumeToken() {
    return this.pe;
  }
  get Se() {
    return this.fe !== 0;
  }
  get be() {
    return this.we;
  }
  De(e) {
    e.approximateByteSize() > 0 && (this.we = true, this.pe = e);
  }
  Ce() {
    let e = __PRIVATE_documentKeySet(), t = __PRIVATE_documentKeySet(), n = __PRIVATE_documentKeySet();
    return this.ge.forEach((r, i) => {
      switch (i) {
        case 0:
          e = e.add(r);
          break;
        case 2:
          t = t.add(r);
          break;
        case 1:
          n = n.add(r);
          break;
        default:
          fail();
      }
    }), new TargetChange(this.pe, this.ye, e, t, n);
  }
  ve() {
    this.we = false, this.ge = __PRIVATE_snapshotChangesMap();
  }
  Fe(e, t) {
    this.we = true, this.ge = this.ge.insert(e, t);
  }
  Me(e) {
    this.we = true, this.ge = this.ge.remove(e);
  }
  xe() {
    this.fe += 1;
  }
  Oe() {
    this.fe -= 1, __PRIVATE_hardAssert(this.fe >= 0);
  }
  Ne() {
    this.we = true, this.ye = true;
  }
}

class __PRIVATE_WatchChangeAggregator {
  constructor(e) {
    this.Le = e, this.Be = new Map, this.ke = __PRIVATE_mutableDocumentMap(), this.qe = __PRIVATE_documentTargetMap(), this.Qe = new SortedMap(__PRIVATE_primitiveComparator);
  }
  Ke(e) {
    for (const t of e.Re)
      e.Ve && e.Ve.isFoundDocument() ? this.$e(t, e.Ve) : this.Ue(t, e.key, e.Ve);
    for (const t of e.removedTargetIds)
      this.Ue(t, e.key, e.Ve);
  }
  We(e) {
    this.forEachTarget(e, (t) => {
      const n = this.Ge(t);
      switch (e.state) {
        case 0:
          this.ze(t) && n.De(e.resumeToken);
          break;
        case 1:
          n.Oe(), n.Se || n.ve(), n.De(e.resumeToken);
          break;
        case 2:
          n.Oe(), n.Se || this.removeTarget(t);
          break;
        case 3:
          this.ze(t) && (n.Ne(), n.De(e.resumeToken));
          break;
        case 4:
          this.ze(t) && (this.je(t), n.De(e.resumeToken));
          break;
        default:
          fail();
      }
    });
  }
  forEachTarget(e, t) {
    e.targetIds.length > 0 ? e.targetIds.forEach(t) : this.Be.forEach((e2, n) => {
      this.ze(n) && t(n);
    });
  }
  He(e) {
    const t = e.targetId, n = e.me.count, r = this.Je(t);
    if (r) {
      const i = r.target;
      if (__PRIVATE_targetIsDocumentTarget(i))
        if (n === 0) {
          const e2 = new DocumentKey(i.path);
          this.Ue(t, e2, MutableDocument.newNoDocument(e2, SnapshotVersion.min()));
        } else
          __PRIVATE_hardAssert(n === 1);
      else {
        const r2 = this.Ye(t);
        if (r2 !== n) {
          const n2 = this.Ze(e), i2 = n2 ? this.Xe(n2, e, r2) : 1;
          if (i2 !== 0) {
            this.je(t);
            const e2 = i2 === 2 ? "TargetPurposeExistenceFilterMismatchBloom" : "TargetPurposeExistenceFilterMismatch";
            this.Qe = this.Qe.insert(t, e2);
          }
          he == null || he.et(function __PRIVATE_createExistenceFilterMismatchInfoForTestingHooks(e2, t2, n3, r3, i3) {
            var s, o, _, a, u, c;
            const l = {
              localCacheCount: e2,
              existenceFilterCount: t2.count,
              databaseId: n3.database,
              projectId: n3.projectId
            }, h = t2.unchangedNames;
            h && (l.bloomFilter = {
              applied: i3 === 0,
              hashCount: (s = h == null ? undefined : h.hashCount) !== null && s !== undefined ? s : 0,
              bitmapLength: (a = (_ = (o = h == null ? undefined : h.bits) === null || o === undefined ? undefined : o.bitmap) === null || _ === undefined ? undefined : _.length) !== null && a !== undefined ? a : 0,
              padding: (c = (u = h == null ? undefined : h.bits) === null || u === undefined ? undefined : u.padding) !== null && c !== undefined ? c : 0,
              mightContain: (e3) => {
                var t3;
                return (t3 = r3 == null ? undefined : r3.mightContain(e3)) !== null && t3 !== undefined && t3;
              }
            });
            return l;
          }(r2, e.me, this.Le.tt(), n2, i2));
        }
      }
    }
  }
  Ze(e) {
    const t = e.me.unchangedNames;
    if (!t || !t.bits)
      return null;
    const { bits: { bitmap: n = "", padding: r = 0 }, hashCount: i = 0 } = t;
    let s, o;
    try {
      s = __PRIVATE_normalizeByteString(n).toUint8Array();
    } catch (e2) {
      if (e2 instanceof __PRIVATE_Base64DecodeError)
        return __PRIVATE_logWarn("Decoding the base64 bloom filter in existence filter failed (" + e2.message + "); ignoring the bloom filter and falling back to full re-query."), null;
      throw e2;
    }
    try {
      o = new BloomFilter(s, r, i);
    } catch (e2) {
      return __PRIVATE_logWarn(e2 instanceof __PRIVATE_BloomFilterError ? "BloomFilter error: " : "Applying bloom filter failed: ", e2), null;
    }
    return o.Ie === 0 ? null : o;
  }
  Xe(e, t, n) {
    return t.me.count === n - this.nt(e, t.targetId) ? 0 : 2;
  }
  nt(e, t) {
    const n = this.Le.getRemoteKeysForTarget(t);
    let r = 0;
    return n.forEach((n2) => {
      const i = this.Le.tt(), s = `projects/${i.projectId}/databases/${i.database}/documents/${n2.path.canonicalString()}`;
      e.mightContain(s) || (this.Ue(t, n2, null), r++);
    }), r;
  }
  rt(e) {
    const t = new Map;
    this.Be.forEach((n2, r2) => {
      const i = this.Je(r2);
      if (i) {
        if (n2.current && __PRIVATE_targetIsDocumentTarget(i.target)) {
          const t2 = new DocumentKey(i.target.path);
          this.ke.get(t2) !== null || this.it(r2, t2) || this.Ue(r2, t2, MutableDocument.newNoDocument(t2, e));
        }
        n2.be && (t.set(r2, n2.Ce()), n2.ve());
      }
    });
    let n = __PRIVATE_documentKeySet();
    this.qe.forEach((e2, t2) => {
      let r2 = true;
      t2.forEachWhile((e3) => {
        const t3 = this.Je(e3);
        return !t3 || t3.purpose === "TargetPurposeLimboResolution" || (r2 = false, false);
      }), r2 && (n = n.add(e2));
    }), this.ke.forEach((t2, n2) => n2.setReadTime(e));
    const r = new RemoteEvent(e, t, this.Qe, this.ke, n);
    return this.ke = __PRIVATE_mutableDocumentMap(), this.qe = __PRIVATE_documentTargetMap(), this.Qe = new SortedMap(__PRIVATE_primitiveComparator), r;
  }
  $e(e, t) {
    if (!this.ze(e))
      return;
    const n = this.it(e, t.key) ? 2 : 0;
    this.Ge(e).Fe(t.key, n), this.ke = this.ke.insert(t.key, t), this.qe = this.qe.insert(t.key, this.st(t.key).add(e));
  }
  Ue(e, t, n) {
    if (!this.ze(e))
      return;
    const r = this.Ge(e);
    this.it(e, t) ? r.Fe(t, 1) : r.Me(t), this.qe = this.qe.insert(t, this.st(t).delete(e)), n && (this.ke = this.ke.insert(t, n));
  }
  removeTarget(e) {
    this.Be.delete(e);
  }
  Ye(e) {
    const t = this.Ge(e).Ce();
    return this.Le.getRemoteKeysForTarget(e).size + t.addedDocuments.size - t.removedDocuments.size;
  }
  xe(e) {
    this.Ge(e).xe();
  }
  Ge(e) {
    let t = this.Be.get(e);
    return t || (t = new __PRIVATE_TargetState, this.Be.set(e, t)), t;
  }
  st(e) {
    let t = this.qe.get(e);
    return t || (t = new SortedSet(__PRIVATE_primitiveComparator), this.qe = this.qe.insert(e, t)), t;
  }
  ze(e) {
    const t = this.Je(e) !== null;
    return t || __PRIVATE_logDebug("WatchChangeAggregator", "Detected inactive target", e), t;
  }
  Je(e) {
    const t = this.Be.get(e);
    return t && t.Se ? null : this.Le.ot(e);
  }
  je(e) {
    this.Be.set(e, new __PRIVATE_TargetState);
    this.Le.getRemoteKeysForTarget(e).forEach((t) => {
      this.Ue(e, t, null);
    });
  }
  it(e, t) {
    return this.Le.getRemoteKeysForTarget(e).has(t);
  }
}
var Ie = (() => {
  const e = {
    asc: "ASCENDING",
    desc: "DESCENDING"
  };
  return e;
})();
var Te = (() => {
  const e = {
    "<": "LESS_THAN",
    "<=": "LESS_THAN_OR_EQUAL",
    ">": "GREATER_THAN",
    ">=": "GREATER_THAN_OR_EQUAL",
    "==": "EQUAL",
    "!=": "NOT_EQUAL",
    "array-contains": "ARRAY_CONTAINS",
    in: "IN",
    "not-in": "NOT_IN",
    "array-contains-any": "ARRAY_CONTAINS_ANY"
  };
  return e;
})();
var Ee = (() => {
  const e = {
    and: "AND",
    or: "OR"
  };
  return e;
})();

class JsonProtoSerializer {
  constructor(e, t) {
    this.databaseId = e, this.useProto3Json = t;
  }
}

class TargetData {
  constructor(e, t, n, r, i = SnapshotVersion.min(), s = SnapshotVersion.min(), o = ByteString.EMPTY_BYTE_STRING, _ = null) {
    this.target = e, this.targetId = t, this.purpose = n, this.sequenceNumber = r, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = s, this.resumeToken = o, this.expectedCount = _;
  }
  withSequenceNumber(e) {
    return new TargetData(this.target, this.targetId, this.purpose, e, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
  }
  withResumeToken(e, t) {
    return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, t, this.lastLimboFreeSnapshotVersion, e, null);
  }
  withExpectedCount(e) {
    return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, e);
  }
  withLastLimboFreeSnapshotVersion(e) {
    return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e, this.resumeToken, this.expectedCount);
  }
}

class __PRIVATE_LocalSerializer {
  constructor(e) {
    this.ct = e;
  }
}
class __PRIVATE_FirestoreIndexValueWriter {
  constructor() {
  }
  Pt(e, t) {
    this.It(e, t), t.Tt();
  }
  It(e, t) {
    if ("nullValue" in e)
      this.Et(t, 5);
    else if ("booleanValue" in e)
      this.Et(t, 10), t.dt(e.booleanValue ? 1 : 0);
    else if ("integerValue" in e)
      this.Et(t, 15), t.dt(__PRIVATE_normalizeNumber(e.integerValue));
    else if ("doubleValue" in e) {
      const n = __PRIVATE_normalizeNumber(e.doubleValue);
      isNaN(n) ? this.Et(t, 13) : (this.Et(t, 15), __PRIVATE_isNegativeZero(n) ? t.dt(0) : t.dt(n));
    } else if ("timestampValue" in e) {
      let n = e.timestampValue;
      this.Et(t, 20), typeof n == "string" && (n = __PRIVATE_normalizeTimestamp(n)), t.At(`${n.seconds || ""}`), t.dt(n.nanos || 0);
    } else if ("stringValue" in e)
      this.Rt(e.stringValue, t), this.Vt(t);
    else if ("bytesValue" in e)
      this.Et(t, 30), t.ft(__PRIVATE_normalizeByteString(e.bytesValue)), this.Vt(t);
    else if ("referenceValue" in e)
      this.gt(e.referenceValue, t);
    else if ("geoPointValue" in e) {
      const n = e.geoPointValue;
      this.Et(t, 45), t.dt(n.latitude || 0), t.dt(n.longitude || 0);
    } else
      "mapValue" in e ? __PRIVATE_isMaxValue(e) ? this.Et(t, Number.MAX_SAFE_INTEGER) : (this.yt(e.mapValue, t), this.Vt(t)) : ("arrayValue" in e) ? (this.wt(e.arrayValue, t), this.Vt(t)) : fail();
  }
  Rt(e, t) {
    this.Et(t, 25), this.St(e, t);
  }
  St(e, t) {
    t.At(e);
  }
  yt(e, t) {
    const n = e.fields || {};
    this.Et(t, 55);
    for (const e2 of Object.keys(n))
      this.Rt(e2, t), this.It(n[e2], t);
  }
  wt(e, t) {
    const n = e.values || [];
    this.Et(t, 50);
    for (const e2 of n)
      this.It(e2, t);
  }
  gt(e, t) {
    this.Et(t, 37);
    DocumentKey.fromName(e).path.forEach((e2) => {
      this.Et(t, 60), this.St(e2, t);
    });
  }
  Et(e, t) {
    e.dt(t);
  }
  Vt(e) {
    e.dt(2);
  }
}
__PRIVATE_FirestoreIndexValueWriter.bt = new __PRIVATE_FirestoreIndexValueWriter;
class __PRIVATE_MemoryIndexManager {
  constructor() {
    this._n = new __PRIVATE_MemoryCollectionParentIndex;
  }
  addToCollectionParentIndex(e, t) {
    return this._n.add(t), PersistencePromise.resolve();
  }
  getCollectionParents(e, t) {
    return PersistencePromise.resolve(this._n.getEntries(t));
  }
  addFieldIndex(e, t) {
    return PersistencePromise.resolve();
  }
  deleteFieldIndex(e, t) {
    return PersistencePromise.resolve();
  }
  deleteAllFieldIndexes(e) {
    return PersistencePromise.resolve();
  }
  createTargetIndexes(e, t) {
    return PersistencePromise.resolve();
  }
  getDocumentsMatchingTarget(e, t) {
    return PersistencePromise.resolve(null);
  }
  getIndexType(e, t) {
    return PersistencePromise.resolve(0);
  }
  getFieldIndexes(e, t) {
    return PersistencePromise.resolve([]);
  }
  getNextCollectionGroupToUpdate(e) {
    return PersistencePromise.resolve(null);
  }
  getMinOffset(e, t) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  updateCollectionGroup(e, t, n) {
    return PersistencePromise.resolve();
  }
  updateIndexEntries(e, t) {
    return PersistencePromise.resolve();
  }
}

class __PRIVATE_MemoryCollectionParentIndex {
  constructor() {
    this.index = {};
  }
  add(e) {
    const t = e.lastSegment(), n = e.popLast(), r = this.index[t] || new SortedSet(ResourcePath.comparator), i = !r.has(n);
    return this.index[t] = r.add(n), i;
  }
  has(e) {
    const t = e.lastSegment(), n = e.popLast(), r = this.index[t];
    return r && r.has(n);
  }
  getEntries(e) {
    return (this.index[e] || new SortedSet(ResourcePath.comparator)).toArray();
  }
}
var de = new Uint8Array(0);
class LruParams {
  constructor(e, t, n) {
    this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = n;
  }
  static withCacheSize(e) {
    return new LruParams(e, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
  }
}
LruParams.DEFAULT_COLLECTION_PERCENTILE = 10, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1000, LruParams.DEFAULT = new LruParams(41943040, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), LruParams.DISABLED = new LruParams(-1, 0, 0);
class __PRIVATE_TargetIdGenerator {
  constructor(e) {
    this.On = e;
  }
  next() {
    return this.On += 2, this.On;
  }
  static Nn() {
    return new __PRIVATE_TargetIdGenerator(0);
  }
  static Ln() {
    return new __PRIVATE_TargetIdGenerator(-1);
  }
}
class RemoteDocumentChangeBuffer {
  constructor() {
    this.changes = new ObjectMap((e) => e.toString(), (e, t) => e.isEqual(t)), this.changesApplied = false;
  }
  addEntry(e) {
    this.assertNotApplied(), this.changes.set(e.key, e);
  }
  removeEntry(e, t) {
    this.assertNotApplied(), this.changes.set(e, MutableDocument.newInvalidDocument(e).setReadTime(t));
  }
  getEntry(e, t) {
    this.assertNotApplied();
    const n = this.changes.get(t);
    return n !== undefined ? PersistencePromise.resolve(n) : this.getFromCache(e, t);
  }
  getEntries(e, t) {
    return this.getAllFromCache(e, t);
  }
  apply(e) {
    return this.assertNotApplied(), this.changesApplied = true, this.applyChanges(e);
  }
  assertNotApplied() {
  }
}
class OverlayedDocument {
  constructor(e, t) {
    this.overlayedDocument = e, this.mutatedFields = t;
  }
}

class LocalDocumentsView {
  constructor(e, t, n, r) {
    this.remoteDocumentCache = e, this.mutationQueue = t, this.documentOverlayCache = n, this.indexManager = r;
  }
  getDocument(e, t) {
    let n = null;
    return this.documentOverlayCache.getOverlay(e, t).next((r) => (n = r, this.remoteDocumentCache.getEntry(e, t))).next((e2) => (n !== null && __PRIVATE_mutationApplyToLocalView(n.mutation, e2, FieldMask.empty(), Timestamp.now()), e2));
  }
  getDocuments(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next((t2) => this.getLocalViewOfDocuments(e, t2, __PRIVATE_documentKeySet()).next(() => t2));
  }
  getLocalViewOfDocuments(e, t, n = __PRIVATE_documentKeySet()) {
    const r = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, r, t).next(() => this.computeViews(e, t, r, n).next((e2) => {
      let t2 = documentMap();
      return e2.forEach((e3, n2) => {
        t2 = t2.insert(e3, n2.overlayedDocument);
      }), t2;
    }));
  }
  getOverlayedDocuments(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, n, t).next(() => this.computeViews(e, t, n, __PRIVATE_documentKeySet()));
  }
  populateOverlays(e, t, n) {
    const r = [];
    return n.forEach((e2) => {
      t.has(e2) || r.push(e2);
    }), this.documentOverlayCache.getOverlays(e, r).next((e2) => {
      e2.forEach((e3, n2) => {
        t.set(e3, n2);
      });
    });
  }
  computeViews(e, t, n, r) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = __PRIVATE_newDocumentKeyMap(), o = function __PRIVATE_newOverlayedDocumentMap() {
      return __PRIVATE_newDocumentKeyMap();
    }();
    return t.forEach((e2, t2) => {
      const o2 = n.get(t2.key);
      r.has(t2.key) && (o2 === undefined || o2.mutation instanceof __PRIVATE_PatchMutation) ? i = i.insert(t2.key, t2) : o2 !== undefined ? (s.set(t2.key, o2.mutation.getFieldMask()), __PRIVATE_mutationApplyToLocalView(o2.mutation, t2, o2.mutation.getFieldMask(), Timestamp.now())) : s.set(t2.key, FieldMask.empty());
    }), this.recalculateAndSaveOverlays(e, i).next((e2) => (e2.forEach((e3, t2) => s.set(e3, t2)), t.forEach((e3, t2) => {
      var n2;
      return o.set(e3, new OverlayedDocument(t2, (n2 = s.get(e3)) !== null && n2 !== undefined ? n2 : null));
    }), o));
  }
  recalculateAndSaveOverlays(e, t) {
    const n = __PRIVATE_newDocumentKeyMap();
    let r = new SortedMap((e2, t2) => e2 - t2), i = __PRIVATE_documentKeySet();
    return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next((e2) => {
      for (const i2 of e2)
        i2.keys().forEach((e3) => {
          const s = t.get(e3);
          if (s === null)
            return;
          let o = n.get(e3) || FieldMask.empty();
          o = i2.applyToLocalView(s, o), n.set(e3, o);
          const _ = (r.get(i2.batchId) || __PRIVATE_documentKeySet()).add(e3);
          r = r.insert(i2.batchId, _);
        });
    }).next(() => {
      const s = [], o = r.getReverseIterator();
      for (;o.hasNext(); ) {
        const r2 = o.getNext(), _ = r2.key, a = r2.value, u = __PRIVATE_newMutationMap();
        a.forEach((e2) => {
          if (!i.has(e2)) {
            const r3 = __PRIVATE_calculateOverlayMutation(t.get(e2), n.get(e2));
            r3 !== null && u.set(e2, r3), i = i.add(e2);
          }
        }), s.push(this.documentOverlayCache.saveOverlays(e, _, u));
      }
      return PersistencePromise.waitFor(s);
    }).next(() => n);
  }
  recalculateAndSaveOverlaysForDocumentKeys(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next((t2) => this.recalculateAndSaveOverlays(e, t2));
  }
  getDocumentsMatchingQuery(e, t, n, r) {
    return function __PRIVATE_isDocumentQuery$1(e2) {
      return DocumentKey.isDocumentKey(e2.path) && e2.collectionGroup === null && e2.filters.length === 0;
    }(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : __PRIVATE_isCollectionGroupQuery(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, n, r) : this.getDocumentsMatchingCollectionQuery(e, t, n, r);
  }
  getNextDocuments(e, t, n, r) {
    return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, n, r).next((i) => {
      const s = r - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, n.largestBatchId, r - i.size) : PersistencePromise.resolve(__PRIVATE_newOverlayMap());
      let o = -1, _ = i;
      return s.next((t2) => PersistencePromise.forEach(t2, (t3, n2) => (o < n2.largestBatchId && (o = n2.largestBatchId), i.get(t3) ? PersistencePromise.resolve() : this.remoteDocumentCache.getEntry(e, t3).next((e2) => {
        _ = _.insert(t3, e2);
      }))).next(() => this.populateOverlays(e, t2, i)).next(() => this.computeViews(e, _, t2, __PRIVATE_documentKeySet())).next((e2) => ({
        batchId: o,
        changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e2)
      })));
    });
  }
  getDocumentsMatchingDocumentQuery(e, t) {
    return this.getDocument(e, new DocumentKey(t)).next((e2) => {
      let t2 = documentMap();
      return e2.isFoundDocument() && (t2 = t2.insert(e2.key, e2)), t2;
    });
  }
  getDocumentsMatchingCollectionGroupQuery(e, t, n, r) {
    const i = t.collectionGroup;
    let s = documentMap();
    return this.indexManager.getCollectionParents(e, i).next((o) => PersistencePromise.forEach(o, (o2) => {
      const _ = function __PRIVATE_asCollectionQueryAtPath(e2, t2) {
        return new __PRIVATE_QueryImpl(t2, null, e2.explicitOrderBy.slice(), e2.filters.slice(), e2.limit, e2.limitType, e2.startAt, e2.endAt);
      }(t, o2.child(i));
      return this.getDocumentsMatchingCollectionQuery(e, _, n, r).next((e2) => {
        e2.forEach((e3, t2) => {
          s = s.insert(e3, t2);
        });
      });
    }).next(() => s));
  }
  getDocumentsMatchingCollectionQuery(e, t, n, r) {
    let i;
    return this.documentOverlayCache.getOverlaysForCollection(e, t.path, n.largestBatchId).next((s) => (i = s, this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r))).next((e2) => {
      i.forEach((t2, n3) => {
        const r2 = n3.getKey();
        e2.get(r2) === null && (e2 = e2.insert(r2, MutableDocument.newInvalidDocument(r2)));
      });
      let n2 = documentMap();
      return e2.forEach((e3, r2) => {
        const s = i.get(e3);
        s !== undefined && __PRIVATE_mutationApplyToLocalView(s.mutation, r2, FieldMask.empty(), Timestamp.now()), __PRIVATE_queryMatches(t, r2) && (n2 = n2.insert(e3, r2));
      }), n2;
    });
  }
}

class __PRIVATE_MemoryBundleCache {
  constructor(e) {
    this.serializer = e, this.cr = new Map, this.lr = new Map;
  }
  getBundleMetadata(e, t) {
    return PersistencePromise.resolve(this.cr.get(t));
  }
  saveBundleMetadata(e, t) {
    return this.cr.set(t.id, function __PRIVATE_fromBundleMetadata(e2) {
      return {
        id: e2.id,
        version: e2.version,
        createTime: __PRIVATE_fromVersion(e2.createTime)
      };
    }(t)), PersistencePromise.resolve();
  }
  getNamedQuery(e, t) {
    return PersistencePromise.resolve(this.lr.get(t));
  }
  saveNamedQuery(e, t) {
    return this.lr.set(t.name, function __PRIVATE_fromProtoNamedQuery(e2) {
      return {
        name: e2.name,
        query: __PRIVATE_fromBundledQuery(e2.bundledQuery),
        readTime: __PRIVATE_fromVersion(e2.readTime)
      };
    }(t)), PersistencePromise.resolve();
  }
}

class __PRIVATE_MemoryDocumentOverlayCache {
  constructor() {
    this.overlays = new SortedMap(DocumentKey.comparator), this.hr = new Map;
  }
  getOverlay(e, t) {
    return PersistencePromise.resolve(this.overlays.get(t));
  }
  getOverlays(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return PersistencePromise.forEach(t, (t2) => this.getOverlay(e, t2).next((e2) => {
      e2 !== null && n.set(t2, e2);
    })).next(() => n);
  }
  saveOverlays(e, t, n) {
    return n.forEach((n2, r) => {
      this.ht(e, t, r);
    }), PersistencePromise.resolve();
  }
  removeOverlaysForBatchId(e, t, n) {
    const r = this.hr.get(n);
    return r !== undefined && (r.forEach((e2) => this.overlays = this.overlays.remove(e2)), this.hr.delete(n)), PersistencePromise.resolve();
  }
  getOverlaysForCollection(e, t, n) {
    const r = __PRIVATE_newOverlayMap(), i = t.length + 1, s = new DocumentKey(t.child("")), o = this.overlays.getIteratorFrom(s);
    for (;o.hasNext(); ) {
      const e2 = o.getNext().value, s2 = e2.getKey();
      if (!t.isPrefixOf(s2.path))
        break;
      s2.path.length === i && (e2.largestBatchId > n && r.set(e2.getKey(), e2));
    }
    return PersistencePromise.resolve(r);
  }
  getOverlaysForCollectionGroup(e, t, n, r) {
    let i = new SortedMap((e2, t2) => e2 - t2);
    const s = this.overlays.getIterator();
    for (;s.hasNext(); ) {
      const e2 = s.getNext().value;
      if (e2.getKey().getCollectionGroup() === t && e2.largestBatchId > n) {
        let t2 = i.get(e2.largestBatchId);
        t2 === null && (t2 = __PRIVATE_newOverlayMap(), i = i.insert(e2.largestBatchId, t2)), t2.set(e2.getKey(), e2);
      }
    }
    const o = __PRIVATE_newOverlayMap(), _ = i.getIterator();
    for (;_.hasNext(); ) {
      if (_.getNext().value.forEach((e2, t2) => o.set(e2, t2)), o.size() >= r)
        break;
    }
    return PersistencePromise.resolve(o);
  }
  ht(e, t, n) {
    const r = this.overlays.get(n.key);
    if (r !== null) {
      const e2 = this.hr.get(r.largestBatchId).delete(n.key);
      this.hr.set(r.largestBatchId, e2);
    }
    this.overlays = this.overlays.insert(n.key, new Overlay(t, n));
    let i = this.hr.get(t);
    i === undefined && (i = __PRIVATE_documentKeySet(), this.hr.set(t, i)), this.hr.set(t, i.add(n.key));
  }
}

class __PRIVATE_ReferenceSet {
  constructor() {
    this.Pr = new SortedSet(__PRIVATE_DocReference.Ir), this.Tr = new SortedSet(__PRIVATE_DocReference.Er);
  }
  isEmpty() {
    return this.Pr.isEmpty();
  }
  addReference(e, t) {
    const n = new __PRIVATE_DocReference(e, t);
    this.Pr = this.Pr.add(n), this.Tr = this.Tr.add(n);
  }
  dr(e, t) {
    e.forEach((e2) => this.addReference(e2, t));
  }
  removeReference(e, t) {
    this.Ar(new __PRIVATE_DocReference(e, t));
  }
  Rr(e, t) {
    e.forEach((e2) => this.removeReference(e2, t));
  }
  Vr(e) {
    const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1), i = [];
    return this.Tr.forEachInRange([n, r], (e2) => {
      this.Ar(e2), i.push(e2.key);
    }), i;
  }
  mr() {
    this.Pr.forEach((e) => this.Ar(e));
  }
  Ar(e) {
    this.Pr = this.Pr.delete(e), this.Tr = this.Tr.delete(e);
  }
  gr(e) {
    const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1);
    let i = __PRIVATE_documentKeySet();
    return this.Tr.forEachInRange([n, r], (e2) => {
      i = i.add(e2.key);
    }), i;
  }
  containsKey(e) {
    const t = new __PRIVATE_DocReference(e, 0), n = this.Pr.firstAfterOrEqual(t);
    return n !== null && e.isEqual(n.key);
  }
}

class __PRIVATE_DocReference {
  constructor(e, t) {
    this.key = e, this.pr = t;
  }
  static Ir(e, t) {
    return DocumentKey.comparator(e.key, t.key) || __PRIVATE_primitiveComparator(e.pr, t.pr);
  }
  static Er(e, t) {
    return __PRIVATE_primitiveComparator(e.pr, t.pr) || DocumentKey.comparator(e.key, t.key);
  }
}

class __PRIVATE_MemoryMutationQueue {
  constructor(e, t) {
    this.indexManager = e, this.referenceDelegate = t, this.mutationQueue = [], this.yr = 1, this.wr = new SortedSet(__PRIVATE_DocReference.Ir);
  }
  checkEmpty(e) {
    return PersistencePromise.resolve(this.mutationQueue.length === 0);
  }
  addMutationBatch(e, t, n, r) {
    const i = this.yr;
    this.yr++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
    const s = new MutationBatch(i, t, n, r);
    this.mutationQueue.push(s);
    for (const t2 of r)
      this.wr = this.wr.add(new __PRIVATE_DocReference(t2.key, i)), this.indexManager.addToCollectionParentIndex(e, t2.key.path.popLast());
    return PersistencePromise.resolve(s);
  }
  lookupMutationBatch(e, t) {
    return PersistencePromise.resolve(this.Sr(t));
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const n = t + 1, r = this.br(n), i = r < 0 ? 0 : r;
    return PersistencePromise.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
  }
  getHighestUnacknowledgedBatchId() {
    return PersistencePromise.resolve(this.mutationQueue.length === 0 ? -1 : this.yr - 1);
  }
  getAllMutationBatches(e) {
    return PersistencePromise.resolve(this.mutationQueue.slice());
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const n = new __PRIVATE_DocReference(t, 0), r = new __PRIVATE_DocReference(t, Number.POSITIVE_INFINITY), i = [];
    return this.wr.forEachInRange([n, r], (e2) => {
      const t2 = this.Sr(e2.pr);
      i.push(t2);
    }), PersistencePromise.resolve(i);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let n = new SortedSet(__PRIVATE_primitiveComparator);
    return t.forEach((e2) => {
      const t2 = new __PRIVATE_DocReference(e2, 0), r = new __PRIVATE_DocReference(e2, Number.POSITIVE_INFINITY);
      this.wr.forEachInRange([t2, r], (e3) => {
        n = n.add(e3.pr);
      });
    }), PersistencePromise.resolve(this.Dr(n));
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const n = t.path, r = n.length + 1;
    let i = n;
    DocumentKey.isDocumentKey(i) || (i = i.child(""));
    const s = new __PRIVATE_DocReference(new DocumentKey(i), 0);
    let o = new SortedSet(__PRIVATE_primitiveComparator);
    return this.wr.forEachWhile((e2) => {
      const t2 = e2.key.path;
      return !!n.isPrefixOf(t2) && (t2.length === r && (o = o.add(e2.pr)), true);
    }, s), PersistencePromise.resolve(this.Dr(o));
  }
  Dr(e) {
    const t = [];
    return e.forEach((e2) => {
      const n = this.Sr(e2);
      n !== null && t.push(n);
    }), t;
  }
  removeMutationBatch(e, t) {
    __PRIVATE_hardAssert(this.Cr(t.batchId, "removed") === 0), this.mutationQueue.shift();
    let n = this.wr;
    return PersistencePromise.forEach(t.mutations, (r) => {
      const i = new __PRIVATE_DocReference(r.key, t.batchId);
      return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(e, r.key);
    }).next(() => {
      this.wr = n;
    });
  }
  Mn(e) {
  }
  containsKey(e, t) {
    const n = new __PRIVATE_DocReference(t, 0), r = this.wr.firstAfterOrEqual(n);
    return PersistencePromise.resolve(t.isEqual(r && r.key));
  }
  performConsistencyCheck(e) {
    return this.mutationQueue.length, PersistencePromise.resolve();
  }
  Cr(e, t) {
    return this.br(e);
  }
  br(e) {
    if (this.mutationQueue.length === 0)
      return 0;
    return e - this.mutationQueue[0].batchId;
  }
  Sr(e) {
    const t = this.br(e);
    if (t < 0 || t >= this.mutationQueue.length)
      return null;
    return this.mutationQueue[t];
  }
}

class __PRIVATE_MemoryRemoteDocumentCacheImpl {
  constructor(e) {
    this.vr = e, this.docs = function __PRIVATE_documentEntryMap() {
      return new SortedMap(DocumentKey.comparator);
    }(), this.size = 0;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  addEntry(e, t) {
    const n = t.key, r = this.docs.get(n), i = r ? r.size : 0, s = this.vr(t);
    return this.docs = this.docs.insert(n, {
      document: t.mutableCopy(),
      size: s
    }), this.size += s - i, this.indexManager.addToCollectionParentIndex(e, n.path.popLast());
  }
  removeEntry(e) {
    const t = this.docs.get(e);
    t && (this.docs = this.docs.remove(e), this.size -= t.size);
  }
  getEntry(e, t) {
    const n = this.docs.get(t);
    return PersistencePromise.resolve(n ? n.document.mutableCopy() : MutableDocument.newInvalidDocument(t));
  }
  getEntries(e, t) {
    let n = __PRIVATE_mutableDocumentMap();
    return t.forEach((e2) => {
      const t2 = this.docs.get(e2);
      n = n.insert(e2, t2 ? t2.document.mutableCopy() : MutableDocument.newInvalidDocument(e2));
    }), PersistencePromise.resolve(n);
  }
  getDocumentsMatchingQuery(e, t, n, r) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = t.path, o = new DocumentKey(s.child("")), _ = this.docs.getIteratorFrom(o);
    for (;_.hasNext(); ) {
      const { key: e2, value: { document: o2 } } = _.getNext();
      if (!s.isPrefixOf(e2.path))
        break;
      e2.path.length > s.length + 1 || (__PRIVATE_indexOffsetComparator(__PRIVATE_newIndexOffsetFromDocument(o2), n) <= 0 || (r.has(o2.key) || __PRIVATE_queryMatches(t, o2)) && (i = i.insert(o2.key, o2.mutableCopy())));
    }
    return PersistencePromise.resolve(i);
  }
  getAllFromCollectionGroup(e, t, n, r) {
    fail();
  }
  Fr(e, t) {
    return PersistencePromise.forEach(this.docs, (e2) => t(e2));
  }
  newChangeBuffer(e) {
    return new __PRIVATE_MemoryRemoteDocumentChangeBuffer(this);
  }
  getSize(e) {
    return PersistencePromise.resolve(this.size);
  }
}

class __PRIVATE_MemoryRemoteDocumentChangeBuffer extends RemoteDocumentChangeBuffer {
  constructor(e) {
    super(), this.ar = e;
  }
  applyChanges(e) {
    const t = [];
    return this.changes.forEach((n, r) => {
      r.isValidDocument() ? t.push(this.ar.addEntry(e, r)) : this.ar.removeEntry(n);
    }), PersistencePromise.waitFor(t);
  }
  getFromCache(e, t) {
    return this.ar.getEntry(e, t);
  }
  getAllFromCache(e, t) {
    return this.ar.getEntries(e, t);
  }
}

class __PRIVATE_MemoryTargetCache {
  constructor(e) {
    this.persistence = e, this.Mr = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), __PRIVATE_targetEquals), this.lastRemoteSnapshotVersion = SnapshotVersion.min(), this.highestTargetId = 0, this.Or = 0, this.Nr = new __PRIVATE_ReferenceSet, this.targetCount = 0, this.Lr = __PRIVATE_TargetIdGenerator.Nn();
  }
  forEachTarget(e, t) {
    return this.Mr.forEach((e2, n) => t(n)), PersistencePromise.resolve();
  }
  getLastRemoteSnapshotVersion(e) {
    return PersistencePromise.resolve(this.lastRemoteSnapshotVersion);
  }
  getHighestSequenceNumber(e) {
    return PersistencePromise.resolve(this.Or);
  }
  allocateTargetId(e) {
    return this.highestTargetId = this.Lr.next(), PersistencePromise.resolve(this.highestTargetId);
  }
  setTargetsMetadata(e, t, n) {
    return n && (this.lastRemoteSnapshotVersion = n), t > this.Or && (this.Or = t), PersistencePromise.resolve();
  }
  qn(e) {
    this.Mr.set(e.target, e);
    const t = e.targetId;
    t > this.highestTargetId && (this.Lr = new __PRIVATE_TargetIdGenerator(t), this.highestTargetId = t), e.sequenceNumber > this.Or && (this.Or = e.sequenceNumber);
  }
  addTargetData(e, t) {
    return this.qn(t), this.targetCount += 1, PersistencePromise.resolve();
  }
  updateTargetData(e, t) {
    return this.qn(t), PersistencePromise.resolve();
  }
  removeTargetData(e, t) {
    return this.Mr.delete(t.target), this.Nr.Vr(t.targetId), this.targetCount -= 1, PersistencePromise.resolve();
  }
  removeTargets(e, t, n) {
    let r = 0;
    const i = [];
    return this.Mr.forEach((s, o) => {
      o.sequenceNumber <= t && n.get(o.targetId) === null && (this.Mr.delete(s), i.push(this.removeMatchingKeysForTargetId(e, o.targetId)), r++);
    }), PersistencePromise.waitFor(i).next(() => r);
  }
  getTargetCount(e) {
    return PersistencePromise.resolve(this.targetCount);
  }
  getTargetData(e, t) {
    const n = this.Mr.get(t) || null;
    return PersistencePromise.resolve(n);
  }
  addMatchingKeys(e, t, n) {
    return this.Nr.dr(t, n), PersistencePromise.resolve();
  }
  removeMatchingKeys(e, t, n) {
    this.Nr.Rr(t, n);
    const r = this.persistence.referenceDelegate, i = [];
    return r && t.forEach((t2) => {
      i.push(r.markPotentiallyOrphaned(e, t2));
    }), PersistencePromise.waitFor(i);
  }
  removeMatchingKeysForTargetId(e, t) {
    return this.Nr.Vr(t), PersistencePromise.resolve();
  }
  getMatchingKeysForTargetId(e, t) {
    const n = this.Nr.gr(t);
    return PersistencePromise.resolve(n);
  }
  containsKey(e, t) {
    return PersistencePromise.resolve(this.Nr.containsKey(t));
  }
}

class __PRIVATE_MemoryPersistence {
  constructor(e, t) {
    this.Br = {}, this.overlays = {}, this.kr = new __PRIVATE_ListenSequence(0), this.qr = false, this.qr = true, this.referenceDelegate = e(this), this.Qr = new __PRIVATE_MemoryTargetCache(this);
    this.indexManager = new __PRIVATE_MemoryIndexManager, this.remoteDocumentCache = function __PRIVATE_newMemoryRemoteDocumentCache(e2) {
      return new __PRIVATE_MemoryRemoteDocumentCacheImpl(e2);
    }((e2) => this.referenceDelegate.Kr(e2)), this.serializer = new __PRIVATE_LocalSerializer(t), this.$r = new __PRIVATE_MemoryBundleCache(this.serializer);
  }
  start() {
    return Promise.resolve();
  }
  shutdown() {
    return this.qr = false, Promise.resolve();
  }
  get started() {
    return this.qr;
  }
  setDatabaseDeletedListener() {
  }
  setNetworkEnabled() {
  }
  getIndexManager(e) {
    return this.indexManager;
  }
  getDocumentOverlayCache(e) {
    let t = this.overlays[e.toKey()];
    return t || (t = new __PRIVATE_MemoryDocumentOverlayCache, this.overlays[e.toKey()] = t), t;
  }
  getMutationQueue(e, t) {
    let n = this.Br[e.toKey()];
    return n || (n = new __PRIVATE_MemoryMutationQueue(t, this.referenceDelegate), this.Br[e.toKey()] = n), n;
  }
  getTargetCache() {
    return this.Qr;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getBundleCache() {
    return this.$r;
  }
  runTransaction(e, t, n) {
    __PRIVATE_logDebug("MemoryPersistence", "Starting transaction:", e);
    const r = new __PRIVATE_MemoryTransaction(this.kr.next());
    return this.referenceDelegate.Ur(), n(r).next((e2) => this.referenceDelegate.Wr(r).next(() => e2)).toPromise().then((e2) => (r.raiseOnCommittedEvent(), e2));
  }
  Gr(e, t) {
    return PersistencePromise.or(Object.values(this.Br).map((n) => () => n.containsKey(e, t)));
  }
}

class __PRIVATE_MemoryTransaction extends PersistenceTransaction {
  constructor(e) {
    super(), this.currentSequenceNumber = e;
  }
}

class __PRIVATE_MemoryEagerDelegate {
  constructor(e) {
    this.persistence = e, this.zr = new __PRIVATE_ReferenceSet, this.jr = null;
  }
  static Hr(e) {
    return new __PRIVATE_MemoryEagerDelegate(e);
  }
  get Jr() {
    if (this.jr)
      return this.jr;
    throw fail();
  }
  addReference(e, t, n) {
    return this.zr.addReference(n, t), this.Jr.delete(n.toString()), PersistencePromise.resolve();
  }
  removeReference(e, t, n) {
    return this.zr.removeReference(n, t), this.Jr.add(n.toString()), PersistencePromise.resolve();
  }
  markPotentiallyOrphaned(e, t) {
    return this.Jr.add(t.toString()), PersistencePromise.resolve();
  }
  removeTarget(e, t) {
    this.zr.Vr(t.targetId).forEach((e2) => this.Jr.add(e2.toString()));
    const n = this.persistence.getTargetCache();
    return n.getMatchingKeysForTargetId(e, t.targetId).next((e2) => {
      e2.forEach((e3) => this.Jr.add(e3.toString()));
    }).next(() => n.removeTargetData(e, t));
  }
  Ur() {
    this.jr = new Set;
  }
  Wr(e) {
    const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
    return PersistencePromise.forEach(this.Jr, (n) => {
      const r = DocumentKey.fromPath(n);
      return this.Yr(e, r).next((e2) => {
        e2 || t.removeEntry(r, SnapshotVersion.min());
      });
    }).next(() => (this.jr = null, t.apply(e)));
  }
  updateLimboDocument(e, t) {
    return this.Yr(e, t).next((e2) => {
      e2 ? this.Jr.delete(t.toString()) : this.Jr.add(t.toString());
    });
  }
  Kr(e) {
    return 0;
  }
  Yr(e, t) {
    return PersistencePromise.or([() => PersistencePromise.resolve(this.zr.containsKey(t)), () => this.persistence.getTargetCache().containsKey(e, t), () => this.persistence.Gr(e, t)]);
  }
}
class __PRIVATE_LocalViewChanges {
  constructor(e, t, n, r) {
    this.targetId = e, this.fromCache = t, this.qi = n, this.Qi = r;
  }
  static Ki(e, t) {
    let n = __PRIVATE_documentKeySet(), r = __PRIVATE_documentKeySet();
    for (const e2 of t.docChanges)
      switch (e2.type) {
        case 0:
          n = n.add(e2.doc.key);
          break;
        case 1:
          r = r.add(e2.doc.key);
      }
    return new __PRIVATE_LocalViewChanges(e, t.fromCache, n, r);
  }
}

class QueryContext {
  constructor() {
    this._documentReadCount = 0;
  }
  get documentReadCount() {
    return this._documentReadCount;
  }
  incrementDocumentReadCount(e) {
    this._documentReadCount += e;
  }
}

class __PRIVATE_QueryEngine {
  constructor() {
    this.$i = false, this.Ui = false, this.Wi = 100, this.Gi = function __PRIVATE_getDefaultRelativeIndexReadCostPerDocument() {
      return isSafari() ? 8 : __PRIVATE_getAndroidVersion(getUA()) > 0 ? 6 : 4;
    }();
  }
  initialize(e, t) {
    this.zi = e, this.indexManager = t, this.$i = true;
  }
  getDocumentsMatchingQuery(e, t, n, r) {
    const i = {
      result: null
    };
    return this.ji(e, t).next((e2) => {
      i.result = e2;
    }).next(() => {
      if (!i.result)
        return this.Hi(e, t, r, n).next((e2) => {
          i.result = e2;
        });
    }).next(() => {
      if (i.result)
        return;
      const n2 = new QueryContext;
      return this.Ji(e, t, n2).next((r2) => {
        if (i.result = r2, this.Ui)
          return this.Yi(e, t, n2, r2.size);
      });
    }).next(() => i.result);
  }
  Yi(e, t, n, r) {
    return n.documentReadCount < this.Wi ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "SDK will not create cache indexes for query:", __PRIVATE_stringifyQuery(t), "since it only creates cache indexes for collection contains", "more than or equal to", this.Wi, "documents"), PersistencePromise.resolve()) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Query:", __PRIVATE_stringifyQuery(t), "scans", n.documentReadCount, "local documents and returns", r, "documents as results."), n.documentReadCount > this.Gi * r ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "The SDK decides to create cache indexes for query:", __PRIVATE_stringifyQuery(t), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e, __PRIVATE_queryToTarget(t))) : PersistencePromise.resolve());
  }
  ji(e, t) {
    if (__PRIVATE_queryMatchesAllDocuments(t))
      return PersistencePromise.resolve(null);
    let n = __PRIVATE_queryToTarget(t);
    return this.indexManager.getIndexType(e, n).next((r) => r === 0 ? null : (t.limit !== null && r === 1 && (t = __PRIVATE_queryWithLimit(t, null, "F"), n = __PRIVATE_queryToTarget(t)), this.indexManager.getDocumentsMatchingTarget(e, n).next((r2) => {
      const i = __PRIVATE_documentKeySet(...r2);
      return this.zi.getDocuments(e, i).next((r3) => this.indexManager.getMinOffset(e, n).next((n2) => {
        const s = this.Zi(t, r3);
        return this.Xi(t, s, i, n2.readTime) ? this.ji(e, __PRIVATE_queryWithLimit(t, null, "F")) : this.es(e, s, t, n2);
      }));
    })));
  }
  Hi(e, t, n, r) {
    return __PRIVATE_queryMatchesAllDocuments(t) || r.isEqual(SnapshotVersion.min()) ? PersistencePromise.resolve(null) : this.zi.getDocuments(e, n).next((i) => {
      const s = this.Zi(t, i);
      return this.Xi(t, s, n, r) ? PersistencePromise.resolve(null) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Re-using previous result from %s to execute query: %s", r.toString(), __PRIVATE_stringifyQuery(t)), this.es(e, s, t, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r, -1)).next((e2) => e2));
    });
  }
  Zi(e, t) {
    let n = new SortedSet(__PRIVATE_newQueryComparator(e));
    return t.forEach((t2, r) => {
      __PRIVATE_queryMatches(e, r) && (n = n.add(r));
    }), n;
  }
  Xi(e, t, n, r) {
    if (e.limit === null)
      return false;
    if (n.size !== t.size)
      return true;
    const i = e.limitType === "F" ? t.last() : t.first();
    return !!i && (i.hasPendingWrites || i.version.compareTo(r) > 0);
  }
  Ji(e, t, n) {
    return __PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Using full collection scan to execute query:", __PRIVATE_stringifyQuery(t)), this.zi.getDocumentsMatchingQuery(e, t, IndexOffset.min(), n);
  }
  es(e, t, n, r) {
    return this.zi.getDocumentsMatchingQuery(e, n, r).next((e2) => (t.forEach((t2) => {
      e2 = e2.insert(t2.key, t2);
    }), e2));
  }
}

class __PRIVATE_LocalStoreImpl {
  constructor(e, t, n, r) {
    this.persistence = e, this.ts = t, this.serializer = r, this.ns = new SortedMap(__PRIVATE_primitiveComparator), this.rs = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), __PRIVATE_targetEquals), this.ss = new Map, this.os = e.getRemoteDocumentCache(), this.Qr = e.getTargetCache(), this.$r = e.getBundleCache(), this._s(n);
  }
  _s(e) {
    this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new LocalDocumentsView(this.os, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.os.setIndexManager(this.indexManager), this.ts.initialize(this.localDocuments, this.indexManager);
  }
  collectGarbage(e) {
    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (t) => e.collect(t, this.ns));
  }
}
class __PRIVATE_LocalClientState {
  constructor() {
    this.activeTargetIds = __PRIVATE_targetIdSet();
  }
  As(e) {
    this.activeTargetIds = this.activeTargetIds.add(e);
  }
  Rs(e) {
    this.activeTargetIds = this.activeTargetIds.delete(e);
  }
  ds() {
    const e = {
      activeTargetIds: this.activeTargetIds.toArray(),
      updateTimeMs: Date.now()
    };
    return JSON.stringify(e);
  }
}
class __PRIVATE_MemorySharedClientState {
  constructor() {
    this.no = new __PRIVATE_LocalClientState, this.ro = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
  }
  addPendingMutation(e) {
  }
  updateMutationState(e, t, n) {
  }
  addLocalQueryTarget(e) {
    return this.no.As(e), this.ro[e] || "not-current";
  }
  updateQueryState(e, t, n) {
    this.ro[e] = t;
  }
  removeLocalQueryTarget(e) {
    this.no.Rs(e);
  }
  isLocalQueryTarget(e) {
    return this.no.activeTargetIds.has(e);
  }
  clearQueryState(e) {
    delete this.ro[e];
  }
  getAllActiveQueryTargets() {
    return this.no.activeTargetIds;
  }
  isActiveQueryTarget(e) {
    return this.no.activeTargetIds.has(e);
  }
  start() {
    return this.no = new __PRIVATE_LocalClientState, Promise.resolve();
  }
  handleUserChange(e, t, n) {
  }
  setOnlineState(e) {
  }
  shutdown() {
  }
  writeSequenceNumber(e) {
  }
  notifyBundleLoaded(e) {
  }
}

class __PRIVATE_NoopConnectivityMonitor {
  io(e) {
  }
  shutdown() {
  }
}

class __PRIVATE_BrowserConnectivityMonitor {
  constructor() {
    this.so = () => this.oo(), this._o = () => this.ao(), this.uo = [], this.co();
  }
  io(e) {
    this.uo.push(e);
  }
  shutdown() {
    window.removeEventListener("online", this.so), window.removeEventListener("offline", this._o);
  }
  co() {
    window.addEventListener("online", this.so), window.addEventListener("offline", this._o);
  }
  oo() {
    __PRIVATE_logDebug("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
    for (const e of this.uo)
      e(0);
  }
  ao() {
    __PRIVATE_logDebug("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
    for (const e of this.uo)
      e(1);
  }
  static D() {
    return typeof window != "undefined" && window.addEventListener !== undefined && window.removeEventListener !== undefined;
  }
}
var Ve = null;
var me = {
  BatchGetDocuments: "batchGet",
  Commit: "commit",
  RunQuery: "runQuery",
  RunAggregationQuery: "runAggregationQuery"
};

class __PRIVATE_StreamBridge {
  constructor(e) {
    this.lo = e.lo, this.ho = e.ho;
  }
  Po(e) {
    this.Io = e;
  }
  To(e) {
    this.Eo = e;
  }
  Ao(e) {
    this.Ro = e;
  }
  onMessage(e) {
    this.Vo = e;
  }
  close() {
    this.ho();
  }
  send(e) {
    this.lo(e);
  }
  mo() {
    this.Io();
  }
  fo() {
    this.Eo();
  }
  po(e) {
    this.Ro(e);
  }
  yo(e) {
    this.Vo(e);
  }
}
var fe = "WebChannelConnection";

class __PRIVATE_WebChannelConnection extends class __PRIVATE_RestConnection {
  constructor(e) {
    this.databaseInfo = e, this.databaseId = e.databaseId;
    const t = e.ssl ? "https" : "http", n = encodeURIComponent(this.databaseId.projectId), r = encodeURIComponent(this.databaseId.database);
    this.wo = t + "://" + e.host, this.So = `projects/${n}/databases/${r}`, this.bo = this.databaseId.database === "(default)" ? `project_id=${n}` : `project_id=${n}&database_id=${r}`;
  }
  get Do() {
    return false;
  }
  Co(e, t, n, r, i) {
    const s = __PRIVATE_generateUniqueDebugId(), o = this.vo(e, t.toUriEncodedString());
    __PRIVATE_logDebug("RestConnection", `Sending RPC '${e}' ${s}:`, o, n);
    const _ = {
      "google-cloud-resource-prefix": this.So,
      "x-goog-request-params": this.bo
    };
    return this.Fo(_, r, i), this.Mo(e, o, _, n).then((t2) => (__PRIVATE_logDebug("RestConnection", `Received RPC '${e}' ${s}: `, t2), t2), (t2) => {
      throw __PRIVATE_logWarn("RestConnection", `RPC '${e}' ${s} failed with error: `, t2, "url: ", o, "request:", n), t2;
    });
  }
  xo(e, t, n, r, i, s) {
    return this.Co(e, t, n, r, i);
  }
  Fo(e, t, n) {
    e["X-Goog-Api-Client"] = function __PRIVATE_getGoogApiClientValue() {
      return "gl-js/ fire/" + b;
    }(), e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t && t.headers.forEach((t2, n2) => e[n2] = t2), n && n.headers.forEach((t2, n2) => e[n2] = t2);
  }
  vo(e, t) {
    const n = me[e];
    return `${this.wo}/v1/${t}:${n}`;
  }
  terminate() {
  }
} {
  constructor(e) {
    super(e), this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
  }
  Mo(e, t, n, r) {
    const i = __PRIVATE_generateUniqueDebugId();
    return new Promise((s, o) => {
      const _ = new XhrIo;
      _.setWithCredentials(true), _.listenOnce(EventType.COMPLETE, () => {
        try {
          switch (_.getLastErrorCode()) {
            case ErrorCode.NO_ERROR:
              const t2 = _.getResponseJson();
              __PRIVATE_logDebug(fe, `XHR for RPC '${e}' ${i} received:`, JSON.stringify(t2)), s(t2);
              break;
            case ErrorCode.TIMEOUT:
              __PRIVATE_logDebug(fe, `RPC '${e}' ${i} timed out`), o(new FirestoreError(C.DEADLINE_EXCEEDED, "Request time out"));
              break;
            case ErrorCode.HTTP_ERROR:
              const n2 = _.getStatus();
              if (__PRIVATE_logDebug(fe, `RPC '${e}' ${i} failed with status:`, n2, "response text:", _.getResponseText()), n2 > 0) {
                let e2 = _.getResponseJson();
                Array.isArray(e2) && (e2 = e2[0]);
                const t3 = e2 == null ? undefined : e2.error;
                if (t3 && t3.status && t3.message) {
                  const e3 = function __PRIVATE_mapCodeFromHttpResponseErrorStatus(e4) {
                    const t4 = e4.toLowerCase().replace(/_/g, "-");
                    return Object.values(C).indexOf(t4) >= 0 ? t4 : C.UNKNOWN;
                  }(t3.status);
                  o(new FirestoreError(e3, t3.message));
                } else
                  o(new FirestoreError(C.UNKNOWN, "Server responded with status " + _.getStatus()));
              } else
                o(new FirestoreError(C.UNAVAILABLE, "Connection failed."));
              break;
            default:
              fail();
          }
        } finally {
          __PRIVATE_logDebug(fe, `RPC '${e}' ${i} completed.`);
        }
      });
      const a = JSON.stringify(r);
      __PRIVATE_logDebug(fe, `RPC '${e}' ${i} sending request:`, r), _.send(t, "POST", a, n, 15);
    });
  }
  Oo(e, t, n) {
    const r = __PRIVATE_generateUniqueDebugId(), i = [this.wo, "/", "google.firestore.v1.Firestore", "/", e, "/channel"], s = createWebChannelTransport(), o = getStatEventTarget(), _ = {
      httpSessionIdParam: "gsessionid",
      initMessageHeaders: {},
      messageUrlParams: {
        database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
      },
      sendRawJson: true,
      supportsCrossDomainXhr: true,
      internalChannelParams: {
        forwardChannelRequestTimeoutMs: 600000
      },
      forceLongPolling: this.forceLongPolling,
      detectBufferingProxy: this.autoDetectLongPolling
    }, a = this.longPollingOptions.timeoutSeconds;
    a !== undefined && (_.longPollingTimeout = Math.round(1000 * a)), this.useFetchStreams && (_.xmlHttpFactory = new FetchXmlHttpFactory({})), this.Fo(_.initMessageHeaders, t, n), _.encodeInitMessageHeaders = true;
    const u = i.join("");
    __PRIVATE_logDebug(fe, `Creating RPC '${e}' stream ${r}: ${u}`, _);
    const c = s.createWebChannel(u, _);
    let l = false, h = false;
    const P = new __PRIVATE_StreamBridge({
      lo: (t2) => {
        h ? __PRIVATE_logDebug(fe, `Not sending because RPC '${e}' stream ${r} is closed:`, t2) : (l || (__PRIVATE_logDebug(fe, `Opening RPC '${e}' stream ${r} transport.`), c.open(), l = true), __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} sending:`, t2), c.send(t2));
      },
      ho: () => c.close()
    }), __PRIVATE_unguardedEventListen = (e2, t2, n2) => {
      e2.listen(t2, (e3) => {
        try {
          n2(e3);
        } catch (e4) {
          setTimeout(() => {
            throw e4;
          }, 0);
        }
      });
    };
    return __PRIVATE_unguardedEventListen(c, WebChannel.EventType.OPEN, () => {
      h || (__PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} transport opened.`), P.mo());
    }), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.CLOSE, () => {
      h || (h = true, __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} transport closed`), P.po());
    }), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.ERROR, (t2) => {
      h || (h = true, __PRIVATE_logWarn(fe, `RPC '${e}' stream ${r} transport errored:`, t2), P.po(new FirestoreError(C.UNAVAILABLE, "The operation could not be completed")));
    }), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.MESSAGE, (t2) => {
      var n2;
      if (!h) {
        const i2 = t2.data[0];
        __PRIVATE_hardAssert(!!i2);
        const s2 = i2, o2 = s2.error || ((n2 = s2[0]) === null || n2 === undefined ? undefined : n2.error);
        if (o2) {
          __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} received error:`, o2);
          const t3 = o2.status;
          let n3 = function __PRIVATE_mapCodeFromRpcStatus(e2) {
            const t4 = ce[e2];
            if (t4 !== undefined)
              return __PRIVATE_mapCodeFromRpcCode(t4);
          }(t3), i3 = o2.message;
          n3 === undefined && (n3 = C.INTERNAL, i3 = "Unknown error status: " + t3 + " with message " + o2.message), h = true, P.po(new FirestoreError(n3, i3)), c.close();
        } else
          __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} received:`, i2), P.yo(i2);
      }
    }), __PRIVATE_unguardedEventListen(o, Event.STAT_EVENT, (t2) => {
      t2.stat === Stat.PROXY ? __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} detected buffering proxy`) : t2.stat === Stat.NOPROXY && __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} detected no buffering proxy`);
    }), setTimeout(() => {
      P.fo();
    }, 0), P;
  }
}

class __PRIVATE_ExponentialBackoff {
  constructor(e, t, n = 1000, r = 1.5, i = 60000) {
    this.oi = e, this.timerId = t, this.No = n, this.Lo = r, this.Bo = i, this.ko = 0, this.qo = null, this.Qo = Date.now(), this.reset();
  }
  reset() {
    this.ko = 0;
  }
  Ko() {
    this.ko = this.Bo;
  }
  $o(e) {
    this.cancel();
    const t = Math.floor(this.ko + this.Uo()), n = Math.max(0, Date.now() - this.Qo), r = Math.max(0, t - n);
    r > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r} ms (base delay: ${this.ko} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`), this.qo = this.oi.enqueueAfterDelay(this.timerId, r, () => (this.Qo = Date.now(), e())), this.ko *= this.Lo, this.ko < this.No && (this.ko = this.No), this.ko > this.Bo && (this.ko = this.Bo);
  }
  Wo() {
    this.qo !== null && (this.qo.skipDelay(), this.qo = null);
  }
  cancel() {
    this.qo !== null && (this.qo.cancel(), this.qo = null);
  }
  Uo() {
    return (Math.random() - 0.5) * this.ko;
  }
}

class __PRIVATE_PersistentStream {
  constructor(e, t, n, r, i, s, o, _) {
    this.oi = e, this.Go = n, this.zo = r, this.connection = i, this.authCredentialsProvider = s, this.appCheckCredentialsProvider = o, this.listener = _, this.state = 0, this.jo = 0, this.Ho = null, this.Jo = null, this.stream = null, this.Yo = new __PRIVATE_ExponentialBackoff(e, t);
  }
  Zo() {
    return this.state === 1 || this.state === 5 || this.Xo();
  }
  Xo() {
    return this.state === 2 || this.state === 3;
  }
  start() {
    this.state !== 4 ? this.auth() : this.e_();
  }
  async stop() {
    this.Zo() && await this.close(0);
  }
  t_() {
    this.state = 0, this.Yo.reset();
  }
  n_() {
    this.Xo() && this.Ho === null && (this.Ho = this.oi.enqueueAfterDelay(this.Go, 60000, () => this.r_()));
  }
  i_(e) {
    this.s_(), this.stream.send(e);
  }
  async r_() {
    if (this.Xo())
      return this.close(0);
  }
  s_() {
    this.Ho && (this.Ho.cancel(), this.Ho = null);
  }
  o_() {
    this.Jo && (this.Jo.cancel(), this.Jo = null);
  }
  async close(e, t) {
    this.s_(), this.o_(), this.Yo.cancel(), this.jo++, e !== 4 ? this.Yo.reset() : t && t.code === C.RESOURCE_EXHAUSTED ? (__PRIVATE_logError(t.toString()), __PRIVATE_logError("Using maximum backoff delay to prevent overloading the backend."), this.Yo.Ko()) : t && t.code === C.UNAUTHENTICATED && this.state !== 3 && (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), this.stream !== null && (this.__(), this.stream.close(), this.stream = null), this.state = e, await this.listener.Ao(t);
  }
  __() {
  }
  auth() {
    this.state = 1;
    const e = this.a_(this.jo), t = this.jo;
    Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then(([e2, n]) => {
      this.jo === t && this.u_(e2, n);
    }, (t2) => {
      e(() => {
        const e2 = new FirestoreError(C.UNKNOWN, "Fetching auth token failed: " + t2.message);
        return this.c_(e2);
      });
    });
  }
  u_(e, t) {
    const n = this.a_(this.jo);
    this.stream = this.l_(e, t), this.stream.Po(() => {
      n(() => this.listener.Po());
    }), this.stream.To(() => {
      n(() => (this.state = 2, this.Jo = this.oi.enqueueAfterDelay(this.zo, 1e4, () => (this.Xo() && (this.state = 3), Promise.resolve())), this.listener.To()));
    }), this.stream.Ao((e2) => {
      n(() => this.c_(e2));
    }), this.stream.onMessage((e2) => {
      n(() => this.onMessage(e2));
    });
  }
  e_() {
    this.state = 5, this.Yo.$o(async () => {
      this.state = 0, this.start();
    });
  }
  c_(e) {
    return __PRIVATE_logDebug("PersistentStream", `close with error: ${e}`), this.stream = null, this.close(4, e);
  }
  a_(e) {
    return (t) => {
      this.oi.enqueueAndForget(() => this.jo === e ? t() : (__PRIVATE_logDebug("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
    };
  }
}

class __PRIVATE_PersistentListenStream extends __PRIVATE_PersistentStream {
  constructor(e, t, n, r, i, s) {
    super(e, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", t, n, r, s), this.serializer = i;
  }
  l_(e, t) {
    return this.connection.Oo("Listen", e, t);
  }
  onMessage(e) {
    this.Yo.reset();
    const t = __PRIVATE_fromWatchChange(this.serializer, e), n = function __PRIVATE_versionFromListenResponse(e2) {
      if (!("targetChange" in e2))
        return SnapshotVersion.min();
      const t2 = e2.targetChange;
      return t2.targetIds && t2.targetIds.length ? SnapshotVersion.min() : t2.readTime ? __PRIVATE_fromVersion(t2.readTime) : SnapshotVersion.min();
    }(e);
    return this.listener.h_(t, n);
  }
  P_(e) {
    const t = {};
    t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.addTarget = function __PRIVATE_toTarget(e2, t2) {
      let n2;
      const r = t2.target;
      if (n2 = __PRIVATE_targetIsDocumentTarget(r) ? {
        documents: __PRIVATE_toDocumentsTarget(e2, r)
      } : {
        query: __PRIVATE_toQueryTarget(e2, r)._t
      }, n2.targetId = t2.targetId, t2.resumeToken.approximateByteSize() > 0) {
        n2.resumeToken = __PRIVATE_toBytes(e2, t2.resumeToken);
        const r2 = __PRIVATE_toInt32Proto(e2, t2.expectedCount);
        r2 !== null && (n2.expectedCount = r2);
      } else if (t2.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
        n2.readTime = toTimestamp(e2, t2.snapshotVersion.toTimestamp());
        const r2 = __PRIVATE_toInt32Proto(e2, t2.expectedCount);
        r2 !== null && (n2.expectedCount = r2);
      }
      return n2;
    }(this.serializer, e);
    const n = __PRIVATE_toListenRequestLabels(this.serializer, e);
    n && (t.labels = n), this.i_(t);
  }
  I_(e) {
    const t = {};
    t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.removeTarget = e, this.i_(t);
  }
}
class __PRIVATE_DatastoreImpl extends class Datastore {
} {
  constructor(e, t, n, r) {
    super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = n, this.serializer = r, this.m_ = false;
  }
  f_() {
    if (this.m_)
      throw new FirestoreError(C.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  Co(e, t, n, r) {
    return this.f_(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([i, s]) => this.connection.Co(e, __PRIVATE_toResourcePath(t, n), r, i, s)).catch((e2) => {
      throw e2.name === "FirebaseError" ? (e2.code === C.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(C.UNKNOWN, e2.toString());
    });
  }
  xo(e, t, n, r, i) {
    return this.f_(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([s, o]) => this.connection.xo(e, __PRIVATE_toResourcePath(t, n), r, s, o, i)).catch((e2) => {
      throw e2.name === "FirebaseError" ? (e2.code === C.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(C.UNKNOWN, e2.toString());
    });
  }
  terminate() {
    this.m_ = true, this.connection.terminate();
  }
}

class __PRIVATE_OnlineStateTracker {
  constructor(e, t) {
    this.asyncQueue = e, this.onlineStateHandler = t, this.state = "Unknown", this.g_ = 0, this.p_ = null, this.y_ = true;
  }
  w_() {
    this.g_ === 0 && (this.S_("Unknown"), this.p_ = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, () => (this.p_ = null, this.b_("Backend didn't respond within 10 seconds."), this.S_("Offline"), Promise.resolve())));
  }
  D_(e) {
    this.state === "Online" ? this.S_("Unknown") : (this.g_++, this.g_ >= 1 && (this.C_(), this.b_(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.S_("Offline")));
  }
  set(e) {
    this.C_(), this.g_ = 0, e === "Online" && (this.y_ = false), this.S_(e);
  }
  S_(e) {
    e !== this.state && (this.state = e, this.onlineStateHandler(e));
  }
  b_(e) {
    const t = `Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
    this.y_ ? (__PRIVATE_logError(t), this.y_ = false) : __PRIVATE_logDebug("OnlineStateTracker", t);
  }
  C_() {
    this.p_ !== null && (this.p_.cancel(), this.p_ = null);
  }
}

class __PRIVATE_RemoteStoreImpl {
  constructor(e, t, n, r, i) {
    this.localStore = e, this.datastore = t, this.asyncQueue = n, this.remoteSyncer = {}, this.v_ = [], this.F_ = new Map, this.M_ = new Set, this.x_ = [], this.O_ = i, this.O_.io((e2) => {
      n.enqueueAndForget(async () => {
        __PRIVATE_canUseNetwork(this) && (__PRIVATE_logDebug("RemoteStore", "Restarting streams for network reachability change."), await async function __PRIVATE_restartNetwork(e3) {
          const t2 = __PRIVATE_debugCast(e3);
          t2.M_.add(4), await __PRIVATE_disableNetworkInternal(t2), t2.N_.set("Unknown"), t2.M_.delete(4), await __PRIVATE_enableNetworkInternal(t2);
        }(this));
      });
    }), this.N_ = new __PRIVATE_OnlineStateTracker(n, r);
  }
}

class DelayedOperation {
  constructor(e, t, n, r, i) {
    this.asyncQueue = e, this.timerId = t, this.targetTimeMs = n, this.op = r, this.removalCallback = i, this.deferred = new __PRIVATE_Deferred, this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((e2) => {
    });
  }
  get promise() {
    return this.deferred.promise;
  }
  static createAndSchedule(e, t, n, r, i) {
    const s = Date.now() + n, o = new DelayedOperation(e, t, s, r, i);
    return o.start(n), o;
  }
  start(e) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
  }
  skipDelay() {
    return this.handleDelayElapsed();
  }
  cancel(e) {
    this.timerHandle !== null && (this.clearTimeout(), this.deferred.reject(new FirestoreError(C.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() => this.timerHandle !== null ? (this.clearTimeout(), this.op().then((e) => this.deferred.resolve(e))) : Promise.resolve());
  }
  clearTimeout() {
    this.timerHandle !== null && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
  }
}

class DocumentSet {
  constructor(e) {
    this.comparator = e ? (t, n) => e(t, n) || DocumentKey.comparator(t.key, n.key) : (e2, t) => DocumentKey.comparator(e2.key, t.key), this.keyedMap = documentMap(), this.sortedSet = new SortedMap(this.comparator);
  }
  static emptySet(e) {
    return new DocumentSet(e.comparator);
  }
  has(e) {
    return this.keyedMap.get(e) != null;
  }
  get(e) {
    return this.keyedMap.get(e);
  }
  first() {
    return this.sortedSet.minKey();
  }
  last() {
    return this.sortedSet.maxKey();
  }
  isEmpty() {
    return this.sortedSet.isEmpty();
  }
  indexOf(e) {
    const t = this.keyedMap.get(e);
    return t ? this.sortedSet.indexOf(t) : -1;
  }
  get size() {
    return this.sortedSet.size;
  }
  forEach(e) {
    this.sortedSet.inorderTraversal((t, n) => (e(t), false));
  }
  add(e) {
    const t = this.delete(e.key);
    return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
  }
  delete(e) {
    const t = this.get(e);
    return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this;
  }
  isEqual(e) {
    if (!(e instanceof DocumentSet))
      return false;
    if (this.size !== e.size)
      return false;
    const t = this.sortedSet.getIterator(), n = e.sortedSet.getIterator();
    for (;t.hasNext(); ) {
      const e2 = t.getNext().key, r = n.getNext().key;
      if (!e2.isEqual(r))
        return false;
    }
    return true;
  }
  toString() {
    const e = [];
    return this.forEach((t) => {
      e.push(t.toString());
    }), e.length === 0 ? "DocumentSet ()" : "DocumentSet (\n  " + e.join("  \n") + "\n)";
  }
  copy(e, t) {
    const n = new DocumentSet;
    return n.comparator = this.comparator, n.keyedMap = e, n.sortedSet = t, n;
  }
}

class __PRIVATE_DocumentChangeSet {
  constructor() {
    this.q_ = new SortedMap(DocumentKey.comparator);
  }
  track(e) {
    const t = e.doc.key, n = this.q_.get(t);
    n ? e.type !== 0 && n.type === 3 ? this.q_ = this.q_.insert(t, e) : e.type === 3 && n.type !== 1 ? this.q_ = this.q_.insert(t, {
      type: n.type,
      doc: e.doc
    }) : e.type === 2 && n.type === 2 ? this.q_ = this.q_.insert(t, {
      type: 2,
      doc: e.doc
    }) : e.type === 2 && n.type === 0 ? this.q_ = this.q_.insert(t, {
      type: 0,
      doc: e.doc
    }) : e.type === 1 && n.type === 0 ? this.q_ = this.q_.remove(t) : e.type === 1 && n.type === 2 ? this.q_ = this.q_.insert(t, {
      type: 1,
      doc: n.doc
    }) : e.type === 0 && n.type === 1 ? this.q_ = this.q_.insert(t, {
      type: 2,
      doc: e.doc
    }) : fail() : this.q_ = this.q_.insert(t, e);
  }
  Q_() {
    const e = [];
    return this.q_.inorderTraversal((t, n) => {
      e.push(n);
    }), e;
  }
}

class ViewSnapshot {
  constructor(e, t, n, r, i, s, o, _, a) {
    this.query = e, this.docs = t, this.oldDocs = n, this.docChanges = r, this.mutatedKeys = i, this.fromCache = s, this.syncStateChanged = o, this.excludesMetadataChanges = _, this.hasCachedResults = a;
  }
  static fromInitialDocuments(e, t, n, r, i) {
    const s = [];
    return t.forEach((e2) => {
      s.push({
        type: 0,
        doc: e2
      });
    }), new ViewSnapshot(e, t, DocumentSet.emptySet(t), s, n, r, true, false, i);
  }
  get hasPendingWrites() {
    return !this.mutatedKeys.isEmpty();
  }
  isEqual(e) {
    if (!(this.fromCache === e.fromCache && this.hasCachedResults === e.hasCachedResults && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && __PRIVATE_queryEquals(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs)))
      return false;
    const t = this.docChanges, n = e.docChanges;
    if (t.length !== n.length)
      return false;
    for (let e2 = 0;e2 < t.length; e2++)
      if (t[e2].type !== n[e2].type || !t[e2].doc.isEqual(n[e2].doc))
        return false;
    return true;
  }
}

class __PRIVATE_QueryListenersInfo {
  constructor() {
    this.K_ = undefined, this.U_ = [];
  }
  W_() {
    return this.U_.some((e) => e.G_());
  }
}

class __PRIVATE_EventManagerImpl {
  constructor() {
    this.queries = new ObjectMap((e) => __PRIVATE_canonifyQuery(e), __PRIVATE_queryEquals), this.onlineState = "Unknown", this.z_ = new Set;
  }
}
var ge;
var pe;
(pe = ge || (ge = {})).J_ = "default", pe.Cache = "cache";

class __PRIVATE_QueryListener {
  constructor(e, t, n) {
    this.query = e, this.Y_ = t, this.Z_ = false, this.X_ = null, this.onlineState = "Unknown", this.options = n || {};
  }
  H_(e) {
    if (!this.options.includeMetadataChanges) {
      const t2 = [];
      for (const n of e.docChanges)
        n.type !== 3 && t2.push(n);
      e = new ViewSnapshot(e.query, e.docs, e.oldDocs, t2, e.mutatedKeys, e.fromCache, e.syncStateChanged, true, e.hasCachedResults);
    }
    let t = false;
    return this.Z_ ? this.ea(e) && (this.Y_.next(e), t = true) : this.ta(e, this.onlineState) && (this.na(e), t = true), this.X_ = e, t;
  }
  onError(e) {
    this.Y_.error(e);
  }
  j_(e) {
    this.onlineState = e;
    let t = false;
    return this.X_ && !this.Z_ && this.ta(this.X_, e) && (this.na(this.X_), t = true), t;
  }
  ta(e, t) {
    if (!e.fromCache)
      return true;
    if (!this.G_())
      return true;
    const n = t !== "Offline";
    return (!this.options.ra || !n) && (!e.docs.isEmpty() || e.hasCachedResults || t === "Offline");
  }
  ea(e) {
    if (e.docChanges.length > 0)
      return true;
    const t = this.X_ && this.X_.hasPendingWrites !== e.hasPendingWrites;
    return !(!e.syncStateChanged && !t) && this.options.includeMetadataChanges === true;
  }
  na(e) {
    e = ViewSnapshot.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults), this.Z_ = true, this.Y_.next(e);
  }
  G_() {
    return this.options.source !== ge.Cache;
  }
}
class __PRIVATE_AddedLimboDocument {
  constructor(e) {
    this.key = e;
  }
}

class __PRIVATE_RemovedLimboDocument {
  constructor(e) {
    this.key = e;
  }
}

class __PRIVATE_View {
  constructor(e, t) {
    this.query = e, this.la = t, this.ha = null, this.hasCachedResults = false, this.current = false, this.Pa = __PRIVATE_documentKeySet(), this.mutatedKeys = __PRIVATE_documentKeySet(), this.Ia = __PRIVATE_newQueryComparator(e), this.Ta = new DocumentSet(this.Ia);
  }
  get Ea() {
    return this.la;
  }
  da(e, t) {
    const n = t ? t.Aa : new __PRIVATE_DocumentChangeSet, r = t ? t.Ta : this.Ta;
    let i = t ? t.mutatedKeys : this.mutatedKeys, s = r, o = false;
    const _ = this.query.limitType === "F" && r.size === this.query.limit ? r.last() : null, a = this.query.limitType === "L" && r.size === this.query.limit ? r.first() : null;
    if (e.inorderTraversal((e2, t2) => {
      const u = r.get(e2), c = __PRIVATE_queryMatches(this.query, t2) ? t2 : null, l = !!u && this.mutatedKeys.has(u.key), h = !!c && (c.hasLocalMutations || this.mutatedKeys.has(c.key) && c.hasCommittedMutations);
      let P = false;
      if (u && c) {
        u.data.isEqual(c.data) ? l !== h && (n.track({
          type: 3,
          doc: c
        }), P = true) : this.Ra(u, c) || (n.track({
          type: 2,
          doc: c
        }), P = true, (_ && this.Ia(c, _) > 0 || a && this.Ia(c, a) < 0) && (o = true));
      } else
        !u && c ? (n.track({
          type: 0,
          doc: c
        }), P = true) : u && !c && (n.track({
          type: 1,
          doc: u
        }), P = true, (_ || a) && (o = true));
      P && (c ? (s = s.add(c), i = h ? i.add(e2) : i.delete(e2)) : (s = s.delete(e2), i = i.delete(e2)));
    }), this.query.limit !== null)
      for (;s.size > this.query.limit; ) {
        const e2 = this.query.limitType === "F" ? s.last() : s.first();
        s = s.delete(e2.key), i = i.delete(e2.key), n.track({
          type: 1,
          doc: e2
        });
      }
    return {
      Ta: s,
      Aa: n,
      Xi: o,
      mutatedKeys: i
    };
  }
  Ra(e, t) {
    return e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations;
  }
  applyChanges(e, t, n, r) {
    const i = this.Ta;
    this.Ta = e.Ta, this.mutatedKeys = e.mutatedKeys;
    const s = e.Aa.Q_();
    s.sort((e2, t2) => function __PRIVATE_compareChangeType(e3, t3) {
      const order = (e4) => {
        switch (e4) {
          case 0:
            return 1;
          case 2:
          case 3:
            return 2;
          case 1:
            return 0;
          default:
            return fail();
        }
      };
      return order(e3) - order(t3);
    }(e2.type, t2.type) || this.Ia(e2.doc, t2.doc)), this.Va(n), r = r != null && r;
    const o = t && !r ? this.ma() : [], _ = this.Pa.size === 0 && this.current && !r ? 1 : 0, a = _ !== this.ha;
    if (this.ha = _, s.length !== 0 || a) {
      return {
        snapshot: new ViewSnapshot(this.query, e.Ta, i, s, e.mutatedKeys, _ === 0, a, false, !!n && n.resumeToken.approximateByteSize() > 0),
        fa: o
      };
    }
    return {
      fa: o
    };
  }
  j_(e) {
    return this.current && e === "Offline" ? (this.current = false, this.applyChanges({
      Ta: this.Ta,
      Aa: new __PRIVATE_DocumentChangeSet,
      mutatedKeys: this.mutatedKeys,
      Xi: false
    }, false)) : {
      fa: []
    };
  }
  ga(e) {
    return !this.la.has(e) && (!!this.Ta.has(e) && !this.Ta.get(e).hasLocalMutations);
  }
  Va(e) {
    e && (e.addedDocuments.forEach((e2) => this.la = this.la.add(e2)), e.modifiedDocuments.forEach((e2) => {
    }), e.removedDocuments.forEach((e2) => this.la = this.la.delete(e2)), this.current = e.current);
  }
  ma() {
    if (!this.current)
      return [];
    const e = this.Pa;
    this.Pa = __PRIVATE_documentKeySet(), this.Ta.forEach((e2) => {
      this.ga(e2.key) && (this.Pa = this.Pa.add(e2.key));
    });
    const t = [];
    return e.forEach((e2) => {
      this.Pa.has(e2) || t.push(new __PRIVATE_RemovedLimboDocument(e2));
    }), this.Pa.forEach((n) => {
      e.has(n) || t.push(new __PRIVATE_AddedLimboDocument(n));
    }), t;
  }
  pa(e) {
    this.la = e.hs, this.Pa = __PRIVATE_documentKeySet();
    const t = this.da(e.documents);
    return this.applyChanges(t, true);
  }
  ya() {
    return ViewSnapshot.fromInitialDocuments(this.query, this.Ta, this.mutatedKeys, this.ha === 0, this.hasCachedResults);
  }
}

class __PRIVATE_QueryView {
  constructor(e, t, n) {
    this.query = e, this.targetId = t, this.view = n;
  }
}

class LimboResolution {
  constructor(e) {
    this.key = e, this.wa = false;
  }
}

class __PRIVATE_SyncEngineImpl {
  constructor(e, t, n, r, i, s) {
    this.localStore = e, this.remoteStore = t, this.eventManager = n, this.sharedClientState = r, this.currentUser = i, this.maxConcurrentLimboResolutions = s, this.Sa = {}, this.ba = new ObjectMap((e2) => __PRIVATE_canonifyQuery(e2), __PRIVATE_queryEquals), this.Da = new Map, this.Ca = new Set, this.va = new SortedMap(DocumentKey.comparator), this.Fa = new Map, this.Ma = new __PRIVATE_ReferenceSet, this.xa = {}, this.Oa = new Map, this.Na = __PRIVATE_TargetIdGenerator.Ln(), this.onlineState = "Unknown", this.La = undefined;
  }
  get isPrimaryClient() {
    return this.La === true;
  }
}

class MemoryOfflineComponentProvider {
  constructor() {
    this.synchronizeTabs = false;
  }
  async initialize(e) {
    this.serializer = __PRIVATE_newSerializer(e.databaseInfo.databaseId), this.sharedClientState = this.createSharedClientState(e), this.persistence = this.createPersistence(e), await this.persistence.start(), this.localStore = this.createLocalStore(e), this.gcScheduler = this.createGarbageCollectionScheduler(e, this.localStore), this.indexBackfillerScheduler = this.createIndexBackfillerScheduler(e, this.localStore);
  }
  createGarbageCollectionScheduler(e, t) {
    return null;
  }
  createIndexBackfillerScheduler(e, t) {
    return null;
  }
  createLocalStore(e) {
    return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine, e.initialUser, this.serializer);
  }
  createPersistence(e) {
    return new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.Hr, this.serializer);
  }
  createSharedClientState(e) {
    return new __PRIVATE_MemorySharedClientState;
  }
  async terminate() {
    var e, t;
    (e = this.gcScheduler) === null || e === undefined || e.stop(), (t = this.indexBackfillerScheduler) === null || t === undefined || t.stop(), this.sharedClientState.shutdown(), await this.persistence.shutdown();
  }
}
class OnlineComponentProvider {
  async initialize(e, t) {
    this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, this.datastore = this.createDatastore(t), this.remoteStore = this.createRemoteStore(t), this.eventManager = this.createEventManager(t), this.syncEngine = this.createSyncEngine(t, !e.synchronizeTabs), this.sharedClientState.onlineStateHandler = (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(this.syncEngine, e2, 1), this.remoteStore.remoteSyncer.handleCredentialChange = __PRIVATE_syncEngineHandleCredentialChange.bind(null, this.syncEngine), await __PRIVATE_remoteStoreApplyPrimaryState(this.remoteStore, this.syncEngine.isPrimaryClient));
  }
  createEventManager(e) {
    return function __PRIVATE_newEventManager() {
      return new __PRIVATE_EventManagerImpl;
    }();
  }
  createDatastore(e) {
    const t = __PRIVATE_newSerializer(e.databaseInfo.databaseId), n = function __PRIVATE_newConnection(e2) {
      return new __PRIVATE_WebChannelConnection(e2);
    }(e.databaseInfo);
    return function __PRIVATE_newDatastore(e2, t2, n2, r) {
      return new __PRIVATE_DatastoreImpl(e2, t2, n2, r);
    }(e.authCredentials, e.appCheckCredentials, n, t);
  }
  createRemoteStore(e) {
    return function __PRIVATE_newRemoteStore(e2, t, n, r, i) {
      return new __PRIVATE_RemoteStoreImpl(e2, t, n, r, i);
    }(this.localStore, this.datastore, e.asyncQueue, (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(this.syncEngine, e2, 0), function __PRIVATE_newConnectivityMonitor() {
      return __PRIVATE_BrowserConnectivityMonitor.D() ? new __PRIVATE_BrowserConnectivityMonitor : new __PRIVATE_NoopConnectivityMonitor;
    }());
  }
  createSyncEngine(e, t) {
    return function __PRIVATE_newSyncEngine(e2, t2, n, r, i, s, o) {
      const _ = new __PRIVATE_SyncEngineImpl(e2, t2, n, r, i, s);
      return o && (_.La = true), _;
    }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
  }
  async terminate() {
    var e;
    await async function __PRIVATE_remoteStoreShutdown(e2) {
      const t = __PRIVATE_debugCast(e2);
      __PRIVATE_logDebug("RemoteStore", "RemoteStore shutting down."), t.M_.add(5), await __PRIVATE_disableNetworkInternal(t), t.O_.shutdown(), t.N_.set("Unknown");
    }(this.remoteStore), (e = this.datastore) === null || e === undefined || e.terminate();
  }
}

class __PRIVATE_AsyncObserver {
  constructor(e) {
    this.observer = e, this.muted = false;
  }
  next(e) {
    this.observer.next && this.Ka(this.observer.next, e);
  }
  error(e) {
    this.observer.error ? this.Ka(this.observer.error, e) : __PRIVATE_logError("Uncaught Error in snapshot listener:", e.toString());
  }
  $a() {
    this.muted = true;
  }
  Ka(e, t) {
    this.muted || setTimeout(() => {
      this.muted || e(t);
    }, 0);
  }
}
class FirestoreClient {
  constructor(e, t, n, r) {
    this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = n, this.databaseInfo = r, this.user = User.UNAUTHENTICATED, this.clientId = __PRIVATE_AutoId.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this.authCredentials.start(n, async (e2) => {
      __PRIVATE_logDebug("FirestoreClient", "Received user=", e2.uid), await this.authCredentialListener(e2), this.user = e2;
    }), this.appCheckCredentials.start(n, (e2) => (__PRIVATE_logDebug("FirestoreClient", "Received new app check token=", e2), this.appCheckCredentialListener(e2, this.user)));
  }
  get configuration() {
    return {
      asyncQueue: this.asyncQueue,
      databaseInfo: this.databaseInfo,
      clientId: this.clientId,
      authCredentials: this.authCredentials,
      appCheckCredentials: this.appCheckCredentials,
      initialUser: this.user,
      maxConcurrentLimboResolutions: 100
    };
  }
  setCredentialChangeListener(e) {
    this.authCredentialListener = e;
  }
  setAppCheckTokenChangeListener(e) {
    this.appCheckCredentialListener = e;
  }
  verifyNotTerminated() {
    if (this.asyncQueue.isShuttingDown)
      throw new FirestoreError(C.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode();
    const e = new __PRIVATE_Deferred;
    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
      try {
        this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
      } catch (t) {
        const n = __PRIVATE_wrapInUserErrorIfRecoverable(t, "Failed to shutdown persistence");
        e.reject(n);
      }
    }), e.promise;
  }
}
var ye = new Map;

class FirestoreSettingsImpl {
  constructor(e) {
    var t, n;
    if (e.host === undefined) {
      if (e.ssl !== undefined)
        throw new FirestoreError(C.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
      this.host = "firestore.googleapis.com", this.ssl = true;
    } else
      this.host = e.host, this.ssl = (t = e.ssl) === null || t === undefined || t;
    if (this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, e.cacheSizeBytes === undefined)
      this.cacheSizeBytes = 41943040;
    else {
      if (e.cacheSizeBytes !== -1 && e.cacheSizeBytes < 1048576)
        throw new FirestoreError(C.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
      this.cacheSizeBytes = e.cacheSizeBytes;
    }
    __PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = false : e.experimentalAutoDetectLongPolling === undefined ? this.experimentalAutoDetectLongPolling = true : this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling, this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions((n = e.experimentalLongPollingOptions) !== null && n !== undefined ? n : {}), function __PRIVATE_validateLongPollingOptions(e2) {
      if (e2.timeoutSeconds !== undefined) {
        if (isNaN(e2.timeoutSeconds))
          throw new FirestoreError(C.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (must not be NaN)`);
        if (e2.timeoutSeconds < 5)
          throw new FirestoreError(C.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (minimum allowed value is 5)`);
        if (e2.timeoutSeconds > 30)
          throw new FirestoreError(C.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (maximum allowed value is 30)`);
      }
    }(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
  }
  isEqual(e) {
    return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && function __PRIVATE_longPollingOptionsEqual(e2, t) {
      return e2.timeoutSeconds === t.timeoutSeconds;
    }(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
  }
}

class Firestore$1 {
  constructor(e, t, n, r) {
    this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = n, this._app = r, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), this._settingsFrozen = false;
  }
  get app() {
    if (!this._app)
      throw new FirestoreError(C.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return this._terminateTask !== undefined;
  }
  _setSettings(e) {
    if (this._settingsFrozen)
      throw new FirestoreError(C.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
    this._settings = new FirestoreSettingsImpl(e), e.credentials !== undefined && (this._authCredentials = function __PRIVATE_makeAuthCredentialsProvider(e2) {
      if (!e2)
        return new __PRIVATE_EmptyAuthCredentialsProvider;
      switch (e2.type) {
        case "firstParty":
          return new __PRIVATE_FirstPartyAuthCredentialsProvider(e2.sessionIndex || "0", e2.iamToken || null, e2.authTokenFactory || null);
        case "provider":
          return e2.client;
        default:
          throw new FirestoreError(C.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
      }
    }(e.credentials));
  }
  _getSettings() {
    return this._settings;
  }
  _freezeSettings() {
    return this._settingsFrozen = true, this._settings;
  }
  _delete() {
    return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
  }
  toJSON() {
    return {
      app: this._app,
      databaseId: this._databaseId,
      settings: this._settings
    };
  }
  _terminate() {
    return function __PRIVATE_removeComponents(e) {
      const t = ye.get(e);
      t && (__PRIVATE_logDebug("ComponentProvider", "Removing Datastore"), ye.delete(e), t.terminate());
    }(this), Promise.resolve();
  }
}

class Query {
  constructor(e, t, n) {
    this.converter = t, this._query = n, this.type = "query", this.firestore = e;
  }
  withConverter(e) {
    return new Query(this.firestore, e, this._query);
  }
}

class DocumentReference {
  constructor(e, t, n) {
    this.converter = t, this._key = n, this.type = "document", this.firestore = e;
  }
  get _path() {
    return this._key.path;
  }
  get id() {
    return this._key.path.lastSegment();
  }
  get path() {
    return this._key.path.canonicalString();
  }
  get parent() {
    return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
  }
  withConverter(e) {
    return new DocumentReference(this.firestore, e, this._key);
  }
}

class CollectionReference extends Query {
  constructor(e, t, n) {
    super(e, t, __PRIVATE_newQueryForPath(n)), this._path = n, this.type = "collection";
  }
  get id() {
    return this._query.path.lastSegment();
  }
  get path() {
    return this._query.path.canonicalString();
  }
  get parent() {
    const e = this._path.popLast();
    return e.isEmpty() ? null : new DocumentReference(this.firestore, null, new DocumentKey(e));
  }
  withConverter(e) {
    return new CollectionReference(this.firestore, e, this._path);
  }
}

class __PRIVATE_AsyncQueueImpl {
  constructor() {
    this.iu = Promise.resolve(), this.su = [], this.ou = false, this._u = [], this.au = null, this.uu = false, this.cu = false, this.lu = [], this.Yo = new __PRIVATE_ExponentialBackoff(this, "async_queue_retry"), this.hu = () => {
      const e2 = getDocument();
      e2 && __PRIVATE_logDebug("AsyncQueue", "Visibility state changed to " + e2.visibilityState), this.Yo.Wo();
    };
    const e = getDocument();
    e && typeof e.addEventListener == "function" && e.addEventListener("visibilitychange", this.hu);
  }
  get isShuttingDown() {
    return this.ou;
  }
  enqueueAndForget(e) {
    this.enqueue(e);
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    this.Pu(), this.Iu(e);
  }
  enterRestrictedMode(e) {
    if (!this.ou) {
      this.ou = true, this.cu = e || false;
      const t = getDocument();
      t && typeof t.removeEventListener == "function" && t.removeEventListener("visibilitychange", this.hu);
    }
  }
  enqueue(e) {
    if (this.Pu(), this.ou)
      return new Promise(() => {
      });
    const t = new __PRIVATE_Deferred;
    return this.Iu(() => this.ou && this.cu ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise)).then(() => t.promise);
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.su.push(e), this.Tu()));
  }
  async Tu() {
    if (this.su.length !== 0) {
      try {
        await this.su[0](), this.su.shift(), this.Yo.reset();
      } catch (e) {
        if (!__PRIVATE_isIndexedDbTransactionError(e))
          throw e;
        __PRIVATE_logDebug("AsyncQueue", "Operation failed with retryable error: " + e);
      }
      this.su.length > 0 && this.Yo.$o(() => this.Tu());
    }
  }
  Iu(e) {
    const t = this.iu.then(() => (this.uu = true, e().catch((e2) => {
      this.au = e2, this.uu = false;
      const t2 = function __PRIVATE_getMessageOrStack(e3) {
        let t3 = e3.message || "";
        e3.stack && (t3 = e3.stack.includes(e3.message) ? e3.stack : e3.message + "\n" + e3.stack);
        return t3;
      }(e2);
      throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", t2), e2;
    }).then((e2) => (this.uu = false, e2))));
    return this.iu = t, t;
  }
  enqueueAfterDelay(e, t, n) {
    this.Pu(), this.lu.indexOf(e) > -1 && (t = 0);
    const r = DelayedOperation.createAndSchedule(this, e, t, n, (e2) => this.Eu(e2));
    return this._u.push(r), r;
  }
  Pu() {
    this.au && fail();
  }
  verifyOperationInProgress() {
  }
  async du() {
    let e;
    do {
      e = this.iu, await e;
    } while (e !== this.iu);
  }
  Au(e) {
    for (const t of this._u)
      if (t.timerId === e)
        return true;
    return false;
  }
  Ru(e) {
    return this.du().then(() => {
      this._u.sort((e2, t) => e2.targetTimeMs - t.targetTimeMs);
      for (const t of this._u)
        if (t.skipDelay(), e !== "all" && t.timerId === e)
          break;
      return this.du();
    });
  }
  Vu(e) {
    this.lu.push(e);
  }
  Eu(e) {
    const t = this._u.indexOf(e);
    this._u.splice(t, 1);
  }
}
class Firestore extends Firestore$1 {
  constructor(e, t, n, r) {
    super(e, t, n, r), this.type = "firestore", this._queue = function __PRIVATE_newAsyncQueue() {
      return new __PRIVATE_AsyncQueueImpl;
    }(), this._persistenceKey = (r == null ? undefined : r.name) || "[DEFAULT]";
  }
  _terminate() {
    return this._firestoreClient || __PRIVATE_configureFirestore(this), this._firestoreClient.terminate();
  }
}
class Bytes {
  constructor(e) {
    this._byteString = e;
  }
  static fromBase64String(e) {
    try {
      return new Bytes(ByteString.fromBase64String(e));
    } catch (e2) {
      throw new FirestoreError(C.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e2);
    }
  }
  static fromUint8Array(e) {
    return new Bytes(ByteString.fromUint8Array(e));
  }
  toBase64() {
    return this._byteString.toBase64();
  }
  toUint8Array() {
    return this._byteString.toUint8Array();
  }
  toString() {
    return "Bytes(base64: " + this.toBase64() + ")";
  }
  isEqual(e) {
    return this._byteString.isEqual(e._byteString);
  }
}

class FieldPath {
  constructor(...e) {
    for (let t = 0;t < e.length; ++t)
      if (e[t].length === 0)
        throw new FirestoreError(C.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
    this._internalPath = new FieldPath$1(e);
  }
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath);
  }
}
class GeoPoint {
  constructor(e, t) {
    if (!isFinite(e) || e < -90 || e > 90)
      throw new FirestoreError(C.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
    if (!isFinite(t) || t < -180 || t > 180)
      throw new FirestoreError(C.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
    this._lat = e, this._long = t;
  }
  get latitude() {
    return this._lat;
  }
  get longitude() {
    return this._long;
  }
  isEqual(e) {
    return this._lat === e._lat && this._long === e._long;
  }
  toJSON() {
    return {
      latitude: this._lat,
      longitude: this._long
    };
  }
  _compareTo(e) {
    return __PRIVATE_primitiveComparator(this._lat, e._lat) || __PRIVATE_primitiveComparator(this._long, e._long);
  }
}
var be = new RegExp("[~\\*/\\[\\]]");

class DocumentSnapshot$1 {
  constructor(e, t, n, r, i) {
    this._firestore = e, this._userDataWriter = t, this._key = n, this._document = r, this._converter = i;
  }
  get id() {
    return this._key.path.lastSegment();
  }
  get ref() {
    return new DocumentReference(this._firestore, this._converter, this._key);
  }
  exists() {
    return this._document !== null;
  }
  data() {
    if (this._document) {
      if (this._converter) {
        const e = new QueryDocumentSnapshot$1(this._firestore, this._userDataWriter, this._key, this._document, null);
        return this._converter.fromFirestore(e);
      }
      return this._userDataWriter.convertValue(this._document.data.value);
    }
  }
  get(e) {
    if (this._document) {
      const t = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
      if (t !== null)
        return this._userDataWriter.convertValue(t);
    }
  }
}

class QueryDocumentSnapshot$1 extends DocumentSnapshot$1 {
  data() {
    return super.data();
  }
}
class AbstractUserDataWriter {
  convertValue(e, t = "none") {
    switch (__PRIVATE_typeOrder(e)) {
      case 0:
        return null;
      case 1:
        return e.booleanValue;
      case 2:
        return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
      case 3:
        return this.convertTimestamp(e.timestampValue);
      case 4:
        return this.convertServerTimestamp(e, t);
      case 5:
        return e.stringValue;
      case 6:
        return this.convertBytes(__PRIVATE_normalizeByteString(e.bytesValue));
      case 7:
        return this.convertReference(e.referenceValue);
      case 8:
        return this.convertGeoPoint(e.geoPointValue);
      case 9:
        return this.convertArray(e.arrayValue, t);
      case 10:
        return this.convertObject(e.mapValue, t);
      default:
        throw fail();
    }
  }
  convertObject(e, t) {
    return this.convertObjectMap(e.fields, t);
  }
  convertObjectMap(e, t = "none") {
    const n = {};
    return forEach(e, (e2, r) => {
      n[e2] = this.convertValue(r, t);
    }), n;
  }
  convertGeoPoint(e) {
    return new GeoPoint(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(e.longitude));
  }
  convertArray(e, t) {
    return (e.values || []).map((e2) => this.convertValue(e2, t));
  }
  convertServerTimestamp(e, t) {
    switch (t) {
      case "previous":
        const n = __PRIVATE_getPreviousValue(e);
        return n == null ? null : this.convertValue(n, t);
      case "estimate":
        return this.convertTimestamp(__PRIVATE_getLocalWriteTime(e));
      default:
        return null;
    }
  }
  convertTimestamp(e) {
    const t = __PRIVATE_normalizeTimestamp(e);
    return new Timestamp(t.seconds, t.nanos);
  }
  convertDocumentKey(e, t) {
    const n = ResourcePath.fromString(e);
    __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(n));
    const r = new DatabaseId(n.get(1), n.get(3)), i = new DocumentKey(n.popFirst(5));
    return r.isEqual(t) || __PRIVATE_logError(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), i;
  }
}
class SnapshotMetadata {
  constructor(e, t) {
    this.hasPendingWrites = e, this.fromCache = t;
  }
  isEqual(e) {
    return this.hasPendingWrites === e.hasPendingWrites && this.fromCache === e.fromCache;
  }
}

class DocumentSnapshot extends DocumentSnapshot$1 {
  constructor(e, t, n, r, i, s) {
    super(e, t, n, r, s), this._firestore = e, this._firestoreImpl = e, this.metadata = i;
  }
  exists() {
    return super.exists();
  }
  data(e = {}) {
    if (this._document) {
      if (this._converter) {
        const t = new QueryDocumentSnapshot(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
        return this._converter.fromFirestore(t, e);
      }
      return this._userDataWriter.convertValue(this._document.data.value, e.serverTimestamps);
    }
  }
  get(e, t = {}) {
    if (this._document) {
      const n = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
      if (n !== null)
        return this._userDataWriter.convertValue(n, t.serverTimestamps);
    }
  }
}

class QueryDocumentSnapshot extends DocumentSnapshot {
  data(e = {}) {
    return super.data(e);
  }
}

class QuerySnapshot {
  constructor(e, t, n, r) {
    this._firestore = e, this._userDataWriter = t, this._snapshot = r, this.metadata = new SnapshotMetadata(r.hasPendingWrites, r.fromCache), this.query = n;
  }
  get docs() {
    const e = [];
    return this.forEach((t) => e.push(t)), e;
  }
  get size() {
    return this._snapshot.docs.size;
  }
  get empty() {
    return this.size === 0;
  }
  forEach(e, t) {
    this._snapshot.docs.forEach((n) => {
      e.call(t, new QueryDocumentSnapshot(this._firestore, this._userDataWriter, n.key, n, new SnapshotMetadata(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
    });
  }
  docChanges(e = {}) {
    const t = !!e.includeMetadataChanges;
    if (t && this._snapshot.excludesMetadataChanges)
      throw new FirestoreError(C.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === t || (this._cachedChanges = function __PRIVATE_changesFromSnapshot(e2, t2) {
      if (e2._snapshot.oldDocs.isEmpty()) {
        let t3 = 0;
        return e2._snapshot.docChanges.map((n) => {
          const r = new QueryDocumentSnapshot(e2._firestore, e2._userDataWriter, n.doc.key, n.doc, new SnapshotMetadata(e2._snapshot.mutatedKeys.has(n.doc.key), e2._snapshot.fromCache), e2.query.converter);
          return n.doc, {
            type: "added",
            doc: r,
            oldIndex: -1,
            newIndex: t3++
          };
        });
      }
      {
        let n = e2._snapshot.oldDocs;
        return e2._snapshot.docChanges.filter((e3) => t2 || e3.type !== 3).map((t3) => {
          const r = new QueryDocumentSnapshot(e2._firestore, e2._userDataWriter, t3.doc.key, t3.doc, new SnapshotMetadata(e2._snapshot.mutatedKeys.has(t3.doc.key), e2._snapshot.fromCache), e2.query.converter);
          let i = -1, s = -1;
          return t3.type !== 0 && (i = n.indexOf(t3.doc.key), n = n.delete(t3.doc.key)), t3.type !== 1 && (n = n.add(t3.doc), s = n.indexOf(t3.doc.key)), {
            type: __PRIVATE_resultChangeType(t3.type),
            doc: r,
            oldIndex: i,
            newIndex: s
          };
        });
      }
    }(this, t), this._cachedChangesIncludeMetadataChanges = t), this._cachedChanges;
  }
}

class __PRIVATE_ExpUserDataWriter extends AbstractUserDataWriter {
  constructor(e) {
    super(), this.firestore = e;
  }
  convertBytes(e) {
    return new Bytes(e);
  }
  convertReference(e) {
    const t = this.convertDocumentKey(e, this.firestore._databaseId);
    return new DocumentReference(this.firestore, null, t);
  }
}
var Ce = new WeakMap;
(function __PRIVATE_registerFirestore(e, t = true) {
  (function __PRIVATE_setSDKVersion(e2) {
    b = e2;
  })(SDK_VERSION), _registerComponent(new Component("firestore", (e2, { instanceIdentifier: n, options: r }) => {
    const i = e2.getProvider("app").getImmediate(), s = new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(e2.getProvider("auth-internal")), new __PRIVATE_FirebaseAppCheckTokenProvider(e2.getProvider("app-check-internal")), function __PRIVATE_databaseIdFromApp(e3, t2) {
      if (!Object.prototype.hasOwnProperty.apply(e3.options, ["projectId"]))
        throw new FirestoreError(C.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
      return new DatabaseId(e3.options.projectId, t2);
    }(i, n), i);
    return r = Object.assign({
      useFetchStreams: t
    }, r), s._setSettings(r), s;
  }, "PUBLIC").setMultipleInstances(true)), registerVersion(S, "4.6.3", e), registerVersion(S, "4.6.3", "esm2017");
})();
// js/suggestions.js
async function fetchSuggestions() {
  const suggestionsCol = collection(db, "suggestions");
  try {
    const suggestionSnapshot = await getDocs(suggestionsCol);
    const suggestionList = suggestionSnapshot.docs.map((doc) => doc.data());
    displaySuggestions(suggestionList);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}
var displaySuggestions = function(suggestions) {
  const suggestionContainer = document.querySelector(".grid section");
  suggestions.forEach((suggestion) => {
    console.log(suggestion);
    const card = document.createElement("div");
    card.classList.add("suggestion-card");
    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");
    const title = document.createElement("span");
    title.textContent = suggestion.suggestion;
    cardHeader.appendChild(title);
    card.appendChild(cardHeader);
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    const timeItem = document.createElement("div");
    timeItem.classList.add("card-item");
    const timeIcon = document.createElement("i");
    timeIcon.classList.add("icon", "fas", "fa-clock");
    timeItem.appendChild(timeIcon);
    const timeText = document.createElement("span");
    timeText.textContent = humanReadableTime(suggestion.time);
    timeItem.appendChild(timeText);
    cardBody.appendChild(timeItem);
    const statusItem = document.createElement("div");
    statusItem.classList.add("card-item");
    const statusIcon = document.createElement("i");
    statusIcon.classList.add("icon", "fas", "fa-cog");
    statusItem.appendChild(statusIcon);
    const statusText = document.createElement("span");
    statusText.textContent = suggestion.status;
    statusItem.appendChild(statusText);
    const typeIcon = document.createElement("i");
    if (suggestion.type == "dish") {
      typeIcon.classList.add("icon", "fas", "fa-utensils");
    } else if (suggestion.type == "general") {
      typeIcon.classList.add("icon", "fas", "fa-question");
    }
    statusItem.appendChild(typeIcon);
    const typeText = document.createElement("span");
    typeText.textContent = suggestion.type;
    statusItem.appendChild(typeText);
    cardBody.appendChild(statusItem);
    const resolutionItem = document.createElement("div");
    resolutionItem.classList.add("card-item");
    const resolutionIcon = document.createElement("i");
    resolutionIcon.classList.add("icon", "fas", "fa-comment-dots");
    resolutionItem.appendChild(resolutionIcon);
    const resolutionText = document.createElement("span");
    resolutionText.textContent = suggestion.resolution;
    resolutionItem.appendChild(resolutionText);
    cardBody.appendChild(resolutionItem);
    card.appendChild(cardBody);
    suggestionContainer.appendChild(card);
  });
};
var humanReadableTime = function(timestamp) {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
  return date.toLocaleString();
};
var firebaseConfig2 = {
  apiKey: "AIzaSyDllOEaNJTcldiOZR6DwNL-VnbbCmDtXB4",
  authDomain: "srm-web-app.firebaseapp.com",
  projectId: "srm-web-app",
  storageBucket: "srm-web-app.appspot.com",
  messagingSenderId: "854722873993",
  appId: "1:854722873993:web:2d5ba66678f63b81fbd458",
  measurementId: "G-GR0RCESHZZ"
};
var app9 = initializeApp(firebaseConfig2);
var db = getFirestore(app9);
window.addEventListener("DOMContentLoaded", fetchSuggestions);
