export function getMethodColor(method?: string) {
  if (!method) return 'bg-gray-100 text-gray-700'
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-blue-100 text-blue-700'
    case 'POST':
      return 'bg-green-100 text-green-700'
    case 'PUT':
      return 'bg-yellow-100 text-yellow-700'
    case 'DELETE':
      return 'bg-red-100 text-red-700'
    case 'PATCH':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}