import type { MathTopic } from '../src/entities/math-topic/model/types';

export const geometryTopics: MathTopic[] = [
  {
    id: 'point',
    title: 'Точка',
    category: 'geometry',
    description:
      'Точка — основной геометрический объект, обозначающий положение и не имеющий размеров.',
    formula: 'A,\\ B,\\ C',
    minutes: 3,
    prerequisites: [],
  },
  {
    id: 'line',
    title: 'Прямая',
    category: 'geometry',
    description:
      'Прямая — геометрическая линия без изгибов, неограниченно продолжающаяся в обе стороны. Через две различные точки проходит ровно одна прямая.',
    formula: 'a,\\ b',
    minutes: 4,
    prerequisites: ['point'],
  },
  {
    id: 'segment',
    title: 'Отрезок',
    category: 'geometry',
    description:
      'Отрезок — часть прямой, ограниченная двумя точками. Эти точки называются концами отрезка.',
    formula: 'AB=a',
    minutes: 4,
    prerequisites: ['line'],
  },
  {
    id: 'angle',
    title: 'Угол',
    category: 'geometry',
    description:
      'Угол — геометрическая фигура, образованная двумя лучами с общим началом. Общее начало называется вершиной угла.',
    formula: '\\angle ABC=\\alpha',
    minutes: 5,
    prerequisites: ['line'],
  },
  {
    id: 'parallel-lines',
    title: 'Параллельные прямые',
    category: 'geometry',
    description:
      'Параллельные прямые — две различные прямые в одной плоскости, которые не пересекаются.',
    formula: 'a\\parallel b',
    minutes: 5,
    prerequisites: ['line', 'angle'],
  },
  {
    id: 'perpendicular-lines',
    title: 'Перпендикулярные прямые',
    category: 'geometry',
    description: 'Перпендикулярные прямые — прямые, пересекающиеся под прямым углом, равным 90°.',
    formula: 'a\\perp b',
    minutes: 5,
    prerequisites: ['angle'],
  },
  {
    id: 'triangle',
    figure: 'triangle',
    title: 'Треугольник',
    category: 'geometry',
    description:
      'Треугольник — многоугольник, образованный тремя отрезками, соединяющими три точки, не лежащие на одной прямой. Сумма его внутренних углов равна 180°.',
    formula: '\\alpha+\\beta+\\gamma=180^\\circ',
    minutes: 7,
    prerequisites: ['segment', 'angle'],
  },
  {
    id: 'quadrilateral',
    figure: 'quadrilateral',
    title: 'Четырёхугольник',
    category: 'geometry',
    description:
      'Четырёхугольник — многоугольник с четырьмя сторонами и четырьмя вершинами. Сумма внутренних углов простого четырёхугольника равна 360°.',
    formula: '\\alpha+\\beta+\\gamma+\\delta=360^\\circ',
    minutes: 6,
    prerequisites: ['triangle', 'parallel-lines'],
  },
  {
    id: 'circle',
    figure: 'circle',
    title: 'Окружность',
    category: 'geometry',
    description:
      'Окружность — множество точек плоскости, находящихся на одинаковом расстоянии от заданной точки — центра. Это расстояние называется радиусом.',
    formula: 'd=2r,\\quad L=2\\pi r',
    minutes: 6,
    prerequisites: ['point', 'segment'],
  },
  {
    id: 'area',
    title: 'Площадь',
    category: 'geometry',
    description:
      'Площадь — неотрицательная величина, характеризующая размер плоской фигуры. Площадь прямоугольника равна произведению длин его соседних сторон.',
    formula: 'S=ab',
    minutes: 7,
    prerequisites: ['quadrilateral', 'perpendicular-lines'],
  },
  {
    id: 'pythagorean-theorem',
    figure: 'right-triangle',
    title: 'Теорема Пифагора',
    category: 'geometry',
    description:
      'В прямоугольном треугольнике квадрат длины гипотенузы равен сумме квадратов длин катетов.',
    formula: 'c^2=a^2+b^2',
    minutes: 8,
    prerequisites: ['triangle', 'perpendicular-lines', 'powers'],
  },
  {
    id: 'parallelogram',
    title: 'Параллелограмм',
    category: 'geometry',
    description:
      'Параллелограмм — четырёхугольник, у которого противоположные стороны попарно параллельны. Его противоположные стороны и углы равны.',
    formula: 'S=ah',
    minutes: 6,
    prerequisites: ['quadrilateral'],
    figure: 'parallelogram',
  },
  {
    id: 'rectangle',
    title: 'Прямоугольник',
    category: 'geometry',
    description:
      'Прямоугольник — четырёхугольник, у которого все углы прямые. Его противоположные стороны равны, а диагонали равны и делятся точкой пересечения пополам.',
    formula: 'S=ab,\\quad P=2(a+b)',
    minutes: 5,
    prerequisites: ['parallelogram', 'perpendicular-lines'],
    figure: 'rectangle',
  },
  {
    id: 'rhombus',
    title: 'Ромб',
    category: 'geometry',
    description:
      'Ромб — параллелограмм, у которого все стороны равны. Его диагонали перпендикулярны и делятся точкой пересечения пополам.',
    formula: 'S=\\frac{d_1d_2}{2},\\quad P=4a',
    minutes: 6,
    prerequisites: ['parallelogram'],
    figure: 'rhombus',
  },
  {
    id: 'square',
    title: 'Квадрат',
    category: 'geometry',
    description:
      'Квадрат — прямоугольник, у которого все стороны равны. Все четыре угла квадрата прямые. Квадрат одновременно является прямоугольником и ромбом.',
    formula: 'S=a^2,\\quad P=4a',
    minutes: 5,
    prerequisites: ['rectangle', 'rhombus'],
    figure: 'square',
  },
  {
    id: 'trapezoid',
    title: 'Трапеция',
    category: 'geometry',
    description:
      'Трапеция — четырёхугольник, у которого одна пара противоположных сторон параллельна, а другая — нет. Параллельные стороны называются основаниями.',
    formula: 'S=\\frac{a+b}{2}h',
    minutes: 6,
    prerequisites: ['quadrilateral'],
    figure: 'trapezoid',
  },
  {
    id: 'disk',
    title: 'Круг',
    category: 'geometry',
    description:
      'Круг — часть плоскости, ограниченная окружностью, включая саму окружность. Все его точки находятся от центра на расстоянии, не превышающем радиус.',
    formula: 'S=\\pi r^2',
    minutes: 5,
    prerequisites: ['circle', 'area'],
    figure: 'disk',
  },
];
