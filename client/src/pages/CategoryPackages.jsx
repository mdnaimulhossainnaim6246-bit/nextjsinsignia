
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Packageslistinner from '../components/Packageslistinner';
import '../individualCSS/components/CategoryPackages.css';

const categoryDescriptions = {
  'Free Tour': "Explore the city's hidden gems without spending a dime. Our free tours are led by passionate local guides who will show you the best of what the city has to offer.",
  'All Prime Destinations': "Visit all the must-see attractions with our All Prime Destinations package. This comprehensive tour covers all the iconic landmarks and hidden treasures.",
  'Historic Places Tour': "Step back in time with our Historic Places Tour. Discover the rich history and heritage of the region as you explore ancient ruins, majestic palaces, and sacred sites.",
  'Dhaka City Tour': "Experience the vibrant culture and bustling energy of Dhaka with our city tour. We'll take you to the most famous landmarks, markets, and restaurants.",
  'Aquatic Destinations': "Dive into a world of adventure with our Aquatic Destinations package. Explore pristine beaches, crystal-clear waters, and vibrant marine life.",
  'Highland Destinations': "Escape to the mountains with our Highland Destinations package. Enjoy breathtaking views, fresh mountain air, and a variety of outdoor activities.",
  'Highlighted Tourrist Spot': "Discover the most popular and picturesque tourist spots with our Highlighted Tourist Spot package. Perfect for creating unforgettable memories.",
  'Extra 1': "This is a placeholder description for Extra 1 category.",
  'Extra 2': "This is a placeholder description for Extra 2 category.",
  'Extra 3': "This is a placeholder description for Extra 3 category.",
};

const CategoryPackages = () => {
  const { categoryName } = useParams();
  const { packages } = useAppContext();

  const decodedCategoryName = decodeURIComponent(categoryName);

  const filteredPackages = packages.filter(pkg => 
    pkg.packageCategories.includes(decodedCategoryName)
  );

  const categoryDescription = categoryDescriptions[decodedCategoryName] || "";

  return (
    <div className='category-packages-uper-div' >
      <div className="category-packages-container">
        <h2 className="category-packages-title">{decodedCategoryName}</h2>
        {categoryDescription && <p className="category-packages-description">{categoryDescription}</p>}
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

export default CategoryPackages;
