

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Discoverlistmain from './Discoverlistmain';
// import Discoverlist from './Discoverlist';
import { useAppContext } from "../context/AppContext";
import axios from 'axios';
import Fuse from 'fuse.js';
import "../individualCSS/Discover/discover.css";
// import SearchButton from './SearchButton';
import FilterButton from './FilterButton';
import BackwardIcon from './BackwardIcon';
import ForwardIcon from './ForwardIcon';
import Mobailenav from './Mobailenav';
import LandingFooter from './LandingFooter';

const Discover = () => {
  const { discovers } = useAppContext();

  const inputRef = useRef(null);
  const gridRef = useRef(null);
  const paginationRef = useRef(null);
  const containerRef = useRef(null);
  const filterDropdownRef = useRef(null);

  const [searchMode, setSearchMode] = useState('default'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lastSearchMessage, setLastSearchMessage] = useState('');
  const [shouldShowSuggestionLabel, setShouldShowSuggestionLabel] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(15); 
  const [itemsPerPage, setItemsPerPage] = useState(12); 

  const [lastNavType, setLastNavType] = useState(null); 

  const getInputValue = () => {
    if (searchTerm.trim() !== '') return searchTerm;
    if (selectedCategory !== 'all' && selectedRating) return `${selectedCategory} · ${selectedRating} ★`;
    if (selectedCategory !== 'all') return selectedCategory;
    if (selectedRating) return `${selectedRating} ★`;
    return '';
  };

  const isFilterActive = selectedCategory !== 'all' || selectedRating != null;
  const isRatingOnly = searchTerm.trim() === '' && selectedRating && selectedCategory === 'all';
  const isRatingWithCategory = searchTerm.trim() === '' && selectedRating && selectedCategory !== 'all';
  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/addtour/all');
        // const res = await axios.get(`${BACKEND_URL}/addtour/all`);
        if (res.data.success) {
          const map = {};
          res.data.tour.forEach(t => {
            map[t._id] = t.title;
          });
          setCategoryMap(map);
        }
      } catch (e) {
        console.log('Category fetch failed', e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}, []);


const categories = useMemo(() => {
  if (!Array.isArray(discovers)) return [];
  
  const values = discovers.flatMap(d => {
    const customCity = d.customCity;
    let categoryTitle = '';

    if (typeof d.category === 'string') {
      categoryTitle = categoryMap[d.category] || d.category;
    } else if (typeof d.category === 'object' && d.category !== null) {
      categoryTitle = d.category.title || '';
    }

    return [customCity, categoryTitle];
  });

  return Array.from(new Set(values.filter(Boolean)));
}, [discovers, categoryMap]);



  const normalize = str => (str || '').toLowerCase();

  const enrichedDiscovers = useMemo(() => {
    if (!Array.isArray(discovers)) return [];
    return discovers.map(d => ({
      ...d,
      _normalizedCategory: typeof d.category === 'string' ? (categoryMap[d.category] || d.category) : '',
    }));
  }, [discovers, categoryMap]);

  const fuse = useMemo(() => {
    if (!Array.isArray(enrichedDiscovers)) return null;
    const options = {
      keys: ['place', 'customCity', '_normalizedCategory'],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 1,
    };
    return new Fuse(enrichedDiscovers, options);
  }, [enrichedDiscovers]);

  useEffect(() => {
    if (!searchTerm || !fuse) {
      setSuggestions([]);
      return;
    }

    const separators = /[, ]+/;
    const parts = searchTerm.split(separators).filter(Boolean);
    const lastPart = parts.length > 0 ? parts[parts.length - 1].trim() : '';
    const previousParts = parts.slice(0, -1).map(p => p.trim().toLowerCase());

    if (!lastPart) {
      setSuggestions([]);
      return;
    }

    const results = fuse.search(lastPart);
    const filtered = results
      .map(r => r.item.place)
      .filter(place => !previousParts.includes(place.toLowerCase()));
    const matches = filtered.slice(0, 10);

    setSuggestions(matches);
    setShowSuggestions(true);
  }, [searchTerm, fuse]);

  const getClosestMatch = (term, list) => {
    const lowerTerm = normalize(term);
    return list.find(item => normalize(item).includes(lowerTerm)) || '';
  };

  const prevFiltersRef = useRef({
    searchTerm: '',
    selectedCategory: 'all',
    selectedRating: null,
    searchMode: 'default',
  });

  useEffect(() => {
    const prev = prevFiltersRef.current;
    const becameMoreSpecific =
      (searchTerm.trim() !== '' && normalize(searchTerm) !== normalize(prev.searchTerm)) ||
      (selectedCategory !== 'all' && selectedCategory !== prev.selectedCategory) ||
      (selectedRating != null && selectedRating !== prev.selectedRating) ||
      (searchMode !== prev.searchMode);

    if (becameMoreSpecific) setCurrentPage(1);

    prevFiltersRef.current = {
      searchTerm,
      selectedCategory,
      selectedRating,
      searchMode,
    };
  }, [searchTerm, selectedCategory, selectedRating, searchMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    setSearchTriggered(true);
    setSearchMode('placeOnly');
    setCurrentPage(1);
    setShowSuggestions(false);
    setShowFilterDropdown(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedRating(null);
    setSearchTriggered(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setLastSearchMessage('');
    setShouldShowSuggestionLabel(false);
    setShowFilterDropdown(false);
  };

 const filteredDiscovers = useMemo(() => {
  if (!Array.isArray(enrichedDiscovers)) return [];

  const term = normalize(searchTerm.trim());
  const separators = /[, ]+/;
  const terms = searchTerm.split(separators).filter(Boolean).map(t => normalize(t));

  let filtered = enrichedDiscovers.filter(d => {
    const place = normalize(d.place || '');
    const customCity = normalize(d.customCity || '');
    const categoryTitle = (typeof d.category === 'string')
      ? normalize(categoryMap[d.category] || d.category)
      : (d.category && d.category.title ? normalize(d.category.title) : '');

    const ratingMatch = selectedRating ? d.rating === selectedRating : true;

    const normalizedSelectedCategory = normalize(selectedCategory);

    const categoryMatch =
      selectedCategory === 'all' ||
      customCity === normalizedSelectedCategory ||   // city filter
      categoryTitle === normalizedSelectedCategory;  // category filter

    let textMatch = true;
    if (term) {
      textMatch = terms.some(t =>
        place.includes(t) || customCity.includes(t) || categoryTitle.includes(t)
      );
    }

    return textMatch && categoryMatch && ratingMatch;
  });

  if (searchTriggered && filtered.length === 0 && term !== '') {
    setLastSearchMessage(`No place found for "${searchTerm}".`);
    setShouldShowSuggestionLabel(true);
  } else {
    setLastSearchMessage('');
    setShouldShowSuggestionLabel(false);
  }

  return filtered;
}, [
  enrichedDiscovers,
  searchTerm,
  selectedCategory,
  selectedRating,
  categoryMap,
  searchTriggered,
]);




  // useEffect(() => {
  //   const calculateColumns = () => {
  //     if (!gridRef.current || gridRef.current.children.length === 0) return;

  //     const firstRowTop = gridRef.current.children[0].getBoundingClientRect().top;

  //     const columns = Array.from(gridRef.current.children).filter(item => {
  //       return item.getBoundingClientRect().top === firstRowTop;
  //     }).length;

  //     const newItemsPerPage = columns * 5;
  //     setItemsPerPage(newItemsPerPage);
  //   };

  //   calculateColumns();
  //   window.addEventListener('resize', calculateColumns);
  //   return () => window.removeEventListener('resize', calculateColumns);
  // }, [filteredDiscovers]);

  const paginatedDiscovers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDiscovers.slice(start, start + itemsPerPage);
  }, [filteredDiscovers, currentPage, itemsPerPage]);

  // ✅ FIXED: move this here
  const totalPages = Math.ceil(filteredDiscovers.length / itemsPerPage);

  useEffect(() => {
    if ((lastNavType === 'next' || lastNavType === 'prev') && paginationRef.current) {
      const paginationTop = paginationRef.current.offsetTop;
      const viewportHeight = window.innerHeight;
      const scrollToPosition = paginationTop - viewportHeight * 0.5;
      window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
    }
    setLastNavType(null);
  }, [currentPage]);


  return (

    <>

    <header>
    <Mobailenav/>
    <div className="Discover-main-section__header-div">
        <h2 className="Discover-main-section__header">Iconic Destinations</h2>
        <p className="Discover-main-section__subheader">Experience the diverse landscapes and rich culture of Bangladesh.</p>
    </div>
    </header>

    <main>
    <div className="discover___BG" ref={containerRef}>


     
      {/* <div className="wave-light" aria-hidden="true" />
  <div className="spot delay-1" style={{ top: "18%", left: "70%" }} aria-hidden="true" />
  <div className="spot delay-2" style={{ top: "60%", left: "32%" }} aria-hidden="true" />
  <div className="spot delay-3" style={{ top: "40%", left: "50%" }} aria-hidden="true" />
  <div className="spot delay-4" style={{ top: "75%", left: "20%" }} aria-hidden="true" /> */}
      <section className="discovermain-section___container discover_container">
        


        <div className="search-controls">
          
          
          
          <div className='search___filter___div'>


            <div className="search-input-wrapper">
              
              <div className='search-input-border'>


               <div className='input-simple-div' style={{ display: 'flex',width:'100%',position: 'relative' }}>
  <input
    ref={inputRef}
    type="text"
    className={`search-input ${
    searchTerm.trim() !== '' || isFilterActive ? 'has-value' : ''
  }`}
    // className={`search-input ${searchTerm.trim() !== '' ? 'has-value' : ''}`}
    placeholder={isFilterActive ? '' : 'Search place or city...'}
    value={searchTerm}
    onChange={e => {
      setSearchTerm(e.target.value);
      setSearchTriggered(false);
      setSearchMode('default');
    }}
    onFocus={() => setShowSuggestions(true)}
    style={{ paddingRight: '35px' }}

  />

  {/* Show selectedCategory or rating as placeholder overlay only if no input */}
  {searchTerm.trim() === '' && isFilterActive && (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '12px',
      transform: 'translateY(-50%)',
      fontStyle: 'italic',
      fontWeight: 'normal',
      color: '#88898b',
      pointerEvents: 'none',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      fontSize: '0.95em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 'calc(100% - 40px)',
    }}
  >
    {(selectedCategory !== 'all' && selectedRating)
      ? `${selectedCategory} - All places · ${selectedRating} ★`
      : (selectedCategory !== 'all')
      ? `${selectedCategory} - All places`
      : (selectedRating)
      ? `${selectedRating} ★`
      : ''}
  </div>
)}

  {/* Show rating small badge inside input (optional) */}
  {selectedRating && searchTerm.trim() !== '' && (
    <span className='RATING-SPAN-PLACEHOLDER'
      style={{
        position: 'absolute',
        
        transform: 'translateY(-50%)',
        color: '#555',
        pointerEvents: 'none',
        userSelect: 'none',
        fontSize: '0.7rem',
      }}
    >
      {selectedRating} ★
    </span>
  )}
</div>



                {(searchTerm || selectedCategory !== 'all' || selectedRating) && (
                  <span className="search-clear" onClick={handleClear} role="button" aria-label="Clear search">
                    ×
                  </span>
                )}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="search-suggestions">
  {suggestions.map((s, i) => (
    <li
      key={i}
      className="suggestion-item"
   onMouseDown={e => {
  e.preventDefault();
  const separators = /[, ]+/;
  const parts = searchTerm.trim().split(separators);
  parts[parts.length - 1] = s;
  const newTerm = parts.join(', ') + ' ';
  setSearchTerm(newTerm);
  setSearchTriggered(true);
  setSearchMode('default'); // reset back to full filtering
  setShowSuggestions(false);

  setTimeout(() => {
    if (inputRef.current) {
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
      inputRef.current.scrollLeft = inputRef.current.scrollWidth - inputRef.current.clientWidth;
      inputRef.current.focus();
    }
  }, 0);
}}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const separators = /[, ]+/;
          const parts = searchTerm.trim().split(separators);
          parts[parts.length - 1] = s;
          const newTerm = parts.join(', ') + ' ';
          setSearchTerm(newTerm);
          setSearchTriggered(true);
          setShowSuggestions(false);
        }
      }}
    >
      {s}
    </li>
  ))}
</ul>

                )}
              </div>
            </div>


            

            <div className="filter-dropdown-container" ref={filterDropdownRef}>
              <button className='filter-button'>
                <FilterButton onClick={() => setShowFilterDropdown(prev => !prev)} />
              </button>

              {showFilterDropdown && (
                <div className="filter-dropdown-menu">
                 

                 <label className="filter-label" htmlFor="category-select">
  Category
  <select
    id="category-select"
    className="filter-select"
    value={selectedCategory}
    onChange={(e) => {
      setSelectedCategory(e.target.value);
      setSearchTerm('');
      setSearchTriggered(false);
      setCurrentPage(1);
      setShowFilterDropdown(false); // ✅ close dropdown after selection
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 0);
    }}
  >
    <option value="all">All Cities</option>
    {categories.map((cat, i) => (
      <option key={i} value={cat.toLowerCase()}>{cat}</option>
    ))}
  </select>
</label>

<label className="filter-label" htmlFor="rating-select">
  Rating
  <select
    id="rating-select"
    className="filter-select"
    value={selectedRating || ''}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedRating(value === '' ? null : Number(value));
      setSearchTerm('');
      setSearchTriggered(false);
      setCurrentPage(1);
      setShowFilterDropdown(false); // ✅ close dropdown after selection
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 0);
    }}
  >
    <option value="">All Ratings</option>
    {[5, 4, 3, 2, 1].map((r) => (
      <option key={r} value={r}>{r} ★</option>
    ))}
  </select>
</label>



                  {/* <label className="filter-label" htmlFor="category-select">
                    Category
                   <select
  id="category-select"
  className="filter-select"
  value={selectedCategory}
  onChange={(e) => {
    setSelectedCategory(e.target.value);
    setSearchTerm('');
    setSearchTriggered(false);
    setCurrentPage(1);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  }}
>
  <option value="all">All Cities</option>
 {categories.map((cat, i) => (
  <option key={i} value={cat.toLowerCase()}>{cat}</option>
))}

</select>

                  </label>

                  <label className="filter-label" htmlFor="rating-select">
                    Rating
                    <select
                      id="rating-select"
                      className="filter-select"
                      value={selectedRating || ''}
                    onChange={(e) => {
  const value = e.target.value;
  setSelectedRating(value === '' ? null : Number(value));
  setSearchTerm('');
  setSearchTriggered(false);
  setCurrentPage(1);
  setTimeout(() => {
    if (inputRef.current) inputRef.current.focus();
  }, 0);
}}



                    >
                      <option value="">All Ratings</option>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>{r} ★</option>
                      ))}
                    </select>
                  </label> */}


                </div>
              )}
            </div>
          </div>

          {/* <SearchButton handleSearch={handleSearch} /> */}
        </div>

        {shouldShowSuggestionLabel && (
          <p className="suggestion-label">{lastSearchMessage}</p>
        )}

        {/* <div className="discover___grid">
          {filteredDiscovers.map((discover, i) => (
            <div key={i} className="discover___item___wrapper">
              <Discoverlist discover={discover} />
            </div>
          ))}
        </div> */}
       
       {/* <div className="discover___grid" ref={gridRef}>
        {paginatedDiscovers.map((discover, i) => (
          <div key={i} className="discover___item___wrapper">
          <Discoverlist key={i} discover={discover} />
          </div>
        ))}
      </div> */}

      {/* <div className="discover___grid" ref={gridRef}>
  {(rowCount >= 5 ? paginatedDiscovers : filteredDiscovers).map((discover, i) => (
    <div key={i} className="discover___item___wrapper">
      <Discoverlist discover={discover} />
    </div>
  ))}
</div>


      {rowCount >= 5 && Math.ceil(filteredDiscovers.length / itemsPerPage) > 1 && (
  <div className="pagination">

          <button className='B-Icon'
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
           <BackwardIcon onClick={() => console.log("Clicked!")} />
          </button>


          {Array.from({ length: Math.ceil(filteredDiscovers.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
  
  <button 
    key={page}
    onClick={() => {
      setCurrentPage(page);
      setTimeout(() => {
        window.scrollTo({ top: containerRef.current?.offsetTop || 0, behavior: 'smooth' });
      }, 0);
    }}
    className={`number-pagenation ${page === currentPage ? 'active' : ''}`}
  >
    {page}
  </button>
))}


          <button className='F-Icon'
            onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredDiscovers.length / itemsPerPage)))}
            disabled={currentPage === Math.ceil(filteredDiscovers.length / itemsPerPage)}
          >
            <ForwardIcon onClick={() => console.log("Clicked!")} />
          </button>
        </div>
      )} */}
{/* 
<div className="discover___grid" ref={gridRef} >
  {paginatedDiscovers.map((discover, i) => (
    <div key={i} className="discover___item___wrapper">
      <Discoverlist discover={discover} />
    </div>
  ))}
</div>

{Math.ceil(filteredDiscovers.length / itemsPerPage) > 1 && (
  <div className="pagination" ref={paginationRef}>
    
<button
  className='B-Icon'
  onClick={() => {
    setLastNavType('prev');
    setCurrentPage(p => Math.max(1, p - 1));
  }}
  disabled={currentPage === 1}
>
  <BackwardIcon />
</button>



    {Array.from({ length: Math.ceil(filteredDiscovers.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
      <button
        key={page}
        onClick={() => {
          setCurrentPage(page);
          setTimeout(() => {
            window.scrollTo({ top: containerRef.current?.offsetTop || 0, behavior: 'smooth' });
          }, 0);
        }}
        className={`number-pagenation ${page === currentPage ? 'active' : ''}`}
      >
        {page}
      </button>
    ))}

    
<button
  className='F-Icon'
  onClick={() => {
    setLastNavType('next');
    setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredDiscovers.length / itemsPerPage)));
  }}
  disabled={currentPage === Math.ceil(filteredDiscovers.length / itemsPerPage)}
>
  <ForwardIcon />
</button>

  </div>
)} */}

<div className="discover___grid" ref={gridRef}>
  {paginatedDiscovers.map((discover, i) => (
    <div key={i} className="discovermain___item___wrapper">
      <Discoverlistmain discover={discover} />
    </div>
  ))}
</div>
 
 <div>
{totalPages > 1 && (
  <div className="pagination" ref={paginationRef}>
    <button
      className="B-Icon"
      onClick={() => {
        setCurrentPage(p => Math.max(1, p - 1));
        setLastNavType('prev');
        setTimeout(() => {
          window.scrollTo({
            top: containerRef.current?.offsetTop || 0,
            behavior: 'smooth',
          });
        }, 0);
      }}
      disabled={currentPage === 1}
    >
      <BackwardIcon />
    </button>

    {(() => {
      const pageNumbers = new Set();
      const jumpAmount = 5;

      // Define the window of pages to display around the current page
      let windowStart, windowEnd;
      if (totalPages <= 7) { // If 7 or fewer pages, show all
        windowStart = 1;
        windowEnd = totalPages;
      } else if (currentPage <= 4) { // Near the start
        windowStart = 1;
        windowEnd = 5;
      } else if (currentPage >= totalPages - 3) { // Near the end
        windowStart = totalPages - 4;
        windowEnd = totalPages;
      } else { // In the middle
        windowStart = currentPage - 1;
        windowEnd = currentPage + 1;
      }

      for (let i = windowStart; i <= windowEnd; i++) {
        pageNumbers.add(i);
      }

      // Show at most one jump button based on current page position
      if (totalPages > 7) {
        if (currentPage <= Math.ceil(totalPages / 2)) {
          // Show jump-forward when in the first half
          const jumpForward = windowEnd + jumpAmount;
          if (jumpForward < totalPages) {
            pageNumbers.add(jumpForward);
          }
        } else {
          // Show jump-back when in the second half
          const jumpBack = windowStart - jumpAmount;
          if (jumpBack > 1) {
            pageNumbers.add(jumpBack);
          }
        }
      }
      
      // Always include first and last page
      pageNumbers.add(1);
      pageNumbers.add(totalPages);

      const sortedPages = Array.from(pageNumbers).sort((a, b) => a - b);
      
      return sortedPages.map((page) => (
        <button
          key={page}
          onClick={() => {
            setCurrentPage(page);
            setTimeout(() => {
              window.scrollTo({
                top: containerRef.current?.offsetTop || 0,
                behavior: 'smooth',
              });
            }, 0);
          }}
          className={`number-pagenation ${page === currentPage ? 'active' : ''}`}
        >
          {page}
        </button>
      ));
    })()}

    <button
      className="F-Icon"
      onClick={() => {
        setCurrentPage(p => Math.min(p + 1, totalPages));
        setLastNavType('next');
        setTimeout(() => {
          window.scrollTo({
            top: containerRef.current?.offsetTop || 0,
            behavior: 'smooth',
          });
        }, 0);
      }}
      disabled={currentPage === totalPages}
    >
      <ForwardIcon />
    </button>
    
    
    {/* <div className="pagination-counter" style={{ width: '100%', textAlign: 'center', marginTop: '10px', color: '#666' }}>
      Page {currentPage} of {totalPages}
    </div> */}
    
  </div>
  
)}

<div className="pagination-counter" style={{ width: '100%', textAlign: 'center', marginTop: '12px', color: '#666',fontSize:"15px" }}>
      Page {currentPage} of {totalPages}
    </div>

</div>

      </section>
    </div>
    </main>
    <footer><LandingFooter/></footer>
    </>
  );
};

export default Discover;
