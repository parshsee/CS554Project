import { useState, useEffect, useRef } from 'react';
import SearchModal from './search/SearchModal';

import DeviceContext from '../context/DeviceContext';
import axios from 'axios';
import { Button } from '@mui/material';

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

	const [is_paused, setPaused] = useState(false);
	const [is_active, setActive] = useState(false);
	const [player, setPlayer] = useState(undefined);
	const [current_track, setTrack] = useState(track);
	const [queue, setQueue] = useState([]);
	const deviceID = useRef(null);

	const [showSearchModal, setShowSearchModal] = useState(false);

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

			}));

			player.connect();

		};


	}, []);

	// API Call to get Playback State 
	// SetInterval to retrieve state every x seconds

	// const getPlaybackState = async () => {
	// 	try {
	// 		const { data } = await axios.get('/api/playback-state');

	// 		console.log(data);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	// setInterval(() => {
	// 	console.log('Getting Playback State');
	// 	getPlaybackState();
	// }, 60000);
	
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
				<div className="container">
					<div className="main-wrapper">
						<b> Instance not active. Transfer your playback using your Spotify app </b>
					</div>
				</div>
			</>)
	} else {
		return (
			<>
				<DeviceContext.Provider value={{ deviceID: deviceID.current }}>
					<img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

					<div className="now-playing__name">{current_track.name}</div>
					<div className="now-playing__artist">{current_track.artists[0].name}</div>

					<Button variant="outlined" size='small' onClick={() => { player.previousTrack() }} >
						&lt;&lt;
					</Button>

					<Button variant="outlined" size='small' onClick={() => { player.togglePlay() }} >
						{is_paused ? "PLAY" : "PAUSE"}
					</Button>

					<Button variant="outlined" size='small' onClick={() => { player.nextTrack() }} >
						&gt;&gt;
					</Button>

					<br />
					<br />

					<div>
						<Button 
							onClick={() => { setShowSearchModal(true); }}
							variant='contained'
						>
							Search for Songs
						</Button>
					</div>

					<div className='queued_songs_list'>
						<h4>Queued Songs</h4>
						{queue.map(track => {
							return (
								<span key={track.uri}>
									<img src={track.album.images[1].url}/>
									<div>{track.name}</div>
									<div>{track.artists[0].name}</div>
								</span>
							)
						})}
					</div>

					{showSearchModal && (
						<SearchModal 
							isOpen={showSearchModal}
							handleClose={handleCloseModals}
						/>
					)}
				</DeviceContext.Provider>
			</>
		);
	}
}

export default WebPlayback
