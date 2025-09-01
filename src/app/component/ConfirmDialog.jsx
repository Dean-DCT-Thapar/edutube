'use client';
import React from 'react';
import {
    WarningRounded,
    ErrorRounded,
    InfoRounded
} from '@mui/icons-material';

const ConfirmDialog = ({ 
    isOpen, 
    title, 
    message, 
    confirmLabel = 'Confirm', 
    cancelLabel = 'Cancel', 
    onConfirm, 
    onCancel, 
    type = 'warning' 
}) => {
    if (!isOpen) return null;

    const getTypeConfig = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: ErrorRounded,
                    iconColor: 'text-red-600',
                    iconBg: 'bg-red-100',
                    confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                };
            case 'info':
                return {
                    icon: InfoRounded,
                    iconColor: 'text-blue-600',
                    iconBg: 'bg-blue-100',
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                };
            default:
                return {
                    icon: WarningRounded,
                    iconColor: 'text-yellow-600',
                    iconBg: 'bg-yellow-100',
                    confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                };
        }
    };

    const config = getTypeConfig();
    const IconComponent = config.icon;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${config.iconBg} mr-4`}>
                            <IconComponent className={`text-2xl ${config.iconColor}`} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.confirmButton}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
