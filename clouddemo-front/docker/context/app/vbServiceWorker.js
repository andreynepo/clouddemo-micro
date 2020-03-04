'use strict';

// This is the main service worker responsible for registering all the event listeners. The actual fetch
// requests are handle by an instance of the FetchHandler class defined in fetchHandler.js.

// sync this to the release version
const VERSION = '19.3.1.12';

// increment this number whenever you push a new dev version so other people can pick up the changes
// without having to kill the service worker
const DEV_VERSION = 1;

// for debug tools
self.vb = { VERSION, DEV_VERSION };

const urlLocation = new URL(self.location);

function getRequestParameter(name) {
  const param = urlLocation.searchParams.get(name);
  return param ? param.trim() : undefined;
}

// build the default config object using the query parameters on the service worker script url
self.config = {
  version: VERSION,
  disableOnFetch: getRequestParameter('disableOnFetch'),
  jetPath: getRequestParameter('jetPath'),
  modulePath: getRequestParameter('modulePath'),
  baseUrlToken: getRequestParameter('baseUrlToken'),
  nonce: getRequestParameter('nonce'),
  debug: getRequestParameter('debug'),
  scope: self.registration.scope,
  urlsToSkip: [],
};

// use the baseUrlToken as the nonce if no nonce is specified, default to VERSION
self.config.nonce = self.config.nonce || self.config.baseUrlToken || VERSION;

// a promise resolving to an instance of FetchHandler to be used for the lifespan of this service worker
let fetchHandlerPromise;

function getFetchHandler(isOnInstall) {
  if (!fetchHandlerPromise) {
    fetchHandlerPromise = new Promise((resolve) => {
      require(['vbsw/private/fetchHandler'], (FetchHandler) => {
        const fetchHandler = new FetchHandler(self.registration.scope, self.config);
        console.log('Service Worker (', self.config.nonce, '): FetchHandler created');

        if (isOnInstall) {
          resolve(fetchHandler);
        } else {
          // restore the fetchHandler state
          fetchHandler.restore().then(() => resolve(fetchHandler))
            .catch((err) => {
              console.log(err);
              resolve(fetchHandler);
            });
        }
      }, (err) => {
        console.log('Service Worker (', self.config.nonce, '): failed to load FetchHandler:', err);
        fetchHandlerPromise = null;
        resolve(null);
      });
    });
  }

  return fetchHandlerPromise;
}

// this will be set to the promise resolve function during oninstall
let installPromiseResolver;

// indicate whether configureServiceWorker has been called or not
let configureServiceWorkerCalled;

/**
 * The rest of the service worker config object will be postMessaged over from the main thread during installation
 * and the function will merge it with the default config object.
 *
 * @param configToMerge the config object to be merged into the default config object
 */
self.configureServiceWorker = (configToMerge) => {
  // merge the config objects
  self.config = Object.assign(self.config, configToMerge);

  console.log('Service Worker Configuration:', self.config);

  if (installPromiseResolver) {
    // allow oninstall to continue
    installPromiseResolver();
  } else {
    // oninstall has not been called so we simply set a flag
    configureServiceWorkerCalled = true;
  }
};

/**
 * Return a promise which when resolved signals installation can proceed.
 *
 * @returns {Promise}
 */
function getInstallPromise() {
  // if configureServiceWorker has already been called, simply return a resolved promise
  if (configureServiceWorkerCalled) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    // wait for configureServiceWorker to resolve the promise
    installPromiseResolver = resolve;
  });
}

self.oninstall = (event) => {
  console.log('Service Worker (', self.config.nonce, '): oninstall called');

  let installPromise;

  if (!self.config.disableOnFetch) {
    // If disabledOnFetch is true, do not wait for the application to post message the rest of the
    // config object since this service worker instance will not be intercepting any fetch requests.
    installPromise = getInstallPromise().then(() => {
      // skip waiting to ensure updated service worker takes over immediately
      self.skipWaiting();

      return getFetchHandler(true)
        .then(fetchHandler => fetchHandler.install());
    });
  } else {
    // skip waiting to ensure updated service worker takes over immediately
    self.skipWaiting();
    installPromise = Promise.resolve();
  }

  event.waitUntil(installPromise);
};

self.onactivate = (event) => {
  console.log('Service Worker (', self.config.nonce, '): onactivate called');
  // `claim()` sets this worker as the active worker for all clients that match the workers scope
  // and triggers an `oncontrollerchange` event for the clients
  event.waitUntil(self.clients.claim());
};

/**
 * Add the given urls to config.urlsToSkip.
 *
 * @param urls urls to add
 */
self.addUrlsToSkip = (urls) => {
  // filter out duplicates
  const urlsToAdd = urls.filter(url => self.config.urlsToSkip.indexOf(url) === -1);

  self.config.urlsToSkip = self.config.urlsToSkip.concat(urlsToAdd);
};

/**
 * Remove the given urls from config.urlsToSkip.
 *
 * @param urls urls to remove
 */
self.removeUrlsToSkip = (urls) => {
  self.config.urlsToSkip = self.config.urlsToSkip.filter(url => urls.indexOf(url) === -1);
};

// If disableOnFetch is true, do not install an onFetch listener for intercepting requests which
// has a large performance penalty when there are a lot of requests. The onFetch will only be installed
// for PWA or if there's an offline handler registered for the application.
if (!self.config.disableOnFetch) {
  // load require.js from JET
  self.importScripts(`${self.config.jetPath}3rdparty/require/require.js`);

  // using URI.js
  self.importScripts(`${self.config.modulePath}lib/third-party-libs.js`);

  // load visual-service-worker-modules.js from modulePath
  self.importScripts(`${self.config.modulePath}vb-service-worker-modules.js`);

  // load JET's bundle config so we can load the bundled version of offline toolkit
  self.importScripts(
    `${self.config.jetPath}default/js/bundles-config${self.config.debug === 'true' ? '-debug' : ''}.js`);

  self.addEventListener('message', (event) => {
    const { data } = event;

    console.log('Service Worker (', self.config.nonce, '): received message:', data);

    if (typeof data === 'object') {
      require(['vbsw/private/utils'], (Utils) => {
        // make sure args is not undefined
        data.args = data.args || [];

        switch (data.method) {
          case 'configureServiceWorker':
          case 'addUrlsToSkip':
          case 'removeUrlsToSkip':
            // invoke the method on self
            Utils.invokeMethod(self, data, event.ports[0]);
            break;
          default:
            // invoke the method on the fetch handler
            getFetchHandler().then((handler) => {
              Utils.invokeMethod(handler, data, event.ports[0]);
            });
            break;
        }
      });
    }
  });

  self.onfetch = (event) => {
    const { request } = event;

    // skip requests whose urls are in urlsToSkip
    if (self.config.urlsToSkip.indexOf(request.url) === -1) {
      // handle fetch requests using the FetchHandler instance
      event.respondWith(getFetchHandler()
        .then((handler) => {
          if (handler) {
            return handler.handleRequest(event.request, event.clientId);
          }

          // failed to load the FetchHandler, call fetch directly
          return fetch(request);
        }));
    }
  };
}
