
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import '../individualCSS/Themepreview.css';
import Loader from './Loader';

const Themepreview = () => {
    const { axios } = useAppContext();
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);

    const carouselRef = useRef(null);
    const listRef = useRef(null);
    const thumbnailRef = useRef(null);
    const nextBtnRef = useRef(null);
    const prevBtnRef = useRef(null);

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const res = await axios.get('/api/theme');
                if (res.data.success && res.data.theme) {
                    const { mainTheme, subThemes } = res.data.theme;
                    const allThemes = [];

                    // Standardize main theme
                    if (mainTheme && mainTheme.image) {
                        allThemes.push({
                            ...mainTheme,
                            imageUrl: mainTheme.image, // Standardize to imageUrl
                            isMain: true,
                        });
                    }
                    
                    // Standardize sub-themes
                    if (subThemes) {
                        allThemes.push(...subThemes.map(st => ({
                            ...st,
                            imageUrl: st.mediaValue, // Standardize to imageUrl
                            isMain: false
                        })));
                    }
                    setThemes(allThemes);
                }
            } catch (error) {
                console.error('Failed to fetch theme data.', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTheme();
    }, [axios]);

    useEffect(() => {
        if (themes.length > 1) {
            const carouselDom = carouselRef.current;
            const sliderDom = listRef.current;
            const thumbnailBorderDom = thumbnailRef.current;
            const nextDom = nextBtnRef.current;
            const prevDom = prevBtnRef.current;
            
            const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
            if (thumbnailItemsDom.length) {
                 thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
            }

            let timeRunning = 500;
            let runTimeOut;

            const showSlider = (type) => {
                const sliderItemsDom = sliderDom.querySelectorAll('.item');
                const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');

                if (type === 'next') {
                    sliderDom.appendChild(sliderItemsDom[0]);
                    thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
                    carouselDom.classList.add('next');
                } else {
                    sliderDom.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
                    thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
                    carouselDom.classList.add('prev');
                }

                clearTimeout(runTimeOut);
                runTimeOut = setTimeout(() => {
                    carouselDom.classList.remove('next');
                    carouselDom.classList.remove('prev');
                }, timeRunning);
            };

            nextDom.onclick = () => showSlider('next');
            prevDom.onclick = () => showSlider('prev');

            return () => {
                clearTimeout(runTimeOut);
            }
        }
    }, [themes]);

    if (loading) {
        return <Loader />;
    }

    if (themes.length === 0) {
        return <div className="theme-preview-container">No themes to display.</div>;
    }

    return (
        <div id='home' className="carousel" ref={carouselRef}>
            <div className="list" ref={listRef}>
                {themes.map((theme, index) => {
                    const ThemeLink = theme.link && theme.link.value
                        ? theme.link.type === 'url'
                            ? ({ children }) => <a href={theme.link.value} target="_blank" rel="noopener noreferrer">{children}</a>
                            : ({ children }) => <Link to={theme.link.value}>{children}</Link>
                        : ({ children }) => <>{children}</>;

                    return (
                        <div className="item" key={index}>
                            <img src={theme.imageUrl} alt={theme.title} className="media-asset" />
                            <div className="content">
                                {/* <div className="author">{theme.isMain ? 'Main Theme' : 'Sub Theme'}</div> */}
                                <div className="title">{theme.title}</div>
                                <div className="topic">{theme.subtitle}</div>
                                <div className="buttons">
                                    {theme.link && theme.link.value && theme.link.displayText && (
                                        <ThemeLink>
                                            <button>{theme.link.displayText}</button>
                                        </ThemeLink>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="thumbnail" ref={thumbnailRef}>
                {themes.map((theme, index) => (
                    <div className="item" key={index}>
                       
                         <img src={theme.imageUrl} alt={theme.title} className="media-asset" />
                         
                        <div className="content">
                             <div className="title">{theme.title}</div>
                             <div className='theme-thumbnail-overlare'></div>
                        </div>
                        
                    </div>
                ))}
            </div>

            <div className="arrows">
                <button id="prev" ref={prevBtnRef}>&lt;</button>
                <button id="next" ref={nextBtnRef}>&gt;</button>
            </div>

            <div className="time"></div>
        </div>
    );
};

export default Themepreview;
 