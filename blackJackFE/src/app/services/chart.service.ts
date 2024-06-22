import { Injectable } from '@angular/core';
import * as d3 from 'd3';
// -----------------------------------------------------------------------------------
// Servizio per la creazione di grafici utilizzando D3.js.
// -----------------------------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class ChartService {

  // COSTRUTTORE --------------------------------------------------------------------------------------------------------
  /**
   * Costruttore del servizio ChartService.
   */
  constructor() { }

  /**
   * Crea un grafico a torta all'interno di un elemento HTML specificato.
   * @param container L'elemento HTML in cui inserire il grafico.
   * @param data I dati da visualizzare nel grafico, come array di oggetti con etichetta e valore.
   * @param width La larghezza del grafico, predefinita a 400.
   * @param height L'altezza del grafico, predefinita a 400.
   */
  createPieChart(container: HTMLElement, data: { label: string; value: number }[], width: number = 400, height: number = 400): void {
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Crea l'elemento SVG e lo posiziona al centro del contenitore
    const svg = d3.select(container).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Crea una funzione per generare i dati del grafico a torta
    const pie = d3.pie<{ label: string, value: number }>().value(d => d.value);

    // Definisce la funzione per generare i percorsi degli archi del grafico a torta
    const arcPath = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    // Aggiunge un gruppo per ogni arco del grafico a torta
    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    // Aggiunge i percorsi degli archi e li anima
    arcs.append('path')
      .attr('fill', (d, i) => color(i.toString()))
      .transition()
      .duration(750)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          const interpolated = i(t); // Risultato dell'interpolazione
          return arcPath(interpolated) || ""; // Assicura di restituire sempre una stringa
        };
      });

    // Aggiunge le etichette ai segmenti del grafico a torta
    arcs.append('text')
      .attr("transform", d => {
        const [x, y] = arcPath.centroid(d);
        return `translate(${x}, ${y})`;
      })
      .attr("text-anchor", "middle")
      .text(d => `${d.data.label}: ${d.data.value}`)
      .style("fill", "black")
      .style("font-weight", "bold")
      .style("font-size", "14px");
  }
}
