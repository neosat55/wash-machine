export const statusMap: Record<string, [string, any]> = {
  created: ["Создано", "warning"],
  "in-progress": ["В работе", "success"],
  cancelled: ["Отменено", "danger"],
  completed: ["Выполнено", "success"],
};