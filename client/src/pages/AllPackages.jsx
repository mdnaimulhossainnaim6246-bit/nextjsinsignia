
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Packageslistinner from '../components/Packageslistinner';
import '../individualCSS/components/CategoryPackages.css';

const AllPackages = () => {
  const { packages, axios } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/categories/all');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, [axios]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredPackages = selectedCategory
    ? packages.filter(pkg => pkg.packageCategories.includes(selectedCategory.title))
    : packages;

  return (
    <div className='category-packages-uper-div'>
      <div className="category-packages-container">
        <h2 className="category-packages-title">All Packages</h2>
        <div className="category-filter-buttons">
          <button onClick={() => handleCategoryClick(null)} className={!selectedCategory ? 'active' : ''}>All</button>
          {categories.map(category => (
            <button 
              key={category._id} 
              onClick={() => handleCategoryClick(category)}
              className={selectedCategory && selectedCategory._id === category._id ? 'active' : ''}
            >
              {category.title}
            </button>
          ))}
        </div>
        <div className="packages-grid">
          {filteredPackages.map((pkg, i) => (
            <div key={i} className="category-package-item">
              <Packageslistinner packages={pkg} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllPackages;
