export {};

/**
 * This script runs in non-isolated environment(youtube music itself)
 * for accessing navigator variables on Firefox
 *
 * * Script is run as an IIFE to ensure variables are scoped, as in the event
 * of extension reload/update a new script will have to override the current one.
 *
 * Script starts by calling window.cleanup to cleanup any potential previous script.
 *
 * @returns a cleanup function that cleans up event listeners and similar for a future overriding script.
 */

if ('cleanup' in window && typeof window.cleanup === 'function') {
	(window as unknown as { cleanup: () => void }).cleanup();
}

(window as unknown as { cleanup: () => void }).cleanup = (() => {
	const handler = {
		get: (target: any, prop: string, receiver: unknown) => target[prop],
		set: (obj: any, prop: string, value: unknown): boolean => {
			obj[prop] = value;
			sendData();
			return true;
		},
	};
	const proxy = new Proxy(navigator.mediaSession, handler);
	Object.defineProperty(navigator, 'mediaSession', {
		get() {
			return proxy;
		},
		configurable: true,
	});

	function sendData() {
		window.postMessage(
			{
				sender: 'web-scrobbler',
				playbackState: proxy.playbackState,
				metadata: {
					title: proxy.metadata.title,
					artist: proxy.metadata.artist,
					artwork: proxy.metadata.artwork,
					album: proxy.metadata.album,
				},
			},
			'*',
		);
	}

	navigator.mediaSession.metadata = new MediaMetadata();

	return () => {
		// remove the subscribers added by this extension.
		handler.set = (obj: any, prop: string, value: unknown): boolean => {
			obj[prop] = value;
			return true;
		};
	};
})();
