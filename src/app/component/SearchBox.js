'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
    SearchRounded, 
    PersonRounded, 
    SchoolRounded, 
    PlayLessonRounded,
    CloseRounded
} from '@mui/icons-material';

export default function SearchBox({ 
    placeholder = "Search...", 
    className = "",
    onResultSelect,
    compact = false 
}) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const debounceRef = useRef(null);

    // Fetch suggestions with debouncing
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.length >= 2) {
            setIsLoading(true);
            debounceRef.current = setTimeout(async () => {
                try {
                    const response = await axios.get('/api/quick-search', {
                        params: { q: query, limit: 8 }
                    });
                    setSuggestions(response.data.suggestions || []);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Quick search error:', error);
                    setSuggestions([]);
                } finally {
                    setIsLoading(false);
                }
            }, 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            setIsLoading(false);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query]);

    // Handle clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (value) => {
        setQuery(value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            handleSearch();
        }
    };

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setShowSuggestions(false);
            if (onResultSelect) {
                onResultSelect({ type: 'search', query: query.trim() });
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.title);
        setShowSuggestions(false);
        
        if (onResultSelect) {
            onResultSelect(suggestion);
        } else {
            // Default navigation
            const searchType = suggestion.type === 'course' ? 'courses' : 
                             suggestion.type === 'teacher' ? 'teachers' : 
                             suggestion.type === 'lecture' ? 'lectures' : 'all';
            router.push(`/search?q=${encodeURIComponent(suggestion.title)}&type=${searchType}`);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const getIcon = (type) => {
        switch (type) {
            case 'teacher': return <PersonRounded className="text-blue-500" />;
            case 'course': return <SchoolRounded className="text-green-500" />;
            case 'lecture': return <PlayLessonRounded className="text-purple-500" />;
            default: return <SearchRounded className="text-gray-400" />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'teacher': return 'Teacher';
            case 'course': return 'Course';
            case 'lecture': return 'Lecture';
            default: return '';
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <SearchRounded className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${compact ? 'text-sm' : 'text-lg'}`} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder={placeholder}
                    className={`w-full ${compact ? 'pl-8 pr-8 py-2 text-sm' : 'pl-10 pr-10 py-3'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white`}
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${compact ? 'text-sm' : 'text-lg'}`}
                    >
                        <CloseRounded />
                    </button>
                )}
                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className={`animate-spin rounded-full border-2 border-primary-600 border-t-transparent ${compact ? 'h-4 w-4' : 'h-5 w-5'}`}></div>
                    </div>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1 max-h-96 overflow-y-auto"
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        >
                            <div className="flex-shrink-0">
                                {getIcon(suggestion.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">
                                    {suggestion.title}
                                </div>
                                {suggestion.subtitle && (
                                    <div className="text-sm text-gray-500 truncate">
                                        {suggestion.subtitle}
                                    </div>
                                )}
                            </div>
                            <div className="flex-shrink-0">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {getTypeLabel(suggestion.type)}
                                </span>
                            </div>
                        </button>
                    ))}
                    
                    {/* View all results option */}
                    <button
                        onClick={handleSearch}
                        className="w-full px-4 py-3 text-left hover:bg-primary-50 flex items-center justify-center space-x-2 border-t border-gray-200 text-primary-600 font-medium"
                    >
                        <SearchRounded className="text-sm" />
                        <span>View all results for "{query}"</span>
                    </button>
                </div>
            )}
        </div>
    );
}
