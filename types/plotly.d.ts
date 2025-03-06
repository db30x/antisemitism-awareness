declare module 'plotly.js-dist' {
  interface PlotData {
    x: number[];
    y: number[] | string[];
    z: number[];
    mode: string;
    type: string;
    marker: {
      size: number | number[];
      color: string[];
      opacity: number;
    };
    text?: string[];
    hoverinfo?: string;
  }

  interface Layout {
    title?: string;
    autosize?: boolean;
    scene?: {
      camera?: {
        up: { x: number; y: number; z: number };
        center: { x: number; y: number; z: number };
        eye: { x: number; y: number; z: number };
      };
      xaxis?: {
        title: string;
        type: string;
      };
      yaxis?: {
        title: string;
      };
      zaxis?: {
        title: string;
        type: string;
        range?: number[];
      };
    };
    margin?: {
      l: number;
      r: number;
      t: number;
      b: number;
    };
  }

  interface Config {
    responsive?: boolean;
    displayModeBar?: boolean;
  }

  function newPlot(
    element: HTMLElement,
    data: PlotData[],
    layout: Layout,
    config?: Config
  ): Promise<void>;

  export = {
    newPlot
  };
} 