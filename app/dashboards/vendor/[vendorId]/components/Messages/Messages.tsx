'use client';

import { MessageSquare } from 'lucide-react';

export default function Messages() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Messages</h2>
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 border border-gray-200 dark:border-zinc-800 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">No messages</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          Customer messages will appear here
        </p>
      </div>
    </div>
  );
}
