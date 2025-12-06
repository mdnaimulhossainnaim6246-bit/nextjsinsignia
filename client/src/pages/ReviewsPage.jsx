import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Loader from '../components/Loader';
import ReviewItem from '../components/ReviewItem';
import '../individualCSS/ModernReviews.css'; 
import LandingFooter from '../components/LandingFooter';
import Mobailenav from '../components/Mobailenav';
import GroupTourList from '../components/GroupTourList';
import DiscoverArticle from './discoverarticle';
import BlogListcolumnlist from '../components/BlogListcolumnlist';
import Packageslistcolumnlist from '../components/Packageslistcolumnlist';

const REVIEWS_PER_PAGE = 10;

const ReviewsPage = () => {
    const { axios } = useAppContext();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axios.get('/addreview/all');
                if (data.success) {
                    // Assuming we want to show the newest reviews first
                    setReviews(data.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                } else {
                    setError('Failed to fetch reviews.');
                }
            } catch (err) {
                setError('An error occurred while fetching reviews.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [axios]);

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + REVIEWS_PER_PAGE);
    };

    const handleShowLess = () => {
        setVisibleCount(REVIEWS_PER_PAGE);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="review-page-error">{error}</div>;
    }
    
    const allReviewsLoaded = visibleCount >= reviews.length;

    return (
        <>
        <header>
            <Mobailenav/>
            <div className='review___header-title-div'>
                <h1 className="modern-reviews-title">What Our Travelers Say</h1>
                <p className="modern-reviews-subtitle">Honest feedback from our amazing community.</p>
            </div>
        </header>

        <main style={{background:"#fff"}}>
            <div style={{padding:'1.3rem',maxWidth:'750px',margin:'0 auto',textAlign:"center"}}>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.6",
                    color: "#2c3e50",
                    margin: "20px 0 10px 0",
                    fontFamily:'inter'
                  }}
                >
                  Here are some of the enthusiastic reviews our clients have shared about us on TripAdvisor.
                  Each review on the details page includes a link to the original post.
                  You can visit our TripAdvisor page to view all the original reviews.
                </p>
                
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.6",
                    color: "#2c3e50",
                    margin: 0,
                    fontStyle:'italic'

                  }}
                >
                  You can visit{" "}
                  <a
                    href="https://www.tripadvisor.com/Attraction_Review-g293936-d29011678-Reviews-Insignia_Tours_and_Travel-Dhaka_City_Dhaka_Division.html"
                    target="_blank"
                    style={{
                      color: "#4a90bd",
                      fontWeight: 600,
                      textDecoration: "underline",
                    }}
                  >
                    our TripAdvisor page
                  </a>{" "}
                  to view all the original reviews.
                </p>


            </div>
        <div className="modern-reviews-page">


        <div className='grid-review-preaview'>
            <div className="modern-reviews-container">
                <div className="modern-review-list">
                    {reviews.length > 0 ? (
                        reviews.slice(0, visibleCount).map(review => (
                            <ReviewItem key={review._id} review={review} />
                        ))
                    ) : (
                        <p>No reviews available at the moment.</p>
                    )}
                </div>

                <div className="modern-reviews-pagination">
                    {!allReviewsLoaded && reviews.length > REVIEWS_PER_PAGE && (
                        <button onClick={handleLoadMore} className="modern-reviews-load-btn">
                            Load More
                        </button>
                    )}
                    {allReviewsLoaded && reviews.length > REVIEWS_PER_PAGE && (
                        <button onClick={handleShowLess} className="modern-reviews-load-btn show-less">
                            Show Less
                        </button>
                    )}
                </div>
            </div>
        

        <div className='column-bottom-extra'>
            <div><GroupTourList/></div>
            <div><DiscoverArticle/></div>
        </div>
         </div>
         </div>
        </main>
         <section>
          <BlogListcolumnlist/>
          <Packageslistcolumnlist/>
        </section>
        <footer>
            <LandingFooter/>
        </footer>
        </>
    );
};

export default ReviewsPage;
