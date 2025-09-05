import frontendApi from '@/utils/frontendApiClient';

/**
 * Update watch progress for a lecture
 * @param {number} lectureId - The ID of the lecture
 * @param {number} progress - Progress percentage (0-100)
 * @returns {Promise} - Promise that resolves when progress is updated
 */
export const updateWatchProgress = async (lectureId, progress) => {
    try {
        await frontendApi.updateWatchProgress(lectureId, Math.round(progress));
    } catch (error) {
        console.error('Failed to update watch progress:', error);
        // Don't throw error to avoid disrupting video playback
    }
};

/**
 * Get watch progress for a lecture
 * @param {number} lectureId - The ID of the lecture
 * @returns {Promise<number>} - Promise that resolves to progress percentage
 */
export const getWatchProgress = async (lectureId) => {
    try {
        const response = await frontendApi.get(`/api/watch-history/getVideoProgress/${lectureId}`);
        return response.progress || 0;
    } catch (error) {
        console.error('Failed to get watch progress:', error);
        return 0;
    }
};

/**
 * Throttled function to update progress (prevents too many API calls)
 */
let progressUpdateTimeout = null;

export const throttledUpdateProgress = (lectureId, progress) => {
    if (progressUpdateTimeout) {
        clearTimeout(progressUpdateTimeout);
    }
    
    progressUpdateTimeout = setTimeout(() => {
        updateWatchProgress(lectureId, progress);
    }, 2000); // Update every 2 seconds max
};
