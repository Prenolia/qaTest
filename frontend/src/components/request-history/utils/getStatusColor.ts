export function getStatusColor(status?: number) {
  if (!status) return 'bg-gray-100 text-gray-700'
  if (status >= 200 && status < 300) return 'bg-green-100 text-green-700'
  if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-700'
  if (status >= 500) return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-700'
}