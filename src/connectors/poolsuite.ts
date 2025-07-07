export {};

Connector.playButtonSelector = 'button[title="Start radio playback"][disabled]';
Connector.playerSelector = 'div.h-full.relative div div.relative div.relative.z-10';
Connector.trackSelector = 'h3.font-chicago.leading-none.line-clamp-1';
Connector.artistSelector = 'h2.font-everyday.leading-none';
Connector.currentTimeSelector = '.timer span';

Connector.getDuration = () => {
	const currentTime = Connector.getCurrentTime();
	if (!currentTime) {
		return null;
	}

	const progressElement = document.querySelector(
		'div.h-px.bg-black',
	) as HTMLElement;
	if (!progressElement) {
		return null;
	}
	// strip everything except width value, this is 100% at finished track, 0% at start of track.
	// convert into a number thats easier to work with. (progress percentage expressed as 0-1 decimal).
	const progressDecimal =
		Number(progressElement.style.width.replace("%","")) / 100;
	return currentTime / progressDecimal;
};

Connector.scrobblingDisallowedReason = () =>
	Connector.getTrack() === 'Loading...' ? 'IsLoading' : null;
