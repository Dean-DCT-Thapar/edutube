import { Suspense } from 'react';
import CourseInstancesPage from '../../component/CourseInstancesPage';

function CourseInstancesPageWithSuspense() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CourseInstancesPage />
        </Suspense>
    );
}

export default CourseInstancesPageWithSuspense;
