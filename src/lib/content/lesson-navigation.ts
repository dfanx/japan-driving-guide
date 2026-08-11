import type { LessonFrontmatter } from "./lesson-schema";

export interface LessonNavigationItem {
  readonly id: string;
  readonly slug: string;
  readonly order: number;
  readonly title: Readonly<{ "zh-TW": string; en: string }>;
}

export const lessonNavigation: readonly LessonNavigationItem[] = Object.freeze([
  { id: "M00-eligibility", slug: "eligibility", order: 0, title: { "zh-TW": "合法駕駛文件", en: "Licence and documents" } },
  { id: "M01-left-side-driving", slug: "left-side-driving", order: 1, title: { "zh-TW": "靠左行駛", en: "Left-side driving" } },
  { id: "M02-signals", slug: "signals", order: 2, title: { "zh-TW": "交通號誌", en: "Traffic signals" } },
  { id: "M03-stop-signs", slug: "stop-signs", order: 3, title: { "zh-TW": "停車再開", en: "Stop signs" } },
  { id: "M04-intersections", slug: "intersections", order: 4, title: { "zh-TW": "路口與轉彎", en: "Intersections and turns" } },
  { id: "M05-pedestrians", slug: "pedestrians", order: 5, title: { "zh-TW": "行人優先", en: "Pedestrians first" } },
  { id: "M06-cyclists", slug: "cyclists", order: 6, title: { "zh-TW": "自行車", en: "Cyclists" } },
  { id: "M07-speed", slug: "speed", order: 7, title: { "zh-TW": "速限", en: "Speed limits" } },
  { id: "M08-rail-crossings", slug: "rail-crossings", order: 8, title: { "zh-TW": "鐵路平交道", en: "Railway crossings" } },
  { id: "M09-signs", slug: "signs", order: 9, title: { "zh-TW": "必要標誌", en: "Essential signs" } },
  { id: "M10-parking", slug: "parking", order: 10, title: { "zh-TW": "停車", en: "Parking" } },
  { id: "M11-expressways", slug: "expressways", order: 11, title: { "zh-TW": "高速公路與 ETC", en: "Expressways and ETC" } },
  { id: "M12-fuel", slug: "fuel", order: 12, title: { "zh-TW": "加油", en: "Fuel" } },
  { id: "M13-weather", slug: "weather", order: 13, title: { "zh-TW": "雨雪與山路", en: "Weather and mountain roads" } },
  { id: "M14-emergency", slug: "emergency", order: 14, title: { "zh-TW": "事故與故障", en: "Accidents and breakdowns" } },
  { id: "M15-safety-basics", slug: "safety-basics", order: 15, title: { "zh-TW": "上路前安全底線", en: "Safety basics" } },
]);

export function getLessonNavigationItem(id: string): LessonNavigationItem {
  const item = lessonNavigation.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Lesson navigation item ${id} is missing`);
  return item;
}

export function assertLessonNavigationMatch(lesson: LessonFrontmatter): void {
  const item = getLessonNavigationItem(lesson.id);
  if (item.order !== lesson.order || item.title[lesson.locale] !== lesson.title) {
    throw new Error(`${lesson.id} navigation metadata does not match its lesson`);
  }
}
