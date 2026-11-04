import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Gallery1 from "../../images/gallery-1.jpg";
import Gallery2 from "../../images/gallery-2.jpg";
import Gallery3 from "../../images/gallery-3.jpg";
import Gallery4 from "../../images/gallery-4.jpg";
import Gallery5 from "../../images/gallery-5.jpg";
import "./Gallery.css";
import { getBackendBaseUrl } from "../../utils/backend";

const SECTION_KEY = "gallery";

const DEFAULT_PHOTOS_URL = "/fotos";
const DEFAULT_VIDEOS_URL = "/fotos";

const FALLBACK_ITEMS = [
  { image: Gallery1, linkUrl: "https://mysummerbodyclub.nl/trainingfotos/meeting-the-best-2/" },
  { image: Gallery2, linkUrl: "https://mysummerbodyclub.nl/trainingfotos/naomy-burnet-sap-cup-2108/" },
  { image: Gallery3, linkUrl: "https://mysummerbodyclub.nl/trainingfotos/gabrielle-golds-gym-classic-2018/" },
  { image: Gallery4, linkUrl: "https://mysummerbodyclub.nl/trainingfotos/de-nieuwe-lichting/" },
  { image: Gallery5, linkUrl: "https://mysummerbodyclub.nl/trainingfotos/de-nieuwe-lichting/" },
];

function buildGalleryState(section) {
  const apiItems = Array.isArray(section?.galleryItems) ? section.galleryItems : [];
  const items = FALLBACK_ITEMS.map((fallback, index) => {
    const apiItem = apiItems[index] || {};
    return {
      image: apiItem.imageUrl || fallback.image,
      linkUrl: apiItem.linkUrl || fallback.linkUrl,
    };
  });

  return {
    photosButtonUrl: section?.photosButtonUrl || DEFAULT_PHOTOS_URL,
    videosButtonUrl: section?.videosButtonUrl || DEFAULT_VIDEOS_URL,
    items,
  };
}

const Gallery = () => {
  const [photosButtonUrl, setPhotosButtonUrl] = useState(DEFAULT_PHOTOS_URL);
  const [videosButtonUrl, setVideosButtonUrl] = useState(DEFAULT_VIDEOS_URL);
  const [items, setItems] = useState(FALLBACK_ITEMS);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(0);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const loadVideos = async () => {
      try {
        const response = await fetch(`${getBackendBaseUrl()}/api/fetch-gallery-videos`, { signal: controller.signal });
        if (!response.ok) throw new Error('Video request failed');
        const data = await response.json();
        if (!data.success || !Array.isArray(data.videos)) throw new Error('Invalid video response');
        if (!controller.signal.aborted) {
          setVideos(data.videos.filter((video) => video.videoUrl));
          setActiveVideo(0);
          setVideosError(false);
        }
      } catch {
        if (!controller.signal.aborted) setVideosError(true);
      } finally {
        if (!controller.signal.aborted) setVideosLoading(false);
      }
    };
    loadVideos();
    return () => controller.abort();
  }, []);

  const apiUrl = useMemo(
    () => `${getBackendBaseUrl()}/api/fetch-home-section/${SECTION_KEY}`,
    []
  );

  useEffect(() => {
    let isMounted = true;

    const fetchGallery = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!isMounted || !data?.success) return;
        const next = buildGalleryState(data.section);
        setPhotosButtonUrl(next.photosButtonUrl);
        setVideosButtonUrl(next.videosButtonUrl);
        setItems(next.items);
      } catch {
        if (isMounted) {
          setPhotosButtonUrl(DEFAULT_PHOTOS_URL);
          setVideosButtonUrl(DEFAULT_VIDEOS_URL);
          setItems(FALLBACK_ITEMS);
        }
      }
    };

    fetchGallery();
    return () => { isMounted = false; };
  }, [apiUrl]);

  const currentVideo = videos[activeVideo];
  const changeVideo = (index) => setActiveVideo((index + videos.length) % videos.length);
  return (
    <section id="home-gallery" className="home-media-gallery">
      <div className="home-media-container">
        <header className="home-media-header">
          <div className="home-media-heading">
            <h2>GALLERY</h2>
            <Link className="home-media-cta" to="/proefles">Hoe Graag Wil Je Het?<br />Start Vandaag!</Link>
          </div>
          <nav className="home-media-links" aria-label="Gallery">
            {photosButtonUrl.startsWith('/') ? <Link to={photosButtonUrl}>Photos</Link> : <a href={photosButtonUrl}>Photos</a>}
            {videos.length > 0 ? <a href="#home-gallery-videos">Videos</a> : videosButtonUrl.startsWith('/') ? <Link to={videosButtonUrl}>Videos</Link> : <a href={videosButtonUrl}>Videos</a>}
          </nav>
        </header>
        <div className="home-media-columns">
          <div id="home-gallery-videos" className="home-media-video-panel" role="region" aria-roledescription="carousel" aria-label="Gym videos">
            <h3>ALS ZIJ HET KUNNEN......?</h3>
            {currentVideo ? <>
              <video key={currentVideo.videoPublicId || currentVideo.videoUrl} src={currentVideo.videoUrl} controls playsInline preload="metadata" className="home-media-video" aria-label={currentVideo.title || 'Gym video'} onEnded={() => videos.length > 1 && changeVideo(activeVideo + 1)} />
              <div className="home-media-video-footer">
                <span className="home-media-caption" aria-live="polite">{currentVideo.title || 'Gym video'}</span>
                {videos.length > 1 && <div className="home-media-controls">
                  <button type="button" onClick={() => changeVideo(activeVideo - 1)} aria-label="Vorige video" title="Vorige video"><ArrowLeft size={22} strokeWidth={2} aria-hidden="true" /></button>
                  <button type="button" onClick={() => changeVideo(activeVideo + 1)} aria-label="Volgende video" title="Volgende video"><ArrowRight size={22} strokeWidth={2} aria-hidden="true" /></button>
                </div>}
              </div>
            </> : <div className="home-media-empty" role="status">{videosLoading ? 'Video’s laden…' : videosError ? 'Video’s konden niet worden geladen. Probeer het later opnieuw.' : 'Binnenkort nieuwe video’s.'}</div>}
          </div>
          <div className="home-media-photo-panel">
            <div className="home-media-collage" aria-label="Gym foto's">
              {items.map((item, index) => <a key={index} href={item.linkUrl} className={index === 0 ? 'home-media-photo-main' : ''}>
                <img src={item.image} alt={'Gallery ' + (index + 1)} loading="lazy" />
              </a>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Gallery;
