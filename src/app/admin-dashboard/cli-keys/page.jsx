'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';
import AdminLayout from '../../component/AdminLayout';
import { VpnKeyRounded, ContentCopyRounded } from '@mui/icons-material';

export default function CliKeysPage() {
    const router = useRouter();
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [newName, setNewName] = useState('');
    const [newNote, setNewNote] = useState('');
    const [minting, setMinting] = useState(false);
    const [lastMintedKey, setLastMintedKey] = useState(null);

    const fetchKeys = async () => {
        const data = await frontendApi.get('/api/admin/cli-api-keys');
        setKeys(data.keys || []);
    };

    useEffect(() => {
        (async () => {
            try {
                const auth = await frontendApi.verifyAuth();
                if (auth.status !== 200 || auth.role !== 'admin') {
                    toast.error('Access denied');
                    router.push('/login');
                    return;
                }
                setUserName(auth.name || '');
                await fetchKeys();
            } catch {
                toast.error('Please log in');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        })();
    }, [router]);

    const handleMint = async (e) => {
        e.preventDefault();
        if (!newName.trim()) {
            toast.error('Name is required');
            return;
        }
        setMinting(true);
        try {
            const body = { name: newName.trim() };
            if (newNote.trim()) body.note = newNote.trim();
            const data = await frontendApi.post('/api/admin/cli-api-keys', body);
            setLastMintedKey(data);
            setNewName('');
            setNewNote('');
            toast.success('Key created — copy it now; it will not be shown again.');
            await fetchKeys();
        } catch (err) {
            toast.error(err.message || 'Failed to create key');
        } finally {
            setMinting(false);
        }
    };

    const handleRevoke = async (id) => {
        if (!confirm('Revoke this key? CLI clients using it will stop working.')) return;
        try {
            await frontendApi.post(`/api/admin/cli-api-keys/${id}/revoke`, {});
            toast.success('Key revoked');
            await fetchKeys();
        } catch (err) {
            toast.error(err.message || 'Failed to revoke');
        }
    };

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <AdminLayout title="CLI API Keys" userName={userName}>
            <div className="max-w-4xl space-y-8">
                <p className="text-gray-600 text-sm">
                    Keys authenticate the <code className="bg-gray-100 px-1 rounded">edutube-cli</code> tool via{' '}
                    <code className="bg-gray-100 px-1 rounded">X-CLI-API-Key</code>. Store secrets safely; only the
                    prefix is visible after creation.
                </p>

                {lastMintedKey?.api_key && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <p className="font-medium text-amber-900 mb-2">New key (copy now)</p>
                        <div className="flex flex-wrap items-center gap-2">
                            <code className="text-sm break-all flex-1 bg-white p-2 rounded border">{lastMintedKey.api_key}</code>
                            <button
                                type="button"
                                onClick={() => copyText(lastMintedKey.api_key)}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm"
                            >
                                <ContentCopyRounded fontSize="small" /> Copy
                            </button>
                        </div>
                        <button
                            type="button"
                            className="mt-2 text-sm text-gray-600 underline"
                            onClick={() => setLastMintedKey(null)}
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                <form onSubmit={handleMint} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <VpnKeyRounded /> Create key
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. Lab PC 3"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Note (optional)</label>
                        <input
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Internal note"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={minting}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {minting ? 'Creating…' : 'Create key'}
                    </button>
                </form>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">Existing keys</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading…</div>
                    ) : keys.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No keys yet.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prefix</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {keys.map((k) => (
                                    <tr key={k.id}>
                                        <td className="px-6 py-3 text-sm text-gray-900">{k.name}</td>
                                        <td className="px-6 py-3 text-sm font-mono">{k.key_prefix}…</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {k.created_at ? new Date(k.created_at).toLocaleString() : '—'}
                                        </td>
                                        <td className="px-6 py-3 text-sm">
                                            {k.revoked_at ? (
                                                <span className="text-red-600">Revoked</span>
                                            ) : (
                                                <span className="text-green-600">Active</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-right">
                                            {!k.revoked_at && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRevoke(k.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Revoke
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
