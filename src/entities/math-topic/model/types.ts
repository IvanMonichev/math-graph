export type CategoryId =
  'arithmetic' | 'algebra' | 'geometry' | 'functions' | 'trigonometry' | 'analysis';

export interface MathTopic {
  id: string;
  title: string;
  category: CategoryId;
  description: string;
  formula: string;
  minutes: number;
  prerequisites: string[];
  figure?:
    | 'triangle'
    | 'quadrilateral'
    | 'circle'
    | 'disk'
    | 'square'
    | 'rectangle'
    | 'rhombus'
    | 'parallelogram'
    | 'trapezoid'
    | 'right-triangle';
}

export interface MathEdge {
  source: string;
  target: string;
  type: 'prerequisite' | 'uses' | 'contains' | 'related';
}

export interface Category {
  id: CategoryId;
  title: string;
  symbol: string;
  description: string;
}
