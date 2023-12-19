import { useState, useEffect, useRef } from 'react';
import SearchModal from './search/SearchModal';
import MusicPlayerScrubber from './MusicPlayerScrubber';

import DeviceContext from '../context/DeviceContext';
import axios from 'axios';

const track = {
	name: "",
	album: {
		images: [
			{ url: "" }
		]
	},
	artists: [
		{ name: "" }
	]
}

function WebPlayback(props) {

	let counter = 0

	const [is_paused, setPaused] = useState(false);
	const [is_active, setActive] = useState(false);
	const [player, setPlayer] = useState(undefined);
	const [current_track, setTrack] = useState(track);
	const [queue, setQueue] = useState([]);
	const deviceID = useRef(null);

	// const [playbackResponse, setPlaybackResponse] = useState(undefined)

	const [showSearchModal, setShowSearchModal] = useState(false);
    // counter += 1
	// console.log('myplayerstate:::::::::')
	// // console.log(counter)
	// // console.log(props.playerState)

	
	



	useEffect(() => {
		console.log('inside my useEffect myplayerstate update')
		// const syncPlayback = async () => {
		//   try {
		console.log('recieved updated state in WebPlayback')
		console.log(props.playerState)



		if (props.playerState && props.playerState.track_window) {
			// Proceed with updating state
			setTrack(props.playerState.track_window.current_track);
			setQueue(props.playerState.track_window.next_tracks.slice(0, 5));
			setPaused(props.playerState.paused);
		} else {
			console.log('not able to set track')
		}

				
			// // Assume that props.playbackState contains the position in milliseconds
			// const position_ms = props.playbackState.position_ms;
			
			// // Your POST request to seek playback
			// const response = await axios.post('/api/seek-playback', {
			//   position_ms: position_ms,
			//   // You might need to send other data, such as a device ID or track ID
			// });

			// const { data } = await axios.post('/api/playback-state', {time: props.playerState.position});
            // console.log('my playback data::::::')
			// console.log(data);
		// 	// setPlaybackResponse(data)
	
		// 	console.log('Playback seeked successfully:');
		// 	console.log(data);
		//   } catch (error) {
		// 	console.error('Error seeking playback:', error);
		//   }
		// };
	
		// if (props.playbackState) {
		// 	syncPlayback();
		// }
		
	}, [props.playerState]); // Effect will re-run if props.playbackState changes

	useEffect(() => {

		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {

			const player = new window.Spotify.Player({
				name: 'Web Playback SDK',
				getOAuthToken: cb => { cb(props.token); },
				volume: 0.5
			});

			setPlayer(player);

			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
				deviceID.current = device_id;
				fetchData(device_id);
			});

			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});

			player.addListener('player_state_changed', ( async state => {

				if (!state) {
					return;
				}

				setTrack(state.track_window.current_track);
				setQueue(state.track_window.next_tracks.slice(0, 5));
				setPaused(state.paused);



				player.getCurrentState().then(state => {
					(!state) ? setActive(false) : setActive(true)
				});
				counter += 1
				console.log('inside player state changed:')
				console.log(counter)
				console.log(state)

				// Emit the current state to the server through the socket
				props.socketRef.current.emit('player_state_changed', {
					state
					// Include other relevant state information
				});

			}));

			player.connect();

		};
	}, []);

	// API Call to get Playback State 
	// SetInterval to retrieve state every x seconds

	// const getPlaybackState = async () => {
	// 	try {
	// 		const { data } = await axios.get('/api/playback-state');
    //         console.log('my playback data::::::')
	// 		console.log(data);
	// 		setPlaybackResponse(data)
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	// setInterval(() => {
	// 	console.log('Getting Playback State');
	// 	getPlaybackState();
	// }, 1000);
	
	const fetchData = async (deviceId) => {
		try {
			const { data } = await axios.post('/api/transfer-playback', {
				deviceId: deviceId
			});

			console.log(data);
		} catch (error) {
			console.log(error)
		}
	}

	const handleCloseModals = () => {
		setShowSearchModal(false);
	}

	

	if (!is_active) {
		return (
			<>
			<DeviceContext.Provider value={{ deviceID: deviceID.current }}>
				<div className="container">
					<div className="main-wrapper">
						<b> Instance not active. Transfer your playback using your Spotify app </b>
					</div>

					<div>
						<button onClick={() => { setShowSearchModal(true); }}>
							Search for Songs
						</button>
					</div>

					{showSearchModal && (
						<SearchModal 
							isOpen={showSearchModal}
							handleClose={handleCloseModals}
						/>
					)}
				</div>
			</DeviceContext.Provider>
			</>)
	} else {
		return (
			<>
				<DeviceContext.Provider value={{ deviceID: deviceID.current }}>
					<div className="container">
						<div className="main-wrapper">

							<img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
							{/* <MusicPlayerScrubber playbackResponse={playbackResponse}/> */}


							<div className="now-playing__side">
								<div className="now-playing__name">{current_track.name}</div>
								<div className="now-playing__artist">{current_track.artists[0].name}</div>

								<button className="btn-spotify" onClick={() => { player.previousTrack() }} >
									&lt;&lt;
								</button>

								<button className="btn-spotify" onClick={() => { player.togglePlay() }} >
									{is_paused ? "PLAY" : "PAUSE"}
								</button>

								<button className="btn-spotify" onClick={() => { player.nextTrack() }} >
									&gt;&gt;
								</button>
							</div>

                            <div>
								<button onClick={() => { setShowSearchModal(true); }}>
									Search for Songs
								</button>
							</div>

							<div className='queued_songs_list'>
								<h4>Queued Songs</h4>
								{queue.map(track => {
									return (
										<div key={track.uri}>
											<img src={track.album.images[1].url}/>
											<div className="queue__name">{track.name}</div>
											<div className="queue__artist">{track.artists[0].name}</div>
										</div>
									)
								})}
							</div>

							{showSearchModal && (
								<SearchModal 
									isOpen={showSearchModal}
									handleClose={handleCloseModals}
								/>
							)}
						</div>
					</div>
				</DeviceContext.Provider>
			</>
		);
	}
}

export default WebPlayback

// import { useState, useEffect, useRef } from 'react';
// import SearchModal from './search/SearchModal';

// import DeviceContext from '../context/DeviceContext';
// import axios from 'axios';

// const track = {
// 	name: "",
// 	album: {
// 		images: [
// 			{ url: "" }
// 		]
// 	},
// 	artists: [
// 		{ name: "" }
// 	]
// }

// function WebPlayback(props) {

// 	const [is_paused, setPaused] = useState(false);
// 	const [is_active, setActive] = useState(false);
// 	const [player, setPlayer] = useState(undefined);
// 	const [current_track, setTrack] = useState(track);
// 	const [queue, setQueue] = useState([]);
// 	const deviceID = useRef(null);

// 	const [showSearchModal, setShowSearchModal] = useState(false);

// 	useEffect(() => {

// 		const script = document.createElement("script");
// 		script.src = "https://sdk.scdn.co/spotify-player.js";
// 		script.async = true;

// 		document.body.appendChild(script);

// 		window.onSpotifyWebPlaybackSDKReady = () => {

// 			const player = new window.Spotify.Player({
// 				name: 'Web Playback SDK',
// 				getOAuthToken: cb => { cb(props.token); },
// 				volume: 0.5
// 			});

// 			setPlayer(player);

// 			player.addListener('ready', ({ device_id }) => {
// 				console.log('Ready with Device ID', device_id);
// 				deviceID.current = device_id;
// 				fetchData(device_id);
// 			});

// 			player.addListener('not_ready', ({ device_id }) => {
// 				console.log('Device ID has gone offline', device_id);
// 			});

// 			player.addListener('player_state_changed', ( async state => {

// 				if (!state) {
// 					return;
// 				}

// 				setTrack(state.track_window.current_track);
// 				setQueue(state.track_window.next_tracks.slice(0, 5));
// 				setPaused(state.paused);



// 				player.getCurrentState().then(state => {
// 					(!state) ? setActive(false) : setActive(true)
// 				});

// 			}));

// 			player.connect();

// 		};


// 	}, []);

// 	// API Call to get Playback State 
// 	// SetInterval to retrieve state every x seconds

// 	// const getPlaybackState = async () => {
// 	// 	try {
// 	// 		const { data } = await axios.get('/api/playback-state');

// 	// 		console.log(data);
// 	// 	} catch (error) {
// 	// 		console.log(error);
// 	// 	}
// 	// };

// 	// setInterval(() => {
// 	// 	console.log('Getting Playback State');
// 	// 	getPlaybackState();
// 	// }, 60000);
	
// 	const fetchData = async (deviceId) => {
// 		try {
// 			const { data } = await axios.post('/api/transfer-playback', {
// 				deviceId: deviceId
// 			});

// 			console.log(data);
// 		} catch (error) {
// 			console.log(error)
// 		}
// 	}

// 	const handleCloseModals = () => {
// 		setShowSearchModal(false);
// 	}

// 	if (!is_active) {
// 		return (
// 			<>
// 			<DeviceContext.Provider value={{ deviceID: deviceID.current }}>
// 				<div className="container">
// 					<div className="main-wrapper">
// 						<b> Instance not active. Transfer your playback using your Spotify app </b>
// 					</div>

// 					<div>
// 						<button onClick={() => { setShowSearchModal(true); }}>
// 							Search for Songs
// 						</button>
// 					</div>

// 					{showSearchModal && (
// 						<SearchModal 
// 							isOpen={showSearchModal}
// 							handleClose={handleCloseModals}
// 						/>
// 					)}
// 				</div>
// 			</DeviceContext.Provider>
// 			</>)
// 	} else {
// 		return (
// 			<>
// 				<DeviceContext.Provider value={{ deviceID: deviceID.current }}>
// 					<div className="container">
// 						<div className="main-wrapper">

// 							<img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

// 							<div className="now-playing__side">
// 								<div className="now-playing__name">{current_track.name}</div>
// 								<div className="now-playing__artist">{current_track.artists[0].name}</div>

// 								<button className="btn-spotify" onClick={() => { player.previousTrack() }} >
// 									&lt;&lt;
// 								</button>

// 								<button className="btn-spotify" onClick={() => { player.togglePlay() }} >
// 									{is_paused ? "PLAY" : "PAUSE"}
// 								</button>

// 								<button className="btn-spotify" onClick={() => { player.nextTrack() }} >
// 									&gt;&gt;
// 								</button>
// 							</div>

//                             <div>
// 								<button onClick={() => { setShowSearchModal(true); }}>
// 									Search for Songs
// 								</button>
// 							</div>

// 							<div className='queued_songs_list'>
// 								<h4>Queued Songs</h4>
// 								{queue.map(track => {
// 									return (
// 										<div key={track.uri}>
// 											<img src={track.album.images[1].url}/>
// 											<div className="queue__name">{track.name}</div>
// 											<div className="queue__artist">{track.artists[0].name}</div>
// 										</div>
// 									)
// 								})}
// 							</div>

// 							{showSearchModal && (
// 								<SearchModal 
// 									isOpen={showSearchModal}
// 									handleClose={handleCloseModals}
// 								/>
// 							)}
// 						</div>
// 					</div>
// 				</DeviceContext.Provider>
// 			</>
// 		);
// 	}
// }

// export default WebPlayback
// >>>>>>> main
