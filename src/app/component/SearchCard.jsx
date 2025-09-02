import React from 'react';
import { 
  SchoolRounded, 
  VideoLibraryRounded, 
  PersonRounded,
  AccessTimeRounded,
  PlayCircleOutlineRounded,
  GroupRounded,
  VisibilityRounded,
  CheckCircleRounded,
  PauseCircleOutlineRounded
} from '@mui/icons-material';

const SearchCard = (props) => {
  const getIcon = () => {
    switch (props.type) {
      case 'teacher':
        return <PersonRounded className="w-12 h-12 text-blue-600" />;
      case 'course':
        return <SchoolRounded className="w-12 h-12 text-green-600" />;
      case 'lecture':
        return <PlayCircleOutlineRounded className="w-12 h-12 text-purple-600" />;
      default:
        return <VideoLibraryRounded className="w-12 h-12 text-gray-600" />;
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

  const getIconBgColor = () => {
    switch (props.type) {
      case 'teacher':
        return 'from-blue-100 to-blue-200';
      case 'course':
        return 'from-green-100 to-green-200';
      case 'lecture':
        return 'from-purple-100 to-purple-200';
      default:
        return 'from-gray-100 to-gray-200';
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return null;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary-200 transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Icon/Avatar */}
          <div className={`flex-shrink-0 w-16 h-16 ${
            props.type === 'teacher' ? 'rounded-full' : 'rounded-lg'
          } bg-gradient-to-br ${getIconBgColor()} flex items-center justify-center`}>
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors duration-200">
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

                {props.subtitle3 && props.type === 'lecture' && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                    {props.subtitle3}
                  </p>
                )}
              </div>

              {/* Type badge and status */}
              <div className="flex flex-col items-end space-y-1">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${getBadgeColor()}
                `}>
                  {props.subtitle3 || props.type}
                </span>
                
                {/* Course status */}
                {props.type === 'course' && props.isActive !== undefined && (
                  <span className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${props.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                    }
                  `}>
                    {props.isActive ? (
                      <>
                        <CheckCircleRounded className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <PauseCircleOutlineRounded className="w-3 h-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Description if provided */}
            {props.description && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                {props.description}
              </p>
            )}

            {/* Metadata row */}
            <div className="flex items-center justify-between mt-3">
              {/* Left side - type specific stats */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {/* Course statistics */}
                {props.type === 'course' && (
                  <>
                    {props.chaptersCount !== undefined && (
                      <span className="flex items-center">
                        <VideoLibraryRounded className="w-3 h-3 mr-1" />
                        {props.chaptersCount} chapters
                      </span>
                    )}
                    {props.lecturesCount !== undefined && (
                      <span className="flex items-center">
                        <PlayCircleOutlineRounded className="w-3 h-3 mr-1" />
                        {props.lecturesCount} lectures
                      </span>
                    )}
                    {props.enrollmentCount !== undefined && (
                      <span className="flex items-center">
                        <GroupRounded className="w-3 h-3 mr-1" />
                        {props.enrollmentCount} enrolled
                      </span>
                    )}
                  </>
                )}

                {/* Teacher statistics */}
                {props.type === 'teacher' && (
                  <>
                    {props.courseCount !== undefined && (
                      <span className="flex items-center">
                        <SchoolRounded className="w-3 h-3 mr-1" />
                        {props.courseCount} courses
                      </span>
                    )}
                    {props.totalStudents !== undefined && (
                      <span className="flex items-center">
                        <GroupRounded className="w-3 h-3 mr-1" />
                        {props.totalStudents} students
                      </span>
                    )}
                  </>
                )}

                {/* Lecture statistics */}
                {props.type === 'lecture' && (
                  <>
                    {props.duration && (
                      <span className="flex items-center">
                        <AccessTimeRounded className="w-3 h-3 mr-1" />
                        {formatDuration(props.duration)}
                      </span>
                    )}
                    {props.watchCount !== undefined && (
                      <span className="flex items-center">
                        <VisibilityRounded className="w-3 h-3 mr-1" />
                        {props.watchCount} views
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Right side - relevance score (for debugging/admin) */}
              {props.relevanceScore && props.relevanceScore > 0 && (
                <div className="text-xs text-gray-400">
                  Score: {props.relevanceScore.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect stripe */}
      <div className={`h-1 bg-gradient-to-r ${
        props.type === 'teacher' ? 'from-blue-400 to-blue-600' :
        props.type === 'course' ? 'from-green-400 to-green-600' :
        props.type === 'lecture' ? 'from-purple-400 to-purple-600' :
        'from-gray-400 to-gray-600'
      } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
    </div>
  );
};

export default SearchCard;
