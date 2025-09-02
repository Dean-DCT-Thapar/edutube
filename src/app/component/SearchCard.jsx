import React from 'react';
import { 
  SchoolRounded, 
  VideoLibraryRounded, 
  PersonRounded,
  AccessTimeRounded,
  PlayCircleOutlineRounded
} from '@mui/icons-material';

const SearchCard = (props) => {
  const getIcon = () => {
    switch (props.type) {
      case 'teacher':
        return <PersonRounded className="w-12 h-12 text-primary-600" />;
      case 'course':
        return <SchoolRounded className="w-12 h-12 text-primary-600" />;
      case 'lecture':
        return <PlayCircleOutlineRounded className="w-12 h-12 text-primary-600" />;
      default:
        return <VideoLibraryRounded className="w-12 h-12 text-primary-600" />;
    }
  };

  const getBadgeColor = () => {
    switch (props.type) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'course':
        return 'bg-green-100 text-green-800';
      case 'lecture':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary-200 transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Icon/Avatar */}
          <div className={`flex-shrink-0 w-16 h-16 ${
            props.type === 'teacher' ? 'rounded-full' : 'rounded-lg'
          } bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center`}>
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {props.main_title}
                </h3>
                
                {props.subtitle1 && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {props.subtitle1}
                  </p>
                )}
                
                {props.subtitle2 && (
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                    {props.subtitle2}
                  </p>
                )}

                {/* Additional metadata */}
                {props.duration && (
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <AccessTimeRounded className="w-4 h-4 mr-1" />
                    {props.duration}
                  </div>
                )}
              </div>

              {/* Type badge */}
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                ${getBadgeColor()}
              `}>
                {props.subtitle3 || props.type}
              </span>
            </div>

            {/* Description if provided */}
            {props.description && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                {props.description}
              </p>
            )}

            {/* Course statistics */}
            {props.type === 'course' && (
              <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                {props.chaptersCount && (
                  <span>{props.chaptersCount} chapters</span>
                )}
                {props.lecturesCount && (
                  <span>{props.lecturesCount} lectures</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
