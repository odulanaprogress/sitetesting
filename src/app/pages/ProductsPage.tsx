import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { categories, subcategories } from '../data/mockData';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  const searchParam = searchParams.get('search') || '';
  const { products } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam || 'all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'popular'>('featured');
  const [searchInput, setSearchInput] = useState(searchParam);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (subcategoryParam) setSelectedSubcategory(subcategoryParam);
  }, [categoryParam, subcategoryParam]);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const clearSearch = () => {
    setSearchInput('');
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    const query = searchInput.trim().toLowerCase();

    if (query) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(p => (p as any).subcategory === selectedSubcategory);
    }

    if (priceRange === 'low') {
      filtered = filtered.filter(p => p.price < 10000);
    } else if (priceRange === 'mid') {
      filtered = filtered.filter(p => p.price >= 10000 && p.price < 20000);
    } else if (priceRange === 'high') {
      filtered = filtered.filter(p => p.price >= 20000);
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  }, [selectedCategory, priceRange, sortBy, searchInput, products, selectedSubcategory]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, sortBy, searchInput, selectedSubcategory]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('all'); // Reset subcategory when changing category
    const params = new URLSearchParams(searchParams);
    if (cat === 'all') {
      params.delete('category');
      params.delete('subcategory');
    } else {
      params.set('category', cat);
      params.delete('subcategory');
    }
    setSearchParams(params);
  };

  const handleSubcategoryChange = (subcat: string) => {
    setSelectedSubcategory(subcat);
    const params = new URLSearchParams(searchParams);
    if (subcat === 'all') {
      params.delete('subcategory');
    } else {
      params.set('subcategory', subcat);
    }
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const activeCategory = categories.find(c => c.id === selectedCategory);
  const pageTitle = searchInput
    ? `Results for "${searchInput}"`
    : activeCategory
    ? activeCategory.name
    : 'Shop';

  const currentSubcategories = selectedCategory !== 'all' && subcategories[selectedCategory as keyof typeof subcategories]
    ? subcategories[selectedCategory as keyof typeof subcategories]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#b91c1c] to-[#7f1d1d] text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1.5">{pageTitle}</h1>
          <p className="text-red-100 text-sm">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm shadow-sm"
            />
            {searchInput && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            )}
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
          {/* Filters Sidebar */}
          <aside className={`md:w-60 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 md:sticky md:top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Filters</h3>
                <button
                  onClick={() => { setSelectedCategory('all'); setPriceRange('all'); setSortBy('featured'); clearSearch(); }}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="mb-5">
                <h4 className="font-semibold text-sm mb-3 text-gray-700">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="radio" name="category" checked={selectedCategory === 'all'} onChange={() => handleCategoryChange('all')} className="accent-[#b91c1c] w-4 h-4" />
                    <span className="text-sm text-gray-600">All</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="category" checked={selectedCategory === cat.id} onChange={() => handleCategoryChange(cat.id)} className="accent-[#b91c1c] w-4 h-4" />
                      <span className="text-sm text-gray-600">{cat.icon} {cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategory Filter */}
              {currentSubcategories.length > 0 && (
                <div className="mb-5">
                  <h4 className="font-semibold text-sm mb-3 text-gray-700">Subcategory</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="subcategory"
                        checked={selectedSubcategory === 'all'}
                        onChange={() => handleSubcategoryChange('all')}
                        className="accent-[#b91c1c] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">All</span>
                    </label>
                    {currentSubcategories.map(subcat => (
                      <label key={subcat.id} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="subcategory"
                          checked={selectedSubcategory === subcat.id}
                          onChange={() => handleSubcategoryChange(subcat.id)}
                          className="accent-[#b91c1c] w-4 h-4"
                        />
                        <span className="text-sm text-gray-600">{subcat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-5">
                <h4 className="font-semibold text-sm mb-3 text-gray-700">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'low', label: 'Under ₦10,000' },
                    { value: 'mid', label: '₦10,000 – ₦20,000' },
                    { value: 'high', label: 'Above ₦20,000' },
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="price" checked={priceRange === value as any} onChange={() => setPriceRange(value as any)} className="accent-[#b91c1c] w-4 h-4" />
                      <span className="text-sm text-gray-600">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-3 text-gray-700">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="featured">Featured</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="text-gray-500 text-sm">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm"
              >
                <SlidersHorizontal size={16} />
                {showFilters ? 'Hide Filters' : 'Filters'}
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Search size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-500 text-base font-medium mb-1">No products found</p>
                <p className="text-gray-400 text-sm mb-4">
                  {searchInput ? `No results for "${searchInput}"` : 'Try adjusting your filters'}
                </p>
                <button
                  onClick={() => { setSelectedCategory('all'); setPriceRange('all'); clearSearch(); }}
                  className="text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                      Prev
                    </button>
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentPage(idx + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`min-w-[32px] h-8 sm:min-w-[40px] sm:h-10 flex items-center justify-center rounded-lg text-sm transition-colors ${
                            currentPage === idx + 1
                              ? 'bg-[#b91c1c] text-white font-bold shadow-sm'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
