import React, { useState, useRef, useEffect } from 'react';

const stations = [
  { name: 'Antyradio', url: 'http://redir.atmcdn.pl/sc/o2/Eurozet/live/antyradio.livx' },
  { name: 'RMF FM', url: 'https://www.rmfon.pl/n/rmf_fm.pls' },
  { name: 'Radio ZET', url: 'https://zetstream.radiozet.pl/RadioZET' },
  { name: 'Eska', url: 'https://www.eskago.pl/radio/eska-warszawa' }
];

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [volume, setVolume] = useState(0.5);
  const [currentStation, setCurrentStation] = useState(stations[0].url);
  const [browserInfo, setBrowserInfo] = useState('');
  const [location, setLocation] = useState(null);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);
  const audioRef = useRef(new Audio(stations[0].url));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    audioRef.current.src = currentStation;
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentStation]);

  useEffect(() => {
    setBrowserInfo(navigator.userAgent);
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Błąd uzyskiwania lokalizacji', error);
        }
      );
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleStationChange = (event) => {
    setCurrentStation(event.target.value);
  };

  const handleAcceptPrivacy = () => {
    setConsentGiven(true);
    setShowPrivacyPopup(false);
    document.cookie = 'userConsent=true; path=/';
    requestLocation();
  };

  return (
    <div className="radio-player">
      {showPrivacyPopup && (
        <div className="privacy-popup">
          <p>Nasza strona korzysta z plików cookie oraz zbiera dane geolokalizacyjne. Czy zgadzasz się na przetwarzanie tych danych?</p>
          <button onClick={handleAcceptPrivacy}>Akceptuję</button>
          <button onClick={() => setShowPrivacyPopup(false)}>Odrzuć</button>
        </div>
      )}

      <h2>Odtwarzacz Radiowy</h2>
      <button onClick={togglePlayPause}>
        {isPlaying ? 'Pauza' : 'Odtwórz'}
      </button>

      <div className="station-selector">
        <label htmlFor="stations">Wybierz stację: </label>
        <select id="stations" onChange={handleStationChange} value={currentStation}>
          {stations.map((station) => (
            <option key={station.url} value={station.url}>
              {station.name}
            </option>
          ))}
        </select>
      </div>

      <div className="volume-control">
        <label htmlFor="volume">Głośność: </label>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>

      <div className="date-time">
        <p>Data: {currentDateTime.toLocaleDateString()}</p>
        <p>Godzina: {currentDateTime.toLocaleTimeString()}</p>
      </div>

      <div className="browser-info">
        <p>Przeglądarka: {browserInfo}</p>
      </div>

      {location && (
        <div className="location-info">
          <p>Lokalizacja: {location.latitude}, {location.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default RadioPlayer;
