import axios from 'axios';

/**
 * Update watch progress for a lecture
 * @param {number} lectureId - The ID of the lecture
 * @param {number} progress - Progress percentage (0-100)
 * @returns {Promise} - Promise that resolves when progress is updated
 */
export const updateWatchProgress = async (lectureId, progress) => {
    try {
        await axios.put('/api/watch-history/progress', {
            lecture_id: lectureId,
            progress: Math.round(progress) // Round to avoid decimal precision issues
        });
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
        const response = await axios.get(`/api/watch-history/getVideoProgress/${lectureId}`);
        return response.data.progress || 0;
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
