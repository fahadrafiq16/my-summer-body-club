import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Gallery1 from "../../images/gallery-1.jpg";
import Gallery2 from "../../images/gallery-2.jpg";
import Gallery3 from "../../images/gallery-3.jpg";
import Gallery4 from "../../images/gallery-4.jpg";
import Gallery5 from "../../images/gallery-5.jpg";
import { getBackendBaseUrl } from "../../utils/backend";

const SECTION_KEY = "gallery";
const GALLERY_DIV_CLASSES = ["div1", "div2", "div3", "div4", "div5"];
const DEFAULT_PHOTOS_URL = "https://mysummerbodyclub.nl/fotos/";
const DEFAULT_VIDEOS_URL = "https://mysummerbodyclub.nl/fotos/";

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
    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  return (
    <section id="home-gallery" className="padding-bottom mt-[100px] max-md:mt-[60px]">
      <div className="container max-w-[1110px] mx-auto px-4">
        <div className="gallery-inner">
          <div className="title-area">
            <div className="inner-title-area">
              <div className="section-title">
                <h2>
                  GALLERY<br />
                  <span>GYM PHOTO</span>
                </h2>
              </div>
              <div className="flex gap-4">
                <div className="button-gallery">
                  <a href={photosButtonUrl}>Photos</a>
                </div>
                <div className="button-gallery">
                  <a href={videosButtonUrl}>Videos</a>
                </div>
              </div>
            </div>

            <div className="parent1">
              {items.map((item, index) => (
                <div key={index} className={GALLERY_DIV_CLASSES[index]}>
                  <a href={item.linkUrl}>
                    <img src={item.image} alt={`Gallery ${index + 1}`} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="right-area">
            <Link className="bordered-button" to="/proefles">
              Hoe Graag Wil Je Het? Start Vandaag!
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
