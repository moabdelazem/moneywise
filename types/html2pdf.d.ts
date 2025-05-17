declare module "html2pdf.js" {
  interface Options {
    margin?: number;
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: "portrait" | "landscape";
    };
  }

  interface HTML2PDF {
    set(options: Options): HTML2PDF;
    from(element: HTMLElement): HTML2PDF;
    save(): Promise<void>;
    toPdf(): HTML2PDF;
    get(arg: string): any;
    output(type: string, options?: any): Promise<any>;
  }

  function html2pdf(): HTML2PDF;
  function html2pdf(element: HTMLElement, options?: Options): HTML2PDF;

  export default html2pdf;
}
