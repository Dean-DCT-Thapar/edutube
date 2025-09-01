# 🚀 EduTube Admin Dashboard

A comprehensive administrative interface for managing the EduTube learning platform.

## 📋 Features

### 🎯 **Dashboard Overview**
- **Real-time Statistics**: Users, Teachers, Courses, Lectures, and Enrollments
- **Recent Activity**: Latest users and courses with quick access
- **Performance Metrics**: Visual analytics and system status

### 👥 **User Management**
- **CRUD Operations**: Create, view, edit, and delete users
- **Role Management**: Assign roles (Student, Teacher, Admin)
- **Search & Filter**: Find users by name, email, or role
- **Pagination**: Efficient data loading with pagination
- **Bulk Actions**: Manage multiple users simultaneously

### 👨‍🏫 **Teacher Management**
- **Promote Users**: Convert students to teachers
- **Teacher Overview**: View teacher profiles and assignments
- **Course Statistics**: Track teacher performance and student engagement
- **Teacher Dropdown**: Quick teacher selection for course assignments

### 📚 **Course Management**
- **Course Creation**: Add new courses with descriptions
- **Teacher Assignment**: Assign courses to specific teachers
- **Course Analytics**: View lecture count and enrollment statistics
- **Search & Filter**: Find courses by name, description, or teacher

### 🎥 **Lecture Management**
- **Content Organization**: Manage lectures within courses
- **Video Integration**: Support for various video formats and URLs
- **Duration Tracking**: Set and display lecture durations
- **Course-based View**: Context-aware lecture management

### ⚙️ **Settings & Configuration**
- **Profile Management**: Update admin account details
- **Password Security**: Change passwords with validation
- **System Information**: View platform status and version details

## 🔧 Technical Stack

### **Frontend**
- **Next.js 14**: React framework with App Router
- **React 18**: Modern React with hooks and context
- **Tailwind CSS**: Utility-first CSS framework
- **Material-UI Icons**: Consistent iconography
- **React Hot Toast**: User-friendly notifications

### **Backend Integration**
- **Axios**: HTTP client for API communication
- **JWT Authentication**: Secure token-based authentication
- **RESTful APIs**: Standard HTTP methods and status codes

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- Backend API running on `http://localhost:5000`
- Admin user account in the system

### **Installation**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### **Admin Access**
```bash
# Default admin credentials
Email: admin@edutube.com
Password: admin123
```

## 📖 API Documentation

### **Authentication**
All admin endpoints require:
- **JWT Token**: Stored in `localStorage` as `adminToken`
- **Admin Role**: User must have `role: 'admin'`

### **Base URLs**
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000`

### **Key Endpoints**
```bash
# Dashboard Statistics
GET /api/admin/dashboard/stats

# User Management
GET /api/admin/users?page=1&limit=10&role=student
POST /api/admin/users
PUT /api/admin/users/:id
DELETE /api/admin/users/:id

# Teacher Management
GET /api/admin/teachers
POST /api/admin/teachers
GET /api/admin/teachers/dropdown

# Course Management
GET /api/admin/courses
POST /api/admin/courses
PUT /api/admin/courses/:id
DELETE /api/admin/courses/:id

# Lecture Management
GET /api/admin/courses/:courseId/lectures
POST /api/admin/lectures
PUT /api/admin/lectures/:id
DELETE /api/admin/lectures/:id
```

## 🎨 UI Components

### **Core Components**
- **AdminLayout**: Main layout with sidebar and navigation
- **DashboardStats**: Statistics cards with icons and metrics
- **RecentActivity**: Recent users and courses display
- **UserTable**: Paginated table with CRUD actions
- **CourseTable**: Course management with teacher info
- **LectureTable**: Lecture management within courses

### **Modal Components**
- **UserModal**: Create/edit user forms with validation
- **CourseModal**: Course creation with teacher assignment
- **LectureModal**: Lecture management with video URLs
- **TeacherModal**: Promote users to teachers
- **ConfirmDialog**: Deletion confirmations and warnings

### **Utility Components**
- **LoadingComponents**: Skeleton loaders for better UX
- **ErrorBoundary**: Error handling and graceful fallbacks
- **Pagination**: Reusable pagination component

## 🔐 Security Features

### **Authentication**
- **JWT Tokens**: Secure token-based authentication
- **Role Verification**: Admin-only access controls
- **Token Storage**: Secure localStorage management

### **Authorization**
- **Route Protection**: Admin-only routes and components
- **API Security**: Bearer token authentication
- **Role-based Access**: Different permissions for different roles

### **Data Validation**
- **Form Validation**: Client-side input validation
- **Email Validation**: Proper email format checking
- **Password Security**: Minimum length and complexity requirements

## 📱 Responsive Design

### **Mobile First**
- **Responsive Sidebar**: Collapsible navigation for mobile
- **Mobile Tables**: Horizontal scrolling for data tables
- **Touch Friendly**: Large buttons and touch targets

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎯 User Experience

### **Navigation**
- **Sidebar Menu**: Persistent navigation with active states
- **Breadcrumbs**: Clear navigation hierarchy
- **Quick Actions**: Fast access to common tasks

### **Feedback**
- **Loading States**: Visual feedback during operations
- **Success Messages**: Confirmation of successful actions
- **Error Handling**: Clear error messages and recovery options

### **Data Management**
- **Search Functionality**: Real-time search across all entities
- **Filtering Options**: Multi-criteria filtering
- **Sorting Capabilities**: Column-based sorting
- **Pagination**: Efficient large dataset handling

## 🧪 Development Features

### **Testing Utilities**
- **Admin Login Helper**: Quick admin access for development
- **Mock Data**: Placeholder data for UI testing
- **Error Simulation**: Test error handling flows

### **Developer Tools**
- **Console Logging**: Detailed operation logging
- **Network Monitoring**: API call tracking
- **State Management**: React state debugging

## 📊 Analytics & Reporting

### **Dashboard Metrics**
- **User Statistics**: Total users by role
- **Course Analytics**: Course and lecture counts
- **Enrollment Tracking**: Student enrollment metrics
- **Activity Monitoring**: Recent system activity

### **Performance Insights**
- **Load Times**: Component rendering performance
- **API Response Times**: Backend performance monitoring
- **User Interactions**: Click tracking and usage patterns

## 🔄 Data Flow

### **State Management**
```bash
1. Component mounts
2. Fetch data from API
3. Update local state
4. Render UI components
5. Handle user interactions
6. Submit changes to API
7. Update state and refresh data
```

### **Authentication Flow**
```bash
1. User enters credentials
2. Validate with backend API
3. Store JWT token
4. Redirect to dashboard
5. Include token in API requests
6. Handle token expiration
7. Logout and clear storage
```

## 🚀 Deployment

### **Build Process**
```bash
# Create production build
npm run build

# Start production server
npm start
```

### **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=EduTube Admin
```

## 🤝 Contributing

### **Code Standards**
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Component Structure**: Consistent file organization
- **TypeScript**: Type safety (future enhancement)

### **Development Workflow**
1. Create feature branch
2. Implement changes
3. Test functionality
4. Submit pull request
5. Code review
6. Merge to main

## 📈 Future Enhancements

### **Planned Features**
- **Advanced Analytics**: Detailed reporting and charts
- **Bulk Operations**: Multi-select actions
- **Export Functionality**: CSV/Excel data export
- **Real-time Updates**: WebSocket integration
- **Mobile App**: React Native companion app

### **Technical Improvements**
- **TypeScript Migration**: Full type safety
- **Testing Suite**: Unit and integration tests
- **Performance Optimization**: Code splitting and lazy loading
- **Accessibility**: WCAG compliance
- **Internationalization**: Multi-language support

## 🆘 Support

### **Documentation**
- **API Documentation**: Backend endpoint reference
- **Component Docs**: React component documentation
- **Troubleshooting**: Common issues and solutions

### **Contact**
- **Development Team**: [Your Contact Information]
- **Issue Reporting**: GitHub Issues
- **Feature Requests**: GitHub Discussions

---

**Made with ❤️ for EduTube Platform**

*Last Updated: August 31, 2025*
