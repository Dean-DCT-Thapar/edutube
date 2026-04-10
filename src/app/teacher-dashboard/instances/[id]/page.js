'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';
import TeacherLayout from '../../../component/TeacherLayout';
import TeacherLectureEditModal from '../../../component/TeacherLectureEditModal';
import TeacherChapterModal from '../../../component/TeacherChapterModal';
import {
    ArrowBackRounded,
    ArrowUpwardRounded,
    ArrowDownwardRounded,
    EditRounded,
    AddRounded,
    BookRounded,
    PlayCircleOutlineRounded,
    PeopleRounded,
    TrendingUpRounded,
    VideoLibraryRounded,
    SwapVertRounded,
    ExpandMoreRounded,
    ExpandLessRounded
} from '@mui/icons-material';

/* ─── helpers ─────────────────────────────────────────────── */
function sortChapters(chapters) {
    return [...(chapters || [])].sort((a, b) => a.number - b.number);
}
function sortLectures(lectures) {
    return [...(lectures || [])].sort((a, b) => a.lecture_number - b.lecture_number);
}
function getYouTubeId(url) {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
}
function moveLectureStepPayload(chaptersSorted, lectureId, chapterId, direction) {
    const chIdx = chaptersSorted.findIndex((c) => c.id === chapterId);
    if (chIdx === -1) return null;
    const list = sortLectures(chaptersSorted[chIdx].lectures);
    const idx = list.findIndex((l) => l.id === lectureId);
    if (idx === -1) return null;
    if (direction === 'up') {
        if (idx > 0) return { target_chapter_id: chapterId, target_lecture_number: idx };
        if (chIdx > 0) return { target_chapter_id: chaptersSorted[chIdx - 1].id };
        return null;
    }
    if (direction === 'down') {
        if (idx < list.length - 1) return { target_chapter_id: chapterId, target_lecture_number: idx + 2 };
        if (chIdx < chaptersSorted.length - 1)
            return { target_chapter_id: chaptersSorted[chIdx + 1].id, target_lecture_number: 1 };
        return null;
    }
    return null;
}

/* ─── main page ───────────────────────────────────────────── */
export default function TeacherInstanceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [userName, setUserName] = useState(null);
    const [data, setData] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionBusy, setActionBusy] = useState(false);
    const [lectureModal, setLectureModal] = useState(null);
    const [chapterModal, setChapterModal] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);
    /* set of chapter ids that are collapsed */
    const [collapsed, setCollapsed] = useState(new Set());

    const toggleCollapsed = (chId) =>
        setCollapsed((prev) => {
            const next = new Set(prev);
            next.has(chId) ? next.delete(chId) : next.add(chId);
            return next;
        });

    const refreshCourse = useCallback(async () => {
        const [chaptersRes, analyticsRes] = await Promise.all([
            frontendApi.get(`/api/teacher/instances/${id}/chapters`),
            frontendApi.get(`/api/teacher/instances/${id}/analytics`)
        ]);
        setData(chaptersRes);
        setAnalytics(analyticsRes?.data ?? null);
    }, [id]);

    useEffect(() => {
        if (!id) return;
        const t = toast.loading('Loading course…', { id: 'teacher-course' });
        frontendApi
            .verifyAuth()
            .then((auth) => {
                if (auth.status !== 200) throw new Error('auth');
                if (auth.role !== 'teacher') { router.push('/dashboard'); throw new Error('role'); }
                setUserName(auth.name);
                return Promise.all([
                    frontendApi.get(`/api/teacher/instances/${id}/chapters`),
                    frontendApi.get(`/api/teacher/instances/${id}/analytics`)
                ]);
            })
            .then(([chaptersRes, analyticsRes]) => {
                setData(chaptersRes);
                setAnalytics(analyticsRes?.data ?? null);
                toast.dismiss(t);
                setLoading(false);
            })
            .catch((err) => {
                toast.dismiss(t);
                if (err.message === 'role') { setLoading(false); return; }
                if (err.status === 404) { notFound(); return; }
                toast.error(err.message || 'Failed to load course', { id: 'teacher-course' });
                router.push('/teacher-dashboard/instances');
                setLoading(false);
            });
    }, [id, router]);

    const runAction = async (fn) => {
        if (actionBusy) return;
        setActionBusy(true);
        try { await fn(); await refreshCourse(); }
        catch (err) { toast.error(err.message || 'Action failed'); }
        finally { setActionBusy(false); }
    };

    const handleChapterReorder = (chapterId, direction) => {
        const ordered = sortChapters(data?.chapters);
        const idx = ordered.findIndex((c) => c.id === chapterId);
        if (idx === -1) return;
        const swap = direction === 'up' ? idx - 1 : idx + 1;
        if (swap < 0 || swap >= ordered.length) return;
        const next = [...ordered];
        [next[idx], next[swap]] = [next[swap], next[idx]];
        runAction(async () => {
            await frontendApi.put('/api/teacher/chapters/reorder', {
                courseInstanceId: parseInt(id, 10),
                chapterOrders: next.map((c, i) => ({ id: c.id, number: i + 1 }))
            });
            toast.success('Chapter order updated');
        });
    };

    const handleLectureMove = (lectureId, chapterId, direction) => {
        const payload = moveLectureStepPayload(sortChapters(data?.chapters), lectureId, chapterId, direction);
        if (!payload) return;
        runAction(async () => {
            await frontendApi.put(`/api/teacher/lectures/${lectureId}/move`, payload);
            toast.success('Lecture moved');
        });
    };

    /* ── skeleton ── */
    if (loading || !data) {
        return (
            <TeacherLayout title="Course" userName={userName}>
                <div className="space-y-6 animate-pulse">
                    <div className="bg-gray-200 h-8 rounded w-1/3" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="bg-gray-200 h-24 rounded-lg" />)}
                    </div>
                    {[1, 2].map((i) => <div key={i} className="bg-gray-200 h-48 rounded-lg" />)}
                </div>
            </TeacherLayout>
        );
    }

    const { instance, chapters } = data;
    const title = instance?.course_template?.name ?? 'Course';
    const courseLabel = [instance?.course_template?.course_code, instance?.instance_name || null]
        .filter(Boolean).join(' · ');
    const chaptersSorted = sortChapters(chapters);

    const statCards = [
        { title: 'Enrolled', value: analytics?.enrollment_count ?? 0, icon: PeopleRounded, bg: 'bg-blue-50', text: 'text-blue-700' },
        { title: 'Active Students', value: analytics?.active_students ?? 0, icon: TrendingUpRounded, bg: 'bg-purple-50', text: 'text-purple-700' },
        { title: 'Chapters', value: analytics?.chapter_count ?? 0, icon: BookRounded, bg: 'bg-orange-50', text: 'text-orange-700' },
        { title: 'Lectures', value: analytics?.lecture_count ?? 0, icon: VideoLibraryRounded, bg: 'bg-green-50', text: 'text-green-700' }
    ];

    return (
        <TeacherLayout title={title} userName={userName}>
            <div className="space-y-6">

                {/* back + header */}
                <div>
                    <Link href="/teacher-dashboard/instances"
                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 mb-4">
                        <ArrowBackRounded className="mr-1 text-base" />
                        Back to My Courses
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                            {courseLabel && <p className="mt-1 text-sm text-gray-600">{courseLabel}</p>}
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button type="button"
                                onClick={() => setShowAnalytics((v) => !v)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                <TrendingUpRounded className="mr-1.5 text-gray-400 text-base" />
                                {showAnalytics ? 'Hide Analytics' : 'Analytics'}
                            </button>
                            <button type="button" disabled={actionBusy}
                                onClick={() => setChapterModal({ mode: 'create' })}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50">
                                <AddRounded className="mr-1.5 text-base" />
                                Add Chapter
                            </button>
                        </div>
                    </div>
                </div>

                {/* stat cards */}
                {analytics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {statCards.map((card) => (
                            <div key={card.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-lg ${card.bg}`}>
                                        <card.icon className={`text-2xl ${card.text}`} />
                                    </div>
                                    <div className="ml-3 min-w-0">
                                        <p className="text-sm font-medium text-gray-600 truncate">{card.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* analytics table */}
                {showAnalytics && analytics?.lectures?.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-base font-semibold text-gray-900">Lecture Analytics</h2>
                            <p className="mt-1 text-xs text-gray-500">Completions = progress ≥ 90%.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Lecture', 'With Progress', 'Avg Progress', 'Completed'].map((h) => (
                                            <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {analytics.lectures.map((row) => (
                                        <tr key={row.lecture_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-gray-900 font-medium">{row.title}</td>
                                            <td className="px-6 py-4 text-gray-700">{row.students_with_progress}</td>
                                            <td className="px-6 py-4 text-gray-700">{row.average_progress}%</td>
                                            <td className="px-6 py-4 text-gray-700">{row.completions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* reorder tip */}
                {chaptersSorted.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center">
                            <SwapVertRounded className="text-blue-600 mr-2 shrink-0" />
                            <p className="text-sm text-blue-800">
                                <strong>Tip:</strong> Use the ↑ ↓ arrows to reorder chapters and lectures.
                                Moving a lecture past the first or last position in its chapter will carry it into
                                the adjacent chapter.
                            </p>
                        </div>
                    </div>
                )}

                {/* chapters */}
                {chaptersSorted.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="text-center py-12">
                            <BookRounded className="mx-auto text-gray-400 mb-4" style={{ fontSize: 48 }} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No chapters yet</h3>
                            <p className="text-gray-600 mb-6">Start building the course by creating your first chapter.</p>
                            <button type="button"
                                onClick={() => setChapterModal({ mode: 'create' })}
                                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                                <AddRounded className="mr-2" />
                                Create First Chapter
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {chaptersSorted.map((ch, chIdx) => {
                            const lecturesSorted = sortLectures(ch.lectures);
                            const isCollapsed = collapsed.has(ch.id);
                            const canUp = chIdx > 0;
                            const canDown = chIdx < chaptersSorted.length - 1;

                            return (
                                <div key={ch.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

                                    {/* chapter header row */}
                                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
                                        {/* left: toggle + info */}
                                        <button type="button"
                                            onClick={() => toggleCollapsed(ch.id)}
                                            className="flex items-center min-w-0 flex-1 text-left group">
                                            {isCollapsed
                                                ? <ExpandMoreRounded className="text-gray-400 mr-3 shrink-0 group-hover:text-gray-600" />
                                                : <ExpandLessRounded className="text-gray-400 mr-3 shrink-0 group-hover:text-gray-600" />}
                                            <BookRounded className="text-primary-600 mr-3 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-gray-500">Chapter {ch.number}</p>
                                                <p className="font-semibold text-gray-900">{ch.name}</p>
                                                {ch.description && (
                                                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">{ch.description}</p>
                                                )}
                                            </div>
                                        </button>

                                        {/* right: count + arrows + edit */}
                                        <div className="flex items-center gap-3 ml-4 shrink-0">
                                            <span className="hidden sm:inline text-xs text-gray-500">
                                                {lecturesSorted.length} {lecturesSorted.length === 1 ? 'lecture' : 'lectures'}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <IconBtn title="Move chapter up" disabled={actionBusy || !canUp}
                                                    onClick={() => handleChapterReorder(ch.id, 'up')}>
                                                    <ArrowUpwardRounded style={{ fontSize: 16 }} />
                                                </IconBtn>
                                                <IconBtn title="Move chapter down" disabled={actionBusy || !canDown}
                                                    onClick={() => handleChapterReorder(ch.id, 'down')}>
                                                    <ArrowDownwardRounded style={{ fontSize: 16 }} />
                                                </IconBtn>
                                                <IconBtn title="Edit chapter" disabled={actionBusy}
                                                    onClick={() => setChapterModal({ mode: 'edit', chapter: ch })}>
                                                    <EditRounded style={{ fontSize: 16 }} />
                                                </IconBtn>
                                            </div>
                                        </div>
                                    </div>

                                    {/* lecture list — collapsible, fixed max height */}
                                    {!isCollapsed && (
                                        <div className="max-h-[520px] overflow-y-auto divide-y divide-gray-100">
                                            {lecturesSorted.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-10 text-center px-6">
                                                    <PlayCircleOutlineRounded className="text-gray-300 mb-2" style={{ fontSize: 36 }} />
                                                    <p className="text-sm text-gray-500">No lectures in this chapter.</p>
                                                </div>
                                            ) : (
                                                lecturesSorted.map((lec) => {
                                                    const ytId = getYouTubeId(lec.youtube_url);
                                                    const thumbSrc = ytId
                                                        ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
                                                        : null;
                                                    const upPayload = moveLectureStepPayload(chaptersSorted, lec.id, ch.id, 'up');
                                                    const downPayload = moveLectureStepPayload(chaptersSorted, lec.id, ch.id, 'down');

                                                    return (
                                                        <div key={lec.id}
                                                            className="flex items-start space-x-4 p-6 hover:shadow-md transition-all">

                                                            {/* arrow controls column */}
                                                            <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                                                                <IconBtn title="Move up" disabled={actionBusy || !upPayload}
                                                                    onClick={() => handleLectureMove(lec.id, ch.id, 'up')}>
                                                                    <ArrowUpwardRounded style={{ fontSize: 16 }} />
                                                                </IconBtn>
                                                                <IconBtn title="Move down" disabled={actionBusy || !downPayload}
                                                                    onClick={() => handleLectureMove(lec.id, ch.id, 'down')}>
                                                                    <ArrowDownwardRounded style={{ fontSize: 16 }} />
                                                                </IconBtn>
                                                            </div>

                                                            {/* thumbnail */}
                                                            <div className="shrink-0">
                                                                {thumbSrc ? (
                                                                    <img src={thumbSrc} alt={lec.title}
                                                                        className="w-32 h-20 object-cover rounded-lg" />
                                                                ) : (
                                                                    <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                        <PlayCircleOutlineRounded className="text-gray-400" style={{ fontSize: 32 }} />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* details */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center mb-1.5">
                                                                            <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded">
                                                                                Lecture {lec.lecture_number}
                                                                            </span>
                                                                        </div>
                                                                        <h4 className="font-semibold text-gray-900">{lec.title}</h4>
                                                                        {lec.description && (
                                                                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                                                                {lec.description}
                                                                            </p>
                                                                        )}
                                                                        {lec.tags?.length > 0 && (
                                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                                {lec.tags.map((t) => (
                                                                                    <span key={t.tag}
                                                                                        className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                                                        #{t.tag}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {lec.youtube_url && (
                                                                            <a href={lec.youtube_url} target="_blank" rel="noopener noreferrer"
                                                                                className="inline-flex items-center mt-2 text-xs text-red-600 hover:text-red-700">
                                                                                <PlayCircleOutlineRounded className="mr-1" style={{ fontSize: 14 }} />
                                                                                Watch
                                                                            </a>
                                                                        )}
                                                                    </div>

                                                                    {/* edit action */}
                                                                    <button type="button"
                                                                        onClick={() => setLectureModal(lec)}
                                                                        className="text-gray-400 hover:text-blue-600 shrink-0 p-1">
                                                                        <EditRounded style={{ fontSize: 20 }} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <TeacherLectureEditModal
                    lecture={lectureModal}
                    courseLabel={courseLabel}
                    isOpen={!!lectureModal}
                    onClose={() => setLectureModal(null)}
                    onSaved={async () => { toast.success('Lecture saved'); await refreshCourse(); }}
                />
                <TeacherChapterModal
                    mode={chapterModal?.mode || 'create'}
                    courseInstanceId={parseInt(id, 10)}
                    courseLabel={courseLabel}
                    chapter={chapterModal?.chapter}
                    isOpen={!!chapterModal}
                    onClose={() => setChapterModal(null)}
                    onSaved={async () => {
                        toast.success(chapterModal?.mode === 'create' ? 'Chapter created' : 'Chapter saved');
                        await refreshCourse();
                    }}
                />
            </div>
        </TeacherLayout>
    );
}

function IconBtn({ children, title, disabled, onClick }) {
    return (
        <button type="button" title={title} disabled={disabled} onClick={onClick}
            className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors">
            {children}
        </button>
    );
}
